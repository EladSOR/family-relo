"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Lock, ArrowLeft, Share2, Check } from "lucide-react";
import { useMemo, useState } from "react";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import {
  scoreCity,
  PRIORITY_LABELS,
  budgetFitLabel,
  type UserInputs,
  type CityScore,
  type Priority,
  type FamilySize,
  type WorkSituation,
  type KidsAge,
  type NumKids,
} from "@/lib/scoring";

const ALL_CITIES = citiesData as Destination[];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePriorities(raw: string): Priority[] {
  const valid: Priority[] = ["cost", "safety", "schools", "weather", "lifestyle"];
  return raw
    .split(",")
    .filter((p): p is Priority => valid.includes(p as Priority));
}

function formatBudget(n: number): string {
  return `$${n.toLocaleString()}`;
}

function matchColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 65) return "text-blue-600";
  if (pct >= 50) return "text-amber-600";
  return "text-rose-500";
}

function matchBg(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 65) return "bg-blue-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-rose-400";
}

function dimColor(score: number): string {
  if (score >= 78) return "bg-emerald-500";
  if (score >= 62) return "bg-blue-400";
  if (score >= 46) return "bg-amber-400";
  return "bg-rose-400";
}

function budgetFitStyle(fit: CityScore["budgetFit"]): string {
  switch (fit) {
    case "comfortable":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "fits":
      return "text-blue-700 bg-blue-50 border-blue-200";
    case "tight":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "over":
      return "text-rose-700 bg-rose-50 border-rose-200";
  }
}

function dimensionLabel(key: string): string {
  return PRIORITY_LABELS[key as Priority] ?? key;
}

const DIM_KEYS: (keyof CityScore["dimensions"])[] = [
  "cost",
  "safety",
  "schools",
  "weather",
  "lifestyle",
];

// ── Sub-components ────────────────────────────────────────────────────────────

// ── Preview content (full report) ─────────────────────────────────────────────

function fitBadge(score: number): { label: string; cls: string } {
  if (score >= 78) return { label: "Strong fit", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 62) return { label: "Good fit", cls: "bg-blue-50 text-blue-700 border-blue-200" };
  if (score >= 46) return { label: "Mixed fit", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Limited fit", cls: "bg-rose-50 text-rose-700 border-rose-200" };
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const dots = score >= 78 ? 5 : score >= 62 ? 4 : score >= 46 ? 3 : score >= 30 ? 2 : 1;
  const color =
    score >= 78
      ? "bg-emerald-500"
      : score >= 62
        ? "bg-blue-500"
        : score >= 46
          ? "bg-amber-400"
          : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-1.5 w-3 rounded-sm ${n <= dots ? color : "bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

function VerdictBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-xl border border-[#FF5A5F]/15 bg-[#FF5A5F]/5 px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A5F]">
        Verdict
      </p>
      <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-800">
        {children}
      </p>
    </div>
  );
}

function PreviewContent({
  scores,
  cols,
  budget,
  familyLabel,
  workLabel,
}: {
  scores: CityScore[];
  cols: number;
  budget: number;
  familyLabel: string;
  workLabel: string;
}) {
  const gridCls = cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

  // Section winners
  const lifestyleWinner = [...scores].sort((a, b) => b.dimensions.lifestyle - a.dimensions.lifestyle)[0];
  const schoolsWinner = [...scores].sort((a, b) => b.dimensions.schools - a.dimensions.schools)[0];

  return (
    <>
      {/* ── Family fit ──────────────────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-1 text-base font-bold text-slate-900">
          Family fit analysis
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          How each city matches a {familyLabel.toLowerCase()} on {workLabel}.
        </p>

        <div className={`grid gap-5 ${gridCls}`}>
          {scores.map((s) => {
            const badge = fitBadge(s.dimensions.lifestyle);
            return (
              <div
                key={s.city.id}
                className="rounded-xl border border-slate-100 bg-stone-50/50 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-base font-extrabold text-slate-900">
                    {s.city.city}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Top strengths
                </p>
                <ul className="mb-4 space-y-2">
                  {s.city.familyFit.bestFor.slice(0, 2).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-snug text-slate-700"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  Watch out for
                </p>
                <ul className="space-y-2">
                  {s.city.familyFit.watchOutFor.slice(0, 2).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-snug text-slate-700"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <VerdictBox>
          <strong>{lifestyleWinner.city.city}</strong> is the strongest lifestyle
          fit for your situation, scoring{" "}
          <strong>{lifestyleWinner.dimensions.lifestyle}/100</strong> on family
          and work compatibility.
        </VerdictBox>
      </section>

      {/* ── Schools ─────────────────────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-1 text-base font-bold text-slate-900">
          Schools &amp; childcare
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          The data on international options, curricula, and timing.
        </p>

        <div className={`grid gap-5 ${gridCls}`}>
          {scores.map((s) => {
            const optionCount = s.city.schools.options?.length ?? 0;
            return (
              <div
                key={s.city.id}
                className="rounded-xl border border-slate-100 bg-stone-50/50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-base font-extrabold text-slate-900">
                    {s.city.city}
                  </p>
                  <StrengthMeter score={s.dimensions.schools} label="" />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Options
                    </p>
                    <p className="mt-0.5 text-base font-extrabold text-slate-900">
                      {optionCount > 0 ? `${optionCount} types` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Score
                    </p>
                    <p className="mt-0.5 text-base font-extrabold text-slate-900">
                      {s.dimensions.schools}
                      <span className="ml-1 text-xs font-medium text-slate-400">
                        /100
                      </span>
                    </p>
                  </div>
                </div>

                {s.city.schools.tip ? (
                  <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm font-medium leading-snug text-amber-900">
                    ⚡ {s.city.schools.tip}
                  </div>
                ) : (
                  <p className="text-sm leading-snug text-slate-600">
                    {s.city.schools.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <VerdictBox>
          <strong>{schoolsWinner.city.city}</strong> has the strongest school
          options for your needs ({schoolsWinner.dimensions.schools}/100).
          {schoolsWinner.city.schools.tip
            ? " Apply early — waitlists are real."
            : ""}
        </VerdictBox>
      </section>

      {/* ── Residency & visa ────────────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-1 text-base font-bold text-slate-900">
          Residency &amp; first steps
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          The most important things to do when you arrive.
        </p>

        <div className={`grid gap-5 ${gridCls}`}>
          {scores.map((s) => (
            <div
              key={s.city.id}
              className="rounded-xl border border-slate-100 bg-stone-50/50 p-5"
            >
              <p className="mb-3 text-base font-extrabold text-slate-900">
                {s.city.city}
              </p>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#FF5A5F]">
                Top 2 things to do first
              </p>
              <ol className="mb-3 space-y-2.5">
                {s.city.residency.items.slice(0, 2).map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-snug text-slate-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5A5F]/10 text-[10px] font-bold text-[#FF5A5F]">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              {s.city.residency.tip && (
                <p className="border-t border-slate-200 pt-3 text-sm italic leading-snug text-slate-500">
                  {s.city.residency.tip}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final verdict ───────────────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm md:p-8">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
          Our final verdict
        </p>
        <h2 className="mb-2 text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
          {scores[0].city.city} is your best match
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          Based on your <strong>{formatBudget(budget)}/mo budget</strong>,{" "}
          <strong>{familyLabel.toLowerCase()}</strong> situation, and{" "}
          <strong>{workLabel}</strong>, here&apos;s how each city stacks up:
        </p>

        <div className="space-y-3">
          {scores.map((s, i) => (
            <div
              key={s.city.id}
              className={`flex items-start gap-4 rounded-xl border p-4 ${
                i === 0
                  ? "border-emerald-200 bg-white shadow-sm"
                  : "border-slate-100 bg-white/70"
              }`}
            >
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                    i === 0
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  #{i + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-base font-extrabold text-slate-900">
                    {s.city.city}
                  </p>
                  <span
                    className={`text-base font-black ${matchColor(s.matchPct)}`}
                  >
                    {s.matchPct}% match
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {s.budgetFit === "comfortable"
                    ? `Budget fits comfortably — ~${formatBudget(budget - s.budgetMid)} headroom each month.`
                    : s.budgetFit === "fits"
                      ? "Budget is a close fit — little margin, plan carefully."
                      : s.budgetFit === "tight"
                        ? "Budget is tight — consider a lower-cost neighborhood."
                        : "This city likely exceeds your budget."}{" "}
                  Best for: {s.city.familyFit.bestFor[0].toLowerCase()}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function MatchCard({
  score,
  rank,
  cols,
}: {
  score: CityScore;
  rank: number;
  cols: number;
}) {
  const isBest = rank === 0;
  return (
    <div
      className={`flex min-w-0 flex-col items-center rounded-2xl border p-3 text-center shadow-sm transition-all md:p-5 ${
        isBest
          ? "border-[#FF5A5F]/30 bg-gradient-to-b from-[#FF5A5F]/5 to-white"
          : "border-slate-100 bg-white"
      }`}
    >
      {isBest ? (
        <span className="mb-1.5 inline-block whitespace-nowrap rounded-full bg-[#FF5A5F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white md:px-3 md:text-[10px]">
          Best match
        </span>
      ) : (
        <span className="mb-1.5 block h-[18px]" aria-hidden="true" />
      )}
      <p className="mb-0.5 w-full truncate text-sm font-extrabold text-slate-900 md:text-base">
        {score.city.city}
      </p>
      <p className="mb-3 w-full truncate text-[11px] font-medium text-slate-400 md:mb-4 md:text-xs">
        {score.city.country}
      </p>
      <div
        className={`mb-0.5 text-3xl font-black tabular-nums md:mb-1 md:text-5xl ${matchColor(score.matchPct)}`}
      >
        {score.matchPct}%
      </div>
      <p className="text-[10px] font-semibold text-slate-400 md:text-xs">
        match for you
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 md:mt-4">
        <div
          className={`h-full rounded-full transition-all ${matchBg(score.matchPct)}`}
          style={{ width: `${score.matchPct}%` }}
        />
      </div>
      <span
        className={`mt-2.5 inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold md:mt-3 md:px-3 md:text-xs ${budgetFitStyle(score.budgetFit)}`}
      >
        {budgetFitLabel(score.budgetFit)}
      </span>
    </div>
  );
}

function DimBar({
  score,
  label,
}: {
  score: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 8 }}>
        <div
          className={`h-full rounded-full ${dimColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-xs font-bold tabular-nums text-slate-600">
        {score}
      </span>
      {label && (
        <span className="hidden w-20 shrink-0 text-right text-xs text-slate-400 sm:block">
          {label}
        </span>
      )}
    </div>
  );
}

// ── Blurred section placeholder ───────────────────────────────────────────────

function BlurredRow({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-4 rounded-md bg-slate-200"
      style={{ width }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CompareResultsClient() {
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);

  const cityIds = (params.get("cities") ?? "").split(",").filter(Boolean);
  const budget = Number(params.get("budget") ?? 5000);
  const familySize = (params.get("family") ?? "family") as FamilySize;
  const work = (params.get("work") ?? "remote") as WorkSituation;
  const priorities = parsePriorities(params.get("priorities") ?? "cost,safety");
  const isPreview = params.get("preview") === "true";

  const rawKids = params.get("kids");
  const rawKidsAge = params.get("kidsage");
  const numKids: NumKids | undefined =
    familySize === "family" && rawKids
      ? (Math.min(3, Math.max(1, Number(rawKids))) as NumKids)
      : undefined;
  const kidsAge: KidsAge | undefined =
    familySize === "family" && rawKidsAge
      ? (["preschool", "primary", "secondary"].includes(rawKidsAge)
          ? (rawKidsAge as KidsAge)
          : "primary")
      : undefined;

  const inputs: UserInputs = { budget, familySize, workSituation: work, priorities, numKids, kidsAge };

  const scores: CityScore[] = useMemo(() => {
    const cities = cityIds
      .map((id) => ALL_CITIES.find((c) => c.id === id))
      .filter((c): c is Destination => Boolean(c));
    return cities.map((c) => scoreCity(c, inputs)).sort((a, b) => b.matchPct - a.matchPct);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const cols = scores.length;

  if (scores.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <p className="mb-4 text-slate-500">No cities found. Please start over.</p>
        <Link
          href="/compare/build"
          className="rounded-xl bg-[#FF5A5F] px-6 py-3 text-sm font-bold text-white"
        >
          Start comparison
        </Link>
      </div>
    );
  }

  const kidsAgeLabel: Record<KidsAge, string> = {
    preschool: "under 5",
    primary: "ages 5–12",
    secondary: "ages 13+",
  };

  const familyLabel =
    familySize === "solo"
      ? "Solo"
      : familySize === "couple"
        ? "Couple"
        : numKids && kidsAge
          ? `Family · ${numKids === 3 ? "3+" : numKids} kid${numKids > 1 ? "s" : ""} ${kidsAgeLabel[kidsAge]}`
          : "Family with kids";

  const workLabel =
    work === "remote" ? "remote work" : work === "local" ? "local job" : "freelance";

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const cityNames = scores.map((s) => s.city.city).join(" · ");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={13} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              FamiRelo
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  Share
                </>
              )}
            </button>
            <Link
              href="/compare/build"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft size={13} />
              Edit
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
        {/* Report header */}
        <div className="mb-6 md:mb-8">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F] md:text-xs">
            Your City Comparison Report
          </p>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            {cityNames}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {familyLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {formatBudget(budget)}/mo
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {workLabel}
            </span>
            {priorities.slice(0, 2).map((p) => (
              <span
                key={p}
                className="rounded-full border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-2.5 py-1 text-[11px] font-semibold text-[#FF5A5F]"
              >
                {PRIORITY_LABELS[p]}
              </span>
            ))}
          </div>
        </div>

        {/* ── Match score cards ──────────────────────────────────────────── */}
        <section className="mb-8">
          <div
            className={`grid gap-2 md:gap-4 ${
              cols === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {scores.map((s, i) => (
              <MatchCard key={s.city.id} score={s} rank={i} cols={cols} />
            ))}
          </div>
        </section>

        {/* ── Dimension breakdown ────────────────────────────────────────── */}
        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
            Score breakdown
          </h2>

          {/* ── Mobile layout: one card per dimension ─────────────────── */}
          <div className="space-y-4 md:hidden">
            {DIM_KEYS.map((key) => (
              <div key={key}>
                <p className="mb-2 text-xs font-bold text-slate-700">
                  {dimensionLabel(key)}
                </p>
                <div className="space-y-1.5">
                  {scores.map((s) => (
                    <div key={s.city.id} className="flex items-center gap-2">
                      <p className="w-20 shrink-0 truncate text-[11px] font-medium text-slate-500">
                        {s.city.city}
                      </p>
                      <DimBar score={s.dimensions[key]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop layout: traditional grid table ────────────────── */}
          <div className="hidden md:block">
            <div
              className={`mb-4 grid gap-4 ${
                cols === 2
                  ? "grid-cols-[140px_1fr_1fr]"
                  : "grid-cols-[140px_1fr_1fr_1fr]"
              }`}
            >
              <div />
              {scores.map((s) => (
                <p
                  key={s.city.id}
                  className="truncate text-center text-xs font-bold text-slate-600"
                >
                  {s.city.city}
                </p>
              ))}
            </div>

            {DIM_KEYS.map((key) => (
              <div
                key={key}
                className={`mb-3 grid items-center gap-4 ${
                  cols === 2
                    ? "grid-cols-[140px_1fr_1fr]"
                    : "grid-cols-[140px_1fr_1fr_1fr]"
                }`}
              >
                <p className="text-xs font-semibold text-slate-500">
                  {dimensionLabel(key)}
                </p>
                {scores.map((s) => (
                  <DimBar key={s.city.id} score={s.dimensions[key]} />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Budget fit ─────────────────────────────────────────────────── */}
        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
            Your {formatBudget(budget)}/month budget
          </h2>
          <div className="space-y-3">
            {scores.map((s) => {
              const headroom = budget - s.budgetMid;
              return (
                <div
                  key={s.city.id}
                  className="rounded-xl border border-slate-100 p-3"
                >
                  {/* Top row: city + status badge */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {s.city.city}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        ~{formatBudget(s.budgetMin)}–{formatBudget(s.budgetMax)}/mo avg
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${budgetFitStyle(s.budgetFit)}`}
                    >
                      {budgetFitLabel(s.budgetFit)}
                    </span>
                  </div>

                  {/* Kids cost estimate */}
                  {s.kidsMonthlyEstimate !== undefined && (
                    <div className="mb-2 flex items-center justify-between rounded-lg bg-amber-50 px-2.5 py-1.5">
                      <span className="text-[11px] font-medium text-amber-700">
                        + est. school / childcare
                      </span>
                      <span className="text-[11px] font-bold text-amber-800">
                        ~{formatBudget(s.kidsMonthlyEstimate)}/mo
                      </span>
                    </div>
                  )}

                  {/* Bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${matchBg(s.dimensions.cost)}`}
                      style={{
                        width: `${Math.min(100, (budget / (s.budgetMax * 1.4)) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Headroom note */}
                  {headroom > 0 && s.budgetFit !== "over" && (
                    <p className="mt-1.5 text-[11px] font-medium text-slate-500">
                      ~{formatBudget(headroom)} headroom each month
                      {s.kidsMonthlyEstimate !== undefined && " (before kids costs)"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Full content (preview) or Blurred paywall ─────────────────── */}
        {isPreview ? (
          <PreviewContent
            scores={scores}
            cols={cols}
            budget={budget}
            familyLabel={familyLabel}
            workLabel={workLabel}
          />
        ) : (
          <div className="relative">
            {/* Blurred placeholder sections */}
            <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Family fit analysis
                </h2>
                <div className={`grid gap-6 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {scores.map((s) => (
                    <div key={s.city.id}>
                      <p className="mb-3 text-xs font-bold text-slate-600">{s.city.city}</p>
                      <div className="space-y-2">
                        {[["bg-emerald-400","80%"],["bg-emerald-400","65%"],["bg-amber-400","75%"],["bg-amber-400","55%"]].map(([color, w], i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />
                            <BlurredRow width={w} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Visa &amp; work path
                </h2>
                <div className={`grid gap-6 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {scores.map((s) => (
                    <div key={s.city.id} className="space-y-2">
                      <BlurredRow width="90%" /><BlurredRow width="70%" /><BlurredRow width="80%" />
                    </div>
                  ))}
                </div>
              </section>
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Schools deep-dive
                </h2>
                <div className={`grid gap-6 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {scores.map((s) => (
                    <div key={s.city.id} className="space-y-2">
                      <BlurredRow width="85%" /><BlurredRow width="60%" /><BlurredRow width="75%" />
                    </div>
                  ))}
                </div>
              </section>
              <section className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Our verdict for you
                </h2>
                <BlurredRow width="95%" /><div className="mt-2" />
                <BlurredRow width="80%" /><div className="mt-2" />
                <BlurredRow width="60%" />
              </section>
            </div>

            {/* Coming soon paywall card */}
            <div className="absolute inset-0 flex items-start justify-center pt-10">
              <div className="mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Lock size={22} className="text-slate-500" />
                </div>
                <h3 className="mb-2 text-lg font-extrabold tracking-tight text-slate-900">
                  Full report coming soon
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  We&apos;re adding Family Fit, Visa Analysis, Schools deep-dive,
                  and a personalized verdict — one payment, yours forever, shareable with anyone.
                </p>
                <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    What&apos;s included
                  </p>
                  <ul className="mt-3 space-y-1.5 text-left text-xs font-medium text-slate-600">
                    {[
                      "Full family fit analysis per city",
                      "Visa & work permit path for your situation",
                      "Schools & childcare deep-dive",
                      "Shareable link — send to partner or family",
                      "Download as PDF",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5A5F]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-5 flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-black text-slate-900">$9</span>
                  <span className="text-sm text-slate-400">one-time · no subscription</span>
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-400"
                >
                  Get full report — launching soon
                </button>
                <p className="mt-3 text-xs text-slate-400">
                  Share this preview with your partner while you wait →{" "}
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                    className="font-semibold text-[#FF5A5F] underline"
                  >
                    copy link
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
