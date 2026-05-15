"use client";

import Link from "next/link";
import SearchBar from "@/components/home/SearchBar";
import MobileSearchPanel from "@/components/MobileSearchPanel";
import SiteHierarchyMenu from "@/components/SiteHierarchyMenu";
import AuthButton from "@/components/auth/AuthButton";
import Logo from "@/components/brand/Logo";

export default function StickySearchHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      {/* ── Desktop layout (md+): logo + compact search bar ─────────────── */}
      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-6 py-3 md:flex">
        <SiteHierarchyMenu variant="light" />
        <Link href="/" className="shrink-0" aria-label="FamiRelo home">
          <Logo size={24} />
        </Link>
        <div className="min-w-0 flex-1">
          <SearchBar compact />
        </div>
        <AuthButton />
      </div>

      {/* ── Mobile layout (<md): logo + compact bar ──────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-3 md:hidden">
        <SiteHierarchyMenu variant="light" />
        <Link href="/" aria-label="FamiRelo home" className="shrink-0">
          <Logo variant="mark" size={26} />
        </Link>
        <div className="min-w-0 flex-1">
          <MobileSearchPanel />
        </div>
        <AuthButton compact />
      </div>

    </header>
  );
}
