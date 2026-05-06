import Link from "next/link";
import type { ComponentType } from "react";
import type { Destination } from "@/lib/types";
import { VisaBlockGenericPair, VisaBlockSpainDnvOnly } from "@/components/blog/comparisonVisaBlocks";
import { GenericPairComparisonArticle } from "@/components/blog/GenericPairComparisonArticle";
import { getGenericPairFaqItems } from "@/lib/blog/cityPairFaqs";

const SPAIN_VISA_TITLE = "Remote work visas (headline thresholds)";
const SPAIN_VISA_INTRO = (
  <p className="mt-2 text-base leading-relaxed text-slate-700">
    Income lines below mirror the visa blocks in each Spanish guide. For dependents or payroll timelines, follow
    the consulate wording and official search hints linked there—not this table.
  </p>
);

const MIXED_VISA_TITLE = "Visas and work permits";
const MIXED_VISA_INTRO = (
  <p className="mt-2 text-base leading-relaxed text-slate-700">
    We deep-link both visa panels. Threshold totals, quotas, employer sponsorship, or tax filings still belong
    to official portals and qualified advisers—the digest echoes only what sits in those guide sections today.
  </p>
);

function hubsAndExtras(a: Destination, b: Destination, extras: readonly { href: string; label: string }[]) {
  const core = [
    { href: `/${a.countrySlug}/${a.citySlug}`, label: `${a.city} family guide` },
    { href: `/${b.countrySlug}/${b.citySlug}`, label: `${b.city} family guide` },
  ] as const;
  const hubs =
    a.countrySlug === b.countrySlug
      ? ([{ href: `/${a.countrySlug}`, label: `${a.country} — country hub` }] as const)
      : ([
          { href: `/${a.countrySlug}`, label: `${a.country} — hub` },
          { href: `/${b.countrySlug}`, label: `${b.country} — hub` },
        ] as const);
  return [...core, ...hubs, ...extras, { href: "/destinations", label: "Browse all destinations" }] as const;
}

type Props = { a: Destination; b: Destination };

export function DubaiVsAbuDhabiArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Dubai vs Abu Dhabi: rent, schools & UAE costs"
      intro={
        <p>
          <strong>UAE family hubs side by side</strong> — the same benchmark fields we publish for{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>
          , so you see rent anchors, monthly all-in bands, school fee categories, childcare USD lines, safety
          scores, and jet-lag-proof weather rows before you reopen each checklist for tenancy registration and
          school inspections.
        </p>
      }
      climateNote={`${a.city} stays extremely hot through summer nights; ${b.city} is still desert-warm yet often feels calmer residentially in this climatology. Use each guide's full weather grids for humidity and rainy-day planning.`}
      rentNeighborhoodNote={`International-school catchments in both cities can pull families toward gated compounds or shoreline towers—anchors stay mid-market until you map school runs.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function BangkokVsChiangMaiArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Bangkok vs Chiang Mai: rent, schools & Thai costs"
      intro={
        <p>
          <strong>Metro Thailand vs northern pace</strong> — stack our published numbers for{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          (rent anchors, bilingual school fee bands, all-in budgets, nanny benchmarks, July vs January rain, and the
          safety scores we track) before you revisit visa routes and TM30-address rules on each detailed guide.
        </p>
      }
      climateNote={`${a.city} brings heavier monsoon peaks and tighter humidity in this grid; ${b.city} cools modestly upland yet still spikes in smoky-season months—follow each guide's local hazard bullets.`}
      rentNeighborhoodNote={`Bangkok commuters often chase BTS corridors; Chiang Mai spreads across nimman & hang dong style districts—browse housing sections for gated moo bans vs downtown condos.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function SydneyVsMelbourneArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Sydney vs Melbourne: rent, schools & Aussie costs"
      intro={
        <p>
          <strong>Australia&apos;s flagship metros for families</strong> — identical scorecard layout for{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>
          : rent anchors beside private school tuition bands, all-in budgets, nanny hourly norms, sunshine vs cooler
          January highs, plus the subjective family-fit bullets from each relocation guide linked above.
        </p>
      }
      climateNote={`${a.city} tilts hotter and brighter in midsummer normals; ${b.city} swings cooler mid-year with more layering days—compare rain rows before booking school uniforms.`}
      rentNeighborhoodNote={`Premium school belts (North Shore versus inner east comparisons) exaggerate rents beyond the anchors—study each housing map.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function AucklandVsWellingtonArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Auckland vs Wellington: rent, schools & NZ costs"
      intro={
        <p>
          Compare{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          strictly through the benchmarks we expose on each NZ guide—monthly all-in envelopes, headline rent cards,
          international school brackets, nanny rates, civic safety summaries, plus July vs January weather windows for
          after-school logistics.
        </p>
      }
      climateNote={`${a.city} averages warmer year-round normals; ${b.city} blows windier across the harbour setup in this NASA grid—dress kids for layering when comparing school commutes.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function TorontoVsVancouverArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Toronto vs Vancouver: rent, schools & Canada costs"
      intro={
        <p>
          Ontario’s Lake corridor versus British Columbia’s harbour-and-mountain pace—stack our published numbers for{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          against{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          on rent anchors, bilingual school narratives, nanny hourly bands, snowfall vs rain-heavy January rows,
          safety scores, and the action checklists awaiting you province by province inside each relocation guide.
        </p>
      }
      climateNote={`${b.city}'s normals emphasise drizzle-heavy winters; ${a.city}'s inland grid shows sharper freezes—consult each safety section on winter driving drills with kids.`}
      rentNeighborhoodNote={`Detached school zones versus downtown condos distort both anchors differently—prioritise neighbourhoods in the guides before locking tuition deposits.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function BarcelonaVsMalagaArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Barcelona vs Malaga: rent, schools & coast life"
      intro={
        <p>
          Two Mediterranean metros at different scales—benchmark{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          next to{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          via our rent cards, Catalan versus southern school-language context in the summaries, monthly spend bands,
          childcare benchmarks, sunshine-heavy July normals, colder January lows inland vs seaside, plus the curated
          family-fit lists mirrored here for quick judgement.
        </p>
      }
      climateNote={`${a.city}'s seaboard moderates midsummer extremes compared with ${b.city}'s hotter Costa del Sol plateau readings in this climatology; still inspect smoke haze bullets if fire season overlaps your move.`}
      rentNeighborhoodNote={`Families often funnel toward Sarrià or Sant Cugat in ${a.city}; ${b.city} tracks Torremolinos or Benalmádena commuter belts above raw anchors.`}
      visaSectionTitle={SPAIN_VISA_TITLE}
      visaSectionIntro={SPAIN_VISA_INTRO}
      visaBlock={<VisaBlockSpainDnvOnly a={a} b={b} />}
      related={hubsAndExtras(a, b, [{ href: "/blog/barcelona-vs-madrid", label: "Barcelona vs Madrid (digest)" }])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function ValenciaVsAlicanteArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Valencia vs Alicante: rent, schools & family costs"
      intro={
        <p>
          Two compact Spanish coast bases—benchmark{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          beside{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          using the precise budget lines, bilingual school-category fees, nanny anchors, civic safety summaries, and
          seasonal rain graphs we already maintain—ideal when you crave lower intensity than Madrid or Barcelona yet
          still want EU-adjacent international schooling.
        </p>
      }
      climateNote={`Both lean dry-summer Mediterranean; ${a.city}'s orchard grid can feel greener while ${b.city} trends hotter midsummer according to NASA normals—peek at humidity notes for toddlers.`}
      rentNeighborhoodNote={`Beach-town premiums around Albufereta or Playa San Juan creep above anchors; Valencia’s Turia-adjacent barrios behave similarly.`}
      visaSectionTitle={SPAIN_VISA_TITLE}
      visaSectionIntro={SPAIN_VISA_INTRO}
      visaBlock={<VisaBlockSpainDnvOnly a={a} b={b} />}
      related={hubsAndExtras(a, b, [
        { href: "/blog/valencia-vs-lisbon", label: "Valencia vs Lisbon (digest)" },
        { href: "/blog/barcelona-vs-madrid", label: "Barcelona vs Madrid (digest)" },
      ])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function BerlinVsMunichArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Berlin vs Munich: rent, schools & Germany costs"
      intro={
        <p>
          <strong>Capital creatives versus Bavaria’s corporate corridors</strong> — line up{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          vs{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          strictly with the numbers we expose (rent anchors, daycare USD cues, nanny rates, multilingual school fee
          ranges, snowfall vs stormier plains weather, municipal safety summaries) prior to unpacking registration
          offices and bilingual Kita waitlists documented on each standalone guide page.
        </p>
      }
      climateNote={`${b.city}'s proximity to Alps-driven weather shows cooler midsummer dips than ${a.city}'s wider heat spikes in July normals; winters differ on snow-days—consult each school's outdoor policy bullets.`}
      rentNeighborhoodNote={`Prenzlauer Berg and Schwabing premiums diverge massively from borough averages—anchors stay intentionally conservative.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [{ href: "/blog/lisbon-vs-porto", label: "Lisbon vs Porto (digest)" }])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function AmsterdamVsZurichArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Amsterdam vs Zurich: rent, schools & family costs"
      intro={
        <p>
          High-trust relocating corridors in the Rhine arc—{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          render through the identical digest fields (monthly envelopes, nanny hourly norms, multilingual school dues,
          safety scores, summer vs midwinter normals) without pretending tax equalisation schemes or canton quirks are
          identical—everything nuanced stays on the paired city outlines above.
        </p>
      }
      climateNote={`${b.city}'s alpine-influenced grid trends wetter midsummer afternoons; ${a.city}'s canals amplify breezy-but-damp winters according to normals—budget mud-season gear.`}
      rentNeighborhoodNote={`International school waitlists ripple through Amstelveen hubs and Zugersee-side cantons alike—anchors ignore those premiums until you enrol.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [{ href: "/blog/berlin-vs-munich", label: "Berlin vs Munich (digest)" }])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export function PragueVsBudapestArticle({ a, b }: Props) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  return (
    <GenericPairComparisonArticle
      a={a}
      b={b}
      headline="Prague vs Budapest: rent, schools & Central Europe costs"
      intro={
        <p>
          Danube-vs-Vltava family economics distilled: juxtapose{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {a.city}
          </Link>{" "}
          vs{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {b.city}
          </Link>{" "}
          strictly from our bilingual school-category fees, published rent anchors, all-in parental budgets,
          nanny-hour benchmarks, thermal-summer extremes in July, foggy winter January rows, and the honest watch-outs
          we keep in each metropolitan guide before you redo visa paperwork comparisons for real.
        </p>
      }
      climateNote={`${a.city}'s continental swings show sharper winter chill than ${b.city}'s marginally moderated Danube normals in January—snow-day backup care varies accordingly.`}
      visaSectionTitle={MIXED_VISA_TITLE}
      visaSectionIntro={MIXED_VISA_INTRO}
      visaBlock={<VisaBlockGenericPair a={a} b={b} />}
      related={hubsAndExtras(a, b, [{ href: "/blog/lisbon-vs-porto", label: "Lisbon vs Porto (digest)" }])}
      faq={getGenericPairFaqItems(a, b)}
    />
  );
}

export const PAIR_DIGEST_BY_SLUG = {
  "dubai-vs-abu-dhabi": DubaiVsAbuDhabiArticle,
  "bangkok-vs-chiang-mai": BangkokVsChiangMaiArticle,
  "sydney-vs-melbourne": SydneyVsMelbourneArticle,
  "auckland-vs-wellington": AucklandVsWellingtonArticle,
  "toronto-vs-vancouver": TorontoVsVancouverArticle,
  "barcelona-vs-malaga": BarcelonaVsMalagaArticle,
  "valencia-vs-alicante": ValenciaVsAlicanteArticle,
  "berlin-vs-munich": BerlinVsMunichArticle,
  "amsterdam-vs-zurich": AmsterdamVsZurichArticle,
  "prague-vs-budapest": PragueVsBudapestArticle,
} as const satisfies Record<string, ComponentType<{ a: Destination; b: Destination }>>;

export type PairDigestSlug = keyof typeof PAIR_DIGEST_BY_SLUG;
