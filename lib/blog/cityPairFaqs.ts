import type { BlogFaqItem } from "@/components/blog/BlogFaqSection";
import type { Destination } from "@/lib/types";

export function faqItemsToSchema(items: BlogFaqItem[]): { question: string; answer: string }[] {
  return items.map((f) => ({ question: f.question, answer: String(f.answer) }));
}

export function getValenciaLisbonFaqForSchema(
  valencia: Destination,
  lisbon: Destination,
): { question: string; answer: string }[] {
  return faqItemsToSchema(getValenciaLisbonFaqItems(valencia, lisbon));
}

export function getLisbonPortoFaqForSchema(
  lisbon: Destination,
  porto: Destination,
): { question: string; answer: string }[] {
  return faqItemsToSchema(getLisbonPortoFaqItems(lisbon, porto));
}

export function getGenericPairFaqForSchema(
  a: Destination,
  b: Destination,
): { question: string; answer: string }[] {
  return faqItemsToSchema(getGenericPairFaqItems(a, b));
}

/** Neutral FAQ for mixed pairs — compares table fields only, defers visas/taxes to guides. */
export function getGenericPairFaqItems(a: Destination, b: Destination): BlogFaqItem[] {
  return [
    {
      question: "Which city looks cheaper in the numbers on this page?",
      answer: `Use the monthly all-in bands and the 3-bed rent anchors in the table—they are lifted straight from the ${a.city} and ${b.city} guides. Winner changes once you pick schools, suburbs, and commute; treat the headline figures as orientation, not a budget lock.`,
    },
    {
      question: "What do the July and January climate rows mean?",
      answer:
        "They mirror each guide’s NASA POWER / MERRA-2 normals: typical highs, lows, and rain for those months—not a forecast for a single trip. Expand the weather cards before you judge heat, uniforms, or school-year outdoor time.",
    },
    {
      question: "Where are housing portals, neighbourhood notes, and full visa wording?",
      answer: `Each city guide linked above has searchable housing portals, childcare USD anchors, checklist items, and the full visa prose. This digest aggregates the headline cost and safety metrics so you compare both metros in one read.`,
    },
    {
      question: "Is this legal, tax, or immigration advice?",
      answer:
        "No. Numbers and bullets mirror our guides only. Final eligibility, taxation, enrolment choices, or employer-sponsored routes need official authorities and licensed professionals tailored to your passport and income.",
    },
  ];
}

export function getBarcelonaMadridFaqForSchema(
  barcelona: Destination,
  madrid: Destination,
): { question: string; answer: string }[] {
  return faqItemsToSchema(getBarcelonaMadridFaqItems(barcelona, madrid));
}

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

export function getLisbonPortoFaqItems(lisbon: Destination, porto: Destination): BlogFaqItem[] {
  return [
    {
      question: "Is Lisbon or Porto usually cheaper in your data?",
      answer: `In our published bands, ${porto.city} has a lower all-in range and a lower 3-bed rent anchor than ${lisbon.city}. ${lisbon.city} has a wider international school market and some fee bands that exceed Porto’s; pick schools first if that drives your budget.`,
    },
    {
      question: "What do the January and July rows mean?",
      answer:
        "Long-term grid normals (same NASA POWER / MERRA-2 source as each city’s weather card), not a weekly forecast. Use the full monthly tables on the guides to plan the year.",
    },
    {
      question: "Do both cities use the same visa information?",
      answer:
        "The national Portugal paths (including D8 for remote work) are the same; each guide has the full D8 and EU/Schengen text with consulate and official links. Your personal case still needs to match current rules.",
    },
    {
      question: "Is this page enough for tax (e.g. NHR) or final visa decisions?",
      answer:
        "No. It only mirrors our guide summaries. Tax and final eligibility need official sources and a professional for your case.",
    },
  ];
}

export function getBarcelonaMadridFaqItems(
  barcelona: Destination,
  madrid: Destination,
): BlogFaqItem[] {
  return [
    {
      question: "Is Madrid or Barcelona cheaper in your data?",
      answer: `In our line-item ranges, ${madrid.city} shows a lower monthly all-in band and a lower 3-bed rent anchor than ${barcelona.city}. ${barcelona.city} still runs hot at the top of international school + prime-area rent; map your school and area before treating the table as final.`,
    },
    {
      question: "What do the climate rows tell me?",
      answer:
        "They’re long-term July vs January normals from the same methodology as each guide’s weather card. Barcelona is mediterranean coastal; Madrid is a hotter, drier summer plateau. Use each city’s full weather section for the school year.",
    },
    {
      question: "What about school language: Catalan vs Spanish?",
      answer: `${barcelona.city}’s guide stresses Catalan in many public and concertado settings; ${madrid.city} is Spanish-dominant in public school. English-medium in both places is the international private route in our guide structure — read the school blocks, not this table, for the trade-offs.`,
    },
    {
      question: "Is this DNV / visa or tax advice?",
      answer:
        "No. Both guides use the same national Spain DNV story at headline level. Confirm income lines, documents, and any tax link to your situation with the consulate, official sites, and a professional.",
    },
  ];
}
