#!/usr/bin/env python3
"""
Deep audit of every city against the Valencia/Lisbon reference standard.
Checks structural completeness AND content quality across every section.

Categories:
  A. Structural completeness  (missing fields / wrong types / wrong counts)
  B. Housing-section depth     (Valencia 4-block pattern)
  C. Cost format consistency   (USD `~$` benchmarks)
  D. Safety score range        (75–90)
  E. FAQ standard questions    (the 8 reference questions per RULE 9)
  F. Visa options completeness (anchor / detailTitle / duration / details[])
  G. Replacement-typo glitches (e.g. 'Viennao' from a botched Milano→Vienna swap)
  H. Cross-country wrong jargon (extends scan_country_jargon.py)
"""
import json
import re
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
COUNTRIES = Path(__file__).parent.parent / "data" / "countries.json"
cities = json.loads(DATA.read_text())
countries = json.loads(COUNTRIES.read_text())
# Country slugs that ship a country-level visa fallback — cities in these
# countries can omit their own visa block (per city-template.mdc).
COUNTRY_VISA_FALLBACK = {
    slug for slug, body in countries.items()
    if isinstance(body, dict) and body.get("visa", {}).get("options")
}
# English-native countries where FAQ #4 is allowed to use the
# 'private school / public schools' variant instead of 'international / local'.
ENGLISH_NATIVE = {"usa", "canada", "uk", "ireland", "australia", "new-zealand"}

REQUIRED_TOP = {
    "id", "citySlug", "countrySlug", "city", "country", "tagline", "summary",
    "lastReviewed", "actionChecklist", "familyFit", "visa", "residency",
    "banking", "housing", "schools", "childcare", "healthcare", "safety",
    "cost", "sources", "communityLinks", "faq", "weather",
}

REQUIRED_HOUSING = {
    "summary", "bestAreas", "searchPortalsIntro", "searchPortals",
    "typicalPrices", "whatYouNeedToRent",
}

REQUIRED_COST = {"status", "monthlyFamilyAllIn", "rentRange", "familyDinner", "nannyRate"}

STANDARD_FAQ = [
    "Is {CITY} good for families?",
    "How much does a family typically need per month here?",
    "Is housing hard to find here?",
    "Do children need international school here, or can local schools work?",
    "Is healthcare easy to access as a newcomer?",
    "Do you need a car in {CITY}?",
    "How difficult is the paperwork and bureaucracy after moving?",
    "What usually surprises families after arrival?",
]

# Replacement-glitch hints — patterns that suggest a botched find/replace.
# Pattern: a city/country lemma immediately followed by an extra letter or
# stuck inside an unrelated word.
REPLACEMENT_TYPOS = [
    re.compile(r"Vienna(o|ese)\b"),  # 'Viennao' (Milano→Vienna)
    re.compile(r"Lisbon(o|a|ese)\b(?!.*Portugal)"),
    re.compile(r"\b(Lake Como|Po Valley|Bocconi)\b", re.IGNORECASE),
    re.compile(r"\bMilano\b"),  # leftover Italian self-reference
    re.compile(r"\bSiviglia\b"),  # Italian for Seville
]

# Marketplace platforms that are NOT real channels for finding nannies
# in the country they were attached to. Each entry: platform substring →
# set of country slugs where it's actually used for childcare/nanny
# hiring. Listed here are confirmed-fabricated combinations from past
# generations (Yad2 = goods only, Metrocuadrado = real estate only,
# ConMuchoGusto outside Costa Rica, etc.). When you confirm a new
# platform actually has a real childcare vertical, add it here so the
# audit stops flagging it.
NANNY_PLATFORM_OK = {
    "yad2": set(),                    # Israel: NOT for nannies
    "metrocuadrado": set(),           # Colombia: real estate ONLY
    "conmuchogusto": {"costa-rica"},  # CR only
    "car.gr": set(),                  # Greece: cars only
    "ergani.gr": set(),               # Greece: government labour registry
}


# More precise wrong-country jargon (extends scan_country_jargon.py)
WRONG_JARGON = {
    "Codice Fiscale": {"italy"},
    "Permesso di Soggiorno": {"italy"},
    "Agenzia delle Entrate": {"italy"},
    "Questura": {"italy"},
    "Ufficio Anagrafe": {"italy"},
    "asilo nido": {"italy"},
    "Servizio Sanitario Nazionale": {"italy"},
    "Azienda Sanitaria Locale": {"italy"},
    "Intesa Sanpaolo": {"italy"},
    "Padrón Municipal": {"spain"},
    "Ayuntamiento": {"spain"},
    "Centro de Salud": {"spain"},
    " NIE ": {"spain"},
    "Junta de Freguesia": {"portugal"},
    "Finanças": {"portugal"},
    "AIMA ": {"portugal"},
    " NIF ": {"portugal"},
    "Anmeldung": {"germany"},
    "Bürgeramt": {"germany"},
    "BSN ": {"netherlands"},
    "Carte Vitale": {"france"},
}


def issue(out, city_id, category, msg):
    out.setdefault(city_id, []).append((category, msg))


def audit():
    out = {}
    for c in cities:
        cid = c["id"]
        country = c.get("countrySlug", "")
        city_name = c.get("city", "?")

        # A. Structural completeness — visa is optional when the country
        # ships a fallback in countries.json.
        required = set(REQUIRED_TOP)
        if country in COUNTRY_VISA_FALLBACK:
            required.discard("visa")
        missing = required - set(c.keys())
        if missing:
            issue(out, cid, "A.struct", f"missing top-level: {sorted(missing)}")

        # actionChecklist length
        cl = c.get("actionChecklist", [])
        if len(cl) < 6 or len(cl) > 10:
            issue(out, cid, "A.checklist", f"checklist length {len(cl)} (want 8±2)")
        if cl and cl[0].get("targetSection") != "visa":
            issue(out, cid, "A.checklist", "first item not visa-targeted")

        # familyFit
        ff = c.get("familyFit", {})
        if len(ff.get("bestFor", [])) != 4:
            issue(out, cid, "A.familyFit",
                  f"bestFor has {len(ff.get('bestFor', []))} items (want 4)")
        if len(ff.get("watchOutFor", [])) != 4:
            issue(out, cid, "A.familyFit",
                  f"watchOutFor has {len(ff.get('watchOutFor', []))} items (want 4)")

        # B. Housing depth
        h = c.get("housing", {})
        h_missing = REQUIRED_HOUSING - set(h.keys())
        if h_missing:
            issue(out, cid, "B.housing", f"missing housing keys: {sorted(h_missing)}")
        spi = h.get("searchPortalsIntro", [])
        if len(spi) != 3:
            issue(out, cid, "B.housing",
                  f"searchPortalsIntro has {len(spi)} lines (want exactly 3)")
        if len(h.get("bestAreas", [])) < 4:
            issue(out, cid, "B.housing",
                  f"bestAreas has {len(h.get('bestAreas', []))} items (want ≥4)")
        if len(h.get("searchPortals", [])) < 3:
            issue(out, cid, "B.housing",
                  f"searchPortals has {len(h.get('searchPortals', []))} entries (want ≥3)")
        if len(h.get("typicalPrices", [])) < 3:
            issue(out, cid, "B.housing",
                  f"typicalPrices has {len(h.get('typicalPrices', []))} lines (want ≥3)")
        if len(h.get("whatYouNeedToRent", [])) < 4:
            issue(out, cid, "B.housing",
                  f"whatYouNeedToRent has {len(h.get('whatYouNeedToRent', []))} (want ≥4)")
        # All searchPortals should have isVerified flag set
        for sp in h.get("searchPortals", []):
            if "isVerified" not in sp:
                issue(out, cid, "B.housing",
                      f"searchPortals entry missing isVerified: {sp.get('label', '?')[:50]}")
        # typicalPrices: at least 3 entries should mention a $ figure.
        # Descriptive lines without USD ('Short-stay surcharges add 30–60%',
        # 'Inland with longer drives', etc.) are allowed when there are
        # enough $ lines beside them.
        with_dollar = sum(1 for tp in h.get("typicalPrices", []) if "$" in tp)
        if with_dollar < 3:
            for tp in h.get("typicalPrices", []):
                if "$" not in tp:
                    issue(out, cid, "B.housing-USD",
                          f"typicalPrices line w/o '$': {tp[:80]}")

        # C. Cost format
        cost = c.get("cost", {})
        cost_missing = REQUIRED_COST - set(cost.keys())
        if cost_missing:
            issue(out, cid, "C.cost", f"missing cost keys: {sorted(cost_missing)}")
        for k in ("monthlyFamilyAllIn", "rentRange", "familyDinner", "nannyRate"):
            v = cost.get(k, "")
            if not v:
                issue(out, cid, "C.cost", f"{k} empty")
                continue
            if "$" not in v:
                issue(out, cid, "C.cost", f"{k} not in USD: {v}")
            if not v.startswith("~"):
                issue(out, cid, "C.cost", f"{k} missing '~' prefix: {v}")

        # D. Safety score
        score = c.get("safety", {}).get("score")
        if not isinstance(score, int) or not (75 <= score <= 90):
            issue(out, cid, "D.safety", f"safety score {score} (want 75–90)")
        if len(c.get("safety", {}).get("items", [])) < 4:
            issue(out, cid, "D.safety",
                  f"safety items {len(c.get('safety', {}).get('items', []))} (want ≥4)")

        # E. FAQ standard — allow 'private school / public schools' variant
        # for FAQ #4 in English-native countries, and the 'on [Island]' phrasing
        # for FAQ #6 in island destinations.
        faq = c.get("faq", [])
        if len(faq) != 8:
            issue(out, cid, "E.faq", f"faq has {len(faq)} questions (want 8)")
        else:
            for i, q in enumerate(faq):
                expected = STANDARD_FAQ[i].format(CITY=city_name)
                actual = q.get("question", "").strip()
                if actual == expected:
                    continue
                if i == 3 and country in ENGLISH_NATIVE and (
                    "private school" in actual.lower()
                    and "public schools" in actual.lower()
                ):
                    continue
                if i == 5 and (f"on {city_name}" in actual or actual.endswith(f"on {city_name}?")):
                    continue
                issue(out, cid, "E.faq",
                      f"FAQ #{i+1} non-standard: {actual[:80]!r}")

        # F. Visa options — only checked when the city has its own visa block.
        # Cities in COUNTRY_VISA_FALLBACK use the country-level fallback.
        vopts = c.get("visa", {}).get("options", [])
        has_city_visa = bool(c.get("visa"))
        if has_city_visa and len(vopts) < 2:
            issue(out, cid, "F.visa", f"only {len(vopts)} visa options (want 2–3)")
        for o in vopts:
            for need in ("anchor", "detailTitle", "duration", "description", "details"):
                if not o.get(need):
                    issue(out, cid, "F.visa",
                          f"option '{o.get('type','?')}' missing {need}")
            if len(o.get("details", [])) < 4:
                issue(out, cid, "F.visa",
                      f"option '{o.get('type','?')}' has {len(o.get('details',[]))} details (want ≥4)")
            dur = (o.get("duration") or "").strip()
            if dur in ("", "Varies", "varies", "—"):
                issue(out, cid, "F.visa",
                      f"option '{o.get('type','?')}' has unhelpful duration: {dur!r}")

        # G. Replacement-typo glitches (full JSON) — Milan legitimately mentions
        # Milano, Lake Como, and the Po Valley (it's in northern Italy on the
        # Po plain). Skip the typo scan for that one city.
        blob = json.dumps(c, ensure_ascii=False)
        if cid != "milan-it":
            for pat in REPLACEMENT_TYPOS:
                for m in pat.finditer(blob):
                    issue(out, cid, "G.typo",
                          f"glitch '{m.group(0)}' (pattern: {pat.pattern})")

        # H. Wrong-country jargon
        for term, ok_countries in WRONG_JARGON.items():
            if term in blob and country not in ok_countries:
                issue(out, cid, "H.jargon",
                      f"'{term.strip()}' appears in {country} city (only valid for {ok_countries})")

        # I. Fabricated nanny platforms — flag platforms listed in
        # childcare.whereToFindItems that aren't real childcare channels
        # in this country.
        for item in c.get("childcare", {}).get("whereToFindItems", []):
            lower = item.lower()
            for platform, ok_countries in NANNY_PLATFORM_OK.items():
                if platform in lower and country not in ok_countries:
                    issue(out, cid, "I.nanny-platform",
                          f"'{platform}' is not a real nanny channel for {country} "
                          f"(only valid for {ok_countries or '(none)'})")

        # Residency + banking required objects with items[] + tip
        for sec in ("residency", "banking"):
            s = c.get(sec, {})
            if not s:
                issue(out, cid, "A.struct", f"{sec} section missing")
                continue
            if len(s.get("items", [])) < 4:
                issue(out, cid, "A.struct",
                      f"{sec}.items has {len(s.get('items', []))} (want ≥4)")
            if not s.get("tip"):
                issue(out, cid, "A.struct", f"{sec}.tip empty")

        # healthcare + safety items[]
        if len(c.get("healthcare", {}).get("items", [])) < 4:
            issue(out, cid, "A.struct",
                  f"healthcare.items {len(c.get('healthcare', {}).get('items', []))} (want ≥4)")

        # childcare 3 arrays
        cc = c.get("childcare", {})
        for k in ("daycareItems", "nannyItems", "whereToFindItems"):
            if len(cc.get(k, [])) < 3:
                issue(out, cid, "A.struct",
                      f"childcare.{k} has {len(cc.get(k, []))} (want ≥3)")

        # schools.options 2–4
        opts = c.get("schools", {}).get("options", [])
        if not (2 <= len(opts) <= 4):
            issue(out, cid, "A.struct", f"schools.options {len(opts)} (want 2–4)")

    return out


def main():
    out = audit()
    print(f"Audited {len(cities)} cities — issues in {len(out)} entries.\n")
    if not out:
        print("No issues. Site matches Valencia standard.")
        return
    # group by category for readability
    cat_counts = {}
    for cid, items in out.items():
        for cat, _ in items:
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
    print("Issue counts by category:")
    for cat in sorted(cat_counts, key=lambda x: -cat_counts[x]):
        print(f"  {cat:<14} {cat_counts[cat]}")
    print()
    print("Per-city detail:")
    for cid in sorted(out):
        print(f"\n  - {cid}")
        for cat, msg in out[cid]:
            print(f"      [{cat}] {msg}")


if __name__ == "__main__":
    main()
