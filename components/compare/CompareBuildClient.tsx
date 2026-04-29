"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Search, Check, ChevronRight, ArrowLeft } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import type { FamilySize, WorkSituation, Priority } from "@/lib/scoring";
import { PRIORITY_LABELS, PRIORITY_ICONS } from "@/lib/scoring";

const ALL_CITIES = citiesData as Destination[];
const ALL_PRIORITIES: Priority[] = ["cost", "safety", "schools", "weather", "lifestyle"];

const BUDGET_MIN = 1500;
const BUDGET_MAX = 20000;
const BUDGET_DEFAULT = 5000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(val: number): string {
  if (val >= BUDGET_MAX) return "$20,000+";
  return `$${val.toLocaleString()}`;
}

function buildResultsUrl(
  selectedIds: string[],
  budget: number,
  familySize: FamilySize,
  work: WorkSituation,
  priorities: Priority[],
): string {
  const params = new URLSearchParams({
    cities: selectedIds.join(","),
    budget: String(budget),
    family: familySize,
    work,
    priorities: priorities.join(","),
  });
  return `/compare/results?${params.toString()}`;
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2].map((n) => (
        <div
          key={n}
          className={`h-2 rounded-full transition-all duration-300 ${
            n === step
              ? "w-6 bg-[#FF5A5F]"
              : n < step
                ? "w-2 bg-[#FF5A5F]/50"
                : "w-2 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// ── City chip ─────────────────────────────────────────────────────────────────

function CityChip({
  city,
  selected,
  disabled,
  onClick,
}: {
  city: Destination;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
        selected
          ? "border-[#FF5A5F] bg-[#FF5A5F]/5 shadow-sm"
          : disabled
            ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-40"
            : "border-slate-200 bg-white hover:border-[#FF5A5F]/40 hover:shadow-sm"
      }`}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5A5F]">
          <Check size={10} strokeWidth={3} className="text-white" />
        </span>
      )}
      <div className="min-w-0">
        <p
          className={`truncate text-sm font-semibold ${
            selected ? "text-[#FF5A5F]" : "text-slate-800"
          }`}
        >
          {city.city}
        </p>
        <p className="truncate text-xs text-slate-400">{city.country}</p>
      </div>
    </button>
  );
}

// ── Option button ─────────────────────────────────────────────────────────────

function OptionBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-150 ${
        active
          ? "border-[#FF5A5F] bg-[#FF5A5F]/5 text-[#FF5A5F] shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CompareBuildClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Step 2
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [familySize, setFamilySize] = useState<FamilySize>("family");
  const [work, setWork] = useState<WorkSituation>("remote");
  const [priorities, setPriorities] = useState<Priority[]>(["cost", "safety"]);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return ALL_CITIES;
    const q = query.toLowerCase();
    return ALL_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [query]);

  function toggleCity(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function togglePriority(p: Priority) {
    setPriorities((prev) => {
      if (prev.includes(p)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== p);
      }
      if (prev.length >= 3) return [...prev.slice(1), p];
      return [...prev, p];
    });
  }

  function handleSubmit() {
    const url = buildResultsUrl(selectedIds, budget, familySize, work, priorities);
    router.push(url);
  }

  const selectedCities = ALL_CITIES.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={13} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              FamiRelo
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <StepDots step={step} />
            <span className="text-xs font-medium text-slate-400">
              Step {step} of 2
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* ── Step 1: Pick cities ─────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                  Which cities are you considering?
                </h1>
                <p className="mt-2 text-slate-500">
                  Pick 2 or 3 cities to compare. We&apos;ll score them against your situation.
                </p>
              </div>
              {/* Top Next button — visible when enough cities are selected */}
              {selectedIds.length >= 2 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f]"
                >
                  Next
                  <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Selected pills */}
            {selectedCities.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {selectedCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCity(c.id)}
                    className="flex items-center gap-1.5 rounded-full border border-[#FF5A5F]/30 bg-[#FF5A5F]/8 px-3 py-1.5 text-xs font-semibold text-[#FF5A5F] transition-opacity hover:opacity-70"
                  >
                    {c.city}
                    <span className="text-[#FF5A5F]/60">×</span>
                  </button>
                ))}
                <span className="self-center text-xs font-medium text-slate-400">
                  {selectedCities.length}/3 selected
                </span>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-5">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search cities or countries…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
              />
            </div>

            {/* City grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredCities.map((city) => (
                <CityChip
                  key={city.id}
                  city={city}
                  selected={selectedIds.includes(city.id)}
                  disabled={selectedIds.length >= 3}
                  onClick={() => toggleCity(city.id)}
                />
              ))}
            </div>

            {filteredCities.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-400">
                No cities match &ldquo;{query}&rdquo;
              </p>
            )}

            {/* Bottom Next */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedIds.length < 2}
                className="flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Questionnaire ───────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Tell us about your situation
              </h1>
              <p className="mt-2 text-slate-500">
                We use this to weight the comparison to what matters for{" "}
                <em>you</em>.
              </p>
            </div>

            <div className="space-y-8">
              {/* Budget */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800">
                    Monthly budget (family, all-in)
                  </label>
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
                    {formatBudget(budget)}
                    {budget >= BUDGET_MAX ? "" : " / mo"}
                  </span>
                </div>
                <input
                  type="range"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#FF5A5F]"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-400">
                  <span>$1,500</span>
                  <span>$20,000+</span>
                </div>
              </div>

              {/* Family size */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Family situation
                </label>
                <div className="flex gap-2">
                  <OptionBtn
                    active={familySize === "solo"}
                    onClick={() => setFamilySize("solo")}
                  >
                    Just me
                  </OptionBtn>
                  <OptionBtn
                    active={familySize === "couple"}
                    onClick={() => setFamilySize("couple")}
                  >
                    Couple
                  </OptionBtn>
                  <OptionBtn
                    active={familySize === "family"}
                    onClick={() => setFamilySize("family")}
                  >
                    With kids
                  </OptionBtn>
                </div>
              </div>

              {/* Work situation */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Work situation
                </label>
                <div className="flex gap-2">
                  <OptionBtn
                    active={work === "remote"}
                    onClick={() => setWork("remote")}
                  >
                    Remote work
                  </OptionBtn>
                  <OptionBtn
                    active={work === "local"}
                    onClick={() => setWork("local")}
                  >
                    Local job
                  </OptionBtn>
                  <OptionBtn
                    active={work === "freelance"}
                    onClick={() => setWork("freelance")}
                  >
                    Freelance
                  </OptionBtn>
                </div>
              </div>

              {/* Priorities */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-800">
                  What matters most to you?
                </label>
                <p className="mb-3 text-xs text-slate-400">
                  Pick up to 3 — order matters (first = highest weight)
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {ALL_PRIORITIES.map((p, i) => {
                    const rank = priorities.indexOf(p);
                    const selected = rank !== -1;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePriority(p)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                          selected
                            ? "border-[#FF5A5F] bg-[#FF5A5F]/5"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl">{PRIORITY_ICONS[p]}</span>
                        <span
                          className={`text-sm font-semibold ${selected ? "text-[#FF5A5F]" : "text-slate-700"}`}
                        >
                          {PRIORITY_LABELS[p]}
                        </span>
                        {selected && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5A5F] text-[10px] font-bold text-white">
                            {rank + 1}
                          </span>
                        )}
                        {!selected && i === 0 && priorities.length < 3 && (
                          <span className="ml-auto text-xs text-slate-300">+ add</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected cities recap */}
            <div className="mt-8 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Comparing
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700"
                  >
                    {c.city}, {c.country}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit row — Back on left, Submit on right */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft size={15} />
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f]"
              >
                See my comparison
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
