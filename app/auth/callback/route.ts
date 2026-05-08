import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

/**
 * Adds the user to the Resend audience after sign-up / first login.
 * Idempotent: dupes are silently swallowed by Resend.
 * Failure is logged but never blocks the auth flow.
 */
async function addToAudience(email: string) {
  const apiKey     = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return;

  try {
    const resend = new Resend(apiKey);
    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
      firstName: "auth-signup",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.toLowerCase().includes("already exists")) {
      console.error("[auth/callback] addToAudience failed:", msg);
    }
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Best-effort audience sync (never blocks redirect)
      const email = data?.user?.email;
      if (email) await addToAudience(email);

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
