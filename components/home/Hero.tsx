"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";
import Logo from "@/components/brand/Logo";
import StickySearchHeader from "@/components/StickySearchHeader";
import MobileSearchPanel from "@/components/MobileSearchPanel";
import SiteHierarchyMenu from "@/components/SiteHierarchyMenu";
import AuthButton from "@/components/auth/AuthButton";
export default function Hero() {
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
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 shadow-sm">
          <SiteHierarchyMenu variant="light" />
          <Link href="/" aria-label="FamiRelo home" className="shrink-0">
            <Logo variant="mark" size={28} />
          </Link>
          <div className="min-w-0 flex-1">
            <MobileSearchPanel />
          </div>
          <AuthButton compact />
        </div>
      </div>

      {/* ── Hero section ──────────────────────────────────────────────────
          z-20 keeps this section and its search dropdowns above the card
          grid below (z-0). Desktop sticky header is z-[100]. */}
      <section className="hero-gradient relative z-20 flex min-h-screen flex-col lg:min-h-0">

        {/* Two stacked overlays for text readability:
            1. Linear top→bottom — strong dark band through the upper third
               where the H1 sits, transparent through the focal area, then a
               short fade to stone-50 at the bottom so the section meets the
               destinations grid cleanly.
            2. Radial darken from the upper-left specifically — the sun's
               golden glow lives there in this photo and bleeds into the H1
               without it. Both are pointer-events-none. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 70%, rgba(250,250,249,0) 88%, rgba(250,250,249,1) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 25% 30%, rgba(0,0,0,0.45), transparent 70%)",
          }}
        />

        {/* ── NAV ───────────────────────────────────────────────────────────
            z-30 keeps the AuthButton dropdown above the hero content div
            below (which is also z-10 in the same stacking context). */}
        <nav className="relative z-30 flex items-center gap-3 px-6 py-5 md:gap-4 md:px-10">
          <SiteHierarchyMenu variant="onHero" />
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={32} wordmarkClassName="text-white" />
          </Link>
          <div className="ml-auto">
            <AuthButton />
          </div>
        </nav>

        {/* ── HERO CONTENT ──────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4 text-center md:pb-32 lg:pb-20 lg:pt-16">

          {/* Trust badge — evergreen positioning, no count. Reads as social
              proof through identity ("made for X") without making a claim
              that has to be updated as the product grows. */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm lg:mb-10 lg:px-6 lg:py-2.5 lg:text-base">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Made for relocating families
          </div>

          {/* Headline */}
          <h1 className="mb-5 max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-xl md:text-7xl lg:mb-7 lg:max-w-5xl lg:text-8xl">
            A relocation planner <span className="text-white/90">built for families</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-3 max-w-xl text-base leading-relaxed text-white/95 drop-shadow-md md:text-lg lg:mb-4 lg:max-w-3xl lg:text-xl">
            Compare cities abroad by visas, schools, housing, childcare, safety, and real family costs, all in one clean guide.
          </p>

          {/* Trust line */}
          <p className="mx-auto mb-11 max-w-xl text-sm font-medium text-white/80 drop-shadow-md lg:mb-14 lg:text-base">
            Built for families, by a family.
          </p>

          {/* IntersectionObserver target — triggers desktop sticky header */}
          <div ref={heroSearchRef} className="w-full">
            <SearchBar />
          </div>

          {/* Secondary CTA — surfaces the comparison product without competing
              with the SearchBar's "Explore" button. Sits in the gradient fade
              area where the bg is already light stone-50, so we use dark-on-
              light styling: solid slate-900 pill with white text. High
              contrast against stone-50, clearly secondary to the brand-red
              Explore button. */}
          <div className="mt-6 flex flex-col items-center gap-3 lg:mt-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Or
            </span>
            <Link
              href="/compare"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 lg:px-7 lg:text-base"
            >
              Compare cities side-by-side
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
