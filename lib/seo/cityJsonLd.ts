import type { Destination } from "@/lib/types";

/** JSON-LD for city pages: breadcrumbs, place context, FAQ (matches visible FAQ). */
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
