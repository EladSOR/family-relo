import type { BlogPostMeta } from "@/lib/blog/types";
import { clipMetaDescription } from "@/lib/seo/description";

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "lisbon-vs-porto",
    title: "Lisbon vs Porto: Which Is Better for Families? | FamiRelo",
    metaDescription: clipMetaDescription(
      "Lisbon or Porto for your family? Compare cost of living, 3-bed rent, international school fees, childcare, safety, and weather—Portugal’s capital vs the north, with numbers parents actually plan with.",
    ),
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["lisbon", "porto", "portugal", "compare"],
    relatedCityIds: ["lisbon-pt", "porto-pt"],
    listTitle: "Lisbon vs Porto: which city for families?",
  },
  {
    slug: "barcelona-vs-madrid",
    title: "Barcelona vs Madrid: Which City for Families? | FamiRelo",
    metaDescription: clipMetaDescription(
      "Barcelona or Madrid with kids? See rent, monthly family spend, school options, safety, and climate—coast and Catalonia vs Spain’s big inland capital, compared for family relocation and Spain digital nomad planning.",
    ),
    publishedAt: "2026-04-27",
    contentTypeLabel: "Data digest",
    tags: ["barcelona", "madrid", "spain", "compare"],
    relatedCityIds: ["barcelona-es", "madrid-es"],
    listTitle: "Barcelona vs Madrid: which city for families?",
  },
  {
    slug: "valencia-vs-lisbon",
    title: "Valencia vs Lisbon: Which Is Cheaper for Families? | FamiRelo",
    metaDescription: clipMetaDescription(
      "Valencia or Lisbon for family life abroad? Compare housing costs, monthly budgets, international schools, childcare, and safety—Mediterranean Spain vs Portugal’s capital for families planning a move.",
    ),
    publishedAt: "2026-01-26",
    contentTypeLabel: "Data digest",
    tags: ["valencia", "lisbon", "spain", "portugal", "compare"],
    relatedCityIds: ["valencia-es", "lisbon-pt"],
    listTitle: "Valencia vs Lisbon: which city for families?",
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
