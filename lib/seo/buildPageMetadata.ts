import type { Metadata } from "next";
import { SITE_BRAND_NAME } from "@/lib/seo/constants";

export type PageSocialImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type BuildPageMetadataInput = {
  /** `<title>` and default for OG/Twitter unless overridden below. */
  title: string;
  /** Optional shorter share headline (e.g. city tagline). Defaults to `title`. */
  openGraphTitle?: string;
  description: string;
  /** Path starting with `/`, e.g. `/spain/valencia` */
  canonicalPath: string;
  /**
   * When set, fills `openGraph.images` + `twitter.images`.
   * Omit when the route uses `opengraph-image.tsx` (Next injects the image).
   */
  images?: PageSocialImage[];
};

/**
 * Consistent SEO metadata: `description`, `canonical`, Open Graph, Twitter card.
 * Root `layout` sets `metadataBase`, `openGraph.siteName`, and default `twitter.card`.
 */
export function buildPageMetadata({
  title,
  openGraphTitle,
  description,
  canonicalPath,
  images,
}: BuildPageMetadataInput): Metadata {
  const shareTitle = openGraphTitle ?? title;

  const ogImages =
    images?.map(({ url, width, height, alt }) => ({
      url,
      ...(width != null ? { width } : {}),
      ...(height != null ? { height } : {}),
      ...(alt != null ? { alt } : {}),
    })) ?? [];

  const firstImageUrl = images?.[0]?.url;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: shareTitle,
      description,
      url: canonicalPath,
      type: "website",
      siteName: SITE_BRAND_NAME,
      ...(ogImages.length > 0 ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      ...(firstImageUrl ? { images: [firstImageUrl] } : {}),
    },
  };
}
