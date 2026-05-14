import Link from "next/link";
import { Scale, ArrowRight, Check } from "lucide-react";

/**
 * Generic compare-feature promo for the blog.
 *
 * Use on:
 *   - /blog index page (visible to everyone browsing posts)
 *   - Any future NON-comparison blog post (advice, single-city deep dive,
 *     "best of" lists, etc.) where you still want comparison visibility
 *     but can't pre-select a specific city pair.
 *
 * For city-pair comparison posts, prefer `BlogCompareCallout` instead — it
 * pre-selects both compared cities in the build flow. That callout fires
 * automatically inside `DataDigestCityComparisonArticle`, so comparison
 * posts using the shared template don't need to add anything.
 */
export default function BlogComparePromo() {
  return (
    <aside
      aria-label="Personalized city comparison tool"
      className="my-10 overflow-hidden rounded-2xl border border-[#FF5A5F]/25 bg-gradient-to-br from-[#FF5A5F]/5 via-orange-50/30 to-stone-50 shadow-sm"
    >
      <div className="h-1 bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />
      <div className="grid items-center gap-5 p-5 md:grid-cols-[1fr,auto] md:gap-7 md:p-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#FF5A5F]/20 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
            <Scale size={11} strokeWidth={2.5} />
            Personalized comparison
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 md:text-xl">
            Compare any 3 cities — weighted to your family
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 md:text-sm">
            Match scores, budget fit, schools, visa paths and lifestyle —
            scored against your family&apos;s actual priorities. Pay once,
            yours forever.
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium text-slate-600 md:max-w-md md:text-xs">
            {[
              "Match score per city",
              "Budget fit analysis",
              "Visa & schools detail",
              "Shareable + downloadable",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check size={11} className="shrink-0 text-[#FF5A5F]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-stretch gap-1.5 md:items-end">
          <Link
            href="/compare"
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] hover:shadow"
          >
            Try it now
            <ArrowRight
              size={13}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <p className="text-center text-[10px] font-medium text-slate-400 md:text-right">
            From $9 · pay once · free preview
          </p>
        </div>
      </div>
    </aside>
  );
}
