import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import { JsonLd } from "@/components/JsonLd";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { SITE_DESCRIPTION } from "@/lib/seo/constants";
import { buildWebSiteJsonLd } from "@/lib/seo/siteJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: { absolute: "Family Relocation Engine" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Family Relocation Engine",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    title: "Family Relocation Engine",
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  const siteUrl = getSiteUrl();
  return (
    <main className="min-h-screen bg-stone-50">
      <JsonLd data={buildWebSiteJsonLd(siteUrl, SITE_DESCRIPTION)} />
      <Hero />
      <DestinationsGrid cities={citiesData as Destination[]} />
    </main>
  );
}
