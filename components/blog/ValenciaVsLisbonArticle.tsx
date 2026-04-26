import Link from "next/link";
import type { Destination } from "@/lib/types";
import { resolveCityHeroImage } from "@/lib/constants";
import { midpointMonthlyFamilyAllIn, parseRentAnchor } from "@/lib/blog/parseBudget";
import { BlogFaqSection, type BlogFaqItem } from "@/components/blog/BlogFaqSection";

type Props = {
  valencia: Destination;
  lisbon: Destination;
  dataAsOf: string;
};

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
            <div
              className="h-full rounded-full bg-[#E84A4F]/90"
              style={{ width: `${lw}%` }}
            />
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
            <div
              className="h-full rounded-full bg-rose-200"
              style={{ width: `${rw}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const RELATED = [
  { href: "/spain/valencia", label: "Valencia family guide" },
  { href: "/portugal/lisbon", label: "Lisbon family guide" },
  { href: "/spain", label: "Spain — country hub" },
  { href: "/portugal", label: "Portugal — country hub" },
  { href: "/spain/barcelona", label: "Barcelona" },
  { href: "/portugal/porto", label: "Porto" },
  { href: "/spain/malaga", label: "Málaga" },
  { href: "/destinations", label: "Browse all destinations" },
] as const;

export function ValenciaVsLisbonArticle({ valencia, lisbon, dataAsOf }: Props) {
  const vPath = `/${valencia.countrySlug}/${valencia.citySlug}`;
  const lPath = `/${lisbon.countrySlug}/${lisbon.citySlug}`;
  const vImg = resolveCityHeroImage(valencia);
  const lImg = resolveCityHeroImage(lisbon);

  const vJul = monthWeather(valencia, 7);
  const lJul = monthWeather(lisbon, 7);
  const vJan = monthWeather(valencia, 1);
  const lJan = monthWeather(lisbon, 1);

  const vMid = midpointMonthlyFamilyAllIn(valencia.cost.monthlyFamilyAllIn);
  const lMid = midpointMonthlyFamilyAllIn(lisbon.cost.monthlyFamilyAllIn);

  const vRent = parseRentAnchor(valencia.cost.rentRange);
  const lRent = parseRentAnchor(lisbon.cost.rentRange);

  const spainDnvLine =
    valencia.actionChecklist.find((x) => x.targetSection === "visa")?.label ?? "";
  const dnvFloor = spainDnvLine.match(/\$[\d,]+\/month/);
  const d8Text =
    lisbon.visa?.options.find((o) => o.anchor === "visa-d8")?.description ?? "";
  const d8Floor = d8Text.match(/\$[\d,]+\/month/);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-8 grid grid-cols-2 gap-3 md:mb-10 md:gap-4">
        <div className="relative h-32 overflow-hidden rounded-2xl border border-stone-200 shadow-sm sm:h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-bold text-white">{valencia.city}</p>
            <Link href={vPath} className="text-xs font-medium text-white/90 hover:underline">
              Open guide
            </Link>
          </div>
        </div>
        <div className="relative h-32 overflow-hidden rounded-2xl border border-stone-200 shadow-sm sm:h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-sm font-bold text-white">{lisbon.city}</p>
            <Link href={lPath} className="text-xs font-medium text-white/90 hover:underline">
              Open guide
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Data digest</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
        Valencia vs Lisbon: family comparison
      </h1>
      <p className="mt-3 text-sm text-slate-500">Figures on this page are taken from our city guides, last reviewed {dataAsOf}.</p>

      <p className="mt-6 text-base leading-relaxed text-slate-700">
        A <strong>side-by-side</strong> of the family-focused numbers we publish for{" "}
        <Link href={vPath} className="font-semibold text-[#E84A4F] hover:underline">
          {valencia.city}
        </Link>{" "}
        and{" "}
        <Link href={lPath} className="font-semibold text-[#E84A4F] hover:underline">
          {lisbon.city}
        </Link>{" "}
        — rent, all-in costs, school fee bands, safety, and climate — so you can compare two common Iberian
        bases in one pass. Deeper checklists, visa text, and links to official sources sit on each city guide.
      </p>

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
              <th className="px-4 py-3 font-bold text-slate-800">{valencia.city}</th>
              <th className="px-4 py-3 font-bold text-slate-800">{lisbon.city}</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Monthly family all-in (guide range)</td>
              <td className="px-4 py-3">{valencia.cost.monthlyFamilyAllIn}</td>
              <td className="px-4 py-3">{lisbon.cost.monthlyFamilyAllIn}</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">3-bed rent anchor (single-line card)</td>
              <td className="px-4 py-3">{valencia.cost.rentRange}</td>
              <td className="px-4 py-3">{lisbon.cost.rentRange}</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Safety score (our scale)</td>
              <td className="px-4 py-3">{valencia.safety.score}/100</td>
              <td className="px-4 py-3">{lisbon.safety.score}/100</td>
            </tr>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">Dinner for two (mid-range, benchmark)</td>
              <td className="px-4 py-3">{valencia.cost.familyDinner}</td>
              <td className="px-4 py-3">{lisbon.cost.familyDinner}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Nanny (hourly, benchmark)</td>
              <td className="px-4 py-3">{valencia.cost.nannyRate}</td>
              <td className="px-4 py-3">{lisbon.cost.nannyRate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {vMid != null && lMid != null ? (
        <div className="mt-6">
          <BarCompare
            left={vMid}
            right={lMid}
            leftLabel={valencia.city}
            rightLabel={lisbon.city}
            unit="/ month (midpoint)"
          />
        </div>
      ) : null}

      {vRent != null && lRent != null ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          The rent anchor on each city page is a one-line benchmark (roughly a 3-bed family home context in
          the guide’s housing section). In our data, {valencia.city}&apos;s anchor is <strong>lower</strong>{" "}
          (~${vRent.toLocaleString("en-US")} vs ~${lRent.toLocaleString("en-US")} / month) — with the caveat
          that {lisbon.city} families often target the <strong>Cascais–Estoril corridor</strong>, where
          3-beds in the guide run higher than central {lisbon.city} numbers alone would suggest. Read the
          housing blocks on each guide before using rent as a final filter.
        </p>
      ) : null}

      <h2 className="mt-10 text-xl font-bold text-slate-900">Schools and childcare</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        <strong>Fee bands for school types</strong> in each guide (we group by curriculum, not by school
        name) — a directional comparison of typical tuition ranges.
      </p>
      <div className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed shadow-sm md:p-5">
        <p className="font-semibold text-slate-800">International / private school fee bands</p>
        <FeeBands a={valencia} b={lisbon} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Childcare: {valencia.city} private nursery in our data <strong>~$330–$660/month</strong> vs {lisbon.city}{" "}
        <strong>~$550–$990/month</strong> (see childcare sections for full context).
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Climate (NASA POWER normals in each guide)</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Both guides use the same methodology (long-term grid-cell normals; see each city’s weather card for
        caveats). Below are <strong>July and January</strong> highs/lows and rainfall for a quick “feel”
        comparison.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[300px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-4 py-3 font-bold text-slate-800">Window</th>
              <th className="px-4 py-3 font-bold text-slate-800">{valencia.city}</th>
              <th className="px-4 py-3 font-bold text-slate-800">{lisbon.city}</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-stone-100">
              <td className="px-4 py-3 font-medium">July (typical high / low, rain)</td>
              <td className="px-4 py-3">
                {vJul ? (
                  <>
                    {vJul.highC}°C / {vJul.lowC}°C · {vJul.rainMm} mm ({vJul.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {lJul ? (
                  <>
                    {lJul.highC}°C / {lJul.lowC}°C · {lJul.rainMm} mm ({lJul.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">January (typical high / low, rain)</td>
              <td className="px-4 py-3">
                {vJan ? (
                  <>
                    {vJan.highC}°C / {vJan.lowC}°C · {vJan.rainMm} mm ({vJan.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {lJan ? (
                  <>
                    {lJan.highC}°C / {lJan.lowC}°C · {lJan.rainMm} mm ({lJan.rainDays} rain days)
                  </>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {valencia.city} runs hotter in peak summer; {lisbon.city} is milder then but wetter in late autumn
        in this grid. For month-by-month planning, use the weather sections on each city guide.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Remote work visas (headline thresholds)</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Income lines below match the visa blocks in each guide. For dependencies, family add-ons, and current
        processing times, use the consulate and official links from those sections.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-2 text-base leading-relaxed text-slate-700">
        <li>
          <Link href={`${vPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
            {valencia.country} — Digital Nomad route ({valencia.city} guide)
          </Link>
          {dnvFloor
            ? `: our checklist quotes ${dnvFloor[0]} for the main applicant in the line we show — read the full visa section for family add-ons.`
            : ": open the visa section for the current income line we publish."}
        </li>
        <li>
          <Link href={`${lPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
            {lisbon.country} — D8 ({lisbon.city} guide)
          </Link>
          {d8Floor
            ? `: the D8 description in our guide includes a ${d8Floor[0]} reference for remote work in the same wording as the consulate list we link.`
            : ": open the D8 block for the exact threshold text."}
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900">Family fit in our guides</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        Strengths and trade-offs as written on each city page.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">{valencia.city}</h3>
          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {valencia.familyFit.bestFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Trade-offs (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {valencia.familyFit.watchOutFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">{lisbon.city}</h3>
          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {lisbon.familyFit.bestFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Trade-offs (guide)</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-700">
            {lisbon.familyFit.watchOutFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <BlogFaqSection title="Common questions" items={getValenciaLisbonFaqItems(valencia, lisbon)} />

      <section className="mt-12 border-t border-stone-200 pt-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-lg font-bold text-slate-900">
          You might also like
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Other family relocation guides and hubs on the same site.
        </p>
        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {RELATED.map((item) => (
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

/**
 * Single source for on-page FAQ and JSON-LD (answers must be identical; keep plain text for schema).
 */
export function getValenciaLisbonFaqItems(
  valencia: Destination,
  lisbon: Destination,
): BlogFaqItem[] {
  return [
    {
      question: "Which city is usually cheaper in your data?",
      answer: `In the ranges we publish, ${valencia.city} has a lower monthly all-in band and a lower 3-bed rent anchor than ${lisbon.city}. ${lisbon.city} international school fee bands and the Cascais–Estoril housing band can change that — check the school and housing sections for your case.`,
    },
    {
      question: "What do the January and July climate rows represent?",
      answer:
        "They are the same long-term monthly normals (NASA POWER / MERRA-2) as in each city’s weather card: typical highs, lows, and rain for that month, not a forecast for a specific week. Use the full weather blocks on the guides to plan the school year and holidays.",
    },
    {
      question: "Where are the checklists, housing sites, and full visa text?",
      answer: `Use the same ${valencia.city} and ${lisbon.city} city guides linked in the intro and the cards above: each has the action checklists, housing search ideas, and full visa text with official links.`,
    },
    {
      question: "Is this enough to decide a visa or taxes?",
      answer:
        "No. The income lines and tables here are the same summaries as in the guides. Final eligibility, tax (including NHR and similar), and your specific situation need official sources and a qualified adviser.",
    },
  ];
}

/** Same Q&A as on the page, for `FAQPage` JSON-LD. */
export function getValenciaLisbonFaqForSchema(
  valencia: Destination,
  lisbon: Destination,
): { question: string; answer: string }[] {
  return getValenciaLisbonFaqItems(valencia, lisbon).map((f) => ({
    question: f.question,
    answer: String(f.answer),
  }));
}
