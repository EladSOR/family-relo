import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";

/**
 * GET /api/stripe/verify-session?session_id=cs_...
 *
 * Two purposes:
 *   1. Confirms a Stripe Checkout session is paid and belongs to the caller.
 *   2. Returns the matching `purchases` row id, so the client can save the
 *      comparison + show the unlocked report.
 *
 * Webhook fallback: if the row is missing (webhook delayed/failed), this route
 * inserts it on the spot from the trusted Stripe session data using the admin
 * client. Customers paid → customers always get their credits, regardless of
 * webhook reliability.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId?.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  if (session.metadata?.supabase_user_id !== user.id) {
    return NextResponse.json({ error: "Session does not belong to this account" }, { status: 403 });
  }

  // 1. Try the regular path: purchase row already written by the webhook.
  const { data: existing } = await supabase
    .from("purchases")
    .select("id, credits_total, credits_used")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      pending: false,
      purchaseId: existing.id,
      credits_total: existing.credits_total,
      credits_used: existing.credits_used,
    });
  }

  // 2. Webhook fallback. Stripe says paid, metadata matches the caller, but
  //    no purchase row exists. Write it ourselves from the Stripe session.
  const plan = session.metadata?.plan;
  if (plan !== "single" && plan !== "bundle") {
    // Should never happen — but guard anyway. Tell the client to keep polling
    // (in case the webhook arrives in the next second with proper metadata).
    return NextResponse.json({ pending: true }, { status: 202 });
  }

  const creditsTotal = plan === "bundle" ? 3 : 1;
  const admin = createAdminClient();

  // Race-safe: another concurrent verify-session OR the webhook may insert
  // first. Re-check after a short wait, then attempt insert with the same
  // unique key (stripe_session_id) — if a duplicate exists we just read it.
  const { data: justInserted, error: insertErr } = await admin
    .from("purchases")
    .insert({
      user_id: user.id,
      plan,
      credits_total: creditsTotal,
      credits_used: 0,
      stripe_session_id: session.id,
    })
    .select("id, credits_total, credits_used")
    .single();

  if (justInserted) {
    console.warn("[verify-session] webhook fallback wrote purchase", { sessionId });
    return NextResponse.json({
      pending: false,
      purchaseId: justInserted.id,
      credits_total: justInserted.credits_total,
      credits_used: justInserted.credits_used,
    });
  }

  // Insert failed — likely a race where the webhook wrote concurrently.
  // Re-query.
  if (insertErr) {
    const { data: retry } = await admin
      .from("purchases")
      .select("id, credits_total, credits_used")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (retry) {
      return NextResponse.json({
        pending: false,
        purchaseId: retry.id,
        credits_total: retry.credits_total,
        credits_used: retry.credits_used,
      });
    }

    console.error("[verify-session] fallback insert failed", insertErr.message);
  }

  return NextResponse.json({ pending: true }, { status: 202 });
}
