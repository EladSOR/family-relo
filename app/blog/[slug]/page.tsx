import type { Metadata } from "next";
import type { ReactNode } from "react";
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
  BarcelonaVsMadridArticle,
  LisbonVsPortoArticle,
  ValenciaVsLisbonArticle,
} from "@/components/blog/ComparisonPostBodies";
import {
  getBarcelonaMadridFaqForSchema,
  getLisbonPortoFaqForSchema,
  getValenciaLisbonFaqForSchema,
} from "@/lib/blog/cityPairFaqs";
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

  const pair = requireDestinations(post.relatedCityIds);
  if (!pair || pair.length < 2) notFound();
  const [d0, d1] = pair;

  const siteUrl = getSiteUrl();
  const canonicalPath = `/blog/${post.slug}`;
  const og = resolveCityHeroImage(d0);
  const imageUrl = new URL(og, `${siteUrl}/`).href;
  const dataAsOf = formatLastReviewedLabel(d0.lastReviewed, d1.lastReviewed);

  let faqs: { question: string; answer: string }[];
  let article: ReactNode;

  switch (post.slug) {
    case "valencia-vs-lisbon":
      faqs = getValenciaLisbonFaqForSchema(d0, d1);
      article = <ValenciaVsLisbonArticle valencia={d0} lisbon={d1} dataAsOf={dataAsOf} />;
      break;
    case "lisbon-vs-porto":
      faqs = getLisbonPortoFaqForSchema(d0, d1);
      article = <LisbonVsPortoArticle lisbon={d0} porto={d1} dataAsOf={dataAsOf} />;
      break;
    case "barcelona-vs-madrid":
      faqs = getBarcelonaMadridFaqForSchema(d0, d1);
      article = <BarcelonaVsMadridArticle barcelona={d0} madrid={d1} dataAsOf={dataAsOf} />;
      break;
    default:
      notFound();
  }

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
      {article}
    </main>
  );
}
