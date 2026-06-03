"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, X, ArrowRight, Check } from "lucide-react";
import { DURATION_OPTIONS } from "@/lib/constants";

// v3 prefix: bumped after we changed the dismiss policy so it now only fires
// on the explicit X button, not on the CTA click. The bump clears any stale
// dismiss flags users may have picked up under the old aggressive behaviour.
const DISMISS_KEY_PREFIX = "famirelo_pers_banner_dismissed_v3:";

// Matches the SearchBar's persistence key in components/home/SearchBar.tsx —
// the SearchBar saves the user's confirmed family/duration/where here so the
// signal survives clean-URL navigation (e.g. user searches Beer Sheva, then
// clicks Tel Aviv via a normal link with no query params). We must read the
// same source of truth so the banner stays consistent.
const SEARCH_STORAGE_KEY = "familyrelo_search";

type StoredSearch = { where: string; family: string; duration: string };

function readStoredSearch(): StoredSearch | null {
  try {
    const raw = localStorage.getItem(SEARCH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSearch> | null;
    if (
      !parsed ||
      typeof parsed.family !== "string" ||
      typeof parsed.duration !== "string"
    ) {
      return null;
    }
    return {
      where: typeof parsed.where === "string" ? parsed.where : "",
      family: parsed.family,
      duration: parsed.duration,
    };
  } catch {
    return null;
  }
}

/**
 * Build the per-input-combination dismiss key. Different family/duration
 * combinations get separate dismiss flags so when a user changes their setup,
 * they see the banner again. (We don't want users to silently miss the
 * personalized option when they re-engage the personalization signal.)
 */
function dismissKey(family: string | null, duration: string | null): string {
  return `${DISMISS_KEY_PREFIX}${family ?? "_"}|${duration ?? "_"}`;
}

type ParsedFamily = {
  adults: number;
  totalKids: number;
};

/**
 * Parse the SearchBar's `family=adults-children-infants-teens` URL param.
 * Returns null when no value is set OR when it matches the default
 * (1 adult, 0 kids) — we only show the banner if the user actually engaged.
 */
function parseFamily(param: string | null): ParsedFamily | null {
  if (!param) return null;
  const parts = param.split("-").map((n) => Number(n));
  if (parts.length !== 4 || parts.some(Number.isNaN)) return null;
  const [adults, children, infants, teens] = parts;
  if (adults < 1) return null;
  const totalKids = children + infants + teens;
  if (adults <= 1 && totalKids === 0) return null;
  return { adults, totalKids };
}

function durationLabel(value: string | null): string | null {
  if (!value) return null;
  const match = DURATION_OPTIONS.find((o) => o.value === value);
  return match?.label ?? null;
}

function describeFamily(f: ParsedFamily): string {
  const adultsText = `${f.adults} adult${f.adults > 1 ? "s" : ""}`;
  if (f.totalKids === 0) return adultsText;
  const kidsText = `${f.totalKids} kid${f.totalKids > 1 ? "s" : ""}`;
  return `${adultsText}, ${kidsText}`;
}

type SingleCityContext = { cityId: string; cityName: string };

function BannerInner({ singleCity }: { singleCity?: SingleCityContext }) {
  const params = useSearchParams();
  const pathname = usePathname();
  // Default to dismissed during SSR / first paint to avoid a flash. The
  // sessionStorage check below flips it off when appropriate.
  const [dismissed, setDismissed] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  // localStorage fallback: when the user navigates from page to page via
  // normal links (clean URLs, no ?family= params), URL params are gone but
  // the SearchBar's stored setup is still meaningful. We read it lazily after
  // hydration so SSR stays consistent.
  const [stored, setStored] = useState<StoredSearch | null>(null);

  const urlFamily = params.get("family");
  const urlDuration = params.get("duration");

  // Effective signal — URL params win, but fall back to whatever the user
  // last confirmed in the SearchBar (kept in localStorage).
  const familyParam = urlFamily ?? stored?.family ?? null;
  const durationParam = urlDuration ?? stored?.duration ?? null;

  // Per-page dismiss key — the single-city banner and the country/destinations
  // banner are distinct surfaces and dismissing one should not silence the
  // other. The cityId namespaces them apart.
  const key = `${dismissKey(familyParam, durationParam)}|${singleCity?.cityId ?? "_"}`;

  // Mount + path-change effect: refresh both the dismiss flag AND the stored
  // search state. Pathname is in the dep array so when the user navigates
  // between city pages, we re-read localStorage in case the SearchBar wrote
  // an updated setup in the meantime.
  useEffect(() => {
    setHydrated(true);
    setStored(readStoredSearch());
    try {
      const flag = sessionStorage.getItem(key);
      setDismissed(Boolean(flag));
    } catch {
      setDismissed(false);
    }
  }, [key, pathname]);

  const family = parseFamily(familyParam);
  const duration = durationLabel(durationParam);

  // Only render when the user actually set family or duration above defaults.
  const hasSignal = Boolean(family || duration);
  if (!hydrated || dismissed || !hasSignal) return null;

  const summary = [family ? describeFamily(family) : null, duration ? `${duration} stay` : null]
    .filter(Boolean)
    .join(" · ");

  function handleDismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — accept that dismiss won't persist.
    }
  }

  // Content varies by context:
  //   - Country / destinations pages → "rank EACH city" → /compare → from $9
  //   - Individual city guide pages  → "rank THIS city" → /single-city/build → from $7
  // The framing must match the user's mental model: on a city page they're
  // not shopping for cities, they're deciding about ONE — so promoting the
  // $19 comparison there feels like a non-sequitur.
  const isSingleCity = !!singleCity;
  const ctaHref = isSingleCity
    ? `/single-city/build?city=${encodeURIComponent(singleCity!.cityId)}`
    : "/compare";

  // Content varies by context:
  //   - Country / destinations pages → rank EACH city → /compare → from $9
  //   - Individual city guide pages  → rank THIS city → /single-city → from $7
  // Both eyebrows make the connection between the user's saved search and
  // the offer explicit — "this is YOUR personalized result, here's how to
  // unlock it." Without that framing the banner feels like a generic upsell.
  const eyebrow = isSingleCity
    ? "Based on your saved search · your personalized report"
    : "Based on your saved search · your personalized report";
  const headline = isSingleCity ? (
    <>
      Want <span className="font-extrabold text-[#FF5A5F]">{singleCity!.cityName}</span>{" "}
      scored for{" "}
      <span className="font-extrabold text-slate-900">{summary}</span>?
    </>
  ) : (
    <>
      Want each city ranked for{" "}
      <span className="font-extrabold text-slate-900">{summary}</span>?
    </>
  );
  const inclusions = isSingleCity
    ? [
        "Match score for your family",
        "Visa paths ranked for you",
        "Budget reality check",
        "90-day pre-arrival checklist",
      ]
    : [
        "Match score per city",
        "Budget fit for your family",
        "Schools & visa paths ranked",
        "Side-by-side, shareable + PDF",
      ];
  const priceFrom = isSingleCity ? "$7" : "$9";
  const priceStruck = isSingleCity ? "$14" : "$18";
  const ctaLabel = isSingleCity
    ? `See my ${singleCity!.cityName} report`
    : "See my personalized report";

  return (
    <aside
      role="complementary"
      aria-label="Personalized fit report upgrade"
      className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:mb-8"
    >
      {/* Coral accent stripe — visual link to our other paid-product surfaces */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />

      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-stretch md:gap-6 md:p-6">
        {/* Left column: icon + eyebrow + headline + value bullets */}
        <div className="flex flex-1 gap-3 md:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10 md:h-11 md:w-11">
            <Sparkles size={17} className="text-[#FF5A5F]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
              {eyebrow}
            </p>
            <p className="text-base font-extrabold leading-snug text-slate-900 md:text-lg">
              {headline}
            </p>
            {/* Concrete deliverables — answers "what is scoring and what do I get?" */}
            <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-xs text-slate-600 sm:grid-cols-2 md:text-[13px]">
              {inclusions.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="mt-0.5 shrink-0 text-[#FF5A5F]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500 md:text-xs">
              <span className="font-semibold text-slate-700">
                Launch price · {priceFrom}
              </span>{" "}
              <span className="font-bold text-slate-400 line-through">{priceStruck}</span>{" "}
              · one-time, no subscription · free preview before paying
            </p>
          </div>
        </div>

        {/* Right column: CTA + dismiss
          Note: clicking the CTA does NOT dismiss the banner. Only the explicit
          X does. A user who clicks through but doesn't buy will navigate back
          to this page — we want them to still see the offer. */}
        <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-stretch md:justify-center md:gap-3">
          <Link
            href={ctaHref}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e84a4f] md:flex-none md:whitespace-nowrap"
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss — I just want to browse"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 md:h-9 md:w-full"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * Inline banner shown above the destinations grid AFTER the user fills out
 * the hero search bar (family / duration). Echoes their inputs back to make
 * the connection between the form and the paid report explicit.
 *
 * Design rules (see `.cursor/rules` discussion):
 *  - Free browsing stays open — banner is dismissible, not blocking.
 *  - Calm slate visual; only the CTA button uses brand red.
 *  - Mirrors the user's family / duration so the form feels real.
 *  - sessionStorage dismiss → won't re-pop in the same browsing session.
 *
 * Wraps the inner component in `<Suspense>` because `useSearchParams` requires
 * one in app-router pages.
 */
export default function PersonalizedReportBanner({
  singleCity,
}: {
  /**
   * When set, the banner promotes the $7 single-city report for this specific
   * city instead of the $9 multi-city comparison. Pass on /[country]/[city]
   * pages so users who set family/duration get a contextually correct offer.
   */
  singleCity?: SingleCityContext;
} = {}) {
  return (
    <Suspense fallback={null}>
      <BannerInner singleCity={singleCity} />
    </Suspense>
  );
}
