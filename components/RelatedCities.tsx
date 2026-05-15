import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Destination } from "@/lib/types";
import { resolveCityHeroImage } from "@/lib/constants";

/**
 * "Cities you might also like" — internal-link surface placed near the bottom
 * of every city guide page.
 *
 * Selection logic (deterministic, no randomness so SSR/CSR match):
 *   1. Other cities in the same country (highest signal: same visa/region).
 *   2. Cities in the same continent if same-country < 3.
 *   3. Top picks fallback if still < 3.
 *
 * Always renders 3 cards. Skips itself. Renders nothing if fewer than 1
 * candidate exists.
 */

// Crude continent grouping for the secondary fallback. Doesn't need to be
// exhaustive — only used when there's no same-country sibling left to suggest.
const CONTINENT_BY_COUNTRY_SLUG: Record<string, string> = {
  // EU
  spain: "europe",
  portugal: "europe",
  italy: "europe",
  france: "europe",
  germany: "europe",
  netherlands: "europe",
  ireland: "europe",
  greece: "europe",
  poland: "europe",
  czechia: "europe",
  uk: "europe",
  "united-kingdom": "europe",
  // ME
  uae: "middle-east",
  "united-arab-emirates": "middle-east",
  israel: "middle-east",
  // Asia
  thailand: "asia",
  vietnam: "asia",
  indonesia: "asia",
  malaysia: "asia",
  singapore: "asia",
  japan: "asia",
  taiwan: "asia",
  india: "asia",
  philippines: "asia",
  // Americas
  usa: "americas",
  "united-states": "americas",
  canada: "americas",
  mexico: "americas",
  "costa-rica": "americas",
  panama: "americas",
  colombia: "americas",
  argentina: "americas",
  brazil: "americas",
  chile: "americas",
  // Oceania
  australia: "oceania",
  "new-zealand": "oceania",
};

// Hand-picked top picks — used only as last-resort filler so we always render
// 3 cards. These are commonly-considered family-relocation hubs.
const TOP_PICKS_FALLBACK_IDS = [
  "valencia-es",
  "lisbon-pt",
  "dubai-ae",
  "bangkok-th",
  "porto-pt",
  "barcelona-es",
];

export default function RelatedCities({
  current,
  allCities,
}: {
  current: Destination;
  allCities: Destination[];
}) {
  const candidates = allCities.filter((c) => c.id !== current.id);

  // Pass 1 — same country
  const sameCountry = candidates.filter(
    (c) => c.countrySlug === current.countrySlug,
  );

  // Pass 2 — same continent
  const currentContinent = CONTINENT_BY_COUNTRY_SLUG[current.countrySlug];
  const sameContinent = currentContinent
    ? candidates.filter(
        (c) =>
          c.countrySlug !== current.countrySlug &&
          CONTINENT_BY_COUNTRY_SLUG[c.countrySlug] === currentContinent,
      )
    : [];

  // Pass 3 — top picks (skip already-included + the current city)
  const topPicks = TOP_PICKS_FALLBACK_IDS.map((id) =>
    candidates.find((c) => c.id === id),
  ).filter((x): x is Destination => x != null);

  // Combine in order, dedupe by id, take first 3
  const seen = new Set<string>();
  const merged: Destination[] = [];
  for (const c of [...sameCountry, ...sameContinent, ...topPicks]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    merged.push(c);
    if (merged.length === 3) break;
  }

  if (merged.length === 0) return null;

  return (
    <section
      aria-label={`Other cities to consider after ${current.city}`}
      className="my-10 md:my-12"
    >
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
            Cities you might also like
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Other guides families considering {current.city} often look at next.
          </p>
        </div>
        <Link
          href="/destinations"
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-[#FF5A5F] hover:underline md:inline-flex"
        >
          See all
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {merged.map((c) => {
          const img = resolveCityHeroImage(c);
          const href = `/${c.countrySlug}/${c.citySlug}`;
          return (
            <li key={c.id}>
              <Link
                href={href}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                    <p className="text-sm font-extrabold leading-tight text-white drop-shadow">
                      {c.city}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] font-medium text-white/85">
                      <MapPin size={10} />
                      {c.country}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {c.tagline}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
