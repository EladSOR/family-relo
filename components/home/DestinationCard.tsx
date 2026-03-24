"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Shield, Home, Utensils, Baby, ChevronRight } from "lucide-react";
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
  const [tapped, setTapped] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const router   = useRouter();

  const href  = `/${city.countrySlug}/${city.citySlug}`;
  const image = CITY_IMAGES[city.city] ?? FALLBACK_IMAGE;
  const note  = CITY_NOTES[city.city] ?? city.tagline;

  // ── Close when tapping outside the card (mobile) ──────────────────────────
  useEffect(() => {
    if (!tapped) return;
    const onOutsideTap = (e: TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setTapped(false);
      }
    };
    document.addEventListener("touchstart", onOutsideTap, { passive: true });
    return () => document.removeEventListener("touchstart", onOutsideTap);
  }, [tapped]);

  // ── Mobile: first tap expands, second tap collapses. Desktop: no-op. ──────
  const handleCardClick = (e: React.MouseEvent) => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    e.preventDefault();
    setTapped(prev => !prev);
  };

  // ── CTA: navigate on mobile, let Link handle on desktop ───────────────────
  const handleCTAClick = (e: React.MouseEvent) => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    e.stopPropagation(); // don't toggle card state
    router.push(href);
  };

  // ── Shared reveal classes ─────────────────────────────────────────────────
  // Mobile:  driven by `tapped` React state
  // Desktop: driven by CSS group-hover (md: prefix keeps it desktop-only)
  const revealed = tapped
    ? "translate-y-0 opacity-100"
    : "translate-y-4 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100";

  return (
    <Link href={href} onClick={handleCardClick} className="block">
      <article
        ref={cardRef}
        className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] shadow-lg transition-all duration-500 ease-out md:hover:-translate-y-2 md:hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.28)]"
      >
        <div className="aspect-[2/3] relative">

          {/* ── Image ──────────────────────────────────────────────────── */}
          <img
            src={image}
            alt={`${city.city}, ${city.country}`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
              tapped ? "scale-[1.07]" : "md:group-hover:scale-[1.07]"
            }`}
          />

          {/* ── Base gradient (always on) ───────────────────────────── */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

          {/* ── Deep gradient (hover / tap) ─────────────────────────── */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent transition-opacity duration-500 ${
            tapped ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
          }`} />

          {/* ── Safety badge ────────────────────────────────────────── */}
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Shield size={11} strokeWidth={2.5} />
            {city.safety.score}
            <span className="font-normal text-white/60">/100</span>
          </div>

          {/* ── Bottom content ──────────────────────────────────────── */}
          <div className="absolute inset-x-0 bottom-0 p-7">

            {/* City name + note — always visible, lifts on hover/tap */}
            <div className={`transition-transform duration-500 ease-out ${
              tapped ? "-translate-y-2" : "md:group-hover:-translate-y-2"
            }`}>
              <h3 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-white">
                {city.city}
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white/70">
                <MapPin size={12} strokeWidth={2.5} />
                {city.country}
              </p>
              <p className="mt-3 text-sm font-medium leading-snug text-white/85">
                {note}
              </p>
            </div>

            {/* ── Stats row ─────────────────────────────────────────── */}
            <div className={`mt-5 grid grid-cols-3 gap-2 transition-all duration-300 delay-75 ${revealed}`}>
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/12 px-3 py-2.5 backdrop-blur-md">
                <Home size={12} className="text-white/50" />
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/45 leading-tight">3-bed home</p>
                <p className="text-xs font-extrabold text-white leading-tight">{city.cost.rentRange}</p>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/12 px-3 py-2.5 backdrop-blur-md">
                <Utensils size={12} className="text-white/50" />
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/45 leading-tight">Dinner for 2</p>
                <p className="text-xs font-extrabold text-white leading-tight">{city.cost.familyDinner}</p>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/12 px-3 py-2.5 backdrop-blur-md">
                <Baby size={12} className="text-white/50" />
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/45 leading-tight">Nanny</p>
                <p className="text-xs font-extrabold text-white leading-tight">{city.cost.nannyRate}</p>
              </div>
            </div>

            {/* ── CTA ───────────────────────────────────────────────── */}
            <button
              onClick={handleCTAClick}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A5F]/20 transition-all duration-300 delay-150 hover:bg-[#e84a4f] active:scale-[0.98] ${revealed}`}
            >
              Explore {city.city}
              <ChevronRight size={15} strokeWidth={2.5} />
            </button>

          </div>
        </div>
      </article>
    </Link>
  );
}
