/**
 * Keeps meta descriptions within `max` characters (including a trailing ellipsis when trimmed).
 * Truncates at the last **word boundary** before the limit so words are not cut in half.
 */
export function clipMetaDescription(text: string, max = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const ellipsis = "…";
  const budget = max - ellipsis.length;
  const slice = t.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");
  const core = lastSpace > 8 ? slice.slice(0, lastSpace) : slice;
  return `${core.trimEnd()}${ellipsis}`;
}
