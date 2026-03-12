"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Plus, Minus,
  Globe, Building2, Anchor, Mountain, Waves, Umbrella, TreePalm,
} from "lucide-react";
import type { GuestCounts, OpenPanel } from "@/lib/types";
import { DURATION_OPTIONS, GUEST_ROWS } from "@/lib/constants";

// WHERE_OPTIONS lives here — it holds icon component references which belong
// in a client module, not in the shared lib/ layer.
const WHERE_OPTIONS = [
  { value: "anywhere",       label: "Anywhere",              Icon: Globe     },
  { value: "valencia",       label: "Valencia, Spain",       Icon: TreePalm  },
  { value: "lisbon",         label: "Lisbon, Portugal",      Icon: Anchor    },
  { value: "dubai",          label: "Dubai, UAE",            Icon: Building2 },
  { value: "chiang-mai-th",  label: "Chiang Mai, Thailand",  Icon: Mountain  },
  { value: "koh-phangan-th", label: "Koh Phangan, Thailand", Icon: Waves     },
  { value: "koh-samui-th",   label: "Koh Samui, Thailand",   Icon: Umbrella  },
] as const;

export default function SearchBar() {
  const [destination, setDestination] = useState("anywhere");
  const [duration,    setDuration]    = useState("");
  const [guests,      setGuests]      = useState<GuestCounts>({ adults: 1, infants: 0, children: 0, teens: 0 });
  const [openPanel,   setOpenPanel]   = useState<OpenPanel>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const togglePanel = useCallback((panel: OpenPanel) => {
    setOpenPanel(prev => (prev === panel ? null : panel));
  }, []);

  const updateGuest = useCallback((key: keyof GuestCounts, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [key]: Math.max(key === "adults" ? 1 : 0, prev[key] + delta),
    }));
  }, []);

  // ── Derived display labels ────────────────────────────────────────────────
  const whereLabel = WHERE_OPTIONS.find(o => o.value === destination)?.label ?? "Anywhere";

  const totalKids  = guests.infants + guests.children + guests.teens;
  const whoLabel   = guests.adults === 1 && totalKids === 0
    ? "Add guests"
    : `${guests.adults} adult${guests.adults > 1 ? "s" : ""}${
        totalKids > 0 ? `, ${totalKids} child${totalKids > 1 ? "ren" : ""}` : ""
      }`;

  const durationLabel = DURATION_OPTIONS.find(o => o.value === duration)?.label ?? "Add dates";

  // ── Shared class helpers ──────────────────────────────────────────────────
  const sectionBtn = (panel: OpenPanel) =>
    `w-full flex flex-col text-left px-6 py-3.5 rounded-full transition-colors ${
      openPanel === panel ? "bg-white/70" : "hover:bg-white/50"
    }`;

  return (
    // z-50 ensures all popovers float above the hero content and the card section
    <div ref={ref} className="relative z-50 mx-auto w-full max-w-4xl">
      <div className="flex items-center rounded-full border border-white/30 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">

        {/* ── WHERE ──────────────────────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          <button onClick={() => togglePanel("where")} className={sectionBtn("where")}>
            <span className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">Where</span>
            <span className="truncate text-base font-semibold text-slate-800">{whereLabel}</span>
          </button>

          {openPanel === "where" && (
            <div className="absolute left-0 top-full mt-4 w-72 rounded-3xl border border-gray-100 bg-white p-3 shadow-2xl">
              {WHERE_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => { setDestination(value); setOpenPanel(null); }}
                  className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-10 w-px shrink-0 bg-gray-300/70" />

        {/* ── WHO ────────────────────────────────────────────────────────── */}
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

        {/* ── DURATION ───────────────────────────────────────────────────── */}
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

        {/* ── EXPLORE ────────────────────────────────────────────────────── */}
        <div className="shrink-0 pl-1 pr-1">
          <button className="flex items-center gap-2 rounded-full bg-[#FF5A5F] px-7 py-4 font-bold text-white shadow-lg shadow-[#FF5A5F]/30 transition-all hover:bg-[#e84a4f] active:scale-95">
            <Search size={17} />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
