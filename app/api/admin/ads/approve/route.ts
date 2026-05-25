/**
 * POST /api/admin/ads/approve
 * Body: { adId: string }
 *
 * Flips an ad from `pending_review` → `active`. The ad now renders on the site
 * via the public `active_ad_spots` view. Idempotent.
 *
 * Auth: ADMIN_EMAILS allowlist only. Anyone else → 404.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePublicAdPages } from "@/lib/ads/cache";
import { notifyAdvertiserApproved } from "@/lib/ads/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  const body = await req.json().catch(() => ({}));
  const adId = String((body as { adId?: string })?.adId ?? "").trim();
  if (!adId) {
    return NextResponse.json({ error: "adId required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: ad, error } = await supabase
    .from("ad_spots")
    .select("id, status, contact_email, brand_name")
    .eq("id", adId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!ad)   return NextResponse.json({ error: "Ad not found" }, { status: 404 });
  if (ad.status !== "pending_review") {
    return NextResponse.json({ error: `Cannot approve from ${ad.status}` }, { status: 409 });
  }

  const { error: upErr } = await supabase
    .from("ad_spots")
    .update({
      status: "active",
      reviewed_by: admin.email.toLowerCase(),
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", adId);

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  if (ad.contact_email) {
    await notifyAdvertiserApproved({
      to: ad.contact_email,
      brandName: ad.brand_name,
    });
  }

  revalidatePublicAdPages();

  return NextResponse.json({ ok: true });
}
