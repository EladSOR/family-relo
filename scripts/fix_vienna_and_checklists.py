#!/usr/bin/env python3
"""
1. Replace the Vienna-at entry's broken sections with correct Austrian content
   (preserves: id, citySlug, countrySlug, city, country, lastReviewed, weather).
2. Reorder actionChecklist in 6 other cities so the first item targets visa:
   milan-it, florence-it, cascais-pt, munich-de, thessaloniki-gr, rome-it.

Single, idempotent rewrite. Validates basic structure after writing.
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())


def find_idx(city_id):
    for i, c in enumerate(cities):
        if c["id"] == city_id:
            return i
    raise KeyError(city_id)


# -----------------------------------------------------------------------------
# 1. VIENNA — full rewrite (preserve only weather + identity)
# -----------------------------------------------------------------------------
vidx = find_idx("vienna-at")
preserved_weather = cities[vidx].get("weather")

vienna = {
    "id": "vienna-at",
    "citySlug": "vienna",
    "countrySlug": "austria",
    "city": "Vienna",
    "country": "Austria",
    "tagline": "Imperial city, top-rated quality of life — German-language daily life",
    "summary": "Vienna consistently tops global liveability rankings: excellent public transport, generous green space, low crime, and strong public services. Healthcare and education are subsidised, but daily life runs in German and the rental market is regulated — paperwork is slow but predictable.",
    "lastReviewed": "2026-04",
    "actionChecklist": [
        {
            "label": "EU/EEA citizens: stay in Austria visa-free indefinitely. After 3 months, apply for an Anmeldebescheinigung (EU residence registration certificate) at MA 35 (Vienna's residence office) within 4 months of arrival — bring passport, proof of income or work, and health insurance proof",
            "targetSection": "visa"
        },
        {
            "label": "Non-EU citizens: apply for a Red-White-Red Card or Settlement Permit at the Austrian consulate in your home country BEFORE travelling — most categories require €1,200–€3,000+/month income proof, valid health insurance, and confirmed accommodation. Processing usually takes 8–12 weeks",
            "targetSection": "visa"
        },
        {
            "label": "Within 3 working days of moving into your Vienna address, file a Meldezettel (registration form) at your local Magistratisches Bezirksamt (district registration office) — landlord must sign it, bring passport and rental contract. This is mandatory for everyone, including EU citizens",
            "targetSection": "residency"
        },
        {
            "label": "Start your housing search 8–10 weeks before arrival — Vienna's rental market is regulated and competitive. Family-sized apartments (3-bed) in popular districts like Döbling, Währing, and Hietzing move quickly",
            "targetSection": "housing"
        },
        {
            "label": "Apply to international schools 12–18 months before your planned start date — Vienna International School, Danube International School, and AIS Vienna all run multi-year waitlists for popular year groups",
            "targetSection": "schools"
        },
        {
            "label": "Register with ÖGK (Österreichische Gesundheitskasse — Austria's public health insurance fund) once you have a residency certificate or work contract. You'll receive an e-card (Austrian health card) which gives access to all public GPs and hospitals",
            "targetSection": "healthcare"
        },
        {
            "label": "Open an Austrian bank account at Erste Bank, Bank Austria (UniCredit), Raiffeisen, or BAWAG — bring passport, Meldezettel, and a residency document. Some branches require an appointment",
            "targetSection": "banking"
        },
        {
            "label": "Apply to a Krippe (nursery for under-3s) or Kindergarten (3–6 years) as soon as your arrival date is confirmed — Vienna offers free public Kindergarten from age 1, but popular city-run spots have waitlists",
            "targetSection": "childcare"
        }
    ],
    "familyFit": {
        "bestFor": [
            "Families seeking high public-service quality (healthcare, transit, parks) at moderate cost for a Western European capital",
            "EU/EEA families who want simple registration and access to free public Kindergarten from age 1",
            "Parents prioritising safety, walkability, and excellent music/arts/sports programmes for kids",
            "Families relocating for corporate roles in finance, UN/diplomatic, or international organisations (Vienna hosts the UN, OPEC, IAEA)"
        ],
        "watchOutFor": [
            "Daily life is in German — English is widely spoken in central districts and at international employers, but housing, banking, and bureaucracy assume German",
            "Austrian bureaucracy is slow but exact — every form requires originals, often translated and apostilled. Allow 8–12 weeks for non-EU residence permits",
            "Winters are long and grey — cold, short days from November to February. Plan for indoor activities and ski weekends in nearby Alps",
            "Rental market is heavily regulated — many family-sized flats are unfurnished (no kitchen, no light fixtures); budget €5,000–€10,000 for first-time setup"
        ]
    },
    "visa": {
        "status": "verified",
        "summary": "EU/EEA citizens move to Austria freely. Non-EU families need a Red-White-Red Card (skilled workers, key workers, self-employed key workers) or a Settlement Permit before travelling — both require income proof, health insurance, and confirmed accommodation. Austria does NOT have a dedicated digital nomad visa.",
        "tip": "Book your consulate appointment 8–12 weeks before your planned move — Austrian consulate slots in major cities (London, New York, Sydney) fill 6+ weeks out and apostilled documents take 2–3 weeks to prepare.",
        "options": [
            {
                "type": "EU / EEA citizens",
                "anchor": "visa-eu",
                "detailTitle": "EU / EEA citizens — what to do after arriving in Vienna",
                "duration": "No visa required — unlimited stay",
                "description": "Move freely to Austria. After 3 months, you must apply for an Anmeldebescheinigung (EU registration certificate) within 4 months of arrival.",
                "details": [
                    "No visa, permit, or income threshold required for entry — EU/EEA passport holders have full freedom of movement.",
                    "Within 3 working days of moving into a Vienna address, file a Meldezettel (registration form) at your local Magistratisches Bezirksamt — landlord must sign. This applies to ALL residents, EU or not.",
                    "If staying longer than 3 months, apply for an Anmeldebescheinigung (EU registration certificate) at MA 35 (Magistratsabteilung 35 — Vienna's residence office) within 4 months of arrival. Bring passport, proof of income/work, and health insurance proof.",
                    "After 5 years of continuous legal residence, you can apply for a Daueraufenthalt – EU (permanent EU residence permit).",
                    "Search 'MA 35 Vienna Anmeldebescheinigung' on Google for the latest application form and required documents."
                ],
                "officialLink": {
                    "label": "MA 35 Vienna Anmeldebescheinigung official"
                }
            },
            {
                "type": "Schengen Tourist (non-EU)",
                "anchor": "visa-tourist",
                "detailTitle": "Schengen Tourist — what it allows and what it does not",
                "duration": "Up to 90 days in any 180-day window",
                "description": "Valid for a scouting trip before committing to the move. No right to work, cannot be converted to residency from inside Austria.",
                "details": [
                    "90 days maximum across the entire Schengen Area in any 180-day rolling period — many passports (US, UK, Australia, Canada, Israel, Japan) qualify visa-free; others must apply at an Austrian consulate.",
                    "No right to work — including remote work for a foreign employer (Austria interprets this strictly).",
                    "Cannot be converted to residency from inside Austria — you must apply for the long-stay visa or residence permit at the Austrian consulate in your home country before travelling.",
                    "Good use: 2–3 weeks scouting Döbling, Währing, Hietzing, and Leopoldstadt for schools and housing.",
                    "Do not attempt long-term stays on rolling 90-day entries — Austrian immigration enforces Schengen limits with database tracking."
                ]
            },
            {
                "type": "Red-White-Red Card / Settlement Permit (non-EU)",
                "anchor": "visa-dnv",
                "detailTitle": "Red-White-Red Card / Niederlassungsbewilligung — how to apply",
                "duration": "Initially 24 months, then 3-year renewals",
                "description": "Austria's main long-stay route for non-EU families: skilled-worker, very-highly-qualified, key-worker, self-employed key worker, start-up founder, or family-reunification routes. No remote-worker / nomad visa exists.",
                "details": [
                    "Choose the right category: Red-White-Red Card for employed work; Settlement Permit (Niederlassungsbewilligung) for self-employed, retired with passive income, or family reunification. Each has different income, qualification, and document requirements.",
                    "Income requirement: roughly €1,200–€3,000+/month minimum (varies by category and family size) — this is checked at every renewal too. Family reunification requires the sponsor to prove higher income.",
                    "Required documents: valid passport, apostilled birth/marriage certificates (translated to German by a sworn translator), proof of accommodation in Vienna, valid health insurance, and category-specific proof (job offer, university degree, business plan, pension statements).",
                    "Apply at the Austrian consulate in your home country BEFORE travelling — processing typically takes 8–12 weeks. You cannot switch from a tourist entry to a residence permit from inside Austria.",
                    "After arriving, register your address at the Magistratisches Bezirksamt within 3 working days, then collect your Aufenthaltstitel (residence card) at MA 35 within 4 weeks. Search 'MA 35 Vienna Aufenthaltstitel' on Google for the latest application checklist."
                ],
                "officialLink": {
                    "label": "Migration.gv.at — Austria's official migration portal"
                }
            }
        ]
    },
    "residency": {
        "title": "Registration & Meldezettel",
        "tip": "File your Meldezettel within 3 working days of moving into your Vienna address — your landlord MUST sign it, and you cannot open a bank account, register a child in school, or get a health card without this proof.",
        "items": [
            "Meldezettel (registration form — Austria's mandatory address registration) is filed at your local Magistratisches Bezirksamt (district registration office) within 3 working days of moving in. Bring passport, completed form, and rental contract; landlord signature required. There is no fee.",
            "EU/EEA citizens staying longer than 3 months must additionally apply for an Anmeldebescheinigung (EU registration certificate) at MA 35 (Vienna's residence authority) within 4 months of arrival — bring passport, proof of income or employment, and proof of comprehensive health insurance.",
            "Non-EU residents collect their Aufenthaltstitel (residence card) at MA 35 within 4 weeks of arrival, after applying at the consulate abroad. Book your MA 35 collection appointment online — slots in central Vienna fill 4–6 weeks out.",
            "Steuernummer (Austrian tax number) is issued automatically by the Finanzamt (tax office) once you start work or self-employment — no separate registration needed for most residents.",
            "Your Anmeldebescheinigung or Aufenthaltstitel plus your Meldezettel together serve as your daily-life ID for opening bank accounts, signing utility contracts, and enrolling children in school."
        ]
    },
    "banking": {
        "title": "Banking",
        "tip": "Bring your Meldezettel and a residency document to every bank appointment — without both, no Austrian bank will open a current account, even for EU citizens.",
        "items": [
            "Erste Bank and Bank Austria (UniCredit) are Austria's two largest retail banks with the most accessible English-language service in Vienna. BAWAG and Raiffeisen are alternatives with strong digital banking.",
            "To open an account you need: passport, Meldezettel (mandatory), residency document (Anmeldebescheinigung or Aufenthaltstitel), and proof of income or employment contract. Most branches require an appointment booked online.",
            "N26 (Berlin-based neobank) and Revolut are widely used as bridge accounts while waiting for a traditional Austrian account — open online with just a passport and proof of address.",
            "Wise and Revolut are the standard tools for international transfers and multi-currency spending — Austrian banks charge high fees on cross-border SEPA and SWIFT.",
            "Austria is more cash-reliant than Germany or Scandinavia — keep €100–€200 in cash for small cafés, farmers' markets (Naschmarkt, Karmelitermarkt), and taxis that still don't accept cards."
        ]
    },
    "housing": {
        "status": "estimated",
        "summary": "Vienna has Western Europe's most regulated rental market — about 60% of households rent, 30% live in subsidised Gemeindebau or Genossenschaft (cooperative) housing. Family-friendly districts cluster in Döbling (19th), Währing (18th), Hietzing (13th), Leopoldstadt (2nd), and Penzing (14th).",
        "bestAreas": [
            "Döbling (19th)",
            "Währing (18th)",
            "Hietzing (13th)",
            "Leopoldstadt (2nd)",
            "Penzing (14th)"
        ],
        "searchPortalsIntro": [
            "These are local rental platforms — this is where Vienna residents rent long-term housing (cheaper than Airbnb).",
            "Search 'Wien' (German for Vienna) plus the district number (e.g. '1190 Döbling') inside each platform to filter local listings.",
            "Tip: arrive in Vienna with a 4–8 week serviced apartment booked — the rental market moves fast, most flats are unfurnished, and you'll need a Meldezettel to view many listings."
        ],
        "searchPortals": [
            {
                "label": "Willhaben.at — Austria's largest rental and classifieds platform",
                "url": "https://www.willhaben.at",
                "isVerified": True
            },
            {
                "label": "ImmoScout24.at — major Austrian property portal",
                "url": "https://www.immobilienscout24.at",
                "isVerified": True
            },
            {
                "label": "Der Standard Immo — Vienna newspaper rental section, often premium / family flats",
                "url": "https://immobilien.derstandard.at",
                "isVerified": True
            },
            {
                "label": "Facebook groups — search: 'Vienna Expats Housing' or 'Wohnungen in Wien' (community listings, direct landlord deals)",
                "url": "https://www.google.com/search?q=Vienna+Expats+Housing+Facebook+group",
                "isVerified": True
            }
        ],
        "typicalPrices": [
            "1-bed apartment, central districts (1st, 7th, 8th): ~$1,300–$1,800 / month",
            "2-bed apartment, family-friendly districts (18th, 19th): ~$1,800–$2,500 / month",
            "3-bed apartment, Döbling or Hietzing: ~$2,500–$3,800 / month",
            "Short-stay serviced apartment for arrival: ~$2,500–$3,500 / month"
        ],
        "whatYouNeedToRent": [
            "Valid passport",
            "Meldezettel (registration form) — landlord usually wants you to register on their address as proof of intent",
            "Last 3 months of bank statements OR Austrian employment contract OR remote-work contract with proof of income",
            "Deposit (Kaution) is typically 3 months' rent, held in escrow by law",
            "Many Vienna rentals are unfurnished (no kitchen, no light fixtures, no curtains) — confirm what's included before signing; a fully-fitted flat costs 10–15% more"
        ]
    },
    "schools": {
        "status": "curated",
        "summary": "Vienna has the largest international school sector in Austria. Most have multi-year waitlists for popular year groups — apply 12–18 months in advance.",
        "publicSystem": "Austrian state schools (Volksschule for ages 6–10, then Mittelschule or Gymnasium) are free, well-structured, and genuinely good — but all instruction is in German. State schools work for families willing to commit to German integration; many districts run 'Vorschule' or intensive German programmes for non-German-speaking children. Most expat families use international schools for at least the first 1–2 years, then transition some children into the public system.",
        "internationalOptions": "Vienna has well-established IB, British, and American curriculum schools, mostly in the western suburbs (Döbling, Währing, Hietzing) and 22nd district (Donaustadt) near the UN. Fees range from roughly $14,000 to $28,000+ per year. Vienna International School (UN-affiliated), Danube International School, and AIS Vienna have the longest waitlists.",
        "languageNotes": "Austrian state schools teach entirely in German (Austrian dialect). International schools teach in English, with German as a second language from age 6. Children placed in state schools without prior German typically need 1–2 years to reach full academic fluency — younger children (under 7) usually catch up faster.",
        "tip": "Apply to international schools BEFORE booking your flights — most Vienna international schools require a completed application, school reports, and a placement test before they will reserve a spot. Some run 18–24 month waitlists.",
        "options": [
            {
                "type": "IB curriculum international schools",
                "description": "The primary choice for English-speaking expat families relocating to Vienna. IB Diploma, MYP, and PYP available across multiple schools. Limited places per year group, multi-year waitlists at the most established schools.",
                "fees": "$15,000–$28,000+/year typical"
            },
            {
                "type": "British curriculum international schools",
                "description": "British A-Level and GCSE pathway schools with smaller cohorts than the IB sector but well regarded. Often easier to get into mid-year than the largest IB schools.",
                "fees": "$13,000–$24,000/year typical"
            },
            {
                "type": "Austrian state schools (German immersion)",
                "description": "Free for all registered residents. All instruction in German. A realistic option for families with children under 7, families committing to German long-term, or families on a tighter budget. Vienna runs intensive German support programmes for newly-arrived non-German-speaking children.",
                "fees": "Free (public)"
            }
        ]
    },
    "childcare": {
        "status": "estimated",
        "summary": "Vienna offers free public Kindergarten from age 1 — one of Europe's most generous early-childcare systems. Public spots in popular districts have waitlists; private bilingual options are widely available but more expensive.",
        "daycareItems": [
            "Krippe (nursery for children under 3) and Kindergarten (3–6 years) are Austria's terms for daycare. Vienna's city-run Kindergartens are FREE for all registered residents from age 1 — register via the city portal as soon as your Meldezettel is issued.",
            "Public Kindergarten waitlists in popular districts (Döbling, Währing, central 1st–9th) run 3–6 months — apply early. Private Kindergartens accept walk-ins more easily but cost ~$700–$1,400 / month.",
            "Bilingual (English / German) Kindergartens are common in central districts and the UN area (Donaustadt) — typical fees $900–$1,600 / month, often with a meal plan included.",
            "Visit any Kindergarten in person before committing — staff ratios, language mix, and outdoor space vary widely between districts and providers."
        ],
        "nannyItems": [
            "Full-time nannies in Vienna charge roughly $14–$22 / hr for English-speaking, experienced candidates — rates are higher than elsewhere in Austria",
            "Part-time after-school care (Hort) for school-age children is widely available through the public system and most international schools",
            "Many nannies in Vienna come from CEE countries (Slovakia, Hungary, Czechia) and speak good English plus German — confirm language fit at interview",
            "Start your nanny search 6–8 weeks before arrival — Vienna's small expat community shares candidates quickly via Facebook groups"
        ],
        "whereToFindItems": [
            "Babysits.at — Austrian childcare platform widely used by expat families in Vienna for nanny and babysitter listings",
            "Search 'Vienna Expat Families' or 'Vienna Mums' on Facebook — active groups with personal nanny recommendations and after-school care leads",
            "International school parent networks — once your child is enrolled, the school WhatsApp/Facebook group is the fastest way to find vetted nannies and au pairs"
        ]
    },
    "healthcare": {
        "status": "estimated",
        "tip": "Register with ÖGK (Österreichische Gesundheitskasse — Austria's public health insurance fund) within the first month of starting work or arriving with a residence permit — this activates your e-card (Austrian health card) and gives you free access to all public GPs, specialists, and hospitals.",
        "items": [
            "ÖGK (Österreichische Gesundheitskasse) is Austria's main public health insurance fund. It covers all employees, registered self-employed, and registered residents. Coverage is comprehensive — GPs, specialists, hospitals, and most prescriptions.",
            "Once registered, you receive an e-card (Austrian health card with chip) — show it at every GP, specialist, and pharmacy visit. There's a small annual service fee (about €13/year) but consultations and most treatments are free.",
            "GP visits through ÖGK have no out-of-pocket cost. Specialist referrals are usually needed and waitlists for non-urgent specialists (dermatology, orthopaedics) run 6–12 weeks in the public system.",
            "Private healthcare (Privat) is widely used for faster specialist access and English-speaking doctors. A private GP consultation costs roughly $80–$150. Private health insurance (Zusatzversicherung) typically costs $80–$200 / month per adult and lets you skip waitlists and choose the doctor.",
            "AKH Wien (Allgemeines Krankenhaus — Vienna's main public university hospital) is one of Europe's largest hospitals and the standard emergency / specialist destination. Rudolfinerhaus and Wiener Privatklinik are the main private hospitals for English-speaking expat families."
        ]
    },
    "safety": {
        "status": "estimated",
        "score": 88,
        "summary": "Vienna is one of Europe's safest capitals — violent crime is rare and family neighbourhoods are calm day and night.",
        "items": [
            "Violent crime is rare in family residential districts — Döbling, Währing, Hietzing, Leopoldstadt, and Penzing are consistently low-risk. Vienna ranks among the world's safest capital cities.",
            "Pickpocketing is the main risk — particularly around Stephansplatz, Schwedenplatz, Westbahnhof, and on busy U-Bahn lines U1, U2, and U4. Keep bags in front and phones out of back pockets.",
            "Air quality in Vienna is generally good year-round — winter inversion days can briefly raise particulate levels, but nothing like Italian or Polish industrial regions.",
            "Traffic: Vienna's driving culture is calmer than southern European cities, but Ringstrasse and Gürtel boulevards are busy — teach children to use marked crossings and trams' dedicated stops.",
            "Family residential neighbourhoods are well-lit, walkable, and active in the evening — Vienna's regular Polizei (police) presence and 24/7 public transport make late-evening returns straightforward."
        ]
    },
    "cost": {
        "status": "estimated",
        "rentRange": "~$2,500 / month",
        "familyDinner": "~$70",
        "nannyRate": "~$18 / hr",
        "monthlyFamilyAllIn": "~$5,500–$8,000 / month"
    },
    "sources": {
        "visa": [
            {
                "label": "Migration.gv.at — Austria's official migration portal",
                "url": "https://www.migration.gv.at",
                "isVerified": True
            },
            {
                "label": "MA 35 Vienna — Residence and Citizenship Department",
                "url": "https://www.wien.gv.at/english/administration/civilstatus/index.html",
                "isVerified": True
            }
        ],
        "schools": [
            {
                "label": "Stadt Wien — Bildung und Schulen (city education portal)",
                "url": "https://www.wien.gv.at/bildung/",
                "isVerified": True
            }
        ],
        "healthcare": [
            {
                "label": "ÖGK — Österreichische Gesundheitskasse (public health insurance)",
                "url": "https://www.gesundheitskasse.at",
                "isVerified": True
            }
        ],
        "cost": [
            {
                "label": "Vienna Cost of Living — Numbeo",
                "url": "https://www.numbeo.com/cost-of-living/in/Vienna",
                "isVerified": True
            }
        ],
        "weather": [
            {
                "label": "NASA POWER — Climatology API (methodology)",
                "url": "https://power.larc.nasa.gov/docs/services/api/temporal/climatology/",
                "isVerified": True
            },
            {
                "label": "MERRA-2 reanalysis (meteorological source)",
                "url": "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/",
                "isVerified": True
            }
        ]
    },
    "communityLinks": [
        {
            "label": "Search 'Vienna Expats' or 'Expat Family Vienna Austria' on Facebook — active group with housing, school, and settlement advice from current residents",
            "searchQuery": "Vienna Expats Facebook group Austria",
            "url": "https://www.google.com/search?q=Vienna+Expats+Facebook+group+Austria",
            "isVerified": True
        },
        {
            "label": "Search 'Vienna Mums' on Facebook — large group for parents (English-speaking) with nanny, school, and pediatrician recommendations",
            "searchQuery": "Vienna Mums Facebook group",
            "url": "https://www.google.com/search?q=Vienna+Mums+Facebook+group",
            "isVerified": True
        }
    ],
    "faq": [
        {
            "question": "Is Vienna good for families?",
            "answer": "Yes — Vienna consistently ranks in the global top 10 for quality of life. Strengths: low crime, free public Kindergarten from age 1, excellent public transport, abundant green space (Wienerwald, Prater, Donauinsel), and a strong international school sector. Main trade-offs are German-language daily life and slow but predictable bureaucracy."
        },
        {
            "question": "How much does a family typically need per month here?",
            "answer": "Budget ~$5,500–$8,000/month for a family of four. Rent for a 3-bedroom in family districts (Döbling, Währing, Hietzing) runs $2,500–$3,800/month. International school fees of $14,000–$22,000/year are the largest additional cost — public Kindergarten and state schools are free."
        },
        {
            "question": "Is housing hard to find here?",
            "answer": "Competitive but fair. Vienna's rental market is heavily regulated — about 60% of households rent. Popular family districts move quickly, especially family-sized 3-bed flats. Most rentals are unfurnished (no kitchen, no light fixtures); budget €5,000–€10,000 for first-time setup. Plan a 4–8 week serviced apartment for arrival."
        },
        {
            "question": "Do children need international school here, or can local schools work?",
            "answer": "Both are realistic. Austrian state schools are free, well-structured, and a strong long-term option — but everything is in German. Vienna runs intensive German support for newly-arrived children. International schools (IB, British, American) cost $14,000–$28,000/year and are the easier short-term path; many families start international and transition to state schools after 1–2 years of German immersion."
        },
        {
            "question": "Is healthcare easy to access as a newcomer?",
            "answer": "Yes — once you're registered with ÖGK (Austria's public health insurance), you get an e-card (health card) and free access to GPs, specialists, and hospitals. Specialist waitlists in the public system run 6–12 weeks, so many families add private health insurance ($80–$200/month per adult) for faster access and English-speaking doctors."
        },
        {
            "question": "Do you need a car in Vienna?",
            "answer": "No. Vienna's U-Bahn, S-Bahn, tram, and bus network is one of Europe's best — most family districts are 15–25 minutes from the centre by public transport. A car is useful for weekend trips to the Austrian Alps, Czech border, or Lake Neusiedl, but city centre parking is expensive and most residential districts have permit-only parking."
        },
        {
            "question": "How difficult is the paperwork and bureaucracy after moving?",
            "answer": "Slow and document-heavy, but predictable. The order is: Meldezettel within 3 days (district office), then Anmeldebescheinigung or Aufenthaltstitel within 4 months (MA 35), then ÖGK health registration, then bank account. Allow 8–12 weeks for everything to resolve. Bring originals plus apostilled birth/marriage certificates translated by a sworn German translator."
        },
        {
            "question": "What usually surprises families after arrival?",
            "answer": "Three things: (1) most flats are unfurnished — no kitchen, no light fixtures, no curtains — budget €5,000–€10,000 for setup; (2) shops close early and most are closed Sundays — plan grocery shopping accordingly; (3) the kindness of public services. Vienna's bureaucracy is slow but every office has English-speaking staff and the experience is calm and respectful."
        }
    ],
    "weather": preserved_weather
}

cities[vidx] = vienna

# -----------------------------------------------------------------------------
# 2. CHECKLIST VISA-FIRST — for the 6 cities where visa is buried
# -----------------------------------------------------------------------------
# Strategy: find the first item with targetSection=='visa' and move it to position 0.
# If multiple visa items exist, move the FIRST visa item we encounter (preserves
# the broader visa→housing→schools order beyond it).
def reorder_visa_first(city_id):
    idx = find_idx(city_id)
    checklist = cities[idx].get("actionChecklist", [])
    if not checklist:
        return False
    # find first visa-targeted index
    visa_idx = next(
        (i for i, item in enumerate(checklist) if item.get("targetSection") == "visa"),
        None,
    )
    if visa_idx is None or visa_idx == 0:
        return False
    visa_item = checklist.pop(visa_idx)
    checklist.insert(0, visa_item)
    cities[idx]["actionChecklist"] = checklist
    return True


for cid in [
    "milan-it",
    "florence-it",
    "cascais-pt",
    "munich-de",
    "thessaloniki-gr",
    "rome-it",
]:
    moved = reorder_visa_first(cid)
    print(f"  {'✓' if moved else '·'} reorder visa-first: {cid}")

# -----------------------------------------------------------------------------
# Write back
# -----------------------------------------------------------------------------
DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")

# Sanity re-load
json.loads(DATA.read_text())
print("\nWrote", DATA)
print("Vienna sections rewritten:", list(vienna.keys()))
