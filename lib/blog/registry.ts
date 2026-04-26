import type { BlogPostMeta } from "@/lib/blog/types";
import { clipMetaDescription } from "@/lib/seo/description";

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "lisbon-vs-porto",
    title: "Lisbon vs Porto: Family Costs & Schools Compared | FamiRelo",
    metaDescription: clipMetaDescription(
      "Lisbon vs Porto for families: compare monthly budgets, rent, international school fee bands, safety, and climate from the same data as our city guides — Portugal’s two largest metros side by side.",
    ),
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["lisbon", "porto", "portugal", "compare"],
    relatedCityIds: ["lisbon-pt", "porto-pt"],
    listTitle: "Lisbon vs Porto: family comparison",
  },
  {
    slug: "barcelona-vs-madrid",
    title: "Barcelona vs Madrid: Family Relocation Data Compared | FamiRelo",
    metaDescription: clipMetaDescription(
      "Barcelona vs Madrid: side-by-side family budgets, rent anchors, school fee ranges, safety, and climate from our city guides. Same national Spain DNV context; different lifestyle and language trade-offs.",
    ),
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["barcelona", "madrid", "spain", "compare"],
    relatedCityIds: ["barcelona-es", "madrid-es"],
    listTitle: "Barcelona vs Madrid: family comparison",
  },
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
