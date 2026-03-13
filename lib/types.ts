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
   * Ordered, concrete action steps a family should take to relocate here.
   * Written in plain language. Drives the "Action Checklist" UX.
   * `targetSection` optionally links the step to the relevant page section.
   */
  actionChecklist: {
    label: string;
    targetSection?: "visa" | "schools" | "housing" | "healthcare" | "childcare";
  }[];

  familyFit: {
    bestFor: string[];
    watchOutFor: string[];
  };

  visa: {
    status: DataStatus;
    summary: string;
    options: VisaOption[];
  };

  housing: {
    status: DataStatus;
    summary: string;
    bestAreas: string[];
  };

  schools: {
    status: DataStatus;
    /** Short overview paragraph */
    summary: string;
    /** Description of the local public / state school system */
    publicSystem: string;
    /** Overview of international / private English-medium options */
    internationalOptions: string;
    /** Language of instruction notes, bilingual considerations */
    languageNotes: string;
    /** Specific schools families can research and contact */
    examples: SchoolExample[];
  };

  childcare: {
    status: DataStatus;
    /** Overall summary of childcare landscape */
    summary: string;
    /** Notes on nurseries, daycare centres, crèches */
    daycareNotes: string;
    /** Notes on hiring a private nanny or au pair */
    nannyNotes: string;
    /** Human-readable typical cost range, e.g. "Nanny: $4–$6/hr. Daycare: $150–$300/month." */
    typicalCost: string;
    /** Practical notes on how expat families find childcare (platforms, groups, agencies) */
    howFamiliesFindIt: string;
  };

  healthcare: {
    status: DataStatus;
    summary: string;
  };

  safety: {
    status: DataStatus;
    /** Numeric score out of 100 */
    score: number;
    summary: string;
  };

  cost: {
    status: DataStatus;
    /** Human-readable monthly rent range, e.g. "$900 – $2,000 / month" */
    rentRange: string;
    /** Quick numeric stat (USD/hr) used on cards */
    nannyHourly: number;
  };

  /** Sources organised by topic section for credibility and SEO */
  sources: SectionSources;

  /**
   * Links to community resources (Facebook groups, expat forums, WhatsApp groups).
   * Kept separate from sources to distinguish community knowledge from official data.
   */
  communityLinks?: Source[];
}

// ── Trust / verification layer ────────────────────────────────────────────────

/**
 * Indicates the confidence level of a data section:
 * - "verified"  — sourced from an official government or institutional document
 * - "curated"   — editorially researched from reputable secondary sources
 * - "estimated" — ballpark figures based on community data or cost-of-living indices
 * - "draft"     — placeholder content not yet reviewed; do not surface to end users
 */
export type DataStatus = "verified" | "curated" | "estimated" | "draft";

// ── Sub-types ─────────────────────────────────────────────────────────────────

export interface VisaOption {
  type: string;
  duration?: string;
  description?: string;
}

export interface SchoolExample {
  name: string;
  /** Curriculum type, e.g. "IB", "British", "US / IB" */
  curriculum: string;
  /** Human-readable annual fee range, e.g. "$10,000 – $13,000 / yr" */
  fees?: string;
  url?: string;
}

export interface Source {
  label: string;
  url: string;
}

/**
 * Sources grouped by topic — only official, institutional, or stable public sources.
 * Community links (Facebook groups, forums) belong in Destination.communityLinks.
 */
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
