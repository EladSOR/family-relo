/** One blog article — metadata + routing. Content is implemented as a dedicated component per slug. */
export type BlogPostMeta = {
  slug: string;
  /** `<title>` / OG title — must include ` | FamiRelo` and stay within SERP limits (see `.cursor/rules/blog.mdc`). */
  title: string;
  metaDescription: string;
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  /** Display label, e.g. "Data digest" */
  contentTypeLabel: string;
  /** Optional — defaults to `publishedAt` */
  updatedAt?: string;
  tags: string[];
  /** City `id` values from `data/cities.json` that this post depends on */
  relatedCityIds: string[];
  /** Short H1 / list card title (no brand suffix) */
  listTitle: string;
};
