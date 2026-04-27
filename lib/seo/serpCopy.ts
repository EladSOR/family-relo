import type { Destination } from "@/lib/types";
import { SITE_SERP_TITLE_BRAND } from "@/lib/seo/constants";
import { clipMetaDescription, META_DESCRIPTION_MAX } from "@/lib/seo/description";
import { fitSerpTitle } from "@/lib/seo/serpTitle";

/**
 * SERP titles & descriptions — evergreen (no city counts), family + relocation intent, ≤70 title chars.
 * @see `.cursor/rules/serp-metadata.mdc`
 */

const TITLE_SUFFIX = ` | ${SITE_SERP_TITLE_BRAND}`;
const TITLE_MAX = 70;
/** Meta `<description>` hard cap — must still read as **finished sentences** (verify longest place names in data). */
const DESC_MAX = META_DESCRIPTION_MAX;

// ── Country hub (`/[country]`) ───────────────────────────────────────────────

export function countrySerpTitle(countryName: string): string {
  const candidates = [
    `${countryName}: family relocation — visas, schools & costs`,
    `${countryName}: family relocation — visas & schools`,
    `${countryName}: moving with kids — visas, schools & costs`,
    `${countryName}: family move — visas, schools & childcare`,
    `${countryName}: family visas, schools & childcare`,
    `${countryName}: relocate with kids — visas & schools`,
  ];
  for (const core of candidates) {
    if (core.length + TITLE_SUFFIX.length <= TITLE_MAX) return `${core}${TITLE_SUFFIX}`;
  }
  return fitSerpTitle(candidates[candidates.length - 1]!, TITLE_SUFFIX, TITLE_MAX);
}

export function countrySerpDescription(countryName: string): string {
  /**
   * Full sentences only — keep ≤ `META_DESCRIPTION_MAX` with longest country name in `data/cities.json`.
   * `clipMetaDescription` only if data exceeds the limit; it does not append `…` (see `serp-metadata.mdc`).
   */
  const body =
    "Family relocation for parents and kids. Visas, international schools, childcare, housing and healthcare. Read before you move.";
  const raw = `${countryName}: ${body}`.trim().replace(/\s+/g, " ");
  if (raw.length > DESC_MAX) return clipMetaDescription(raw, DESC_MAX);
  return raw;
}

// ── City guide (`/[country]/[city]`) ─────────────────────────────────────────

export function citySerpTitle(dest: Destination): string {
  const { city, country } = dest;
  const candidates = [
    `${city}, ${country}: family relocation — visas & schools`,
    `${city}, ${country}: move with kids — visas & schools`,
    `${city}, ${country}: visas, schools & childcare`,
    `${city}, ${country} — family relocation guide`,
    `${city}: family move — visas & schools (${country})`,
  ];
  for (const core of candidates) {
    if (core.length + TITLE_SUFFIX.length <= TITLE_MAX) return `${core}${TITLE_SUFFIX}`;
  }
  return fitSerpTitle(candidates[candidates.length - 1]!, TITLE_SUFFIX, TITLE_MAX);
}

export function citySerpDescription(dest: Destination): string {
  const { city, country } = dest;
  /** Prefer ≤ `META_DESCRIPTION_MAX` with longest `city, country` in `data/cities.json` (verify after edits). */
  const body =
    "Family relocation for parents with kids: visas, schools, childcare, rent, healthcare and safety. Plan each step before you move abroad.";
  const raw = `${city}, ${country}: ${body}`.trim().replace(/\s+/g, " ");
  if (raw.length > DESC_MAX) return clipMetaDescription(raw, DESC_MAX);
  return raw;
}
