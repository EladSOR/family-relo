/**
 * Midpoint of "monthlyFamilyAllIn" style strings, e.g. `$3,500–$4,500 / month`.
 * Used for simple relative bar charts in blog digests.
 */
export function midpointMonthlyFamilyAllIn(raw: string): number | null {
  const m = raw.match(/\$?([\d,]+)\s*[–-]\s*\$?([\d,]+)/);
  if (!m) return null;
  const a = parseInt(m[1].replace(/,/g, ""), 10);
  const b = parseInt(m[2].replace(/,/g, ""), 10);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.round((a + b) / 2);
}

/** Single-number rent anchor like "~$1,400 / month" */
export function parseRentAnchor(raw: string): number | null {
  const m = raw.match(/~?\$?([\d,]+)/);
  if (!m) return null;
  return parseInt(m[1].replace(/,/g, ""), 10);
}
