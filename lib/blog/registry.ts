import type { BlogPostMeta } from "@/lib/blog/types";

/**
 * ≤ `META_DESCRIPTION_MAX` (165), **complete sentences** — do not rely on `clipMetaDescription` to fix length
 * (see `serp-metadata.mdc`). Run a character count after edits.
 */
export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "dubai-vs-abu-dhabi",
    title: "Dubai vs Abu Dhabi: rent, schools & UAE costs | FamiRelo",
    metaDescription:
      "Dubai vs Abu Dhabi: rent, budgets, school bands, childcare, safety, climate. Pulled from both UAE guides—open each for visas, housing, checklists—not legal advice.",
    publishedAt: "2026-05-15",
    tags: ["dubai", "abu-dhabi", "uae", "compare"],
    relatedCityIds: ["dubai-ae", "abu-dhabi-ae"],
    listTitle: "Dubai vs Abu Dhabi: rent, schools & UAE costs",
  },
  {
    slug: "bangkok-vs-chiang-mai",
    title: "Bangkok vs Chiang Mai: rent, schools & Thai costs | FamiRelo",
    metaDescription:
      "Bangkok or Chiang Mai: rent, bilingual fees, childcare, nanny lines, safety, climate. Mirrors both Thai guides—visa wording stays full-length—not advice.",
    publishedAt: "2026-05-14",
    tags: ["bangkok", "chiang-mai", "thailand", "compare"],
    relatedCityIds: ["bangkok-th", "chiang-mai-th"],
    listTitle: "Bangkok vs Chiang Mai: rent, schools & Thai costs",
  },
  {
    slug: "sydney-vs-melbourne",
    title: "Sydney vs Melbourne: rent, schools & Aussie costs | FamiRelo",
    metaDescription:
      "Sydney vs Melbourne: rent anchors, budgets, school bands, nanny rates, safety, climate from each Australian guide—open pages next for visas and suburbs—not advice.",
    publishedAt: "2026-05-13",
    tags: ["sydney", "melbourne", "australia", "compare"],
    relatedCityIds: ["sydney-au", "melbourne-au"],
    listTitle: "Sydney vs Melbourne: rent, schools & Aussie costs",
  },
  {
    slug: "auckland-vs-wellington",
    title: "Auckland vs Wellington: rent, schools & NZ costs | FamiRelo",
    metaDescription:
      "Auckland vs Wellington: rent, budgets, school bands, childcare, safety, climate from each NZ guide—then reopen checklists on those pages.",
    publishedAt: "2026-05-12",
    tags: ["auckland", "wellington", "new-zealand", "compare"],
    relatedCityIds: ["auckland-nz", "wellington-nz"],
    listTitle: "Auckland vs Wellington: rent, schools & NZ costs",
  },
  {
    slug: "toronto-vs-vancouver",
    title: "Toronto vs Vancouver: rent, schools & Canada costs | FamiRelo",
    metaDescription:
      "Toronto vs Vancouver: rent, budgets, school brackets, childcare, safety, seasonal rows lifted from both Canadian guides. Housing portals remain on those pages.",
    publishedAt: "2026-05-11",
    tags: ["toronto", "vancouver", "canada", "compare"],
    relatedCityIds: ["toronto-ca", "vancouver-ca"],
    listTitle: "Toronto vs Vancouver: rent, schools & Canada costs",
  },
  {
    slug: "barcelona-vs-malaga",
    title: "Barcelona vs Malaga: rent, schools & coast life | FamiRelo",
    metaDescription:
      "Barcelona or Malaga: rent, budgets, school categories, childcare, climate, safety. Shares Spain remote-work framing; visas live on each coastal guide.",
    publishedAt: "2026-05-10",
    tags: ["barcelona", "malaga", "spain", "compare"],
    relatedCityIds: ["barcelona-es", "malaga-es"],
    listTitle: "Barcelona vs Malaga: rent, schools & coast life",
  },
  {
    slug: "valencia-vs-alicante",
    title: "Valencia vs Alicante: rent, schools & family costs | FamiRelo",
    metaDescription:
      "Valencia or Alicante: rent, budgets, school bands, nanny lines, Mediterranean climate snapshots. Mirrors both Spanish relocation guides—not legal advice.",
    publishedAt: "2026-05-09",
    tags: ["valencia", "alicante", "spain", "compare"],
    relatedCityIds: ["valencia-es", "alicante-es"],
    listTitle: "Valencia vs Alicante: rent, schools & family costs",
  },
  {
    slug: "berlin-vs-munich",
    title: "Berlin vs Munich: rent, schools & Germany costs | FamiRelo",
    metaDescription:
      "Berlin or Munich: rent, multilingual school dues, daycare cues, nanny rates, budgets, seasonal rows. Figures match both German relocation guides.",
    publishedAt: "2026-05-08",
    tags: ["berlin", "munich", "germany", "compare"],
    relatedCityIds: ["berlin-de", "munich-de"],
    listTitle: "Berlin vs Munich: rent, schools & Germany costs",
  },
  {
    slug: "amsterdam-vs-zurich",
    title: "Amsterdam vs Zurich: rent, schools & family costs | FamiRelo",
    metaDescription:
      "Amsterdam vs Zurich: rent, budgets, school brackets, childcare, safety, climate in one table. Full nuance stays on each premium European guide—not tax advice.",
    publishedAt: "2026-05-07",
    tags: ["amsterdam", "zurich", "netherlands", "switzerland", "compare"],
    relatedCityIds: ["amsterdam-nl", "zurich-ch"],
    listTitle: "Amsterdam vs Zurich: rent, schools & family costs",
  },
  {
    slug: "prague-vs-budapest",
    title: "Prague vs Budapest: rent, schools & Central Europe costs | FamiRelo",
    metaDescription:
      "Prague or Budapest: rent, bilingual tuition bands, budgets, nanny rates, safety, climate. Compare here, then follow each Central European guide for visas.",
    publishedAt: "2026-05-06",
    tags: ["prague", "budapest", "czech-republic", "hungary", "compare"],
    relatedCityIds: ["prague-cz", "budapest-hu"],
    listTitle: "Prague vs Budapest: rent, schools & Central Europe costs",
  },
  {
    slug: "lisbon-vs-porto",
    title: "Lisbon vs Porto: rent, schools & family costs compared | FamiRelo",
    metaDescription:
      "Lisbon or Porto? Compare cost of living, rent, school fees, childcare, safety, and weather for families. Portugal's capital versus the north.",
    publishedAt: "2026-04-27",
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
