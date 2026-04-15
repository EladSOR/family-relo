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
      ? `${countryName}: moving abroad with kids — visas, schools, childcare, rent & safety. One family relocation hub.`
      : `${countryName}: ${cityCount} cities for families with kids — visas, schools, childcare, rent & safety. Compare relocation guides.`;
  return clipMetaDescription(raw);
}

export function citySerpTitle(dest: Destination): string {
  return `${dest.city}, ${dest.country}: family relocation — visas, schools & costs | ${SITE_BRAND_NAME}`;
}

/**
 * Meta description: fixed template so length stays predictable; city + country + “kids” + search intents.
 * (Tagline length varies — it is not prepended here to avoid truncation mid-sentence in SERPs.)
 */
export function citySerpDescription(dest: Destination): string {
  const raw = `${dest.city}, ${dest.country}: relocating with kids — visas, schools, rent, childcare, healthcare & safety. Practical guide for families.`;
  return clipMetaDescription(raw);
}
