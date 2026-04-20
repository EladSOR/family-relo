import type { Metadata } from "next";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import DestinationCard from "@/components/home/DestinationCard";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_DESTINATIONS_DESCRIPTION,
  SITE_DESTINATIONS_OG_IMAGE,
  SITE_DESTINATIONS_TITLE,
} from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { buildDestinationsPageJsonLd } from "@/lib/seo/siteJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_DESTINATIONS_TITLE,
  description: SITE_DESTINATIONS_DESCRIPTION,
  canonicalPath: "/destinations",
});

export default function DestinationsPage() {
  const cities = citiesData as Destination[];
  const siteUrl = getSiteUrl();
  const ogAbs = new URL(SITE_DESTINATIONS_OG_IMAGE, `${siteUrl}/`).href;

  return (
    <main className="min-h-screen bg-[#F5EFE8]">
      <JsonLd data={buildDestinationsPageJsonLd(siteUrl, SITE_DESTINATIONS_DESCRIPTION, ogAbs)} />

      <StickySearchHeader />
      <Breadcrumb items={[
        { label: "Home",             href: "/" },
        { label: "All destinations"            },
      ]} />

      {/* ── Page title ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 pb-5 pt-8 sm:px-6 md:pb-6 md:pt-14 lg:px-12 xl:px-16">
        <div className="mb-3 flex items-center gap-3 md:mb-4">
          <span className="h-px w-8 bg-[#FF5A5F]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A5F]">
            {cities.length} destinations
          </p>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Explore the world{" "}
          <span className="text-slate-400">with your family.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
          Every city is hand-picked for safety, schools, and childcare costs.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 pb-20 sm:gap-6 sm:px-6 sm:pb-32 lg:grid-cols-3 lg:px-12 xl:grid-cols-4 xl:px-16 2xl:grid-cols-5">
        {cities.map(city => (
          <DestinationCard key={city.id} city={city} />
        ))}
      </div>
    </main>
  );
}
