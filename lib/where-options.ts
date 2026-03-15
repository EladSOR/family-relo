import {
  Globe, Building2, Anchor, Mountain, Waves, Umbrella, TreePalm, Sun,
} from "lucide-react";
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

// ── Icon maps ─────────────────────────────────────────────────────────────────

const COUNTRY_ICONS: Record<string, LucideIcon> = {
  spain:    Sun,
  portugal: Anchor,
  uae:      Building2,
  thailand: TreePalm,
};

const CITY_ICONS: Record<string, LucideIcon> = {
  "valencia-es":    TreePalm,
  "lisbon-pt":      Anchor,
  "dubai-ae":       Building2,
  "chiang-mai-th":  Mountain,
  "koh-phangan-th": Waves,
  "koh-samui-th":   Umbrella,
};

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
        Icon: COUNTRY_ICONS[d.countrySlug] ?? Globe,
        type: "country",
      });
    }
  }

  const cityOpts: WhereOption[] = (citiesData as Destination[]).map(d => ({
    value: d.id,
    label: `${d.city}, ${d.country}`,
    href: `/${d.countrySlug}/${d.citySlug}`,
    Icon: CITY_ICONS[d.id] ?? Globe,
    type: "city",
  }));

  return [
    { value: "everywhere", label: "Everywhere", href: "/destinations", Icon: Globe, type: "everywhere" },
    ...countryOpts,
    ...cityOpts,
  ];
}

export const WHERE_OPTIONS = buildWhereOptions();
