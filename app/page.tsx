import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import DestinationsGrid from "@/components/home/DestinationsGrid";
import DestinationsMapSection from "@/components/home/DestinationsMapSection";
import SponsorBanner from "@/components/ads/SponsorBanner";
import SponsorStrip from "@/components/ads/SponsorStrip";
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
      {/* Single-card sponsor banner directly under the hero. Stays visible
          regardless of how many destinations live below — important once the
          grid grows past a viewport. */}
      <SponsorBanner />
      <DestinationsGrid cities={cities} />
      {/* Inline "Explore by location" map cube — secondary CTA after the
          grid. Full-screen access still happens via the floating pill in the
          root layout. */}
      <DestinationsMapSection cities={cities} />
      {/* Full 3-card sponsor strip at the bottom — secondary placement that
          surfaces all current sponsors + the open-slot CTA in one block. */}
      <SponsorStrip />
    </main>
  );
}
