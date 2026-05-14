import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

function getOrigin(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (envUrl) return envUrl;
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return "http://localhost:3000";
  return `${proto}://${host.split(",")[0].trim()}`;
}

/**
 * POST /api/stripe/create-checkout
 * Body: { plan: "single" | "bundle", reportQs: string }
 * reportQs = query string without leading "?" (e.g. cities=a&budget=5000&...)
 */
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as string | undefined;
  const reportQs = typeof body?.reportQs === "string" ? body.reportQs : "";

  if (plan !== "single" && plan !== "bundle") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (!reportQs || reportQs.length > 1800) {
    return NextResponse.json({ error: "Invalid report parameters" }, { status: 400 });
  }

  const priceId =
    plan === "bundle"
      ? process.env.STRIPE_PRICE_BUNDLE
      : process.env.STRIPE_PRICE_SINGLE;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price IDs not configured" }, { status: 503 });
  }

  const origin = getOrigin(req);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // Show every payment method enabled in the Stripe Dashboard that is
    // eligible for this customer's region/currency (cards, Apple Pay,
    // Google Pay, Amazon Pay, Cartes Bancaires, etc.). Stripe Link is
    // disabled at the account level, so it will not appear.
    automatic_payment_methods: { enabled: true },
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/compare/results?${reportQs}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/compare/results?${reportQs}`,
    metadata: {
      supabase_user_id: user.id,
      plan,
      report_qs: reportQs.slice(0, 500),
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "No checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
