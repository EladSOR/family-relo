/**
 * Helpers for parsing and formatting the `cost.monthlyFamilyAllIn` strings
 * stored in `data/cities.json`.
 *
 * Source format examples (must match what city pages display):
 *   "~$3,500–$4,500 / month"
 *   "~$11,000–$16,000+ / month"
 *   "~$2,000–$3,500 / month"
 *
 * Used by `components/home/WorldMap.tsx` to draw compact price pins
 * (midpoint label, e.g. `$4k`) and a popup with the full range.
 */

export interface ParsedCost {
  /** Lower bound USD (e.g. 3500) */
  min: number;
  /** Upper bound USD (e.g. 4500); equal to `min` when only one number is found */
  max: number;
  /** Midpoint USD, used for the compact pin label */
  mid: number;
}

/**
 * Pull the first 1–2 USD numbers out of a `monthlyFamilyAllIn` string.
 * Returns `null` if no number can be parsed (so callers can skip rendering).
 */
export function parseMonthlyCost(input: string): ParsedCost | null {
  if (!input) return null;
  // Match groups of digits + commas (1,000 / 11,000 / 3500 etc.) prefixed by $
  const matches = input.match(/\$\s?([\d,]+)/g);
  if (!matches || matches.length === 0) return null;

  const numbers = matches
    .map((m) => Number(m.replace(/[^0-9]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (numbers.length === 0) return null;

  const min = numbers[0];
  const max = numbers[1] ?? numbers[0];
  const mid = Math.round((min + max) / 2);
  return { min, max, mid };
}

/**
 * Compact USD label for a map pin, e.g.
 *   2500   → "$2.5k"
 *   4000   → "$4k"
 *   13500  → "$13.5k"
 *   850    → "$850"
 *
 * Uses one decimal only when needed (avoids "$4.0k").
 */
export function formatCostShort(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "";
  if (amount < 1000) return `$${Math.round(amount)}`;
  const k = amount / 1000;
  // 1 decimal if not a whole number, else integer (e.g. 4 → "4k", 4.5 → "4.5k")
  const rounded = Math.round(k * 10) / 10;
  const label = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  return `$${label}k`;
}
