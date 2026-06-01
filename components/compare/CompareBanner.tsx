"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { X, ArrowRight, Scale, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";

const DISMISS_KEY = "compare_banner_dismissed_v3"; // bumped — banner now context-aware

const ALL_CITIES = citiesData as Destination[];

/**
 * Subtle floating CTA pill — context-aware between our two paid products.
 *
 * Routing logic (in order):
 *   - /compare/*       or /single-city/*     → hidden (already in product flow)
 *   - /account/*                              → hidden (CTA-heavy surface)
 *   - /:country/:city  (a city guide page)    → "Should we move here?" — $7
 *                                               with the current city pre-selected
 *   - everywhere else (home, destinations,
 *     country index, blog)                    → "Compare cities" — From $9
 *
 * Why: a reader on a city page is focused on ONE place — the natural next
 * step is a single-city report (the cheaper, lower-friction product). A
 * reader on the homepage or destinations grid is browsing — the comparison
 * report is the natural pitch.
 */

type BannerVariant = "single-city" | "compare";

function detectVariant(pathname: string | null): {
  variant: BannerVariant;
  ctaHref: string;
  matchedCity?: Destination;
} {
  if (!pathname) return { variant: "compare", ctaHref: "/compare" };

  // Match /:country/:city against our destination data so we don't
  // mis-fire on /legal/terms, /auth/login, /blog/foo, etc.
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2) {
    const [country, city] = parts;
    const match = ALL_CITIES.find(
      (d) => d.countrySlug === country && d.citySlug === city,
    );
    if (match) {
      return {
        variant: "single-city",
        ctaHref: `/single-city/build?city=${encodeURIComponent(match.id)}`,
        matchedCity: match,
      };
    }
  }

  return { variant: "compare", ctaHref: "/compare" };
}

export default function CompareBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on both product flows (already in funnel) and /account.
  const isHiddenSurface =
    !!pathname &&
    (pathname.startsWith("/compare") ||
      pathname.startsWith("/single-city") ||
      pathname.startsWith("/account"));

  const { variant, ctaHref, matchedCity } = useMemo(
    () => detectVariant(pathname),
    [pathname],
  );

  useEffect(() => {
    if (isHiddenSurface) return;
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) {
        const t = setTimeout(() => setVisible(true), 2500);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available (SSR safety)
    }
  }, [isHiddenSurface]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible || isHiddenSurface) return null;

  const isSingleCity = variant === "single-city";

  return (
    <div
      className="fixed bottom-20 right-4 z-[75] w-72 animate-in fade-in slide-in-from-bottom-4 duration-300 md:bottom-6 md:right-6"
      role="complementary"
      aria-label={
        isSingleCity
          ? `Personalized ${matchedCity?.city ?? "city"} fit report`
          : "Personalized city comparison"
      }
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="h-1 bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        <div className="p-4">
          <div className="mb-2 flex items-center gap-2.5 pr-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
              {isSingleCity ? (
                <MapPin size={15} className="text-[#FF5A5F]" />
              ) : (
                <Scale size={15} className="text-[#FF5A5F]" />
              )}
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-900">
                {isSingleCity
                  ? `Should you move to ${matchedCity?.city ?? "this city"}?`
                  : "Compare cities for your family"}
              </p>
              <p className="flex flex-wrap items-baseline gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF5A5F]">
                <span>Launch price{isSingleCity ? "" : " · from"}</span>
                <span className="text-xs font-extrabold normal-case tracking-normal">
                  ${isSingleCity ? "7" : "9"}
                </span>
                <span className="text-xs font-bold normal-case tracking-normal text-[#FF5A5F]/50 line-through">
                  ${isSingleCity ? "14" : "18"}
                </span>
                <span>· pay once</span>
              </p>
            </div>
          </div>

          <p className="mb-3.5 text-xs leading-relaxed text-slate-500">
            {isSingleCity
              ? "Personalized verdict, visa paths ranked for your profile, and a 90-day pre-arrival checklist — yours forever."
              : "Match scores, budget fit, schools & visa paths — weighted to your priorities."}
          </p>

          <Link
            href={ctaHref}
            onClick={dismiss}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#e84a4f]"
          >
            {isSingleCity ? "Get the report" : "Try it now"}
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
