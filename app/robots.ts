import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

/**
 * Crawl policy:
 *  - Allow Googlebot, Bingbot, DuckDuckBot, social previewers — search engines.
 *  - Allow live AI-search bots (OAI-SearchBot, PerplexityBot, ChatGPT-User, etc.) —
 *    these surface the site in AI-powered search results and send real traffic.
 *  - Block training-only crawlers — they burn bandwidth and never send a visitor.
 *    Note: `Google-Extended` and `Applebot-Extended` are AI training tokens ONLY,
 *    blocking them does NOT affect Google or Apple Spotlight search rankings.
 */
const BLOCKED_BOTS = [
  "GPTBot",            // OpenAI training (NOT OAI-SearchBot, which we allow)
  "anthropic-ai",      // Anthropic legacy training token
  "Claude-Web",        // Anthropic legacy training token
  "CCBot",             // Common Crawl — corpus that feeds most LLM training
  "Google-Extended",   // Google AI training opt-out token (≠ Googlebot)
  "Applebot-Extended", // Apple AI training opt-out token (≠ Applebot)
  "Amazonbot",         // Alexa indexing — no human traffic
  "FacebookBot",       // Meta AI training (≠ facebookexternalhit, which we allow)
  "Diffbot",           // Third-party scraper
  "ImagesiftBot",      // Image scraper for AI training
  "Omgilibot",         // AI training aggregator
  "Omgili",
  "Bytespider",        // ByteDance scraper — minimal traffic value
  "MistralAI-User",    // Mistral training
  "cohere-ai",         // Cohere training
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getAbsoluteSiteUrl();

  return {
    rules: [
      ...BLOCKED_BOTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/auth/", "/compare/build", "/compare/results", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
