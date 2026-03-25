import { Globe, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { Destination } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OptionType = "everywhere" | "country" | "city";

export interface WhereOption {
  value: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  type: OptionType;
}

// One consistent icon per type: Globe for countries, MapPin for cities.
const COUNTRY_ICON: LucideIcon = Globe;
const CITY_ICON:    LucideIcon = MapPin;

// ── Builder ───────────────────────────────────────────────────────────────────

function buildWhereOptions(): WhereOption[] {
  const seen = new Set<string>();
  const countryOpts: WhereOption[] = [];

  for (const d of citiesData as Destination[]) {
    if (!seen.has(d.countrySlug)) {
      seen.add(d.countrySlug);
      countryOpts.push({
        value: d.countrySlug,
        label: d.country,
        href: `/${d.countrySlug}`,
        Icon: COUNTRY_ICON,
        type: "country",
      });
    }
  }

  const cityOpts: WhereOption[] = (citiesData as Destination[]).map(d => ({
    value: d.id,
    label: `${d.city}, ${d.country}`,
    href: `/${d.countrySlug}/${d.citySlug}`,
    Icon: CITY_ICON,
    type: "city",
  }));

  return [
    { value: "everywhere", label: "Everywhere", href: "/destinations", Icon: Globe, type: "everywhere" },
    ...countryOpts,
    ...cityOpts,
  ];
}

export const WHERE_OPTIONS = buildWhereOptions();
