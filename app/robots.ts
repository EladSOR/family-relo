import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";

/**
 * Crawl policy: allow indexing of all public routes.
 * If you add private areas (e.g. /admin, draft previews), add Disallow rules here.
 */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getAbsoluteSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
