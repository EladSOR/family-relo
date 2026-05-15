import { SITE_BRAND_NAME } from "@/lib/seo/constants";

/**
 * Sitewide WebSite + Organization entities for the homepage.
 *
 * `Organization` makes the brand a first-class entity in Google's Knowledge
 * Graph, improves brand SERP, and gives AI search platforms (Perplexity,
 * ChatGPT, Gemini) a clear publisher identity to attribute citations to.
 *
 * `WebSite` is paired so Google can connect the two entities.
 */
export function buildWebSiteJsonLd(
  siteUrl: string,
  description: string,
  imageUrl?: string,
) {
  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: SITE_BRAND_NAME,
    url: `${siteUrl}/`,
    description,
  };
  if (imageUrl) {
    // Logo is what Google uses in SERP brand panels. Until a real logo
    // exists, the OG image works as a stand-in.
    organization.logo = imageUrl;
    organization.image = imageUrl;
  }

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_BRAND_NAME,
    url: `${siteUrl}/`,
    description,
    publisher: { "@id": orgId },
  };
  if (imageUrl) website.image = imageUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };
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

/** Blog index: CollectionPage + breadcrumbs. */
export function buildBlogIndexJsonLd(
  siteUrl: string,
  description: string,
  ogImageUrl?: string,
) {
  const url = `${siteUrl}/blog`;
  const page: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `Blog — ${SITE_BRAND_NAME}`,
    url,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_BRAND_NAME,
      url: `${siteUrl}/`,
    },
  };
  if (ogImageUrl) page.image = ogImageUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      page,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: url },
        ],
      },
    ],
  };
}
