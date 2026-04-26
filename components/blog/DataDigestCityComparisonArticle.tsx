import Link from "next/link";
import type { ReactNode } from "react";
import type { Destination } from "@/lib/types";
import { resolveCityHeroImage } from "@/lib/constants";
import { midpointMonthlyFamilyAllIn } from "@/lib/blog/parseBudget";
import { BlogFaqSection, type BlogFaqItem } from "@/components/blog/BlogFaqSection";

function monthWeather(dest: Destination, monthNum: number) {
  const m = dest.weather?.months.find((x) => x.month === monthNum);
  if (!m) return null;
  return { highC: m.highC, lowC: m.lowC, rainMm: m.rainMm, rainDays: m.rainDays };
}

function FeeBands({ a, b }: { a: Destination; b: Destination }) {
  const rowsA = a.schools.options?.map((o) => o.fees).filter(Boolean) ?? [];
  const rowsB = b.schools.options?.map((o) => o.fees).filter(Boolean) ?? [];
  return (
    <p className="text-sm text-slate-600">
      <span className="font-semibold text-slate-800">{a.city}:</span>{" "}
      {rowsA.length > 0 ? rowsA.join(" · ") : "—"}
      <br />
      <span className="font-semibold text-slate-800">{b.city}:</span>{" "}
      {rowsB.length > 0 ? rowsB.join(" · ") : "—"}
    </p>
  );
}

function BarCompare({
  left,
  right,
  leftLabel,
  rightLabel,
  unit,
}: {
  left: number;
  right: number;
  leftLabel: string;
  rightLabel: string;
  unit: string;
}) {
  const max = Math.max(left, right, 1);
  const lw = Math.round((left / max) * 100);
  const rw = Math.round((right / max) * 100);
  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-slate-800">All-in family budget (midpoint of our range)</h3>
      <p className="text-xs text-slate-500">
        We take the mid-point of each city&apos;s &quot;monthly family all-in&quot; band from the cost cards.
        Ranges in the table above are the source of truth.
      </p>
      <div className="space-y-2">
        <div>
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
            <span>{leftLabel}</span>
            <span>
              ~${left.toLocaleString("en-US")}
              {unit}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-[#E84A4F]/90" style={{ width: `${lw}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
            <span>{rightLabel}</span>
            <span>
              ~${right.toLocaleString("en-US")}
              {unit}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-rose-200" style={{ width: `${rw}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export type DataDigestCityComparisonArticleProps = {
  a: Destination;
  b: Destination;
  dataAsOf: string;
  /** Same as registry `listTitle` — H1 */
  headline: string;
  intro: ReactNode;
  /** Optional paragraph under the main table (rent context) */
  rentNote: ReactNode | null;
  /** One line after school fee card — typical nursery from guides */
  childcareLine: string;
  /** One short line after climate table */
  climateNote: string;
  visaBlock: ReactNode;
  related: readonly { href: string; label: string }[];
  faq: BlogFaqItem[];
};

export function DataDigestCityComparisonArticle({
  a,
  b,
  dataAsOf,
  headline,
  intro,
  rentNote,
  childcareLine,
  climateNote,
  visaBlock,
  related,
  faq,
}: DataDigestCityComparisonArticleProps) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  const aImg = resolveCityHeroImage(a);
  const bImg = resolveCityHeroImage(b);

  const aJul = monthWeather(a, 7);
  const bJul = monthWeather(b, 7);
  const aJan = monthWeather(a, 1);
  const bJan = monthWeather(b, 1);

  const aMid = midpointMonthlyFamilyAllIn(a.cost.monthlyFamilyAllIn);
  const bMid = midpointMonthlyFamilyAllIn(b.cost.monthlyFamilyAllIn);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-2 gap-3 md:mb-10 md:gap-4">
        <div className="relative h-32 overflow-hidden rounded-2xl border border-stone-200 shadow-sm sm:h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={aImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-bold text-white">{a.city}</p>
            <Link href={aPath} className="text-xs font-medium text-white/90 hover:underline">
              Open guide
            </Link>
          </div>
        </div>
        <div className="relative h-32 overflow-hidden rounded-2xl border border-stone-200 shadow-sm sm:h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-bold text-white">{b.city}</p>
            <Link href={bPath} className="text-xs font-medium text-white/90 hover:underline">
              Open guide
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Data digest</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{headline}</h1>
      <p className="mt-3 text-sm text-slate-500">Figures on this page are taken from our city guides, last reviewed {dataAsOf}.</p>

      <div className="mt-6 text-base leading-relaxed text-slate-700">{intro}</div>

      <h2 className="mt-10 text-xl font-bold text-slate-900">At a glance</h2>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-slate-700">
        These rows mirror the &quot;family budget at a glance&quot; cards and related sections. Dollar figures are
        the estimates already shown in each guide’s cost and schools blocks.
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[320px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-3 font-bold text-slate-800">Topic</th>
              <th className="px-4 py-3 font-bold text-slate-800">{a.city}</th>
              <th className="px-4 py-3 font-bold text-slate-800">{b.city}</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Monthly family all-in (guide range)</td>
              <td className="px-4 py-3">{a.cost.monthlyFamilyAllIn}</td>
              <td className="px-4 py-3">{b.cost.monthlyFamilyAllIn}</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">3-bed rent anchor (single-line card)</td>
              <td className="px-4 py-3">{a.cost.rentRange}</td>
              <td className="px-4 py-3">{b.cost.rentRange}</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Safety score (our scale)</td>
              <td className="px-4 py-3">{a.safety.score}/100</td>
              <td className="px-4 py-3">{b.safety.score}/100</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Dinner for two (mid-range, benchmark)</td>
              <td className="px-4 py-3">{a.cost.familyDinner}</td>
              <td className="px-4 py-3">{b.cost.familyDinner}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Nanny (hourly, benchmark)</td>
              <td className="px-4 py-3">{a.cost.nannyRate}</td>
              <td className="px-4 py-3">{b.cost.nannyRate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {aMid != null && bMid != null ? (
        <div className="mt-6">
          <BarCompare
            left={aMid}
            right={bMid}
            leftLabel={a.city}
            rightLabel={b.city}
            unit="/ month (midpoint)"
          />
        </div>
      ) : null}

      {rentNote ? <div className="mt-4 text-sm leading-relaxed text-slate-600">{rentNote}</div> : null}

      <h2 className="mt-10 text-xl font-bold text-slate-900">Schools and childcare</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        <strong>Fee bands for school types</strong> in each guide (we group by curriculum, not by school
        name) — a directional comparison of typical tuition ranges.
      </p>
      <div className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed shadow-sm md:p-5">
        <p className="font-semibold text-slate-800">International / private school fee bands</p>
        <FeeBands a={a} b={b} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{childcareLine}</p>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Climate (NASA POWER normals in each guide)</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Both guides use the same methodology (long-term grid-cell normals; see each city’s weather card for
        caveats). Below are <strong>July and January</strong> highs/lows and rainfall.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[300px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-3 font-bold text-slate-800">Window</th>
              <th className="px-4 py-3 font-bold text-slate-800">{a.city}</th>
              <th className="px-4 py-3 font-bold text-slate-800">{b.city}</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">July (typical high / low, rain)</td>
              <td className="px-4 py-3">
                {aJul ? (
                  <>
                    {aJul.highC}°C / {aJul.lowC}°C · {aJul.rainMm} mm ({aJul.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {bJul ? (
                  <>
                    {bJul.highC}°C / {bJul.lowC}°C · {bJul.rainMm} mm ({bJul.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">January (typical high / low, rain)</td>
              <td className="px-4 py-3">
                {aJan ? (
                  <>
                    {aJan.highC}°C / {aJan.lowC}°C · {aJan.rainMm} mm ({aJan.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {bJan ? (
                  <>
                    {bJan.highC}°C / {bJan.lowC}°C · {bJan.rainMm} mm ({bJan.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{climateNote}</p>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Remote work visas (headline thresholds)</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Income lines below match the visa blocks in each guide. For dependencies, family add-ons, and current
        processing times, use the consulate and official links from those sections.
      </p>
      {visaBlock}

      <h2 className="mt-10 text-xl font-bold text-slate-900">Family fit in our guides</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Strengths and trade-offs as written on each city page.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">{a.city}</h3>
          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {a.familyFit.bestFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Trade-offs (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {a.familyFit.watchOutFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">{b.city}</h3>
          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {b.familyFit.bestFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Trade-offs (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {b.familyFit.watchOutFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <BlogFaqSection title="Common questions" items={faq} />

      <section className="mt-12 border-t border-stone-200 pt-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-lg font-bold text-slate-900">
          You might also like
        </h2>
        <p className="mt-2 text-sm text-slate-600">Other family relocation guides and hubs on the same site.</p>
        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {related.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-[#E84A4F] shadow-sm transition hover:border-[#E84A4F]/40"
              >
                {item.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
