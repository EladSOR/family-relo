import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Destination } from "@/lib/types";

/**
 * Inline "personalize this comparison" callout for blog comparison posts.
 *
 * The static blog article is one editor's take with shared data; the paid
 * product turns the same dimensions into a personalized score against the
 * reader's family budget, schools needs, and visa situation.
 *
 * Lives inline in the article body (not a sticky/popup) so it reads as a
 * natural next step rather than an ad. Pre-selects both compared cities.
 */
export default function BlogCompareCallout({
  a,
  b,
}: {
  a: Destination;
  b: Destination;
}) {
  const cityIds = `${encodeURIComponent(a.id)},${encodeURIComponent(b.id)}`;
  const buildHref = `/compare/build?cities=${cityIds}`;
  return (
    <aside
      className="my-10 rounded-2xl border border-[#FF5A5F]/25 bg-gradient-to-br from-[#FF5A5F]/5 to-orange-50/40 p-5 md:p-6"
      aria-label={`Build a personalized ${a.city} vs ${b.city} comparison`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
            <Sparkles size={16} className="text-[#FF5A5F]" />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-tight text-slate-900 md:text-base">
              Want this weighted to <span className="text-[#FF5A5F]">your</span> family?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">
              This article uses one editor&apos;s lens. Build a personalized{" "}
              {a.city} vs {b.city} report scored against your budget, schools,
              visas, and priorities — yours forever, shareable.
            </p>
          </div>
        </div>

        <Link
          href={buildHref}
          className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] hover:shadow"
        >
          Build my comparison
          <ArrowRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
      <p className="mt-3 flex flex-wrap items-baseline justify-center gap-1 text-[11px] font-medium text-slate-400 md:justify-end">
        <span>Launch price · from</span>
        <span className="text-xs font-extrabold text-slate-700">$9</span>
        <span className="font-bold text-slate-300 line-through">$18</span>
        <span>· pay once · free preview first</span>
      </p>
    </aside>
  );
}
