// ── Destination (main domain type) ───────────────────────────────────────────

export interface Destination {
  id: string;
  citySlug: string;
  countrySlug: string;

  /** City display name, e.g. "Koh Phangan" */
  city: string;
  /** Country display name, e.g. "Thailand" */
  country: string;

  /** One-line hook shown on cards and page headers */
  tagline: string;
  /** 2–4 sentence overview shown at the top of the city page */
  summary: string;

  /**
   * ISO year-month string indicating when this record was last reviewed.
   * Used to surface data freshness to users. e.g. "2026-01"
   */
  lastReviewed: string;

  /**
   * Optional Unsplash (or other HTTPS) URL for card + city-page hero.
   * When unset, `lib/constants.ts` → `CITY_IMAGES[city]` is used.
   */
  heroImage?: string;

  /**
   * Ordered, concrete action steps a family should take to relocate here.
   * Written in plain language. Drives the "Action Checklist" UX.
   *
   * RULE: Every `targetSection` must be one of the approved section ids.
   * At most 2 items per checklist may omit `targetSection` (general logistics only).
   */
  actionChecklist: {
    label: string;
    targetSection?: "visa" | "schools" | "housing" | "healthcare" | "childcare" | "residency" | "banking" | "safety";
  }[];

  familyFit: {
    /** Exactly 4 items — specific family archetypes */
    bestFor: string[];
    /** Exactly 4 items — honest, specific trade-offs */
    watchOutFor: string[];
  };

  /**
   * City-specific visa options. When absent, the page falls back to
   * the shared country-level visa data from `data/countries.json` (keyed by `countrySlug`).
   *
   * Scaling: put national immigration rules once under `countries.json` (e.g. `usa`, `france`)
   * and omit `visa` on each city so every city in that country stays in sync. Override `visa`
   * only when a city truly needs different options (rare).
   *
   * RULE: Every VisaOption must have `anchor`, `detailTitle`, and `details[]`.
   * New anchors must also be registered in `components/VisaPathSelector.tsx`.
   */
  visa?: {
    status: DataStatus;
    summary: string;
    options: VisaOption[];
    tip?: string;
    /** Google search query rendered as a SearchHint button below the tip */
    tipSearchQuery?: string;
  };

  /**
   * Housing section — all four blocks are required.
   *
   * RULE: All four content blocks must be populated before shipping a city page.
   * The renderer displays them in a fixed order: search → prices → areas → requirements.
   * Use `typicalPrices` and `whatYouNeedToRent` fallbacks only if data is truly unavailable.
   */
  housing: {
    status: DataStatus;
    /** 1–2 sentence overview of the housing market */
    summary: string;
    /** Neighbourhood names — shown as chips in "Best areas for families" block */
    bestAreas: string[];
    /**
     * Three-line intro for the "Where to search" block.
     * Line 1: what these platforms are.
     * Line 2: "Search '[City Name]' inside each platform…"
     * Line 3: Tip for arrival/short-stay.
     */
    searchPortalsIntro: string[];
    /**
     * List of rental platforms. Use root URLs only — no deep/filtered links.
     * Facebook entries must be text-only (no `url` field).
     * Set `isVerified: true` only after confirming the URL resolves correctly.
     */
    searchPortals: { label: string; url?: string; isVerified?: boolean }[];
    /** Bullet list of 4–5 typical monthly rent examples in local currency */
    typicalPrices?: string[];
    /** Bullet list of documents and requirements to rent in this city */
    whatYouNeedToRent?: string[];
  };

  schools: {
    status: DataStatus;
    summary: string;
    publicSystem: string;
    internationalOptions: string;
    languageNotes: string;
    /**
     * RULE: Use `options[]` only. Never use specific school names.
     * Each entry describes a *type* of school (e.g. "British curriculum international schools"),
     * not a named institution. The renderer auto-generates a SearchHint from `type + city + country`.
     *
     * @deprecated `examples[]` — replaced by `options[]`
     */
    examples?: SchoolExample[];
    /** School-type categories. Required — replaces named `examples[]`. */
    options?: SchoolOption[];
    /** One urgent, specific action — e.g. "Apply 12+ months before your move" */
    tip?: string;
  };

  /**
   * Childcare section — structured three-block format required.
   *
   * RULE: Use the three `*Items` arrays. Do not use the deprecated prose fields.
   */
  childcare: {
    status: DataStatus;
    /** 1–2 sentence overview */
    summary: string;
    /** Bullet list: daycare/nursery availability, prices, tips */
    daycareItems: string[];
    /** Bullet list: nanny/au pair rates, cultural notes, timing */
    nannyItems: string[];
    /** Bullet list: where families actually find childcare in this city */
    whereToFindItems: string[];
    /** @deprecated Use `daycareItems` instead */
    daycareNotes?: string;
    /** @deprecated Use `nannyItems` instead */
    nannyNotes?: string;
    /** @deprecated Use `daycareItems` and `nannyItems` instead */
    typicalCost?: string;
    /** @deprecated Use `whereToFindItems` instead */
    howFamiliesFindIt?: string;
  };

  /**
   * Healthcare section — structured bullet list required.
   *
   * RULE: Use `items[]`. The `summary` prose field is deprecated.
   */
  healthcare: {
    status: DataStatus;
    /** @deprecated Use `items[]` instead */
    summary?: string;
    /** 5 bullets: system access, top facility, cost anchor, insurance, local quirk */
    items: string[];
    /** One actionable tip — the single most important thing to do */
    tip?: string;
  };

  /**
   * Safety section — structured bullet list required.
   *
   * RULE: Use `items[]`. Score must be between 75 and 90.
   */
  safety: {
    status: DataStatus;
    /** Honest safety score. Range: 75–90. Do not inflate. */
    score: number;
    /** @deprecated Use `items[]` instead */
    summary?: string;
    /** 5 bullets: crime, #1 daily risk, local hazard, area contrast, norms */
    items: string[];
  };

  /**
   * Residency registration section — required for all city pages.
   *
   * RULE: Must be present. All local terms must be explained inline on first use.
   */
  residency: {
    title?: string;
    /** 4–5 actionable bullets */
    items: string[];
    /** One tip — include a URL if a stable official link exists */
    tip?: string;
  };

  /**
   * Banking section — required for all city pages.
   */
  banking: {
    title?: string;
    /** 4–5 actionable bullets: banks, documents, digital bridge, transfers, cash */
    items: string[];
    tip?: string;
  };

  /**
   * Quick-stat cost cards shown at the top of the page and on homepage cards.
   *
   * RULE: All three fields use a single approximate value with `~` prefix in local currency.
   * `nannyRate` is hourly. `rentRange` is monthly. Never use ranges.
   */
  cost: {
    status: DataStatus;
    /** e.g. "~€1,300 / month" */
    rentRange: string;
    /** e.g. "~€45" */
    familyDinner: string;
    /** e.g. "~€12 / hr" */
    nannyRate: string;
    /** @deprecated */
    childcare?: string;
    /** @deprecated */
    childcareType?: "daycare" | "nanny";
    /** @deprecated */
    nannyHourly?: number;
  };

  /** Sources organised by topic section for credibility */
  sources: SectionSources;

  /**
   * Community search guidance (Facebook groups, expat forums).
   * No URLs — the renderer shows a description + a "Search on Google" button.
   *
   * - `label`       — human-readable description of the group / resource
   * - `searchQuery` — exact string sent to Google search button
   *                   e.g. "Valencia Expats Facebook group"
   */
  communityLinks?: { label: string; searchQuery?: string }[];

  /** FAQ section — 8 questions and answers shown between Safety and Sources */
  faq?: { question: string; answer: string }[];
}

// ── Trust / verification layer ────────────────────────────────────────────────

/**
 * - "verified"  — sourced from an official government or institutional document
 * - "curated"   — editorially researched from reputable secondary sources
 * - "estimated" — ballpark figures based on community data or cost-of-living indices
 * - "draft"     — placeholder content not yet reviewed; do not surface to end users
 */
export type DataStatus = "verified" | "curated" | "estimated" | "draft";

// ── Sub-types ─────────────────────────────────────────────────────────────────

/** A named sub-section inside a visa option's detail area, with its own scroll anchor. */
export interface VisaSection {
  id: string;
  heading: string;
  items: string[];
  /**
   * `officialLink.label` is rendered as a plain-text search hint — NOT a clickable link.
   * The renderer generates: 'Search "[label]" for official details'
   * `url` is retained as dormant data only; it is never rendered.
   */
  officialLink?: { label: string; url?: string };
}

/**
 * RULE: Every VisaOption that should be interactive must have:
 * - `anchor`      — unique string like "visa-dtv". Register in VisaPathSelector.tsx.
 * - `detailTitle` — heading for the detail panel
 * - `details[]`   — 4–6 flat bullet strings explaining how to apply
 */
export interface VisaOption {
  type: string;
  duration?: string;
  description?: string;
  anchor?: string;
  detailTitle?: string;
  /** Flat bullet list — used when no named sub-sections are needed */
  details?: string[];
  /** Structured sub-sections — takes precedence over `details` when present */
  sections?: VisaSection[];
  /**
   * `officialLink.label` is rendered as a plain-text search hint — NOT a clickable link.
   * The renderer generates: 'Search "[label]" for official details'
   * `url` is retained as dormant data only; it is never rendered.
   */
  officialLink?: { label: string; url?: string };
}

// ── Country-level shared data ─────────────────────────────────────────────────

export interface CountryData {
  name: string;
  visa?: {
    status: DataStatus;
    summary: string;
    options: VisaOption[];
    tip?: string;
    tipSearchQuery?: string;
  };
}

/** @deprecated Use SchoolOption instead. Never render specific school names. */
export interface SchoolExample {
  name: string;
  curriculum: string;
  fees?: string;
  url?: string;
  isVerified?: boolean;
}

/**
 * Describes a *type* of school available in the city.
 * Never name specific schools — institutions close, move, or change.
 *
 * RULE:
 * - `type`        — category label AND the base of the auto-generated search query
 *                   e.g. "British curriculum international schools"
 * - `description` — honest availability note, e.g. "Small selection, limited spots"
 * - `fees`        — detached estimate, NOT tied to any named school
 */
export interface SchoolOption {
  type: string;
  description: string;
  fees?: string;
}

/**
 * RULE: `isVerified` must be explicitly set to `true` for the link to render as clickable.
 * Any link without `isVerified: true` (missing or false) renders as plain text fallback.
 * This prevents unreviewed, broken, or future-added links from silently appearing as dead clicks.
 */
export interface Source {
  label: string;
  url: string;
  /** Set to true only after confirming the URL is stable and resolves correctly. */
  isVerified?: boolean;
}

export interface SectionSources {
  visa?: Source[];
  schools?: Source[];
  housing?: Source[];
  healthcare?: Source[];
  cost?: Source[];
}

// ── Search / UI types ─────────────────────────────────────────────────────────

export interface GuestCounts {
  adults: number;
  infants: number;
  children: number;
  teens: number;
}

export type OpenPanel = "where" | "who" | "duration" | null;

export interface GuestRow {
  key: keyof GuestCounts;
  label: string;
  sub: string;
}
