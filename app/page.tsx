import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import DestinationsMapSection from "@/components/home/DestinationsMapSection";
import { JsonLd } from "@/components/JsonLd";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import {
  SITE_DESCRIPTION,
  SITE_HOME_OG_IMAGE,
  SITE_HOME_OPEN_GRAPH_TITLE,
  SITE_HOME_TITLE,
} from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { buildWebSiteJsonLd } from "@/lib/seo/siteJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_HOME_TITLE,
  openGraphTitle: SITE_HOME_OPEN_GRAPH_TITLE,
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
});

export default function Home() {
  const siteUrl = getSiteUrl();
  const homeOgAbsolute = new URL(SITE_HOME_OG_IMAGE, `${siteUrl}/`).href;
  const cities = citiesData as Destination[];
  return (
    <main className="min-h-screen bg-stone-50">
      <JsonLd data={buildWebSiteJsonLd(siteUrl, SITE_DESCRIPTION, homeOgAbsolute)} />
      <Hero />
      <DestinationsGrid cities={cities} />
      {/* Inline "Explore by location" map cube — only on the home page,
          and intentionally placed AFTER the grid: cards are the primary
          CTA, the map is a secondary "see them all on a map" closer.
          Full-screen access still happens via the floating pill in the
          root layout. */}
      <DestinationsMapSection cities={cities} />
    </main>
  );
}
