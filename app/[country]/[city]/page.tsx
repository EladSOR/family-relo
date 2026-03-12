import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Shield, BadgeDollarSign, Home, ArrowLeft } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { City } from "@/lib/types";
import { CITY_IMAGES, FALLBACK_IMAGE } from "@/lib/constants";

// ── Static params — tells Next.js which paths to pre-render ──────────────────

export function generateStaticParams() {
  return (citiesData as City[]).map((city) => ({
    country: city.countrySlug,
    city:    city.citySlug,
  }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ country: string; city: string }>;
}

export default async function CityPage({ params }: Props) {
  const { country, city: cityParam } = await params;

  const cityData = (citiesData as City[]).find(
    (c) => c.countrySlug === country && c.citySlug === cityParam,
  );

  if (!cityData) notFound();

  const image = CITY_IMAGES[cityData.name] ?? FALLBACK_IMAGE;

  return (
    <main className="min-h-screen bg-[#F5EFE8]">

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        <img
          src={image}
          alt={cityData.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back link */}
        <Link
          href="/"
          className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          All destinations
        </Link>

        {/* City name over image */}
        <div className="absolute bottom-0 left-0 p-8">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-white/70">
            <MapPin size={13} strokeWidth={2.5} />
            {cityData.country}
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            {cityData.name}
          </h1>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-14">

        {/* Summary */}
        <p className="mb-12 text-lg leading-relaxed text-slate-600">
          {cityData.name} is one of the world&apos;s top relocation destinations for families.
          Here&apos;s a quick overview of what you need to know before you move.
        </p>

        {/* Stat cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Shield size={18} className="text-green-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Safety Score</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {cityData.safetyScore}
              <span className="text-base font-normal text-slate-400">/100</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <BadgeDollarSign size={18} className="text-orange-500" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nanny Cost</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              ${cityData.nannyCostPerHour}
              <span className="text-base font-normal text-slate-400">/hr</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Home size={18} className="text-blue-500" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Best Area</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{cityData.bestNeighborhood}</p>
          </div>
        </div>

        {/* Visas */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Visa options</h2>
          <ul className="space-y-3">
            {cityData.visas.map((visa, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF5A5F]" />
                <span className="text-sm font-semibold text-slate-800">{visa.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
