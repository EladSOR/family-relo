"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { DURATION_OPTIONS } from "@/lib/constants";

// v3 prefix: bumped after we changed the dismiss policy so it now only fires
// on the explicit X button, not on the CTA click. The bump clears any stale
// dismiss flags users may have picked up under the old aggressive behaviour.
const DISMISS_KEY_PREFIX = "famirelo_pers_banner_dismissed_v3:";

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

function BannerInner() {
  const params = useSearchParams();
  // Default to dismissed during SSR / first paint to avoid a flash. The
  // sessionStorage check below flips it off when appropriate.
  const [dismissed, setDismissed] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const familyParam = params.get("family");
  const durationParam = params.get("duration");
  const key = dismissKey(familyParam, durationParam);

  // Re-evaluate dismiss state whenever the input combination changes — so a
  // user who tweaks their family or duration gets a fresh banner.
  useEffect(() => {
    setHydrated(true);
    try {
      const flag = sessionStorage.getItem(key);
      setDismissed(Boolean(flag));
    } catch {
      setDismissed(false);
    }
  }, [key]);

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

  return (
    <aside
      role="complementary"
      aria-label="Personalized fit report upgrade"
      className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:mb-8"
    >
      {/* Thin coral accent stripe — same visual language as CompareBanner */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />

      <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:gap-6">
        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A5F]/10 md:h-12 md:w-12">
            <Sparkles size={18} className="text-[#FF5A5F]" />
          </div>
          <div className="md:hidden">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Free to explore
            </p>
            <p className="text-sm font-semibold leading-snug text-slate-900">
              Tap any city for full data — visas, schools, costs.
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="hidden text-xs font-bold uppercase tracking-wider text-slate-500 md:block">
            Free to explore — tap any city for full data
          </p>
          <p className="mt-1 hidden text-base font-semibold text-slate-900 md:block">
            Want each city ranked for{" "}
            <span className="text-[#FF5A5F]">{summary}</span>?
          </p>
          <p className="text-sm leading-relaxed text-slate-600 md:mt-1">
            <span className="md:hidden">
              We&apos;ve saved your setup — <strong>{summary}</strong>. Want each city scored
              against your priorities?{" "}
            </span>
            <span className="hidden md:inline">
              Get a personalized fit report — match scores, budget fit, schools, and visa paths
              weighted to your priorities.{" "}
            </span>
            <span className="font-semibold text-slate-700">
              Launch price · from <span className="font-extrabold">$9</span>{" "}
              <span className="font-bold text-slate-400 line-through">$18</span>
            </span>
            <span className="text-slate-500"> · one-time, no subscription · free preview</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/*
            Note: clicking the CTA does NOT dismiss the banner. Only the
            explicit X dismisses it. Reason: a user who clicks through to
            /compare but doesn't actually buy will navigate back to this
            country page — we want them to still see the offer.
          */}
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e84a4f]"
          >
            See my personalized report
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss — I just want to browse"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
          >
            <X size={16} strokeWidth={2.5} />
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
export default function PersonalizedReportBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  );
}
