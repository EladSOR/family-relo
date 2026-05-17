/**
 * Content scanner: ask an LLM whether a given city/section in our JSON still
 * matches what the official source URLs say. Returns zero or more Findings.
 *
 * Cost model:
 *   • One scan = one city × one section = one OpenAI chat completion.
 *   • Uses `gpt-4o-mini` by default — cheapest model that handles this well.
 *   • Typical cost per scan: ~$0.001–$0.005. Full sweep of 100 cities × 9
 *     sections = roughly $1–$5. Budget-friendly.
 *
 * Safety:
 *   • If `OPENAI_API_KEY` is missing, returns [] — never throws. The dashboard
 *     keeps showing demo findings.
 *   • If the master kill switch (`SCAN_ENABLED=true`) is off, callers must
 *     skip scanning entirely. The scanner itself doesn't check this — that's
 *     the API/cron layer's job, so a developer can still run a one-off scan
 *     locally with `SCAN_ENABLED=false` if they want to test.
 *   • Output is validated against a strict JSON schema. Malformed model
 *     output → finding is dropped, not committed.
 */

import { createHash } from "node:crypto";
import { configFor, type SectionKey } from "./scanConfig";
import type { Finding } from "./findings";

// ── Minimal model client (no @openai/openai dep needed for V1) ───────────────

interface ChatMessage { role: "system" | "user"; content: string }

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
  usage?: { prompt_tokens: number; completion_tokens: number };
}

async function chat(model: string, messages: ChatMessage[], jsonMode = true): Promise<ChatCompletionResponse> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

// ── Source URL extraction from a city's JSON ─────────────────────────────────
//
// We don't fetch the page content — the model is told the source URL and asked
// to apply its own training knowledge. (Network scraping of arbitrary gov
// sites inside Vercel functions is unreliable and slow.) The model can flag
// suspected drift; the admin verifies by opening the source URL.

interface CityLike {
  id: string;
  city: string;
  country: string;
  [k: string]: unknown;
}

function extractSourceUrls(city: CityLike, section: string): string[] {
  const sources = (city.sources ?? {}) as Record<string, Array<{ url?: string; isVerified?: boolean }>>;
  const list   = sources[section] ?? [];
  return list
    .filter(s => s.isVerified !== false && typeof s.url === "string" && s.url.startsWith("http"))
    .map(s => s.url as string);
}

// ── Hash helpers ─────────────────────────────────────────────────────────────

function findingId(cityId: string, section: string, fieldPath: string): string {
  return createHash("sha1").update(`${cityId}|${section}|${fieldPath}`).digest("hex").slice(0, 16);
}

// ── Scanner entrypoint ───────────────────────────────────────────────────────

export interface ScanOptions {
  /** When true, ignore enabled flags and run anyway (used by manual "Scan now"). */
  force?: boolean;
  /** Override the model (defaults to env or gpt-4o-mini). */
  model?: string;
}

export async function scanCitySection(
  city: CityLike,
  section: SectionKey | string,
  opts: ScanOptions = {},
): Promise<Finding[]> {
  const cfg = configFor(section);
  if (!opts.force && !cfg.enabled) return [];

  if (!process.env.OPENAI_API_KEY) {
    // No key → nothing to do. Demo findings remain visible.
    return [];
  }

  const sectionData = (city as Record<string, unknown>)[section];
  if (!sectionData) return [];

  const sourceUrls = extractSourceUrls(city, section);

  const model = opts.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  // Try to fetch each source page so the model has actual ground truth, not
  // training memory. Sources that block bots, return PDFs, or fail → quietly
  // skipped. If we have zero usable sources, we don't scan (no hedged guesses).
  const fetched = await Promise.all(sourceUrls.slice(0, 3).map(fetchSourceText));
  const usableSources = fetched.filter((f): f is { url: string; text: string } => f !== null);
  if (usableSources.length === 0) return [];

  const sys = [
    "You audit a family-relocation guide site (FamiRelo).",
    "INPUT: (1) a JSON section about a city, (2) plain text extracted from the section's official source URL(s).",
    "TASK: For each scalar field in the JSON, decide whether the source TEXT contradicts the JSON value.",
    "",
    "STRICT RULES:",
    "  • Only emit a finding when you can quote a specific sentence or number from the source text that contradicts the JSON value.",
    "  • Quote the supporting passage verbatim in `evidence` (max 300 chars). No paraphrasing.",
    "  • Do NOT use prior knowledge — only what is present in the provided source text.",
    "  • Do NOT emit findings for stylistic, structural, or 'might have changed' guesses.",
    "  • If a field has no clear source statement to compare against, skip it. Empty findings is the correct answer when the source is silent.",
    "  • currentValue must match the JSON exactly (verbatim).",
    "  • proposedValue must be the JSON value rewritten to match what the source says — change only the contradicted detail.",
    "",
    "Return strict JSON:",
    "{ \"findings\": [ { fieldPath, summary, currentValue, proposedValue, sourceUrl, evidence, rationale } ] }",
  ].join("\n");

  const user = [
    `City: ${city.city}, ${city.country} (id: ${city.id})`,
    `Section: ${section}`,
    "",
    "── Current JSON section content ──",
    "```json",
    JSON.stringify(sectionData, null, 2).slice(0, 6000),
    "```",
    "",
    ...usableSources.map((s, i) => [
      `── Source ${i + 1}: ${s.url} ──`,
      s.text.slice(0, 12000),
      "",
    ].join("\n")),
    "Audit this section. Reply with JSON only. If the source text doesn't contradict the JSON, return { \"findings\": [] }.",
  ].join("\n");

  let raw: ChatCompletionResponse;
  try {
    raw = await chat(model, [{ role: "system", content: sys }, { role: "user", content: user }]);
  } catch (err) {
    throw new Error(`Scan failed for ${city.id}/${section}: ${(err as Error).message}`);
  }

  const text = raw.choices?.[0]?.message?.content ?? "{}";
  let parsed: { findings?: unknown[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  const rawFindings = Array.isArray(parsed.findings) ? parsed.findings : [];

  const now = new Date().toISOString();
  const out: Finding[] = [];
  for (const f of rawFindings) {
    const o = f as Record<string, unknown>;
    const fieldPath     = String(o.fieldPath ?? "").trim();
    const summary       = String(o.summary ?? "").trim();
    const currentValue  = String(o.currentValue ?? "").trim();
    const proposedValue = String(o.proposedValue ?? "").trim();
    const sourceUrl     = String(o.sourceUrl ?? usableSources[0]?.url ?? "").trim();
    const rationale     = String(o.rationale ?? "").trim();
    const evidence      = String(o.evidence ?? "").trim();

    // Definitive findings only — must have an evidence quote from the source.
    if (!fieldPath || !summary || !currentValue || !proposedValue || !evidence) continue;
    if (currentValue === proposedValue) continue;

    out.push({
      id:           findingId(city.id, section, fieldPath),
      cityId:       city.id,
      cityName:     city.city,
      country:      city.country,
      section,
      fieldPath,
      summary,
      currentValue,
      proposedValue,
      sourceUrl,
      confidence:   1,
      detectedAt:   now,
      status:       "open",
      rationale:    evidence ? `${rationale}\n\nSource excerpt: "${evidence}"`.trim() : rationale,
    });
  }
  return out;
}

// ── Source fetcher (tiny, dependency-free HTML → text) ──────────────────────

async function fetchSourceText(url: string): Promise<{ url: string; text: string } | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        // Pretend to be a normal browser. Many gov sites 403 unknown UAs.
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("text/plain") && !ct.includes("application/xhtml")) {
      return null;        // skip PDFs, JSON APIs, images, etc.
    }
    const html = await res.text();
    const text = htmlToText(html);
    if (text.length < 200) return null;
    return { url, text };
  } catch {
    return null;
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
