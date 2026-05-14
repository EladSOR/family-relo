import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

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
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan;
    if (!userId || (plan !== "single" && plan !== "bundle")) {
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

  // ── charge.refunded → zero out remaining credits on the matching purchase
  // Triggered when YOU refund (manually or via Stripe dispute resolution).
  // We don't delete the row or revoke already-saved comparisons — the user
  // may legitimately need those records — but we prevent any new redeems.
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
        .select("id, credits_total")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (!purchase) {
        console.warn("[stripe webhook] no purchase for refunded session", sessionId);
        return NextResponse.json({ received: true });
      }

      const { error } = await admin
        .from("purchases")
        .update({ credits_used: purchase.credits_total })
        .eq("id", purchase.id);

      if (error) {
        console.error("[stripe webhook] refund credit zero-out failed", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      console.log("[stripe webhook] zeroed credits for refunded purchase", purchase.id);
    } catch (e) {
      console.error("[stripe webhook] charge.refunded", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
