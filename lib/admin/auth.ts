/**
 * Email-allowlist admin auth for V1.
 *
 * Source of truth: `ADMIN_EMAILS` env var, comma-separated.
 *   ADMIN_EMAILS=elad@sortino.io,info@eladshlev.com
 *
 * Why env vars (and not a DB table) for V1: zero schema changes, can't be
 * accidentally broken from the dashboard, and we don't have a second editor
 * yet. When a real role system is needed (V2), this helper is the only
 * place that has to change — every route/page calls `requireAdmin()`.
 */

import { createClient } from "@/lib/supabase/server";

export function getAllowedAdmins(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedAdmins().includes(email.toLowerCase());
}

/**
 * Resolve the current admin user. Returns the email when authorised, or
 * `null` when not. Callers in server components should `notFound()` on null
 * — never redirect, so we don't leak that the admin surface exists.
 */
export async function getAdminUser(): Promise<{ email: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  if (!isAdminEmail(user.email)) return null;
  return { email: user.email };
}
