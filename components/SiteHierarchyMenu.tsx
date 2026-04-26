"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { buildSiteHierarchy, type SiteNavCountry } from "@/lib/siteHierarchyNav";

type Variant = "onHero" | "light";

type Props = {
  variant: Variant;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function filterTree(tree: SiteNavCountry[], q: string): SiteNavCountry[] {
  const n = normalize(q);
  if (!n) return tree;
  return tree
    .map((c) => {
      const countryHit = normalize(c.countryName).includes(n);
      const cities = countryHit
        ? c.cities
        : c.cities.filter(
            (city) => normalize(city.cityName).includes(n) || normalize(c.countryName).includes(n),
          );
      if (cities.length === 0 && !countryHit) return null;
      return { ...c, cities: countryHit ? c.cities : cities };
    })
    .filter((x): x is SiteNavCountry => x != null);
}

export default function SiteHierarchyMenu({ variant }: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const tree = useMemo(() => buildSiteHierarchy(citiesData as Destination[]), []);
  const filteredTree = useMemo(() => filterTree(tree, searchQuery), [tree, searchQuery]);
  const searching = searchQuery.trim().length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setExpanded({});
    }
  }, [open]);

  const isCountryExpanded = (slug: string) => searching || Boolean(expanded[slug]);

  const toggleCountry = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const buttonClasses =
    variant === "onHero"
      ? "rounded-lg border border-white/30 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      : "rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

  const overlay =
    open && mounted ? (
      <div
        className="fixed inset-0 z-[600] flex"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button
          type="button"
          className="absolute inset-0 z-0 bg-black/50"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
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

          <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-3">
            <label htmlFor="site-menu-search" className="sr-only">
              Search destinations
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                strokeWidth={2.25}
                aria-hidden
              />
              <input
                id="site-menu-search"
                type="search"
                autoComplete="off"
                placeholder="Search country or city…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-[#FF5A5F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]/25"
              />
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4">
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/"
                  className="relative z-10 block rounded-md px-2 py-2.5 font-semibold text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="relative z-10 block rounded-md px-2 py-2.5 font-semibold text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                  onClick={() => setOpen(false)}
                >
                  All destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="relative z-10 block rounded-md px-2 py-2.5 font-semibold text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                  onClick={() => setOpen(false)}
                >
                  Blog
                </Link>
              </li>
            </ul>

            <div className="my-4 h-px bg-slate-200" />

            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              By country
            </p>

            {filteredTree.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-slate-500">No destinations match your search.</p>
            ) : (
              <ul className="space-y-1">
                {filteredTree.map((c) => {
                  const expandedNow = isCountryExpanded(c.countrySlug);
                  return (
                    <li key={c.countrySlug} className="rounded-lg">
                      <div className="flex items-stretch gap-0.5">
                        <Link
                          href={`/${c.countrySlug}`}
                          className="relative z-10 min-w-0 flex-1 rounded-md px-2 py-2.5 text-left text-[15px] font-bold text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                          onClick={() => setOpen(false)}
                        >
                          {c.countryName}
                        </Link>
                        <button
                          type="button"
                          className="relative z-10 flex w-11 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]"
                          aria-expanded={expandedNow}
                          aria-controls={`site-menu-cities-${c.countrySlug}`}
                          aria-label={`${expandedNow ? "Hide" : "Show"} cities in ${c.countryName}`}
                          onClick={() => toggleCountry(c.countrySlug)}
                        >
                          <ChevronDown
                            size={20}
                            strokeWidth={2.25}
                            className={`transition-transform duration-200 ${expandedNow ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                      </div>
                      {expandedNow ? (
                        <ul
                          id={`site-menu-cities-${c.countrySlug}`}
                          className="mt-0.5 space-y-0.5 border-l-2 border-slate-100 py-1 pl-3 ml-2"
                        >
                          {c.cities.map((city) => (
                            <li key={`${c.countrySlug}-${city.citySlug}`}>
                              <Link
                                href={city.href}
                                className="relative z-10 block rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
                                onClick={() => setOpen(false)}
                              >
                                {city.cityName}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </div>
      </div>
    ) : null;

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

      {overlay && typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </>
  );
}
