import type { Destination } from "@/lib/types";
import { SITE_BRAND_NAME } from "@/lib/seo/constants";
import { clipMetaDescription } from "@/lib/seo/description";

/**
 * SERP-oriented titles and meta descriptions (CTR: entity + intent + benefit).
 * Google shows one clickable result — the title links to the page; description has no separate link.
 */

export function countrySerpTitle(countryName: string, cityCount: number): string {
  const citiesBit =
    cityCount === 1 ? "1 family-friendly city" : `${cityCount} family-friendly cities`;
  return `${countryName} relocation: ${citiesBit} — visas, schools & costs | ${SITE_BRAND_NAME}`;
}

export function countrySerpOpenGraphTitle(countryName: string, cityCount: number): string {
  const n = cityCount === 1 ? "1 city" : `${cityCount} cities`;
  return `${countryName}: ${n} for families — visas, schools & childcare`;
}

export function countrySerpDescription(countryName: string, cityCount: number): string {
  const raw =
    cityCount === 1
      ? `Relocating to ${countryName} with kids? Visa options, international schools, childcare costs, rent, and safety — one practical hub for parents.`
      : `Compare ${cityCount} family-friendly cities in ${countryName}. Visa paths, school fees, nanny rates, housing, and safety — guides built for relocating families.`;
  return clipMetaDescription(raw);
}

export function citySerpTitle(dest: Destination): string {
  return `${dest.city}, ${dest.country}: family relocation — visas, schools & costs | ${SITE_BRAND_NAME}`;
}

/**
 * Meta description: lead with the city name + intent; tagline first when it fits after clipping.
 */
export function citySerpDescription(dest: Destination): string {
  const raw = `${dest.tagline} See visa routes, international schools, rent, childcare, healthcare, and safety for families in ${dest.city} — practical checklist-style guide.`;
  return clipMetaDescription(raw);
}
