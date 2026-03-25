import { notFound } from "next/navigation";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import DestinationCard from "@/components/home/DestinationCard";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";

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

      <StickySearchHeader />
      <Breadcrumb items={[
        { label: "Home",       href: "/" },
        { label: countryName            },
      ]} />

      {/* ── Page title ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 pb-5 pt-8 sm:px-6 md:pb-6 md:pt-14 lg:px-12 xl:px-16">
        <div className="mb-3 flex items-center gap-3 md:mb-4">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} {cities.length === 1 ? "city" : "cities"}
          </p>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Moving to{" "}
          <span className="text-slate-400">{countryName}?</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          Hand-picked family-friendly cities with real data on visa routes, schools, and childcare.
        </p>
      </div>

      {/* ── City grid ────────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 pb-20 sm:gap-6 sm:px-6 sm:pb-32 lg:grid-cols-3 lg:px-12 xl:grid-cols-4 xl:px-16 2xl:grid-cols-5">
        {cities.map(city => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </main>
  );
}
