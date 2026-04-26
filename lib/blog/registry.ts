import type { BlogPostMeta } from "@/lib/blog/types";
import { clipMetaDescription } from "@/lib/seo/description";

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "valencia-vs-lisbon",
    title: "Valencia vs Lisbon: Family Costs & Schools Compared | FamiRelo",
    metaDescription: clipMetaDescription(
      "Compare Valencia and Lisbon for family relocation: monthly budgets, rent, schools, safety, and climate side by side — from the same data as our city guides. Not immigration or tax advice.",
    ),
    publishedAt: "2026-01-26",
    contentTypeLabel: "Data digest",
    tags: ["valencia", "lisbon", "spain", "portugal", "compare"],
    relatedCityIds: ["valencia-es", "lisbon-pt"],
    listTitle: "Valencia vs Lisbon: family comparison",
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogPosts(): BlogPostMeta[] {
  return [...BLOG_POSTS].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}
