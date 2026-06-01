import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Lock,
  ArrowRight,
  Share2,
  FileDown,
  Plane,
  Calendar,
  Wallet,
  Info,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/siteUrl";
import {
  SITE_SINGLE_CITY_DESCRIPTION,
  SITE_SINGLE_CITY_OG_IMAGE,
  SITE_SINGLE_CITY_OG_IMAGE_ALT,
  SITE_SINGLE_CITY_OPEN_GRAPH_TITLE,
  SITE_SINGLE_CITY_TITLE,
} from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_SINGLE_CITY_TITLE,
  openGraphTitle: SITE_SINGLE_CITY_OPEN_GRAPH_TITLE,
  description: SITE_SINGLE_CITY_DESCRIPTION,
  canonicalPath: "/single-city",
  images: [{ url: SITE_SINGLE_CITY_OG_IMAGE, alt: SITE_SINGLE_CITY_OG_IMAGE_ALT }],
});

// Product + Offer JSON-LD: tells Google this is a paid digital product so
// the $7 price + currency can appear in SERP rich results.
function buildSingleCityProductJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/single-city#product`,
        name: 'FamiRelo "Should we move here?" Single-City Report',
        description:
          "A personalised single-city fit report for families. Includes a match score, verdict, visa paths ranked for your passport and work situation, schools snapshot, budget reality check, and a personalised 90-day pre-arrival checklist. One-time $7 launch price. Downloadable PDF and shareable link.",
        url: `${siteUrl}/single-city`,
        brand: { "@type": "Brand", name: "FamiRelo" },
        category: "Family relocation planning",
        offers: {
          "@type": "Offer",
          name: "Single-city fit report",
          price: "7.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/single-city`,
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "7.00",
            priceCurrency: "USD",
            valueAddedTaxIncluded: false,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Should we move here?",
            item: `${siteUrl}/single-city`,
          },
        ],
      },
    ],
  } as Record<string, unknown>;
}

const INCLUDED = [
  "Personalised match score (0–100)",
  "Verdict: strong fit / worth considering / be cautious",
  "Score breakdown: cost, safety, schools, weather, lifestyle",
  "Budget reality check — your $ vs. typical local family budget",
  "Visa paths ranked for your passport + work situation",
  "Schools snapshot tailored to your kids' ages",
  "Personalised 90-day pre-arrival checklist",
  "Shareable link + downloadable PDF — yours forever",
];

export default function SingleCityLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <JsonLd data={buildSingleCityProductJsonLd()} />
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={28} />
          </Link>
          <Link
            href="/single-city/build"
            className="flex items-center gap-1.5 rounded-xl bg-[#FF5A5F] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] md:gap-2 md:px-4 md:py-2.5 md:text-sm"
          >
            <span className="hidden sm:inline">Try a free preview</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pb-12 pt-12 text-center md:pb-16 md:pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-3 py-1.5 text-xs font-semibold text-[#FF5A5F] md:mb-6 md:px-4 md:py-2 md:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F]" />
            <span className="uppercase tracking-wider">Launch price</span>
            <span className="text-base font-extrabold md:text-lg">$7</span>
            <span className="text-[#FF5A5F]/50 line-through">$14</span>
            <span className="text-[#FF5A5F]/70">· pay once</span>
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:mb-5 md:text-6xl">
            <span className="text-[#FF5A5F]">Should we move here?</span>
            {" "}— a personalised read on one city.
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-500 md:mb-10 md:text-lg">
            One city. Your inputs. A clear verdict, visa paths that match your
            profile, a schools snapshot, budget reality check, and a 90-day
            pre-arrival checklist — yours forever. Try a free preview before
            you pay.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/single-city/build"
              className="flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#e84a4f] hover:shadow-xl"
            >
              Try a free preview
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="text-sm text-slate-400">
              No account needed · See your match score free
            </p>
          </div>
        </div>
      </section>

      {/* Report preview mockup */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-center text-xs text-slate-400">
                famirelo.com/single-city/results
              </div>
            </div>
            <div className="p-6 md:p-8">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#FF5A5F]">
                Should we move here?
              </p>
              <h2 className="text-xl font-extrabold text-slate-900">
                Valencia, Spain
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Family with kids · $5,000/mo · Remote work · Priority: Cost, Schools
              </p>

              {/* Verdict + score */}
              <div className="mt-5 grid gap-3 md:grid-cols-[1fr,1.5fr]">
                <div className="rounded-xl border border-slate-100 p-4 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Your match
                  </p>
                  <p className="mt-1 text-4xl font-black tabular-nums text-emerald-600">
                    87
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[87%] rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                    Verdict
                  </p>
                  <p className="mt-1 text-base font-extrabold text-emerald-800">
                    Strong fit
                  </p>
                  <p className="mt-1 text-xs leading-snug text-emerald-700/80">
                    Top tier across the dimensions that matter most to you.
                    Deserves a place on your shortlist.
                  </p>
                </div>
              </div>

              {/* Sample dimension bars */}
              <div className="mt-5 rounded-xl border border-slate-100 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Score breakdown
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Cost fit", pct: 96, color: "bg-emerald-500" },
                    { label: "Safety", pct: 88, color: "bg-emerald-500" },
                    { label: "Schools", pct: 80, color: "bg-emerald-500" },
                    { label: "Weather", pct: 92, color: "bg-emerald-500" },
                    { label: "Lifestyle", pct: 82, color: "bg-emerald-500" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <p className="w-20 shrink-0 text-[10px] font-semibold text-slate-500">
                        {d.label}
                      </p>
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 6 }}>
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="w-6 shrink-0 text-right text-[10px] font-bold tabular-nums text-slate-500">
                        {d.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blurred paywall section */}
              <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-100 p-4">
                <div className="pointer-events-none select-none blur-sm">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Visa paths · Schools · Checklist · Final read
                  </p>
                  <div className="space-y-1.5">
                    <div className="h-2.5 rounded bg-slate-200" style={{ width: "85%" }} />
                    <div className="h-2.5 rounded bg-slate-200" style={{ width: "70%" }} />
                    <div className="h-2.5 rounded bg-slate-200" style={{ width: "80%" }} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-md">
                    <Lock size={13} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                      Unlock full report — $7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            What&apos;s in the report
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                Icon: Wallet,
                title: "Budget reality check",
                desc: "Your $ budget vs. the typical local family budget — see your headroom or where the gap is.",
              },
              {
                Icon: Plane,
                title: "Visa paths that match your profile",
                desc: "Ranked for your passport and work situation. EU citizens see free-movement guidance; everyone else gets the most realistic long-term route flagged with the next step to verify.",
              },
              {
                Icon: Check,
                title: "Family fit · strengths & trade-offs",
                desc: "What works for someone in your situation here, and what to plan around.",
              },
              {
                Icon: Calendar,
                title: "90-day pre-arrival checklist",
                desc: "Ordered by what matters most to you — what to do in the months before you land.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-100 bg-stone-50 p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
                  <f.Icon size={16} className="text-[#FF5A5F]" />
                </div>
                <p className="font-bold text-slate-900">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Three steps to a clear read
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Pick a city",
                desc: "Choose any of our 67+ destinations — the one you're seriously considering.",
              },
              {
                num: "02",
                title: "Tell us about you",
                desc: "Budget, family size, passport, work situation, kids' ages, and what matters most. Takes 30 seconds.",
              },
              {
                num: "03",
                title: "Get your report",
                desc: "Match score, verdict, visa paths, schools snapshot, and a 90-day checklist — yours forever.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A5F]/10 text-lg font-black text-[#FF5A5F]">
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty / disclaimer block */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Info size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                What this report is — and isn&apos;t.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A personalised starting point built on FamiRelo&apos;s
                published city data. It uses the inputs you give us to filter
                and rank what&apos;s already on the site — visa paths,
                schools, budget benchmarks, and pre-arrival actions —
                tailored to your family.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                It&apos;s <strong>not</strong> legal, financial, or
                immigration advice. Visa rules, school fees, and rents
                change. We surface the right questions and the official
                sources — confirm specifics with a licensed professional
                (immigration lawyer, accountant) before making decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-md">
          <h2 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Simple pricing
          </h2>
          <p className="mb-10 text-center text-sm text-slate-400">
            Pay once. No subscription. Yours forever.
          </p>

          <div className="rounded-2xl border border-[#FF5A5F]/30 bg-[#FF5A5F]/5 p-7 shadow-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#FF5A5F]">
              Launch price
            </p>
            <div className="mb-1 flex items-baseline gap-3">
              <span className="text-5xl font-black text-slate-900">$7</span>
              <span className="text-2xl font-bold text-slate-300 line-through">$14</span>
              <span className="text-sm text-slate-400">one-time</span>
            </div>
            <p className="mb-1 text-base font-bold text-slate-800">
              Single-city fit report
            </p>
            <p className="mb-5 text-sm text-slate-500">
              One city · Personalised verdict · Yours forever
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-[#FF5A5F]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/single-city/build"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#e84a4f]"
            >
              Start with a free preview
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Considering 2-3 cities instead? Try the{" "}
            <Link href="/compare" className="font-semibold text-[#FF5A5F] hover:underline">
              side-by-side comparison report — launch price from $9 (regular $18)
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Share + PDF callout (same as /compare for consistency) */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 sm:flex-row sm:items-center sm:gap-8">
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
                <p className="font-bold text-slate-900">Save or print as PDF</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  One-click button on the report — keep a copy or send to your partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Start with a free preview
          </h2>
          <p className="mb-8 text-slate-500">
            See your match score and verdict free. Unlock the visa paths,
            schools, and checklist with a one-time payment.
          </p>
          <Link
            href="/single-city/build"
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
