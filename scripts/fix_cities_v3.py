#!/usr/bin/env python3
"""
Comprehensive quality rewrite for all 19 new cities.
Fixes: checklists, schools sections, housing summaries, option descriptions.
Written for humans — full sentences, prices, acronyms explained inline.
"""
import json, copy

with open("data/cities.json", "r", encoding="utf-8") as f:
    cities = json.load(f)

def patch(cities, city_id, patches):
    for city in cities:
        if city["id"] == city_id:
            _apply(city, patches)
            return
    raise ValueError(f"City {city_id} not found")

def _apply(obj, patches):
    for key, value in patches.items():
        if isinstance(value, dict) and key in obj and isinstance(obj[key], dict):
            _apply(obj[key], value)
        else:
            obj[key] = value

# ─────────────────────────────────────────────────────────────────────────────
# INTERNATIONAL CITIES
# ─────────────────────────────────────────────────────────────────────────────

# ── BOGOTÁ ──────────────────────────────────────────────────────────────────
patch(cities, "bogota-co", {
    "actionChecklist": [
        {
            "label": "Check whether your passport qualifies for a 90-day tourist entry to Colombia — most Western passports do. If you plan to stay longer than 6 months, apply for a Visa de Residente or Cédula de Extranjería (Colombia's official foreigner ID card) through Cancillería de Colombia (Colombia's foreign ministry).",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Usaquén or Chicó 6–8 weeks before arriving — these are Bogotá's safest and most family-friendly neighborhoods. Furnished 3-bedroom apartments run ~$1,500–$2,500/month. Use Finca Raíz (Colombia's main rental portal) to browse listings.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to bilingual IB or US-curriculum schools in north Bogotá 12–18 months before your move — the best schools fill their August intake by January and do not hold spots without a deposit.",
            "targetSection": "schools"
        },
        {
            "label": "Arrange private health insurance before arriving — Colombia's mandatory EPS system (Entidades Promotoras de Salud — the national health insurance network) takes 3–6 months to activate for new arrivals. SURA and SANITAS both offer expat bridging plans from ~$150/month.",
            "targetSection": "healthcare"
        },
        {
            "label": "Register at Migración Colombia (Colombia's immigration authority) within 15 days of arrival if you hold a visa — bring your passport, visa, and rental contract. Missing this deadline risks a fine.",
            "targetSection": "residency"
        },
        {
            "label": "Open a Bancolombia or Davivienda bank account within your first month — you need your RUT (Registro Único Tributario — Colombia's tax ID, issued by DIAN, the national tax authority) first. DIAN offices are in every major neighborhood.",
            "targetSection": "banking"
        },
        {
            "label": "Visit at least 3 guarderías (nurseries) in person in Usaquén or Rosales — quality bilingual nurseries fill quickly. Budget ~$600–$1,200/month for a full-time spot.",
            "targetSection": "childcare"
        },
        {
            "label": "Bogotá sits at 2,600 meters (8,530 ft) above sea level — prepare for altitude adjustment in the first 1–2 weeks: expect fatigue, mild headaches, and shortness of breath. Children usually adapt faster than adults.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Bogotá's best family neighborhoods are in the north of the city — Usaquén, Chicó, Rosales, and El Nogal. These are safe, walkable, and close to the top bilingual schools. A furnished 3-bedroom apartment in these areas runs ~$1,500–$2,500/month. The south and city center are significantly cheaper but not recommended for newly arrived families who don't yet know the city."
    },
    "schools": {
        "summary": "Bogotá has one of Latin America's strongest bilingual school markets, concentrated in the northern neighborhoods of Usaquén, Chicó, and La Calleja. British, IB, and US-curriculum schools are widely available at fees that are a fraction of equivalent schools in Europe or North America.",
        "publicSystem": "Colombia's public schools follow the curriculum set by the Secretaría de Educación del Distrito (SED — Bogotá's district education authority) and teach entirely in Spanish. Academically solid by regional standards, but not a realistic option for expat children arriving without Spanish fluency.",
        "internationalOptions": "The best international and bilingual schools cluster in north Bogotá along the Autopista Norte and Usaquén corridors. IB Diploma and bilingual (Spanish/English) programs are standard. Annual fees range from ~$9,500 to $25,000/year. Apply 12–18 months in advance — the most popular schools fill their August intake by February.",
        "languageNotes": "Private bilingual schools split instruction 50/50 Spanish and English from primary level. Children arriving with no Spanish will be immersed from day one and typically reach conversational fluency within 6 months. English-medium support in the upper IB years fades — most instruction shifts toward Spanish at that stage.",
        "tip": "Tour schools in person in November–December and submit applications by January — waitlists for the August intake close early and cannot be bypassed with a late application or deposit.",
        "options": [
            {
                "type": "Private bilingual schools (Spanish/English, IB or US curriculum)",
                "description": "The standard choice for expat families — a mix of Colombian and international students, bilingual instruction from primary, and IB Diploma in the upper years. Most are located in Usaquén and Chicó. Fees: ~$9,500–$25,000/year.",
                "fees": "$9,500–$25,000/year typical"
            },
            {
                "type": "Public schools (free, Spanish-medium)",
                "description": "Free and academically functional, but all instruction is in Spanish. A realistic option only for families planning a stay of 2+ years with young children ready for full Spanish immersion.",
                "fees": "Free"
            }
        ]
    }
})

# ── HO CHI MINH CITY ─────────────────────────────────────────────────────────
patch(cities, "ho-chi-minh-city-vn", {
    "actionChecklist": [
        {
            "label": "Apply for a Vietnam e-visa (90 days, single-entry) at evisa.xuatnhapcanh.gov.vn before flying — most nationalities qualify. The process takes 3 business days and costs $25. If you plan to stay longer, arrange a multiple-entry visa at a Vietnamese consulate before departure.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in District 2 (Thu Duc City) or District 7 (Phu My Hung) — these are the two main expat and family neighborhoods in Ho Chi Minh City, each with international schools, parks, and English-speaking communities. A furnished 3-bedroom runs ~$1,600–$2,500/month. Book a serviced apartment for the first 3–4 weeks while you search in person.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to international schools in District 2 or District 7 at least 12 months before your move — the top IB and British-curriculum schools consistently fill their August seats by February and do not hold places without a deposit.",
            "targetSection": "schools"
        },
        {
            "label": "Arrange international health insurance (IPMI — International Private Medical Insurance) before arriving — public hospitals in Ho Chi Minh City are not set up for English-speaking expats. Family Medical Practice and FV Hospital (Bệnh viện FV) in District 7 are the two top English-speaking private hospitals.",
            "targetSection": "healthcare"
        },
        {
            "label": "Your landlord is legally required to file a TM30 form (Vietnam's official address registration form) with the local cong an phuong (ward-level police station) within 24 hours of your arrival at any new address — get written confirmation this was filed. Without the TM30 receipt you cannot apply for your TRC.",
            "targetSection": "residency"
        },
        {
            "label": "Apply for your TRC (Thẻ Tạm Trú — Temporary Resident Card, Vietnam's official registration card for long-stay foreigners) at the Ho Chi Minh City Immigration Department within 30 days of arrival. Bring: passport, visa, TM30 receipt, work permit, and 2 passport photos. The TRC is required to open a bank account and enroll children in school.",
            "targetSection": "residency"
        },
        {
            "label": "Open a VPBank or Techcombank account once your TRC and work permit are ready — both banks have English-speaking branches in District 1 and District 2. Use Wise or Revolut for international transfers in the gap.",
            "targetSection": "banking"
        },
        {
            "label": "Buy motorbike helmets for every family member before your first day — motorbike traffic accidents are the leading cause of injury among expats in Ho Chi Minh City. Use Grab (Southeast Asia's equivalent of Uber) for all trips with young children.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Expat families in Ho Chi Minh City concentrate in two areas: District 2 (Thu Duc City), specifically the Thao Dien and An Phu neighborhoods — modern, leafy, and walkable with the highest concentration of international schools; and District 7 (Phu My Hung), a planned township that feels like a self-contained expat suburb. A furnished 3-bedroom apartment in District 2 runs ~$1,600–$2,500/month; District 7 is slightly cheaper at ~$1,200–$2,000/month."
    },
    "schools": {
        "summary": "Ho Chi Minh City has a well-developed international school market concentrated in District 2 (Thu Duc City) and District 7 (Phu My Hung) — the two main expat neighborhoods. IB, British, American, and Korean-curriculum schools are available, and fees are mid-range by Asian expat standards.",
        "publicSystem": "Vietnamese public schools follow the curriculum set by MOET (the Ministry of Education and Training — Vietnam's federal education authority) and teach entirely in Vietnamese. These schools are not designed for expat children and are not a practical option for non-Vietnamese-speaking families.",
        "internationalOptions": "The largest international campuses are in the Thao Dien and An Phu areas of District 2, and in the Phu My Hung township of District 7. British and IB curricula are the most common. Annual fees run ~$15,000–$30,000/year. Seats at the top 3–4 schools are competitive — apply 12 months ahead. Most schools do not accept mid-year entries except in exceptional cases.",
        "languageNotes": "All instruction at international schools is in English. Vietnamese language is offered as an extracurricular subject. Some schools offer a Vietnamese immersion track for families planning a stay of 3+ years.",
        "tip": "Visit campuses in person and submit applications before your move date — the top international schools in District 2 are consistently oversubscribed and do not hold spots. If your child needs a place in the same school year as your move, contact schools at least 6 months out.",
        "options": [
            {
                "type": "IB and British curriculum international schools (District 2 — Thao Dien and An Phu)",
                "description": "The core choice for expat families — located in the same neighborhoods where most expats live. IB Diploma available in senior years. Strong extracurricular and sports programs. Fees: ~$18,000–$30,000/year.",
                "fees": "$18,000–$30,000/year typical"
            },
            {
                "type": "American curriculum international schools (District 7 — Phu My Hung)",
                "description": "Clustered in the Phu My Hung township in District 7, popular with US and Korean expat communities. Strong sports programs and US college counseling. Fees: ~$15,000–$25,000/year.",
                "fees": "$15,000–$25,000/year typical"
            },
            {
                "type": "Local bilingual schools (Vietnamese-English)",
                "description": "Vietnamese private schools with bilingual teaching — a mix of the Vietnamese MOET curriculum and English instruction. Cheaper (~$3,000–$8,000/year) but English instruction quality varies. Best for families with young children (under 8) who want Vietnamese immersion alongside English.",
                "fees": "$3,000–$8,000/year typical"
            }
        ]
    }
})

# ── BENGALURU ─────────────────────────────────────────────────────────────────
patch(cities, "bengaluru-in", {
    "actionChecklist": [
        {
            "label": "Apply for an India Employment Visa at your nearest Indian consulate before flying — tourist visas explicitly prohibit working in India. Bring your employment contract, company registration documents, and degree certificates. Processing takes 3–10 business days.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Whitefield, Sarjapur Road, or Koramangala — the three main expat and tech worker corridors in Bengaluru. Furnished 3-bedroom apartments run ~$1,200–$2,000/month. Traffic on the ORR (Outer Ring Road — the main expressway connecting the tech parks) is severe — live as close to your child's school as possible.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to IB or IGCSE (International General Certificate of Secondary Education — Cambridge's internationally recognized qualification) schools on the Sarjapur corridor 12–18 months before your move — the top schools near the tech parks fill their June intake by December.",
            "targetSection": "schools"
        },
        {
            "label": "Register at the FRRO (Foreigners Regional Registration Office — the government body that handles visa registration and extensions for all foreigners in India) within 14 days of arriving. Bring: passport, visa, employment contract, proof of address, and passport photos. Failure to register is a serious immigration violation.",
            "targetSection": "residency"
        },
        {
            "label": "Arrange international health insurance (IPMI) before arriving — government hospitals are overcrowded and not set up for English-speaking expats. Manipal Hospitals and Apollo Hospitals both have expat-friendly departments and English-speaking pediatric staff in Bengaluru.",
            "targetSection": "healthcare"
        },
        {
            "label": "Open an HDFC Bank or ICICI Bank account — both have expat-focused branches in Whitefield and Koramangala that accept an Employment Visa, passport, and company authorization letter. Bring a reference letter from your employer.",
            "targetSection": "banking"
        },
        {
            "label": "Start interviewing ayahs (live-in nannies or childcare helpers, as they are commonly called in India) and house helpers 2–3 months before arrival — a live-in ayah costs ~$200–$400/month including accommodation. Reputable agencies in Whitefield and Sarjapur have 2–4 week waiting lists.",
            "targetSection": "childcare"
        },
        {
            "label": "April–June is Bengaluru's pre-monsoon heat season (35–38°C) — confirm your apartment has AC in all bedrooms and a reliable water supply before signing a lease. Verify the building has a diesel backup generator for the frequent power cuts.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Bengaluru's expat and family housing clusters around three tech corridors: Whitefield (east), Sarjapur Road (southeast), and Koramangala/Indiranagar (central-south). These areas have the highest concentration of international schools, supermarkets, and expat communities. A furnished 3-bedroom apartment in these areas costs ~$1,200–$2,000/month. Proximity to your child's school matters most — Bengaluru's ORR traffic can turn a 10km commute into a 90-minute ordeal."
    },
    "schools": {
        "summary": "Bengaluru has one of India's strongest international school markets, concentrated along the Sarjapur Road, Whitefield, and Koramangala tech corridors where most expat families live. IB (International Baccalaureate), IGCSE (International General Certificate of Secondary Education — Cambridge's global qualification), and CBSE (Central Board of Secondary Education — India's national curriculum) are all available.",
        "publicSystem": "Indian state board and CBSE government schools teach in Kannada (Karnataka's state language) or English, following an April–March academic year with large class sizes. These schools are designed for Indian families and are not a practical choice for expat children arriving without prior experience of the Indian curriculum.",
        "internationalOptions": "The main international schools are clustered along Sarjapur Road and in Whitefield, close to the major tech company campuses (Electronic City, Manyata Tech Park, RMZ Ecospace). IB Diploma and IGCSE programs are standard. Annual fees range from ~$8,000 to $20,000/year — significantly less than equivalent schools in Singapore or Dubai. Apply 12–18 months in advance.",
        "languageNotes": "Instruction at international schools is entirely in English. Kannada (Karnataka's official state language) is offered as an optional enrichment subject. Most expat children pick up conversational Hindi from household staff and local interactions within the first year.",
        "tip": "Submit applications and pay deposits before your move — the most popular IB campuses on the Sarjapur corridor fill their June intake by December and do not hold spots. If you are moving mid-year, confirm the school has a mid-year admission policy before applying.",
        "options": [
            {
                "type": "IB curriculum international schools (Sarjapur Road and Whitefield)",
                "description": "The standard choice for expat families relocating with multinational companies. Cambridge IGCSE in middle school, IB Diploma in the final two years. School buses service the main tech park areas. Fees: ~$10,000–$20,000/year.",
                "fees": "$10,000–$20,000/year typical"
            },
            {
                "type": "IGCSE / British curriculum schools",
                "description": "Strong academic reputation with UK accreditation. Located primarily in Koramangala and Indiranagar. Good choice for families relocating from the UK or with older children already in the GCSE system. Fees: ~$8,000–$15,000/year.",
                "fees": "$8,000–$15,000/year typical"
            },
            {
                "type": "CBSE schools (Indian national curriculum, English-medium)",
                "description": "Free or low-cost, academically demanding, and taught in English. Follows the April–March academic year. A viable option only for families with children who are fluent in English and comfortable adapting to a very different exam-focused curriculum structure.",
                "fees": "Free – $3,000/year typical"
            }
        ]
    }
})

# ── MUMBAI ────────────────────────────────────────────────────────────────────
patch(cities, "mumbai-in", {
    "actionChecklist": [
        {
            "label": "Apply for an India Employment Visa at your nearest Indian consulate — tourist visas do not permit working. Bring your employment contract, company registration documents, and degree certificates. Processing typically takes 3–7 business days.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Bandra West, Powai, or Hiranandani Gardens (Powai) — Mumbai's top family and expat neighborhoods. A furnished 3-bedroom in Bandra or Powai runs ~$2,500–$4,500/month. Book a serviced apartment for the first 2–3 weeks while you search in person.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to international schools in Bandra, Powai, or Andheri 12 months before your move — enrollment for the June intake closes by January. IGCSE and IB schools in Bandra have the longest waitlists.",
            "targetSection": "schools"
        },
        {
            "label": "Register at the FRRO (Foreigners Regional Registration Office — the government body that handles visa registration and extensions for all foreigners in India) within 14 days of arriving. Bring: passport, visa, employment contract, landlord's property documents, and passport photos.",
            "targetSection": "residency"
        },
        {
            "label": "Arrange comprehensive international health insurance (IPMI) before arriving. Kokilaben Dhirubhai Ambani Hospital in Andheri West and Lilavati Hospital in Bandra are Mumbai's top English-speaking private hospitals for families.",
            "targetSection": "healthcare"
        },
        {
            "label": "Open an HDFC Bank or Citibank account — both have branches experienced with expat accounts in Bandra and Powai. Bring your Employment Visa, FRRO registration receipt, and a letter from your employer. Wise works well for international transfers while your account processes.",
            "targetSection": "banking"
        },
        {
            "label": "Choose your neighborhood based on your child's school bus route — Mumbai traffic makes even a 15km commute across the western suburbs a 90-minute journey. Most expat families pick housing specifically to be within the school's bus zone.",
            "targetSection": "schools"
        },
        {
            "label": "Mumbai's monsoon (June–September) brings severe flooding on many roads — ask your landlord specifically about flood history for the street and building garage before signing. Confirm the building has a diesel generator for power cuts during heavy rain.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Mumbai's expat families cluster in the western suburbs — Bandra West, Khar, Santacruz, and Andheri — and in Powai township in the northeast. Bandra West is Mumbai's most cosmopolitan neighborhood, with a walkable high street and the best international schools nearby. Powai is quieter, planned, and popular with tech-sector families. A furnished 3-bedroom in Bandra or Powai runs ~$2,800–$4,500/month. Mumbai rents are India's highest — service charges, maintenance fees, and broker fees (typically 1 month's rent) are usually separate."
    },
    "schools": {
        "summary": "Mumbai has a well-established international school market primarily in the western suburbs (Bandra, Khar, Santacruz, Andheri) and in Powai. IGCSE (International General Certificate of Secondary Education), IB, and ICSE (Indian Certificate of Secondary Education — India's rigorous English-medium national exam) curricula are available. Fees are India's highest but still a fraction of Singapore or Dubai equivalents.",
        "publicSystem": "Mumbai's government schools teach in Marathi (Maharashtra's official language) or Hindi. Not viable for expat children. CBSE (Central Board of Secondary Education) English-medium schools are an option for children with strong English who are willing to adapt to India's April–March academic year and exam-focused system.",
        "internationalOptions": "The main international campuses are in Bandra (west), Andheri, and Powai. IGCSE and IB programs are standard for expat families. Annual fees range from ~$12,000 to $28,000/year. Apply 12 months ahead — Bandra-area schools are consistently oversubscribed.",
        "languageNotes": "Instruction at international schools is in English. Marathi is the local language; Hindi is widely spoken throughout Mumbai. Most expat children pick up working Hindi from household staff and local interactions within the first year.",
        "tip": "Choose your neighborhood based on your child's school, not your office — Mumbai traffic makes a 15km school commute a potential 90-minute trip. Decide on the school first, then find housing within the school's bus route.",
        "options": [
            {
                "type": "IGCSE / British curriculum international schools (Bandra, Andheri, Khar)",
                "description": "The primary choice for UK, European, and multinational expat families. Cambridge IGCSE in middle school, A-levels or IB Diploma in senior years. Most established campuses are in Bandra West and Santacruz. Fees: ~$15,000–$28,000/year.",
                "fees": "$15,000–$28,000/year typical"
            },
            {
                "type": "IB curriculum schools (Powai, Andheri)",
                "description": "Growing IB network in the Powai and Andheri corridors, popular with US and multinational families. Strong academic programs with good US college counseling. Fees: ~$12,000–$22,000/year.",
                "fees": "$12,000–$22,000/year typical"
            },
            {
                "type": "ICSE schools (Indian curriculum, rigorous English-medium)",
                "description": "High academic standards, taught in English, with the April–March academic year. Best for families with Indian roots or children who are already comfortable with a structured, exam-focused system. Much cheaper than international options. Fees: ~$3,000–$8,000/year.",
                "fees": "$3,000–$8,000/year typical"
            }
        ]
    }
})

# ── SANTIAGO ──────────────────────────────────────────────────────────────────
patch(cities, "santiago-cl", {
    "actionChecklist": [
        {
            "label": "Most nationalities enter Chile visa-free for 90 days. If you plan to stay longer, apply for a Visa Temporaria (Chile's temporary residency visa) at a Chilean consulate before arrival or at the Extranjería office (Chile's immigration authority) within 90 days of arriving.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Las Condes, Vitacura, or Providencia — Bogotá's top three family neighborhoods, all close to the main international schools and business districts. A furnished 3-bedroom in Las Condes or Vitacura runs ~$1,800–$3,000/month. Use Portalinmobiliario.com to browse listings.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to British or IB schools in the Las Condes corridor at least 12 months before your move — the best international campuses fill their March intake (Chile's school year starts in March) by October of the previous year.",
            "targetSection": "schools"
        },
        {
            "label": "Register with Extranjería (Chile's immigration authority) within 30 days of arriving — bring your passport, entry stamp or visa, rental contract, and an apostilled criminal background check from your home country.",
            "targetSection": "residency"
        },
        {
            "label": "Get your RUT (Rol Único Tributario — Chile's universal tax and ID number, issued by SII, the Servicio de Impuestos Internos) at any SII office as soon as you have a rental contract — you need the RUT for banking, utility contracts, and school enrollment.",
            "targetSection": "residency"
        },
        {
            "label": "Open a Banco de Chile or Banco Santander account — bring your RUT, passport, and proof of address. Both banks have English-speaking staff in the Las Condes branch.",
            "targetSection": "banking"
        },
        {
            "label": "Register with FONASA (Fondo Nacional de Salud — Chile's national public health fund) or arrange private health coverage through Cruz Blanca or Consalud (Chile's leading private health insurers). Most expat families add private isapre (private health plan) coverage to access shorter wait times.",
            "targetSection": "healthcare"
        },
        {
            "label": "Santiago has significant seismic activity — register at your local municipalidad (municipality office) and download the SENAPRED app (Chile's national emergency management system) within the first week.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Santiago's best family neighborhoods are in the east of the city — Las Condes, Vitacura, and Providencia. These areas are safe, walkable, and close to the main international schools and business districts. A furnished 3-bedroom in Las Condes or Vitacura runs ~$1,800–$3,000/month. Santiago's Metro system is clean and efficient — many families manage without a car for daily life."
    },
    "schools": {
        "summary": "Santiago has a well-developed private and semi-private school system, with British, IB, and US-curriculum international schools concentrated in Las Condes, Vitacura, and Providencia. Fees are a fraction of equivalent schools in Europe or North America — one of Santiago's strongest draws for relocating families.",
        "publicSystem": "Chilean public schools (colegios municipales — municipality-run schools) follow the MINEDUC (Ministry of Education) curriculum and teach entirely in Spanish. Academically functional and free, but not a practical option for expat children arriving without Spanish fluency.",
        "internationalOptions": "The main international and bilingual private schools cluster along Av. Las Condes and Av. Vitacura in the east of the city. British and IB curricula are the most common. Annual fees range from ~$8,000 to $18,000/year — significantly less than equivalent schools in Buenos Aires or Lima. Important: Chilean schools run on a March–December academic year (opposite to the Northern Hemisphere) — plan your move timing accordingly.",
        "languageNotes": "Instruction at international schools is in English, with Spanish as a core subject from primary. Children who arrive young (under 8) adapt quickly to Spanish. English-language tutoring is widely available for older children who arrive mid-school-year.",
        "tip": "Chilean schools run March–December — if you are moving from a September-start country, coordinate your move for January–February so children start the school year from the beginning in March.",
        "options": [
            {
                "type": "British / IB curriculum international schools (Las Condes, Vitacura)",
                "description": "The main choice for expat families — English instruction, IB or British curriculum, IB Diploma in the upper years. Most campuses are in the Av. Las Condes corridor. Fees: ~$10,000–$18,000/year.",
                "fees": "$10,000–$18,000/year typical"
            },
            {
                "type": "Bilingual Chilean-curriculum private schools",
                "description": "Spanish-English bilingual instruction from primary, following the Chilean MINEDUC curriculum. Well-regarded academically and attended by a mix of Chilean and expat families. Best for families planning a stay of 2+ years who want their children to integrate locally. Fees: ~$5,000–$12,000/year.",
                "fees": "$5,000–$12,000/year typical"
            }
        ]
    }
})

# ── MONTEVIDEO ────────────────────────────────────────────────────────────────
patch(cities, "montevideo-uy", {
    "actionChecklist": [
        {
            "label": "Most nationalities enter Uruguay visa-free for 90 days. If staying longer, register for temporary residency at the DNM (Dirección Nacional de Migración — Uruguay's immigration authority) within 90 days of arriving. The full process takes 12–18 months, but your presence in Uruguay is legal while it is being processed.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Pocitos, Punta Carretas, or Carrasco — Montevideo's top family neighborhoods. Pocitos and Punta Carretas are walkable beachfront areas with the best bilingual schools nearby. A furnished 3-bedroom apartment runs ~$1,500–$2,500/month. Use MercadoLibre Uruguay and Gallito.uy to browse listings.",
            "targetSection": "housing"
        },
        {
            "label": "Visit bilingual private schools in Pocitos and Punta Carretas 9–12 months before your move — most schools require an in-person tour and interview before accepting an application. International school options in Montevideo are limited compared to larger Latin American capitals.",
            "targetSection": "schools"
        },
        {
            "label": "Apply for your cédula de identidad (Uruguay's official national ID card) at the DNIC (Dirección Nacional de Identificación Civil — Uruguay's civil registry) once your residency application is in progress — needed for banking, school enrollment, and utility contracts.",
            "targetSection": "residency"
        },
        {
            "label": "Register at the BPS (Banco de Previsión Social — Uruguay's social security and health administration body) to access basic FONASA public health coverage. Most expat families supplement this with a mutualista — a private cooperative health clinic. CASMU and Médica Uruguaya are the two most recommended mutualistas for expat families.",
            "targetSection": "healthcare"
        },
        {
            "label": "Open a Banco República (BROU — Uruguay's largest state bank) or Scotiabank Uruguay account. Uruguay has strong banking privacy laws and is very banking-friendly for foreigners. Bring your passport, proof of address, and any income documentation.",
            "targetSection": "banking"
        },
        {
            "label": "Register with the DGI (Dirección General Impositiva — Uruguay's tax authority) to obtain your RUT (Registro Único Tributario — Uruguay's tax ID number) within the first month — needed for formal employment contracts, utility setups, and vehicle registration.",
            "targetSection": "residency"
        },
        {
            "label": "Search for a nanny or nursery through Montevideo expat Facebook groups — local guarderías (nurseries) run ~$400–$700/month for a full-time spot. Qualified nannies cost ~$5–$8/hr. Quality is generally high and the local market is friendly to expat families.",
            "targetSection": "childcare"
        }
    ],
    "housing": {
        "summary": "Pocitos and Punta Carretas are Montevideo's best family areas — walkable, safe, close to the Rio de la Plata beach, and with the best private bilingual schools nearby. A furnished 3-bedroom apartment runs ~$1,500–$2,500/month. Carrasco, 20 minutes east closer to the airport, is quieter with larger houses and gardens, popular with families who prefer more space."
    },
    "schools": {
        "summary": "Montevideo has a small but high-quality bilingual private school sector, primarily in the Pocitos, Punta Carretas, and Carrasco neighborhoods. Options are more limited than in Buenos Aires or Santiago — the city has no large international school with a dedicated expat enrollment pipeline, so families typically choose high-quality bilingual Uruguayan-curriculum schools.",
        "publicSystem": "Uruguay's public schools (escuelas públicas, administered by ANEP — Administración Nacional de Educación Pública) are free, secular, and conducted entirely in Spanish. Quality is solid by regional standards — Uruguay consistently ranks among South America's top education systems — but not designed for expat children arriving without Spanish.",
        "internationalOptions": "The few genuinely bilingual (Spanish-English) private schools are clustered in the Pocitos and Carrasco areas. Formal IB programs are limited — most families choose high-quality bilingual Uruguayan-curriculum schools, some of which offer Cambridge IGCSE (International General Certificate of Secondary Education) in the upper years. Annual fees: ~$5,000–$12,000/year.",
        "languageNotes": "Instruction in private bilingual schools is split 50/50 Spanish and English. Uruguayan teachers are generally patient and experienced with non-Spanish-speaking children. Mandarin and French options exist at a small number of schools in Carrasco.",
        "tip": "Most bilingual schools in Montevideo do not process applications online — you need an in-person tour and meeting with the principal before submitting. Plan a 3–5 day scouting trip 9–12 months before your intended move date.",
        "options": [
            {
                "type": "Private bilingual schools (Pocitos, Punta Carretas, Carrasco)",
                "description": "Spanish-English bilingual instruction from primary level. Well-regarded for academic quality and small class sizes. Some offer Cambridge IGCSE in the upper years. Fees: ~$5,000–$12,000/year.",
                "fees": "$5,000–$12,000/year typical"
            },
            {
                "type": "Public schools (escuelas públicas — free, Spanish-medium)",
                "description": "Free and academically solid — Uruguay's public education system is one of the best in South America. Conducted entirely in Spanish. Viable for young children (under 8) ready for full Spanish immersion, but not realistic for non-Spanish-speaking teenagers.",
                "fees": "Free"
            }
        ]
    }
})

# ── PANAMA CITY ───────────────────────────────────────────────────────────────
patch(cities, "panama-city-pa", {
    "actionChecklist": [
        {
            "label": "Most nationalities enter Panama visa-free for 180 days. If your passport is from one of 50+ qualifying countries, you are eligible for the Friendly Nations Visa — Panama's fast-track permanent residency program. File at the SNM (Servicio Nacional de Migración — Panama's immigration authority) within 90 days of arriving. The process typically takes 6–12 months.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Costa del Este or Clayton (the former US Canal Zone, now Panama's most established expat family neighborhood) 6–8 weeks before arriving. Costa del Este has modern high-rises at ~$2,600–$4,500/month for a 3-bedroom; Clayton is greener, quieter, and cheaper at ~$1,500–$2,500/month.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to international schools in Clayton or Costa del Este 12–18 months before your move — the top bilingual and IB schools fill their August intake by February. Clayton's school community is the most established expat zone in Panama City.",
            "targetSection": "schools"
        },
        {
            "label": "Obtain your cédula de identidad (Panama's official national ID card, issued by the Tribunal Electoral) within 60 days of your residency approval — required for banking, school enrollment, utility contracts, and vehicle registration.",
            "targetSection": "residency"
        },
        {
            "label": "Register with the CSS (Caja de Seguro Social — Panama's mandatory social security and national health system for employed workers) or arrange private health insurance with ASSA Compañía de Seguros. Panama City's private hospitals — Hospital Nacional and Hospital Punta Pacífica — are high quality by Latin American standards.",
            "targetSection": "healthcare"
        },
        {
            "label": "Open a Banco General or BAC Credomatic account — Panama uses the US dollar as its official currency (called balboa locally), so there is no currency exchange risk. Bring your passport, residency documents, and proof of income. Both banks have English-speaking staff.",
            "targetSection": "banking"
        },
        {
            "label": "Register your lease on DARI (Panama City's mandatory digital tenancy registration system) once you sign — landlords are legally required to register all rental contracts. Non-registration can complicate your residency application.",
            "targetSection": "housing"
        },
        {
            "label": "Panama's rainy season (May–November) brings daily afternoon thunderstorms and potential flooding in parts of the city — ask your landlord specifically about flood history for the apartment's street and building garage before signing.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Panama City's top family areas are Costa del Este (modern high-rises, close to the business district and good international schools) and Clayton (the former US Canal Zone — greener, quieter, and school-dense, with a strong US-expat community). A furnished 3-bedroom in Costa del Este runs ~$2,600–$4,500/month; Clayton is ~$1,500–$2,500/month. Many families pick their neighborhood specifically to be within their chosen school's bus route."
    },
    "schools": {
        "summary": "Panama City has a strong bilingual school market primarily in Clayton (the former US Canal Zone) and Costa del Este. US-accredited, IB, and bilingual Spanish-English schools are all available. Fees are competitive by Latin American standards and schooling quality for expat children is among the best in Central America.",
        "publicSystem": "Panama's public schools (escuelas públicas, administered by MEDUCA — the Ministry of Education) are conducted in Spanish and follow the Panamanian national curriculum. Not designed for expat children arriving without Spanish — most expat families enroll in private bilingual schools.",
        "internationalOptions": "The main international campuses are in Clayton (US-accredited schools) and Costa del Este (IB and bilingual schools). Clayton's school community is the most established expat zone in the city — many families specifically choose to live in Clayton to be close to the school gates. Annual fees: ~$8,000–$20,000/year.",
        "languageNotes": "Instruction at international schools is in English, with Spanish as a core subject from primary level. Clayton's school environment is very English-friendly — many teachers are American and the school day feels similar to a US environment.",
        "tip": "Decide between Clayton and Costa del Este before choosing housing — they are 20–30 minutes apart and most families pick one school zone and stay there. Clayton is the better choice if you want a tightly-knit expat school community.",
        "options": [
            {
                "type": "US-accredited bilingual schools (Clayton)",
                "description": "The most established expat school zone in Panama City — US-accredited curriculum, full English instruction, and a community that has been building since the Panama Canal era. Strong extracurricular and sports programs. Fees: ~$8,000–$18,000/year.",
                "fees": "$8,000–$18,000/year typical"
            },
            {
                "type": "IB curriculum international schools (Costa del Este)",
                "description": "A growing IB network in the newer Costa del Este business and residential corridor. Modern, air-conditioned campuses. Fees: ~$12,000–$20,000/year.",
                "fees": "$12,000–$20,000/year typical"
            }
        ]
    }
})

# ── MEXICO CITY ───────────────────────────────────────────────────────────────
patch(cities, "mexico-city-mx", {
    "actionChecklist": [
        {
            "label": "Most nationalities enter Mexico visa-free for 180 days as tourists. If you plan to work or stay longer, apply for a Residente Temporal (Mexico's temporary residence visa) at a Mexican consulate before arrival. Bring proof of income (~$1,500–$2,500/month depending on consulate) and a criminal background check.",
            "targetSection": "visa"
        },
        {
            "label": "Start your apartment search in Polanco, La Condesa, or Roma Norte 6–8 weeks before arriving — these are Mexico City's most walkable, family-friendly neighborhoods. Furnished 3-bed apartments in Polanco run ~$2,500–$4,000/month; La Condesa and Roma Norte are ~$1,800–$3,200/month. Use Inmuebles24 and Lamudi Mexico to browse listings.",
            "targetSection": "housing"
        },
        {
            "label": "Apply to international schools in the Polanco–Lomas corridor or Santa Fe–Interlomas corridor 12 months before your move. IB and US-accredited schools fill their August intake by February. Important: these two school zones are 45–75 minutes apart in traffic — choose your school zone first, then choose your neighborhood.",
            "targetSection": "schools"
        },
        {
            "label": "Register with the INM (Instituto Nacional de Migración — Mexico's immigration authority) within 30 days of arriving on a temporary residence visa — bring passport, visa, rental contract, and proof of income. You will receive your FM3 (resident card) which is required for most official transactions.",
            "targetSection": "residency"
        },
        {
            "label": "Apply for your RFC (Registro Federal de Contribuyentes — Mexico's tax ID) and CURP (Clave Única de Registro de Población — Mexico's population registry number) at the SAT (Servicio de Administración Tributaria — the Mexican tax authority) or online at sat.gob.mx within the first month. Both are required for banking, employment contracts, and utility setup.",
            "targetSection": "residency"
        },
        {
            "label": "Open a Banco Nacional de México (Banamex) or BBVA México account — bring your RFC, CURP, immigration card (FM3), and proof of address. BBVA has the best English-speaking support for expats in Polanco and Santa Fe branches.",
            "targetSection": "banking"
        },
        {
            "label": "Arrange private health insurance before arriving — public IMSS (Instituto Mexicano del Seguro Social — Mexico's social security health system) is accessible to formal employees but wait times are long. Most expat families use ABC Hospital (Asociación Benéfica y Cultural) or Hospital Ángeles, which require insurance or upfront payment.",
            "targetSection": "healthcare"
        },
        {
            "label": "Mexico City sits at 2,240m altitude — expect mild altitude adjustment and occasional shortness of breath in the first week. Download the Calidad del Aire app to track the daily IMECA air quality index (Mexico City's air pollution measurement scale) and limit children's outdoor time on high-pollution spring days.",
            "targetSection": "safety"
        }
    ],
    "housing": {
        "summary": "Mexico City's expat families cluster in two main zones: the Polanco and Lomas de Chapultepec corridor (north-center, upscale, walkable) and the Santa Fe and Interlomas corridor (west, modern, close to western campuses). A furnished 3-bedroom in Polanco runs ~$2,500–$4,000/month; Santa Fe is ~$1,800–$3,000/month. Choose your school zone first — driving between these zones in rush-hour traffic takes 60–90 minutes and families rarely commute between them."
    },
    "schools": {
        "summary": "Mexico City has one of Latin America's largest international school markets, with schools spread across Polanco, Lomas de Chapultepec, Santa Fe, Interlomas, and the southern suburbs. US-accredited, IB, and British curricula are all well-represented. Fees are moderate by global expat standards.",
        "publicSystem": "Mexican public schools follow the SEP (Secretaría de Educación Pública — Mexico's federal education ministry) curriculum and teach entirely in Spanish. Academic quality varies widely by district and neighborhood — not the standard choice for newly arrived expat families.",
        "internationalOptions": "The main international school zones are Polanco and Lomas (north-center) and Santa Fe and Interlomas (west). US-accredited and IB programs are the most common. Annual fees range from ~$12,000 to $28,000/year. Apply 12 months in advance — the most popular schools fill their August seats early. These two zones are 45–75 minutes apart in traffic — families almost never cross between them for school.",
        "languageNotes": "Instruction at international schools is in English, with Spanish as a core subject. Mexico City has excellent Spanish language schools for parents too — most expat children speak Spanish conversationally within 6 months.",
        "tip": "Decide between the Polanco–Lomas zone and the Santa Fe–Interlomas zone before searching for housing — the two school zones are separated by severe rush-hour traffic and most families stay in their zone for daily life.",
        "options": [
            {
                "type": "US-accredited international schools (Polanco, Lomas, Santa Fe)",
                "description": "The standard choice for US and multinational expat families — US college-counseling, SAT-aligned curriculum, English instruction from primary. Most established campuses are in the Polanco and Lomas corridor. Fees: ~$15,000–$28,000/year.",
                "fees": "$15,000–$28,000/year typical"
            },
            {
                "type": "IB curriculum international schools (Santa Fe, Interlomas)",
                "description": "A growing IB presence in the western corridors. IB Diploma in the upper years. Popular with European and multinational families. Fees: ~$12,000–$22,000/year.",
                "fees": "$12,000–$22,000/year typical"
            },
            {
                "type": "Bilingual Mexican private schools",
                "description": "Spanish-English bilingual instruction following the SEP (federal) curriculum, attended by a mix of Mexican and expat families. Much cheaper than international options. Best for families planning a multi-year stay who want their children to integrate with the local community. Fees: ~$5,000–$12,000/year.",
                "fees": "$5,000–$12,000/year typical"
            }
        ]
    }
})

# ─────────────────────────────────────────────────────────────────────────────
# US CITIES — housing summaries, schools sections, checklist improvements
# ─────────────────────────────────────────────────────────────────────────────

# Common US checklist item improvements (CL4 and CL6 are the same for all US cities)
US_CL4 = "Arrange health insurance before your first day in the US — either through your employer's group plan or via an IPMI (International Private Medical Insurance) policy. In the US, a single emergency room visit without insurance costs $2,000–$10,000."
US_CL6 = "Open a US bank account at Chase, Wells Fargo, or a local bank within the first week — bring your passport, visa, I-94 arrival record (download at cbp.dhs.gov/i94), and a signed lease. You need a US account to pay rent by bank transfer, set up utilities, and receive direct deposit."

# ── CHARLOTTE ─────────────────────────────────────────────────────────────────
patch(cities, "charlotte-us", {
    "housing": {
        "summary": "Charlotte's top family neighborhoods are in the south and southeast of the city — SouthPark (upscale, walkable, close to great schools), Myers Park (historic, tree-lined streets, central), Ballantyne (suburban, newer construction, excellent schools), and NoDa (artsy, up-and-coming). A 3-bedroom house or apartment in SouthPark or Ballantyne runs ~$3,200–$5,000/month; Myers Park is ~$2,800–$4,000/month. School zone boundaries are strict in Charlotte — verify your exact address is in the right CMS (Charlotte-Mecklenburg Schools) zone before signing a lease."
    },
    "schools": {
        "summary": "Charlotte families mostly use Charlotte-Mecklenburg Schools (CMS) — the large public school district covering Charlotte and the surrounding Mecklenburg County. CMS quality varies significantly by zone, but the district offers magnet programs, charter options, and strong private schools that give families real choices.",
        "publicSystem": "CMS (Charlotte-Mecklenburg Schools) is North Carolina's second-largest school district. School quality depends heavily on your address zone — south Charlotte zones (Myers Park, Ballantyne, Ardrey Kell) consistently rank higher than north or west Charlotte zones. CMS operates a magnet program with IB, arts, and STEM tracks — apply in January at cms.k12.nc.us.",
        "internationalOptions": "Private IB and college-prep schools are concentrated in SouthPark and the Matthews area south of Uptown. Annual fees range from ~$20,000 to $36,000/year. Most private schools have waitlists — tour and apply 12–18 months ahead.",
        "languageNotes": "English throughout. Several CMS magnet schools offer Spanish immersion from kindergarten — competitive but free. Mandarin immersion programs are also available at select magnet locations.",
        "tip": "Check your exact school assignment at cms.k12.nc.us before committing to a lease — the same street can fall in very different school zones in Charlotte. The south Charlotte zones (Ballantyne, Myers Park) are the most consistently strong.",
        "options": [
            {
                "type": "CMS public schools (neighborhood and magnet)",
                "description": "Free and the default choice for most Charlotte families. South Charlotte zones — Ballantyne, Myers Park, SouthPark — have consistently strong elementary and high schools. IB, arts, and STEM magnet programs are available district-wide — apply through cms.k12.nc.us in January for August placement.",
                "fees": "Free"
            },
            {
                "type": "Charter schools",
                "description": "North Carolina has strong charter school options in the Charlotte metro — several rank among the state's top schools. Charter seats require a separate application and are competitive. Search 'Charlotte NC charter schools' to compare current options and application deadlines.",
                "fees": "Free"
            },
            {
                "type": "Independent / IB private schools",
                "description": "IB and college-prep private schools in SouthPark, Myers Park, and Matthews serve families who want a private environment with small class sizes. Apply 12+ months ahead — most have significant waitlists. Fees are in line with other major US cities.",
                "fees": "$20,000–$36,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "charlotte-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── RALEIGH ───────────────────────────────────────────────────────────────────
patch(cities, "raleigh-us", {
    "housing": {
        "summary": "Raleigh's expat families cluster in Cary (a large suburb west of Raleigh with top-ranked Wake County schools and a tech-sector community), North Hills (upscale, central, walkable), and Morrisville (close to RTP — the Research Triangle Park tech campus). A 3-bedroom house in Cary or North Hills runs ~$3,000–$4,500/month. The Inside-the-Beltline (ITB) area — older neighborhoods like Five Points and Breezemore inside Raleigh's I-440 ring road — is desirable for walkability but has fewer new-construction options."
    },
    "schools": {
        "summary": "Raleigh is served by Wake County Public Schools (WCPSS) — one of North Carolina's best-funded and highest-performing public school districts. Most expat families in Cary and North Hills use the strong neighborhood public schools, supplemented by Wake County's magnet program.",
        "publicSystem": "Wake County Public Schools (WCPSS) is North Carolina's largest school district and consistently ranks among the state's top performers. School assignment is based on your home address — check your specific school at wcpss.net before signing a lease. The district also offers magnet schools with IB, STEM, and arts tracks — apply in January.",
        "internationalOptions": "Private IB and independent schools are located in Raleigh and Cary, serving families who prefer a private environment. Annual fees range from ~$14,000 to $30,000/year. Smaller selection than Charlotte, but quality is comparable.",
        "languageNotes": "English throughout. Wake County's magnet program includes Spanish and Mandarin dual-language immersion tracks from kindergarten — apply in January for August placement.",
        "tip": "Research your Wake County school assignment at wcpss.net before committing to a Raleigh or Cary neighborhood — the district is large and school quality is uniformly high, but magnet opportunities vary by zone.",
        "options": [
            {
                "type": "Wake County public schools (neighborhood and magnet)",
                "description": "Free and consistently high-performing — Wake County regularly ranks among the top school districts in North Carolina. Verify your address assignment at wcpss.net. Magnet schools with IB, STEM, and dual-language tracks are available — apply through the district in January.",
                "fees": "Free"
            },
            {
                "type": "Charter schools (Cary and Research Triangle area)",
                "description": "Several well-regarded charter schools operate in the Cary and Research Triangle area, offering classical, STEM, and Montessori approaches. Seats are competitive and require early applications. Search 'charter schools Wake County NC' for current options.",
                "fees": "Free"
            },
            {
                "type": "Independent schools (Raleigh and Cary)",
                "description": "Private IB and college-prep independent schools in Raleigh and Cary offer small classes and strong academic programs for families who prefer a private setting. Apply 12+ months in advance.",
                "fees": "$14,000–$30,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "raleigh-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── CHARLESTON ────────────────────────────────────────────────────────────────
patch(cities, "charleston-us", {
    "housing": {
        "summary": "Charleston's top family neighborhoods are Mount Pleasant (a large suburb north of the Cooper River — safe, family-focused, close to the best public schools), Daniel Island (a master-planned community with excellent schools, parks, and walkability), and West Ashley (south of downtown, more affordable at ~$2,200–$3,200/month). A 3-bedroom house in Mount Pleasant or Daniel Island runs ~$3,000–$4,500/month. Note: some Charleston-area streets are prone to flooding during heavy rain — check the flood zone status of any property before signing."
    },
    "schools": {
        "summary": "Charleston is served by Charleston County School District (CCSD), which has some of South Carolina's top-ranked public schools — particularly in Mount Pleasant and Daniel Island. Most expat families use the strong neighborhood schools in these areas.",
        "publicSystem": "Charleston County School District (CCSD) covers Charleston and the surrounding areas, including Mount Pleasant and Daniel Island. School quality is highest in the Mount Pleasant and Daniel Island zones. CCSD also operates a magnet program — check your school assignment at ccsdschools.com before signing a lease.",
        "internationalOptions": "Private independent and Montessori schools are scattered across the Charleston area. Religious independent schools are the most common private option. Annual fees range from ~$16,000 to $30,000/year. Selection is smaller than in Charlotte or Atlanta.",
        "languageNotes": "English throughout. CCSD offers some Spanish immersion magnet programs — limited availability and competitive admissions.",
        "tip": "Verify your CCSD school assignment at ccsdschools.com before committing to a neighborhood — Mount Pleasant and Daniel Island zones have consistently strong elementary schools. Families looking for a private IB option should look toward Charlotte or Atlanta for more choices.",
        "options": [
            {
                "type": "CCSD public schools (neighborhood and magnet)",
                "description": "Free and well-regarded in the Mount Pleasant and Daniel Island zones. Charleston County's top-ranked elementary and high schools are in these areas. Verify your address zone at ccsdschools.com and apply to magnets in January.",
                "fees": "Free"
            },
            {
                "type": "Charter schools",
                "description": "South Carolina has a growing charter school sector — several options in the Charleston metro offer STEM and classical tracks. Application deadlines vary — search 'charter schools Charleston SC' to compare current options.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools",
                "description": "Independent and religious private schools are available across the Charleston metro. Smaller selection than larger US metros but with strong pastoral care and community feel. Apply 12+ months ahead for the most popular campuses.",
                "fees": "$16,000–$30,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "charleston-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── GREENVILLE SC ─────────────────────────────────────────────────────────────
patch(cities, "greenville-sc-us", {
    "housing": {
        "summary": "Greenville's best family areas are Downtown Greenville (walkable, charming, and fastest-growing), Augusta Road (older homes, top-rated elementary schools, 5 minutes from downtown), and Five Forks / Simpsonville (suburban, newer construction, great value for space). A 3-bedroom house in the Augusta Road or Five Forks area runs ~$2,200–$3,500/month; downtown lofts and townhouses are ~$2,000–$3,000/month."
    },
    "schools": {
        "summary": "Greenville County Schools (GCS) is South Carolina's largest school district and has strong neighborhood schools, particularly in the Augusta Road and north Greenville areas. The district offers IB magnet pathways and a growing charter sector for families with specific academic goals.",
        "publicSystem": "Greenville County Schools (GCS) covers all of Greenville County and is consistently one of South Carolina's top-performing districts. Elementary school quality is particularly strong in the Augusta Road and north Greenville zones. The district offers language immersion magnet programs — check your school assignment at greenvilleschools.us.",
        "internationalOptions": "Private faith-based and independent schools are available throughout the Greenville area. The selection is smaller than larger US cities but fees are lower — typically ~$8,500 to $20,000/year. Families seeking a full IB program will find more options in Charlotte (1.5 hours north).",
        "languageNotes": "English throughout. GCS offers a Spanish immersion magnet program from kindergarten — competitive and free. Apply in January for August placement.",
        "tip": "Research your GCS school assignment at greenvilleschools.us before committing to a neighborhood. The Augusta Road corridor consistently has Greenville's strongest elementary schools — worth prioritizing if school quality is your main criterion.",
        "options": [
            {
                "type": "Greenville County Schools (neighborhood and magnet)",
                "description": "Free and strong — Greenville County regularly scores above the state average. The IB magnet pathway at the high school level is available to any GCS student who applies. Language immersion and STEM magnet options start from elementary school — apply in January at greenvilleschools.us.",
                "fees": "Free"
            },
            {
                "type": "Charter schools (Brashier Middle College, Greenville Classical Academy)",
                "description": "South Carolina has a growing charter sector — Greenville has several well-regarded options, including classical and project-based learning schools. Research current options and application deadlines at scpubliccharterschools.org.",
                "fees": "Free"
            },
            {
                "type": "Private / faith-based independent schools",
                "description": "Greenville has a strong private school market driven by its large Christian community — many schools are faith-based but academically rigorous. Secular independent options also exist. Fees are lower than in larger US metros.",
                "fees": "$8,500–$20,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "greenville-sc-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── ATLANTA ───────────────────────────────────────────────────────────────────
patch(cities, "atlanta-us", {
    "housing": {
        "summary": "Atlanta's expat families concentrate in the northern suburbs — Buckhead (upscale, Atlanta's most prestigious residential area), Decatur (liberal, walkable, strong schools), Alpharetta (tech-sector suburban hub, newer construction, top Fulton County schools), and Virginia-Highland (in-town, walkable, vibrant). A 3-bedroom in Buckhead or Alpharetta runs ~$3,500–$5,500/month; Decatur is ~$3,000–$4,500/month. Important: Atlanta has multiple school districts (Atlanta Public Schools, Fulton County, DeKalb County, Cobb County) — school quality and assignment rules differ significantly between them."
    },
    "schools": {
        "summary": "Atlanta has multiple school districts covering different suburbs — Atlanta Public Schools (APS), Fulton County Schools, DeKalb County Schools, and Cobb County Schools — each with different strengths. Expat families typically choose their neighborhood partly based on which district they want to be in.",
        "publicSystem": "Atlanta has four main school systems covering the metro: APS (Atlanta Public Schools — covers the city proper), Fulton County Schools (covering Alpharetta, Johns Creek), DeKalb County Schools (covering Decatur and eastern suburbs), and Cobb County Schools (western suburbs). Fulton County and Cobb County are generally considered the strongest districts for families in the northern suburbs.",
        "internationalOptions": "Private IB and college-prep schools are concentrated in Buckhead, Midtown, and North Atlanta. Atlanta has a strong private school market. Annual fees range from ~$19,000 to $36,000/year. Top schools have waitlists — apply 12–18 months ahead.",
        "languageNotes": "English throughout. Several Atlanta-area schools offer Spanish immersion and Mandarin programs — availability depends on the specific district and school.",
        "tip": "Research which county your target neighborhood falls in before signing a lease — Atlanta city limits (APS), Fulton County, and DeKalb County have different school assignment rules and reputations. Alpharetta (Fulton County) and Johns Creek (Fulton County) are consistently among the metro's highest-ranked public school zones.",
        "options": [
            {
                "type": "Fulton County / Cobb County public schools",
                "description": "Free and consistently strong in the northern suburbs (Alpharetta, Johns Creek, Marietta). Verify your school assignment at the relevant county district website. Magnet programs and optional zones exist within each district.",
                "fees": "Free"
            },
            {
                "type": "Charter schools (KIPP and others)",
                "description": "Atlanta has a significant charter school sector, including KIPP (college-focused) and other networks. Application deadlines vary by school — search 'charter schools Atlanta GA' to compare current options and enrollment windows.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools (Buckhead, North Atlanta)",
                "description": "Atlanta has a strong private school market in Buckhead and North Atlanta — IB, college-prep, and faith-based options. Top schools have significant waitlists and often require applications 18 months ahead.",
                "fees": "$19,000–$36,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "atlanta-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── DENVER ────────────────────────────────────────────────────────────────────
patch(cities, "denver-us", {
    "housing": {
        "summary": "Denver's top family neighborhoods are Washington Park (Wash Park — leafy, walkable, south of downtown), Highlands (hip, close to downtown), and Cherry Creek (upscale, excellent schools, strong shopping district). Suburbs like Louisville and Broomfield (northwest, close to Boulder) offer newer construction with easy access to the mountains. A 3-bedroom in Wash Park or Cherry Creek runs ~$4,000–$6,000/month; Louisville and Broomfield suburbs are ~$3,200–$4,500/month. Denver housing moves fast in spring — be prepared to decide quickly in a competitive market."
    },
    "schools": {
        "summary": "Denver has a mix of strong public, charter, and private schools. DPS (Denver Public Schools — the city's main district) uses a universal choice enrollment system that lets families apply to any school in the district. Families who prioritize top-ranked public schools often choose suburban Cherry Creek School District or Boulder Valley.",
        "publicSystem": "DPS (Denver Public Schools) covers the city of Denver and uses a universal school choice system — apply at enrolldenver.org in January for August placement. School quality varies by neighborhood, but the choice system means families are not locked into a failing local school. Cherry Creek School District (covering suburban Greenwood Village and Aurora) is consistently among Colorado's top-ranked public school systems — but requires living in the district.",
        "internationalOptions": "Private IB and independent schools are located in the Denver Tech Center (DTC) area and central Denver. Annual fees range from ~$19,000 to $34,000/year.",
        "languageNotes": "English throughout. DPS offers Mandarin, Spanish, and French immersion programs at select schools — apply through enrolldenver.org in January.",
        "tip": "If top-ranked public schools are your priority, look at Cherry Creek School District (suburbs southeast of Denver) rather than DPS — Cherry Creek schools consistently rank among the state's best and are free with a qualifying address.",
        "options": [
            {
                "type": "DPS public schools (Denver city — choice enrollment)",
                "description": "Free, with a universal choice system that lets you apply to any school in the district regardless of your home address. Apply at enrolldenver.org in January. Strong magnet options including IB, STEM, and language immersion tracks.",
                "fees": "Free"
            },
            {
                "type": "Cherry Creek School District (suburban, southeast Denver)",
                "description": "Free but requires a Cherry Creek district address (Greenwood Village, Aurora suburbs). Consistently among Colorado's highest-ranked public school systems. A top reason many families choose southeast Denver suburbs over the city.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools (DTC, central Denver)",
                "description": "Private IB and college-prep schools in the Denver Tech Center and central Denver area. Smaller market than the coasts but strong quality. Apply 12+ months ahead.",
                "fees": "$19,000–$34,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "denver-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── NASHVILLE ─────────────────────────────────────────────────────────────────
patch(cities, "nashville-us", {
    "housing": {
        "summary": "Nashville's expat families cluster in two main areas: Green Hills and 12 South (south of downtown — walkable, upscale, close to great private schools and restaurants) and the Williamson County suburbs to the south — Brentwood and Franklin — which have Tennessee's top-ranked public schools and more space for the money. A 3-bedroom in Green Hills runs ~$3,500–$5,000/month; Brentwood or Franklin suburbs are ~$3,000–$4,500/month."
    },
    "schools": {
        "summary": "Nashville's school picture is split between Metro Nashville Public Schools (MNPS) covering the city, and Williamson County Schools (WCS) covering the suburbs of Brentwood and Franklin — consistently ranked as Tennessee's best public school system. Many expat families choose to live in Williamson County specifically for the schools.",
        "publicSystem": "Metro Nashville Public Schools (MNPS) covers the city of Nashville. School quality varies widely by zone — the district has strong magnet schools but uneven neighborhood schools. Williamson County Schools (WCS), covering Brentwood and Franklin, is a separate district from MNPS and is consistently ranked Tennessee's top-performing public school system — but requires a WCS-district address.",
        "internationalOptions": "Private independent and classical schools are primarily in Franklin and the Green Hills area. Annual fees range from ~$17,000 to $32,000/year. Nashville's private school market is smaller than Atlanta's or Charlotte's but quality is strong.",
        "languageNotes": "English throughout. A small number of MNPS schools offer Spanish immersion — check availability at mnps.org. Williamson County also has dual-language options at select elementary schools.",
        "tip": "If Tennessee's top-ranked public schools are your priority, choose a home address in Williamson County (Brentwood or Franklin) rather than Metro Nashville — Williamson County Schools (WCS) and MNPS are separate districts with very different school performance profiles.",
        "options": [
            {
                "type": "Williamson County Schools (Brentwood, Franklin — free)",
                "description": "Tennessee's top-ranked public school system — requires a Williamson County address (Brentwood or Franklin). Free, consistently high-performing, and the main reason many families choose the southern suburbs over central Nashville.",
                "fees": "Free"
            },
            {
                "type": "MNPS public schools and magnets (Metro Nashville)",
                "description": "Free. School quality varies by zone — magnet schools (arts, STEM, IB) are strong but competitive. Apply through mnps.org in January for August placement.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools (Franklin, Green Hills)",
                "description": "Independent and classical private schools in Franklin and Green Hills. Smaller market than Atlanta but strong academic quality and pastoral care. Apply 12+ months ahead.",
                "fees": "$17,000–$32,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "nashville-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── SALT LAKE CITY ────────────────────────────────────────────────────────────
patch(cities, "salt-lake-city-us", {
    "housing": {
        "summary": "Salt Lake City's best family neighborhoods are The Avenues (charming, walkable, close to downtown and the University of Utah), Sugarhouse and Liberty Wells (hip, affordable, south of downtown), and the suburban corridor of Holladay and Draper for larger homes with mountain views. A 3-bedroom in The Avenues or Sugarhouse runs ~$2,800–$3,800/month; Draper and South Jordan suburbs are ~$2,400–$3,500/month. Note: the Salt Lake Valley has a winter air quality (inversion) issue — the mountains trap cold air and pollution from November to February; check air quality forecasts at health.utah.gov."
    },
    "schools": {
        "summary": "Salt Lake City is served by multiple school districts — Salt Lake City School District (covering the city), Jordan School District (covering South Jordan and parts of the West Valley), and Granite School District (covering most of the valley). Jordan and Granite districts are the most popular among expat families in the suburbs.",
        "publicSystem": "Salt Lake's public schools vary by district: Salt Lake City School District (SLCSD) covers the city proper; Jordan School District covers the southern suburbs (South Jordan, Riverton); Granite School District covers the mid-valley suburbs. Jordan District is generally considered the strongest for suburban family zones. Check district assignments at each district's website before choosing a neighborhood.",
        "internationalOptions": "Private and IB schools exist primarily in the Lehi and Draper commuter belt and in East Salt Lake. Annual fees: ~$9,500 to $22,000/year. The market is smaller than coastal cities but the lower cost of living makes quality private school affordable.",
        "languageNotes": "English throughout. Several Utah school districts offer dual-language immersion programs — Mandarin and Spanish immersion tracks are available from kindergarten in select schools. Utah has one of the US's stronger foreign-language-in-education traditions.",
        "tip": "Utah has strong dual-language immersion programs in public schools — if Mandarin or Spanish immersion is a priority for your children, this is one of the best US states for it. Check availability at your district's website before choosing a neighborhood.",
        "options": [
            {
                "type": "Jordan / Granite District public schools",
                "description": "Free and well-funded. Jordan School District (covering South Jordan and Riverton) is consistently among Utah's highest-rated districts. Dual-language immersion programs in Mandarin and Spanish are available from kindergarten in select schools.",
                "fees": "Free"
            },
            {
                "type": "Charter schools (Lehi, Draper, South Jordan)",
                "description": "Utah has a strong charter sector — several schools emphasize STEM, classical curriculum, or outdoor/expedition-based learning. Seats are competitive. Search 'charter schools Salt Lake County Utah' to compare current options.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools",
                "description": "Private and IB schools in the Lehi commuter belt and East Salt Lake area. Lower fees than in coastal cities — one of the more affordable US metros for private schooling.",
                "fees": "$9,500–$22,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "salt-lake-city-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── PHOENIX ───────────────────────────────────────────────────────────────────
patch(cities, "phoenix-us", {
    "housing": {
        "summary": "Phoenix families concentrate in the East Valley suburbs — Scottsdale (upscale, close to the best schools and restaurants), Chandler and Gilbert (newer construction, highly rated school districts, great value for space), and Arcadia (older, charming, between Phoenix and Scottsdale). A 3-bedroom in Scottsdale or Arcadia runs ~$3,200–$4,800/month; Chandler and Gilbert are ~$2,800–$4,000/month. Critical: Phoenix summers (June–September) reach 40–45°C (105–115°F) — inspect AC units in all rooms and confirm the building has a pool before signing any lease."
    },
    "schools": {
        "summary": "Phoenix has one of the US's most school-choice-friendly environments — Arizona's charter school sector is among the nation's strongest, and open-enrollment policies mean families are not locked into a neighborhood school. Scottsdale Unified School District (SUSD) is the most sought-after public school system in the metro.",
        "publicSystem": "Arizona has broad school choice laws — families can apply to any public school or charter school in the state regardless of address. Scottsdale Unified School District (SUSD) is consistently Phoenix's highest-ranked public school system and a major reason families choose Scottsdale over other suburbs. Check assignments at susd.org.",
        "internationalOptions": "Private IB and independent schools are scattered across the Paradise Valley and Scottsdale area. Annual fees range from ~$18,000 to $38,000/year. The market is smaller than LA or Dallas but growing.",
        "languageNotes": "English throughout. Spanish is widely spoken in Phoenix's large Latino community — useful real-world immersion for children. Several charter schools offer Spanish or Chinese immersion tracks.",
        "tip": "Verify your Scottsdale Unified School District address assignment at susd.org before signing a lease — SUSD and Chandler Unified (covering Chandler and Gilbert) are the two strongest public school districts in the metro. Many families choose their suburb specifically to be in one of these districts.",
        "options": [
            {
                "type": "Scottsdale Unified (SUSD) and Chandler Unified public schools",
                "description": "Free and consistently among Arizona's top-ranked public school systems. Scottsdale Unified serves Scottsdale and parts of Phoenix; Chandler Unified serves Chandler and Gilbert. Verify your district assignment at susd.org or cusd80.com before committing to a neighborhood.",
                "fees": "Free"
            },
            {
                "type": "Great Hearts and other charter schools",
                "description": "Arizona has the US's strongest charter school sector — Great Hearts Academies (a classical, rigorous curriculum) is one of the most respected charter networks in the country. Multiple campuses in Scottsdale and the East Valley. Free with a separate application — search 'Great Hearts Phoenix' for campus locations and enrollment dates.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools (Scottsdale, Paradise Valley)",
                "description": "Private IB and college-prep schools in Scottsdale and Paradise Valley. Smaller market than LA or Dallas but with strong sports programs and outdoor facilities. Apply 12+ months ahead.",
                "fees": "$18,000–$36,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "phoenix-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── TAMPA ─────────────────────────────────────────────────────────────────────
patch(cities, "tampa-us", {
    "housing": {
        "summary": "Tampa's top family neighborhoods are South Tampa (Hyde Park and Palma Ceia — walkable, historic, close to downtown), Westchase (a planned community west of downtown with excellent public schools and a family-friendly layout), and Wesley Chapel (new construction north of the city, great value for space and school quality). A 3-bedroom in South Tampa runs ~$3,200–$4,800/month; Westchase is ~$2,800–$3,800/month. Before signing any Tampa-area lease, check the property's flood zone status — parts of South Tampa and the waterfront areas flood during hurricanes."
    },
    "schools": {
        "summary": "Tampa is served by Hillsborough County Public Schools (HCPS) — the county-wide district that covers the entire Tampa area. It is Florida's third-largest school district with a broad magnet program. Most expat families in South Tampa and Westchase use the strong neighborhood public schools, with private options for those who want a smaller class size.",
        "publicSystem": "Hillsborough County Public Schools (HCPS) covers all of Tampa and the surrounding county, including South Tampa, Westchase, and Brandon. It is Florida's third-largest district. School quality is generally strong in the South Tampa and Westchase zones. HCPS operates a magnet program with STEM, arts, IB, and language immersion tracks — apply at sdhc.k12.fl.us.",
        "internationalOptions": "A small number of IB and college-prep private schools are located in the South Tampa and Westshore area. Annual fees range from ~$19,000 to $36,000/year. Tampa's private school market is smaller than Orlando or Miami.",
        "languageNotes": "English throughout. Spanish immersion is available at select HCPS magnet schools — Tampa has a large Spanish-speaking community which gives children useful real-world exposure. Apply for magnet programs in January.",
        "tip": "Check your assigned neighborhood school at sdhc.k12.fl.us before choosing a Tampa apartment — South Tampa and Westchase zones have consistently strong elementary schools. Families looking for a full IB private option will find the most choice in Westshore and South Tampa.",
        "options": [
            {
                "type": "Hillsborough County public schools (neighborhood and magnet)",
                "description": "Free, well-funded, and the standard choice for most Tampa families. South Tampa (Hyde Park, Palma Ceia) and Westchase zones have the district's strongest elementary schools. STEM, IB, arts, and Spanish immersion magnet programs are available across the district — apply at sdhc.k12.fl.us in January.",
                "fees": "Free"
            },
            {
                "type": "Charter schools",
                "description": "Florida has broad charter school laws — several well-regarded academic and STEM-focused charter schools operate in the Tampa metro. Apply in January; seats are competitive. Search 'charter schools Hillsborough County FL' to compare current options.",
                "fees": "Free"
            },
            {
                "type": "Private / IB independent schools",
                "description": "A small number of private IB and college-prep schools in South Tampa and Westshore serve families who want smaller class sizes and a private environment. Fees are mid-range by US standards.",
                "fees": "$19,000–$36,000/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "tampa-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ── PORTLAND OR ───────────────────────────────────────────────────────────────
patch(cities, "portland-or-us", {
    "housing": {
        "summary": "Portland's top family neighborhoods are Laurelhurst and Sellwood-Moreland (east side — leafy, community-oriented, excellent neighborhood feel), Lake Oswego (a suburb 10 miles south — consistently Oregon's top-ranked public school district, and a major reason families choose it), and the Pearl District (urban, walkable, downtown). A 3-bedroom in Laurelhurst or Sellwood runs ~$3,200–$4,500/month; Lake Oswego is ~$3,500–$5,000/month. Portland has strong tenant protection laws — 12-month leases are standard and landlords must give 90 days notice for non-renewal."
    },
    "schools": {
        "summary": "Portland has a mixed school landscape — Portland Public Schools (PPS) covers the city with a choice-based system, while Lake Oswego School District (a separate, suburban district south of Portland) is consistently one of Oregon's highest-ranked systems. Many expat families choose to live in Lake Oswego specifically for the schools.",
        "publicSystem": "Portland Public Schools (PPS) covers the city of Portland and uses a neighborhood assignment system with magnet options. School quality varies by neighborhood — the Laurelhurst and Sellwood areas have strong neighborhood schools. Lake Oswego School District is a separate district in the Lake Oswego suburb that consistently ranks among Oregon's top school systems — it requires a Lake Oswego address.",
        "internationalOptions": "Private IB and progressive independent schools are primarily in the West Hills area (Beaverton and Hillsboro) and in Lake Oswego. Annual fees range from ~$19,500 to $32,500/year.",
        "languageNotes": "English throughout. PPS offers Japanese and Spanish immersion programs at select schools from kindergarten — apply in January. Beaverton School District (a large suburban district west of Portland) also has strong Japanese and Spanish immersion tracks.",
        "tip": "If top-ranked public schools are your priority, choose Lake Oswego (Lake Oswego School District, LOSD) over Portland city — LOSD consistently ranks among Oregon's top 3 school systems and is free with a qualifying address. The Lake Oswego commute to downtown Portland takes 20–30 minutes.",
        "options": [
            {
                "type": "Lake Oswego School District (LOSD — suburban, free)",
                "description": "Consistently one of Oregon's highest-ranked public school systems — requires a Lake Oswego address. Free. Strong academics, small class sizes by Oregon standards, and competitive extracurricular programs. The top reason many Portland-area expat families choose Lake Oswego.",
                "fees": "Free"
            },
            {
                "type": "Portland Public Schools (PPS) — neighborhood and magnet",
                "description": "Free. School quality varies by neighborhood — Laurelhurst and Sellwood zones have strong neighborhood schools. PPS offers Japanese and Spanish immersion magnet programs from kindergarten — apply in January at pps.net.",
                "fees": "Free"
            },
            {
                "type": "Private independent schools (West Hills, Lake Oswego)",
                "description": "Progressive, IB, and Waldorf private schools in Portland's West Hills and Lake Oswego serve families who want a private environment. Apply 12+ months ahead for the most popular campuses.",
                "fees": "$19,500–$32,500/year typical"
            }
        ]
    }
})
for city in cities:
    if city["id"] == "portland-or-us":
        city["actionChecklist"][3]["label"] = US_CL4
        city["actionChecklist"][5]["label"] = US_CL6

# ─────────────────────────────────────────────────────────────────────────────
# VALIDATE AND WRITE
# ─────────────────────────────────────────────────────────────────────────────
json_str = json.dumps(cities, ensure_ascii=False, indent=2)
# Sanity check
json.loads(json_str)
with open("data/cities.json", "w", encoding="utf-8") as f:
    f.write(json_str)
print("Done — cities.json updated successfully.")
