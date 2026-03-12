"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    // z-20 so this section (and its search popovers) always paints above the
    // card grid below (which is z-0).
    <section className="hero-gradient relative z-20 flex min-h-screen flex-col">

      {/* Background video — starts invisible; fades in once the browser can
          play it. The CSS gradient above is always the visible base layer,
          so there is never a grey/blank flash if the video is slow or fails. */}
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

      {/* Scrim: darkens the video slightly; fades to stone-50 at the bottom
          so the card section below blends in without a hard edge. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-stone-50" />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
            <MapPin size={16} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            FamilyRelo
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-semibold text-white/80 transition-colors hover:text-white">Destinations</a>
          <a href="#" className="text-sm font-semibold text-white/80 transition-colors hover:text-white">Visa Guide</a>
          <a href="#" className="text-sm font-semibold text-white/80 transition-colors hover:text-white">Schools</a>
        </div>

        <button className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
          Sign in
        </button>
      </nav>

      {/* ── HERO CONTENT ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-4 text-center">

        {/* Trust badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Trusted by 2,000+ relocating families
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-xl md:text-7xl">
          Find your family&apos;s<br />
          <span className="text-white/90">next chapter.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-14 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          Visa rules, childcare costs &amp; the world&apos;s best cities for families — in one place.
        </p>

        <SearchBar />
      </div>
    </section>
  );
}
