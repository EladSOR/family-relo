"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Destination } from "@/lib/types";
import { parseMonthlyCost } from "@/lib/cityCost";

interface Props {
  cities: Destination[];
  /**
   * Optional CSS selector pointing at the wrapper around the destination cards
   * the slider should filter. When omitted, the slider scans the whole document
   * for `[data-city-id]` nodes — fine when a page has a single grid.
   */
  gridSelector?: string;
}

interface CityBound {
  id: string;
  /** Lower bound of the city's typical monthly family budget, in USD */
  min: number;
  /** Upper bound of the city's typical monthly family budget, in USD */
  max: number;
}

const STEP = 250;

function roundUp(n: number, step: number): number {
  return Math.ceil(n / step) * step;
}
function roundDown(n: number, step: number): number {
  return Math.floor(n / step) * step;
}
function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/**
 * Client-side dual-thumb budget slider that filters destination cards by the
 * user-selected monthly family budget range.
 *
 * SEO-safe by design:
 *   - All cards are server-rendered into the DOM.
 *   - This component never adds/removes nodes; it only toggles `display: none`
 *     on existing cards after hydration. Crawlers see the full set.
 *   - No URL state is written, so no duplicate / faceted index pages.
 *
 * Auto-scaling:
 *   - The rail's min/max are derived from `cities[].cost.monthlyFamilyAllIn`,
 *     so adding a more expensive (or cheaper) city to `data/cities.json`
 *     extends the slider automatically with zero code changes.
 *
 * Mobile-first:
 *   - 28px touch targets on mobile, 22px on desktop.
 *   - Both thumbs draggable independently via two overlaid range inputs;
 *     active thumb is lifted to top so they remain grabbable even when close.
 */
export default function BudgetFilter({ cities, gridSelector }: Props) {
  // Parse each city's monthly budget range once. Cities whose strings don't
  // parse are dropped from `bounds` but still render — the filter just leaves
  // them alone (effectively "always visible").
  const bounds = useMemo<CityBound[]>(() => {
    const out: CityBound[] = [];
    for (const c of cities) {
      const parsed = parseMonthlyCost(c.cost?.monthlyFamilyAllIn ?? "");
      if (!parsed) continue;
      out.push({ id: c.id, min: parsed.min, max: parsed.max });
    }
    return out;
  }, [cities]);

  // Rail anchored to the cheapest city's lower bound and the most-expensive
  // city's upper bound. Adding a $15k city tomorrow → rail extends to $15k+
  // on next page load.
  const [sliderMin, sliderMax] = useMemo(() => {
    if (bounds.length === 0) return [2000, 15000];
    const lo = Math.min(...bounds.map((b) => b.min));
    const hi = Math.max(...bounds.map((b) => b.max));
    return [roundDown(lo, 500), roundUp(hi, 500)];
  }, [bounds]);

  // Both thumbs start at the extremes → full range selected → zero cards
  // filtered → first paint matches the SSR HTML perfectly (no flicker).
  const [minBudget, setMinBudget] = useState<number>(sliderMin);
  const [maxBudget, setMaxBudget] = useState<number>(sliderMax);

  // Track the most recently grabbed thumb so we can lift it above the other
  // — without this, the second-rendered max thumb can cover the min thumb when
  // both are dragged close together.
  const [activeThumb, setActiveThumb] = useState<"min" | "max">("max");

  // Cache card nodes once so we don't re-query the DOM on every change.
  const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
  useEffect(() => {
    const root: ParentNode = gridSelector
      ? document.querySelector(gridSelector) ?? document
      : document;
    const next = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>("[data-city-id]").forEach((el) => {
      const id = el.dataset.cityId;
      if (id) next.set(id, el);
    });
    nodesRef.current = next;
  }, [gridSelector]);

  const isFiltering = minBudget > sliderMin || maxBudget < sliderMax;

  // Apply visibility whenever the user's range changes. A city is shown when
  // its typical budget band [min, max] overlaps the user's selected range:
  //   city.min ≤ userMax  AND  city.max ≥ userMin
  useEffect(() => {
    const map = nodesRef.current;
    for (const { id, min, max } of bounds) {
      const el = map.get(id);
      if (!el) continue;
      const overlaps = min <= maxBudget && max >= minBudget;
      el.style.display = isFiltering && !overlaps ? "none" : "";
    }
    return () => {
      // On unmount (route change), restore visibility so navigating back via
      // bfcache doesn't leave cards hidden.
      for (const el of map.values()) el.style.display = "";
    };
  }, [minBudget, maxBudget, bounds, isFiltering]);

  const visibleCount = isFiltering
    ? bounds.filter((b) => b.min <= maxBudget && b.max >= minBudget).length
    : bounds.length;
  const totalCount = bounds.length;

  const span = sliderMax - sliderMin;
  const minPct = span > 0 ? ((minBudget - sliderMin) / span) * 100 : 0;
  const maxPct = span > 0 ? ((maxBudget - sliderMin) / span) * 100 : 100;

  // Clamp so the two thumbs always keep at least one STEP between them — that
  // way the visible fill never collapses to zero width and the inputs can't
  // swap roles by crossing each other.
  const handleMinChange = (v: number) => {
    setMinBudget(Math.min(v, maxBudget - STEP));
    setActiveThumb("min");
  };
  const handleMaxChange = (v: number) => {
    setMaxBudget(Math.max(v, minBudget + STEP));
    setActiveThumb("max");
  };
  const handleReset = () => {
    setMinBudget(sliderMin);
    setMaxBudget(sliderMax);
    setActiveThumb("max");
  };

  if (bounds.length === 0) return null;

  return (
    <section
      aria-label="Filter destinations by monthly family budget range"
      className="mx-auto mb-8 max-w-[1400px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:mb-10 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-slate-900">
          <SlidersHorizontal size={16} strokeWidth={2.5} className="text-[#FF5A5F]" />
          <span className="text-sm font-bold uppercase tracking-widest">
            Filter by budget
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm tabular-nums text-slate-600">
          <span>
            <span className="font-extrabold text-slate-900">{visibleCount}</span>
            <span className="text-slate-400"> / {totalCount} destinations</span>
          </span>
          {isFiltering && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
            >
              <RotateCcw size={12} strokeWidth={2.5} />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Monthly family budget
          </span>
          <span className="text-base font-extrabold tabular-nums text-slate-900 sm:text-lg">
            {isFiltering ? (
              <>
                {formatUsd(minBudget)}
                <span className="text-slate-400"> – </span>
                {formatUsd(maxBudget)}
              </>
            ) : (
              <span className="text-slate-500">Any budget</span>
            )}
            <span className="text-xs font-semibold text-slate-400 sm:text-sm"> / mo</span>
          </span>
        </div>

        {/* Dual-thumb range — two stacked range inputs share the same visual
            track. CSS routes pointer events to each thumb individually so they
            stay independently draggable on touch and desktop. */}
        <div className="relative h-7">
          {/* Background track */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
          {/* Fill between thumbs */}
          <div
            className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#FF5A5F]"
            style={{
              left: `${minPct}%`,
              width: `${Math.max(0, maxPct - minPct)}%`,
            }}
          />
          {/* Both inputs blur on release so Chrome on Mac doesn't treat a
              subsequent trackpad scroll over the focused range as a value
              change instead of a page scroll. */}
          <input
            aria-label="Minimum monthly budget"
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={STEP}
            value={minBudget}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            onMouseDown={() => setActiveThumb("min")}
            onTouchStart={() => setActiveThumb("min")}
            onMouseUp={(e) => e.currentTarget.blur()}
            onTouchEnd={(e) => e.currentTarget.blur()}
            className="dual-thumb absolute inset-0 w-full"
            style={{ zIndex: activeThumb === "min" ? 5 : 4 }}
          />
          <input
            aria-label="Maximum monthly budget"
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={STEP}
            value={maxBudget}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            onMouseDown={() => setActiveThumb("max")}
            onTouchStart={() => setActiveThumb("max")}
            onMouseUp={(e) => e.currentTarget.blur()}
            onTouchEnd={(e) => e.currentTarget.blur()}
            className="dual-thumb absolute inset-0 w-full"
            style={{ zIndex: activeThumb === "max" ? 5 : 4 }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[11px] font-medium tabular-nums text-slate-400">
          <span>{formatUsd(sliderMin)}</span>
          <span>{formatUsd(sliderMax)}</span>
        </div>
      </div>

      {isFiltering && visibleCount === 0 && (
        <p className="mt-4 rounded-xl bg-[#FFF1F1] px-3 py-2.5 text-sm font-medium text-[#B83A3F]">
          No destinations between {formatUsd(minBudget)} and {formatUsd(maxBudget)}/mo. Widen the range.
        </p>
      )}
    </section>
  );
}
