import Link from "next/link";
import type { Destination } from "@/lib/types";
import { DataDigestCityComparisonArticle } from "./DataDigestCityComparisonArticle";
import {
  VisaBlockPortugalD8Only,
  VisaBlockSpainDnvAndPortugalD8,
  VisaBlockSpainDnvOnly,
} from "./comparisonVisaBlocks";
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
            section). In our data, {valencia.city}&apos;s anchor is <strong>lower</strong> (~$
            {vRent.toLocaleString("en-US")} vs ~${lRent.toLocaleString("en-US")} / month). Many {lisbon.city}{" "}
            families target the <strong>Cascais–Estoril corridor</strong>, where 3-beds in the guide can sit
            above the central {lisbon.city} anchor — read the housing blocks before fixing a budget.
          </p>
        ) : null
      }
      childcareLine={`${valencia.city} private nursery in our data ~$330–$660/month vs ${lisbon.city} ~$550–$990/month (see each guide’s childcare section).`}
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
            In our data, {porto.city}&apos;s 3-bed rent anchor is <strong>lower</strong> than {lisbon.city}
            &apos;s (~${pRent.toLocaleString("en-US")} vs ~${lRent.toLocaleString("en-US")} / month on the
            line-item cards). In practice, {lisbon.city} families often look to <strong>Cascais</strong> and the
            coast; {porto.city} to <strong>Foz do Douro</strong> and <strong>Matosinhos</strong> — use the
            housing section in each guide for full band tables.
          </p>
        ) : null
      }
      childcareLine={`${porto.city} private nursery in our data ~$440–$880/month vs ${lisbon.city} ~$550–$990/month (see each guide).`}
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
            {madrid.city}&apos;s 3-bed rent anchor is <strong>lower</strong> than {barcelona.city}&apos;s in
            our data (~${mRent.toLocaleString("en-US")} vs ~${bRent.toLocaleString("en-US")} / month on the
            cost cards). {barcelona.city} families often end up in <strong>Sarrià</strong> and{" "}
            <strong>Sant Cugat</strong> for schools; {madrid.city} in <strong>Pozuelo</strong> and{" "}
            <strong>Las Rozas</strong> — those suburbs sit in the housing blocks, not only in the single-line
            anchor.
          </p>
        ) : null
      }
      childcareLine={`${barcelona.city} private nursery in our data ~$385–$770/month vs ${madrid.city} ~$330–$715/month (see each guide).`}
      climateNote={`${barcelona.city} is coastal mediterranean; ${madrid.city} is a hotter, drier plateau summer. January lows are cooler inland in this grid. Use each guide’s full weather for heat and school pickup planning.`}
      visaBlock={<VisaBlockSpainDnvOnly a={barcelona} b={madrid} />}
      related={BARCELONA_MADRID_RELATED}
      faq={getBarcelonaMadridFaqItems(barcelona, madrid)}
    />
  );
}
