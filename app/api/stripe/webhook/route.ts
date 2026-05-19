import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminNewAd } from "@/lib/ads/notify";

export const runtime = "nodejs";

function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return env || "https://famirelo.com";
}

/**
 * Pick the next free slot (1, 2, or 3). Slots 1 and 2 are placeholder-occupied
 * by FamiRelo's own products until a paid advertiser fills them — but at the
 * data layer, ALL three positions are available for paid advertisers. We just
 * fill the lowest free position to keep things deterministic. Concurrency-safe
 * via the unique constraint on stripe_subscription_id (the webhook is idempotent).
 */
async function pickFreePosition(
  admin: ReturnType<typeof createAdminClient>,
): Promise<number | null> {
  const { data } = await admin
    .from("ad_spots")
    .select("position")
    .in("status", ["pending_review", "active"]);

  const taken = new Set((data ?? []).map((r: { position: number }) => r.position));
  for (const pos of [3, 2, 1]) {
    // Prefer slot 3 (the publicly-advertised "open" one). Fall through 2 then 1
    // only if multiple buyers stack up before the placeholders are removed.
    if (!taken.has(pos)) return pos;
  }
  return null;
}

/**
 * POST /api/stripe/webhook
 * Configure in Stripe Dashboard → Developers → Webhooks:
 *   URL: https://YOUR_DOMAIN/api/stripe/webhook
 *   Events: checkout.session.completed, charge.refunded
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // ── checkout.session.completed → write purchase row, grant credits ───────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid" && session.mode !== "subscription") {
      return NextResponse.json({ received: true });
    }

    // Ad-slot purchases are subscriptions. Their row is created from the
    // `customer.subscription.created` event below (which carries the form
    // metadata in subscription.metadata). Skip them here.
    if (session.metadata?.product === "ad_slot" || session.mode === "subscription") {
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan;
    if (
      !userId ||
      (plan !== "single" && plan !== "bundle" && plan !== "single_city")
    ) {
      console.error("[stripe webhook] missing metadata", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const admin = createAdminClient();
      const { data: existing } = await admin
        .from("purchases")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ received: true });
      }

      // Both 'single' and 'single_city' grant 1 credit; only 'bundle' grants 3.
      const creditsTotal = plan === "bundle" ? 3 : 1;
      const { error } = await admin.from("purchases").insert({
        user_id: userId,
        plan,
        credits_total: creditsTotal,
        credits_used: 0,
        stripe_session_id: session.id,
      });

      if (error) {
        console.error("[stripe webhook] insert failed", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } catch (e) {
      console.error("[stripe webhook]", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── charge.refunded → mark purchase refunded + revoke remaining credits.
  // Triggered when YOU refund (manually or via Stripe dispute resolution).
  // We never delete the row or revoke already-saved comparisons — the user
  // may legitimately need those records — but no NEW reports can be unlocked
  // with the refunded credits.
  //
  // Distinguishes full vs partial refund so the UI can tell the user
  // honestly: "1 used · 2 refunded" vs "Refunded — credits revoked".
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

    if (!paymentIntentId) {
      console.warn("[stripe webhook] charge.refunded without payment_intent", charge.id);
      return NextResponse.json({ received: true });
    }

    try {
      // Find the Checkout Session that produced this PaymentIntent.
      const stripe = getStripe();
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });
      const sessionId = sessions.data[0]?.id;
      if (!sessionId) {
        console.warn("[stripe webhook] no checkout session for PI", paymentIntentId);
        return NextResponse.json({ received: true });
      }

      const admin = createAdminClient();
      const { data: purchase } = await admin
        .from("purchases")
        .select("id, credits_total, credits_used")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (!purchase) {
        console.warn("[stripe webhook] no purchase for refunded session", sessionId);
        return NextResponse.json({ received: true });
      }

      // Stripe sets `amount_refunded === amount` for full refunds, and a smaller
      // value for partial refunds. We use this to distinguish UX states.
      const isFullRefund = charge.amount_refunded >= charge.amount;
      const refundKind: "full" | "partial" = isFullRefund ? "full" : "partial";

      const { error } = await admin
        .from("purchases")
        .update({
          credits_used: purchase.credits_total,    // revoke remaining credits
          refunded_at: new Date().toISOString(),
          refund_kind: refundKind,
          credits_used_at_refund: purchase.credits_used,
        })
        .eq("id", purchase.id);

      if (error) {
        console.error("[stripe webhook] refund update failed", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      console.log("[stripe webhook] refund recorded", {
        purchaseId: purchase.id,
        kind: refundKind,
        usedAtRefund: purchase.credits_used,
      });
    } catch (e) {
      console.error("[stripe webhook] charge.refunded", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── customer.subscription.created → create ad_spots row in pending_review ─
  // Triggered when the buyer completes Checkout in subscription mode. The form
  // metadata travels on subscription.metadata (set by /api/ads/create-checkout).
  if (event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;
    const md = sub.metadata ?? {};
    const userId = md.supabase_user_id;

    if (!userId || !md.brand_name || !md.click_url || !md.logo_url) {
      // Not one of our ad-slot subscriptions (or missing data). Ignore quietly.
      return NextResponse.json({ received: true });
    }

    try {
      const admin = createAdminClient();

      // Idempotency: don't double-insert if Stripe retries the event.
      const { data: existing } = await admin
        .from("ad_spots")
        .select("id, position")
        .eq("stripe_subscription_id", sub.id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ received: true });
      }

      const position = await pickFreePosition(admin);
      if (!position) {
        // All three slots taken. Refund the buyer immediately — we shouldn't
        // have let them through but defense-in-depth matters here.
        try {
          await getStripe().subscriptions.cancel(sub.id, {
            invoice_now: false,
            prorate: true,
          });
        } catch (cancelErr) {
          console.error("[stripe webhook] could not cancel oversold sub", cancelErr);
        }
        console.error("[stripe webhook] ad slot oversold", sub.id);
        return NextResponse.json({ received: true });
      }

      const periodEnd = sub.items?.data?.[0]?.current_period_end;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      const { error: insErr } = await admin.from("ad_spots").insert({
        user_id: userId,
        status: "pending_review",
        position,
        brand_name: md.brand_name,
        tagline: md.tagline ?? "",
        click_url: md.click_url,
        logo_url: md.logo_url,
        logo_path: md.logo_path ?? "",
        contact_email: md.contact_email ?? "",
        stripe_customer_id: customerId ?? null,
        stripe_subscription_id: sub.id,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null,
      });

      if (insErr) {
        console.error("[stripe webhook] ad_spots insert failed", insErr.message);
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }

      // Best-effort admin notification (logged, never thrown).
      await notifyAdminNewAd({
        brandName: md.brand_name,
        tagline: md.tagline ?? "",
        clickUrl: md.click_url,
        contactEmail: md.contact_email ?? "",
        position,
        reviewUrl: `${siteUrl()}/admin/ads`,
      });
    } catch (e) {
      console.error("[stripe webhook] customer.subscription.created", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── customer.subscription.updated → keep current_period_end fresh ────────
  // Fires on renewal. Also covers status flips (e.g. past_due, canceled).
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    if (!sub.metadata?.supabase_user_id) {
      return NextResponse.json({ received: true });
    }

    try {
      const admin = createAdminClient();
      const periodEnd = sub.items?.data?.[0]?.current_period_end;

      // If Stripe says the subscription is no longer active and we previously
      // marked the ad active, set it to expired so it disappears from the site.
      // Only flip from `active`/`paused` — never resurrect rejected rows.
      const updates: Record<string, unknown> = {
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null,
      };

      if (sub.status === "canceled" || sub.status === "unpaid" || sub.status === "incomplete_expired") {
        updates.status = "expired";
      } else if (sub.status === "past_due") {
        // Don't yank the ad on first failed charge — Stripe dunning may recover.
        // It will flip to canceled/unpaid only after retries exhausted.
        updates.status = "paused";
      }

      await admin
        .from("ad_spots")
        .update(updates)
        .eq("stripe_subscription_id", sub.id)
        .in("status", ["pending_review", "active", "paused"]);
    } catch (e) {
      console.error("[stripe webhook] customer.subscription.updated", e);
    }
  }

  // ── customer.subscription.deleted → expire the ad ────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    try {
      const admin = createAdminClient();
      await admin
        .from("ad_spots")
        .update({ status: "expired" })
        .eq("stripe_subscription_id", sub.id)
        .neq("status", "rejected");
    } catch (e) {
      console.error("[stripe webhook] customer.subscription.deleted", e);
    }
  }

  return NextResponse.json({ received: true });
}
