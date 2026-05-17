/**
 * Pure helpers for the freshness dashboard — no Next/React imports so they
 * can be unit-tested in isolation.
 */

export type Severity = "critical" | "high" | "normal" | "fresh";

export interface FreshnessRow {
  id: string;
  city: string;
  country: string;
  lastReviewed: string;       // YYYY-MM
  daysSinceReview: number;
  severity: Severity;
  brokenLinkCount: number;    // populated by joining link-health-report
}

/** Days between YYYY-MM (taken as the 1st of that month) and now (UTC). */
export function daysSinceYearMonth(yearMonth: string, now: Date = new Date()): number {
  const [y, m] = yearMonth.split("-").map(Number);
  if (!y || !m) return Number.POSITIVE_INFINITY;
  const then = Date.UTC(y, m - 1, 1);
  const diff = now.getTime() - then;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function severityFor(days: number): Severity {
  if (days > 365) return "critical";
  if (days > 180) return "high";
  if (days > 90)  return "normal";
  return "fresh";
}

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 3, high: 2, normal: 1, fresh: 0,
};

export function sortByUrgency(rows: FreshnessRow[]): FreshnessRow[] {
  return [...rows].sort((a, b) => {
    const s = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (s !== 0) return s;
    return b.daysSinceReview - a.daysSinceReview;
  });
}
