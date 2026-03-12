import type { Destination } from "@/lib/types";
import DestinationCard from "./DestinationCard";

interface Props {
  cities: Destination[];
}

export default function DestinationsGrid({ cities }: Props) {
  return (
    // Warm sand-linen background — premium, travel-inspired, not plain white.
    // z-0 keeps it strictly behind the hero section's search popovers (z-20).
    <section className="relative z-0 bg-[#F5EFE8] px-5 pb-32 pt-24 md:px-8">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="mx-auto mb-16 max-w-6xl">

        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} destinations
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          Explore the world<br className="hidden md:block" />
          <span className="text-slate-400"> with your family.</span>
        </h2>

        {/* Body */}
        <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
          Every city is hand-picked for safety, schools, and childcare costs.
          Hover any card to see the key numbers.
        </p>
      </div>

      {/* ── Card grid ──────────────────────────────────────────────────── */}
      {/* gap-8 on all breakpoints for generous breathing room between cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </section>
  );
}
