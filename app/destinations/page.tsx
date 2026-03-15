import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import DestinationCard from "@/components/home/DestinationCard";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";

export const metadata = {
  title: "All Destinations — Family Relocation Engine",
  description: "Browse every family-friendly city in our database — visa rules, schools, childcare costs, and safety scores.",
};

export default function DestinationsPage() {
  const cities = citiesData as Destination[];

  return (
    <main className="min-h-screen bg-[#F5EFE8]">

      <StickySearchHeader />
      <Breadcrumb items={[
        { label: "Home",             href: "/" },
        { label: "All destinations"            },
      ]} />

      {/* ── Page title ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-14">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} destinations
          </p>
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Explore the world{" "}
          <span className="text-slate-400">with your family.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          Every city is hand-picked for safety, schools, and childcare costs.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map(city => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </main>
  );
}
