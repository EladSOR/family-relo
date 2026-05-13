import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook
 * Configure in Stripe Dashboard → Developers → Webhooks:
 *   URL: https://YOUR_DOMAIN/api/stripe/webhook
 *   Events: checkout.session.completed
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

  return NextResponse.json({ received: true });
}
