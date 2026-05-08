/**
 * POST /api/audience/subscribe
 *
 * Adds an email to the Resend Audience for newsletters / launch alerts.
 * Idempotent — Resend silently dedupes existing contacts.
 *
 * Body: { email: string, source?: string }
 *
 * Env required:
 *   RESEND_API_KEY      — server-only Resend API key
 *   RESEND_AUDIENCE_ID  — the Audience UUID from Resend dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const apiKey      = process.env.RESEND_API_KEY;
  const audienceId  = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("[audience/subscribe] Missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const email: string | undefined = body?.email?.trim().toLowerCase();
  const source: string = body?.source ?? "unknown";

  if (!email || !EMAIL_RX.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
      // Use first_name to tag the source for segmentation
      firstName: source,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Subscribe failed";
    // Resend returns a soft error if the contact already exists — treat as success
    if (msg.toLowerCase().includes("already exists")) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[audience/subscribe]", msg);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
