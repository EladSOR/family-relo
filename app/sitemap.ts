import type { MetadataRoute } from "next";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { BLOG_POSTS } from "@/lib/blog/registry";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Static at build time: avoids a function invocation per bot fetch.
 * Site URL resolves from `NEXT_PUBLIC_SITE_URL` or `https://famirelo.com` (see siteUrl.ts).
 */
export const dynamic = "force-static";

function lastReviewedToDate(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const [y, m] = raw.split("-").map((s) => parseInt(s, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m)) return undefined;
  return new Date(y, m - 1, 1);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const cities = citiesData as Destination[];
  const now = new Date();

  const countrySlugs = [...new Set(cities.map((d) => d.countrySlug))];

  const countryEntries: MetadataRoute.Sitemap = countrySlugs.map((slug) => {
    const inCountry = cities.filter((d) => d.countrySlug === slug);
    const dates = inCountry
      .map((d) => lastReviewedToDate(d.lastReviewed))
      .filter((d): d is Date => d != null);
    const lastModified =
      dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : now;

    return {
      url: `${base}/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const cityEntries: MetadataRoute.Sitemap = cities.map((d) => ({
    url: `${base}/${d.countrySlug}/${d.citySlug}`,
    lastModified: lastReviewedToDate(d.lastReviewed) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // Marketing landing for the paid comparison product. High priority so
      // crawlers prioritise it — it was previously missing from the sitemap,
      // which throttled GSC/Bing discovery despite the page being indexable.
      url: `${base}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      // Marketing landing for the $7 single-city "Should we move here?" report.
      // Same priority tier as /compare — these are the two paid product pages.
      url: `${base}/single-city`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogIndex,
    ...blogPosts,
    ...countryEntries,
    ...cityEntries,
  ];
}
