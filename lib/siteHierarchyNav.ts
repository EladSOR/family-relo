import type { Destination } from "@/lib/types";

export type SiteNavCity = {
  citySlug: string;
  cityName: string;
  href: string;
};

export type SiteNavCountry = {
  countrySlug: string;
  countryName: string;
  cities: SiteNavCity[];
};

export function buildSiteHierarchy(destinations: Destination[]): SiteNavCountry[] {
  const bySlug = new Map<string, { countryName: string; cities: SiteNavCity[] }>();

  for (const d of destinations) {
    let bucket = bySlug.get(d.countrySlug);
    if (!bucket) {
      bucket = { countryName: d.country, cities: [] };
      bySlug.set(d.countrySlug, bucket);
    }
    bucket.cities.push({
      citySlug: d.citySlug,
      cityName: d.city,
      href: `/${d.countrySlug}/${d.citySlug}`,
    });
  }

  return [...bySlug.entries()]
    .map(([countrySlug, { countryName, cities }]) => ({
      countrySlug,
      countryName,
      cities: [...cities].sort((a, b) => a.cityName.localeCompare(b.cityName)),
    }))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));
}
