"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Minus,
  Globe, Building2, Anchor, Mountain, Waves, Umbrella, TreePalm, Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GuestCounts, OpenPanel, Destination } from "@/lib/types";
import { DURATION_OPTIONS, GUEST_ROWS } from "@/lib/constants";
import citiesData from "@/data/cities.json";

// ── Where option types ────────────────────────────────────────────────────────

type OptionType = "everywhere" | "country" | "city";

interface WhereOption {
  value: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  type: OptionType;
}

// ── Static icon maps ──────────────────────────────────────────────────────────

const COUNTRY_ICONS: Record<string, LucideIcon> = {
  spain:    Sun,
  portugal: Anchor,
  uae:      Building2,
  thailand: TreePalm,
};

const CITY_ICONS: Record<string, LucideIcon> = {
  "valencia-es":    TreePalm,
  "lisbon-pt":      Anchor,
  "dubai-ae":       Building2,
  "chiang-mai-th":  Mountain,
  "koh-phangan-th": Waves,
  "koh-samui-th":   Umbrella,
};

// ── Build options at module level (static data, no component state needed) ───

function buildWhereOptions(): WhereOption[] {
  const seen = new Set<string>();
  const countryOpts: WhereOption[] = [];

  for (const d of citiesData as Destination[]) {
    if (!seen.has(d.countrySlug)) {
      seen.add(d.countrySlug);
      countryOpts.push({
        value: d.countrySlug,
        label: d.country,
        href: `/${d.countrySlug}`,
        Icon: COUNTRY_ICONS[d.countrySlug] ?? Globe,
        type: "country",
      });
    }
  }

  const cityOpts: WhereOption[] = (citiesData as Destination[]).map(d => ({
    value: d.id,
    label: `${d.city}, ${d.country}`,
    href: `/${d.countrySlug}/${d.citySlug}`,
    Icon: CITY_ICONS[d.id] ?? Globe,
    type: "city",
  }));

  return [
    { value: "everywhere", label: "Everywhere", href: "/destinations", Icon: Globe, type: "everywhere" },
    ...countryOpts,
    ...cityOpts,
  ];
}

const WHERE_OPTIONS = buildWhereOptions();

// ── Sub-component: single dropdown row ───────────────────────────────────────

function OptionRow({
  opt,
  isSelected,
  onSelect,
}: {
  opt: WhereOption;
  isSelected: boolean;
  onSelect: (o: WhereOption) => void;
}) {
  const { Icon } = opt;
  return (
    <button
      onClick={() => onSelect(opt)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-gray-50" : ""
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isSelected ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={15} strokeWidth={2} />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <span
          className={`truncate text-sm font-semibold ${
            isSelected ? "text-[#FF5A5F]" : "text-gray-800"
          }`}
        >
          {opt.label}
        </span>
        {opt.type === "country" && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
            Country
          </span>
        )}
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SearchBar() {
  const router = useRouter();

  const [destination, setDestination] = useState("everywhere");
  const [whereSearch, setWhereSearch] = useState("");
  const [duration,    setDuration]    = useState("");
  const [guests,      setGuests]      = useState<GuestCounts>({ adults: 1, infants: 0, children: 0, teens: 0 });
  const [openPanel,   setOpenPanel]   = useState<OpenPanel>(null);

  const ref = useRef<HTMLDivElement>(null);

  // Close all panels + clear search when clicking outside
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenPanel(null);
        setWhereSearch("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const togglePanel = useCallback((panel: OpenPanel) => {
    setOpenPanel(prev => {
      if (prev === panel) { setWhereSearch(""); return null; }
      return panel;
    });
  }, []);

  const updateGuest = useCallback((key: keyof GuestCounts, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [key]: Math.max(key === "adults" ? 1 : 0, prev[key] + delta),
    }));
  }, []);

  // Filter WHERE options by search text
  const filteredOptions = useMemo(() => {
    const q = whereSearch.trim().toLowerCase();
    if (!q) return WHERE_OPTIONS;
    return WHERE_OPTIONS.filter(o => o.label.toLowerCase().includes(q));
  }, [whereSearch]);

  const handleSelect = useCallback((opt: WhereOption) => {
    setDestination(opt.value);
    setWhereSearch("");
    setOpenPanel(null);
  }, []);

  // Explore button: navigate to the selected destination's real page
  const handleExplore = useCallback(() => {
    const opt = WHERE_OPTIONS.find(o => o.value === destination);
    router.push(opt?.href ?? "/destinations");
  }, [destination, router]);

  // Pressing Enter in the search field navigates to the top match immediately
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && filteredOptions.length > 0) {
        const first = filteredOptions[0];
        handleSelect(first);
        router.push(first.href);
      }
    },
    [filteredOptions, handleSelect, router],
  );

  // ── Derived display labels ──────────────────────────────────────────────────
  const whereLabel  = WHERE_OPTIONS.find(o => o.value === destination)?.label ?? "Everywhere";
  const totalKids   = guests.infants + guests.children + guests.teens;
  const whoLabel    = guests.adults === 1 && totalKids === 0
    ? "Add guests"
    : `${guests.adults} adult${guests.adults > 1 ? "s" : ""}${
        totalKids > 0 ? `, ${totalKids} child${totalKids > 1 ? "ren" : ""}` : ""
      }`;
  const durationLabel = DURATION_OPTIONS.find(o => o.value === duration)?.label ?? "Add dates";

  const sectionBtn = (panel: OpenPanel) =>
    `w-full flex flex-col text-left px-6 py-3.5 rounded-full transition-colors ${
      openPanel === panel ? "bg-white/70" : "hover:bg-white/50"
    }`;

  // Grouped sections for the ungrouped (no-search) state
  const countryOptions = WHERE_OPTIONS.filter(o => o.type === "country");
  const cityOptions    = WHERE_OPTIONS.filter(o => o.type === "city");
  const showGrouped    = !whereSearch.trim();

  return (
    <div ref={ref} className="relative z-50 mx-auto w-full max-w-4xl">
      <div className="flex items-center rounded-full border border-white/30 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">

        {/* ── WHERE ────────────────────────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          <button onClick={() => togglePanel("where")} className={sectionBtn("where")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Where</span>
            <span className="truncate text-base font-semibold text-slate-800">{whereLabel}</span>
          </button>

          {openPanel === "where" && (
            <div className="absolute left-0 top-full mt-4 w-80 rounded-3xl border border-gray-100 bg-white p-3 shadow-2xl">

              {/* Search input */}
              <div className="px-1 pb-2">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 transition-colors focus-within:border-[#FF5A5F] focus-within:bg-white">
                  <Search size={13} className="shrink-0 text-gray-400" />
                  <input
                    autoFocus
                    value={whereSearch}
                    onChange={e => setWhereSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search cities or countries…"
                    className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto">
                {showGrouped ? (
                  <>
                    <OptionRow
                      opt={WHERE_OPTIONS[0]}
                      isSelected={destination === "everywhere"}
                      onSelect={handleSelect}
                    />
                    <p className="mb-1 mt-3 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      Countries
                    </p>
                    {countryOptions.map(opt => (
                      <OptionRow key={opt.value} opt={opt} isSelected={destination === opt.value} onSelect={handleSelect} />
                    ))}
                    <p className="mb-1 mt-3 px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      Cities
                    </p>
                    {cityOptions.map(opt => (
                      <OptionRow key={opt.value} opt={opt} isSelected={destination === opt.value} onSelect={handleSelect} />
                    ))}
                  </>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map(opt => (
                    <OptionRow key={opt.value} opt={opt} isSelected={destination === opt.value} onSelect={handleSelect} />
                  ))
                ) : (
                  <p className="px-3 py-4 text-sm text-gray-400">
                    No results for &ldquo;{whereSearch}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-10 w-px shrink-0 bg-gray-300/70" />

        {/* ── WHO ──────────────────────────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          <button onClick={() => togglePanel("who")} className={sectionBtn("who")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Who</span>
            <span className="truncate text-base font-semibold text-slate-800">{whoLabel}</span>
          </button>

          {openPanel === "who" && (
            <div className="absolute left-0 top-full mt-4 w-80 rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl">
              {GUEST_ROWS.map(({ key, label, sub }) => (
                <div key={key} className="flex w-full items-center justify-between border-b border-gray-50 py-4 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuest(key, -1)}
                      disabled={guests[key] <= (key === "adults" ? 1 : 0)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-gray-700 disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <Minus size={13} className="text-gray-700" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold tabular-nums text-gray-900">
                      {guests[key]}
                    </span>
                    <button
                      onClick={() => updateGuest(key, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-gray-700"
                    >
                      <Plus size={13} className="text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-10 w-px shrink-0 bg-gray-300/70" />

        {/* ── DURATION ─────────────────────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          <button onClick={() => togglePanel("duration")} className={sectionBtn("duration")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Duration</span>
            <span className="truncate text-base font-semibold text-slate-800">{durationLabel}</span>
          </button>

          {openPanel === "duration" && (
            <div className="absolute right-0 top-full mt-4 w-52 rounded-3xl border border-gray-100 bg-white p-3 shadow-2xl">
              {DURATION_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setDuration(value); setOpenPanel(null); }}
                  className={`w-full rounded-xl p-4 text-left text-sm font-semibold transition-colors ${
                    duration === value ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── EXPLORE — navigates to the selected destination's real page ───── */}
        <div className="shrink-0 pl-1 pr-1">
          <button
            onClick={handleExplore}
            className="flex items-center gap-2 rounded-full bg-[#FF5A5F] px-7 py-4 font-bold text-white shadow-lg shadow-[#FF5A5F]/30 transition-all hover:bg-[#e84a4f] active:scale-95"
          >
            <Search size={17} />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
