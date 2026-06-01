/**
 * Passport- and work-aware ranking for a city's visa options.
 *
 * Used by both the Single-city report (rich panel) and the Compare report
 * (compact per-city snippet). Lives outside the React tree so both client
 * components can import the same logic without duplication drift.
 *
 * Framing rule (do not change without product review):
 *   - This is a re-sequencing + reasoning helper, not legal advice.
 *   - We never *hide* visa options; we just put the most-likely-fit on top
 *     with a "Most likely match" badge plus a short reason.
 *   - Copy says "matches your profile" / "your passport gives you …" —
 *     never "we recommend".
 */

import type { VisaOption } from "@/lib/types";
import type { PassportTier, WorkSituation } from "@/lib/scoring";

/**
 * EU/EEA country slugs we have city guides for. EU citizens enjoy free
 * movement here — no visa required for any length of stay.
 *
 * Keep this list in sync with `data/cities.json` countrySlug values that
 * fall inside the EU/EEA. Adding a non-EU country slug by mistake gives
 * misleading visa advice, so be deliberate.
 */
const EU_EEA_COUNTRY_SLUGS: ReadonlySet<string> = new Set([
  "spain",
  "portugal",
  "germany",
  "france",
  "italy",
  "netherlands",
  "ireland",
  "austria",
  "belgium",
  "denmark",
  "finland",
  "sweden",
  "greece",
  "czechia",
  "poland",
  "hungary",
  "norway",
  "iceland",
]);

export function isEuCountry(countrySlug: string): boolean {
  return EU_EEA_COUNTRY_SLUGS.has(countrySlug);
}

export interface RankVisaOptionsResult {
  ranked: VisaOption[];
  topReasoning: string | null;
  /** Optional second-line guidance — used for "you don't need a visa" cases. */
  topAdvisory: string | null;
}

export function rankVisaOptions(
  options: VisaOption[],
  work: WorkSituation,
  passport: PassportTier,
  countrySlug: string,
): RankVisaOptionsResult {
  if (!options.length) {
    return { ranked: [], topReasoning: null, topAdvisory: null };
  }

  const isEu = isEuCountry(countrySlug);

  function tag(opt: VisaOption): string {
    return (
      (opt.anchor ?? "") + " " + (opt.type ?? "") + " " + (opt.description ?? "")
    ).toLowerCase();
  }

  const scored = options.map((opt) => {
    const t = tag(opt);
    let score = 0;

    // ── Work-situation signal ────────────────────────────────────────────
    if (work === "remote" || work === "freelance") {
      if (
        /digital.?nomad|dnv|d8|dtv|remote/.test(t) ||
        opt.anchor === "visa-dnv" ||
        opt.anchor === "visa-d8" ||
        opt.anchor === "visa-dtv"
      ) {
        score += 10;
      }
    }
    if (work === "local") {
      if (/work.?permit|employment|sponsored|skilled/.test(t)) score += 10;
    }

    // ── Passport signal ──────────────────────────────────────────────────
    // EU citizen moving inside the EU/EEA → free movement is THE answer.
    // Boost visa-eu hard, push every other route down so it's not noise.
    if (passport === "eu" && isEu) {
      if (opt.anchor === "visa-eu") score += 30;
      else score -= 6;
    }

    // Strong passports (US/UK/CA/AU/NZ + Japan/Korea/Singapore + Israel)
    // get 90-day visa-free Schengen tourism. So tourist is a real
    // short-stay option, not just noise. But for long-term, formal visas
    // still rule.
    if (passport === "tier1" && isEu) {
      if (opt.anchor === "visa-tourist") score += 2; // softer dropoff
    }

    // "Other" passports — formal residency routes are the realistic path,
    // tourist visa-free shouldn't be over-weighted.
    if (passport === "other") {
      if (opt.anchor !== "visa-tourist" && opt.anchor !== "visa-eu") {
        score += 2;
      }
    }

    // Generic EU free-movement boost (for non-EU passports it stays a
    // signal but small — they can't actually use it).
    if (opt.anchor === "visa-eu" && passport !== "eu") score += 2;

    // Penalize pure tourist-only routes — not a relocation path on their own.
    // (We already softened this above for strong passports inside the EU.)
    if (opt.anchor === "visa-tourist" || /tourist|visa.?on.?arrival/.test(t)) {
      score -= 4;
    }

    return { opt, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.map((s) => s.opt);

  // ── Build the top reasoning + advisory ──────────────────────────────────
  // Special case: EU citizen inside the EU/EEA — short-circuit to a clear
  // "you don't need a visa" message regardless of work situation.
  if (passport === "eu" && isEu) {
    return {
      ranked,
      topReasoning:
        "EU/EEA passport — you don't need a visa for this country. Move freely under EU free movement, register at the local town hall once you have an address, and you're set.",
      topAdvisory:
        "The visa routes below are listed for reference, but none of them apply to you.",
    };
  }

  const top = scored[0];
  if (!top || top.score <= 0) {
    return { ranked, topReasoning: null, topAdvisory: null };
  }

  // ── Reasoning copy ──────────────────────────────────────────────────────
  // Goal: one short sentence that tells the user WHY this option ranked
  // first (passport + work fit) and the SINGLE next thing they need to
  // verify. No marketing fluff, no redundant restatement of their inputs.
  const passportLabel: Record<PassportTier, string> = {
    eu: "your EU/EEA passport",
    tier1: "your US / UK / CA / AU / NZ / Japan / Korea / Singapore / Israel passport",
    other: "your passport",
  };

  const nextStep =
    work === "remote" || work === "freelance"
      ? "Confirm the savings or income threshold before applying."
      : "Typically requires an employer sponsor — start there before applying.";

  const reasoning = `Best fit for ${passportLabel[passport]} and your work situation. ${nextStep}`;

  // Advisory: strong passports + EU country — remind them tourism != relocation.
  let advisory: string | null = null;
  if (passport === "tier1" && isEu) {
    advisory =
      "Heads-up: your passport gets you 90 days visa-free in Schengen for tourism. That's fine for scouting trips, but not a long-term relocation route — you still need a proper visa to live here.";
  }

  return { ranked, topReasoning: reasoning, topAdvisory: advisory };
}
