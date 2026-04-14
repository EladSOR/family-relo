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
// Hardcoded stable Unsplash CDN URLs — no API key required.
// Every city in `data/cities.json` must have a matching key here OR `heroImage` on the record.
// When adding a city, pick a landmark photo on unsplash.com and copy the `images.unsplash.com/photo-…` URL.

export function resolveCityHeroImage(input: {
  city: string;
  heroImage?: string;
}): string {
  if (input.heroImage) return input.heroImage;
  return CITY_IMAGES[input.city] ?? FALLBACK_IMAGE;
}

export const CITY_IMAGES: Record<string, string> = {
  "Valencia":     "https://images.unsplash.com/photo-1754403392652-0edc305bce4b?w=900&q=80",
  "Lisbon":       "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=900&q=80",
  "Dubai":        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
  "Chiang Mai":   "https://images.unsplash.com/photo-1512553353614-82a7370096dc?w=900&q=80",
  "Koh Phangan":  "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=900&q=80",
  "Koh Samui":    "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=900&q=80",
  "Barcelona":    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&q=80",
  "Madrid":       "https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=900&q=80",
  "Porto":        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80",
  "Berlin":       "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&q=80",
  "Amsterdam":    "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=900&q=80",
  "Prague":       "https://images.unsplash.com/photo-1541849546-216549ae216d?w=900&q=80",
  "Budapest":     "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=900&q=80",
  "Bangkok":      "https://images.unsplash.com/photo-1755251042986-91270ffd76f5?w=800&q=80",
  "Phuket":       "https://images.unsplash.com/photo-1601225612316-b4733315a717?w=900&q=80",
  "Athens":       "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&q=80",
  "Malaga":       "https://images.unsplash.com/photo-1765152554171-6cf12086ab9b?w=900&q=80",
  "Abu Dhabi":    "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=900&q=80",
  "Sydney":       "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=900&q=80",
  "Tel Aviv":     "https://images.unsplash.com/photo-1561992022-6d47c991fdd3?w=900&q=80",
  "Melbourne":    "https://images.unsplash.com/photo-1744367624669-d0b275ff4cd2?w=900&q=80",
  "Brisbane":     "https://images.unsplash.com/photo-1548661625-a30d197ce439?w=900&q=80",
  "Auckland":     "https://images.unsplash.com/photo-1762388749660-44eab9b0e323?w=900&q=80",
  "Wellington":   "https://images.unsplash.com/photo-1624589010805-b4e69450ed87?w=900&q=80",
  "Milan":        "https://images.unsplash.com/photo-1664565649460-9452853ab7b6?w=900&q=80",
  "Florence":     "https://images.unsplash.com/photo-1760552697200-377f9f52356f?w=900&q=80",
  "Alicante":     "https://images.unsplash.com/photo-1680537732160-01750bae5217?w=900&q=80",
  "Cascais":      "https://images.unsplash.com/photo-1615672337780-6e19a28a5b39?w=900&q=80",
  "Munich":       "https://images.unsplash.com/photo-1741120026139-8ae0036ebe6d?w=900&q=80",
  "Thessaloniki": "https://images.unsplash.com/photo-1641758136107-6f1364766ccd?w=900&q=80",

  "Paris":          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80",
  "Nice":           "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=80",
  "Warsaw":         "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=80",
  "Krakow":         "https://images.unsplash.com/photo-1757954699070-465653b34697?w=900&q=80",
  "New York City":  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=80",
  "Miami":          "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=900&q=80",
  "Dallas":         "https://images.unsplash.com/photo-1621904878414-d4ca4756bd7e?w=900&q=80",
  "San Jose":       "https://images.unsplash.com/photo-1699385600774-02aec33b3ff7?w=900&q=80",
  "Tamarindo":      "https://images.unsplash.com/photo-1465512585831-856a0bfd5e0b?w=900&q=80",
  "Heredia":        "https://images.unsplash.com/photo-1699385600836-76d37a7de79b?w=900&q=80",
  "Atenas":         "https://images.unsplash.com/photo-1682965738453-558d583ad9ec?w=900&q=80",
  "Puerto Viejo":   "https://images.unsplash.com/photo-1628128590990-47b06054074f?w=900&q=80",
  "Santa Teresa":   "https://images.unsplash.com/photo-1746280372149-9917a641688c?w=900&q=80",
  "Vancouver":      "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&q=80",
  "Toronto":        "https://images.unsplash.com/photo-1543962226-818f4301073f?w=900&q=80",
};

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80";
