import Link from "next/link";
import type { Destination } from "@/lib/types";

function spainDnvFromChecklist(dest: Destination) {
  return dest.actionChecklist.find((x) => x.targetSection === "visa")?.label ?? "";
}

function portugalD8FromGuide(dest: Destination) {
  return dest.visa?.options.find((o) => o.anchor === "visa-d8")?.description ?? "";
}

/** Spain + Portugal: DNV in Spain, D8 in Portugal. */
export function VisaBlockSpainDnvAndPortugalD8({
  spain,
  portugal,
}: {
  spain: Destination;
  portugal: Destination;
}) {
  const sp = `/${spain.countrySlug}/${spain.citySlug}`;
  const pp = `/${portugal.countrySlug}/${portugal.citySlug}`;
  const dnv = spainDnvFromChecklist(spain).match(/\$[\d,]+\/month/);
  const d8 = portugalD8FromGuide(portugal).match(/\$[\d,]+\/month/);
  return (
    <ul className="mt-3 list-inside list-disc space-y-2 text-base leading-relaxed text-slate-700">
      <li>
        <Link href={`${sp}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {spain.country} — Digital Nomad route ({spain.city} guide)
        </Link>
        {dnv
          ? `: our checklist quotes ${dnv[0]} for the main applicant — read the full visa section for family add-ons.`
          : ": open the visa section for the current income line we publish."}
      </li>
      <li>
        <Link href={`${pp}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {portugal.country} — D8 ({portugal.city} guide)
        </Link>
        {d8
          ? `: the D8 description in our guide includes a ${d8[0]} reference; wording matches the consulate list we link.`
          : ": open the D8 block for the exact threshold text."}
      </li>
    </ul>
  );
}

/** Two cities in Spain — same DNV national framework. */
export function VisaBlockSpainDnvOnly({ a, b }: { a: Destination; b: Destination }) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  const dnv = spainDnvFromChecklist(a).match(/\$[\d,]+\/month/);
  return (
    <ul className="mt-3 list-inside list-disc space-y-2 text-base leading-relaxed text-slate-700">
      <li>
        <Link href={`${aPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {a.city} guide
        </Link>{" "}
        and{" "}
        <Link href={`${bPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {b.city} guide
        </Link>{" "}
        both use the same national Spain Digital Nomad (DNV) route for non-EU remote workers.{" "}
        {dnv
          ? `Our ${a.city} checklist quotes ${dnv[0]} for the main applicant; ${b.city} uses the same rule set — see each page for your situation and add-ons.`
          : "Open either visa section for the full checklist."}
      </li>
    </ul>
  );
}

/** Two cities in Portugal — D8 and shared national framework. */
export function VisaBlockPortugalD8Only({ a, b }: { a: Destination; b: Destination }) {
  const aPath = `/${a.countrySlug}/${a.citySlug}`;
  const bPath = `/${b.countrySlug}/${b.citySlug}`;
  const d8 = portugalD8FromGuide(a).match(/\$[\d,]+\/month/);
  return (
    <ul className="mt-3 list-inside list-disc space-y-2 text-base leading-relaxed text-slate-700">
      <li>
        <Link href={`${aPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {a.city}
        </Link>{" "}
        and{" "}
        <Link href={`${bPath}#visa`} className="font-semibold text-[#E84A4F] hover:underline">
          {b.city}
        </Link>{" "}
        are both covered by the same national Portugal options (including D8 for non-EU remote work).{" "}
        {d8
          ? `The D8 block in our guides cites ${d8[0]} as the income floor; confirm family rules on the page.`
          : "Open the D8 section on either guide for the threshold text."}
      </li>
    </ul>
  );
}
