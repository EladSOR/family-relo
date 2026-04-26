import { SITE_BRAND_NAME } from "@/lib/seo/constants";
import type { BlogPostMeta } from "@/lib/blog/types";

type FaqItem = { question: string; answer: string };

export function buildBlogArticleJsonLd(input: {
  siteUrl: string;
  post: BlogPostMeta;
  canonicalPath: string;
  imageUrl: string;
  description: string;
  faqs: FaqItem[];
}) {
  const { siteUrl, post, canonicalPath, imageUrl, description, faqs } = input;
  const url = `${siteUrl}${canonicalPath}`;
  const headline = post.listTitle;

  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_BRAND_NAME,
      url: `${siteUrl}/`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_BRAND_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
    },
    image: imageUrl,
    url,
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: headline, item: url },
    ],
  };

  const graph: Record<string, unknown>[] = [article, breadcrumb];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
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
