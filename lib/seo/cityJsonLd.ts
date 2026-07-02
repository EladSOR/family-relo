import type { Destination } from "@/lib/types";
import { SITE_BRAND_NAME } from "@/lib/seo/constants";
import { citySerpTitle } from "@/lib/seo/serpCopy";

/** `lastReviewed` is "YYYY-MM" — expand to an ISO date (first of the month). */
function lastReviewedToIso(raw: string | undefined): string | undefined {
  if (!raw || !/^\d{4}-\d{2}$/.test(raw)) return undefined;
  return `${raw}-01`;
}

/** JSON-LD for city pages: breadcrumbs, place context, article dates, FAQ (matches visible FAQ). */
export function buildCityPageJsonLd(dest: Destination, siteUrl: string, heroImageUrl: string) {
  const path = `/${dest.countrySlug}/${dest.citySlug}`;
  const pageUrl = `${siteUrl}${path}`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dest.country,
        item: `${siteUrl}/${dest.countrySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: dest.city,
        item: pageUrl,
      },
    ],
  };

  const place = {
    "@type": "Place",
    "@id": `${pageUrl}#place`,
    name: dest.city,
    description: dest.summary,
    image: heroImageUrl,
    containedInPlace: {
      "@type": "Country",
      name: dest.country,
    },
  };

  const graph: Record<string, unknown>[] = [breadcrumb, place];

  // Machine-readable freshness: `lastReviewed` drives dateModified so Google
  // sees when the guide was last updated (see serp-timeless.mdc — schema dates
  // are allowed; visible meta strings stay evergreen).
  const reviewedIso = lastReviewedToIso(dest.lastReviewed);
  if (reviewedIso) {
    graph.push({
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: citySerpTitle(dest),
      description: dest.summary,
      image: heroImageUrl,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      datePublished: reviewedIso,
      dateModified: reviewedIso,
      about: { "@id": `${pageUrl}#place` },
      author: {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_BRAND_NAME,
        url: `${siteUrl}/`,
      },
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }

  if (dest.faq && dest.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: dest.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
