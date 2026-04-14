/** Keeps meta descriptions within a typical search-snippet length. */
export function clipMetaDescription(text: string, max = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}
