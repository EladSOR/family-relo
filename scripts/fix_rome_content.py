#!/usr/bin/env python3
"""
Rome city entry has Milan-template residue (same kind of bug as Vienna had).
This script surgically replaces only the corrupted fields with accurate
Rome-specific content.

Wrong (Milan):                 Correct (Rome):
  Porta Venezia / Brera /       Prati, Parioli, Trieste-Salario, Aventino,
  Isola / Navigli / Sempione    Monteverde, Trastevere, EUR, Flaminio
  De Angeli                     (Milan neighbourhood)
  "Romeo Centrale"              Roma Termini (typo'd find/replace)
  Ospedale San Raffaele         Policlinico Gemelli, Bambino Gesù
  Po Valley pollution           Rome summer heat, traffic
  Lake Como, Alps proximity     Tuscany, Mediterranean coast, Naples
  Finance/fashion/design        Government, diplomacy, NGOs (FAO/WFP),
                                Vatican, media (RAI), tourism, pharma
  Metro lines 2 and 3           Metro A, B, B1, C
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())

ROME_PATCH = {
    "tagline": (
        "Italy's capital — strong international school circuit, top public "
        "healthcare, and an EU passport-free move for European families"
    ),
    "summary": (
        "Rome offers a high standard of living, an established international "
        "school sector, and Italy's free public healthcare system (SSN — "
        "Servizio Sanitario Nazionale) for residents. The trade-offs are slow "
        "Italian bureaucracy, summer heat, and one of Italy's tighter rental "
        "markets."
    ),
    "familyFit": {
        "bestFor": [
            "Families relocating for diplomatic, government, NGO (FAO, WFP, IFAD), or international organisation roles",
            "EU/EEA families who want a low-friction move with no visa process — only a Codice Fiscale and address registration are required after arrival",
            "Parents who want access to an established international school circuit (IB, British, American) in a major European capital",
            "Families who value Mediterranean climate and proximity to Tuscany, the Amalfi coast, and the rest of Italy by high-speed rail",
        ],
        "watchOutFor": [
            "Rome is expensive — rent in family neighbourhoods (Prati, Parioli, EUR) and international school fees are well above the Italian national average",
            "Italian bureaucracy is genuinely slow — the Permesso di Soggiorno (residence permit) and school registration processes require patience and preparation",
            "Roman summers (July–August) are very hot and humid and the city largely empties — not the best time to arrive",
            "Air quality dips in winter due to traffic and domestic heating; not as severe as northern Italy but families with asthma or young children should factor it in",
        ],
    },
    "housing": {
        "status": "estimated",
        "summary": (
            "Rome is one of Italy's most expensive rental markets. Family-friendly "
            "areas cluster in Prati, Parioli, Trieste-Salario, Aventino, "
            "Monteverde, EUR, and Flaminio — all within reach of international "
            "schools and the city centre."
        ),
        "bestAreas": [
            "Prati",
            "Parioli",
            "Trieste-Salario",
            "Aventino",
            "Monteverde",
            "EUR",
            "Trastevere",
        ],
        "searchPortalsIntro": [
            "These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).",
            "Search 'Roma' (Italian for Rome) or the neighbourhood name (e.g. 'Prati', 'Parioli', 'Monteverde') inside each platform to filter local listings.",
            "Tip: arrive in Rome with a short-stay Airbnb or serviced apartment booked for the first 2–4 weeks — the rental market moves fast and you need time to view properties in person.",
        ],
        "searchPortals": [
            {
                "label": "Immobiliare.it — Italy's largest property rental platform",
                "url": "https://www.immobiliare.it",
                "isVerified": True,
            },
            {
                "label": "Idealista.it — major Italian and European property portal",
                "url": "https://www.idealista.it",
                "isVerified": True,
            },
            {
                "label": "Casa.it — Italian property portal with strong Rome listings",
                "url": "https://www.casa.it",
                "isVerified": True,
            },
            {
                "label": "Facebook groups — search: 'Rome Expats Housing' or 'Affitti Roma' (community listings and direct landlord deals)",
                "url": "https://www.google.com/search?q=Rome+Expats+Housing+Facebook+group",
                "isVerified": True,
            },
        ],
        "typicalPrices": [
            "1-bed apartment, Prati or Trastevere: ~$1,500–$2,050 / month",
            "2-bed apartment, Parioli or Aventino: ~$2,150–$3,000 / month",
            "3-bed apartment, Prati or Parioli: ~$2,600–$3,800 / month",
            "3-bed apartment, EUR or Monteverde: ~$2,400–$3,450 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$2,500–$4,000 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport",
            "Codice Fiscale (Italian tax code — required on every rental contract)",
            "3 months of bank statements or an Italian employment contract — landlords often ask for both",
            "2–3 months deposit is standard in Rome (sometimes 3 months for international tenants without an Italian guarantor)",
            "Confirm contract type before signing — '4+4' (standard residential) or '3+2' (transitional) is normal; tourist contracts under 18 months do not give you residency rights",
        ],
    },
    "schools": {
        "status": "curated",
        "summary": (
            "Rome has the widest choice of international schools in Italy after "
            "Milan. Most have limited places and require applications well in "
            "advance — plan 12–18 months ahead."
        ),
        "publicSystem": (
            "Italian state schools are free and well structured but all "
            "instruction is in Italian. State schools are a realistic option "
            "only if your children already speak Italian or you are willing to "
            "enrol them in an intensive Italian language programme first. Most "
            "expat families with English-speaking children use the international "
            "school circuit."
        ),
        "internationalOptions": (
            "Rome has a well-established international school sector with IB, "
            "British, American, and French curriculum schools. Most cluster in "
            "the northern and northwestern suburbs (Cassia, La Storta, Olgiata) "
            "and in the Parioli, EUR, and Trastevere areas. Fees range from "
            "roughly $11,000 to $27,000+ per year. Places are limited — apply "
            "early."
        ),
        "languageNotes": (
            "Italian state schools teach entirely in Italian. International "
            "schools teach in English, with French and other languages also "
            "available at the larger schools. Children who attend state schools "
            "without prior Italian typically need 1–2 years to reach full "
            "academic fluency."
        ),
        "tip": (
            "Apply to international schools before booking your flights — most "
            "Rome international schools have waitlists and do not reserve "
            "places without a completed application and supporting documents."
        ),
        "options": [
            {
                "type": "IB curriculum international schools",
                "description": "The primary choice for English-speaking expat families in Rome. IB Diploma and Primary Years Programme available. Limited places per year group — apply 12–18 months ahead.",
                "fees": "$15,000–$27,000+/year typical",
            },
            {
                "type": "British curriculum international schools",
                "description": "British A-Level and GCSE pathway schools with several long-established options in Rome's northern suburbs and central areas.",
                "fees": "$13,000–$24,000/year typical",
            },
            {
                "type": "American curriculum international schools",
                "description": "US-style curriculum with AP courses. Popular with American diplomatic and corporate families. Concentrated in the northern suburbs.",
                "fees": "$15,000–$26,000/year typical",
            },
            {
                "type": "Italian state schools",
                "description": "Free for all residents. All instruction is in Italian. A realistic option for families with children who already speak Italian or who plan a long-term stay and prioritise language integration.",
                "fees": "Free (public)",
            },
        ],
    },
    "childcare": {
        "status": "estimated",
        "summary": (
            "Rome has both public and private nursery options. Public asili "
            "nido (nurseries) are subsidised but heavily oversubscribed — "
            "private nurseries are more accessible but expensive."
        ),
        "daycareItems": [
            "Asilo nido (nursery/daycare — Italian term for state-run or authorised nursery for children 0–3) accepts children from 3 months old. Public asili nido are subsidised but have long waiting lists in Rome — apply as soon as your arrival date is confirmed",
            "Private asilo nido fees: roughly $750–$1,300/month. Public asili nido fees are income-tested and significantly lower — but availability is limited",
            "Scuola dell'infanzia (Italian preschool for children 3–6) is free or very low cost in the state system — enrolment requires residency registration and a Codice Fiscale",
            "Visit nurseries in person before committing — quality varies significantly between private providers; ask about staff-to-child ratios and outdoor space",
        ],
        "nannyItems": [
            "Full-time nannies (often called tata or babysitter) charge roughly $13–$19/hr in Rome — rates are higher than in southern Italy but lower than Milan",
            "Many nannies in Rome speak English, particularly those who have worked with diplomatic or expat families previously — ask specifically when searching",
            "Part-time nannies and after-school childcare (for school-age children) are common arrangements among expat families",
            "Start your nanny search at least 6–8 weeks before arrival — good candidates go quickly, particularly those with English language skills",
        ],
        "whereToFindItems": [
            "Babysits.com — international childcare platform with strong Italian listings used by expat families in Rome",
            "Tata.it and Bakeca.it — Italian classifieds widely used for nanny and tata listings in Rome",
            "Search 'Rome Expat Families' or 'Mamme Roma Expat' on Facebook — community groups for personal recommendations and nanny introductions",
            "Word of mouth through international schools and embassy/NGO communities — many of the best Rome nannies are found this way",
        ],
    },
    "healthcare": {
        "status": "estimated",
        "tip": (
            "Register with your local ASL (Azienda Sanitaria Locale) within "
            "the first month — this activates your access to Italy's SSN "
            "(public health system) and assigns you a GP."
        ),
        "items": [
            "Italy's SSN (Servizio Sanitario Nazionale — public national health system) covers all registered residents including EU/EEA citizens and non-EU residents with a valid Permesso di Soggiorno (residence permit).",
            "Register with your local ASL (Azienda Sanitaria Locale — local health authority) after completing your residency registration. Bring your passport, Codice Fiscale, and proof of address. You will receive a tessera sanitaria (health card) and be assigned a GP.",
            "GP and specialist visits through the SSN require a small co-payment (called a ticket) of roughly $16–$45 per visit. Emergency care and hospitalisation are covered at no cost.",
            "Private healthcare is widely used in Rome for faster access and English-speaking doctors. A private GP consultation costs roughly $90–$160. International private medical insurance (IPMI — International Private Medical Insurance) is recommended for non-EU residents while awaiting SSN registration.",
            "Policlinico Universitario Agostino Gemelli is Rome's largest teaching hospital and a strong choice for adults. Ospedale Pediatrico Bambino Gesù — the Vatican-affiliated children's hospital — is one of Europe's leading paediatric centres and the default for serious child cases.",
        ],
    },
    "safety": {
        "status": "estimated",
        "score": 80,
        "summary": (
            "Rome is generally safe for families. The main daily risks are "
            "pickpocketing in tourist zones and Roman traffic — not violent "
            "crime."
        ),
        "items": [
            "Violent crime is relatively rare in family residential areas — Prati, Parioli, Trieste-Salario, Aventino, and Monteverde are low-risk neighbourhoods for everyday family life",
            "Pickpocketing is the main daily risk — particularly around Roma Termini (the central rail station), the Vatican, the Colosseum, Trevi Fountain, and busy Metro lines A and B. Keep bags in front and phones out of back pockets",
            "Roman traffic is the primary daily hazard — driving culture is aggressive, scooters weave through stopped cars, and pedestrian crossings are not always respected. Teach children road awareness early",
            "Family residential neighbourhoods (Prati, Parioli, Aventino, Monteverde) are well-lit, active, and safe for evening walks with children",
            "Heat is a real summer hazard — July and August regularly hit 35°C+. Plan around midday heat with young children and avoid arriving during peak summer if possible",
        ],
    },
    "cost": {
        "status": "estimated",
        "monthlyFamilyAllIn": "~$5,500–$8,000 / month",
        "rentRange": "~$3,000 / month",
        "familyDinner": "~$70",
        "nannyRate": "~$15 / hr",
    },
    "communityLinks": [
        {
            "label": "Search 'Rome Expats' or 'Expat Family Rome Italy' on Facebook — active community with housing, school, and settlement advice",
            "searchQuery": "Rome Expats Facebook group",
            "url": "https://www.google.com/search?q=Rome+Expats+Facebook+group+Italy",
            "isVerified": True,
        },
        {
            "label": "Search 'Mamme Roma Expat' on Facebook — Rome-based parent group with on-the-ground advice from international families",
            "searchQuery": "Mamme Roma Expat Facebook",
            "url": "https://www.google.com/search?q=Mamme+Roma+Expat+Facebook+group",
            "isVerified": True,
        },
    ],
    "faq": [
        {"question": "Is Rome good for families?", "answer": "Good — Rome offers a high standard of living, an established international school circuit, and Italy's free public healthcare system. The main trade-offs are high cost, summer heat, and notoriously slow Italian bureaucracy."},
        {"question": "How much does a family typically need per month here?", "answer": "Budget $5,500–$8,000/month for a family of four. Rent for a 3-bedroom in Prati, Parioli, or EUR runs $2,600–$3,800/month. International school fees of $13,000–$24,000/year are the largest additional cost."},
        {"question": "Is housing hard to find here?", "answer": "Yes — Rome has a tight rental market and family neighbourhoods (Prati, Parioli, Trastevere, Aventino, Monteverde) move fast. Italian landlords usually require a Codice Fiscale (Italian tax code) and proof of income before signing — hard to have as a new arrival. Budget for a furnished serviced apartment for the first 4–8 weeks while you search in person."},
        {"question": "Do children need international school here, or can local schools work?", "answer": "International school is recommended for non-Italian-speaking families. State schools are free but teach entirely in Italian. Rome has a strong international school sector at $13,000–$24,000/year. Many families use it for at least the first few years until children pick up Italian."},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": "Yes, once you have your Codice Fiscale and residency. Register with the SSN (Servizio Sanitario Nazionale — Italy's public health system) at your local ASL (Azienda Sanitaria Locale — local health authority). Private health insurance at $100–$200/month per person speeds up specialist access."},
        {"question": "Do you need a car in Rome?", "answer": "Not in central or semi-central areas — Rome has Metro lines A, B, B1, and C plus extensive bus and tram coverage. Most families in Prati, Parioli, Trastevere, and Monteverde live car-free. A car is useful if you live in EUR or the northern suburbs (near international schools) and for weekend trips to the coast or Tuscany."},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": "Slow and document-heavy. Start with your Codice Fiscale at any Agenzia delle Entrate (tax office). Then register your address at the Ufficio Anagrafe (civil registry, part of your Comune). Then apply for a Permesso di Soggiorno (residence permit) at the local Questura (police HQ) if non-EU. Italian bureaucracy is predictable but slow — allow 2–3 months for everything to resolve."},
        {"question": "What usually surprises families after arrival?", "answer": "How much summer changes the city — Rome empties in August and many shops, schools, and offices close or run reduced hours. How car-free family life can be in central neighbourhoods despite Italy's reputation. And how much cash culture lingers — keep a small wallet for markets, taxis, and small restaurants that prefer cash."},
    ],
}


def main():
    found = False
    for c in cities:
        if c["id"] != "rome-it":
            continue
        found = True
        for k, v in ROME_PATCH.items():
            c[k] = v
    if not found:
        print("rome-it not found")
        return
    DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")
    print("rome-it patched.")


if __name__ == "__main__":
    main()
