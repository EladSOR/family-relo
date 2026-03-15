"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import SearchBar from "@/components/home/SearchBar";

export default function StickySearchHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">

        {/* Logo — links back to the homepage */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
            <MapPin size={13} strokeWidth={2.5} />
          </span>
          <span className="hidden text-sm font-extrabold tracking-tight text-slate-900 sm:block">
            FamilyRelo
          </span>
        </Link>

        {/* Full search bar — compact mode fits the header height */}
        <div className="min-w-0 flex-1">
          <SearchBar compact />
        </div>

      </div>
    </header>
  );
}
