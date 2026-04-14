import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import { JsonLd } from "@/components/JsonLd";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { SITE_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/seo/constants";
import { buildWebSiteJsonLd } from "@/lib/seo/siteJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: { absolute: SITE_HOME_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    title: SITE_HOME_TITLE,
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
