import type { VisaOption } from "@/lib/types";

/**
 * Countries in this app that participate in Schengen short-stay rules for typical visitors.
 * Used to inject a standard "visa-tourist" card when city data omitted it.
 */
export const SCHENGEN_SHORT_STAY_COUNTRY_SLUGS = new Set([
  "spain",
  "portugal",
  "germany",
  "netherlands",
  "czech-republic",
  "hungary",
  "greece",
  "italy",
  "france",
  "poland",
  "austria",
  "denmark",
  "switzerland",
]);

function schengenShortStayOption(cityName: string, countryName: string): VisaOption {
  return {
    type: "Short stay (visit / Schengen)",
    anchor: "visa-tourist",
    detailTitle: `Short stay in ${countryName} — visiting with your family`,
    duration: "Typically up to 90 days in any 180-day period in the Schengen Area",
    description:
      "For travellers who enter without a long-stay national visa (many US, Canadian, UK, Israeli, Australian, and other passport holders): you can usually visit for short trips. Days are counted across the whole Schengen zone together — not per country. This is not a substitute for work permission or long-term residence.",
    details: [
      `The Schengen Area — shared border rules for many European countries, including ${countryName} — usually allows about 90 days within any rolling 180 days for visa-exempt visitors, counted across all Schengen states. Confirm the exact rules for your nationality before you travel.`,
      "Each family member needs a valid passport (children included). The time limit applies per person.",
      "A tourist or visit stay is for tourism and short visits — not for taking local employment. Remote work while on a tourist stay is often legally unclear or restricted; treat official guidance seriously.",
      `Practical use for families: scout ${cityName}, view schools and neighbourhoods, then leave within your allowed stay — or apply for a proper long-stay visa or permit before moving.`,
      "Use the official EU short-stay / calculator guidance (below) when planning consecutive trips — border officers decide entry on each arrival.",
    ],
    officialLink: {
      label: "Schengen short stay 90 180 days rule official EU",
    },
  };
}

/**
 * Prepends a synthetic Schengen short-stay option when the country uses Schengen rules
 * and the city/country visa JSON has no `visa-tourist` anchor yet.
 */
export function mergeVisaOptionsWithShortStay(
  countrySlug: string,
  countryName: string,
  cityName: string,
  options: VisaOption[],
): VisaOption[] {
  const hasTourist = options.some((o) => o.anchor === "visa-tourist");
  if (hasTourist) return options;
  if (!SCHENGEN_SHORT_STAY_COUNTRY_SLUGS.has(countrySlug)) return options;
  return [schengenShortStayOption(cityName, countryName), ...options];
}
