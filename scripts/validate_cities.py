#!/usr/bin/env python3
"""
City quality validator — run after every new city batch before deploying.

Usage:
    python3 scripts/validate_cities.py                  # check all cities
    python3 scripts/validate_cities.py bogota-co        # check one city
    python3 scripts/validate_cities.py bogota-co tampa-us  # check several

Exit code 0 = all clear. Exit code 1 = issues found (don't ship until fixed).
"""
import json, sys, re

# Cities that existed before the new-city batch — skip by default unless explicitly targeted.
# To check an older city, pass its id as a CLI argument: python3 validate_cities.py london-gb
KNOWN_GOOD_IDS = {
    "abu-dhabi-ae", "alicante-es", "amsterdam-nl", "atenas-cr", "athens-gr",
    "auckland-nz", "austin-us", "bali-id", "bangkok-th", "barcelona-es",
    "berlin-de", "brisbane-au", "budapest-hu", "buenos-aires-ar", "cascais-pt",
    "chiang-mai-th", "chicago-us", "copenhagen-dk", "dallas-us", "dubai-ae",
    "dublin-ie", "eilat-il", "florence-it", "heredia-cr", "jerusalem-il",
    "koh-phangan-th", "koh-samui-th", "krakow-pl", "kuala-lumpur-my", "lima-pe",
    "lisbon-pt", "london-gb", "los-angeles-us", "madrid-es", "malaga-es",
    "medellin-co", "melbourne-au", "miami-us", "milan-it", "munich-de",
    "new-york-city-us", "nice-fr", "paris-fr", "phuket-th", "porto-pt",
    "prague-cz", "puerto-viejo-cr", "rome-it", "san-francisco-us", "san-jose-cr",
    "santa-teresa-cr", "seattle-us", "singapore-sg", "sydney-au", "taipei-tw",
    "tamarindo-cr", "tel-aviv-il", "thessaloniki-gr", "tokyo-jp", "toronto-ca",
    "ubud-id", "valencia-es", "vancouver-ca", "vienna-at", "warsaw-pl",
    "wellington-nz", "zurich-ch", "escazu-cr",
}

# Minimum character counts for key fields
MIN_LENGTHS = {
    "checklist_item": 80,       # each checklist label
    "schools_summary": 100,
    "schools_publicSystem": 80,
    "schools_internationalOptions": 80,
    "schools_languageNotes": 50,
    "schools_tip": 60,
    "schools_option_description": 60,
    "housing_summary": 100,
    "healthcare_item": 60,
    "safety_item": 60,
    "banking_item": 60,
    "residency_item": 60,
    "faq_answer": 60,
}

# Patterns that indicate AI compression artifacts
BAD_PATTERNS = [
    r"\bpolitely\b",
    r"\boddly\b",
    r"\bmildly\b",         # trailing filler
    r"^[A-Z][a-z]+\s[A-Z][a-z]+\.$",   # two-word sentences like "IB Norte."
    r"^\w+\s\w+\s\w+\.$",  # three-word stub sentences
]

REQUIRED_SECTIONS = [
    "actionChecklist", "familyFit", "housing", "schools",
    "childcare", "healthcare", "safety", "cost", "faq",
    "residency", "banking",
]

REQUIRED_COST_FIELDS = ["monthlyFamilyAllIn", "rentRange", "familyDinner", "nannyRate"]

issues = []

def flag(city_id, path, message):
    issues.append(f"  [{city_id}] {path}: {message}")

def check_min_length(city_id, path, text, min_len):
    if not text or len(text.strip()) < min_len:
        flag(city_id, path, f"too short ({len(text.strip()) if text else 0} chars, min {min_len}) — '{(text or '').strip()[:80]}'")

def check_bad_patterns(city_id, path, text):
    if not text:
        return
    for pat in BAD_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            flag(city_id, path, f"artifact pattern '{pat}' found in: '{text[:80]}'")

def validate_city(city):
    cid = city.get("id", "unknown")

    # Required top-level sections
    for section in REQUIRED_SECTIONS:
        if section not in city:
            flag(cid, section, "MISSING SECTION")

    # actionChecklist
    checklist = city.get("actionChecklist", [])
    if len(checklist) < 8:
        flag(cid, "actionChecklist", f"only {len(checklist)} items — need at least 8")
    for i, item in enumerate(checklist):
        label = item.get("label", "")
        ts = item.get("targetSection", "")
        check_min_length(cid, f"actionChecklist[{i}].label", label, MIN_LENGTHS["checklist_item"])
        check_bad_patterns(cid, f"actionChecklist[{i}].label", label)
        if not ts:
            flag(cid, f"actionChecklist[{i}]", "missing targetSection")

    # familyFit
    ff = city.get("familyFit", {})
    if len(ff.get("bestFor", [])) != 4:
        flag(cid, "familyFit.bestFor", f"{len(ff.get('bestFor', []))} items — need exactly 4")
    if len(ff.get("watchOutFor", [])) != 4:
        flag(cid, "familyFit.watchOutFor", f"{len(ff.get('watchOutFor', []))} items — need exactly 4")

    # schools
    sch = city.get("schools", {})
    for field in ["summary", "publicSystem", "internationalOptions", "languageNotes", "tip"]:
        val = sch.get(field, "")
        key = f"schools_{field}"
        check_min_length(cid, f"schools.{field}", val, MIN_LENGTHS.get(key, 50))
        check_bad_patterns(cid, f"schools.{field}", val)
    options = sch.get("options", sch.get("examples", []))
    if len(options) < 2:
        flag(cid, "schools.options", f"only {len(options)} options — need at least 2")
    for i, opt in enumerate(options):
        desc = opt.get("description", "")
        check_min_length(cid, f"schools.options[{i}].description", desc, MIN_LENGTHS["schools_option_description"])
        check_bad_patterns(cid, f"schools.options[{i}].description", desc)
        if not opt.get("fees"):
            flag(cid, f"schools.options[{i}]", "missing fees field")

    # housing
    housing = city.get("housing", {})
    check_min_length(cid, "housing.summary", housing.get("summary", ""), MIN_LENGTHS["housing_summary"])
    check_bad_patterns(cid, "housing.summary", housing.get("summary", ""))
    if not housing.get("searchPortals"):
        flag(cid, "housing.searchPortals", "empty or missing")
    if not housing.get("typicalPrices"):
        flag(cid, "housing.typicalPrices", "empty or missing")

    # healthcare
    hc = city.get("healthcare", {})
    items = hc.get("items", [])
    if len(items) < 5:
        flag(cid, "healthcare.items", f"only {len(items)} items — need 5")
    for i, item in enumerate(items):
        check_min_length(cid, f"healthcare.items[{i}]", item, MIN_LENGTHS["healthcare_item"])
        check_bad_patterns(cid, f"healthcare.items[{i}]", item)

    # safety
    sf = city.get("safety", {})
    items = sf.get("items", [])
    if len(items) < 5:
        flag(cid, "safety.items", f"only {len(items)} items — need 5")
    for i, item in enumerate(items):
        check_min_length(cid, f"safety.items[{i}]", item, MIN_LENGTHS["safety_item"])
        check_bad_patterns(cid, f"safety.items[{i}]", item)
    score = sf.get("score", 0)
    if not (75 <= score <= 90):
        flag(cid, "safety.score", f"{score} — must be 75–90")

    # banking
    banking = city.get("banking", {})
    items = banking.get("items", [])
    if len(items) < 4:
        flag(cid, "banking.items", f"only {len(items)} items — need at least 4")
    for i, item in enumerate(items):
        check_min_length(cid, f"banking.items[{i}]", item, MIN_LENGTHS["banking_item"])
        check_bad_patterns(cid, f"banking.items[{i}]", item)

    # residency
    residency = city.get("residency", {})
    items = residency.get("items", [])
    if len(items) < 4:
        flag(cid, "residency.items", f"only {len(items)} items — need at least 4")
    for i, item in enumerate(items):
        check_min_length(cid, f"residency.items[{i}]", item, MIN_LENGTHS["residency_item"])
        check_bad_patterns(cid, f"residency.items[{i}]", item)

    # childcare
    cc = city.get("childcare", {})
    for arr in ["daycareItems", "nannyItems", "whereToFindItems"]:
        if not cc.get(arr):
            flag(cid, f"childcare.{arr}", "empty or missing")

    # cost
    cost = city.get("cost", {})
    for field in REQUIRED_COST_FIELDS:
        val = cost.get(field, "")
        if not val:
            flag(cid, f"cost.{field}", "missing")
        elif "$" not in val:
            flag(cid, f"cost.{field}", f"no $ sign — must be in USD: '{val}'")
        elif field != "monthlyFamilyAllIn" and "–" in val and field in ["rentRange", "familyDinner", "nannyRate"]:
            flag(cid, f"cost.{field}", f"should be a single ~$ figure, not a range: '{val}'")

    # faq
    faq = city.get("faq", [])
    if len(faq) != 8:
        flag(cid, "faq", f"{len(faq)} questions — need exactly 8")
    for i, qa in enumerate(faq):
        if not qa.get("question"):
            flag(cid, f"faq[{i}]", "missing question")
        ans = qa.get("answer", "")
        check_min_length(cid, f"faq[{i}].answer", ans, MIN_LENGTHS["faq_answer"])

    # weather
    weather = city.get("weather", {})
    months = weather.get("months", [])
    if len(months) != 12:
        flag(cid, "weather.months", f"{len(months)} rows — need exactly 12 (run generate_city_weather.py)")


def main():
    with open("data/cities.json", encoding="utf-8") as f:
        cities = json.load(f)

    filter_ids = set(sys.argv[1:]) if len(sys.argv) > 1 else None

    cities_checked = 0
    for city in cities:
        cid = city.get("id", "")
        if filter_ids and cid not in filter_ids:
            continue
        if not filter_ids and cid in KNOWN_GOOD_IDS:
            continue  # skip validated originals unless explicitly requested
        validate_city(city)
        cities_checked += 1

    if issues:
        print(f"\n❌  {len(issues)} issue(s) found across {cities_checked} cities checked:\n")
        for issue in issues:
            print(issue)
        print(f"\nFix all issues above before deploying.\n")
        sys.exit(1)
    else:
        print(f"✅  All {cities_checked} cities passed validation.")
        sys.exit(0)

if __name__ == "__main__":
    main()
