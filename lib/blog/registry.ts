import type { BlogPostMeta } from "@/lib/blog/types";

/**
 * ≤ `META_DESCRIPTION_MAX` (165), **complete sentences** — do not rely on `clipMetaDescription` to fix length
 * (see `serp-metadata.mdc`). Run a character count after edits.
 */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "lisbon-vs-porto",
    title: "Lisbon vs Porto: rent, schools & family costs compared | FamiRelo",
    metaDescription:
      "Lisbon or Porto? Compare cost of living, rent, school fees, childcare, safety, and weather for families. Portugal's capital versus the north.",
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["lisbon", "porto", "portugal", "compare"],
    relatedCityIds: ["lisbon-pt", "porto-pt"],
    listTitle: "Lisbon vs Porto: rent, schools & family costs",
  },
  {
    slug: "barcelona-vs-madrid",
    title: "Barcelona vs Madrid: rent, schools & best for families? | FamiRelo",
    metaDescription:
      "Barcelona or Madrid with kids? Compare rent, budgets, school options, safety, and climate. Mediterranean coast versus Spain's inland capital.",
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["barcelona", "madrid", "spain", "compare"],
    relatedCityIds: ["barcelona-es", "madrid-es"],
    listTitle: "Barcelona vs Madrid: rent, schools & family life",
  },
  {
    slug: "valencia-vs-lisbon",
    title: "Valencia vs Lisbon: rent, schools & costs for families | FamiRelo",
    metaDescription:
      "Valencia or Lisbon for family life? Compare rent, all-in costs, international schools, childcare, and safety. Spain or Portugal in one read.",
    publishedAt: "2026-01-26",
    contentTypeLabel: "Data digest",
    tags: ["valencia", "lisbon", "spain", "portugal", "compare"],
    relatedCityIds: ["valencia-es", "lisbon-pt"],
    listTitle: "Valencia vs Lisbon: rent, schools & costs",
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
