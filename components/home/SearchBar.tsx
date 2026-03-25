"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus } from "lucide-react";
import type { GuestCounts, OpenPanel } from "@/lib/types";
import { DURATION_OPTIONS, GUEST_ROWS } from "@/lib/constants";
import { WHERE_OPTIONS } from "@/lib/where-options";
import type { WhereOption } from "@/lib/where-options";

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

// ── Persistence helpers ───────────────────────────────────────────────────────

/** Encode GuestCounts as "adults-children-infants-teens" */
function serializeFamily(g: GuestCounts): string {
  return `${g.adults}-${g.children}-${g.infants}-${g.teens}`;
}

/** Parse "adults-children-infants-teens"; returns safe defaults on any error */
function parseFamily(param: string | null): GuestCounts {
  const defaults: GuestCounts = { adults: 1, infants: 0, children: 0, teens: 0 };
  if (!param) return defaults;
  const parts = param.split("-").map(Number);
  if (parts.length !== 4 || parts.some(isNaN) || parts.some(n => n < 0)) return defaults;
  const [adults, children, infants, teens] = parts;
  if (adults < 1) return defaults;
  return { adults, children, infants, teens };
}

const STORAGE_KEY = "familyrelo_search";

/** Save the confirmed search state to localStorage so it survives navigation. */
function saveSearch(where: string, family: string, duration: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ where, family, duration }));
  } catch { /* ignore private-browsing / quota errors */ }
}

/** Load the last saved search, or null if absent / malformed. */
function loadSearch(): { where: string; family: string; duration: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (
      typeof obj?.where    === "string" &&
      typeof obj?.family   === "string" &&
      typeof obj?.duration === "string"
    ) return obj;
    return null;
  } catch { return null; }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SearchBar({ compact = false, inlineDropdowns = false }: { compact?: boolean; inlineDropdowns?: boolean }) {
  const router = useRouter();

  const [destination, setDestination] = useState("everywhere");
  const [whereSearch, setWhereSearch] = useState("");
  const [duration,    setDuration]    = useState("");
  const [guests,      setGuests]      = useState<GuestCounts>({ adults: 1, infants: 0, children: 0, teens: 0 });
  const [openPanel,   setOpenPanel]   = useState<OpenPanel>(null);

  const ref = useRef<HTMLDivElement>(null);

  // Source-of-truth priority on mount: URL params → localStorage → defaults
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasUrlState = params.has("where") || params.has("family") || params.has("duration");

    if (hasUrlState) {
      const where = params.get("where");
      if (where && WHERE_OPTIONS.some(o => o.value === where)) setDestination(where);
      setGuests(parseFamily(params.get("family")));
      const dur = params.get("duration");
      if (dur && DURATION_OPTIONS.some(o => o.value === dur)) setDuration(dur);
    } else {
      const saved = loadSearch();
      if (saved) {
        if (WHERE_OPTIONS.some(o => o.value === saved.where)) setDestination(saved.where);
        setGuests(parseFamily(saved.family));
        if (DURATION_OPTIONS.some(o => o.value === saved.duration)) setDuration(saved.duration);
      }
    }
  }, []);

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

  // Build the query string carrying all three search fields
  const buildQuery = useCallback(
    (whereValue: string) => {
      const parts = [
        `where=${encodeURIComponent(whereValue)}`,
        `family=${serializeFamily(guests)}`,
      ];
      if (duration) parts.push(`duration=${encodeURIComponent(duration)}`);
      return `?${parts.join("&")}`;
    },
    [guests, duration],
  );

  // Explore button: save search to localStorage and navigate with full URL state
  const handleExplore = useCallback(() => {
    const opt = WHERE_OPTIONS.find(o => o.value === destination);
    const base = opt?.href ?? "/destinations";
    saveSearch(destination, serializeFamily(guests), duration);
    router.push(`${base}${buildQuery(destination)}`);
  }, [destination, guests, duration, router, buildQuery]);

  // Pressing Enter: save search and navigate to the top match
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && filteredOptions.length > 0) {
        const first = filteredOptions[0];
        handleSelect(first);
        saveSearch(first.value, serializeFamily(guests), duration);
        router.push(`${first.href}${buildQuery(first.value)}`);
      }
    },
    [filteredOptions, guests, duration, handleSelect, router, buildQuery],
  );

  // ── Derived display labels ──────────────────────────────────────────────────
  const whereLabel  = WHERE_OPTIONS.find(o => o.value === destination)?.label ?? "Everywhere";
  const totalKids   = guests.infants + guests.children + guests.teens;
  const whoLabel    = guests.adults === 1 && totalKids === 0
    ? "Family setup"
    : `${guests.adults} adult${guests.adults > 1 ? "s" : ""}${
        totalKids > 0 ? `, ${totalKids} kid${totalKids > 1 ? "s" : ""}` : ""
      }`;
  const durationLabel = DURATION_OPTIONS.find(o => o.value === duration)?.label ?? "Add dates";

  const sectionBtn = (panel: OpenPanel) => {
    const base = "w-full flex flex-col text-left rounded-xl transition-colors";
    if (compact)         return `${base} px-4 py-2 ${openPanel === panel ? "bg-white/70" : "hover:bg-white/50"}`;
    if (inlineDropdowns) return `${base} px-4 py-3 border ${openPanel === panel ? "border-[#FF5A5F]/30 bg-[#FF5A5F]/5" : "border-gray-200 bg-white hover:bg-gray-50"}`;
    return `${base} md:rounded-full px-5 py-3.5 md:px-6 ${openPanel === panel ? "bg-white/70" : "hover:bg-white/50"}`;
  };

  // Grouped sections for the ungrouped (no-search) state
  const countryOptions = WHERE_OPTIONS.filter(o => o.type === "country");
  const cityOptions    = WHERE_OPTIONS.filter(o => o.type === "city");
  const showGrouped    = !whereSearch.trim();

  return (
    <div ref={ref} className={`relative z-50 w-full ${compact ? "" : "mx-auto max-w-4xl"}`}>
      <div className={`flex ${
        compact
          ? "flex-row items-center p-2 rounded-full border border-slate-200 bg-white shadow-sm"
          : inlineDropdowns
            ? "flex-col gap-2"
            : "flex-col p-2 rounded-2xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:rounded-full"
      }`}>

        {/* ── WHERE ────────────────────────────────────────────────────────── */}
        <div className={inlineDropdowns ? "" : `relative min-w-0 flex-1${openPanel === "where" ? " z-10" : ""}`}>
          <button onClick={() => togglePanel("where")} className={sectionBtn("where")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Where</span>
            <span className="truncate text-base font-semibold text-slate-800">{whereLabel}</span>
          </button>

          {openPanel === "where" && (
            <div className={inlineDropdowns
              ? "mt-1 w-full rounded-2xl border border-gray-100 bg-white p-3 shadow-md"
              : "absolute left-0 top-full mt-2 w-full rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl md:mt-4 md:w-80 md:rounded-3xl"
            }>

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

        <div className="mx-1 hidden h-10 w-px shrink-0 bg-gray-300/70 md:block" />

        {/* ── WHO ──────────────────────────────────────────────────────────── */}
        <div className={inlineDropdowns ? "" : `relative min-w-0 flex-1${openPanel === "who" ? " z-10" : ""}`}>
          <button onClick={() => togglePanel("who")} className={sectionBtn("who")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Family</span>
            <span className="truncate text-base font-semibold text-slate-800">{whoLabel}</span>
          </button>

          {openPanel === "who" && (
            <div className={inlineDropdowns
              ? "mt-1 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-md"
              : "absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl md:mt-4 md:w-80 md:rounded-3xl"
            }>
              <div className="divide-y divide-gray-100">
                {GUEST_ROWS.map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
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
            </div>
          )}
        </div>

        <div className="mx-1 hidden h-10 w-px shrink-0 bg-gray-300/70 md:block" />

        {/* ── DURATION ─────────────────────────────────────────────────────── */}
        <div className={inlineDropdowns ? "" : `relative min-w-0 flex-1${openPanel === "duration" ? " z-10" : ""}`}>
          <button onClick={() => togglePanel("duration")} className={sectionBtn("duration")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Duration</span>
            <span className="truncate text-base font-semibold text-slate-800">{durationLabel}</span>
          </button>

          {openPanel === "duration" && (
            <div className={inlineDropdowns
              ? "mt-1 w-full rounded-2xl border border-gray-100 bg-white p-3 shadow-md"
              : "absolute left-0 top-full mt-2 w-full rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl md:left-auto md:right-0 md:mt-4 md:w-52 md:rounded-3xl"
            }>
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
        <div className={compact ? "shrink-0 pl-1 pr-1" : "pl-1 pr-1 md:shrink-0"}>
          <button
            onClick={handleExplore}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#FF5A5F] font-bold text-white shadow-lg shadow-[#FF5A5F]/30 transition-all hover:bg-[#e84a4f] active:scale-95 ${
              compact ? "px-5 py-2.5 text-sm" : "w-full px-7 py-4 md:w-auto"
            }`}
          >
            <Search size={compact ? 15 : 17} />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
