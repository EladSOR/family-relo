#!/usr/bin/env python3
"""
Bring city-level visa.options[].details to ≥4 actionable bullets where the
audit flagged them as thin. Each addition explains *what / when / why* and
points to a Google search where there's no stable official URL (per
external-links.mdc).
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())

VISA_PATCH = {
    "singapore-sg": {
        "visa-tourist": [
            "Check ICA (Immigration & Checkpoints Authority — Singapore's border agency) rules for your passport before booking — exact visa-free days vary by nationality.",
            "Use a short stay to scout schools, neighbourhoods (East Coast, River Valley, Bukit Timah), and condos — but secure an Employment Pass before children start long-term schooling.",
            "Overstaying is taken seriously in Singapore — track your permit dates carefully and leave before the stamped exit date.",
            "Search 'ICA Singapore visa requirements' on Google to check the official entry rules for your passport.",
        ],
    },
    "tokyo-jp": {
        "visa-tourist": [
            "Many nationalities get 90-day visa-free entry — confirm your passport's status with Japan's Ministry of Foreign Affairs (MOFA) before booking.",
            "Use a short visit to trial commutes (e.g. Setagaya, Minato, Meguro corridors) and school options before committing to a longer move.",
            "Working on a tourist entry — including remote work for a foreign employer — is high-risk and not allowed under tourist status.",
            "Carry passports for every family member, including children, at every check-in — Japanese hotels are required to record passport details for foreign guests.",
            "Search 'MOFA Japan visa exemption countries' on Google for the official chart.",
        ],
    },
    "taipei-tw": {
        "visa-tourist": [
            "Many Western passports get 90 days visa-free entry — others need a visitor visa with a printed exit date. Check the Bureau of Consular Affairs (BOCA) chart for your nationality.",
            "Use trips to view Tianmu, Da'an, and Xinyi neighbourhoods plus the international school cluster around Tianmu and Yangmingshan.",
            "Tourist entry does not allow work — including remote work for a foreign employer — so secure an employer sponsorship before any long-term move.",
            "Overstay penalties in Taiwan are strict — fines escalate with the length of overstay and can lead to multi-year re-entry bans.",
            "Search 'BOCA Taiwan visa exemption' on Google for the official entry rules by passport.",
        ],
        "visa-dnv": [
            "HR at your sponsoring employer usually guides medical checks, document apostille, and the work permit application through the Ministry of Labor.",
            "After arrival, apply for your ARC (Alien Resident Certificate — Taiwan's residence card) at the National Immigration Agency within 15 days.",
            "Dependants apply with linked documents (marriage certificate, birth certificates — apostilled and translated) — start gathering these before the move.",
            "Once you have an ARC, you can register with the National Health Insurance (NHI) system after 6 months of legal residence.",
            "Search 'Taiwan work permit employer sponsor' on Google for the latest steps from the Ministry of Labor.",
        ],
    },
    "kuala-lumpur-my": {
        "visa-tourist": [
            "Many nationalities get 14–90 days visa-free entry or eVisa — confirm your exact entitlement on Malaysia's official Immigration Department website before flying.",
            "Tourist entry does not allow work — including remote work for a foreign employer — secure an Employment Pass or DE Rantau Nomad Pass before any long-term move.",
            "Carry onward tickets and proof of accommodation — Malaysian immigration officers may ask at the border, particularly for longer scouting trips.",
            "Use a scouting trip to view Mont Kiara, Bangsar, and Damansara Heights — the three main international school catchments.",
            "Search 'Malaysia immigration eVisa requirements' on Google for the official entry rules by passport.",
        ],
        "visa-dnv": [
            "Employment Pass (EP) categories are tied to monthly salary thresholds — confirm the latest minimum on the Ministry of Human Resources site before negotiating relocation.",
            "Dependants (spouse and children under 18) usually receive linked Dependant Pass approvals — your sponsoring employer files for both at the same time.",
            "International schools in Mont Kiara and Bangsar usually require a copy of your EP approval letter or in-progress application before final enrolment.",
            "Once you have your EP, you can apply for an Iqama-equivalent identity card and open a local bank account at Maybank, CIMB, or Public Bank.",
            "Search 'Malaysia Employment Pass requirements MITI' on Google for the latest salary thresholds and document list.",
        ],
    },
    "buenos-aires-ar": {
        "visa-tourist": [
            "Many passports get about 90 days visa-free entry per stay — some nationalities (e.g. US, Canada, Australia) can extend once in-country for another ~90 days at the Dirección Nacional de Migraciones.",
            "Tourist entry does not allow salaried local work — secure a residencia temporaria (temporary residency) for any long-term plans.",
            "Use a scouting trip to view Belgrano, Núñez, Recoleta, and Palermo — the main family neighbourhoods near international schools.",
            "Argentina's currency moves fast — confirm whether your rental contract is in Argentine pesos or US dollars (most expat-targeted contracts are in USD) before signing.",
            "Search 'Argentina migraciones turista' on Google for the official entry rules by passport and current extension procedures.",
        ],
        "visa-dnv": [
            "Employer-sponsored, family-tie, and rentista (passive income) routes all exist — gather apostilled documents (birth certificates, criminal record checks, marriage certificates) early as Argentina requires them for almost every category.",
            "Apply for your DNI (Documento Nacional de Identidad — Argentina's national ID) at the Registro Nacional de las Personas (RENAPER) once your residency is approved — required for school enrolment, banking, and almost every transaction.",
            "Dependants need linked filings (spouse, children) — apply for them at the same time as your main residency to keep timelines aligned.",
            "Bring USD cash for the first weeks — Argentina's currency controls (cepo cambiario) and shifting blue-dollar / official-dollar rates make local banking a learning curve.",
            "Search 'Argentina residencia temporaria migraciones' on Google for the latest category requirements.",
        ],
    },
    "lima-pe": {
        "visa-tourist": [
            "Many passports get up to 90 days visa-free entry — the border officer can grant less, so check the entry stamp in your passport before planning your stay.",
            "Tourist extensions in Peru are limited and discretionary — do not plan a long stay on rolling tourist entries.",
            "Use a scouting trip to view Miraflores, San Isidro, La Molina, and Surco — the main family neighbourhoods near international schools.",
            "Coastal winter (May–November) brings months of garúa (Lima's persistent coastal drizzle) and high humidity — test housing ventilation and natural light when scouting.",
            "Search 'Peru migraciones requisitos turista' on Google for the official entry rules by passport.",
        ],
        "visa-dnv": [
            "Antecedentes policiales (police certificates) and birth/marriage certificates often need apostille from your home country before submission — start gathering them 2–3 months before your move.",
            "Once approved, you receive a carné de extranjería (Peruvian foreigner ID) — required for school enrolment, banking, and healthcare registration.",
            "Dependants (spouse and children) need linked filings — submit them at the same time as your main residency to keep timelines aligned.",
            "International schools in La Molina and Surco may reference your migration status on enrolment forms — confirm school requirements before applying for the visa.",
            "Search 'Peru residencia trabajo migraciones' on Google for the latest employer-sponsored route requirements.",
        ],
    },
}


def main():
    for c in cities:
        cid = c["id"]
        if cid not in VISA_PATCH:
            continue
        for opt in c.get("visa", {}).get("options", []):
            anchor = opt.get("anchor")
            if anchor in VISA_PATCH[cid]:
                opt["details"] = VISA_PATCH[cid][anchor]
                print(f"  {cid} :: {anchor} :: {len(opt['details'])} bullets")
    DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
