/**
 * POST /api/admin/ads/reject
 * Body: { adId: string, reason: string }
 *
 * Rejects a pending ad:
 *   1. Cancels the Stripe subscription (so future invoices stop)
 *   2. Refunds the latest invoice (so the buyer is made whole)
 *   3. Marks the row `rejected` and stores the reason
 *   4. Deletes the uploaded logo from Storage (we won't run it)
 *   5. Emails the advertiser
 *
 * Auth: ADMIN_EMAILS allowlist only.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";
import { notifyAdvertiserRejected } from "@/lib/ads/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REASON = 400;

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  const body = await req.json().catch(() => ({}));
  const adId = String((body as { adId?: string })?.adId ?? "").trim();
  const reason = String((body as { reason?: string })?.reason ?? "").trim();
  if (!adId) return NextResponse.json({ error: "adId required" }, { status: 400 });
  if (!reason || reason.length > MAX_REASON) {
    return NextResponse.json({ error: `Reason must be 1–${MAX_REASON} characters` }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: ad, error } = await supabase
    .from("ad_spots")
    .select("id, status, stripe_subscription_id, logo_path, contact_email, brand_name")
    .eq("id", adId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!ad)   return NextResponse.json({ error: "Ad not found" }, { status: 404 });
  if (ad.status !== "pending_review") {
    return NextResponse.json({ error: `Cannot reject from ${ad.status}` }, { status: 409 });
  }

  const stripe = getStripe();
  let refunded = false;

  if (ad.stripe_subscription_id) {
    try {
      // 1. Find the buyer's first paid InvoicePayment for this subscription.
      //    The new Stripe API exposes payments via the InvoicePayments resource;
      //    we list by subscription's latest_invoice and pick the paid one.
      const sub = await stripe.subscriptions.retrieve(ad.stripe_subscription_id);
      const latestInvoiceId =
        typeof sub.latest_invoice === "string"
          ? sub.latest_invoice
          : sub.latest_invoice?.id;

      if (latestInvoiceId) {
        const invoice = await stripe.invoices.retrieve(latestInvoiceId, {
          expand: ["payments"],
        });
        const paid = invoice.payments?.data?.find(p => p.status === "paid");
        const piRef = paid?.payment?.payment_intent;
        const piId = typeof piRef === "string" ? piRef : piRef?.id ?? null;

        if (piId) {
          await stripe.refunds.create({ payment_intent: piId });
          refunded = true;
        }
      }

      // 2. Cancel the subscription so future invoices stop.
      await stripe.subscriptions.cancel(ad.stripe_subscription_id, {
        invoice_now: false,
        prorate: false,
      });
    } catch (e) {
      console.error("[admin/ads/reject] stripe error", e);
      // Continue — we still want to mark the row rejected and notify. Admin
      // can retry the refund manually from the Stripe Dashboard if it failed.
    }
  }

  // Delete the uploaded logo (we won't run it). Failure is non-fatal.
  if (ad.logo_path) {
    try {
      await supabase.storage.from("ad-logos").remove([ad.logo_path]);
    } catch (e) {
      console.error("[admin/ads/reject] logo cleanup failed", e);
    }
  }

  const { error: upErr } = await supabase
    .from("ad_spots")
    .update({
      status: "rejected",
      rejection_reason: reason,
      reviewed_by: admin.email.toLowerCase(),
      reviewed_at: new Date().toISOString(),
      refunded_at: refunded ? new Date().toISOString() : null,
    })
    .eq("id", adId);

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  if (ad.contact_email) {
    await notifyAdvertiserRejected({
      to: ad.contact_email,
      brandName: ad.brand_name,
      reason,
    });
  }

  return NextResponse.json({ ok: true, refunded });
}
