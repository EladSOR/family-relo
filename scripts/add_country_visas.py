#!/usr/bin/env python3
"""
Add country-level visa fallback entries to data/countries.json for the
5 new countries we're shipping cities in: Romania, Estonia, Sweden,
Belgium, Georgia.

Cities in countries that have an entry here can omit their own visa
block (per city-template.mdc Rule 5) — the audit treats those as
covered. The renderer at app/[country]/[city]/page.tsx falls back to
this country object when dest.visa is missing.

Idempotent — safe to re-run.
"""
import json
from pathlib import Path

PATH = Path(__file__).parent.parent / "data" / "countries.json"
data = json.loads(PATH.read_text())

NEW = {
    "romania": {
        "name": "Romania",
        "visa": {
            "status": "verified",
            "summary": "Romania is an EU member and joined the Schengen Area for air and sea borders in March 2024 — EU/EEA citizens move freely. Non-EU families need a long-stay D visa from a Romanian consulate before arrival, then convert it into a residence permit at IGI (Inspectoratul General pentru Imigrări — Romania's General Inspectorate for Immigration) after landing. Romania also runs a Digital Nomad Visa for non-EU remote workers earning at least 4× the Romanian average gross monthly salary.",
            "tip": "Apostille every birth and marriage certificate before you leave home — Romanian residence permit applications need them and apostille services in Romania can take weeks.",
            "options": [
                {
                    "type": "EU / EEA citizens",
                    "anchor": "visa-eu",
                    "detailTitle": "EU / EEA citizens — what to do after arriving in Romania",
                    "duration": "No visa required — unlimited stay",
                    "description": "Move freely. After 3 months you must register your residence at IGI and obtain a CNP (Cod Numeric Personal — Romanian personal numeric code).",
                    "details": [
                        "No visa, permit, or income threshold required for entry — EU/EEA passport holders have full freedom of movement in Romania.",
                        "If staying longer than 3 months, register at IGI (Inspectoratul General pentru Imigrări — Romania's immigration authority) and apply for a Certificat de Înregistrare (registration certificate). Bring your passport, proof of accommodation, proof of income or employment, and health insurance proof.",
                        "Get your CNP (Cod Numeric Personal — Romania's personal numeric code, the equivalent of a tax/ID number) at the local DGEP (Directia Generala de Evidenta a Persoanelor — population records office). Required for renting, banking, and school enrolment.",
                        "After 5 years of continuous legal residence, you can apply for permanent residency.",
                        "Search 'IGI înregistrare cetățean UE' on Google for the latest required documents and forms."
                    ],
                    "officialLink": {
                        "label": "IGI Romania EU citizen registration official",
                        "url": "https://www.google.com/search?q=IGI+Romania+EU+citizen+registration+official",
                        "isVerified": True
                    }
                },
                {
                    "type": "Long-stay D visa (non-EU work / family)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Long-stay D visa and residence permit",
                    "duration": "D visa: 90 days entry; residence permit: typically 1 year, renewable",
                    "description": "Non-EU families apply at a Romanian consulate before travelling, then convert the D visa into a residence permit at IGI within 90 days of arrival.",
                    "details": [
                        "Apply for a long-stay D visa at the Romanian consulate in your home country before travelling. Categories include employment, family reunification, study, and self-employment. Processing typically takes 30–60 days.",
                        "Documents typically required: valid passport, proof of purpose (employment contract, family ties, school admission), apostilled criminal record check, proof of accommodation, proof of income or financial means, and travel health insurance.",
                        "After arriving in Romania, apply for a Permis de Şedere (residence permit) at IGI within the 90-day validity of your D visa. Bring all original documents.",
                        "Family reunification: spouses and dependent children of legal Romanian residents can apply for linked residence permits — apply at the same time to align timelines.",
                        "Search 'IGI Romania residence permit non-EU' on Google for the current document checklist by visa category."
                    ],
                    "officialLink": {
                        "label": "Romania long-stay D visa official Ministry of Foreign Affairs",
                        "url": "https://www.google.com/search?q=Romania+long-stay+D+visa+official+MAE",
                        "isVerified": True
                    }
                },
                {
                    "type": "Digital Nomad Visa (non-EU remote workers)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Romania Digital Nomad Visa — how to apply",
                    "duration": "1 year, renewable for 1 more year",
                    "description": "For non-EU remote employees or freelancers earning at least 4× the Romanian average gross monthly salary (~$3,950/month gross at recent levels) from non-Romanian clients or employers.",
                    "details": [
                        "Income requirement: at least 4× the Romanian average gross monthly salary — confirm the current INS (Institutul Național de Statistică — Romania's national statistics office) figure before applying. Recent benchmark is ~$3,950/month gross for the 6 months before applying.",
                        "Required documents: valid passport, proof of remote employment or freelance contracts with non-Romanian clients, 6 months of bank statements, criminal record check apostilled, private health insurance valid in Romania (~$33,000+ minimum coverage), and proof of accommodation.",
                        "Apply at the Romanian consulate in your home country before travelling — you cannot switch to this visa from inside Romania on a tourist entry.",
                        "After arriving, apply for your Permis de Şedere (residence permit) at IGI within 90 days. You'll get a CNP (personal numeric code) which unlocks renting, banking, and school enrolment.",
                        "Spouses and dependent children can apply for linked residence permits — submit applications together to align timelines."
                    ],
                    "officialLink": {
                        "label": "Romania Digital Nomad Visa official",
                        "url": "https://www.google.com/search?q=Romania+Digital+Nomad+Visa+official+IGI",
                        "isVerified": True
                    }
                }
            ]
        }
    },
    "estonia": {
        "name": "Estonia",
        "visa": {
            "status": "verified",
            "summary": "Estonia is an EU member and full Schengen Area country — EU/EEA citizens move freely. Non-EU families need a long-stay D visa before arrival, then a residence permit through PPA (Politsei- ja Piirivalveamet — Estonia's Police and Border Guard Board). Estonia pioneered the EU's first Digital Nomad Visa for non-EU remote workers earning at least €4,500/month gross.",
            "tip": "Estonia's e-Residency programme is NOT a residence visa — it's a digital ID for running an EU company online. Don't confuse the two; you still need a D visa or DNV to physically live in Estonia.",
            "options": [
                {
                    "type": "EU / EEA citizens",
                    "anchor": "visa-eu",
                    "detailTitle": "EU / EEA citizens — what to do after arriving in Estonia",
                    "duration": "No visa required — unlimited stay",
                    "description": "Move freely. After 3 months you must register your residence at the local omavalitsus (municipality) and apply for a temporary right of residence at PPA.",
                    "details": [
                        "No visa, permit, or income threshold required for entry — EU/EEA passport holders have full freedom of movement in Estonia.",
                        "Within 1 month of arrival, register your address at your local omavalitsus (municipal government). Bring your passport and rental contract or proof of accommodation.",
                        "If staying longer than 3 months, apply for a temporary right of residence at PPA (Politsei- ja Piirivalveamet — Estonia's Police and Border Guard Board). Bring passport, proof of address, and proof of income or employment.",
                        "Apply for an isikukood (Estonia's personal identification code, equivalent of a tax/ID number) — required for banking, healthcare, and school enrolment. Issued at PPA at the same appointment as your residence registration.",
                        "After 5 years of continuous legal residence, you can apply for permanent right of residence."
                    ],
                    "officialLink": {
                        "label": "PPA Estonia EU citizen residence official",
                        "url": "https://www.google.com/search?q=Estonia+PPA+EU+citizen+temporary+right+of+residence",
                        "isVerified": True
                    }
                },
                {
                    "type": "Long-stay D visa (non-EU work / family)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Long-stay D visa and residence permit",
                    "duration": "D visa: up to 1 year; residence permit: typically 2–5 years renewable",
                    "description": "Non-EU families apply at an Estonian consulate before travelling, then convert into a residence permit through PPA after arrival.",
                    "details": [
                        "Apply for a long-stay D visa at the Estonian consulate in your home country. Categories include employment, family reunification, study, and entrepreneurship. Processing typically takes 30 days.",
                        "Required documents: valid passport, proof of purpose (employment contract, family ties, school admission), apostilled criminal record check, proof of accommodation, proof of income, and private health insurance valid in Estonia.",
                        "After arriving, apply for a residence permit at PPA. Estonia is one of the most digital-friendly EU countries — most steps can be completed online once you have an Estonian ID-card or Mobile-ID.",
                        "Family reunification: spouses and dependent children of Estonian residents apply for linked permits — submit together to align timelines.",
                        "Search 'PPA Estonia residence permit non-EU' on Google for the current document checklist by category."
                    ],
                    "officialLink": {
                        "label": "Estonia residence permit PPA official",
                        "url": "https://www.google.com/search?q=Estonia+PPA+residence+permit+non-EU",
                        "isVerified": True
                    }
                },
                {
                    "type": "Digital Nomad Visa (non-EU remote workers)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Estonia Digital Nomad Visa — how to apply",
                    "duration": "1 year, renewable",
                    "description": "For non-EU remote employees or freelancers with non-Estonian employers/clients, earning at least €4,500/month gross (roughly $4,800/month).",
                    "details": [
                        "Income requirement: at least €4,500/month gross (roughly $4,800/month) for the 6 months before applying — proven via 6 months of bank statements and employment or contract documents.",
                        "Required documents: valid passport, proof of remote employment or freelance contracts with non-Estonian clients, 6 months of bank statements, apostilled criminal record check, private health insurance valid in Estonia, and proof of accommodation.",
                        "Apply at the Estonian consulate in your home country before travelling — you cannot switch to this visa from inside Estonia on a tourist entry.",
                        "After arrival, register your address with your local omavalitsus and apply for an isikukood (personal ID code) at PPA — both needed for renting, banking, and school enrolment.",
                        "The DNV is for the principal applicant only; spouses and children must apply for separate D visas (family reunification) or independent DNVs."
                    ],
                    "officialLink": {
                        "label": "Estonia Digital Nomad Visa official",
                        "url": "https://www.google.com/search?q=Estonia+Digital+Nomad+Visa+official+PPA",
                        "isVerified": True
                    }
                }
            ]
        }
    },
    "sweden": {
        "name": "Sweden",
        "visa": {
            "status": "verified",
            "summary": "Sweden is an EU member and full Schengen Area country — EU/EEA citizens move freely. Non-EU working families typically apply for a Migrationsverket (Swedish Migration Agency) work permit before travelling, sponsored by a Swedish employer. Sweden does not have a dedicated digital nomad visa.",
            "tip": "Apply for your personnummer (Sweden's personal identity number) at Skatteverket (Swedish Tax Agency) within your first week — without it, opening a bank account, signing a long-term lease, and accessing healthcare are all blocked.",
            "options": [
                {
                    "type": "EU / EEA citizens",
                    "anchor": "visa-eu",
                    "detailTitle": "EU / EEA citizens — what to do after arriving in Sweden",
                    "duration": "No visa required — unlimited stay",
                    "description": "Move freely. After 3 months you have an automatic right of residence — register with Skatteverket to get your personnummer.",
                    "details": [
                        "No visa, permit, or income threshold required for entry — EU/EEA passport holders have full freedom of movement in Sweden.",
                        "Within 1 week of arrival, register at Skatteverket (Sweden's tax agency) and apply for a personnummer (personal identity number) — required for banking, healthcare, and school enrolment. Bring passport, proof of address, and proof of income or employment.",
                        "EU/EEA citizens no longer need to register their right of residence with Migrationsverket separately — registering at Skatteverket is sufficient.",
                        "Children get their own personnummer at the same time — bring birth certificates (apostilled and translated to Swedish if not in English).",
                        "After 5 years of continuous legal residence, you can apply for permanent residence status."
                    ],
                    "officialLink": {
                        "label": "Skatteverket personnummer registration official",
                        "url": "https://www.google.com/search?q=Skatteverket+personnummer+EU+citizen",
                        "isVerified": True
                    }
                },
                {
                    "type": "Work permit (non-EU, employer-sponsored)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Sweden work permit — employer-sponsored route",
                    "duration": "Initial: typically 2 years; renewable; permanent residency after 4 years",
                    "description": "Non-EU professionals apply through Migrationsverket with a Swedish job offer meeting minimum salary thresholds.",
                    "details": [
                        "Salary threshold: at least 80% of the median Swedish salary (currently ~SEK 28,480/month, roughly $2,650). Confirm the current threshold on Migrationsverket's site before negotiating relocation.",
                        "Your Swedish employer initiates the application via Migrationsverket's online portal. Required documents: passport copies, employment contract, proof of insurance covering health, life, accident, and pension.",
                        "Processing time: typically 1–4 months depending on whether your employer is in the certified employer programme (faster) or not.",
                        "Family permits: spouses and dependent children can apply for linked permits with full work and study rights. Submit applications together to align timelines.",
                        "After arrival, register at Skatteverket for a personnummer and apply for an ID-card (Swedish ID card) at Skatteverket once your personnummer is issued.",
                        "Permanent residency available after 4 years of continuous work permit — a major draw for skilled families compared to many EU countries."
                    ],
                    "officialLink": {
                        "label": "Sweden work permit Migrationsverket official",
                        "url": "https://www.google.com/search?q=Migrationsverket+Sweden+work+permit+non-EU",
                        "isVerified": True
                    }
                }
            ]
        }
    },
    "belgium": {
        "name": "Belgium",
        "visa": {
            "status": "verified",
            "summary": "Belgium is an EU member and full Schengen Area country — EU/EEA citizens move freely. Non-EU working families typically apply for a Single Permit (combined work + residence permit) sponsored by a Belgian employer. Belgium does not have a dedicated digital nomad visa.",
            "tip": "Within 8 days of arrival you must register at your local commune (gemeente in Dutch / commune in French) — this triggers a police check at your address and unlocks your residence card. Skip this and renting, banking, and school enrolment all stall.",
            "options": [
                {
                    "type": "EU / EEA citizens",
                    "anchor": "visa-eu",
                    "detailTitle": "EU / EEA citizens — what to do after arriving in Belgium",
                    "duration": "No visa required — unlimited stay",
                    "description": "Move freely. Within 8 days of arrival you must register at your local commune and obtain an Annex 8 (registration certificate).",
                    "details": [
                        "No visa, permit, or income threshold required for entry — EU/EEA passport holders have full freedom of movement in Belgium.",
                        "Within 8 days of moving into your Belgian address, register at your local commune (gemeente in Dutch-speaking areas, commune in French-speaking areas, Stadt in German-speaking areas). Bring passport, rental contract, and proof of income or employment.",
                        "After registration, a local police officer will visit your address to verify you live there — this typically happens within 2–6 weeks. You must be at home when they call (they leave a note if not).",
                        "Once verified, you receive an Annex 8 (registration certificate for EU citizens) and apply for a Belgian eID card at the commune. Required for banking, healthcare, and school enrolment.",
                        "After 5 years of continuous legal residence, you can apply for permanent residence."
                    ],
                    "officialLink": {
                        "label": "Belgium commune registration EU citizen official",
                        "url": "https://www.google.com/search?q=Belgium+commune+registration+EU+citizen",
                        "isVerified": True
                    }
                },
                {
                    "type": "Single Permit (non-EU work + residence)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Single Permit — Belgium's combined work and residence route",
                    "duration": "Typically 1–3 years; renewable",
                    "description": "Belgium's Single Permit combines work authorisation and residence into one application, processed by the relevant region (Flanders, Wallonia, or Brussels-Capital).",
                    "details": [
                        "Your Belgian employer initiates the application with the relevant regional authority (VDAB/Vlaanderen for Flanders, Forem for Wallonia, Actiris for Brussels). Salary thresholds vary by region — confirm with your employer before negotiating relocation.",
                        "Required documents: passport, employment contract, apostilled diploma equivalency, criminal record check, proof of health insurance, and proof of accommodation.",
                        "Processing time: typically 2–4 months from regional approval to consular visa stamp.",
                        "Family permits: spouses and dependent children apply for linked permits via family reunification — submit together to align timelines.",
                        "After arrival, register at your local commune within 8 days. The police verification visit must happen before you receive your Belgian residence card (the eID for foreigners).",
                        "Search 'Belgium Single Permit official' on Google for the current regional thresholds and forms."
                    ],
                    "officialLink": {
                        "label": "Belgium Single Permit official",
                        "url": "https://www.google.com/search?q=Belgium+Single+Permit+work+residence",
                        "isVerified": True
                    }
                }
            ]
        }
    },
    "georgia": {
        "name": "Georgia",
        "visa": {
            "status": "verified",
            "summary": "Georgia (the country, not the US state) offers one of the most generous visa-free policies in the world: citizens of 95+ countries — including most Western nations, Israel, Japan, and the Gulf — can stay visa-free for up to 1 year per entry. Long-term residence routes include investment, work, and the Remotely from Georgia digital nomad programme.",
            "tip": "The 1-year visa-free stay resets on each entry — you can leave to neighbouring Turkey or Armenia for a few hours and re-enter for another full year. This is widely used by long-staying expats but if you want stability, get a residence permit instead.",
            "options": [
                {
                    "type": "Visa-free 1-year stay",
                    "anchor": "visa-tourist",
                    "detailTitle": "Georgia 1-year visa-free entry — how it works",
                    "duration": "Up to 365 days per entry for 95+ nationalities; resets on re-entry",
                    "description": "Citizens of most Western countries enter Georgia visa-free for a full year per entry. No paperwork, no fees, no income threshold. This is the main route most expat families use to scout.",
                    "details": [
                        "Eligible nationalities (citizens of EU/EEA, US, UK, Canada, Australia, Israel, Japan, GCC, and 80+ others) can stay up to 365 days per entry — confirm your passport is on the official list at the Ministry of Foreign Affairs of Georgia website before flying.",
                        "Working remotely for a non-Georgian employer is generally tolerated under the 1-year rule but does not give you Georgian tax residency or formal work rights.",
                        "Children need their own passport stamps — each family member is on their own 1-year clock.",
                        "Practical use: many families spend the first 6–12 months on this visa-free entry while deciding whether to apply for a longer-term residence permit.",
                        "The 1-year clock resets on each entry — leave to Turkey, Armenia, Azerbaijan, or any country and re-enter for another full year. Border officers can occasionally ask follow-up questions on long-running rolling entries.",
                        "Search 'Ministry of Foreign Affairs Georgia visa free' on Google for the current eligible-nationality list."
                    ],
                    "officialLink": {
                        "label": "Georgia visa-free entry official MFA",
                        "url": "https://www.google.com/search?q=Georgia+visa+free+entry+MFA",
                        "isVerified": True
                    }
                },
                {
                    "type": "Remotely from Georgia (digital nomad programme)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Remotely from Georgia — for remote workers earning $2,000+/month",
                    "duration": "Initial 360 days; renewable on application",
                    "description": "For non-Georgian remote workers earning at least $2,000/month, with proof of foreign employment or freelance income.",
                    "details": [
                        "Income requirement: at least $2,000/month proven via 6 months of bank statements, plus a clean record from your home country.",
                        "Apply online via the Government of Georgia's Remotely from Georgia portal — typically processed within 10 working days. No consulate visit required.",
                        "Required documents: passport, proof of remote employment or freelance contracts, 6 months of bank statements, and travel health insurance.",
                        "Spouses and dependent children can apply on the same online application — listed as accompanying family members.",
                        "Once approved, you can enter and exit Georgia freely for the duration of the programme. Tax residency only kicks in after 183+ days physically in Georgia in a calendar year — Georgia has a flat 1% income tax for foreign-source income under specific conditions; consult a Georgian tax advisor.",
                        "Search 'Remotely from Georgia application' on Google for the current portal."
                    ],
                    "officialLink": {
                        "label": "Remotely from Georgia official",
                        "url": "https://www.google.com/search?q=Remotely+from+Georgia+digital+nomad+official",
                        "isVerified": True
                    }
                },
                {
                    "type": "Residence permit (work / investment / family)",
                    "anchor": "visa-dnv",
                    "detailTitle": "Georgia residence permit — long-term routes",
                    "duration": "Typically 6 months to 6 years depending on category; renewable",
                    "description": "For families wanting formal long-term residence beyond the visa-free 1-year cycle. Routes include work, investment, study, family, and short-term temporary residence.",
                    "details": [
                        "Categories: work, investment ($100,000+ in real estate or business), family reunification, study, and short-term residence. Apply through PSDA (Public Service Development Agency) at Public Service Halls in Tbilisi or other major cities.",
                        "Required documents: valid passport, proof of purpose (employment contract, investment proof, family ties), apostilled birth and marriage certificates if applicable, proof of accommodation, and clean criminal record.",
                        "Processing time: typically 30 days for routine applications; 10 days for express processing (higher fee).",
                        "Family permits: spouses and dependent children apply for linked permits — submit applications together at the same Public Service Hall to align timelines.",
                        "After 6 years of continuous residence, permanent residence becomes available — naturalisation possible after 10 years.",
                        "Search 'PSDA Georgia residence permit' on Google for the current document checklist by category."
                    ],
                    "officialLink": {
                        "label": "Georgia residence permit PSDA official",
                        "url": "https://www.google.com/search?q=PSDA+Georgia+residence+permit",
                        "isVerified": True
                    }
                }
            ]
        }
    }
}


def main():
    added = []
    for slug, body in NEW.items():
        if slug in data:
            print(f"  SKIP {slug} — already present")
            continue
        data[slug] = body
        added.append(slug)
    PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"\nAdded {len(added)} country visa entries: {added}")


if __name__ == "__main__":
    main()
