/**
 * Hard cap for `<meta name="description">` site-wide.
 * **Prefer hand-written copy** that already fits. This helper trims only when a string overshoots and
 * **never** adds a mid-sentence `…` ellipsis.
 * @see `.cursor/rules/serp-metadata.mdc`
 */
export const META_DESCRIPTION_MAX = 165;

/**
 * Returns `text` if it fits in `max`. Otherwise returns the longest prefix that still ends a complete
 * sentence (`.`, `?`, `!` at a word/sentence boundary). If none, trims at the last space and ends with `.`
 * when needed. Never appends `…`.
 */
export function clipMetaDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;

  const head = t.slice(0, max);
  for (let end = head.length; end >= 28; end--) {
    const c = head[end - 1];
    if (c === "?" || c === "!") {
      return head.slice(0, end).trimEnd();
    }
    if (c === ".") {
      const next = head[end];
      if (next === undefined || next === " " || next === "\n") {
        return head.slice(0, end).trimEnd();
      }
    }
  }

  const sp = head.lastIndexOf(" ");
  if (sp > 40) {
    const frag = head.slice(0, sp).trimEnd();
    return /[.?!]$/.test(frag) ? frag : `${frag}.`;
  }

  const wordTrim = head.replace(/\s+\S*$/, "").trimEnd();
  return /[.?!]$/.test(wordTrim) ? wordTrim : `${wordTrim}.`;
}
