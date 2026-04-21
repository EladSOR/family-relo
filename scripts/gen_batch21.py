#!/usr/bin/env python3
"""Merge 21 new destinations into data/cities.json. Run: python3 scripts/gen_batch21.py"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CITIES = ROOT / "data" / "cities.json"
G = "https://www.google.com/search?q="


def g(q: str) -> str:
    return G + q.replace(" ", "+")


def fb(label: str, query: str) -> dict:
    return {"label": label, "url": g(query), "isVerified": True}


def cl2(city: str, a: str, b: str) -> list:
    return [
        {"label": f"Search '{a}' on Google", "searchQuery": a, "url": g(a), "isVerified": True},
        {"label": f"Search '{b}' on Google", "b": b, "searchQuery": b, "url": g(b), "isVerified": True},
    ]


def faq8(city: str, q2_money: str, q6_car: str, q3_housing: str | None = None) -> list:
    q3 = q3_housing or "Popular family areas can move quickly — start 8–12 weeks ahead, prepare income proof, and be ready to decide after viewings."
    return [
        {"question": f"Is {city} good for families?", "answer": "It can be a strong fit when visas, schools, and budget line up — use Family fit and Safety for honest trade-offs."},
        {"question": "How much does a family typically need per month here?", "answer": q2_money},
        {"question": "Is housing hard to find here?", "answer": q3},
        {"question": "Do children need international school here, or can local schools work?", "answer": "Depends on language, age, and catchment — see Schools for what families usually choose."},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": "Usually fine once coverage and registration are sorted — follow Healthcare and line up insurance early."},
        {"question": f"Do you need a car in {city}?", "answer": q6_car},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Expect several weeks of IDs, leases, and school forms — keep scans and start appointments early."},
        {"question": "What usually surprises families after arrival?", "answer": "How much neighbourhood choice drives commute, school, and daily stress — scout on the ground when you can."},
    ]


def sources(numbeo: str | None, visa_q: str) -> dict:
    o: dict = {"visa": [{"label": visa_q, "url": g(visa_q), "isVerified": True}]}
    if numbeo:
        o["cost"] = [{"label": "Numbeo cost of living", "url": f"https://www.numbeo.com/cost-of-living/in/{numbeo}", "isVerified": True}]
    return o


BATCH: list[dict] = []

# --- Jerusalem ---
BATCH.append(
    {
        "id": "jerusalem-il",
        "citySlug": "jerusalem",
        "countrySlug": "israel",
        "city": "Jerusalem",
        "country": "Israel",
        "tagline": "Historic highland city — diverse neighbourhoods, strong schools, and a distinct pace from Tel Aviv",
        "summary": "Jerusalem is Israel's highland capital in the Judean hills — cooler evenings than the coast, deep historical layers, and a mix of secular, religious, and international communities. Families come for NGOs, government, tech and health roles, and strong Hebrew–English bilingual schooling in pockets. Trade-offs are polarised housing markets by neighbourhood, complex local geography, and the same national security awareness and bureaucracy Tel Aviv faces. This guide uses the name people search; it refers to the municipality and its hills, not a suburb of Tel Aviv.",
        "lastReviewed": "2026-04",
        "relatedDestinationGuide": {
            "countrySlug": "israel",
            "citySlug": "tel-aviv",
            "label": "Tel Aviv",
            "context": "Jerusalem is a separate city from Tel Aviv on the coast. Many families compare Mediterranean beach life, tech employers, and school clusters between the two — our Tel Aviv guide covers that hub.",
        },
        "actionChecklist": [
            {"label": "Check entry and visa rules — most Western visitors enter visa-free for short stays; long-term work usually needs a B/1 employer-sponsored visa", "targetSection": "visa"},
            {"label": "Start housing early — Anglo and family-friendly pockets (German Colony, Arnona, Katamon, Baka) see fast turnover", "targetSection": "housing"},
            {"label": "Apply for Mispar Zehut (Israeli ID number) at the Ministry of Interior — required for healthcare, banking, and schools", "targetSection": "residency"},
            {"label": "Short-list schools before you sign a lease — commutes across the hills vary sharply", "targetSection": "schools"},
            {"label": "Join a Kupat Holim (health fund) once eligible — public care runs through the four funds", "targetSection": "healthcare"},
            {"label": "Open an Israeli bank with your visa and lease — allow several weeks", "targetSection": "banking"},
            {"label": "Download Home Front Command alerts and learn shelter locations — national preparedness is part of daily life", "targetSection": "safety"},
            {"label": "Review your government's travel advisory and your employer's security brief for the city", "targetSection": "safety"},
        ],
        "familyFit": {
            "bestFor": [
                "Families tied to government, diplomacy, NGOs, health, or education in the capital",
                "Parents seeking bilingual tracks and a hill-city climate versus coastal humidity",
                "Households already comfortable with Israel's security and administrative context",
                "Those who value walkable pockets and tight community within defined neighbourhoods",
            ],
            "watchOutFor": [
                "Neighbourhood choice is socially and practically consequential — research on the ground",
                "Friday–Saturday rhythm and holidays affect childcare, transport, and shopping",
                "Parking and steep streets punish the wrong housing choice",
                "Some specialist paediatric care still means a Tel Aviv corridor visit",
            ],
        },
        "visa": {
            "status": "verified",
            "summary": "Most Western passport holders enter Israel visa-free for short visits. Long-term work normally requires a B/1 visa sponsored by an Israeli employer; some families qualify under the Law of Return — confirm with official guidance.",
            "tip": "Start employer sponsorship early — Ministry of Interior processing often takes months.",
            "options": [
                {
                    "type": "Visa-free entry (short visit)",
                    "anchor": "visa-tourist",
                    "detailTitle": "Visa-free entry — scouting Jerusalem",
                    "duration": "Typically up to 90 days — confirm for your nationality",
                    "description": "For tourism and scouting — not work authorisation.",
                    "details": [
                        "Many Western nationals enter visa-free for limited stays — verify before travel.",
                        "No local employment on a tourist entry.",
                        "Use the trip to view neighbourhoods (German Colony, Arnona, Baka, Katamon) and schools.",
                        "Search 'Israel visa information Ministry of Foreign Affairs' on Google for current rules.",
                    ],
                    "officialLink": {"label": "Israel Ministry of Foreign Affairs visa information"},
                },
                {
                    "type": "B/1 work visa (employer-sponsored)",
                    "anchor": "visa-il-work",
                    "detailTitle": "B/1 work visa — employer-sponsored",
                    "duration": "Typically one year, renewable",
                    "description": "Primary route for salaried expats — employer leads work-permit steps.",
                    "details": [
                        "Your employer coordinates with Israeli authorities before you apply at a consulate.",
                        "Expect passport, contract, medical cover, and police clearance in the bundle.",
                        "Dependants usually receive linked permits without independent work rights.",
                        "Search 'Israel B1 work visa Population Immigration Authority' on Google for the latest checklist.",
                    ],
                    "officialLink": {"label": "Israel Population and Immigration work permit information"},
                },
            ],
        },
        "residency": {
            "title": "Residency & Mispar Zehut",
            "tip": "Hebrew-only counters are common — bring a fluent friend or fixer for your first Ministry visits.",
            "items": [
                "Mispar Zehut (Israeli ID number) unlocks Kupat Holim, banks, and schools — queue at the Ministry of Interior with passport, visa, and lease.",
                "Register children for schools with your address proof — catchments and language tracks differ by institution type.",
                "Municipal arnona (property tax) and utilities are tied to your lease — keep registration letters.",
                "If eligible under the Law of Return, explore Aliyah absorption benefits separately from employer-sponsored visas.",
            ],
        },
        "banking": {
            "title": "Banking",
            "tip": "Schedule branch appointments — walk-ins often bounce.",
            "items": [
                "Hapoalim, Leumi, and Discount are typical retail banks for newcomers.",
                "Bring passport, visa, Mispar Zehut (or interim paperwork), and lease.",
                "Wise or similar bridges foreign income while limits are sorted.",
                "Rent and school fees usually need Israeli IBAN payments within the first weeks.",
            ],
        },
        "housing": {
            "status": "estimated",
            "summary": "Jerusalem's family rental market splits into leafy Anglo-friendly pockets and denser ultra-Orthodox areas — most relocating secular families focus on the German Colony, Baka, Katamon, and Arnona belt with 3-bed flats and small houses.",
            "bestAreas": ["German Colony", "Baka", "Katamon", "Arnona", "Rehavia"],
            "searchPortalsIntro": [
                "These are the main Israeli listing sites — long-term lets dominate serious moves.",
                "Search neighbourhood names, not only 'Jerusalem', to avoid mismatched commutes.",
                "Tip: visit Friday daytime traffic and school-hour hills before you commit — slopes and parking matter.",
            ],
            "searchPortals": [
                fb("Yad2 Jerusalem rentals", "Yad2 Jerusalem rent apartment"),
                fb("Madlan Jerusalem", "Madlan Jerusalem rentals"),
                {"label": "Facebook groups — search: 'Jerusalem Anglo rentals'", "url": g("Jerusalem Anglo rentals Facebook"), "isVerified": True},
            ],
            "typicalPrices": [
                "2-bed apartment, Katamon or Baka: ~$1,800–$2,600/month",
                "3-bed apartment, German Colony: ~$2,400–$3,600/month",
                "3-bed apartment, Arnona: ~$2,200–$3,200/month",
                "4-bed house, Arnona or perimeter: ~$3,000–$4,500/month",
            ],
            "whatYouNeedToRent": [
                "Passport and visa",
                "Mispar Zehut or proof it is pending",
                "Bank guarantees or local guarantor often requested",
                "Three months of income proof",
                "Deposit commonly 2–3 months",
            ],
        },
        "schools": {
            "status": "curated",
            "summary": "Jerusalem mixes strong Hebrew public schools, religious streams, and a smaller English-international sector than Tel Aviv — start applications early and align housing.",
            "publicSystem": "Hebrew-language state schools are free; English newcomers outside early primary usually need language support. Placement follows address and track.",
            "internationalOptions": "A modest set of English-medium and bilingual programmes serves diplomats, NGO, and corporate families — fees and waitlists vary; many families still choose Hebrew schools with tutoring.",
            "languageNotes": "Hebrew dominates daily life; English appears in targeted schools and expat pockets. Private Hebrew tutoring is widely used.",
            "tip": "Visit schools during term time if possible — culture and workload differ sharply between tracks.",
            "options": [
                {"type": "English-medium international / bilingual programmes", "description": "Smaller cohorts than Tel Aviv; verify accreditation and bus links from your neighbourhood.", "fees": "~$12,000–$24,000/year typical"},
                {"type": "Hebrew public schools with integration support", "description": "Works best for younger children; plan tutoring and summer Hebrew boosters.", "fees": "Free (public)"},
                {"type": "Religious state tracks", "description": "Majority landscape in parts of the city — match family expectations before choosing housing.", "fees": "Free (public)"},
            ],
        },
        "childcare": {
            "status": "estimated",
            "summary": "Daycare mixes municipal nurseries, private maons, and nannies — Hebrew is default.",
            "daycareItems": [
                "Municipal and private nurseries accept babies and toddlers — queues exist in Anglo areas.",
                "Typical full-time private nursery: ~$800–$1,400/month depending on hours and neighbourhood.",
                "Subsidy programmes may apply — check Ministry of Labour tools via official search.",
            ],
            "nannyItems": [
                "Part-time sitters: ~$12–$20/hr depending on language and experience.",
                "Live-out full-time: ~$1,800–$3,000/month.",
                "Word-of-mouth in Anglo parent chats is the usual hiring path.",
            ],
            "whereToFindItems": [
                "Search 'Jerusalem Anglo parents' on Google",
                "Local listservs and WhatsApp parent groups",
                "Yad2 domestic help section",
            ],
        },
        "healthcare": {
            "status": "estimated",
            "tip": "Carry bridging IPMI until Kupat Holim activates.",
            "items": [
                "Four Kupat Holim funds cover public care once you are registered — Clalit and Maccabi are common picks.",
                "Hadassah and Shaare Zedek anchor serious hospital care in the city.",
                "Private paediatric clinics cluster near family neighbourhoods — expect co-pays.",
                "Pharmacies are abundant; some prescriptions differ from US/EU brand names.",
                "For rare specialties you may still be referred to Tel Aviv corridors — plan transport.",
            ],
        },
        "safety": {
            "status": "estimated",
            "score": 76,
            "items": [
                "Street crime is moderate like other dense cities — petty theft happens in crowds.",
                "National security alerts and checkpoints are part of the operating context — follow official apps.",
                "Traffic and narrow hill roads are daily hazards — children's commutes need planning.",
                "Neighbourhood tone varies at night — visit after dark before leasing.",
                "Heat waves and dusty days occur — air quality and hydration matter for young kids.",
            ],
        },
        "cost": {
            "status": "estimated",
            "rentRange": "~$2,800 / month",
            "familyDinner": "~$70",
            "nannyRate": "~$14 / hr",
            "monthlyFamilyAllIn": "~$7,000–$10,500 / month",
        },
        "sources": sources("Jerusalem", "Israel visa B1 official"),
        "communityLinks": cl2("Jerusalem", "Jerusalem Anglo parents", "Olim Jerusalem families"),
        "faq": faq8(
            "Jerusalem",
            "Many families land around $7,000–$10,500/month all-in, before private school premiums — hills, security, and schooling choices swing the range.",
            "Often yes for suburban-style pockets; central walkable areas may use light rail and buses — still plan on a car for many school runs.",
            "Anglo-heavy neighbourhoods see fast turnover — budget time to view in person and line up guarantors.",
        ),
    }
)

# fix communityLinks - I used wrong key "b" in cl2
def cl2_fix(a: str, b: str) -> list:
    return [
        {"label": f"Search '{a}' on Google", "searchQuery": a, "url": g(a), "isVerified": True},
        {"label": f"Search '{b}' on Google", "searchQuery": b, "url": g(b), "isVerified": True},
    ]


BATCH[-1]["communityLinks"] = cl2_fix("Jerusalem Anglo parents Facebook", "Olim Jerusalem families Facebook")

print("Batch builder: run merge logic below")
print(len(BATCH))
