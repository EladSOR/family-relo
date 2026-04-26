import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog/registry";
import { getDestinationById, requireDestinations } from "@/lib/blog/getDestinationsByIds";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { buildBlogArticleJsonLd } from "@/lib/seo/blogJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";
import { resolveCityHeroImage } from "@/lib/constants";
import { JsonLd } from "@/components/JsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import StickySearchHeader from "@/components/StickySearchHeader";
import {
  ValenciaVsLisbonArticle,
  getValenciaLisbonFaqForSchema,
} from "@/components/blog/ValenciaVsLisbonArticle";
import { formatLastReviewedLabel } from "@/lib/blog/formatReviewed";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const canonicalPath = `/blog/${post.slug}`;
  return buildPageMetadata({
    title: post.title,
    description: post.metaDescription,
    canonicalPath,
    images: [
      {
        url: resolveFirstCityHeroForOg(post),
        alt: `${post.listTitle} — FamiRelo data digest`,
      },
    ],
  });
}

function resolveFirstCityHeroForOg(post: { relatedCityIds: string[] }) {
  const id = post.relatedCityIds[0];
  const dest = id ? getDestinationById(id) : undefined;
  if (dest) return resolveCityHeroImage(dest);
  return resolveCityHeroImage({ city: "Valencia" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  if (post.slug === "valencia-vs-lisbon") {
    const pair = requireDestinations(post.relatedCityIds);
    if (!pair || pair.length < 2) notFound();
    const [valencia, lisbon] = pair;

    const siteUrl = getSiteUrl();
    const canonicalPath = `/blog/${post.slug}`;
    const og = resolveCityHeroImage(valencia);
    const imageUrl = new URL(og, `${siteUrl}/`).href;
    const dataAsOf = formatLastReviewedLabel(valencia.lastReviewed, lisbon.lastReviewed);
    const faqs = getValenciaLisbonFaqForSchema(valencia, lisbon);

    return (
      <main className="min-h-screen bg-[#F5EFE8]">
        <JsonLd
          data={buildBlogArticleJsonLd({
            siteUrl,
            post,
            canonicalPath,
            imageUrl,
            description: post.metaDescription,
            faqs,
          })}
        />
        <StickySearchHeader />
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.listTitle },
          ]}
        />
        <ValenciaVsLisbonArticle valencia={valencia} lisbon={lisbon} dataAsOf={dataAsOf} />
      </main>
    );
  }

  notFound();
}
