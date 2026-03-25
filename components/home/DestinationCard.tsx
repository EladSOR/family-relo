"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Shield } from "lucide-react";
import type { Destination } from "@/lib/types";
import { CITY_IMAGES, FALLBACK_IMAGE } from "@/lib/constants";

interface Props {
  city: Destination;
}

// Stats block spans the full card below the safety badge on ALL screen sizes.
// Mobile : top-10 (40px clears badge at ~34px, extra breathing room below).
// Desktop: top-14 (56px, slightly more clearance) → bottom-0.
const STATS_POS = "inset-x-0 top-10 bottom-0 md:top-14";

const STATS = (city: Destination) => [
  { label: "3-bed family home", value: city.cost.rentRange },
  { label: "Dinner for 2",      value: city.cost.familyDinner },
  { label: "Nanny hourly cost", value: city.cost.nannyRate },
];

export default function DestinationCard({ city }: Props) {
  const [tapped, setTapped] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const router  = useRouter();

  const href  = `/${city.countrySlug}/${city.citySlug}`;
  const image = CITY_IMAGES[city.city] ?? FALLBACK_IMAGE;

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!tapped) return;
    const onOutside = (e: TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setTapped(false);
      }
    };
    document.addEventListener("touchstart", onOutside, { passive: true });
    return () => document.removeEventListener("touchstart", onOutside);
  }, [tapped]);

  // Mobile (<768px): tap toggles reveal. Desktop: CSS group-hover handles it.
  const handleCardClick = (e: React.MouseEvent) => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    e.preventDefault();
    setTapped(prev => !prev);
  };

  // CTA navigates on mobile; Link handles desktop.
  const handleCTAClick = (e: React.MouseEvent) => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    e.stopPropagation();
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleCardClick} className="block">
      <article
        ref={cardRef}
        className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md"
      >
        <div className="relative aspect-[3/4]">

          {/* Image */}
          <img
            src={image}
            alt={`${city.city}, ${city.country}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Base gradient — always on */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Deeper gradient — revealed state only */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20 transition-opacity duration-300 ${
            tapped ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
          }`} />

          {/* Safety badge — top right, always visible */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Shield size={11} strokeWidth={2.5} />
            {city.safety.score}/100
            <span className="font-normal text-white/70">Safety</span>
          </div>

          {/* ── Revealed: stats + button ─────────────────────────────────
              Spans full card below the badge. flex-col + justify-between
              pins stats to the top and Explore button to the bottom. */}
          <div className={`absolute flex flex-col justify-between px-4 py-3 md:px-6 md:py-5 ${STATS_POS} transition-all duration-300 ${
            tapped
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
          }`}>
            {/* Stacked label-above-value on all screen sizes */}
            <div className="space-y-1.5 md:space-y-5">
              {STATS(city).map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0 md:gap-1">
                  <span className="text-xs font-semibold text-white/90 md:text-sm md:text-white/80">
                    {label}
                  </span>
                  {/* whitespace-nowrap: values never break mid-number */}
                  <span className="whitespace-nowrap text-xs font-bold text-white md:text-xl md:font-extrabold">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCTAClick}
              className="w-full cursor-pointer overflow-hidden rounded-xl bg-[#FF5A5F] py-1.5 text-xs font-bold text-white hover:bg-[#e84a4f] active:scale-[0.98] md:rounded-2xl md:py-3 md:text-sm"
            >
              {/* Mobile: short label always fits. Desktop: full city name. */}
              <span className="block md:hidden">Explore</span>
              <span className="hidden md:block truncate">Explore {city.city}</span>
            </button>
          </div>

          {/* ── Default: city name + country ──────────────────────────────
              Always visible on mobile.
              On desktop (md+): fades out on hover to hand off to stats. */}
          <div className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 md:group-hover:opacity-0 md:group-hover:pointer-events-none ${
            tapped ? "opacity-0 pointer-events-none" : ""
          }`}>
            <h3 className="text-xl font-extrabold leading-tight text-white">
              {city.city}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-white/80">
              <MapPin size={12} strokeWidth={2.5} />
              {city.country}
            </p>
          </div>

        </div>
      </article>
    </Link>
  );
}
