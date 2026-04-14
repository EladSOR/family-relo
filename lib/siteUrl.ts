import { headers } from "next/headers";

/**
 * Public site origin for metadata, JSON-LD, sitemap, and robots.
 *
 * **Production:** set `NEXT_PUBLIC_SITE_URL=https://femirelo.com` in Vercel so
 * metadataBase and OG tags match your domain even at build time.
 *
 * **`VERCEL_URL` is not used** — it is always the deployment hostname (`*.vercel.app`
 * or a preview URL), not your custom domain, so sitemap/robots would point at the wrong host.
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
 * otherwise the actual request host (so https://femirelo.com/... works without env).
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
  return "http://localhost:3000";
}

/**
 * Sync helper for `metadataBase` and any code that cannot await (must not use request headers).
 * Use `NEXT_PUBLIC_SITE_URL` in production builds so canonical/OG URLs are correct.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "http://localhost:3000";
}
