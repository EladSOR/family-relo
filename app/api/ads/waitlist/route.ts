/**
 * POST /api/ads/waitlist
 *
 * Body: { email: string, source?: 'advertise_page' | 'modal' }
 *
 * Stores the email in `public.ad_waitlist` and sends an admin notification
 * via Resend. Anyone can submit (no auth) — anonymous waitlist signup is
 * the entire purpose. Idempotent: same email twice is silently ignored.
 *
 * Returns { ok: true } on success or 4xx with { error } on validation
 * failure. Never returns sensitive data.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminWaitlist } from "@/lib/ads/notify";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = new Set(["advertise_page", "modal"]);

function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return env || "https://famirelo.com";
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const source = String(body?.source ?? "advertise_page");

  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  const cleanSource = VALID_SOURCES.has(source) ? source : "advertise_page";

  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;

  try {
    const admin = createAdminClient();

    // Idempotency: don't insert if already on the list. Also lets us return
    // a friendly "you're already on the list" without leaking emails.
    const { data: existing } = await admin
      .from("ad_waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!existing) {
      const { error } = await admin
        .from("ad_waitlist")
        .insert({ email, source: cleanSource, user_agent: userAgent });
      if (error) {
        console.error("[/api/ads/waitlist] insert failed", error.message);
        return NextResponse.json({ error: "Could not save" }, { status: 500 });
      }

      // Best-effort admin notification — failures are logged, never thrown.
      await notifyAdminWaitlist({
        email,
        source: cleanSource,
        manageUrl: `${siteUrl()}/admin/ads`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/ads/waitlist]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
