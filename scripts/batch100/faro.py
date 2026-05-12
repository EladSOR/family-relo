# Faro / Algarve, Portugal — Valencia-standard config.
# Clones Lisbon's visa block (Portuguese national visa rules apply nationally).

CITY = {
    "clone_visa_from": "lisbon-pt",
    "meta": {
        "id": "faro-pt",
        "citySlug": "faro",
        "countrySlug": "portugal",
        "city": "Faro",
        "country": "Portugal",
        "tagline": "Algarve regional capital — beach lifestyle, well-established international school cluster, and one of Europe's most reliable sunny climates",
        "summary": "Faro is the regional capital and main air gateway of the Algarve — Portugal's southern coastal region with 300+ days of sun per year, an established expat community, and a well-developed international school cluster around Almancil and Lagoa. Family life is concentrated in Faro itself, the upmarket Vilamoura/Quinta do Lago/Vale do Lobo coast, the historic Tavira, and Lagos. Trade-offs: summer tourism overwhelms the coast (June–September), winter is quiet, and healthcare for serious cases requires either Lisbon or international medical insurance.",
        "lastReviewed": "2026-05",
    },
    "actionChecklist": [
        {"label": "EU/EEA citizens: enter Portugal visa-free indefinitely. Within 3 months, register at your local Junta de Freguesia (Portugal's local civil registry office) to obtain a Certificado de Registo (EU citizen registration certificate)", "targetSection": "visa"},
        {"label": "Non-EU citizens: apply for the Portugal D7 visa (passive income / pensioner), D8 Digital Nomad Visa, Golden Visa (investment), or work visa at the Portuguese consulate BEFORE travelling. Processing 2–4 months", "targetSection": "visa"},
        {"label": "Apply for a NIF (Número de Identificação Fiscal — Portugal's combined tax and ID number) at your local Finanças (Portugal's tax office) — required for opening a bank account, signing a long-term lease, and almost every transaction", "targetSection": "residency"},
        {"label": "Start your housing search 6–10 weeks before your move — Faro itself, Almancil (international school cluster), Tavira, and Lagos are the main family bases. 3-bed flats run ~$1,300–$2,500/month (higher in summer)", "targetSection": "housing"},
        {"label": "Apply to international schools 6–12 months before your start date — the Algarve has a well-developed cluster around Almancil (Vale Verde, Eden, Nobel) and a few Faro-based options with limited places per year group", "targetSection": "schools"},
        {"label": "Open a Portuguese bank account at Millennium BCP, Caixa Geral de Depósitos, or Novobanco — bring passport, NIF, and proof of address. Most Algarve branches have English-speaking staff given the expat density", "targetSection": "banking"},
        {"label": "Register with the SNS (Serviço Nacional de Saúde — Portugal's free national health system) at your local Centro de Saúde once you have your NIF — required to access free public healthcare", "targetSection": "healthcare"},
        {"label": "Find a creche (nursery, ages 4 months–3 years) or jardim de infância (kindergarten, 3–6) early — public spots are subsidised but limited. Private bilingual nurseries cluster near the international schools in Almancil", "targetSection": "childcare"},
    ],
    "familyFit": {
        "bestFor": [
            "Families wanting Mediterranean beach lifestyle with a robust international school cluster — the Almancil corridor (Vilamoura, Quinta do Lago, Vale do Lobo) hosts 3–4 well-established international schools serving the year-round expat community",
            "EU/EEA families and remote workers using Portugal's lower cost of living and tax advantages — Portugal's NHR (Non-Habitual Resident) tax scheme reduces foreign income tax to 20% for 10 years (consult a Portuguese tax advisor for current eligibility)",
            "Families with golf, sailing, or beach interests — the Algarve has 40+ golf courses, two major marinas (Vilamoura, Albufeira), and beaches accessible from almost every family neighbourhood",
            "Outdoor families wanting reliable sunny weather year-round — 300+ days of sun, mild winters (15–20°C average), warm but bearable summers (28–35°C). One of Europe's most weather-reliable family destinations",
        ],
        "watchOutFor": [
            "Summer tourism (June–September) transforms the Algarve — beaches are crowded, traffic is heavy, restaurant prices rise 30–50%, and short-stay rentals dominate the housing market. Year-round family life works best inland (Faro centre, Loulé, São Brás) or in less-touristy towns (Tavira)",
            "International school choice clusters in one corridor — the Almancil/Lagoa international school cluster requires a daily commute from most family bases (Faro centre, Tavira, Lagos). Plan for 30–60 minute drives in school traffic, especially in summer when N125 highway is congested",
            "Healthcare for serious cases requires either travel to Lisbon or use of private hospitals — Faro Hospital is the regional reference but capacity for complex paediatric and specialist cases is limited. Most expat families subscribe to private insurance with HPA Group or international IPMI",
            "Winter is very quiet (November–March) — many beach restaurants and shops in Vilamoura, Albufeira, and Lagos close for 2–4 months. Year-round families need to be comfortable with quieter winter rhythms inland or in towns like Faro and Tavira",
        ],
    },
    "residency": {
        "title": "Junta de Freguesia & NIF",
        "tip": "The NIF is the single most important number in Portugal — get it at your local Finanças (tax office) in your first week. Without it, you cannot open a bank account, sign a long-term lease, or register with a doctor.",
        "items": [
            "Apply for a NIF (Número de Identificação Fiscal — Portugal's combined tax and ID number, used for every transaction) at your local Finanças (Portuguese tax office) — there's a Finanças office in central Faro plus offices in Loulé, Tavira, Lagos, and Albufeira. Bring passport. Issued within minutes, free.",
            "Within 3 months of arrival, register your residence at your local Junta de Freguesia (Portugal's local civil registry office, equivalent to a parish hall — every Algarve municipality has multiple Juntas). EU citizens receive a Certificado de Registo (registration certificate); non-EU residents will already have applied through AIMA via their visa.",
            "Non-EU residents: apply for or validate your AIMA (Agência para a Integração, Migrações e Asilo — Portugal's immigration authority) residence card after arrival. AIMA replaced SEF in 2023; appointments can have multi-month waits in the Algarve, so book online as early as possible.",
            "Register with the SNS (Serviço Nacional de Saúde) at your local Centro de Saúde once your NIF is issued — your assigned médico de família (family doctor) is the gateway to specialist referrals via the Portuguese public health system.",
            "Apostille every birth and marriage certificate before you leave home — the Portuguese state requires apostilled originals for almost every step, and apostille services in Portugal can take weeks.",
        ],
    },
    "banking": {
        "title": "Banking",
        "tip": "Millennium BCP and Caixa Geral de Depósitos both have strong Algarve branch networks with English-speaking staff. Novobanco and Santander Totta are the other major options.",
        "items": [
            "Millennium BCP (Portugal's largest private bank), Caixa Geral de Depósitos (state-owned, strong Algarve presence), Novobanco, and Santander Totta are the four banks most used by Algarve residents. Most Algarve branches have English-speaking staff given the high expat density.",
            "To open an account you need: valid passport, NIF (Portuguese tax number), proof of Portuguese address (rental contract or utility bill), and proof of income or employment. Most Algarve branches have dedicated international/expat onboarding services.",
            "Wise and Revolut are widely used in the Algarve — most landlords, restaurants, and shops accept Revolut transfers. Useful as a bridge while waiting for your Portuguese account.",
            "Portugal uses the euro (EUR) — monthly rents and salaries are quoted in EUR. Portugal is reasonably cashless in the Algarve given the heavy tourism — most shops, restaurants, and even taxis take card. Some smaller establishments still take cash only.",
            "Most rental contracts and employer payroll require a Portuguese IBAN — automatic monthly bank transfer (transferência SEPA) is the standard once your account is open.",
        ],
    },
    "housing": {
        "summary": "Algarve family housing splits between Faro itself (regional capital, year-round services), the upmarket Vilamoura/Quinta do Lago/Almancil corridor (international schools, golf, premium prices), historic Tavira (calmer, lower-cost), and Lagos (western Algarve).",
        "bestAreas": [
            "Faro centre",
            "Almancil",
            "Vilamoura",
            "Quinta do Lago",
            "Tavira",
            "Lagos",
            "Loulé",
        ],
        "searchPortalsIntro": [
            "These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).",
            "Search 'Faro', 'Almancil', 'Vilamoura', 'Tavira', 'Lagos', or other Algarve town names inside each platform to filter local listings.",
            "Tip: arrive in the Algarve outside of summer (October–May) if possible — long-term rental availability is much better, and prices for 12-month contracts are typically 30–40% below summer short-stay rates.",
        ],
        "searchPortals": [
            {"label": "Idealista Portugal — Portugal's largest property portal", "url": "https://www.idealista.pt", "isVerified": True},
            {"label": "Imovirtual — major Portuguese rental and sales portal", "url": "https://www.imovirtual.com", "isVerified": True},
            {"label": "OLX Portugal — direct-from-owner Portuguese classifieds", "url": "https://www.olx.pt", "isVerified": True},
            {"label": "Casa Sapo — additional Portuguese rental and sales inventory", "url": "https://casa.sapo.pt", "isVerified": True},
            {"label": "Facebook groups — search: 'Algarve Expats Housing' or 'Faro Rentals' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Algarve+Expats+Housing+Facebook+group", "isVerified": True},
        ],
        "typicalPrices": [
            "1-bed apartment, Faro centre or Tavira: ~$700–$1,100 / month (year-round contract)",
            "2-bed apartment, Faro, Tavira, or Lagos: ~$1,000–$1,500 / month",
            "3-bed apartment/villa, Almancil or central Algarve corridor: ~$1,400–$2,400 / month",
            "4-bed villa, Quinta do Lago or Vale do Lobo (premium golf areas): ~$2,500–$6,000 / month",
            "Short-stay summer rental (June–September): often 2–3× year-round rates — plan for off-season arrival",
        ],
        "whatYouNeedToRent": [
            "Valid passport plus NIF (Portuguese tax number)",
            "Employment contract or 3 months of bank statements proving income — most landlords want monthly income at least 3× the monthly rent",
            "1–2 months deposit (caução) plus first month's rent is standard. Some Algarve landlords request 2 months deposit for foreigners without Portuguese guarantor",
            "Most year-round rental contracts are 1–3 years (Portuguese law: arrendamento habitacional). Tenants can break with notice (typically 4 months for contracts under 1 year, longer for longer contracts)",
            "Avoid mid-summer arrivals — most year-round rentals turn over in October–May. Summer prices and short-stay-only contracts dominate June–September",
        ],
    },
    "schools": {
        "summary": "The Algarve has Portugal's strongest concentration of international schools outside Lisbon — clustered around Almancil, Lagoa, and Vilamoura corridors. Public Portuguese schools are free and high quality.",
        "publicSystem": "Portuguese public schools (escolas públicas) are free for all residents. Quality is consistent and Portugal has been improving steadily on PISA results. Most Algarve municipalities have one or more public escolas básicas (primary, ages 6–14) and escolas secundárias (secondary, 15–18). Realistic for long-stay families with children willing to learn Portuguese — most international children integrate within 9–12 months supported by free Portuguese-language preparation classes for newcomers.",
        "internationalOptions": "The Algarve's international school cluster includes Vale Verde International School (Lagoa), Eden International School (Almancil), Nobel International School (Lagoa), and the British International School Algarve. IB Diploma, IB Primary Years Programme, British (Cambridge IGCSE / A-Level) curricula. Annual fees: $10,000–$20,000/year. Apply 6–12 months in advance.",
        "languageNotes": "Public schools teach in Portuguese. International schools teach primarily in English. Portuguese is moderately accessible for English-speaking children — most reach conversational fluency in 6–9 months in immersion settings. Free Portuguese-language preparation classes for school-age newcomers via the Ministério da Educação.",
        "tip": "Choose your housing town based on your school choice — the Almancil/Lagoa international school cluster is a daily commute for families based in Faro centre, Tavira, or Lagos. Most expat families with school-age children base in Almancil itself or within 20 minutes of the cluster.",
        "options": [
            {"type": "British curriculum international schools", "description": "Cambridge IGCSE plus A-Level pathway. Several long-established options in the Almancil/Lagoa corridor. Strong with families on multi-country UK or international circuits.", "fees": "$10,000–$18,000/year typical"},
            {"type": "IB curriculum international schools", "description": "IB Diploma plus IB Primary Years Programme schools serving the year-round expat community. Concentrated in the Almancil corridor.", "fees": "$12,000–$20,000/year typical"},
            {"type": "Bilingual private schools", "description": "Several bilingual Portuguese-English schools combine the Portuguese curriculum with significant English-medium instruction. Useful for families wanting Portuguese integration with English-language continuity.", "fees": "$6,000–$12,000/year typical"},
            {"type": "Portuguese public schools", "description": "Free for all residents. Improving quality. Realistic for long-stay families with children willing to learn Portuguese — supported by free Portuguese-language preparation classes for new-arrival children.", "fees": "Free (public)"},
        ],
    },
    "childcare": {
        "summary": "Algarve childcare options include public creche (under-3) and jardim de infância (3–6), private bilingual nurseries (concentrated near Almancil international schools), and au pair arrangements. Public spots are subsidised but limited.",
        "daycareItems": [
            "Creche (Portuguese for nursery — accepts children from 4 months to 3 years) is the standard early-childhood structure for under-3s. Public and IPSS (Instituições Particulares de Solidariedade Social — non-profit social institutions) creches are heavily subsidised based on income (typically $150–$400/month) but waiting lists run 6–12 months — apply via your Junta de Freguesia or municipality as soon as your arrival date is confirmed",
            "Private bilingual creche (English + Portuguese) fees: roughly $400–$800/month. Used by most expat families during the wait for a public spot, particularly in Almancil and surrounding family corridors",
            "Jardim de infância (kindergarten, ages 3–6) is widely available and is the standard pathway from age 3. Public jardim is heavily subsidised; private bilingual options run $500–$900/month",
            "Most international schools also have their own pre-K programmes (ages 2–5) that feed directly into the main school — useful for families wanting curriculum continuity from creche through secondary",
        ],
        "nannyItems": [
            "Full-time nannies (called amas in Portuguese) typically charge $8–$13/hr in the Algarve — moderate compared to Lisbon",
            "Many amas in Almancil and the central Algarve corridor speak some English, particularly those who have worked with expat families. Ask for English specifically when searching",
            "Live-in housekeeper-nanny arrangements (empregada doméstica with childcare duties) are common in larger family villas in Quinta do Lago, Vale do Lobo, and Vilamoura — typically $700–$1,200/month plus room and board",
            "Au pair arrangements are common with English-speaking au pairs — typically ~$500–$700/month plus room and board, often part of a structured au pair agency programme",
        ],
        "whereToFindItems": [
            "Sitly.pt — Portugal's specialised platform for nannies and babysitters with profile verification, active in the Algarve",
            "Search 'Algarve Mums' or 'Expats in Algarve Parents' on Facebook — community groups with personal recommendations and ama introductions, particularly active in Almancil and central Algarve",
            "International schools' parent networks (especially the Almancil/Lagoa cluster) have extensive informal childcare-sharing arrangements — ask the school office during enrolment",
            "Local agencies and word-of-mouth in the Almancil/Vilamoura/Lagoa corridor — the year-round expat community is small enough that trusted referrals are common",
        ],
    },
    "healthcare": {
        "tip": "Get private health insurance from HPA Saúde (the largest Algarve private hospital chain) or international IPMI BEFORE major needs arise — Faro public hospital handles routine cases well but capacity for complex specialist and paediatric cases is limited.",
        "items": [
            "Portugal's healthcare system (SNS — Serviço Nacional de Saúde, the national health service) is universal and largely free for all residents. Register with the SNS at your local Centro de Saúde once your NIF is issued. EU/EEA citizens have automatic access; non-EU residents register once their AIMA residence card is issued.",
            "Hospital de Faro (Centro Hospitalar Universitário do Algarve) is the regional reference public hospital and handles most routine cases well. For complex paediatric or specialist cases, transfers to Lisbon (Hospital de Santa Maria, Hospital de Santa Cruz) are sometimes required.",
            "Private healthcare is widely used by Algarve expat families. HPA Saúde (Hospital Particular do Algarve — the largest private chain in the Algarve, with hospitals in Alvor, Faro, and Albufeira) is the primary private network. Lusíadas Saúde and CUF also operate in the Algarve. Annual family policies run ~$1,500–$4,000/year.",
            "GP and specialist access via SNS: register with a médico de família (family doctor) for routine and specialist referrals. Public GP visits are typically free with a small co-pay; specialist referrals come via your família doctor. Routine waiting times in the Algarve are slightly longer than Lisbon.",
            "International private medical insurance (IPMI — International Private Medical Insurance) is recommended for serious conditions and complex paediatric cases — provides direct access to private hospitals in Faro and Lisbon and can include medevac (medical evacuation) coverage for major cases.",
        ],
    },
    "safety": {
        "score": 87,
        "summary": "The Algarve is one of the safer European regions for families. Violent crime is rare; the main daily risks are summer tourist-zone pickpocketing, Atlantic ocean awareness for beach-going families, and high-speed driving on the A22 highway.",
        "items": [
            "Violent crime is rare in family residential areas — Faro centre, Tavira, Lagos, Almancil, Vilamoura, and Quinta do Lago are all very low-risk neighbourhoods for everyday family life",
            "Pickpocketing is occasional in summer tourist hotspots (Albufeira's strip, Vilamoura marina, Lagos old town in peak season) — keep bags secure but the region overall is much safer than southern European tourist capitals",
            "Atlantic ocean safety is real — Algarve beaches have variable currents and undertow especially on the western Atlantic-facing coast (Sagres, Carrapateira). Lifeguarded beaches and 'bandeira azul' (blue flag) family beaches (Vale do Lobo, Quinta do Lago, Praia da Falésia) are the safer family choices",
            "Driving on the A22 (Algarve coastal highway) is the primary daily hazard — high speeds, frequent overtaking, and summer tourist congestion. Use the A22 carefully especially in school-run hours and on summer weekends",
            "Family residential areas (Faro centre, Almancil, Tavira, Quinta do Lago) are well-lit, active in summer, quieter in winter. Strong international community life around the international schools, with active English-speaking parent networks for after-school activities",
        ],
    },
    "cost": {
        "monthlyFamilyAllIn": "~$3,800–$5,200 / month",
        "rentRange": "~$1,800 / month",
        "familyDinner": "~$60",
        "nannyRate": "~$10 / hr",
    },
    "communityLinks": [
        {
            "label": "Search 'Algarve Expats' on Facebook — large active community for housing, school, and settlement advice",
            "searchQuery": "Algarve Expats Facebook group",
            "url": "https://www.google.com/search?q=Algarve+Expats+Facebook+group",
            "isVerified": True,
        },
        {
            "label": "Search 'Algarve Mums' on Facebook — Algarve-based parent group with on-the-ground advice on schools, doctors, and childcare",
            "searchQuery": "Algarve Mums Facebook group",
            "url": "https://www.google.com/search?q=Algarve+Mums+Facebook+group",
            "isVerified": True,
        },
    ],
    "faq_meta": {"is_island": False, "is_english_native": False},
    "faq_answers": {
        "q1": "Yes — the Algarve is one of Europe's most family-friendly regions for sun-seekers. Strong international school cluster around Almancil, beach access from most family bases, 300+ days of sun per year, and an established year-round expat community. Trade-offs: summer tourist congestion, narrower healthcare for complex cases, and quieter winters in coastal towns.",
        "q2": "Budget $3,800–$5,200/month for a family of four. Rent for a 3-bedroom in Almancil, Faro, or Tavira runs $1,400–$2,400/month for a year-round contract. International school fees of $12,000–$20,000/year are the largest additional cost — but Portuguese public schools are free.",
        "q3": "Manageable if you arrive outside the summer tourist peak (October–May for best long-term rental availability). Year-round rentals in Faro, Tavira, Almancil, and Lagos have steady inventory; summer dominates short-stay listings. Most landlords want NIF, employment contract, and 1–2 months deposit.",
        "q4": "Either works well. The Almancil/Lagoa international school cluster is one of Portugal's strongest at $12,000–$20,000/year. Portuguese public schools are free, improving in quality, and offer free Portuguese-language preparation classes for new-arrival children — realistic for long-stay families.",
        "q5": "Yes for routine cases via SNS registration. For complex paediatric or specialist cases, plan for HPA Saúde (the main Algarve private chain) or transfer to Lisbon. Most expat families subscribe to private insurance ($1,500–$4,000/year) for faster English-speaking specialist access.",
        "q6": "Yes for most Algarve family living. The region is car-dependent — distances between towns are large and public transport (bus only, no metro outside Faro itself) is limited. Most families have 1–2 cars, especially with school commutes from Faro/Tavira/Lagos to the Almancil school cluster.",
        "q7": "Slow and document-heavy. NIF takes minutes; AIMA appointments for non-EU residents have multi-month waits in the Algarve; SNS registration takes 1–4 weeks. Allow 8–12 weeks for everything to settle. Apostille every birth and marriage certificate before you arrive.",
        "q8": "How seasonal the Algarve feels — summer is busy, winter is genuinely quiet with many beach-area restaurants closed. How dependent you are on the international school cluster location — most expat family life with children orbits the Almancil corridor. And how reliable the weather is — 300+ sunny days mean outdoor life is the default rhythm.",
    },
    "sources_extra": {
        "schools": [
            {"label": "Search 'IB World Schools Portugal Algarve' on Google", "url": "https://www.google.com/search?q=IB+World+Schools+Portugal+Algarve", "isVerified": True}
        ],
        "healthcare": [
            {"label": "SNS 24 (Portuguese national health service portal)", "url": "https://www.sns24.gov.pt", "isVerified": True}
        ],
    },
}
