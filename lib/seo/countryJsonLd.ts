import { SITE_BRAND_NAME } from "@/lib/seo/constants";

/** Country hub: WebPage + breadcrumbs (no city list markup — keeps payload small). */
export function buildCountryPageJsonLd(
  countryName: string,
  countrySlug: string,
  description: string,
  siteUrl: string,
  ogImageUrl?: string,
) {
  const pageUrl = `${siteUrl}/${countrySlug}`;
  const webpage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: `${countryName} — ${SITE_BRAND_NAME}`,
    url: pageUrl,
    description,
    isPartOf: { "@type": "WebSite", name: SITE_BRAND_NAME, url: `${siteUrl}/` },
  };
  if (ogImageUrl) webpage.image = ogImageUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      webpage,
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
