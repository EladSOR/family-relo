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
  "Valencia":    "https://images.unsplash.com/photo-1754403392652-0edc305bce4b?w=900&q=80",
  "Lisbon":      "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=900&q=80",
  "Dubai":       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
  "Chiang Mai":  "https://images.unsplash.com/photo-1512553353614-82a7370096dc?w=900&q=80",
  "Koh Phangan": "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=900&q=80",
  "Koh Samui":   "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=900&q=80",
  "Barcelona":   "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&q=80",
  "Madrid":      "https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=900&q=80",
  "Porto":       "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80",
  "Berlin":      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&q=80",
  "Amsterdam":   "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=900&q=80",
  "Prague":      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=900&q=80",
  "Budapest":    "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=900&q=80",
  "Bangkok":     "https://images.unsplash.com/photo-1755251042986-91270ffd76f5?w=800&q=80",
  "Phuket":      "https://images.unsplash.com/photo-1601225612316-b4733315a717?w=900&q=80",
  "Athens":      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&q=80",
  "Malaga":      "https://images.unsplash.com/photo-1765152554171-6cf12086ab9b?w=900&q=80",
  "Abu Dhabi":   "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=900&q=80",
  "Sydney":      "https://images.unsplash.com/photo-1759234895763-5343cf59a4bd?w=900&q=80",
  "Tel Aviv":    "https://images.unsplash.com/photo-1561992022-6d47c991fdd3?w=900&q=80",
};

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80";
