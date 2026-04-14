import type { MetadataRoute } from "next";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";

/** Resolve URLs from the live request host (e.g. femirelo.com), not the Vercel deployment hostname. */
export const dynamic = "force-dynamic";

function lastReviewedToDate(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const [y, m] = raw.split("-").map((s) => parseInt(s, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m)) return undefined;
  return new Date(y, m - 1, 1);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getAbsoluteSiteUrl();
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

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/destinations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...countryEntries,
    ...cityEntries,
  ];
}
