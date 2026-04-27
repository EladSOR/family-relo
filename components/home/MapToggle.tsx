"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon, X } from "lucide-react";
import type { Destination } from "@/lib/types";

interface Props {
  cities: Destination[];
}

/**
 * `next/dynamic` keeps Leaflet (JS + CSS, ~150 KB) out of the initial home
 * bundle — the chunk only loads after the user taps the floating "Show map"
 * pill. `ssr: false` is required because Leaflet touches `window`.
 */
const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#e8eef3] text-sm font-medium text-slate-500">
      Loading map…
    </div>
  ),
});

/**
 * Airbnb-style floating "Show map" pill. Persists across the homepage so the
 * map is always one tap away on desktop and mobile, but never disrupts the
 * existing layout (cards, hero, sticky search).
 *
 *   • Closed:  fixed pill at the bottom-centre of the viewport.
 *   • Open:    fullscreen overlay with the world map and a close button.
 *              ESC also closes; body scroll is locked while the overlay is up.
 */
export default function MapToggle({ cities }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // Lock body scroll while the map overlay is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* ── Floating toggle pill ───────────────────────────────────────────
          Sits above the destination grid and below the desktop sticky search
          (z-[100]) so it never collides with either. Hidden when the overlay
          is open — the overlay has its own close affordance. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Show world map of destinations"
          className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-[0_6px_24px_rgba(15,23,42,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98] md:bottom-7 md:px-6 md:py-3.5 md:text-base"
        >
          <MapIcon size={16} strokeWidth={2.5} />
          <span>Show map</span>
        </button>
      )}

      {/* ── Fullscreen map overlay ────────────────────────────────────────
          z-[110] sits above the desktop sticky header (z-[100]). The map
          fills the viewport so the user can pan/zoom freely. */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Destinations map"
          className="fixed inset-0 z-[110] flex flex-col bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6 md:py-4">
            <div className="min-w-0">
              <p className="text-base font-extrabold tracking-tight text-slate-900 md:text-lg">
                Destinations map
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 md:text-sm">
                Tap a price to open the city guide. Estimated all-in monthly cost · family of 4.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close map"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 md:h-10 md:w-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Map fills the rest of the viewport */}
          <div className="relative flex-1">
            <WorldMap cities={cities} />
          </div>
        </div>
      )}
    </>
  );
}
