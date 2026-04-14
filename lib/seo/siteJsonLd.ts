/** Sitewide WebSite entity for the homepage. */
export function buildWebSiteJsonLd(siteUrl: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Family Relocation Engine",
    url: `${siteUrl}/`,
    description,
  };
}

/** Destinations index: WebPage + breadcrumbs. */
export function buildDestinationsPageJsonLd(siteUrl: string, description: string) {
  const url = `${siteUrl}/destinations`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: "All Destinations — Family Relocation Engine",
        url,
        description,
        isPartOf: {
          "@type": "WebSite",
          name: "Family Relocation Engine",
          url: `${siteUrl}/`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "All destinations", item: url },
        ],
      },
    ],
  };
}
