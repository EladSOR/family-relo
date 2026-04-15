import { SITE_BRAND_NAME } from "@/lib/seo/constants";

/** Sitewide WebSite entity for the homepage. */
export function buildWebSiteJsonLd(
  siteUrl: string,
  description: string,
  imageUrl?: string,
) {
  const base = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_BRAND_NAME,
    url: `${siteUrl}/`,
    description,
  };
  return imageUrl ? { ...base, image: imageUrl } : base;
}

/** Destinations index: WebPage + breadcrumbs. */
export function buildDestinationsPageJsonLd(
  siteUrl: string,
  description: string,
  ogImageUrl?: string,
) {
  const url = `${siteUrl}/destinations`;
  const webpage: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: `All Destinations — ${SITE_BRAND_NAME}`,
    url,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND_NAME,
      url: `${siteUrl}/`,
    },
  };
  if (ogImageUrl) webpage.image = ogImageUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      webpage,
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
