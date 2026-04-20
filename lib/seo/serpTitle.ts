/**
 * SERP `<title>` length guard — word-boundary trim on the **core** before a fixed suffix
 * (e.g. ` | FamiRelo`) so the brand is never truncated.
 */
export function fitSerpTitle(core: string, suffix: string, max = 70): string {
  const c = core.trim().replace(/\s+/g, " ");
  const s = suffix;
  if (c.length + s.length <= max) return `${c}${s}`;
  const budget = max - s.length;
  if (budget < 12) return `${c.slice(0, max)}`;
  const slice = c.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 6 ? slice.slice(0, lastSpace) : slice).trimEnd();
  return `${trimmed}${s}`;
}
