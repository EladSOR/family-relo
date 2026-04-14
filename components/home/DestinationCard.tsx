"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import type { Destination } from "@/lib/types";
import { resolveCityHeroImage } from "@/lib/constants";

interface Props {
  city: Destination;
}

// Stats block sits below the compact budget badge.
const STATS_POS = "inset-x-0 top-11 bottom-0 md:top-12";

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
  const image = resolveCityHeroImage(city);

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

  /** Desktop: navigate on card tap. Mobile: first taps toggle the stats overlay. */
  const handleSurfaceClick = () => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) {
      router.push(href);
    } else {
      setTapped((prev) => !prev);
    }
  };

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      onClick={handleSurfaceClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSurfaceClick();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A5F] focus-visible:ring-offset-2"
    >
      {/* Crawlers: real href without wrapping the whole card in <a> (avoids nested interactive). */}
      <Link href={href} tabIndex={-1} className="sr-only">
        View relocation guide for {city.city}, {city.country}
      </Link>

      <div className="relative aspect-[3/4]">

        {/* Image — native img + lazy; URLs from CITY_IMAGES (same sources as city heroes) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

        {/* Compact all-in budget pill — full amount in native tooltip if truncated */}
        <div
          className="absolute right-2 top-2 z-10 max-w-[min(calc(100%-1rem),11.5rem)] truncate rounded-full bg-[#FF5A5F] px-2 py-0.5 text-[10px] font-bold tabular-nums text-white shadow-sm sm:right-3 sm:top-3 sm:max-w-[13rem] sm:py-1 sm:text-[11px]"
          title={`All-in / month (family of 4): ${city.cost.monthlyFamilyAllIn}`}
        >
          {city.cost.monthlyFamilyAllIn}
        </div>

        {/* Revealed: stats + Explore */}
        <div className={`absolute flex flex-col justify-between px-4 py-3 md:px-6 md:py-5 ${STATS_POS} transition-all duration-300 ${
          tapped
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
        }`}>
          <div className="space-y-1.5 md:space-y-5">
            {STATS(city).map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0 md:gap-1">
                <span className="text-xs font-semibold text-white/90 md:text-sm md:text-white/80">
                  {label}
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-white md:text-xl md:font-extrabold">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile: sibling <a>, not nested — tap stops surface toggle and navigates */}
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="md:hidden block w-full cursor-pointer overflow-hidden rounded-xl bg-[#FF5A5F] py-1.5 text-center text-xs font-bold text-white hover:bg-[#e84a4f] active:scale-[0.98]"
          >
            Explore
          </Link>

          {/* Desktop: non-link; click bubbles to surface → router.push */}
          <span className="hidden md:block w-full cursor-pointer overflow-hidden rounded-2xl bg-[#FF5A5F] py-3 text-center text-sm font-bold text-white hover:bg-[#e84a4f] active:scale-[0.98]">
            <span className="block truncate">Explore {city.city}</span>
          </span>
        </div>

        {/* Default: city name + country */}
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
  );
}
