import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Check, Lock, ArrowRight, Share2, FileDown } from "lucide-react";
import CompareStickyBar from "@/components/compare/CompareStickyBar";
import {
  SITE_COMPARE_DESCRIPTION,
  SITE_COMPARE_OG_IMAGE,
  SITE_COMPARE_OG_IMAGE_ALT,
  SITE_COMPARE_OPEN_GRAPH_TITLE,
  SITE_COMPARE_TITLE,
} from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_COMPARE_TITLE,
  openGraphTitle: SITE_COMPARE_OPEN_GRAPH_TITLE,
  description: SITE_COMPARE_DESCRIPTION,
  canonicalPath: "/compare",
  images: [{ url: SITE_COMPARE_OG_IMAGE, alt: SITE_COMPARE_OG_IMAGE_ALT }],
});

const SAMPLE_CITIES = [
  { name: "Valencia", country: "Spain", match: 91, fit: "Comfortable", fitStyle: "text-emerald-700 bg-emerald-50" },
  { name: "Lisbon", country: "Portugal", match: 74, fit: "Fits budget", fitStyle: "text-blue-700 bg-blue-50" },
  { name: "Porto", country: "Portugal", match: 88, fit: "Comfortable", fitStyle: "text-emerald-700 bg-emerald-50" },
];

const DIMS = [
  { label: "Cost fit", scores: [96, 64, 88] },
  { label: "Safety", scores: [92, 90, 92] },
  { label: "Schools", scores: [80, 85, 65] },
  { label: "Weather", scores: [95, 90, 88] },
  { label: "Lifestyle", scores: [84, 72, 86] },
];

const INCLUDED = [
  "Personalized match score per city",
  "Score breakdown: cost, safety, schools, weather, lifestyle",
  "Budget fit analysis — what your money gets you",
  "Full family fit analysis (strengths & trade-offs)",
  "Visa & work permit path for your situation",
  "Schools & childcare deep-dive per city",
  "Shareable link — send to your partner or family",
  "Download as PDF",
];

function BarPreview({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 7 }}>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-500">
        {pct}
      </span>
    </div>
  );
}

function barColor(score: number) {
  if (score >= 78) return "bg-emerald-500";
  if (score >= 62) return "bg-blue-400";
  if (score >= 46) return "bg-amber-400";
  return "bg-rose-400";
}

export default function CompareLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={15} strokeWidth={2.5} />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              FamiRelo
            </span>
          </Link>
          <Link
            href="/compare/build"
            className="flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
          >
            Start comparing
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pb-16 pt-16 text-center md:pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-4 py-2 text-sm font-semibold text-[#FF5A5F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F]" />
            Coming soon · Free preview available now
          </div>
          <h1 className="mb-5 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Stop guessing.{" "}
            <span className="text-[#FF5A5F]">Compare cities</span>{" "}
            built for your family.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-500">
            Pick up to 3 cities, tell us your situation, and get a personalized
            report with match scores, budget fit, visa paths, and schools — not
            generic data, but weighted to{" "}
            <em className="font-semibold not-italic text-slate-700">you</em>.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/compare/build"
              className="flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#e84a4f] hover:shadow-xl"
            >
              Build your free preview
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="text-sm text-slate-400">
              No account needed · See results instantly
            </p>
          </div>
        </div>
      </section>

      {/* Report preview mockup */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 rounded-md bg-white border border-slate-200 px-3 py-1 text-center text-xs text-slate-400">
                famirelo.com/compare/results
              </div>
            </div>

            {/* Mock report content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#FF5A5F]">
                  Your City Comparison Report
                </p>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Valencia · Lisbon · Porto
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Family with kids · $6,000/mo · Remote work · Priority: Cost, Schools
                </p>
              </div>

              {/* Match score cards */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {SAMPLE_CITIES.map((c, i) => (
                  <div
                    key={c.name}
                    className={`relative rounded-xl border p-3 text-center ${
                      i === 0
                        ? "border-[#FF5A5F]/30 bg-[#FF5A5F]/5"
                        : "border-slate-100"
                    }`}
                  >
                    {i === 0 && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#FF5A5F] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        Best match
                      </span>
                    )}
                    <p className="truncate text-xs font-bold text-slate-700">{c.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{c.country}</p>
                    <p
                      className={`mt-2 text-2xl font-black tabular-nums ${
                        i === 0 ? "text-[#FF5A5F]" : i === 2 ? "text-emerald-600" : "text-blue-600"
                      }`}
                    >
                      {c.match}%
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${c.fitStyle}`}
                    >
                      {c.fit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dimension bars */}
              <div className="mb-6 rounded-xl border border-slate-100 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Score breakdown
                </p>
                <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-3 text-[10px] text-slate-400">
                  <div />
                  {SAMPLE_CITIES.map((c) => (
                    <p key={c.name} className="text-center font-bold">
                      {c.name}
                    </p>
                  ))}
                </div>
                <div className="mt-2 space-y-2.5">
                  {DIMS.map((d) => (
                    <div
                      key={d.label}
                      className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-3"
                    >
                      <p className="text-[10px] text-slate-500">{d.label}</p>
                      {d.scores.map((s, i) => (
                        <BarPreview key={i} pct={s} color={barColor(s)} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blurred section */}
              <div className="relative overflow-hidden rounded-xl border border-slate-100 p-4">
                <div className="pointer-events-none select-none blur-sm">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Family fit analysis
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="h-2.5 rounded bg-slate-200" style={{ width: "85%" }} />
                        <div className="h-2.5 rounded bg-slate-200" style={{ width: "65%" }} />
                        <div className="h-2.5 rounded bg-amber-200" style={{ width: "75%" }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-md">
                    <Lock size={13} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                      Full report — coming soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Three steps to clarity
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Pick your cities",
                desc: "Choose 2 or 3 cities from our 67+ destinations. Any combination.",
              },
              {
                num: "02",
                title: "Tell us about you",
                desc: "Budget, family size, work situation, and what matters most. Takes 30 seconds.",
              },
              {
                num: "03",
                title: "Get your report",
                desc: "See match scores, budget fit, and a full breakdown — personalized to your inputs.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A5F]/10 text-lg font-black text-[#FF5A5F]">
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's different */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Same cities. Completely different report.
            </h2>
            <p className="mt-3 text-slate-500">
              A $4k/month remote worker and a $10k couple with three kids should
              not get the same comparison. Yours is scored around your actual
              situation — budget, family size, and what you care about most.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                One-size-fits-all comparison
              </p>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {[
                  "Same data for everyone",
                  "No budget context",
                  "No family situation filter",
                  "Can't share or download",
                  "No visa path for your work type",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-slate-300">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#FF5A5F]">
                Your FamiRelo report
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {[
                  "Weighted to your priorities",
                  "Your exact budget mapped to each city",
                  "Scored for your family size",
                  "Shareable link + PDF download",
                  "Visa path for remote/local/freelance",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="shrink-0 text-[#FF5A5F]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Simple pricing
          </h2>
          <p className="mb-10 text-center text-sm text-slate-400">
            Each comparison = one personalized report with up to 3 cities.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Single */}
            <div className="rounded-2xl border border-slate-200 bg-stone-50 p-6">
              <p className="text-sm font-semibold text-slate-500">Single report</p>
              <div className="my-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-900">$9</span>
                <span className="text-sm text-slate-400">one-time</span>
              </div>
              <ul className="mb-5 space-y-1.5 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-slate-400" />
                  Compare up to 3 cities
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-slate-400" />
                  Full personalized report
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-slate-400" />
                  Shareable link + PDF
                </li>
              </ul>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-400"
              >
                Coming soon
              </button>
            </div>

            {/* Bundle */}
            <div className="relative rounded-2xl border border-[#FF5A5F]/30 bg-[#FF5A5F]/5 p-6">
              <span className="absolute -top-3 left-6 rounded-full bg-[#FF5A5F] px-3 py-1 text-xs font-bold text-white shadow-sm">
                Best value
              </span>
              <p className="text-sm font-semibold text-slate-600">Bundle — 3 reports</p>
              <div className="my-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-900">$19</span>
                <span className="text-sm text-slate-400">one-time</span>
              </div>
              <ul className="mb-5 space-y-1.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-[#FF5A5F]" />
                  3 full reports (up to 3 cities each)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-[#FF5A5F]" />
                  Try different city combinations
                </li>
                <li className="flex items-center gap-2">
                  <Check size={13} className="shrink-0 text-[#FF5A5F]" />
                  All reports shareable + downloadable
                </li>
              </ul>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-[#FF5A5F]/20 bg-white py-3 text-sm font-bold text-slate-400"
              >
                Coming soon
              </button>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">
            Pay once. No subscription. No account required.
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/compare/build"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#e84a4f] hover:shadow-xl"
            >
              Start with a free preview
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="mt-3 text-xs text-slate-400">
              See your match scores now — full report unlocks at launch
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight text-slate-900">
            Everything in the full report
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF5A5F]/10">
                  <Check size={12} className="text-[#FF5A5F]" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share + PDF callout */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-stone-50 p-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex flex-1 items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
                <Share2 size={18} className="text-[#FF5A5F]" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Share with your partner</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Send the link — they see the full report too. No login needed.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
                <FileDown size={18} className="text-[#FF5A5F]" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Download as PDF</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Keep a copy for your records or print it out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CompareStickyBar />

      {/* Final CTA */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Start with a free preview
          </h2>
          <p className="mb-8 text-slate-500">
            Build your comparison now — see the match scores and budget fit for free.
            Full report unlocks at launch.
          </p>
          <Link
            href="/compare/build"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#e84a4f] hover:shadow-xl"
          >
            Build your free preview
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
