import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

/**
 * GET /api/stripe/verify-session?session_id=cs_...
 * Confirms payment + returns purchase id (after webhook has written the row).
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

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, credits_total, credits_used")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ pending: true }, { status: 202 });
  }

  return NextResponse.json({
    pending: false,
    purchaseId: purchase.id,
    credits_total: purchase.credits_total,
    credits_used: purchase.credits_used,
  });
}
