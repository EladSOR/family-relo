import { headers } from "next/headers";

/**
 * Default public origin for production builds when `NEXT_PUBLIC_SITE_URL` is not set.
 * Canonical / Open Graph use this via `metadataBase` — without it, static HTML was
 * embedding `http://localhost:3000`. Forks or other domains: set `NEXT_PUBLIC_SITE_URL`.
 */
const DEFAULT_PRODUCTION_ORIGIN = "https://famirelo.com";

/**
 * Public site origin for metadata, JSON-LD, sitemap, and robots.
 *
 * Override with `NEXT_PUBLIC_SITE_URL` (e.g. in Vercel) if the site is not served on
 * the default production domain.
 *
 * **`VERCEL_URL` is not used** — it is the deployment hostname (`*.vercel.app`), not
 * your custom domain.
 */

function siteUrlFromHeaders(h: Headers): string | null {
  const rawHost = h.get("x-forwarded-host") ?? h.get("host");
  if (!rawHost) return null;
  const host = rawHost.split(",")[0].trim();
  if (/^localhost(?::\d+)?$/i.test(host) || host.startsWith("127.0.0.1")) return null;
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`.replace(/\/$/, "");
}

/**
 * Preferred for server components and route handlers: respects `NEXT_PUBLIC_SITE_URL`,
 * otherwise the actual request host (so https://famirelo.com/... works without env).
 */
export async function getAbsoluteSiteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  try {
    const h = await headers();
    const fromReq = siteUrlFromHeaders(h);
    if (fromReq) return fromReq;
  } catch {
    // Called outside a request (e.g. some tooling)
  }
  if (process.env.NODE_ENV === "production") {
    return DEFAULT_PRODUCTION_ORIGIN;
  }
  return "http://localhost:3000";
}

/**
 * Sync helper for `metadataBase` and JSON-LD at build time (cannot use request headers).
 * Development: `http://localhost:3000`. Production: env, else `https://famirelo.com`.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    return DEFAULT_PRODUCTION_ORIGIN;
  }
  return "http://localhost:3000";
}
