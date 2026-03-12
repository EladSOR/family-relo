// No "use client" needed — all hover effects are pure Tailwind CSS.
import Link from "next/link";
import { MapPin, Shield, BadgeDollarSign, ChevronRight, Home } from "lucide-react";
import type { Destination } from "@/lib/types";
import { CITY_IMAGES, FALLBACK_IMAGE } from "@/lib/constants";

// Short, human, family-first note shown on every card by default.
const CITY_NOTES: Record<string, string> = {
  "Valencia":    "Affordable beach life with great international schools",
  "Lisbon":      "Europe's most walkable, family-friendly capital",
  "Dubai":       "World-class schools & one of the safest cities on earth",
  "Chiang Mai":  "Asia's most affordable family hub, surrounded by nature",
  "Koh Phangan": "Tight-knit expat community on a stunning island",
  "Koh Samui":   "Resort-island living with growing international schools",
};

interface Props {
  city: Destination;
}

export default function DestinationCard({ city }: Props) {
  const image = CITY_IMAGES[city.city] ?? FALLBACK_IMAGE;
  const note  = CITY_NOTES[city.city] ?? city.tagline;

  return (
    <Link href={`/${city.countrySlug}/${city.citySlug}`} className="block">
    <article className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] shadow-lg transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.28)]">
      <div className="aspect-[2/3] relative">

        {/* ── Image ──────────────────────────────────────────────────────── */}
        <img
          src={image}
          alt={`${city.city}, ${city.country}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />

        {/* ── Gradients ──────────────────────────────────────────────────── */}
        {/* Base: always-on, strong at the bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
        {/* Hover: mid-section deepens so hover stats are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* ── Safety badge (top-right, always visible) ───────────────────── */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          <Shield size={11} strokeWidth={2.5} />
          {city.safety.score}
          <span className="font-normal text-white/60">/100</span>
        </div>

        {/* ── Bottom content ─────────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 p-7">

          {/* City name + country — always visible */}
          <div className="transition-transform duration-400 ease-out group-hover:-translate-y-2">
            <h3 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-white">
              {city.city}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white/70">
              <MapPin size={12} strokeWidth={2.5} />
              {city.country}
            </p>

            {/* Family note — always visible, sits just below the country */}
            <p className="mt-3 text-sm font-medium leading-snug text-white/85">
              {note}
            </p>
          </div>

          {/* ── Hover reveal: stats + CTA ──────────────────────────────── */}

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 translate-y-4 opacity-0 transition-all duration-350 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/12 px-4 py-3 backdrop-blur-md">
              <BadgeDollarSign size={14} className="shrink-0 text-white/60" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Nanny</p>
                <p className="text-sm font-extrabold text-white">
                  ${city.cost.nannyHourly}
                  <span className="text-[10px] font-normal text-white/50">/hr</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/12 px-4 py-3 backdrop-blur-md">
              <Home size={14} className="shrink-0 text-white/60" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Best area</p>
                <p className="truncate text-sm font-extrabold text-white">{city.housing.bestAreas[0]}</p>
              </div>
            </div>
          </div>

          {/* Explore CTA */}
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A5F]/20 transition-all duration-350 delay-150 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#e84a4f] active:scale-[0.98]">
            Explore {city.city}
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
    </Link>
  );
}
