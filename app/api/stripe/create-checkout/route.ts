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
 * Body: { plan: "single" | "bundle" | "single_city", reportQs: string, returnPath?: string }
 *   reportQs   — URL query string without leading "?" (e.g. cities=a&budget=5000&...)
 *   returnPath — optional override for where Stripe sends the user after payment.
 *                Used by the single-city paywall when it upsells the $19 bundle:
 *                we still want the user returned to /single-city/results (the report
 *                they were trying to unlock), not the default /compare/results.
 *
 * Default routing by plan when returnPath is NOT set:
 *   - "single" / "bundle" → /compare/results
 *   - "single_city"       → /single-city/results
 */
type Plan = "single" | "bundle" | "single_city";

const PLAN_PRICE_ENV: Record<Plan, string> = {
  single: "STRIPE_PRICE_SINGLE",
  bundle: "STRIPE_PRICE_BUNDLE",
  single_city: "STRIPE_PRICE_SINGLE_CITY",
};

const PLAN_RESULTS_PATH: Record<Plan, string> = {
  single: "/compare/results",
  bundle: "/compare/results",
  single_city: "/single-city/results",
};

// Allowlist for returnPath — never trust client-controlled redirect targets
// unconditionally (open-redirect risk). Stripe Checkout success/cancel URLs
// must point at our own report pages.
const ALLOWED_RETURN_PATHS = new Set<string>([
  "/compare/results",
  "/single-city/results",
]);

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
  const rawReturnPath = typeof body?.returnPath === "string" ? body.returnPath : "";

  if (plan !== "single" && plan !== "bundle" && plan !== "single_city") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (!reportQs || reportQs.length > 1800) {
    return NextResponse.json({ error: "Invalid report parameters" }, { status: 400 });
  }

  const priceId = process.env[PLAN_PRICE_ENV[plan]];
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price IDs not configured" }, { status: 503 });
  }

  const origin = getOrigin(req);
  const stripe = getStripe();
  // Honor returnPath when allowlisted (e.g. bundle upsell from single-city
  // paywall), otherwise fall back to the plan's default results page.
  const resultsPath = ALLOWED_RETURN_PATHS.has(rawReturnPath)
    ? rawReturnPath
    : PLAN_RESULTS_PATH[plan];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // No `payment_method_types` field — Stripe Checkout will surface every
    // method enabled in the Dashboard that is eligible for this customer's
    // region/currency/device (cards, Apple Pay, Google Pay, Amazon Pay,
    // Cartes Bancaires, etc.). Link is disabled at the account level so it
    // will not appear.
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    // Pin receipt_email to the PaymentIntent. This forces Stripe to send a
    // receipt for this purchase (and a refund email later, if refunded)
    // regardless of the dashboard-level "Customer emails" toggle state. Bulletproof.
    payment_intent_data: user.email
      ? { receipt_email: user.email }
      : undefined,
    success_url: `${origin}${resultsPath}?${reportQs}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${resultsPath}?${reportQs}`,
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
