import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current (last) page — renders as plain text, not a link. */
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

/**
 * Thin breadcrumb bar used across city, country, and destinations pages.
 * The last item should have no `href` — it represents the current page.
 */
export default function Breadcrumb({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-stone-200 bg-white/70 backdrop-blur-sm"
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-1.5 px-6 py-3 text-xs text-slate-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight size={11} className="shrink-0 text-slate-300" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="font-medium transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
