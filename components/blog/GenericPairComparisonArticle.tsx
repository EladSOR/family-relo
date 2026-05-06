import type { ReactNode } from "react";
import type { Destination } from "@/lib/types";
import { parseRentAnchor } from "@/lib/blog/parseBudget";
import { DataDigestCityComparisonArticle } from "@/components/blog/DataDigestCityComparisonArticle";
import type { BlogFaqItem } from "@/components/blog/BlogFaqSection";

export type GenericPairComparisonArticleProps = {
  a: Destination;
  b: Destination;
  headline: string;
  intro: ReactNode;
  climateNote: string;
  visaBlock: ReactNode;
  visaSectionTitle: string;
  visaSectionIntro: ReactNode;
  /** Extra rent context after the automated anchor comparison */
  rentNeighborhoodNote?: string | null;
  childcareClosing?: string;
  related: readonly { href: string; label: string }[];
  faq: BlogFaqItem[];
};

export function GenericPairComparisonArticle({
  a,
  b,
  headline,
  intro,
  climateNote,
  visaBlock,
  visaSectionTitle,
  visaSectionIntro,
  rentNeighborhoodNote = null,
  childcareClosing,
  related,
  faq,
}: GenericPairComparisonArticleProps) {
  const ar = parseRentAnchor(a.cost.rentRange);
  const br = parseRentAnchor(b.cost.rentRange);

  let rentNote: ReactNode | null = null;
  if (ar != null && br != null) {
    if (ar === br) {
      rentNote = (
        <>
          <p>
            The 3-bed rent anchors line up on our cost cards (~${ar.toLocaleString("en-US")} / month in both{" "}
            {a.city} and {b.city}). Real leases still drift once schools and neighbourhoods are fixed—use each
            guide&apos;s housing band bullets for finer ranges.
          </p>
          {rentNeighborhoodNote ? <p>{rentNeighborhoodNote}</p> : null}
        </>
      );
    } else {
      const cheaper = ar < br ? a : b;
      const other = ar < br ? b : a;
      const low = Math.min(ar, br);
      const high = Math.max(ar, br);
      rentNote = (
        <>
          <p>
            The single-line cards show <strong>{cheaper.city}</strong> beneath <strong>{other.city}</strong> on
            rent anchor alone (~$
            {low.toLocaleString("en-US")}
            vs ~$
            {high.toLocaleString("en-US")}
            / month). International catchments or villa compounds often sit above those anchors—see housing in
            each guide.
          </p>
          {rentNeighborhoodNote ? <p>{rentNeighborhoodNote}</p> : null}
        </>
      );
    }
  }

  const childcareLine =
    childcareClosing ??
    `International nurseries and nanny hourly benchmarks differ street by street—open the childcare blocks on ${a.city} and ${b.city} for the USD daycare and nanny lines we cite.`;

  return (
    <DataDigestCityComparisonArticle
      a={a}
      b={b}
      headline={headline}
      intro={intro}
      rentNote={rentNote}
      childcareLine={childcareLine}
      climateNote={climateNote}
      visaSectionTitle={visaSectionTitle}
      visaSectionIntro={visaSectionIntro}
      visaBlock={visaBlock}
      related={related}
      faq={faq}
    />
  );
}
