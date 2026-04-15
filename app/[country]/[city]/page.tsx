import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  MapPin, Shield, Home, Utensils, Wallet,
  Stethoscope, GraduationCap, FileText, ExternalLink,
  CheckCircle2, AlertTriangle, Baby, ClipboardList,
  BookOpen, Landmark, CreditCard, Users, ChevronDown, HelpCircle, Cloud,
} from "lucide-react";
import citiesData from "@/data/cities.json";
import countriesData from "@/data/countries.json";
import type { Destination, Source, CountryData } from "@/lib/types";
import { resolveCityHeroImage } from "@/lib/constants";
import { getCityHeroImgAttrs } from "@/lib/heroImage";
import { SearchHint } from "@/components/SearchHint";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";
import VisaPathSelector from "@/components/VisaPathSelector";
import { VisaRichText } from "@/components/VisaRichText";
import { ChecklistItems } from "@/components/ChecklistItems";
import { CityWeather } from "@/components/CityWeather";
import { JsonLd } from "@/components/JsonLd";
import { clipMetaDescription } from "@/lib/seo/description";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { SITE_BRAND_NAME } from "@/lib/seo/constants";
import { buildCityPageJsonLd } from "@/lib/seo/cityJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function reviewedLabel(raw: string) {
  const [year, month] = raw.split("-");
  return `Reviewed ${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return (citiesData as Destination[]).map((d) => ({
    country: d.countrySlug,
    city:    d.citySlug,
  }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city: cityParam } = await params;
  const dest = (citiesData as Destination[]).find(
    (d) => d.countrySlug === country && d.citySlug === cityParam,
  );
  if (!dest) return {};
  const canonicalPath = `/${dest.countrySlug}/${dest.citySlug}`;
  const description = clipMetaDescription(dest.summary);
  const ogImage = resolveCityHeroImage(dest);
  const imgAlt = `${dest.city}, ${dest.country}`;

  return buildPageMetadata({
    title: `${dest.city}, ${dest.country} — ${SITE_BRAND_NAME}`,
    openGraphTitle: `${dest.city} — ${dest.tagline}`,
    description,
    canonicalPath,
    images: [{ url: ogImage, alt: imgAlt }],
  });
}

export default async function CityPage({ params }: Props) {
  const { country, city: cityParam } = await params;

  const dest = (citiesData as Destination[]).find(
    (d) => d.countrySlug === country && d.citySlug === cityParam,
  );

  if (!dest) notFound();

  const heroImg = getCityHeroImgAttrs(resolveCityHeroImage(dest));

  // Visa data: city-specific first, then shared country-level fallback.
  const countries = countriesData as unknown as Record<string, CountryData>;
  const visaData = dest.visa ?? countries[dest.countrySlug]?.visa;

  // Flatten all sources into a deduplicated list for the sources footer
  const allSources: Source[] = Object.values(dest.sources)
    .flat()
    .filter((s): s is Source => Boolean(s));

  const siteUrl = getSiteUrl();

  return (
    <main className="min-h-screen bg-[#F5EFE8]">
      <JsonLd data={buildCityPageJsonLd(dest, siteUrl, resolveCityHeroImage(dest))} />

      <StickySearchHeader />
      <Breadcrumb items={[
        { label: "Home",        href: "/"                            },
        { label: dest.country,  href: `/${dest.countrySlug}`         },
        { label: dest.city                                           },
      ]} />

      {/* ── Hero: capped width on huge monitors + taller band = less “postage stamp” crop */}
      <div className="relative w-full bg-[#F5EFE8]">
        <div className="relative mx-auto h-64 w-full max-w-[1920px] overflow-hidden sm:h-72 md:h-[clamp(26rem,min(44vh,38rem),38rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg.src}
            srcSet={heroImg.srcSet}
            sizes={heroImg.sizes}
            alt={dest.city}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute right-6 top-6 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
            Reviewed {dest.lastReviewed}
          </div>

          <div className="absolute bottom-0 left-0 p-5 md:p-8 lg:p-12">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/70 md:mb-1.5 md:text-sm">
              <MapPin size={12} strokeWidth={2.5} />
              {dest.country}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              {dest.city}
            </h1>
            <p className="mt-1.5 text-sm text-white/80 md:mt-2 md:text-lg">{dest.tagline}</p>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4 sm:px-6 md:py-14 md:space-y-8">

        {/* ── Family budget cards (all-in + line items — same data as FAQ #2 context) ─ */}
        <section
          id="family-budget"
          aria-labelledby="family-budget-heading"
          className="scroll-mt-28"
        >
          <h2
            id="family-budget-heading"
            className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 md:mb-4"
          >
            Family budget at a glance
          </h2>
          <p className="mb-4 text-xs leading-relaxed text-slate-500 md:text-sm">
            The all-in range matches the FAQ answer for &quot;How much does a family typically need per
            month here?&quot; The other cards are single-line benchmarks — they don&apos;t add up to
            that total (school fees and other costs are separate).
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Wallet size={18} className="text-[#E84A4F]" />}
              bg="bg-rose-50"
              label="All-in / month (family of 4)"
              value={dest.cost.monthlyFamilyAllIn}
              small
            />
            <StatCard
              icon={<Home size={18} className="text-blue-500" />}
              bg="bg-blue-50"
              label="3-bed family home"
              value={dest.cost.rentRange}
              small
            />
            <StatCard
              icon={<Utensils size={18} className="text-orange-500" />}
              bg="bg-orange-50"
              label="Dinner for 2 (mid-range)"
              value={dest.cost.familyDinner}
            />
            <StatCard
              icon={<Baby size={18} className="text-purple-500" />}
              bg="bg-purple-50"
              label="Nanny"
              value={dest.cost.nannyRate}
              small
            />
          </div>
        </section>

        {/* Summary */}
        <p className="text-base leading-relaxed text-slate-700 md:text-lg">{dest.summary}</p>

        {/* ── Action checklist ──────────────────────────────────────────── */}
        <Section title="Action checklist" icon={<ClipboardList size={16} className="text-slate-500" />}>
          <p className="mb-1 text-sm text-slate-500">
            Concrete steps to make this move happen, in order.
          </p>
          <p className="mb-5 text-sm text-slate-500">
            Click any step to jump to that section ↓
          </p>
          <ChecklistItems steps={dest.actionChecklist} />
        </Section>

        {/* ── Family fit ────────────────────────────────────────────────── */}
        <Section title="Family fit">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-green-700">Great for</p>
              <ul className="space-y-2">
                {dest.familyFit.bestFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-700">Watch out for</p>
              <ul className="space-y-2">
                {dest.familyFit.watchOutFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Climate (monthly normals) ─────────────────────────────────── */}
        {dest.weather && (
          <Section
            id="weather"
            title="Climate & seasons"
            icon={<Cloud size={16} className="text-slate-500" />}
            sources={dest.sources.weather}
          >
            <CityWeather data={dest.weather} />
          </Section>
        )}

        {/* ── Visa ──────────────────────────────────────────────────────── */}
        <Section
          id="visa"
          title="Visa options"
          icon={<FileText size={16} className="text-slate-500" />}
          meta={reviewedLabel(dest.lastReviewed)}
          sources={dest.sources.visa}
        >
          {visaData && (
            <>
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                <VisaRichText text={visaData.summary} />
              </p>
              <VisaPathSelector
                options={visaData.options}
                countrySlug={dest.countrySlug}
                countryName={dest.country}
                cityName={dest.city}
              />
              {visaData.tip && (
                <Tip>
                  <VisaRichText text={visaData.tip} />
                </Tip>
              )}
              {visaData.tipSearchQuery && <SearchHint query={visaData.tipSearchQuery} />}
            </>
          )}
        </Section>

        {/* ── Residency ─────────────────────────────────────────────────── */}
        <Section
          id="residency"
          title={dest.residency.title ?? "Residency registration"}
          icon={<Landmark size={16} className="text-slate-500" />}
          meta={reviewedLabel(dest.lastReviewed)}
        >
          <BulletList items={dest.residency.items} />
          {dest.residency.tip && (
            <Tip>
              <VisaRichText text={dest.residency.tip} />
            </Tip>
          )}
        </Section>

        {/* ── Banking ───────────────────────────────────────────────────── */}
        <Section
          id="banking"
          title={dest.banking.title ?? "Banking"}
          icon={<CreditCard size={16} className="text-slate-500" />}
        >
          <BulletList items={dest.banking.items} />
          {dest.banking.tip && (
            <Tip>
              <VisaRichText text={dest.banking.tip} />
            </Tip>
          )}
        </Section>

        {/* ── Housing ───────────────────────────────────────────────────── */}
        <Section
          id="housing"
          title="Housing"
          icon={<Home size={16} className="text-slate-500" />}
          sources={dest.sources.housing}
        >
          <p className="mb-4 text-sm leading-relaxed text-slate-700">{dest.housing.summary}</p>

          <div className="space-y-4 md:space-y-6">

            {/* Block 1 — Where to search */}
            <div>
              <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Where to search</h4>
              <div className="mb-3 space-y-1">
                {dest.housing.searchPortalsIntro.map((line, i) => (
                  <p key={i} className="text-sm italic text-slate-500">{line}</p>
                ))}
              </div>
              <ul className="space-y-2.5">
                {dest.housing.searchPortals.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <div className="min-w-0 flex-1">
                      {p.url && p.isVerified === true ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                           className="cursor-pointer break-words text-blue-600 underline-offset-2 hover:underline">
                          {p.label}
                        </a>
                      ) : (
                        <span className="break-words">{p.label}</span>
                      )}
                      {p.note && (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{p.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Block 2 — Typical monthly rents */}
            {dest.housing.typicalPrices && dest.housing.typicalPrices.length > 0 ? (
              <div>
                <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Typical monthly rents</h4>
                <BulletList items={dest.housing.typicalPrices} />
              </div>
            ) : (
              <div>
                <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Typical monthly rents</h4>
                <p className="text-sm italic text-slate-400">
                  Search the portals above for current pricing — rates vary by neighbourhood and season.
                </p>
              </div>
            )}

            {/* Block 3 — Best areas for families */}
            <div>
              <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Best areas for families</h4>
              <div className="flex flex-wrap gap-2">
                {dest.housing.bestAreas.map((area) => (
                  <span key={area}
                        className="cursor-default rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Block 4 — What you need to rent */}
            {dest.housing.whatYouNeedToRent && dest.housing.whatYouNeedToRent.length > 0 ? (
              <div>
                <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">What you need to rent</h4>
                <BulletList items={dest.housing.whatYouNeedToRent} />
              </div>
            ) : (
              <div>
                <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">What you need to rent</h4>
                <p className="text-sm italic text-slate-400">
                  Requirements vary by landlord — check with local agents for current documentation needs.
                </p>
              </div>
            )}

          </div>
        </Section>

        {/* ── Schools ───────────────────────────────────────────────────── */}
        <Section
          id="schools"
          title="Schools"
          icon={<GraduationCap size={16} className="text-slate-500" />}
          sources={dest.sources.schools}
        >
          <p className="mb-4 text-sm leading-relaxed text-slate-700">{dest.schools.summary}</p>

          <div className="mb-5 space-y-4">
            <DetailRow label="Public system" value={dest.schools.publicSystem} />
            <DetailRow label="International options" value={dest.schools.internationalOptions} />
            <DetailRow label="Language notes" value={dest.schools.languageNotes} />
          </div>

          {dest.schools.tip && (
            <Tip>
              <VisaRichText text={dest.schools.tip} />
            </Tip>
          )}

          {dest.schools.options && dest.schools.options.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Education options
              </p>
              <div className="space-y-2.5">
                {dest.schools.options.map((opt, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 px-3 py-3 md:px-4 md:py-3.5">
                    {/* Mobile: stack vertically so the fee chip never squeezes the content */}
                    {/* Desktop: side-by-side with fee chip aligned to the top-right */}
                    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-3">
                      <div className="min-w-0 break-words">
                        <p className="font-semibold text-slate-800">{opt.type}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{opt.description}</p>
                        <SearchHint
                          query={
                            dest.schools.searchContext
                              ? `${opt.type} ${dest.schools.searchContext}`
                              : `${opt.type} in ${dest.city}, ${dest.country}`
                          }
                        />
                      </div>
                      {opt.fees && (
                        <span className="self-start break-words rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200 md:rounded-full">
                          {opt.fees}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Childcare ─────────────────────────────────────────────────── */}
        <Section id="childcare" title="Childcare" icon={<Baby size={16} className="text-slate-500" />}>
          <p className="mb-4 text-sm leading-relaxed text-slate-700">{dest.childcare.summary}</p>
          <div className="space-y-4 md:space-y-6">
            <div>
              <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Daycare &amp; nurseries</h4>
              <BulletList items={dest.childcare.daycareItems} />
            </div>
            <div>
              <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Nanny &amp; au pair</h4>
              <BulletList items={dest.childcare.nannyItems} />
            </div>
            <div>
              <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:text-xs">Where to find childcare</h4>
              <BulletList items={dest.childcare.whereToFindItems} />
            </div>
          </div>
        </Section>

        {/* ── Healthcare ────────────────────────────────────────────────── */}
        <Section
          id="healthcare"
          title="Healthcare"
          icon={<Stethoscope size={16} className="text-slate-500" />}
          meta={reviewedLabel(dest.lastReviewed)}
          sources={dest.sources.healthcare}
        >
          <BulletList items={dest.healthcare.items} />
          {dest.healthcare.tip && (
            <Tip>
              <VisaRichText text={dest.healthcare.tip} />
            </Tip>
          )}
        </Section>

        {/* ── Safety ────────────────────────────────────────────────────── */}
        <Section id="safety" title="Safety" icon={<Shield size={16} className="text-slate-500" />}>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 md:text-4xl">{dest.safety.score}</span>
            <span className="text-sm text-slate-400 md:text-base">/ 100</span>
          </div>
          <BulletList items={dest.safety.items} />
        </Section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        {dest.faq && dest.faq.length > 0 && (
          <Section id="faq" title="FAQ" icon={<HelpCircle size={16} className="text-slate-500" />}>
            <dl className="divide-y divide-slate-100">
              {dest.faq.map((item, i) => (
                <details key={i} className="group/faq">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium text-slate-800 marker:hidden">
                    <span>{item.question}</span>
                    <ChevronDown size={15} className="shrink-0 text-slate-400 transition-transform duration-200 group-open/faq:rotate-180" />
                  </summary>
                  <p className="pb-4 pr-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </dl>
          </Section>
        )}

        {/* ── Official sources ──────────────────────────────────────────── */}
        {allSources.length > 0 && (
          <Section title="Sources" icon={<BookOpen size={16} className="text-slate-500" />}>
            <p className="mb-3 text-xs text-slate-400">
              Official government, institutional, and public sources.
            </p>
            <ul className="space-y-3">
              {allSources.map((src, i) => (
                <li key={i}>
                  {src.isVerified === true ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-0.5 text-sm font-medium text-[#FF5A5F] underline-offset-2 hover:underline"
                    >
                      <ExternalLink size={13} className="shrink-0" />
                      <span className="break-words">{src.label}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 py-0.5 text-sm font-medium text-slate-400">
                      <ExternalLink size={13} className="shrink-0 opacity-40" />
                      <span className="break-words">{src.label}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Community ─────────────────────────────────────────────────── */}
        {dest.communityLinks && dest.communityLinks.length > 0 && (
          <Section title="Community" icon={<Users size={16} className="text-slate-500" />}>
            <p className="mb-3 text-xs text-slate-400">
              Expat groups and community forums. Use the search buttons below to find them.
            </p>
            <ul className="space-y-5">
              {dest.communityLinks.map((link, i) => (
                <li key={i}>
                  <p className="text-sm leading-relaxed text-slate-700">{link.label}</p>
                  <SearchHint
                    query={link.searchQuery ?? `${dest.city} expats Facebook group`}
                  />
                </li>
              ))}
            </ul>
          </Section>
        )}

      </div>
    </main>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

/**
 * Standard bullet list used consistently across all sections.
 * Single rendering path — no conditional logic inside.
 */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex min-w-0 items-start gap-2.5 text-sm leading-relaxed text-slate-700">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  id,
  title,
  icon,
  meta,
  sources,
  children,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  meta?: string;
  sources?: Source[];
  children: React.ReactNode;
}) {
  return (
    // <details> collapses on mobile, always open on desktop via `md:block` on body.
    // id is on the outer element so checklist hash-links (#housing etc.) still work.
    <details id={id} className="group rounded-2xl bg-white shadow-sm scroll-mt-24">

      {/* ── Header — always visible, acts as tap target on mobile ──────── */}
      <summary className="flex cursor-pointer select-none list-none items-center gap-3 p-3.5 [&::-webkit-details-marker]:hidden md:cursor-default md:p-6">
        <h2 className="flex min-w-0 flex-1 items-center gap-2 text-base font-bold text-slate-900">
          {icon}
          <span className="min-w-0">{title}</span>
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {meta && (
            <span className="hidden text-[11px] font-normal text-slate-400 md:inline">{meta}</span>
          )}
          {/* Chevron — rotates when open */}
          <ChevronDown
            size={16}
            className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
          />
        </div>
      </summary>

      {/* ── Body — always in DOM for SEO; hidden on mobile until tapped ── */}
      <div className="hidden group-open:block md:block">
        <div className="px-4 pb-3 pt-0.5 md:px-6 md:pb-6 md:pt-0">
          {/* meta shown inline inside body on mobile (hidden from summary row) */}
          {meta && (
            <p className="mb-3 text-[11px] text-slate-400 md:hidden">{meta}</p>
          )}
          {children}
        </div>
        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 px-4 pb-3 pt-2.5 md:px-6 md:pb-6 md:pt-4">
            {sources.map((src, i) =>
              src.isVerified === true ? (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 underline-offset-2 hover:text-[#FF5A5F] hover:underline"
                >
                  <ExternalLink size={11} />
                  {src.label}
                </a>
              ) : (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-slate-300">
                  <ExternalLink size={11} className="opacity-40" />
                  {src.label}
                </span>
              )
            )}
          </div>
        )}
      </div>

    </details>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-l-2 border-emerald-300 pl-3 text-xs leading-relaxed text-slate-500 md:border-emerald-200">
      {children}
    </p>
  );
}

function StatCard({
  icon, bg, label, value, small = false,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl md:h-10 md:w-10 ${bg}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 md:text-xs">{label}</p>
      <p className={`mt-1 font-extrabold leading-tight text-slate-900 md:mt-1 ${small ? "text-xl md:text-xl" : "text-2xl md:text-3xl"}`}>
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[160px_1fr] sm:gap-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm leading-relaxed text-slate-700">{value}</p>
    </div>
  );
}
