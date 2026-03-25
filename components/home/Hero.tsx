"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import SearchBar from "./SearchBar";
import StickySearchHeader from "@/components/StickySearchHeader";
import MobileSearchPanel from "@/components/MobileSearchPanel";

export default function Hero() {
  const [videoReady,       setVideoReady]       = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [mobileScrolled,   setMobileScrolled]   = useState(false);

  const heroSearchRef = useRef<HTMLDivElement>(null);

  // One observer drives both the desktop sticky header and the mobile compact bar.
  // Both appear only after the hero search section has fully left the viewport —
  // guaranteeing no overlap between the in-page search and either fixed bar.
  useEffect(() => {
    const el = heroSearchRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const gone = !entry.isIntersecting;
        setShowStickySearch(gone);
        setMobileScrolled(gone);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Desktop sticky header ─────────────────────────────────────────
          Slides down when hero search scrolls out of view.
          Hidden on mobile — mobile has its own compact scroll bar below. */}
      <div
        className={`fixed inset-x-0 top-0 z-[100] hidden md:block transition-transform duration-300 ease-in-out ${
          showStickySearch ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <StickySearchHeader />
      </div>

      {/* ── Mobile scrolled compact bar ───────────────────────────────────
          Slides in once user scrolls past the hero search.
          Uses MobileSearchPanel — same component as inner pages —
          so mobile search behavior is identical everywhere. */}
      <div
        className={`fixed inset-x-0 top-0 z-[100] md:hidden transition-transform duration-300 ease-in-out ${
          mobileScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <MobileSearchPanel />
        </div>
      </div>

      {/* ── Hero section ──────────────────────────────────────────────────
          z-20 keeps this section and its search dropdowns above the card
          grid below (z-0). Desktop sticky header is z-[100]. */}
      <section className="hero-gradient relative z-20 flex min-h-screen flex-col">

        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ${
            videoReady ? "opacity-70" : "opacity-0"
          }`}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-family-walking-on-the-beach-at-sunset-1258-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-stone-50" />

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="relative z-10 flex items-center px-6 py-5 md:px-10">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={16} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              FamilyRelo
            </span>
          </a>
        </nav>

        {/* ── HERO CONTENT ──────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4 text-center md:pb-32">

          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Trusted by 2,000+ relocating families
          </div>

          {/* Headline */}
          <h1 className="mb-5 max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-xl md:text-7xl">
            Plan your family&apos;s move.<br />
            <span className="text-white/90">Without the chaos.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-3 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Everything families need to relocate — visas, schools, real costs — finally in one place.
          </p>

          {/* Trust line */}
          <p className="mx-auto mb-11 max-w-xl text-sm font-medium text-white/50">
            Built for families, by a family.
          </p>

          {/* IntersectionObserver target — triggers desktop sticky header */}
          <div ref={heroSearchRef} className="w-full">
            <SearchBar />
          </div>

        </div>
      </section>
    </>
  );
}
