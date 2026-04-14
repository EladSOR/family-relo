/**
 * Canonical site origin for sitemap, robots, and metadata.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourdomain.com).
 * On Vercel, VERCEL_URL is used when the public URL env is unset.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}
