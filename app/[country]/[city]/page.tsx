import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Shield, BadgeDollarSign, Home,
  Stethoscope, GraduationCap, FileText, ExternalLink,
  CheckCircle2, AlertTriangle, Baby, ClipboardList,
  BookOpen, Landmark, CreditCard,
} from "lucide-react";
import citiesData from "@/data/cities.json";
import countriesData from "@/data/countries.json";
import type { Destination, Source, CountryData } from "@/lib/types";
import { CITY_IMAGES, FALLBACK_IMAGE } from "@/lib/constants";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";
import VisaPathSelector from "@/components/VisaPathSelector";
import { ChecklistItems } from "@/components/ChecklistItems";

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

export default async function CityPage({ params }: Props) {
  const { country, city: cityParam } = await params;

  const dest = (citiesData as Destination[]).find(
    (d) => d.countrySlug === country && d.citySlug === cityParam,
  );

  if (!dest) notFound();

  const image = CITY_IMAGES[dest.city] ?? FALLBACK_IMAGE;

  // Visa data: city-specific first, then shared country-level fallback.
  // This lets Spain (and later Portugal, Thailand, UAE) share visa content
  // without duplicating it in every city object.
  const countries = countriesData as unknown as Record<string, CountryData>;
  const visaData = dest.visa ?? countries[dest.countrySlug]?.visa;

  // Flatten all sources into a deduplicated list for the sources footer
  const allSources: Source[] = Object.values(dest.sources)
    .flat()
    .filter((s): s is Source => Boolean(s));

  return (
    <main className="min-h-screen bg-[#F5EFE8]">

      <StickySearchHeader />
      <Breadcrumb items={[
        { label: "Home",        href: "/"                            },
        { label: dest.country,  href: `/${dest.countrySlug}`         },
        { label: dest.city                                           },
      ]} />

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <div className="relative h-72 w-full overflow-hidden md:h-[420px]">
        <img src={image} alt={dest.city} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Last reviewed badge */}
        <div className="absolute right-6 top-6 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
          Reviewed {dest.lastReviewed}
        </div>

        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white/70">
            <MapPin size={13} strokeWidth={2.5} />
            {dest.country}
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            {dest.city}
          </h1>
          <p className="mt-2 text-lg text-white/80">{dest.tagline}</p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8">

        {/* Summary */}
        <p className="text-lg leading-relaxed text-slate-600">{dest.summary}</p>

        {/* ── Quick stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Shield size={18} className="text-green-600" />}
            bg="bg-green-50"
            label="Safety Score"
            value={`${dest.safety.score}/100`}
          />
          <StatCard
            icon={<BadgeDollarSign size={18} className="text-orange-500" />}
            bg="bg-orange-50"
            label="Nanny Cost"
            value={`$${dest.cost.nannyHourly}/hr`}
          />
          <StatCard
            icon={<Home size={18} className="text-blue-500" />}
            bg="bg-blue-50"
            label="Typical Rent"
            value={dest.cost.rentRange}
            small
          />
        </div>

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

        {/* ── Visa ──────────────────────────────────────────────────────── */}
        <Section
          id="visa"
          title="Visa options"
          icon={<FileText size={16} className="text-slate-500" />}
          sources={dest.sources.visa}
        >
          {visaData && (
            <>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">{visaData.summary}</p>
              <VisaPathSelector options={visaData.options} />
            </>
          )}
        </Section>

        {/* ── Residency ─────────────────────────────────────────────────── */}
        <Section
          id="residency"
          title="Residency registration"
          icon={<Landmark size={16} className="text-slate-500" />}
        >
          <ul className="space-y-2">
            {[
              "Register on the Padrón Municipal at your local Ayuntamiento within 30 days of arrival — bring your passport, rental contract, and proof of address.",
              "The Padrón certificate unlocks everything: school enrolment, SIP healthcare card, NIE appointment, and your future TIE residency card.",
              "Book your Padrón appointment online via the Valencia Ayuntamiento website — walk-in slots fill up fast.",
              "After 1 year on the Padrón, non-EU residents can apply for the TIE (Tarjeta de Identidad de Extranjero), the physical residency card.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Banking & NIE ─────────────────────────────────────────────── */}
        <Section
          id="banking"
          title="Banking & NIE"
          icon={<CreditCard size={16} className="text-slate-500" />}
        >
          <ul className="space-y-2">
            {[
              "Apply for your NIE (Número de Identidad de Extranjero) as soon as you arrive — required to open a bank account, sign a lease, and enrol children in school.",
              "NIE appointments at the Extranjería (foreign police station) can take 4–8 weeks to book — start the process immediately.",
              "While waiting for your NIE, use N26 or Wise as a temporary account — they open without a Spanish address or NIE.",
              "Once you have your NIE, open a Spanish account: BBVA, Sabadell, and CaixaBank are popular with expats; most landlords require a local IBAN.",
              "Documents most banks require: passport, NIE, Padrón certificate, and proof of income or employment contract.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Housing ───────────────────────────────────────────────────── */}
        <Section
          id="housing"
          title="Housing"
          icon={<Home size={16} className="text-slate-500" />}
          sources={dest.sources.housing}
        >
          <p className="mb-5 text-sm leading-relaxed text-slate-600">{dest.housing.summary}</p>
          {dest.housing.searchPortals ? (
            <div className="space-y-6">
              {/* Block 1: Where to search */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Where to search</h4>
                {dest.housing.searchPortalsIntro && (
                  <div className="mb-3 space-y-1">
                    {dest.housing.searchPortalsIntro.map((line, i) => (
                      <p key={i} className="text-sm italic text-slate-500">{line}</p>
                    ))}
                  </div>
                )}
                <ul className="space-y-1.5">
                  {dest.housing.searchPortals.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-blue-600 underline-offset-2 hover:underline">
                          {p.label}
                        </a>
                      ) : (
                        <span>{p.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Block 2: Typical prices */}
              {dest.housing.typicalPrices && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Typical monthly rents</h4>
                  <ul className="space-y-1.5">
                    {dest.housing.typicalPrices.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Block 3: Best areas for families */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Best areas for families</h4>
                <div className="flex flex-wrap gap-2">
                  {dest.housing.bestAreas.map((area) => (
                    <span key={area} className="cursor-default rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              {/* Block 4: What you need to rent */}
              {dest.housing.whatYouNeedToRent && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">What you need to rent</h4>
                  <ul className="space-y-1.5">
                    {dest.housing.whatYouNeedToRent.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dest.housing.bestAreas.map((area) => (
                <span key={area} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  {area}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* ── Schools ───────────────────────────────────────────────────── */}
        <Section
          id="schools"
          title="Schools"
          icon={<GraduationCap size={16} className="text-slate-500" />}
          sources={dest.sources.schools}
        >
          <p className="mb-5 text-sm leading-relaxed text-slate-600">{dest.schools.summary}</p>

          <div className="mb-5 space-y-4">
            <DetailRow label="Public system" value={dest.schools.publicSystem} />
            <DetailRow label="International options" value={dest.schools.internationalOptions} />
            <DetailRow label="Language notes" value={dest.schools.languageNotes} />
          </div>

          {dest.schools.examples.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Example schools
              </p>
              <div className="space-y-2.5">
                {dest.schools.examples.map((school) => (
                  <div key={school.name} className="rounded-xl bg-slate-50 px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {school.url ? (
                          <a
                            href={school.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-[#FF5A5F]"
                          >
                            {school.name}
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        ) : (
                          <p className="font-semibold text-slate-900">{school.name}</p>
                        )}
                        <p className="mt-0.5 text-xs text-slate-500">{school.curriculum}</p>
                      </div>
                      {school.fees && (
                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                          {school.fees}
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
          <p className="mb-5 text-sm leading-relaxed text-slate-600">{dest.childcare.summary}</p>
          {dest.childcare.daycareItems ? (
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Daycare &amp; nurseries</h4>
                <ul className="space-y-1.5">
                  {dest.childcare.daycareItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {dest.childcare.nannyItems && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Nanny &amp; au pair</h4>
                  <ul className="space-y-1.5">
                    {dest.childcare.nannyItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {dest.childcare.whereToFindItems && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Where to find childcare</h4>
                  <ul className="space-y-1.5">
                    {dest.childcare.whereToFindItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <DetailRow label="Daycare & nurseries" value={dest.childcare.daycareNotes} />
              <DetailRow label="Nanny & au pair" value={dest.childcare.nannyNotes} />
              <DetailRow label="Typical cost" value={dest.childcare.typicalCost} />
              <DetailRow label="How families find it" value={dest.childcare.howFamiliesFindIt} />
            </div>
          )}
        </Section>

        {/* ── Healthcare ────────────────────────────────────────────────── */}
        <Section
          id="healthcare"
          title="Healthcare"
          icon={<Stethoscope size={16} className="text-slate-500" />}
          sources={dest.sources.healthcare}
        >
          {dest.healthcare.items ? (
            <ul className="space-y-1.5">
              {dest.healthcare.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-slate-600">{dest.healthcare.summary}</p>
          )}
        </Section>

        {/* ── Safety ────────────────────────────────────────────────────── */}
        <Section title="Safety" icon={<Shield size={16} className="text-slate-500" />}>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">{dest.safety.score}</span>
            <span className="text-base text-slate-400">/ 100</span>
          </div>
          {dest.safety.items ? (
            <ul className="space-y-1.5">
              {dest.safety.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-slate-600">{dest.safety.summary}</p>
          )}
        </Section>

        {/* ── Official sources ──────────────────────────────────────────── */}
        {allSources.length > 0 && (
          <Section title="Sources" icon={<BookOpen size={16} className="text-slate-500" />}>
            <p className="mb-3 text-xs text-slate-400">
              Official government, institutional, and public sources.
            </p>
            <ul className="space-y-2">
              {allSources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#FF5A5F] underline-offset-2 hover:underline"
                  >
                    <ExternalLink size={13} />
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Community links ───────────────────────────────────────────── */}
        {dest.communityLinks && dest.communityLinks.length > 0 && (
          <Section title="Community" icon={<ExternalLink size={16} className="text-slate-500" />}>
            <p className="mb-3 text-xs text-slate-400">
              Expat groups and community forums. Useful for on-the-ground advice — not official sources.
            </p>
            <ul className="space-y-2">
              {dest.communityLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
                  >
                    <ExternalLink size={13} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

      </div>
    </main>
  );
}

// ── File-local sub-components ─────────────────────────────────────────────────

function Section({
  id,
  title,
  icon,
  sources,
  children,
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  sources?: Source[];
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="rounded-2xl bg-white p-6 shadow-sm scroll-mt-24">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
        {icon}
        {title}
      </h2>
      {children}
      {sources && sources.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-4">
          {sources.map((src, i) => (
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
          ))}
        </div>
      )}
    </div>
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
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 font-extrabold text-slate-900 ${small ? "text-xl" : "text-3xl"}`}>
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr]">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-0.5">{label}</p>
      <p className="text-sm leading-relaxed text-slate-600">{value}</p>
    </div>
  );
}
