"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import SearchBar from "@/components/home/SearchBar";
import MobileSearchPanel from "@/components/MobileSearchPanel";

export default function StickySearchHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      {/* ── Desktop layout (md+): logo + compact search bar ─────────────── */}
      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-6 py-3 md:flex">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
            <MapPin size={13} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            FamilyRelo
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <SearchBar compact />
        </div>
      </div>

      {/* ── Mobile layout (<md): compact bar → contained panel overlay ───── */}
      <div className="px-4 py-3 md:hidden">
        <MobileSearchPanel />
      </div>

    </header>
  );
}
