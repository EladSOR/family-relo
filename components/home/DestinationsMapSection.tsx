"use client";

import dynamic from "next/dynamic";
import type { Destination } from "@/lib/types";

/**
 * Lazy-load Leaflet only on the client. Same pattern as `MapToggle` —
 * keeps the JS + CSS chunk out of the initial homepage bundle so the map
 * never blocks the hero / cards.
 */
const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#e8eef3] text-sm font-medium text-slate-500">
      Loading map…
    </div>
  ),
});

interface Props {
  cities: Destination[];
}

/**
 * Inline "Explore by location" map cube on the homepage.
 *
 * Sits between the hero and the destinations grid as a visual
 * complement — not a replacement — for the cards. Scroll-wheel zoom is
 * disabled so it never hijacks page scroll on desktop; touch pinch-zoom
 * and drag-to-pan still work natively. The full-screen pill in the root
 * layout stays available for users who want a bigger view.
 */
export default function DestinationsMapSection({ cities }: Props) {
  return (
    // Sand background flows in from `DestinationsGrid` above — no top
    // padding needed (the grid's `pb-20 md:pb-32` provides the gap).
    // `pb-20 md:pb-32` mirrors the grid so the page closes symmetrically.
    <section className="relative z-0 bg-[#F5EFE8] px-5 pb-20 md:px-8 md:pb-32 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1400px]">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-6 md:mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#FF5A5F]" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
              Explore by location
            </p>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Every destination,
            <span className="text-slate-400"> on one map.</span>
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
            Each pin shows the typical all-in monthly budget for a family of four. Tap a pin to see the full range and open the city guide.
          </p>
        </div>

        {/* ── Inline map cube ────────────────────────────────────────── */}
        {/* Height tuned per breakpoint so the cube feels generous without
            pushing the destination grid below the fold:
              mobile  → 380px (fits comfortably above the keyboard)
              tablet  → 460px
              desktop → 540px (about half a 1080p viewport) */}
        <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.08)] md:h-[460px] lg:h-[540px]">
          <WorldMap
            cities={cities}
            scrollWheelZoom={false}
            fitBoundsMaxZoom={3}
            zoomControl={true}
          />
        </div>

        {/* Helper hint — explains the scroll-wheel choice on desktop and
            the two-finger pan on mobile. Keeps users from feeling stuck. */}
        <p className="mt-3 text-center text-xs font-medium text-slate-400 md:text-sm">
          Use the + / − controls or pinch to zoom · drag to pan
        </p>
      </div>
    </section>
  );
}
