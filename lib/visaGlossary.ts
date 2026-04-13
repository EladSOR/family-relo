/**
 * Definitions for visa-section UI (TermHint + VisaRichText).
 * Keys are matched longest-first so "Schengen Area" wins over "Schengen".
 */
export const VISA_GLOSSARY: Record<string, string> = {
  "Schengen Area":
    "Countries with no routine border checks between them. For many visitors, short stays share one allowance — usually about 90 days in any rolling 180-day period — counted across the whole zone, not per country. Rules depend on your passport.",
  "National Visa Type D":
    "A long-stay national visa issued by one country (e.g. Poland) for a specific purpose such as work. It is not the same as a short tourist visit.",
  "Zezwolenie na prace":
    "Polish work permit — employer-led permission before you can work legally in Poland on a work-based visa route.",
  "Karta Pobytu":
    "Polish temporary residence card — the main physical permit for non-EU residents staying longer than a short visa.",
  "Urzad Dzielnicy":
    "Polish district office — where you often register your address (zameldowanie) in larger cities.",
  zameldowanie:
    "Poland's mandatory address registration — required shortly after you move in; bring passport and rental contract.",
  PESEL:
    "Poland's universal personal ID number — needed for banking, healthcare, school enrolment, and most formal steps.",
  "EU/EEA":
    "EU (European Union) countries plus EEA members Iceland, Liechtenstein, and Norway — free movement with the EU for citizens.",
  EU: "European Union — member states with shared policies; citizens can live and work in other EU countries without a work visa.",
  EEA: "European Economic Area — the EU plus Iceland, Liechtenstein, and Norway. EEA citizens generally have the same free-movement rights as EU citizens in the EU.",
  Schengen:
    "Short-stay zone covering many European countries. Visa-free visitors often get about 90 days in any 180 days across the whole Schengen Area — verify for your passport.",
  ESTA:
    "US Electronic System for Travel Authorization — online approval for Visa Waiver Program nationals before flying to the United States; not a visa stamp.",
  "B-1/B-2":
    "US visitor visa categories — tourism and short business visits; does not authorise US employment.",
  "I-94":
    "US arrival/departure record — shows how long you may stay on this trip; online at i94.cbp.dhs.gov after entry.",
  VWP: "Visa Waiver Program — allows eligible passport holders to visit the US for short trips with ESTA instead of a B visa, subject to strict rules.",
  USCIS: "US Citizenship and Immigration Services — federal agency that processes many visa and status applications.",
  CBP: "US Customs and Border Protection — officers at the border set your admitted-until date on entry.",
  TN: "USMCA professional visa category for citizens of Canada and Mexico in certain listed occupations.",
  "H-1B":
    "US specialty-occupation work visa — employer-sponsored; subject to caps and timelines that change each year.",
  GDRFA:
    "UAE General Directorate of Residency and Foreigners Affairs — processes residence and entry in Dubai.",
  "Emirates ID":
    "UAE national ID card — required for banking, healthcare, and school enrolment after residency.",
  TM30:
    "Thai address reporting rule — your landlord must notify immigration when you stay at an address.",
  "90-day report":
    "Thailand's periodic check-in for long-stay visa holders — often every 90 days.",
  DTV: "Destination Thailand Visa — long-stay route aimed at remote workers and visitors; rules and fees change — confirm officially.",
  NIE: "Spanish foreigner ID number — needed for many contracts and registrations before residency card steps.",
  TIE: "Spain's physical residency card for non-EU residents after approval.",
  "Padrón Municipal":
    "Spain's municipal address register — often the first local registration step for residents.",
  NIF: "Portuguese tax identification number — needed for bank accounts, contracts, and tax.",
  NHR: "Portugal's former Non-Habitual Resident tax scheme — legacy status for some arrivals; verify current law.",
  AIMA: "Portugal's immigration authority — handles residence applications and renewals.",
  SIP: "Spain's public healthcare card after you register — unlocks state healthcare for eligible residents.",
};

/** Longest keys first for regex alternation */
export const GLOSSARY_SORTED_KEYS = Object.keys(VISA_GLOSSARY).sort(
  (a, b) => b.length - a.length,
);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Matches glossary terms on word boundaries (handles hyphenated words). */
export function buildGlossarySplitRegex(): RegExp {
  const inner = GLOSSARY_SORTED_KEYS.map(escapeRegex).join("|");
  return new RegExp(`(${inner})`, "g");
}
