/**
 * POST /api/ads/create-checkout
 *
 * Body: {
 *   brandName: string  (≤40 chars)
 *   tagline:   string  (≤120 chars)
 *   clickUrl:  string  (must be https://)
 *   logoUrl:   string  (returned by /api/ads/upload-logo)
 *   logoPath:  string  (storage path, for cleanup on reject)
 * }
 *
 * Validates the form payload, creates a Stripe Checkout session in
 * `subscription` mode against STRIPE_PRICE_AD_SLOT, and returns the URL.
 *
 * The corresponding `ad_spots` row is created in the webhook handler when
 * `customer.subscription.created` fires — this guarantees the row only exists
 * after Stripe confirmed the buyer's payment intent.
 *
 * The position is assigned in the webhook (first free slot among 1/2/3),
 * not here, so concurrent applicants can't double-book the same slot.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/** Total ad slots configured. The render layer (queries.ts) shows 3 cards. */
const MAX_AD_SLOTS = 3;

const MAX_BRAND = 40;
const MAX_TAGLINE = 120;
const MAX_URL = 200;

function isHttpsUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function getOrigin(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (envUrl) return envUrl;
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return "http://localhost:3000";
  return `${proto}://${host.split(",")[0].trim()}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }
  const priceId = process.env.STRIPE_PRICE_AD_SLOT;
  if (!priceId) {
    return NextResponse.json(
      { error: "Ad pricing not configured (STRIPE_PRICE_AD_SLOT missing)" },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const brandName = String(body?.brandName ?? "").trim();
  const tagline = String(body?.tagline ?? "").trim();
  const clickUrl = String(body?.clickUrl ?? "").trim();
  const logoUrl = String(body?.logoUrl ?? "").trim();
  const logoPath = String(body?.logoPath ?? "").trim();

  if (!brandName || brandName.length > MAX_BRAND) {
    return NextResponse.json({ error: `Brand name must be 1–${MAX_BRAND} characters` }, { status: 400 });
  }
  if (!tagline || tagline.length > MAX_TAGLINE) {
    return NextResponse.json({ error: `Tagline must be 1–${MAX_TAGLINE} characters` }, { status: 400 });
  }
  if (!isHttpsUrl(clickUrl) || clickUrl.length > MAX_URL) {
    return NextResponse.json({ error: "Click URL must be a valid http(s) URL" }, { status: 400 });
  }
  if (!logoUrl || !logoPath) {
    return NextResponse.json({ error: "Upload your logo first" }, { status: 400 });
  }

  // ── Capacity guard ───────────────────────────────────────────────────────
  // Refuse to create a checkout session if every slot is already taken
  // (live or pending review). Without this the buyer could pay, the webhook
  // would refund the subscription as oversold, and we'd have a confused user
  // and a Stripe fee we eat. Defense-in-depth: the public open-slot CTA also
  // hides itself in this state, but we don't trust the UI alone.
  try {
    const adminDb = createAdminClient();
    const { count, error: capErr } = await adminDb
      .from("ad_spots")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending_review", "active"]);
    if (capErr) {
      console.warn("[/api/ads/create-checkout] capacity check failed", capErr.message);
    } else if ((count ?? 0) >= MAX_AD_SLOTS) {
      return NextResponse.json(
        {
          error:
            "All ad slots are currently full. Join the waitlist on /advertise " +
            "and we'll email you the moment a slot opens.",
        },
        { status: 409 },
      );
    }
  } catch (e) {
    console.warn("[/api/ads/create-checkout] capacity check threw", e);
    // Fall through — we don't want a transient DB hiccup to block legit
    // applicants. The webhook still has its own oversold-cancel safety net.
  }

  const origin = getOrigin(req);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      // Pass the ad metadata through Checkout → Subscription so the webhook
      // can assemble the ad_spots row from a single source of truth. Stripe
      // copies subscription_data.metadata onto the created Subscription.
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          brand_name: brandName.slice(0, MAX_BRAND),
          tagline: tagline.slice(0, MAX_TAGLINE),
          click_url: clickUrl.slice(0, MAX_URL),
          logo_url: logoUrl.slice(0, 500),
          logo_path: logoPath.slice(0, 500),
          contact_email: user.email ?? "",
        },
      },
      metadata: {
        supabase_user_id: user.id,
        product: "ad_slot",
      },
      // Tax: if Stripe Tax is enabled in dashboard, it will auto-collect VAT.
      automatic_tax: { enabled: true },
      success_url: `${origin}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/advertise?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "No checkout URL" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
