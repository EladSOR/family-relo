import Link from "next/link";
import type { Destination } from "@/lib/types";
import { DataDigestCityComparisonArticle } from "./DataDigestCityComparisonArticle";
import {
  VisaBlockPortugalD8Only,
  VisaBlockSpainDnvAndPortugalD8,
  VisaBlockSpainDnvOnly,
} from "./comparisonVisaBlocks";
import { extractTypicalPrivateNurseryMonthlyBand } from "@/lib/blog/daycareBands";
import { parseRentAnchor } from "@/lib/blog/parseBudget";
import {
  getBarcelonaMadridFaqItems,
  getLisbonPortoFaqItems,
  getValenciaLisbonFaqItems,
} from "@/lib/blog/cityPairFaqs";

const VALENCIA_LISBON_RELATED = [
  { href: "/spain/valencia", label: "Valencia family guide" },
  { href: "/portugal/lisbon", label: "Lisbon family guide" },
  { href: "/spain", label: "Spain — country hub" },
  { href: "/portugal", label: "Portugal — country hub" },
  { href: "/spain/barcelona", label: "Barcelona" },
  { href: "/portugal/porto", label: "Porto" },
  { href: "/spain/malaga", label: "Málaga" },
  { href: "/destinations", label: "Browse all destinations" },
] as const;

const LISBON_PORTO_RELATED = [
  { href: "/portugal/lisbon", label: "Lisbon family guide" },
  { href: "/portugal/porto", label: "Porto family guide" },
  { href: "/portugal", label: "Portugal — country hub" },
  { href: "/portugal/cascais", label: "Cascais" },
  { href: "/blog/valencia-vs-lisbon", label: "Valencia vs Lisbon (digest)" },
  { href: "/spain/valencia", label: "Valencia" },
  { href: "/destinations", label: "Browse all destinations" },
] as const;

const BARCELONA_MADRID_RELATED = [
  { href: "/spain/barcelona", label: "Barcelona family guide" },
  { href: "/spain/madrid", label: "Madrid family guide" },
  { href: "/spain", label: "Spain — country hub" },
  { href: "/spain/valencia", label: "Valencia" },
  { href: "/blog/valencia-vs-lisbon", label: "Valencia vs Lisbon (digest)" },
  { href: "/spain/malaga", label: "Málaga" },
  { href: "/destinations", label: "Browse all destinations" },
] as const;

function nurseryFeesCompareSentence(left: Destination, right: Destination): string {
  const lBand = extractTypicalPrivateNurseryMonthlyBand(left);
  const rBand = extractTypicalPrivateNurseryMonthlyBand(right);
  if (lBand && rBand) {
    return `${left.city} private nursery typical fees in our guide (${lBand}) vs ${right.city} (${rBand}) — same daycare bullets define these bands on each page.`;
  }
  return `Match the nursery "Typical fees" bullets in ${left.city} and ${right.city}; USD bands refresh with those childcare sections—not this digest.`;
}

export function ValenciaVsLisbonArticle({
  valencia,
  lisbon,
}: {
  valencia: Destination;
  lisbon: Destination;
}) {
  const vPath = `/${valencia.countrySlug}/${valencia.citySlug}`;
  const lPath = `/${lisbon.countrySlug}/${lisbon.citySlug}`;
  const vRent = parseRentAnchor(valencia.cost.rentRange);
  const lRent = parseRentAnchor(lisbon.cost.rentRange);
  return (
    <DataDigestCityComparisonArticle
      a={valencia}
      b={lisbon}
      headline="Valencia vs Lisbon: rent, schools & costs"
      intro={
        <p>
          A <strong>side-by-side</strong> of the family-focused numbers we publish for{" "}
          <Link href={vPath} className="font-semibold text-[#E84A4F] hover:underline">
            {valencia.city}
          </Link>{" "}
          and{" "}
          <Link href={lPath} className="font-semibold text-[#E84A4F] hover:underline">
            {lisbon.city}
          </Link>{" "}
          — rent, all-in costs, school fee bands, safety, and climate — for two common Iberian bases. Deeper
          checklists, visa text, and official links sit on each city guide.
        </p>
      }
      rentNote={
        vRent != null && lRent != null ? (
          <p>
            The rent line on each page is a one-line benchmark (3-bed / family context in the housing
            section). In our data{" "}
            {(vRent < lRent ? valencia : lisbon).city}&apos;s anchor is <strong>lower</strong> (~$
            {Math.min(vRent, lRent).toLocaleString("en-US")}
            vs ~$
            {Math.max(vRent, lRent).toLocaleString("en-US")} / month).{" "}
            {lRent > vRent ? (
              <>
                Many {lisbon.city} families target the <strong>Cascais–Estoril corridor</strong>, where 3-beds in
                the guide can sit above the central {lisbon.city} anchor — read each housing section before locking
                a budget.
              </>
            ) : (
              <>
                Beach-adjacent and premium districts around {valencia.city} can sit above the headline anchor—read
                each housing block before you fix a budget.
              </>
            )}
          </p>
        ) : null
      }
      childcareLine={nurseryFeesCompareSentence(valencia, lisbon)}
      climateNote={`${valencia.city} runs hotter in peak summer; ${lisbon.city} is milder then but wetter in late autumn in this grid. For month-by-month planning, use the weather sections on each city guide.`}
      visaBlock={<VisaBlockSpainDnvAndPortugalD8 spain={valencia} portugal={lisbon} />}
      related={VALENCIA_LISBON_RELATED}
      faq={getValenciaLisbonFaqItems(valencia, lisbon)}
    />
  );
}

export function LisbonVsPortoArticle({ lisbon, porto }: { lisbon: Destination; porto: Destination }) {
  const aPath = `/${lisbon.countrySlug}/${lisbon.citySlug}`;
  const bPath = `/${porto.countrySlug}/${porto.citySlug}`;
  const lRent = parseRentAnchor(lisbon.cost.rentRange);
  const pRent = parseRentAnchor(porto.cost.rentRange);
  return (
    <DataDigestCityComparisonArticle
      a={lisbon}
      b={porto}
      headline="Lisbon vs Porto: rent, schools & family costs"
      intro={
        <p>
          <strong>Portugal’s two largest metros</strong> side by side: the same data fields as our{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {lisbon.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {porto.city}
          </Link>{" "}
          guides — costs, school fee bands, safety, and climate. National visa and tax context is shared; local
          housing and school choice still drive your numbers.
        </p>
      }
      rentNote={
        lRent != null && pRent != null ? (
          <p>
            In our data, {(pRent < lRent ? porto : lisbon).city}&apos;s 3-bed rent anchor is{" "}
            <strong>lower</strong> than {(pRent < lRent ? lisbon : porto).city}&apos;s (~$
            {Math.min(pRent, lRent).toLocaleString("en-US")} vs ~$
            {Math.max(pRent, lRent).toLocaleString("en-US")}
            / month on the cards). In practice, {lisbon.city} families often look to{" "}
            <strong>Cascais</strong> and the coast; {porto.city} to <strong>Foz do Douro</strong> and{" "}
            <strong>Matosinhos</strong> — housing sections carry the full band tables.
          </p>
        ) : null
      }
      childcareLine={nurseryFeesCompareSentence(lisbon, porto)}
      climateNote={`${lisbon.city} is a bit milder in mid-summer in this grid; both get Atlantic-influenced rain in the cooler months. Check each guide’s month-by-month weather for school-year planning.`}
      visaBlock={<VisaBlockPortugalD8Only a={lisbon} b={porto} />}
      related={LISBON_PORTO_RELATED}
      faq={getLisbonPortoFaqItems(lisbon, porto)}
    />
  );
}

export function BarcelonaVsMadridArticle({
  barcelona,
  madrid,
}: {
  barcelona: Destination;
  madrid: Destination;
}) {
  const aPath = `/${barcelona.countrySlug}/${barcelona.citySlug}`;
  const bPath = `/${madrid.countrySlug}/${madrid.citySlug}`;
  const bRent = parseRentAnchor(barcelona.cost.rentRange);
  const mRent = parseRentAnchor(madrid.cost.rentRange);
  return (
    <DataDigestCityComparisonArticle
      a={barcelona}
      b={madrid}
      headline="Barcelona vs Madrid: rent, schools & family life"
      intro={
        <p>
          A <strong>head-to-head</strong> of our published numbers for{" "}
          <Link href={aPath} className="font-semibold text-[#E84A4F] hover:underline">
            {barcelona.city}
          </Link>{" "}
          and{" "}
          <Link href={bPath} className="font-semibold text-[#E84A4F] hover:underline">
            {madrid.city}
          </Link>{" "}
          — two Spanish hubs with different lifestyle trade-offs: coast vs no beach, Catalan vs
          Spanish-dominant public school context, and different heat patterns. Same national DNV path for
          remote workers; detail stays in each guide.
        </p>
      }
      rentNote={
        bRent != null && mRent != null ? (
          <p>
            {(mRent < bRent ? madrid : barcelona).city}&apos;s 3-bed rent anchor is <strong>lower</strong> than{" "}
            {(mRent < bRent ? barcelona : madrid).city}&apos;s in our data (~$
            {Math.min(mRent, bRent).toLocaleString("en-US")} vs ~$
            {Math.max(mRent, bRent).toLocaleString("en-US")} / month on the cards). {barcelona.city} families
            often end up in <strong>Sarrià</strong> and <strong>Sant Cugat</strong> for schools; {madrid.city} in{" "}
            <strong>Pozuelo</strong> and <strong>Las Rozas</strong> — those suburbs sit in the housing blocks, not
            only the single-line anchor.
          </p>
        ) : null
      }
      childcareLine={nurseryFeesCompareSentence(barcelona, madrid)}
      climateNote={`${barcelona.city} is coastal mediterranean; ${madrid.city} is a hotter, drier plateau summer. January lows are cooler inland in this grid. Use each guide’s full weather for heat and school pickup planning.`}
      visaBlock={<VisaBlockSpainDnvOnly a={barcelona} b={madrid} />}
      related={BARCELONA_MADRID_RELATED}
      faq={getBarcelonaMadridFaqItems(barcelona, madrid)}
    />
  );
}
