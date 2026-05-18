import Link from "next/link";
import { Scale, Plus, ArrowRight, Check } from "lucide-react";

/**
 * Compare-this-city card — placed on every city guide page below the FAQ.
 *
 * Why on city pages: users reading a city guide are already actively
 * researching that city; the most natural next step is "vs other cities."
 * The CTA deep-links into /compare/build with the current city pre-selected
 * so the user lands in the flow with 1 of 3 chips already filled.
 */
export default function CompareCityCTA({
  cityId,
  cityName,
}: {
  cityId: string;
  cityName: string;
}) {
  const buildHref = `/compare/build?cities=${encodeURIComponent(cityId)}`;
  // Deep-link into the single-city flow with this city already chosen. Users
  // who are reading one city guide and only considering THAT city are the
  // natural audience for the $7 report — the "compare" framing doesn't fit.
  const singleCityHref = `/single-city/build?city=${encodeURIComponent(cityId)}`;
  return (
    <section
      aria-label={`Compare ${cityName} with other cities`}
      className="my-10 overflow-hidden rounded-3xl border border-[#FF5A5F]/20 bg-gradient-to-br from-[#FF5A5F]/5 via-orange-50/40 to-stone-50 p-7 shadow-sm md:p-10"
    >
      <div className="grid items-center gap-7 md:grid-cols-[1fr,auto]">
        {/* Left: copy */}
        <div>
          {/* Eyebrow */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF5A5F]/20 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
            <Scale size={11} strokeWidth={2.5} />
            Personalized comparison
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Considering {cityName} alongside other cities?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            Build a side-by-side report weighted to your family — budget fit,
            schools, visa paths, safety and lifestyle scored against your
            actual priorities.
          </p>

          {/* Mini value props */}
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-medium text-slate-600 md:max-w-md md:text-sm">
            {[
              "Match score per city",
              "Budget fit for your family",
              "Schools & visa paths",
              "Shareable + downloadable",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check size={12} className="shrink-0 text-[#FF5A5F]" />
                {item}
              </li>
            ))}
          </ul>

          {/* Pre-selected chip preview */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5A5F]/30 bg-white px-3 py-1 font-semibold text-[#FF5A5F]">
              <Check size={11} strokeWidth={3} />
              {cityName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white/50 px-3 py-1 text-slate-400">
              <Plus size={11} />
              Add 1 or 2 more
            </span>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <Link
            href={buildHref}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-[#FF5A5F] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f] hover:shadow-lg md:text-base"
          >
            Build my comparison
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <p className="text-center text-[11px] font-medium text-slate-400 md:text-right">
            From $9 · pay once · free preview first
          </p>
        </div>
      </div>

      {/* Secondary single-city CTA — same pattern, one city, $7. Visible to
          readers who are already focused on this one city only. */}
      <div className="mt-7 flex flex-col items-start gap-3 border-t border-[#FF5A5F]/15 pt-5 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-sm leading-snug text-slate-600 md:text-base">
          Only seriously considering <strong>{cityName}</strong>? Get a{" "}
          <Link
            href={singleCityHref}
            className="font-bold text-[#FF5A5F] hover:underline"
          >
            personalised single-city &ldquo;Should we move here?&rdquo; report
          </Link>{" "}
          — verdict, visa paths ranked for you, and a 90-day checklist for $7.
        </p>
        <Link
          href={singleCityHref}
          className="shrink-0 rounded-xl border border-[#FF5A5F]/30 bg-white px-4 py-2 text-xs font-bold text-[#FF5A5F] transition-all hover:bg-[#FF5A5F]/5 md:text-sm"
        >
          Try the $7 report
        </Link>
      </div>
    </section>
  );
}
