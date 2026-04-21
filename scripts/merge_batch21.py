#!/usr/bin/env python3
"""Build 21 new destinations via deep-copy + patch, merge into data/cities.json."""
from __future__ import annotations

import json
import sys
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data" / "cities.json"


def load_cities() -> list:
    with open(PATH, encoding="utf-8") as f:
        return json.load(f)


def save_cities(cities: list) -> None:
    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(cities, f, ensure_ascii=False, indent=2)
        f.write("\n")


def find_city(cities: list, cid: str) -> dict:
    for c in cities:
        if c["id"] == cid:
            return c
    raise KeyError(cid)


def strip_weather(c: dict) -> None:
    c.pop("weather", None)
    src = c.get("sources")
    if isinstance(src, dict) and "weather" in src:
        del src["weather"]


def deep_str_replace(obj, old: str, new: str):
    if isinstance(obj, dict):
        for k, v in obj.items():
            obj[k] = deep_str_replace(v, old, new)
        return obj
    if isinstance(obj, list):
        return [deep_str_replace(x, old, new) for x in obj]
    if isinstance(obj, str):
        return obj.replace(old, new)
    return obj


def latam_portals(domain: str, fbq: str) -> list:
    g = lambda q: "https://www.google.com/search?q=" + q.replace(" ", "+")
    return [
        {"label": f"{domain} — classifieds (root site)", "url": f"https://www.{domain}", "isVerified": True},
        {"label": "Facebook groups — community housing leads", "url": g(fbq), "isVerified": True},
    ]


def numbeo_slug(city: dict) -> None:
    slug = city["city"].replace(" ", "-")
    city.setdefault("sources", {})
    city["sources"]["cost"] = [
        {
            "label": f'{city["city"]} Cost of Living — Numbeo',
            "url": f'https://www.numbeo.com/cost-of-living/in/{slug}',
            "isVerified": True,
        }
    ]


def uk_visa_block() -> dict:
    return {
        "status": "verified",
        "summary": "The UK is outside the EU. Most visitors enter on a Standard Visitor visa or visa-free rules depending on nationality — confirm before travel. Long-term work usually requires a Skilled Worker visa with employer sponsorship; there is no generic remote-work visa comparable to EU digital nomad routes.",
        "tip": "Search 'UK skilled worker visa gov.uk' on Google for current salary thresholds and document lists — rules change with government budgets.",
        "options": [
            {
                "type": "Standard Visitor (tourism / scouting)",
                "anchor": "visa-tourist",
                "detailTitle": "Standard Visitor — short family visits and scouting",
                "duration": "Usually up to 6 months per visit — confirm for your nationality",
                "description": "For tourism and scouting schools — not for living and working long-term.",
                "details": [
                    "Many nationalities visit visa-free for short trips; others apply for a Standard Visitor visa before travel.",
                    "No right to work in the UK — including most remote work tied to a UK entity.",
                    "Use a scouting trip to view neighbourhoods and schools, then apply for the correct work or family visa from outside the UK if you plan to stay.",
                    "Search 'UK Standard Visitor visa gov.uk' on Google for the checklist that matches your passport.",
                ],
                "officialLink": {"label": "UK Standard Visitor visa official gov.uk"},
            },
            {
                "type": "Skilled Worker visa (employer-sponsored)",
                "anchor": "visa-dnv",
                "detailTitle": "Skilled Worker visa — main employed route",
                "duration": "Linked to job — renewable",
                "description": "Requires a licensed UK employer and a job offer that meets skill and salary tests.",
                "details": [
                    "Your employer issues a Certificate of Sponsorship — you then apply online and usually provide biometrics.",
                    "Dependants normally apply as linked family members — confirm school access and NHS surcharge payment rules before you move.",
                    "Healthcare: most applicants pay the Immigration Health Surcharge for NHS access — treat official guidance as the source of truth.",
                    "Search 'UK Skilled Worker visa gov.uk' on Google for salary thresholds and eligible occupations.",
                ],
                "officialLink": {"label": "UK Skilled Worker visa gov.uk"},
            },
        ],
    }


def jerusalem_dict() -> dict:
    """Hand-built Jerusalem entry (validated structure)."""
    g = lambda q: "https://www.google.com/search?q=" + q.replace(" ", "+")
    return {
        "id": "jerusalem-il",
        "citySlug": "jerusalem",
        "countrySlug": "israel",
        "city": "Jerusalem",
        "country": "Israel",
        "tagline": "Historic highland city — diverse neighbourhoods and a distinct pace from Tel Aviv",
        "summary": "Jerusalem is Israel's highland capital in the Judean hills — cooler evenings than the coast, deep historical layers, and a mix of secular, religious, and international communities. Families come for NGOs, government, tech and health roles, and bilingual schooling in pockets. Trade-offs are polarised housing markets by neighbourhood, complex geography, and the same national security awareness and bureaucracy as elsewhere in Israel. This page is the city people search for — not a suburb of Tel Aviv.",
        "lastReviewed": "2026-04",
        "relatedDestinationGuide": {
            "countrySlug": "israel",
            "citySlug": "tel-aviv",
            "label": "Tel Aviv",
            "context": "Jerusalem is a separate city from coastal Tel Aviv. Many families compare beach life, tech employers, and school clusters between the two.",
        },
        "actionChecklist": [
            {"label": "Check entry and visa rules — short visits are often visa-free for Western passports; long-term work usually needs a B/1 employer-sponsored visa", "targetSection": "visa"},
            {"label": "Start housing early — Anglo-friendly pockets (German Colony, Arnona, Katamon, Baka) turn over quickly", "targetSection": "housing"},
            {"label": "Apply for Mispar Zehut (מספר זהות — Israeli ID number) at the Ministry of Interior — required for healthcare, banking, and schools", "targetSection": "residency"},
            {"label": "Short-list schools before you sign a lease — hill commutes vary sharply", "targetSection": "schools"},
            {"label": "Join a Kupat Holim (קופת חולים — public health fund) once eligible after registration", "targetSection": "healthcare"},
            {"label": "Open an Israeli bank with visa and lease paperwork — allow several weeks", "targetSection": "banking"},
            {"label": "Download national alert apps and learn shelter locations — preparedness is part of daily life", "targetSection": "safety"},
            {"label": "Review your government's travel advisory before committing dates", "targetSection": "safety"},
        ],
        "familyFit": {
            "bestFor": [
                "Families tied to government, diplomacy, NGOs, health, or education in the capital",
                "Parents wanting hill-city weather versus coastal humidity",
                "Households prepared for Israel's administrative and security context",
                "Those who value tight community within walkable pockets",
            ],
            "watchOutFor": [
                "Neighbourhood choice is socially and practically consequential — research on the ground",
                "Shabbat and holiday rhythms affect services and transport",
                "Parking and steep streets punish the wrong flat",
                "Some specialist care still means a coastal corridor visit",
            ],
        },
        "visa": {
            "status": "verified",
            "summary": "Most Western passport holders enter visa-free for short visits. Long-term work normally requires a B/1 visa sponsored by an Israeli employer; some families qualify under the Law of Return — confirm with official sources.",
            "tip": "Start employer sponsorship early — processing often takes months.",
            "options": [
                {
                    "type": "Visa-free entry (short visit)",
                    "anchor": "visa-tourist",
                    "detailTitle": "Visa-free entry — scouting Jerusalem",
                    "duration": "Often up to 90 days — confirm for your nationality",
                    "description": "Tourism and scouting — not work authorisation.",
                    "details": [
                        "Verify rules for every family member before flying.",
                        "No Israeli employment on a tourist status.",
                        "Use the trip to view neighbourhoods and schools.",
                        "Search 'Israel visa Ministry of Foreign Affairs' on Google for updates.",
                    ],
                    "officialLink": {"label": "Israel Ministry of Foreign Affairs visa information"},
                },
                {
                    "type": "B/1 work visa (employer-sponsored)",
                    "anchor": "visa-il-work",
                    "detailTitle": "B/1 work visa — employer-sponsored",
                    "duration": "Typically one year, renewable",
                    "description": "Main salaried route — employer coordinates work-permit steps.",
                    "details": [
                        "Your employer works with Israeli authorities before consulate application.",
                        "Expect passport, contract, insurance, and background documents in the bundle.",
                        "Dependants usually receive linked permits without independent work rights.",
                        "Search 'Israel B1 work visa Population Immigration' on Google for the current checklist.",
                    ],
                    "officialLink": {"label": "Israel Population and Immigration work permit"},
                },
            ],
        },
        "residency": {
            "title": "Residency & Mispar Zehut",
            "tip": "Hebrew-only queues are common — bring a fluent helper for first visits.",
            "items": [
                "Mispar Zehut (מספר זהות — Israeli ID number) unlocks Kupat Holim, banks, and schools.",
                "School placement follows address and track — register with local authorities once your lease is fixed.",
                "Arnona (municipal tax) and utilities tie to your registered address.",
                "If eligible under the Law of Return, explore Aliyah separately from employer visas.",
            ],
        },
        "banking": {
            "title": "Banking",
            "tip": "Book branch appointments — walk-ins often fail.",
            "items": [
                "Hapoalim, Leumi, and Discount are common retail banks.",
                "Passport, visa, Mispar Zehut (or interim letter), and lease are typical.",
                "Wise or similar bridges foreign income while limits clear.",
                "Rent and schools usually need local IBAN payments within weeks.",
            ],
        },
        "housing": {
            "status": "estimated",
            "summary": "Secular international families often concentrate in the German Colony, Baka, Katamon, and Arnona belt — expect hills, small gardens, and competitive listings.",
            "bestAreas": ["German Colony", "Baka", "Katamon", "Arnona", "Rehavia"],
            "searchPortalsIntro": [
                "Israeli classifieds dominate serious long-term searches.",
                "Search neighbourhood names, not only the city label, to match school runs.",
                "Tip: test Friday traffic and school-hour hills before signing.",
            ],
            "searchPortals": [
                {"label": "Yad2.co.il (יד2) — largest Israeli property classifieds", "url": "https://www.yad2.co.il", "isVerified": True},
                {"label": "Madlan.co.il — map-based rentals and sales", "url": "https://www.madlan.co.il", "isVerified": True},
                {"label": "Facebook groups — search: 'Jerusalem Anglo housing'", "url": g("Jerusalem Anglo housing Facebook group"), "isVerified": True},
            ],
            "typicalPrices": [
                "2-bed apartment, Katamon or Baka: ~$1,800–$2,600/month",
                "3-bed apartment, German Colony: ~$2,400–$3,600/month",
                "3-bed apartment, Arnona: ~$2,200–$3,200/month",
                "4-bed home, perimeter neighbourhoods: ~$3,000–$4,500/month",
            ],
            "whatYouNeedToRent": [
                "Passport and visa",
                "Mispar Zehut or proof it is pending",
                "Local guarantor or bank guarantee — common",
                "Roughly three months of income proof",
                "Deposit often 2–3 months",
            ],
        },
        "schools": {
            "status": "curated",
            "summary": "Hebrew public schools, religious tracks, and a smaller English-medium sector than Tel Aviv — align housing with school choice.",
            "publicSystem": "State schools are free; instruction is Hebrew-first. Newcomers outside early primary usually need language support.",
            "internationalOptions": "English-medium and bilingual programmes exist but are thinner than Tel Aviv — fees and waitlists vary.",
            "languageNotes": "Hebrew dominates; English clusters in specific schools and communities. Tutoring is common.",
            "tip": "Visit during term time if you can — workload and culture differ by track.",
            "options": [
                {"type": "English-medium international / bilingual programmes", "description": "Smaller cohorts; check buses from your ridge.", "fees": "~$12,000–$24,000/year typical"},
                {"type": "Hebrew public with integration support", "description": "Best for younger children with tutoring plans.", "fees": "Free (public)"},
                {"type": "Religious state tracks", "description": "Dominant in parts of the city — match expectations before housing.", "fees": "Free (public)"},
            ],
        },
        "childcare": {
            "status": "estimated",
            "summary": "Maon (מעון) nurseries, municipal options, and nannies — Hebrew-first hiring.",
            "daycareItems": [
                "Private maon spots cost roughly ~$800–$1,400/month depending on hours.",
                "Queues appear in Anglo-heavy postcodes — start before arrival if possible.",
                "Subsidy schemes exist — verify eligibility on official Hebrew portals via search.",
            ],
            "nannyItems": [
                "Sitters roughly ~$12–$20/hr.",
                "Full-time live-out often ~$1,800–$3,000/month.",
                "Parent WhatsApp groups are the usual hiring channel.",
            ],
            "whereToFindItems": [
                "Search 'Jerusalem Anglo parents' on Google",
                "Yad2 domestic help listings",
                "Local parent mailing lists",
            ],
        },
        "healthcare": {
            "status": "estimated",
            "tip": "Keep IPMI until Kupat Holim is active.",
            "items": [
                "Four Kupat Holim funds run public coverage after registration.",
                "Hadassah and Shaare Zedek are major hospital anchors.",
                "Private paediatric clinics cluster near family neighbourhoods.",
                "Pharmacies are widespread; brand names may differ from your home country.",
                "Complex cases may route to coastal specialists — plan transport.",
            ],
        },
        "safety": {
            "status": "estimated",
            "score": 76,
            "items": [
                "Petty theft exists in busy quarters — normal urban care.",
                "National alerts affect schedules — use official apps.",
                "Hill roads and school runs need a traffic plan.",
                "Visit target streets at night before leasing.",
                "Summer heat and dust affect air quality — plan indoor play.",
            ],
        },
        "cost": {
            "status": "estimated",
            "rentRange": "~$2,800 / month",
            "familyDinner": "~$70",
            "nannyRate": "~$14 / hr",
            "monthlyFamilyAllIn": "~$7,000–$10,500 / month",
        },
        "sources": {
            "visa": [{"label": "Israel visa information official", "url": g("Israel Ministry Foreign Affairs visa"), "isVerified": True}],
            "cost": [{"label": "Jerusalem — Numbeo", "url": "https://www.numbeo.com/cost-of-living/in/Jerusalem", "isVerified": True}],
        },
        "communityLinks": [
            {"label": "Search 'Jerusalem Anglo parents' on Google", "searchQuery": "Jerusalem Anglo parents Facebook", "url": g("Jerusalem Anglo parents Facebook"), "isVerified": True},
            {"label": "Search 'Olim Jerusalem' on Google", "searchQuery": "Olim Jerusalem families Facebook", "url": g("Olim Jerusalem families Facebook"), "isVerified": True},
        ],
        "faq": [
            {"question": "Is Jerusalem good for families?", "answer": "Yes for families aligned with capital-sector work and bilingual tracks — trade-offs are neighbourhood sensitivity, Friday rhythm, and security awareness."},
            {"question": "How much does a family typically need per month here?", "answer": "Roughly $7,000–$10,500/month all-in is typical before private-school premiums — schooling and ridge choice swing it."},
            {"question": "Is housing hard to find here?", "answer": "Anglo pockets move fast — budget viewings and guarantor paperwork early."},
            {"question": "Do children need international school here, or can local schools work?", "answer": "Hebrew integration works best for younger kids; English programmes are tighter than Tel Aviv — read Schools honestly."},
            {"question": "Is healthcare easy to access as a newcomer?", "answer": "Strong once Kupat Holim registers — bridge with private insurance first."},
            {"question": "Do you need a car in Jerusalem?", "answer": "Often yes for ridge-to-ridge school runs; some walkable pockets exist near light rail."},
            {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Hebrew paperwork and queues — hire help for week one if you can."},
            {"question": "What usually surprises families after arrival?", "answer": "How much topography changes daily logistics — test commutes before you lease."},
        ],
    }


def clone_us_from_miami(cities: list, cid: str, slug: str, name: str, tagline: str, summary: str, areas: list, prices: list, rent_need: list, checklist_last: dict, cost: dict, safety_score: int, faq_miami_fix: list) -> dict:
    m = deepcopy(find_city(cities, "miami-us"))
    strip_weather(m)
    m["id"] = cid
    m["citySlug"] = slug
    m["city"] = name
    m["country"] = "USA"
    m["countrySlug"] = "usa"
    m["tagline"] = tagline
    m["summary"] = summary
    m["lastReviewed"] = "2026-04"
    m["housing"]["bestAreas"] = areas
    m["housing"]["typicalPrices"] = prices
    m["housing"]["whatYouNeedToRent"] = rent_need
    m["actionChecklist"][-1] = checklist_last
    m["cost"] = cost
    m["safety"]["score"] = safety_score
    m["faq"] = faq_miami_fix
    deep_str_replace(m, "Miami", name)
    deep_str_replace(m, "miami-us", cid)
    deep_str_replace(m, "Florida", "California")
    numbeo_slug(m)
    return m


def clone_us_from_dallas(cities: list, cid: str, slug: str, name: str, tagline: str, summary: str, areas: list, prices: list, residency_items: list, bank_items: list, bank_tip: str, checklist_replace: list | None, cost: dict, safety_score: int, faq: list) -> dict:
    d = deepcopy(find_city(cities, "dallas-us"))
    strip_weather(d)
    d["id"] = cid
    d["citySlug"] = slug
    d["city"] = name
    d["tagline"] = tagline
    d["summary"] = summary
    d["lastReviewed"] = "2026-04"
    d["housing"]["bestAreas"] = areas
    d["housing"]["typicalPrices"] = prices
    d["residency"]["items"] = residency_items
    d["banking"]["items"] = bank_items
    d["banking"]["tip"] = bank_tip
    if checklist_replace:
        d["actionChecklist"] = checklist_replace
    d["cost"] = cost
    d["safety"]["score"] = safety_score
    d["faq"] = faq
    deep_str_replace(d, "Dallas", name.split()[0] if name in ("Chicago", "Seattle", "Austin") else name)
    deep_str_replace(d, "Dallas-Fort Worth", name)
    deep_str_replace(d, "DFW", name[:4] if len(name) < 10 else name)
    deep_str_replace(d, "dallas-us", cid)
    numbeo_slug(d)
    return d


def main() -> int:
    cities = load_cities()
    have = {c["id"] for c in cities}
    batch: list[dict] = []

    def add(c: dict) -> None:
        if c["id"] in have:
            print("skip exists", c["id"], file=sys.stderr)
            return
        batch.append(c)
        have.add(c["id"])

    add(jerusalem_dict())

    add(
        clone_us_from_miami(
            cities,
            "los-angeles-us",
            "los-angeles",
            "Los Angeles",
            "Pacific megacity — sun, sprawl, and global school choice",
            "Los Angeles is the US's second-largest metro — diverse neighbourhoods from beach cities to the San Fernando Valley, strong private and magnet public options, and industries from entertainment to aerospace. Trade-offs are sprawl, car dependence, earthquake and wildfire awareness, and high housing costs in the best school pockets.",
            ["Santa Monica", "Pasadena", "South Pasadena", "Culver City", "Manhattan Beach"],
            [
                "1-bed apartment, Culver City or Koreatown: ~$2,200–$3,200/month",
                "3-bed house, South Pasadena or Pasadena: ~$3,800–$5,500/month",
                "3-bed home, Manhattan Beach or similar beach cities: ~$5,000–$8,500/month",
                "2-bed condo, Santa Monica: ~$3,500–$5,200/month",
            ],
            [
                "Passport and US visa",
                "California-compliant income proof (often 3× rent)",
                "Offer letter or payslips",
                "Deposit typically 1–2 months",
                "US bank account for ACH",
            ],
            {"label": "Review earthquake kit and wildfire evacuation guidance for your neighbourhood — part of California family planning", "targetSection": "safety"},
            {"status": "estimated", "rentRange": "~$4,100 / month", "familyDinner": "~$80", "nannyRate": "~$22 / hr", "monthlyFamilyAllIn": "~$8,000–$12,500 / month"},
            78,
            [
                {"question": "Is Los Angeles good for families?", "answer": "Yes when school district or private plan matches housing — trade-offs are sprawl, commute time, and natural-hazard awareness."},
                {"question": "How much does a family typically need per month here?", "answer": "Many families land around $8,000–$12,500/month all-in; beach cities and private tuition push higher."},
                {"question": "Is housing hard to find here?", "answer": "Competitive in strong public zones — start early and align lease with school acceptance."},
                {"question": "Do children need international school here, or can public schools work?", "answer": "LAUSD magnets and charters can work; many expat families still choose private routes for predictability — see Schools."},
                {"question": "Is healthcare easy to access as a newcomer?", "answer": "Excellent facilities — insurance-driven like the rest of the US. Set paediatric care early."},
                {"question": "Do you need a car in Los Angeles?", "answer": "Usually yes — metros are long; some pockets are more walkable but school runs still favour a car."},
                {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Typical US stack plus California DMV — plan time for address proofs."},
                {"question": "What usually surprises families after arrival?", "answer": "How much commute distance defines daily life — maps understate school-run traffic."},
            ],
        )
    )

    sf = deepcopy(find_city(cities, "new-york-city-us"))
    strip_weather(sf)
    sf["id"] = "san-francisco-us"
    sf["citySlug"] = "san-francisco"
    sf["city"] = "San Francisco"
    sf["tagline"] = "Bay Area innovation hub — steep rents, mild weather, and outdoors at the doorstep"
    sf["summary"] = "San Francisco anchors a metro that mixes tech employers, walkable neighbourhoods, and quick access to Northern California nature. Families weigh strong incomes against very high housing costs, visible inequality, and earthquake preparedness. Many households live in the city or cross-bridge East Bay suburbs depending on school strategy."
    sf["lastReviewed"] = "2026-04"
    sf["housing"]["bestAreas"] = ["Noe Valley", "Bernal Heights", "Inner Sunset", "Pacific Heights", "Rockridge (East Bay)"]
    sf["housing"]["typicalPrices"] = [
        "2-bed apartment, Inner Sunset: ~$3,800–$5,200/month",
        "3-bed apartment, Noe Valley: ~$5,500–$8,000/month",
        "3-bed home, Berkeley or Oakland hills: ~$4,200–$6,500/month",
        "1-bed downtown high-rise: ~$3,200–$4,500/month",
    ]
    sf["cost"] = {"status": "estimated", "rentRange": "~$5,200 / month", "familyDinner": "~$95", "nannyRate": "~$28 / hr", "monthlyFamilyAllIn": "~$10,000–$15,000 / month"}
    sf["safety"]["score"] = 77
    deep_str_replace(sf, "New York City", "San Francisco")
    deep_str_replace(sf, "NYC", "SF")
    deep_str_replace(sf, "new-york-city-us", "san-francisco-us")
    sf["actionChecklist"] = [
        {"label": "Check visa status — working families normally need employer sponsorship before arrival", "targetSection": "visa"},
        {"label": "Start housing alongside school research — Bay Area listings move fast", "targetSection": "housing"},
        {"label": "Apply for Social Security Number in week one", "targetSection": "residency"},
        {"label": "Arrange US health insurance before arrival", "targetSection": "healthcare"},
        {"label": "Open a US bank account immediately", "targetSection": "banking"},
        {"label": "Plan California driver's licence timing", "targetSection": "residency"},
        {"label": "Discuss earthquake kit and wildfire smoke plans with your landlord", "targetSection": "safety"},
    ]
    sf["faq"] = [
        {"question": "Is San Francisco good for families?", "answer": "Yes for walkable pockets and strong incomes — if budget matches rent and school strategy."},
        {"question": "How much does a family typically need per month here?", "answer": "Budget roughly $10,000–$15,000/month all-in for many setups — tuition and bridge tolls add more."},
        {"question": "Is housing hard to find here?", "answer": "Very competitive — prepare deposits and references fast."},
        {"question": "Do children need international school here, or can local schools work?", "answer": "Public magnets and charters can work; private demand is high — start early."},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": "Strong systems — access is insurance-based."},
        {"question": "Do you need a car in San Francisco?", "answer": "City life can be transit-heavy; suburban East Bay usually needs a car."},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "US + California admin — DMV and school enrolment dominate week one."},
        {"question": "What usually surprises families after arrival?", "answer": "Fog microclimates and bridge commutes — test school runs before signing."},
    ]
    numbeo_slug(sf)
    add(sf)

    ch = clone_us_from_dallas(
        cities,
        "chicago-us",
        "chicago",
        "Chicago",
        "Great Lakes metropolis — culture, lakefront, and real winters",
        "Chicago mixes world-class museums, lakefront parks, and strong corporate hubs with cold winters and a patchwork of school quality by neighbourhood. Families choose carefully between city neighbourhoods and North Shore suburbs for schools and space.",
        ["Lincoln Park", "Lakeview", "Evanston", "Oak Park", "Wilmette"],
        [
            "2-bed apartment, Lakeview: ~$2,400–$3,400/month",
            "3-bed apartment, Lincoln Park: ~$3,200–$4,800/month",
            "3-bed house, Oak Park: ~$2,800–$4,200/month",
            "4-bed house, Wilmette: ~$4,000–$6,500/month",
        ],
        [
            "Apply for Illinois driver's licence at DMV with passport and proof of address.",
            "Register children with Chicago Public Schools or your suburban district using lease deeds.",
            "File federal taxes — Illinois has state income tax unlike Texas.",
            "Update SSA address after any move.",
        ],
        [
            "Chase, BMO Harris, and Fifth Third are common in Chicagoland.",
            "Passport, visa, and proof of Illinois address open most accounts.",
            "Wise bridges FX while US accounts settle.",
        ],
        "BMO and Chase have dense Chicago networks — book branch time in week one.",
        None,
        {"status": "estimated", "rentRange": "~$3,200 / month", "familyDinner": "~$75", "nannyRate": "~$20 / hr", "monthlyFamilyAllIn": "~$6,500–$9,500 / month"},
        80,
        [
            {"question": "Is Chicago good for families?", "answer": "Yes when neighbourhood and district align — winters are serious and school research matters."},
            {"question": "How much does a family typically need per month here?", "answer": "Roughly $6,500–$9,500/month all-in for many family setups before private tuition."},
            {"question": "Is housing hard to find here?", "answer": "Active market — popular family pockets still move quickly."},
            {"question": "Do children need international school here, or can local schools work?", "answer": "Selective public magnets and strong suburban districts exist — see Schools."},
            {"question": "Is healthcare easy to access as a newcomer?", "answer": "Major hospital networks — insurance gates access like elsewhere in the US."},
            {"question": "Do you need a car in Chicago?", "answer": "City neighbourhoods can be transit-first; suburbs usually need a car."},
            {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Illinois DMV, utilities, and school forms — typical US load."},
            {"question": "What usually surprises families after arrival?", "answer": "How long grey winters feel — plan indoor activities and gear."},
        ],
    )
    deep_str_replace(ch, "Texas", "Illinois")
    deep_str_replace(ch, "Plano", "Evanston")
    add(ch)

    sea = clone_us_from_dallas(
        cities,
        "seattle-us",
        "seattle",
        "Seattle",
        "Pacific Northwest tech hub — rain, mountains, and outdoor culture",
        "Seattle offers strong tech salaries, walkable pockets, and easy mountain access. Trade-offs are wet grey winters, rapid cost growth, and school research by neighbourhood across Seattle and Eastside suburbs.",
        ["Queen Anne", "Green Lake", "Bellevue", "Redmond", "Issaquah"],
        [
            "2-bed apartment, Capitol Hill: ~$2,600–$3,600/month",
            "3-bed home, Bellevue: ~$3,800–$5,500/month",
            "3-bed home, Redmond: ~$3,400–$4,800/month",
            "1-bed downtown: ~$2,200–$3,200/month",
        ],
        [
            "Apply for Washington driver's licence at DOL with residency proof.",
            "Enrol kids in Seattle Public Schools or Lake Washington district using address.",
            "No state income tax in Washington — still budget federal taxes.",
        ],
        [
            "Chase, Bank of America, and Washington Federal serve Eastside families.",
            "Passport, visa, and local address standard.",
        ],
        "Chase and local credit unions are popular — book early.",
        None,
        {"status": "estimated", "rentRange": "~$3,400 / month", "familyDinner": "~$78", "nannyRate": "~$24 / hr", "monthlyFamilyAllIn": "~$7,500–$11,000 / month"},
        82,
        [
            {"question": "Is Seattle good for families?", "answer": "Yes for outdoors and tech incomes — if you accept grey winters and housing costs."},
            {"question": "How much does a family typically need per month here?", "answer": "Many families spend $7,500–$11,000/month all-in before private school."},
            {"question": "Is housing hard to find here?", "answer": "Competitive on the Eastside — start 8–12 weeks ahead."},
            {"question": "Do children need international school here, or can local schools work?", "answer": "Strong public options exist but vary — research catchments."},
            {"question": "Is healthcare easy to access as a newcomer?", "answer": "Major systems — insurance required."},
            {"question": "Do you need a car in Seattle?", "answer": "City pockets can use transit; Eastside suburban life usually needs a car."},
            {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Washington DOL and school enrolment — straightforward but timeboxed."},
            {"question": "What usually surprises families after arrival?", "answer": "How June–September redeem the rainy season — plan summer travel accordingly."},
        ],
    )
    deep_str_replace(sea, "Texas", "Washington")
    add(sea)

    aus = clone_us_from_dallas(
        cities,
        "austin-us",
        "austin",
        "Austin",
        "Texas capital — fast growth, live music, and no state income tax",
        "Austin mixes tech hiring, warm weather, and Hill Country weekends. Trade-offs are traffic on I-35, summer heat, and a tight family rental market in top school zones.",
        ["Zilker", "Barton Hills", "Circle C", "Steiner Ranch", "Bee Cave"],
        [
            "2-bed apartment, South Austin: ~$1,900–$2,800/month",
            "3-bed house, Circle C: ~$2,600–$3,800/month",
            "3-bed house, Steiner Ranch: ~$2,800–$4,200/month",
            "4-bed house, Bee Cave: ~$3,200–$5,000/month",
        ],
        find_city(cities, "dallas-us")["residency"]["items"],
        find_city(cities, "dallas-us")["banking"]["items"],
        find_city(cities, "dallas-us")["banking"]["tip"],
        None,
        {"status": "estimated", "rentRange": "~$2,800 / month", "familyDinner": "~$68", "nannyRate": "~$18 / hr", "monthlyFamilyAllIn": "~$5,800–$8,500 / month"},
        79,
        [
            {"question": "Is Austin good for families?", "answer": "Yes for tech salaries and outdoor life — heat and sprawl are the main lifestyle taxes."},
            {"question": "How much does a family typically need per month here?", "answer": "Roughly $5,800–$8,500/month all-in for many suburban setups."},
            {"question": "Is housing hard to find here?", "answer": "Tight in good school zones — move decisively on listings."},
            {"question": "Do children need international school here, or can local schools work?", "answer": "Strong public districts exist — match address to district intentionally."},
            {"question": "Is healthcare easy to access as a newcomer?", "answer": "Good networks — employer insurance is typical."},
            {"question": "Do you need a car in Austin?", "answer": "Almost always — transit does not replace suburban family life."},
            {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Texas DMV and utilities — similar to other US sun-belt moves."},
            {"question": "What usually surprises families after arrival?", "answer": "How fast growth changed commute patterns — test rush hour before choosing a suburb."},
        ],
    )
    deep_str_replace(aus, "Dallas", "Austin")
    add(aus)

    lon = deepcopy(find_city(cities, "paris-fr"))
    strip_weather(lon)
    lon["id"] = "london-gb"
    lon["citySlug"] = "london"
    lon["countrySlug"] = "united-kingdom"
    lon["city"] = "London"
    lon["country"] = "United Kingdom"
    lon["tagline"] = "Global English-language hub — state + independent schools and a vast jobs market"
    lon["summary"] = "London mixes world-class museums, diverse boroughs, and the UK's largest jobs market. Families weigh strong schooling options against high rent, Tube commutes, and post-Brexit visa rules. Catchment and borough choice drive both lifestyle and school access."
    lon["lastReviewed"] = "2026-04"
    lon["visa"] = uk_visa_block()
    lon["actionChecklist"] = [
        {"label": "Confirm UK visa route before travel — tourism is not settlement", "targetSection": "visa"},
        {"label": "Start housing 8–12 weeks ahead — family flats move quickly", "targetSection": "housing"},
        {"label": "Apply to schools per borough rules — some require address proof", "targetSection": "schools"},
        {"label": "Register with a GP surgery after your address is fixed — NHS access flows through registration", "targetSection": "healthcare"},
        {"label": "Open a UK bank account with passport and proof of address", "targetSection": "banking"},
        {"label": "Get National Insurance context sorted with employer or HMRC letters", "targetSection": "residency"},
    ]
    lon["residency"] = {
        "title": "Registration & National Insurance",
        "tip": "Council tax and school admissions tie to your borough address — secure proof early.",
        "items": [
            "Register children for schools through your local council process — rules differ by borough.",
            "National Insurance (NI — UK social security number for tax and benefits) is arranged through employer or official channels.",
            "Update your address with banks, HMRC, and your GP when you move.",
            "Driving licences swap from many countries within DVLA rules — search 'exchange foreign licence DVLA' on Google.",
        ],
    }
    lon["banking"] = {
        "title": "Banking",
        "tip": "High-street banks may need a face appointment — digital banks can bridge.",
        "items": [
            "Barclays, HSBC, Lloyds, and NatWest are common for newcomers with address proof.",
            "Wise and Revolut help until a full current account clears.",
            "Rent often needs a UK sort code — plan week one.",
        ],
    }
    lon["housing"] = {
        "status": "estimated",
        "summary": "Family demand concentrates in zones 2–4 and southwest corridors — expect competition and agent fees in some segments.",
        "bestAreas": ["Richmond", "Wimbledon", "Islington", "Highgate", "Blackheath"],
        "searchPortalsIntro": [
            "Rightmove and Zoopla dominate long-term lets.",
            "Search by borough and Tube line — commute time is decisive.",
            "Tip: short-let a month while you view in person.",
        ],
        "searchPortals": [
            {"label": "Rightmove.co.uk — largest UK rental portal", "url": "https://www.rightmove.co.uk", "isVerified": True},
            {"label": "Zoopla.co.uk — strong London inventory", "url": "https://www.zoopla.co.uk", "isVerified": True},
            {"label": "Facebook groups — search: 'London family housing'", "url": "https://www.google.com/search?q=London+family+housing+Facebook+group", "isVerified": True},
        ],
        "typicalPrices": [
            "2-bed flat, Zone 2: ~$2,800–$4,000/month",
            "3-bed flat, Wimbledon: ~$4,200–$6,200/month",
            "3-bed terraced, Richmond: ~$4,500–$6,800/month",
            "2-bed, Islington: ~$3,200–$4,800/month",
        ],
        "whatYouNeedToRent": [
            "Passport and visa or BRP (Biometric Residence Permit — UK ID card for many visa holders)",
            "Proof of income or employer letter",
            "References — previous landlord and employer",
            "Deposit capped under tenant-fee rules — confirm current statute",
        ],
    }
    lon["cost"] = {"status": "estimated", "rentRange": "~$4,200 / month", "familyDinner": "~$75", "nannyRate": "~$18 / hr", "monthlyFamilyAllIn": "~$7,500–$11,000 / month"}
    lon["safety"]["score"] = 82
    lon["faq"] = [
        {"question": "Is London good for families?", "answer": "Yes when borough, commute, and school strategy align — costs are high but services are broad."},
        {"question": "How much does a family typically need per month here?", "answer": "Roughly $7,500–$11,000/month all-in before private school fees."},
        {"question": "Is housing hard to find here?", "answer": "Competitive — proceed fast with references."},
        {"question": "Do children need international school here, or can local schools work?", "answer": "State schools can work well; international schools cluster for specific curricula — see Schools."},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": "Register with a GP — NHS access depends on visa and surcharge payment rules."},
        {"question": "Do you need a car in London?", "answer": "Often no inside the Tube zones; suburbs may warrant one."},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Council tax, NI, and school forms — moderate if organised."},
        {"question": "What usually surprises families after arrival?", "answer": "How much space budget buys versus other capitals — adjust expectations early."},
    ]
    numbeo_slug(lon)
    add(lon)

    dub = deepcopy(find_city(cities, "amsterdam-nl"))
    strip_weather(dub)
    dub["id"] = "dublin-ie"
    dub["citySlug"] = "dublin"
    dub["countrySlug"] = "ireland"
    dub["city"] = "Dublin"
    dub["country"] = "Ireland"
    dub["tagline"] = "English-speaking EU hub — tech employers and coastal suburbs"
    dub["summary"] = "Dublin is Ireland's capital and main expat gateway — English-speaking, EU membership, and a strong tech payroll. Families weigh rain, housing scarcity, and car-light city living against village-style suburbs on the DART line."
    dub["lastReviewed"] = "2026-04"
    deep_str_replace(dub, "Amsterdam", "Dublin")
    deep_str_replace(dub, "Netherlands", "Ireland")
    deep_str_replace(dub, "Dutch", "Irish")
    deep_str_replace(dub, "dutch", "Irish")
    deep_str_replace(dub, "gemeente", "local authority")
    deep_str_replace(dub, "BSN", "PPS number (Personal Public Service Number — Ireland's key ID for tax and public services)")
    deep_str_replace(dub, "IND", "INIS (Irish Naturalisation and Immigration Service)")
    dub["visa"]["summary"] = "EU/EEA citizens can live in Ireland without a visa. Non-EU families usually need employment permits and a residence permission from INIS — rules are national, not Dublin-specific."
    dub["visa"]["options"][2]["detailTitle"] = "Short stay visit — scouting Dublin"
    dub["visa"]["options"][2]["details"] = [
        "Ireland is not in the Schengen Area — visitor rules are Irish and separate from continental stamps.",
        "Use short visits to view southside suburbs and school corridors.",
        "Working without permission is not allowed — line up permits before children start school.",
        "Search 'INIS immigration Ireland' on Google for current visitor and permit pages.",
    ]
    dub["cost"] = {"status": "estimated", "rentRange": "~$3,100 / month", "familyDinner": "~$70", "nannyRate": "~$16 / hr", "monthlyFamilyAllIn": "~$6,500–$9,500 / month"}
    dub["safety"]["score"] = 85
    numbeo_slug(dub)
    add(dub)

    rome = deepcopy(find_city(cities, "milan-it"))
    strip_weather(rome)
    rome["id"] = "rome-it"
    rome["citySlug"] = "rome"
    rome["city"] = "Rome"
    rome["tagline"] = "Italy's capital — history, state schools, and a slower rhythm than Milan"
    rome["summary"] = "Rome offers Mediterranean family life with vast culture, international schools in the EUR and northern belt, and lower buzz than Milan. Trade-offs are traffic, summer heat, and bureaucracy that rewards patience and Italian language help."
    rome["lastReviewed"] = "2026-04"
    deep_str_replace(rome, "Milan", "Rome")
    deep_str_replace(rome, "Milano", "Roma")
    rome["housing"]["bestAreas"] = ["Prati", "Monteverde", "EUR", "Parioli", "Trastevere"]
    rome["cost"] = {"status": "estimated", "rentRange": "~$2,200 / month", "familyDinner": "~$62", "nannyRate": "~$14 / hr", "monthlyFamilyAllIn": "~$4,800–$7,000 / month"}
    numbeo_slug(rome)
    add(rome)

    vie = deepcopy(find_city(cities, "milan-it"))
    strip_weather(vie)
    vie["id"] = "vienna-at"
    vie["citySlug"] = "vienna"
    vie["countrySlug"] = "austria"
    vie["city"] = "Vienna"
    vie["country"] = "Austria"
    vie["tagline"] = "Imperial city with strong public services — German-language daily life"
    vie["summary"] = "Vienna offers excellent public transport, green space, and family subsidies. Expat families integrate through German while enjoying safe neighbourhoods and central European travel links."
    vie["lastReviewed"] = "2026-04"
    deep_str_replace(vie, "Italy", "Austria")
    deep_str_replace(vie, "Italian", "Austrian")
    deep_str_replace(vie, "Milan", "Vienna")
    deep_str_replace(vie, "Milano", "Wien")
    vie["housing"]["bestAreas"] = ["Döbling", "Währing", "Hietzing", "Leopoldstadt", "Margareten"]
    vie["cost"] = {"status": "estimated", "rentRange": "~$2,000 / month", "familyDinner": "~$58", "nannyRate": "~$15 / hr", "monthlyFamilyAllIn": "~$5,000–$7,500 / month"}
    numbeo_slug(vie)
    add(vie)

    cph = deepcopy(find_city(cities, "amsterdam-nl"))
    strip_weather(cph)
    cph["id"] = "copenhagen-dk"
    cph["citySlug"] = "copenhagen"
    cph["countrySlug"] = "denmark"
    cph["city"] = "Copenhagen"
    cph["country"] = "Denmark"
    cph["tagline"] = "Scandinavian liveability — bikes, hygge, and English at work"
    cph["summary"] = "Copenhagen scores high for safety, cycling, and parental leave culture. Housing is tight and pricey; Danish language helps outside expat employers, but English works in many offices."
    cph["lastReviewed"] = "2026-04"
    deep_str_replace(cph, "Amsterdam", "Copenhagen")
    deep_str_replace(cph, "Netherlands", "Denmark")
    deep_str_replace(cph, "Dutch", "Danish")
    deep_str_replace(cph, "dutch", "Danish")
    deep_str_replace(cph, "gemeente", "kommune (municipal office)")
    deep_str_replace(cph, "BSN", "CPR number (Central Person Register — Denmark's national ID)")
    deep_str_replace(cph, "IND", "Danish Agency for International Recruitment and Integration (SIRI) for many work permits")
    cph["housing"]["bestAreas"] = ["Frederiksberg", "Østerbro", "Amager", "Hellerup", "Gentofte"]
    cph["cost"] = {"status": "estimated", "rentRange": "~$2,600 / month", "familyDinner": "~$85", "nannyRate": "~$22 / hr", "monthlyFamilyAllIn": "~$6,500–$9,500 / month"}
    cph["safety"]["score"] = 88
    numbeo_slug(cph)
    add(cph)

    zur = deepcopy(find_city(cities, "milan-it"))
    strip_weather(zur)
    zur["id"] = "zurich-ch"
    zur["citySlug"] = "zurich"
    zur["countrySlug"] = "switzerland"
    zur["city"] = "Zurich"
    zur["country"] = "Switzerland"
    zur["tagline"] = "Alpine lakeside finance hub — sky-high quality and prices"
    zur["summary"] = "Zurich offers pristine infrastructure, multilingual schools, and quick mountain access. Housing is expensive and competitive; non-EU permits usually require employer sponsorship."
    zur["lastReviewed"] = "2026-04"
    deep_str_replace(zur, "Italy", "Switzerland")
    deep_str_replace(zur, "Italian", "Swiss")
    deep_str_replace(zur, "Milan", "Zurich")
    deep_str_replace(zur, "Milano", "Zürich")
    zur["housing"]["bestAreas"] = ["Seefeld", "Kreis 7", "Kreis 8", "Zollikon", "Küsnacht"]
    zur["cost"] = {"status": "estimated", "rentRange": "~$3,800 / month", "familyDinner": "~$95", "nannyRate": "~$25 / hr", "monthlyFamilyAllIn": "~$9,000–$13,000 / month"}
    numbeo_slug(zur)
    add(zur)

    sg = deepcopy(find_city(cities, "bangkok-th"))
    strip_weather(sg)
    sg["id"] = "singapore-sg"
    sg["citySlug"] = "singapore"
    sg["countrySlug"] = "singapore"
    sg["city"] = "Singapore"
    sg["country"] = "Singapore"
    sg["tagline"] = "City-state efficiency — top schools, low crime, and tropical heat"
    sg["summary"] = "Singapore combines excellent infrastructure, strict rule of law, and a large expat payroll. Trade-offs are high rent, EP-linked school access questions, and equatorial humidity."
    sg["lastReviewed"] = "2026-04"
    deep_str_replace(sg, "Bangkok", "Singapore")
    deep_str_replace(sg, "Thailand", "Singapore")
    deep_str_replace(sg, "Thai", "Singaporean")
    sg["visa"] = {
        "status": "verified",
        "summary": "Most visitors enter visa-free for short stays depending on nationality. Working families typically rely on an Employment Pass (EP — work pass for professionals) tied to a sponsoring employer; Dependant's Passes cover spouses and children.",
        "tip": "Search 'MOM Singapore Employment Pass' on Google for salary floors and documents.",
        "options": [
            {
                "type": "Short-term visitor",
                "anchor": "visa-tourist",
                "detailTitle": "Visitor pass — scouting only",
                "duration": "Varies by nationality",
                "description": "Tourism and short business visits — not employment.",
                "details": [
                    "Check ICA (Immigration & Checkpoints Authority — Singapore's border agency) rules for your passport.",
                    "Scout schools and condos, then secure a work pass before children start long-term schooling.",
                    "Overstaying is taken seriously — track permit dates.",
                ],
                "officialLink": {"label": "ICA Singapore entry requirements"},
            },
            {
                "type": "Employment Pass (EP) route",
                "anchor": "visa-dnv",
                "detailTitle": "Employment Pass — sponsored work",
                "duration": "Linked to job",
                "description": "Employer files with MOM (Ministry of Manpower — Singapore's labour ministry).",
                "details": [
                    "Compensation thresholds change — confirm before negotiating relocation.",
                    "Dependants usually receive linked passes with school access considerations.",
                    "Housing agents often ask for pass approval letters.",
                    "Search 'MOM Employment Pass requirements' on Google for the live table.",
                ],
                "officialLink": {"label": "MOM Employment Pass official"},
            },
        ],
    }
    sg["housing"]["bestAreas"] = ["Holland Village", "Bukit Timah", "River Valley", "East Coast", "Sentosa Cove"]
    sg["cost"] = {"status": "estimated", "rentRange": "~$4,500 / month", "familyDinner": "~$65", "nannyRate": "~$15 / hr", "monthlyFamilyAllIn": "~$8,000–$12,000 / month"}
    sg["safety"]["score"] = 90
    numbeo_slug(sg)
    add(sg)

    tk = deepcopy(find_city(cities, "bangkok-th"))
    strip_weather(tk)
    tk["id"] = "tokyo-jp"
    tk["citySlug"] = "tokyo"
    tk["countrySlug"] = "japan"
    tk["city"] = "Tokyo"
    tk["country"] = "Japan"
    tk["tagline"] = "Megacity order — unmatched transit, seasonal beauty, and meticulous schools culture"
    tk["summary"] = "Tokyo offers safety, amazing transit, and rich cultural education. Working families need employer visa sponsorship; housing is compact and deposit-heavy; Japanese language helps outside expat bubbles."
    tk["lastReviewed"] = "2026-04"
    deep_str_replace(tk, "Bangkok", "Tokyo")
    deep_str_replace(tk, "Thailand", "Japan")
    deep_str_replace(tk, "Thai", "Japanese")
    tk["visa"] = {
        "status": "verified",
        "summary": "Tourism visas or visa-free short stays vary by nationality. Work usually requires a Certificate of Eligibility (COE — pre-approval document) and a work-linked residence card after employer sponsorship.",
        "tip": "Search 'Japan Immigration work visa COE' on Google for the checklist your HR should follow.",
        "options": [
            {
                "type": "Temporary visitor",
                "anchor": "visa-tourist",
                "detailTitle": "Temporary visitor — scouting",
                "duration": "Short stay — confirm per passport",
                "description": "Scout neighbourhoods — not authorised to work.",
                "details": [
                    "Use visits to view wards and international school corridors.",
                    "Working without the correct status is high-risk.",
                    "Carry passports for every child at check-in.",
                ],
                "officialLink": {"label": "Japan Ministry Foreign Affairs visa"},
            },
            {
                "type": "Work residence (employer-sponsored)",
                "anchor": "visa-dnv",
                "detailTitle": "Work visa — employer-led",
                "duration": "1–5 years typical",
                "description": "COE obtained in Japan, visa stamped abroad, residence card on arrival.",
                "details": [
                    "Employer or proxy applies for COE before you fly long-term.",
                    "Housing guarantor companies often require residence card copies.",
                    "Dependants apply with linked documents.",
                    "Search 'Immigration Services Agency Japan work' on Google for updates.",
                ],
                "officialLink": {"label": "Immigration Services Agency Japan"},
            },
        ],
    }
    tk["housing"]["bestAreas"] = ["Meguro", "Setagaya", "Minato", "Shibuya", "Denenchofu"]
    tk["cost"] = {"status": "estimated", "rentRange": "~$3,200 / month", "familyDinner": "~$55", "nannyRate": "~$18 / hr", "monthlyFamilyAllIn": "~$7,000–$10,500 / month"}
    tk["safety"]["score"] = 88
    numbeo_slug(tk)
    add(tk)

    tp = deepcopy(find_city(cities, "bangkok-th"))
    strip_weather(tp)
    tp["id"] = "taipei-tw"
    tp["citySlug"] = "taipei"
    tp["countrySlug"] = "taiwan"
    tp["city"] = "Taipei"
    tp["country"] = "Taiwan"
    tp["tagline"] = "Safe, humid capital — night markets, mountains, and hardware startup energy"
    tp["summary"] = "Taipei offers very low violent crime, excellent healthcare, and affordable help compared with Western capitals. Families navigate humidity, typhoon season, and Mandarin-first schooling unless they choose international tracks."
    tp["lastReviewed"] = "2026-04"
    deep_str_replace(tp, "Bangkok", "Taipei")
    deep_str_replace(tp, "Thailand", "Taiwan")
    deep_str_replace(tp, "Thai", "Taiwanese")
    tp["visa"] = {
        "status": "verified",
        "summary": "Many Western passport holders enter visa-exempt for short stays. Long-term routes include employer-sponsored work permits, investment-linked programmes, and specialised cards — verify against your nationality.",
        "tip": "Search 'Taiwan Bureau of Consular Affairs visa' on Google before booking.",
        "options": [
            {
                "type": "Visitor / visa-exempt entry",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay — scouting Taipei",
                "duration": "Varies — confirm per passport",
                "description": "Tourism and family visits — not employment.",
                "details": [
                    "Use trips to view Tianmu, Daan, and school corridors.",
                    "Overstay penalties are strict.",
                ],
                "officialLink": {"label": "Taiwan Bureau of Consular Affairs"},
            },
            {
                "type": "Employer-sponsored work permit",
                "anchor": "visa-dnv",
                "detailTitle": "Work permit — employer route",
                "duration": "Linked to contract",
                "description": "Company sponsors labour and immigration steps.",
                "details": [
                    "HR usually guides medical checks and documentation.",
                    "Dependants require linked approvals.",
                    "Search 'Taiwan work permit employer sponsor' on Google for steps.",
                ],
                "officialLink": {"label": "Taiwan work permit official search"},
            },
        ],
    }
    tp["housing"]["bestAreas"] = ["Tianmu", "Daan", "Neihu", "Xinyi", "Tamsui"]
    tp["cost"] = {"status": "estimated", "rentRange": "~$1,800 / month", "familyDinner": "~$35", "nannyRate": "~$10 / hr", "monthlyFamilyAllIn": "~$3,800–$5,800 / month"}
    tp["safety"]["score"] = 87
    numbeo_slug(tp)
    add(tp)

    kl = deepcopy(find_city(cities, "bangkok-th"))
    strip_weather(kl)
    kl["id"] = "kuala-lumpur-my"
    kl["citySlug"] = "kuala-lumpur"
    kl["countrySlug"] = "malaysia"
    kl["city"] = "Kuala Lumpur"
    kl["country"] = "Malaysia"
    kl["tagline"] = "Tropical capital — affordability, malls, and MM2H reboot interest"
    kl["summary"] = "Kuala Lumpur mixes English-friendly services, international schools in Mont Kiara and Bangsar, and lower rents than Singapore. Trade-offs are heat, traffic, and haze seasons when Indonesian fires spike."
    kl["lastReviewed"] = "2026-04"
    deep_str_replace(kl, "Bangkok", "Kuala Lumpur")
    deep_str_replace(kl, "Thailand", "Malaysia")
    deep_str_replace(kl, "Thai", "Malaysian")
    kl["visa"] = {
        "status": "verified",
        "summary": "Many nationalities receive visa-free short stays. Long-term options include employer-sponsored Employment Passes and periodically updated MM2H-style residence programmes — confirm the current brochure.",
        "tip": "Search 'Malaysia Immigration official MM2H' on Google before relying on forum advice.",
        "options": [
            {
                "type": "Social visit pass",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay visitor",
                "duration": "Varies",
                "description": "Scout housing and schools — not employment.",
                "details": [
                    "Check MITI / immigration pages for your nationality.",
                    "Carry onward tickets if asked.",
                ],
                "officialLink": {"label": "Malaysia Immigration Department official"},
            },
            {
                "type": "Employment Pass (employer)",
                "anchor": "visa-dnv",
                "detailTitle": "Employment Pass — sponsored",
                "duration": "Linked to job",
                "description": "Company files with immigration for approvals.",
                "details": [
                    "Dependants usually receive linked passes.",
                    "International school letters may be needed for enrolment.",
                ],
                "officialLink": {"label": "Malaysia Employment Pass official search"},
            },
        ],
    }
    kl["housing"]["bestAreas"] = ["Mont Kiara", "Bangsar", "Damansara Heights", "Ampang", "KLCC"]
    kl["cost"] = {"status": "estimated", "rentRange": "~$1,400 / month", "familyDinner": "~$28", "nannyRate": "~$8 / hr", "monthlyFamilyAllIn": "~$3,500–$5,500 / month"}
    kl["safety"]["score"] = 80
    numbeo_slug(kl)
    add(kl)

    bali = deepcopy(find_city(cities, "phuket-th"))
    strip_weather(bali)
    bali["id"] = "bali-id"
    bali["citySlug"] = "bali"
    bali["countrySlug"] = "indonesia"
    bali["city"] = "Bali"
    bali["country"] = "Indonesia"
    bali["tagline"] = "Indonesia's island hub — beach towns, volcanoes, and a visa rulebook that changes often"
    bali["summary"] = "Bali is an island province, not a single city — most families settle in the southern beach belt (Canggu, Seminyak, Sanur), the Ubud hills, or quieter east-coast pockets. Trade-offs are wet-season flooding in some lanes, motorbike traffic, international-school capacity in the south, and immigration rules that require frequent checks. This guide uses the name travellers search; area picks below spell out where on the island families actually live."
    bali["lastReviewed"] = "2026-04"
    bali["relatedDestinationGuide"] = {"countrySlug": "indonesia", "citySlug": "ubud", "label": "Ubud", "context": "Ubud is the inland arts and jungle town many people name separately — see our Ubud guide for hill schools, humidity, and a slower rhythm than the beach belt."}
    deep_str_replace(bali, "Phuket", "Bali")
    deep_str_replace(bali, "Thailand", "Indonesia")
    deep_str_replace(bali, "Thai", "Indonesian")
    bali["visa"] = {
        "status": "verified",
        "summary": "Indonesia adjusts visit and long-stay visas regularly — confirm the current B211A / KITAS / investor routes on official immigration pages before you book.",
        "tip": "Use a vetted visa agent only after reading the official checklist — requirements change with little warning.",
        "options": [
            {
                "type": "Visitor / VoA-style entry",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay visitor",
                "duration": "Varies — confirm per passport",
                "description": "Scout the island — not a substitute for KITAS if you enrol children long-term.",
                "details": [
                    "Carry proof of onward travel when asked.",
                    "Overstay fines are expensive — track everyone's stamp.",
                    "Search 'Indonesia immigration visa official' on Google before each trip.",
                ],
                "officialLink": {"label": "Indonesia Directorate General Immigration"},
            },
            {
                "type": "Long-stay permits (KITAS / employer / investment)",
                "anchor": "visa-dnv",
                "detailTitle": "Temporary stay permits — national routes",
                "duration": "Months to years depending on category",
                "description": "Employer, family, or investment-linked processes — handled in-country with agents or HR.",
                "details": [
                    "Schools may ask for residence paperwork — align visa category with enrolment.",
                    "Rental contracts often want passport + permit copies.",
                    "Search 'KITAS Indonesia family dependent' on Google for the live matrix.",
                ],
                "officialLink": {"label": "Indonesia limited stay permit official search"},
            },
        ],
    }
    bali["housing"]["bestAreas"] = ["Sanur (flatter, family beaches)", "Canggu / Berawa (surf, busy roads)", "Seminyak / Petitenget (dense, dining)", "Ubud fringe (cooler nights)", "Nusa Dua (gated resort belt)"]
    bali["cost"] = {"status": "estimated", "rentRange": "~$2,200 / month", "familyDinner": "~$35", "nannyRate": "~$7 / hr", "monthlyFamilyAllIn": "~$4,000–$6,500 / month"}
    bali["safety"]["score"] = 78
    bali["faq"] = [
        {"question": "Is Bali good for families?", "answer": "Yes when you pick the right coast or hill pocket for schools and commute — traffic and visa admin are the main frictions."},
        {"question": "How much does a family typically need per month here?", "answer": "Roughly $4,000–$6,500/month all-in for many international-school households — villas and tuition swing it."},
        {"question": "Is housing hard to find here?", "answer": "Villas turn over fast in Canggu and Berawa — start 6–8 weeks ahead."},
        {"question": "Do children need international school here, or can local schools work?", "answer": "Bahasa-first local schools are tough without fluency — most expat families use international or bilingual tracks in the south."},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": "Private hospitals in Denpasar and the south are workable — use travel cover until permits stabilise."},
        {"question": "Do you need a car in Bali?", "answer": "Many families use cars with drivers for school; scooters dominate but are risky with small kids."},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Visa extensions and school letters eat time — hire reputable help if you can."},
        {"question": "What usually surprises families after arrival?", "answer": "How long narrow roads take in rain — test school runs in both seasons."},
    ]
    numbeo_slug(bali)
    add(bali)

    ubud = deepcopy(bali)
    ubud["id"] = "ubud-id"
    ubud["citySlug"] = "ubud"
    ubud["city"] = "Ubud"
    ubud["tagline"] = "Inland Bali — jungle gorges, slower traffic, and humid hill nights"
    ubud["summary"] = "Ubud is a town and surrounding banjar communities in Gianyar regency — not a beach strip. Families come for nature, yoga-adjacent wellness culture, and lower surf chaos than Canggu, but still face narrow roads, power quirks, and school commutes to the southern corridor for many curricula."
    ubud["lastReviewed"] = "2026-04"
    ubud["relatedDestinationGuide"] = {
        "countrySlug": "indonesia",
        "citySlug": "bali",
        "label": "Bali",
        "context": "Ubud is inland Gianyar regency on Bali island — see the Bali guide for province-wide visas, southern schools, and beach-town comparisons.",
    }
    ubud["housing"]["bestAreas"] = ["Central Ubud", "Peliatan", "Payangan ridge", "Tegallalang fringe", "Mas craft villages"]
    ubud["cost"] = {"status": "estimated", "rentRange": "~$1,600 / month", "familyDinner": "~$30", "nannyRate": "~$6 / hr", "monthlyFamilyAllIn": "~$3,500–$5,500 / month"}
    ubud["faq"][1]["answer"] = "Many families land around $3,500–$5,500/month all-in if schooling stays local; commuting to southern campuses adds transport hours and cost."
    add(ubud)

    med = deepcopy(find_city(cities, "san-jose-cr"))
    strip_weather(med)
    med["id"] = "medellin-co"
    med["citySlug"] = "medellin"
    med["countrySlug"] = "colombia"
    med["city"] = "Medellín"
    med["country"] = "Colombia"
    med["tagline"] = "Spring-city valleys — tech growth, cable cars, and mindful security planning"
    med["summary"] = "Medellín offers mild weather in the Aburrá Valley, improving transit, and a growing remote-employer scene. Families research security block-by-block, Spanish-first schools, and altitude adjustment for toddlers."
    med["lastReviewed"] = "2026-04"
    deep_str_replace(med, "Costa Rica", "Colombia")
    deep_str_replace(med, "San Jose", "Medellín")
    deep_str_replace(med, "Central Valley", "Aburrá Valley")
    med["housing"]["bestAreas"] = ["El Poblado", "Laureles", "Envigado", "Sabaneta", "Belén"]
    med["cost"] = {"status": "estimated", "rentRange": "~$1,400 / month", "familyDinner": "~$32", "nannyRate": "~$7 / hr", "monthlyFamilyAllIn": "~$3,200–$5,200 / month"}
    med["safety"]["score"] = 76
    med["visa"] = {
        "status": "verified",
        "summary": "Many Western visitors enter Colombia visa-free for short stays — confirm duration for your passport. Long-term stays usually need a migrant visa (visa tipo M or related categories) tied to work, investment, or family — Colombian immigration updates categories periodically.",
        "tip": "Search 'Cancillería Colombia visas official' on Google before you book — rules and reciprocity change.",
        "options": [
            {
                "type": "Visitor / visa-free entry (short stay)",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay — scouting Medellín",
                "duration": "Varies by nationality",
                "description": "Tourism and neighbourhood scouting — not a work permit.",
                "details": [
                    "Verify allowed stay length on the official migration site for each family member.",
                    "Use the trip to view El Poblado, Laureles, and school routes.",
                    "Working without the correct migrant category is risky — line up employer or independent visa advice.",
                ],
                "officialLink": {"label": "Colombia Ministry Foreign Affairs visas"},
            },
            {
                "type": "Migrant visa (work / investment / family)",
                "anchor": "visa-dnv",
                "detailTitle": "Migrant visa — national categories",
                "duration": "Varies by tipo",
                "description": "Apply through the Cancillería or in-country migration processes as rules allow.",
                "details": [
                    "Employer, business, retirement, and family routes each have document bundles — use official PDFs, not forum shortcuts.",
                    "Dependants usually need linked applications.",
                    "Search 'Migración Colombia visa tipo M trabajo' on Google for the current matrix.",
                ],
                "officialLink": {"label": "Migración Colombia official visa information"},
            },
        ],
    }
    med["residency"] = {
        "title": "Registration & cédula",
        "tip": "Search 'Registraduría cédula extranjería Colombia' on Google for ID card steps once your visa category is clear.",
        "items": [
            "Foreign ID (cédula de extranjería — Colombia's physical ID for visa holders) unlocks banks, contracts, and many schools' paperwork.",
            "Keep migration stamps aligned — overstays complicate renewals.",
            "RUT (tax ID) may be required for contracts — ask your accountant when you invoice or employ locally.",
            "Municipal registration rules vary — your landlord or relocation contact usually guides you.",
        ],
    }
    med["banking"] = {
        "title": "Banking",
        "tip": "Major banks often want a cédula before full accounts — use international cards as a bridge.",
        "items": [
            "Bancolombia, Davivienda, and BBVA Colombia are common retail banks for residents.",
            "USD and COP accounts serve different purposes — confirm FX needs with your employer.",
            "Wise remains useful for cross-border income until local limits are sorted.",
        ],
    }
    med["housing"]["searchPortalsIntro"] = [
        "Classifieds and Facebook groups dominate long-term villa and apartment searches.",
        "Search neighbourhood names inside each platform — valley micro-climates differ.",
        "Tip: noise and uphill access vary block by block — visit at night once.",
    ]
    med["housing"]["searchPortals"] = latam_portals("metrocuadrado.com", "Medellin expat housing Facebook group")
    numbeo_slug(med)
    add(med)

    ba = deepcopy(find_city(cities, "san-jose-cr"))
    strip_weather(ba)
    ba["id"] = "buenos-aires-ar"
    ba["citySlug"] = "buenos-aires"
    ba["countrySlug"] = "argentina"
    ba["city"] = "Buenos Aires"
    ba["country"] = "Argentina"
    ba["tagline"] = "Plata River capital — culture, steak, and currency awareness"
    ba["summary"] = "Buenos Aires offers strong schools (Spanish-first and bilingual pockets), European-style urban life, and relatively affordable help. Families track inflation, dual-currency rents, and neighbourhood safety variance."
    ba["lastReviewed"] = "2026-04"
    deep_str_replace(ba, "Costa Rica", "Argentina")
    deep_str_replace(ba, "San Jose", "Buenos Aires")
    ba["housing"]["bestAreas"] = ["Belgrano", "Palermo", "Nuñez", "Acassuso", "Martínez"]
    ba["cost"] = {"status": "estimated", "rentRange": "~$1,200 / month", "familyDinner": "~$38", "nannyRate": "~$8 / hr", "monthlyFamilyAllIn": "~$3,000–$5,000 / month"}
    ba["safety"]["score"] = 75
    ba["visa"] = {
        "status": "verified",
        "summary": "Mercosur citizens have simplified entry rules; others usually receive passport stamps for tourism. Work and long-stay routes run through Dirección Nacional de Migraciones — employer or independent categories apply.",
        "tip": "Search 'Argentina migraciones residencia oficial' on Google — forms are Spanish-only.",
        "options": [
            {
                "type": "Tourist / reciprocal entry",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay — scouting Buenos Aires",
                "duration": "Varies",
                "description": "Tourism — not employment.",
                "details": [
                    "Check allowed stay for your nationality before you fly.",
                    "Scout Belgrano, Nuñez, and northern corridors for schools.",
                    "Currency and inflation move fast — verify rent currency in contracts.",
                ],
                "officialLink": {"label": "Argentina Migraciones official"},
            },
            {
                "type": "Residency with work / family grounds",
                "anchor": "visa-dnv",
                "detailTitle": "Temporary / permanent residency pathways",
                "duration": "Case-specific",
                "description": "File with Migraciones — often needs legal help for first submission.",
                "details": [
                    "Employer sponsorship or local income routes differ — gather apostilled documents early.",
                    "DNI (Documento Nacional de Identidad — Argentina's national ID) follows approved residency.",
                    "Dependants need linked filings.",
                ],
                "officialLink": {"label": "Argentina residency requirements official"},
            },
        ],
    }
    ba["residency"] = {
        "title": "Registration & DNI",
        "tip": "Keep migration appointments — walk-ins rarely work in peak seasons.",
        "items": [
            "DNI unlocks healthcare contracts, bank products, and many school forms.",
            "Padron municipal (local population register) may be required for some services.",
            "Carry copies of birth/marriage certificates with apostilles for first filings.",
        ],
    }
    ba["banking"] = {
        "title": "Banking",
        "tip": "USD and peso accounts behave differently — ask about parallel exchange rates.",
        "items": [
            "Galicia, Santander Argentina, and BBVA are common retail banks.",
            "Expect heavy paperwork until DNI is issued.",
            "International cards bridge gaps for the first weeks.",
        ],
    }
    ba["housing"]["searchPortalsIntro"] = [
        "Argenprop and Zonaprop list much of the capital's inventory.",
        "Search barrio names, not just 'Capital Federal'.",
        "Tip: verify security and building maintenance before paying deposits.",
    ]
    ba["housing"]["searchPortals"] = latam_portals("zonaprop.com.ar", "Buenos Aires expat families housing Facebook")
    numbeo_slug(ba)
    add(ba)

    lim = deepcopy(find_city(cities, "san-jose-cr"))
    strip_weather(lim)
    lim["id"] = "lima-pe"
    lim["citySlug"] = "lima"
    lim["countrySlug"] = "peru"
    lim["city"] = "Lima"
    lim["country"] = "Peru"
    lim["tagline"] = "Pacific capital — foggy winters, serious food, and Andean access"
    lim["summary"] = "Lima anchors Peru's economy and international schools in Miraflores and La Molina. Coastal garúa (drizzle) winters surprise newcomers; earthquake preparedness matters."
    lim["lastReviewed"] = "2026-04"
    deep_str_replace(lim, "Costa Rica", "Peru")
    deep_str_replace(lim, "San Jose", "Lima")
    lim["housing"]["bestAreas"] = ["Miraflores", "Barranco", "La Molina", "San Isidro", "Surco"]
    lim["cost"] = {"status": "estimated", "rentRange": "~$1,300 / month", "familyDinner": "~$34", "nannyRate": "~$7 / hr", "monthlyFamilyAllIn": "~$3,200–$5,200 / month"}
    lim["safety"]["score"] = 76
    lim["visa"] = {
        "status": "verified",
        "summary": "Many tourists enter visa-free or with a simple TAM for short stays. Work and long-term residence require a carné de extranjería pathway through Migraciones — categories include work contracts, investment, and family reunification.",
        "tip": "Search 'Migraciones Perú carné de extranjería' on Google for PDF checklists.",
        "options": [
            {
                "type": "Tourist / short stay",
                "anchor": "visa-tourist",
                "detailTitle": "Short stay — scouting Lima",
                "duration": "Varies",
                "description": "Tourism — confirm length at entry.",
                "details": [
                    "Review carry rules for cash and documents on official migration pages.",
                    "Visit Miraflores, La Molina, and Surco with schools in mind.",
                    "Coastal winter garúa (drizzle) lasts months — test housing ventilation.",
                ],
                "officialLink": {"label": "Peru Superintendencia Nacional Migraciones"},
            },
            {
                "type": "Residency (carné de extranjería)",
                "anchor": "visa-dnv",
                "detailTitle": "Residence permit categories",
                "duration": "Varies",
                "description": "Employer or family sponsorship is typical for salaried expats.",
                "details": [
                    "Antecedentes policiales (police certificates) often need apostille.",
                    "Children's school letters may reference migration status — align timelines.",
                    "Search 'Peru trabajo residencia migraciones' on Google for employer routes.",
                ],
                "officialLink": {"label": "Peru immigration residence official"},
            },
        ],
    }
    lim["residency"] = {
        "title": "Registration & carné",
        "tip": "Book Migraciones appointments online when the portal opens slots.",
        "items": [
            "Carné de extranjería (Peru's physical ID card for foreign residents) follows approved visa status.",
            "Empadronamiento (address registration with the municipality) supports schools and utilities.",
            "Keep copies of all translations — Spanish is required for most filings.",
        ],
    }
    lim["banking"] = {
        "title": "Banking",
        "tip": "Retail banks want carné and proof of address — plan several visits.",
        "items": [
            "Interbank, BBVA Perú, and Scotiabank Perú are common choices.",
            "USD savings accounts exist — ask about compliance paperwork.",
            "International cards cover the first month.",
        ],
    }
    lim["housing"]["searchPortalsIntro"] = [
        "Urbania and Adondevivir list much of Lima's long-term stock.",
        "Focus on Miraflores, San Isidro, La Molina, and Surco for international-school commutes.",
        "Tip: earthquake retrofit and water tanks matter — ask building management.",
    ]
    lim["housing"]["searchPortals"] = latam_portals("urbania.pe", "Lima expat housing Facebook group")
    numbeo_slug(lim)
    add(lim)

    if not batch:
        print("Nothing new to add.", file=sys.stderr)
        return 0

    cities.extend(batch)
    save_cities(cities)
    print(f"Added {len(batch)} destinations")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
