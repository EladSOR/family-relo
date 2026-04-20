"use client";

import { useState } from "react";
import { Search, X, MapPin } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/home/SearchBar";

/**
 * Shared mobile-only search system.
 *
 * Renders a compact "Start your search" pill.
 * Tapping opens a contained panel fixed at the top of the screen —
 * only as tall as its content, so page content remains visible below.
 *
 * SearchBar renders with inlineDropdowns=true: each picker opens inline
 * below its field rather than as an absolute overlay, which prevents
 * the picker from overlapping the next field in the stacked mobile layout.
 *
 * Used by:
 *   - StickySearchHeader  (inner pages: city, country, destinations)
 *   - Hero                (homepage scrolled state)
 */
export default function MobileSearchPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Compact bar ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-full bg-gray-100 px-4 py-2.5 text-left"
      >
        <Search size={15} className="shrink-0 text-[#FF5A5F]" />
        <span className="text-sm font-medium text-gray-500">Start your search</span>
      </button>

      {/* ── Open panel ──────────────────────────────────────────────────── */}
      {open && (
        <>
          {/* Transparent backdrop — tapping outside closes the panel */}
          <div
            className="fixed inset-0 z-[299]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel: capped at 100dvh so it never overflows; header is fixed, form scrolls */}
          <div className="fixed inset-x-0 top-0 z-[300] flex max-h-[100dvh] flex-col bg-white shadow-xl">

            {/* Header row — always visible, never scrolls away */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <Link href="/" aria-label="Home" className="flex items-center gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
                  <MapPin size={13} strokeWidth={2.5} />
                </span>
                <span className="text-sm font-extrabold tracking-tight text-slate-900">
                  FamiRelo
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-slate-600 transition-colors hover:bg-gray-200 active:scale-95"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable form area — grows to fill remaining height, scrolls if needed */}
            <div className="overflow-y-auto px-4 py-4">
              <SearchBar inlineDropdowns />
            </div>

          </div>
        </>
      )}
    </>
  );
}
