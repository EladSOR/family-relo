"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { buildSiteHierarchy } from "@/lib/siteHierarchyNav";

type Variant = "onHero" | "light";

type Props = {
  variant: Variant;
};

export default function SiteHierarchyMenu({ variant }: Props) {
  const [open, setOpen] = useState(false);
  const tree = useMemo(() => buildSiteHierarchy(citiesData as Destination[]), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const buttonClasses =
    variant === "onHero"
      ? "rounded-lg border border-white/30 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      : "rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

  return (
    <>
      <button
        type="button"
        className={buttonClasses}
        aria-label="Open site menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} strokeWidth={2.25} aria-hidden />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[220]" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-extrabold tracking-tight text-slate-900">Browse</span>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={20} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/"
                    className="block rounded-md px-2 py-2 font-semibold text-slate-900 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations"
                    className="block rounded-md px-2 py-2 font-semibold text-slate-900 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    All destinations
                  </Link>
                </li>
              </ul>

              <div className="my-4 h-px bg-slate-200" />

              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                By country
              </p>
              <ul className="space-y-4">
                {tree.map((c) => (
                  <li key={c.countrySlug}>
                    <Link
                      href={`/${c.countrySlug}`}
                      className="block rounded-md px-2 py-1.5 text-[15px] font-bold text-slate-900 hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      {c.countryName}
                    </Link>
                    <ul className="mt-1 space-y-0.5 border-l border-slate-200 pl-3 ml-2">
                      {c.cities.map((city) => (
                        <li key={`${c.countrySlug}-${city.citySlug}`}>
                          <Link
                            href={city.href}
                            className="block rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => setOpen(false)}
                          >
                            {city.cityName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
