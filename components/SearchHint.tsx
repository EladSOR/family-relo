import { Search } from "lucide-react";

/**
 * Universal search guidance component.
 *
 * Used anywhere we cannot guarantee a stable external URL — schools, visa,
 * community, childcare providers, etc.
 *
 * Renders:
 *   Search: "[query]"   [Search on Google →]
 *
 * The button always works because it generates a Google search URL at render
 * time — it is never a stored external link that can go stale.
 */
export function SearchHint({ query }: { query: string }) {
  const href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  return (
    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="min-w-0 break-words text-xs text-slate-400">
        Search: &ldquo;{query}&rdquo;
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
      >
        <Search size={10} />
        Search on Google
      </a>
    </div>
  );
}
