/** Country hub: WebPage + breadcrumbs (no city list markup — keeps payload small). */
export function buildCountryPageJsonLd(
  countryName: string,
  countrySlug: string,
  description: string,
  siteUrl: string,
) {
  const pageUrl = `${siteUrl}/${countrySlug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: `${countryName} — Family Relocation Engine`,
        url: pageUrl,
        description,
        isPartOf: { "@type": "WebSite", name: "Family Relocation Engine", url: `${siteUrl}/` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: countryName, item: pageUrl },
        ],
      },
    ],
  };
}
