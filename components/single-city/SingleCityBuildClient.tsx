"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Check, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import type {
  FamilySize,
  WorkSituation,
  Priority,
  KidsAge,
  NumKids,
} from "@/lib/scoring";
import { PRIORITY_LABELS, PRIORITY_ICONS } from "@/lib/scoring";

const ALL_CITIES = citiesData as Destination[];
const ALL_PRIORITIES: Priority[] = ["cost", "safety", "schools", "weather", "lifestyle"];

const BUDGET_MIN = 1500;
const BUDGET_MAX = 20000;
const BUDGET_DEFAULT = 5000;

function formatBudget(val: number): string {
  if (val >= BUDGET_MAX) return "$20,000+";
  return `$${val.toLocaleString()}`;
}

function buildResultsUrl(
  cityId: string,
  budget: number,
  familySize: FamilySize,
  work: WorkSituation,
  priorities: Priority[],
  numKids: NumKids,
  kidsAge: KidsAge,
): string {
  const params = new URLSearchParams({
    city: cityId,
    budget: String(budget),
    family: familySize,
    work,
    priorities: priorities.join(","),
  });
  if (familySize === "family") {
    params.set("kids", String(numKids));
    params.set("kidsage", kidsAge);
  }
  return `/single-city/results?${params.toString()}`;
}

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

function CityChip({
  city,
  selected,
  onClick,
}: {
  city: Destination;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
        selected
          ? "border-[#FF5A5F] bg-[#FF5A5F]/5 shadow-sm"
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
      className={`flex-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-all duration-150 md:px-4 md:text-sm ${
        active
          ? "border-[#FF5A5F] bg-[#FF5A5F]/5 text-[#FF5A5F] shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function SingleCityBuildClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);

  // Pre-seed from ?city=... deep links from individual city pages.
  // We accept the first valid id only (single-city = single).
  const initialCityId = useMemo(() => {
    const raw = searchParams?.get("city") ?? "";
    if (!raw) return null;
    const validIds = new Set(ALL_CITIES.map((c) => c.id));
    const first = raw.split(",")[0]?.trim();
    return first && validIds.has(first) ? first : null;
  }, [searchParams]);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialCityId);

  // Step 2
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [familySize, setFamilySize] = useState<FamilySize>("family");
  const [numKids, setNumKids] = useState<NumKids>(1);
  const [kidsAge, setKidsAge] = useState<KidsAge>("primary");
  const [work, setWork] = useState<WorkSituation>("remote");
  const [priorities, setPriorities] = useState<Priority[]>(["cost", "safety"]);

  // Credit balance — shown only when the user already paid for a bundle and
  // has unused credits. This lets them redeem instead of paying again.
  const [credits, setCredits] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/credits/balance")
      .then((r) => (r.ok ? r.json() : { remaining: 0 }))
      .then((d) => {
        if (!cancelled) setCredits(d.remaining ?? 0);
      })
      .catch(() => {
        if (!cancelled) setCredits(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return ALL_CITIES;
    const q = query.toLowerCase();
    return ALL_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [query]);

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
    if (!selectedId) return;
    const url = buildResultsUrl(
      selectedId,
      budget,
      familySize,
      work,
      priorities,
      numKids,
      kidsAge,
    );
    router.push(url);
  }

  const selectedCity = selectedId
    ? ALL_CITIES.find((c) => c.id === selectedId)
    : null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <StepDots step={step} />
            <span className="text-xs font-medium text-slate-400">
              Step {step} of 2
            </span>
          </div>
        </div>
      </nav>

      {/* pb-28 reserves room for the sticky action bar */}
      <div className="mx-auto max-w-3xl px-4 py-8 pb-28 md:py-12 md:pb-32">
        {/* Credit-holder banner — bundle buyers can spend a credit on a
            single-city report just like on a comparison. */}
        {credits !== null && credits > 0 && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 md:mb-8">
            <Sparkles size={16} className="shrink-0 text-emerald-600" />
            <span>
              <span className="font-bold">
                You have {credits} credit{credits === 1 ? "" : "s"} left
              </span>{" "}
              from your bundle — this report unlocks free.
            </span>
          </div>
        )}

        {/* ── Step 1: Pick the city ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-6 md:mb-8">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
                Should we move here?
              </p>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Which city are you considering?
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 md:mt-2 md:text-base">
                Pick the one city you want a personalized fit report for.
              </p>
            </div>

            {/* Selected pill */}
            {selectedCity && (
              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-1.5 rounded-full border border-[#FF5A5F]/30 bg-[#FF5A5F]/8 px-3 py-1.5 text-xs font-semibold text-[#FF5A5F] transition-opacity hover:opacity-70"
                >
                  {selectedCity.city}, {selectedCity.country}
                  <span className="text-[#FF5A5F]/60">×</span>
                </button>
                <span className="self-center text-xs font-medium text-slate-400">
                  Pick a different city to change
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
                  selected={selectedId === city.id}
                  onClick={() => setSelectedId(city.id)}
                />
              ))}
            </div>

            {filteredCities.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-400">
                No cities match &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* ── Step 2: Questionnaire ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Tell us about your situation
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 md:mt-2 md:text-base">
                We use this to score how well{" "}
                {selectedCity?.city ?? "this city"} fits{" "}
                <em>your</em> family — and which visa paths match your profile.
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
                  <OptionBtn active={familySize === "solo"} onClick={() => setFamilySize("solo")}>
                    Just me
                  </OptionBtn>
                  <OptionBtn active={familySize === "couple"} onClick={() => setFamilySize("couple")}>
                    Couple
                  </OptionBtn>
                  <OptionBtn active={familySize === "family"} onClick={() => setFamilySize("family")}>
                    With kids
                  </OptionBtn>
                </div>

                {familySize === "family" && (
                  <div className="mt-4 space-y-4 rounded-xl border border-slate-100 bg-stone-50 px-4 py-4">
                    <div>
                      <p className="mb-2 text-xs font-bold text-slate-600">
                        How many kids?
                      </p>
                      <div className="flex gap-2">
                        {([1, 2, 3] as NumKids[]).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setNumKids(n)}
                            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                              numKids === n
                                ? "border-[#FF5A5F] bg-[#FF5A5F]/8 text-[#FF5A5F]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {n === 3 ? "3+" : n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold text-slate-600">
                        Youngest child&apos;s stage?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            { value: "preschool", label: "Under 5", sub: "nanny / daycare" },
                            { value: "primary", label: "Ages 5–12", sub: "primary school" },
                            { value: "secondary", label: "Ages 13+", sub: "secondary / IB" },
                          ] as { value: KidsAge; label: string; sub: string }[]
                        ).map(({ value, label, sub }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setKidsAge(value)}
                            className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all ${
                              kidsAge === value
                                ? "border-[#FF5A5F] bg-[#FF5A5F]/8"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span
                              className={`text-xs font-bold ${
                                kidsAge === value ? "text-[#FF5A5F]" : "text-slate-700"
                              }`}
                            >
                              {label}
                            </span>
                            <span className="text-[10px] text-slate-400">{sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Work situation */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Work situation
                </label>
                <div className="flex gap-2">
                  <OptionBtn active={work === "remote"} onClick={() => setWork("remote")}>
                    Remote work
                  </OptionBtn>
                  <OptionBtn active={work === "local"} onClick={() => setWork("local")}>
                    Local job
                  </OptionBtn>
                  <OptionBtn active={work === "freelance"} onClick={() => setWork("freelance")}>
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

            {/* Selected city recap */}
            <div className="mt-8 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Reporting on
              </p>
              {selectedCity && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                  {selectedCity.city}, {selectedCity.country}
                </span>
              )}
            </div>

            {/* In-page submit row (Back + Submit) */}
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
                See my report
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky action bar — same pattern as /compare/build, prevents Next/
          Submit from disappearing off-screen during a long page scroll. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[80] border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-transform duration-200 ${
          (step === 1 && selectedId) || step === 2
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <div className="min-w-0 flex-1">
            {step === 1 ? (
              <p className="truncate text-xs font-semibold text-slate-700 md:text-sm">
                {selectedCity ? (
                  <>
                    Selected:{" "}
                    <span className="text-[#FF5A5F]">
                      {selectedCity.city}, {selectedCity.country}
                    </span>
                  </>
                ) : (
                  "Pick a city to continue"
                )}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 md:text-sm"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
            disabled={step === 1 && !selectedId}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-40 md:gap-2 md:px-6 md:py-3"
          >
            {step === 1 ? "Next" : "See my report"}
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
