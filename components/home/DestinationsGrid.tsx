import type { Destination } from "@/lib/types";
import DestinationCard from "./DestinationCard";

interface Props {
  cities: Destination[];
}

export default function DestinationsGrid({ cities }: Props) {
  return (
    // Warm sand-linen background — premium, travel-inspired, not plain white.
    // z-0 keeps it strictly behind the hero section's search popovers (z-20).
    <section className="relative z-0 bg-[#F5EFE8] px-5 pb-20 pt-12 md:px-8 md:pb-32 md:pt-24 lg:px-12 xl:px-16">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="mx-auto mb-10 max-w-[1400px] md:mb-16">

        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} destinations
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          Explore the world<br className="hidden md:block" />
          <span className="text-slate-400"> with your family.</span>
        </h2>

        {/* Body */}
        <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
          Tap or hover for quick insights — click any city to open the full relocation guide.
        </p>
      </div>

      {/* ── Card grid ──────────────────────────────────────────────────── */}
      {/* gap-8 on all breakpoints for generous breathing room between cards */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cities.map((city) => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </section>
  );
}
