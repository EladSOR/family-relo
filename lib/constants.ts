import type { GuestRow } from "./types";

// ── Duration options ──────────────────────────────────────────────────────────

export const DURATION_OPTIONS = [
  { value: "<3", label: "Under 3 Months" },
  { value: "3+", label: "3+ Months"      },
  { value: "6+", label: "6+ Months"      },
  { value: "1+", label: "1+ Years"       },
] as const;

export type DurationValue = (typeof DURATION_OPTIONS)[number]["value"];

// ── Guest counter rows ────────────────────────────────────────────────────────

export const GUEST_ROWS: GuestRow[] = [
  { key: "adults",   label: "Adults",   sub: "Ages 18+"   },
  { key: "infants",  label: "Infants",  sub: "Ages 0–4"   },
  { key: "children", label: "Children", sub: "Ages 5–12"  },
  { key: "teens",    label: "Teens",    sub: "Ages 13–17" },
];

// ── City images ───────────────────────────────────────────────────────────────
// Hardcoded stable Unsplash photo IDs — no API key required.

export const CITY_IMAGES: Record<string, string> = {
  "Valencia":    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  "Lisbon":      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=900&q=80",
  "Dubai":       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
  "Chiang Mai":  "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&q=80",
  "Koh Phangan": "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=900&q=80",
  "Koh Samui":   "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=900&q=80",
};

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80";
