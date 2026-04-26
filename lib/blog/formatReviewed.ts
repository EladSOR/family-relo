const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** `2026-01` → "January 2026" — for blog copy when several guides contribute. */
export function formatLastReviewedLabel(...isoYearMonth: string[]) {
  const sorted = [...isoYearMonth].sort();
  const last = sorted[sorted.length - 1] ?? "";
  const [y, m] = last.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || !Number.isFinite(mi) || mi < 0 || mi > 11) return last;
  return `${MONTHS[mi]} ${y}`;
}
