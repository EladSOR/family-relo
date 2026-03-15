import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import DestinationCard from "@/components/home/DestinationCard";

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const slugs = [...new Set((citiesData as Destination[]).map(d => d.countrySlug))];
  return slugs.map(country => ({ country }));
}

export async function generateMetadata({ params }: Props) {
  const { country } = await params;
  const cities = (citiesData as Destination[]).filter(d => d.countrySlug === country);
  if (cities.length === 0) return {};
  const countryName = cities[0].country;
  return {
    title: `${countryName} — Family Relocation Engine`,
    description: `Explore ${cities.length} family-friendly ${cities.length === 1 ? "city" : "cities"} in ${countryName} — visa rules, schools, and childcare costs.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const cities = (citiesData as Destination[]).filter(d => d.countrySlug === country);

  if (cities.length === 0) notFound();

  const countryName = cities[0].country;

  return (
    <main className="min-h-screen bg-[#F5EFE8]">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-5">
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            All destinations
          </Link>
          <span className="text-slate-300">/</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MapPin size={14} className="text-[#FF5A5F]" />
            {countryName}
          </span>
        </div>
      </div>

      {/* ── Page title ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-14">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} {cities.length === 1 ? "city" : "cities"}
          </p>
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Moving to{" "}
          <span className="text-slate-400">{countryName}?</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          Hand-picked family-friendly cities with real data on visa routes, schools, and childcare.
        </p>
      </div>

      {/* ── City grid ────────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map(city => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </main>
  );
}
