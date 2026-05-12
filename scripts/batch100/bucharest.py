# Bucharest, Romania — Valencia-standard config.
# Romania has country-level visa fallback in countries.json, so this city omits its own visa block.

CITY = {
    "meta": {
        "id": "bucharest-ro",
        "citySlug": "bucharest",
        "countrySlug": "romania",
        "city": "Bucharest",
        "country": "Romania",
        "tagline": "EU capital with low cost of living, growing tech scene, and strong international school options",
        "summary": "Bucharest is one of the most affordable EU capitals — a 3-bedroom in a family neighbourhood costs less than a 1-bedroom in Vienna or Amsterdam. The international school sector is well-established, the tech industry is hiring globally, and EU/EEA families register and move freely. Trade-offs: bureaucracy is paper-heavy, traffic is heavy, and air quality dips in winter.",
        "lastReviewed": "2026-05",
    },
    "actionChecklist": [
        {"label": "EU/EEA citizens: enter visa-free. After 3 months, register at IGI (Inspectoratul General pentru Imigrări — Romania's immigration authority) and obtain a Certificat de Înregistrare. Bring passport, proof of accommodation, and proof of income or employment", "targetSection": "visa"},
        {"label": "Non-EU citizens: apply for a long-stay D visa or the Romanian Digital Nomad Visa (~$3,950/month gross income required) at a Romanian consulate BEFORE travelling — processing takes 30–60 days", "targetSection": "visa"},
        {"label": "Get your CNP (Cod Numeric Personal — Romania's personal numeric code, the equivalent of a tax/ID number) at the local DGEP (Directia Generala de Evidenta a Persoanelor — population records office). Required for renting, banking, and school enrolment", "targetSection": "residency"},
        {"label": "Start your housing search 6–8 weeks before your move — northern districts (Aviatorilor, Floreasca, Primăverii, Băneasa) hold most international-school families and 3-bed flats run ~$1,000–$1,800/month", "targetSection": "housing"},
        {"label": "Apply to international schools 12–18 months before your planned start — the IB and British schools cluster in Pipera (north of the city) and have multi-year waitlists for popular year groups", "targetSection": "schools"},
        {"label": "Open a Romanian bank account — Banca Transilvania, BCR (Erste Bank Group), and ING Bank Romania all support expat applications. Bring passport, CNP, and proof of address", "targetSection": "banking"},
        {"label": "Register with CNAS (Casa Națională de Asigurări de Sănătate — Romania's national health insurance fund) once you have a residence permit and CNP — required to access free public healthcare", "targetSection": "healthcare"},
        {"label": "Find a creșă (nursery for under-3s) or grădiniță (kindergarten for 3–6) early — Bucharest's private bilingual nurseries fill quickly. Public spots are subsidised but limited", "targetSection": "childcare"},
    ],
    "familyFit": {
        "bestFor": [
            "EU/EEA families wanting an affordable EU capital with a growing tech and corporate sector — relocation registration is straightforward",
            "Tech-sector professionals relocating with multinationals (Microsoft, Oracle, UiPath, Bitdefender are headquartered or have major offices here)",
            "Non-EU remote workers using the Romanian Digital Nomad Visa as a low-cost EU base with full Schengen access (Romania joined Schengen for air/sea borders in 2024)",
            "Families wanting strong international schools at half the fees of Vienna, Munich, or Paris — IB tuition runs ~$8,000–$16,000/year in Bucharest vs $20,000+ further west",
        ],
        "watchOutFor": [
            "Daily life is in Romanian — English is widely spoken in central districts, multinationals, and international schools, but bureaucracy, banking forms, and rental contracts assume Romanian. Budget for a translator or relocation agent for the first month",
            "Bucharest traffic is among Europe's worst — commute times from northern family districts to central offices can hit 60–90 minutes in rush hour. Consider hiring near where you live or using flexible-hours arrangements",
            "Air quality dips significantly in winter (November–March) due to heating, traffic, and geographic basin effects. Families with asthma or young children should plan air purifiers at home and check air-quality apps daily",
            "Romanian bureaucracy is slow and document-heavy — expect every step (CNP, residency permit, school enrolment) to take multiple visits and apostilled originals. Allow 8–12 weeks for everything to settle",
        ],
    },
    "residency": {
        "title": "Registration & CNP",
        "tip": "Get your CNP in the first 2 weeks — without it you cannot sign a long-term rental contract, open a bank account, or register children in school.",
        "items": [
            "Apply for your CNP (Cod Numeric Personal — Romania's personal numeric code, the equivalent of a tax/ID number used for every transaction) at the local DGEP (Directia Generala de Evidenta a Persoanelor — population records office in your sector). Bring passport, proof of address, and an apostilled birth certificate. Issued within 2–4 weeks.",
            "EU/EEA citizens: after 3 months, apply for a Certificat de Înregistrare at IGI (Inspectoratul General pentru Imigrări — Romania's immigration authority). Bring passport, CNP, proof of accommodation, proof of income or employment, and health insurance proof.",
            "Non-EU residents: convert your D visa into a Permis de Şedere (residence permit) at IGI within 90 days of arrival. Bring all original documents plus apostilled translations.",
            "Register your address at the local Primărie (city hall of your sector) — required for school enrolment and to receive official correspondence.",
            "Apostille every birth and marriage certificate before you arrive — the Romanian state requires apostilled originals for almost every step and apostille services in Romania can take weeks.",
        ],
    },
    "banking": {
        "title": "Banking",
        "tip": "Banca Transilvania and BCR (Erste Bank Group) are the most expat-friendly — both have English-speaking branches in central districts and accept account opening with passport + CNP.",
        "items": [
            "Banca Transilvania (largest Romanian bank), BCR (Banca Comercială Română — part of Austria's Erste Bank Group), and ING Bank Romania are the three banks most used by expat families. All have English-language online banking.",
            "To open an account you need: valid passport, CNP, and proof of Romanian address (rental contract or utility bill). Some branches require an appointment.",
            "Revolut and Wise are widely used in Bucharest — most landlords, restaurants, and shops accept Revolut transfers. Useful as a bridge while waiting for your Romanian account.",
            "Romania uses the Romanian leu (RON), not the euro — monthly rents are quoted in RON or EUR, salaries in RON. Confirm currency on every contract.",
            "Most Romanian salaries are paid via direct deposit (bank transfer) — your employer needs your IBAN once your account is open.",
        ],
    },
    "housing": {
        "summary": "Bucharest has the lowest housing costs of any EU capital except Sofia. Family-friendly areas cluster in the north — Aviatorilor, Floreasca, Primăverii, Băneasa, Herastrau, and Pipera (the international-school corridor).",
        "bestAreas": [
            "Aviatorilor",
            "Floreasca",
            "Primăverii",
            "Herastrau",
            "Băneasa",
            "Pipera",
            "Cotroceni",
        ],
        "searchPortalsIntro": [
            "These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).",
            "Search 'București' (Romanian for Bucharest) or the neighbourhood name (e.g. 'Floreasca', 'Aviatorilor', 'Pipera') inside each platform to filter local listings.",
            "Tip: arrive in Bucharest with a short-stay Airbnb or serviced apartment booked for the first 3–4 weeks — most landlords show flats in person and asking-vs-paying prices differ by 5–15%.",
        ],
        "searchPortals": [
            {"label": "Imobiliare.ro — Romania's largest property portal", "url": "https://www.imobiliare.ro", "isVerified": True},
            {"label": "Storia.ro — major Romanian rental portal (part of OLX Group)", "url": "https://www.storia.ro", "isVerified": True},
            {"label": "OLX Imobiliare — direct-from-owner Romanian classifieds (no agent fee)", "url": "https://www.olx.ro/imobiliare/", "isVerified": True},
            {"label": "Facebook groups — search: 'Bucharest Expats Housing' or 'Apartamente București' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Bucharest+Expats+Housing+Facebook+group", "isVerified": True},
        ],
        "typicalPrices": [
            "1-bed apartment, Aviatorilor or Floreasca: ~$600–$900 / month",
            "2-bed apartment, Primăverii or Herastrau: ~$900–$1,400 / month",
            "3-bed apartment, Floreasca or Pipera (near international schools): ~$1,200–$1,900 / month",
            "4-bed villa, Băneasa or Pipera gated community: ~$1,800–$3,000 / month",
            "Short-stay serviced apartment (first 3–4 weeks): ~$1,200–$2,200 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport plus CNP (Cod Numeric Personal — Romanian tax/ID code) once issued",
            "Employment contract or 3 months of bank statements proving income",
            "1 month deposit plus first month's rent is standard; some landlords request 2 months deposit for foreigners without a Romanian guarantor",
            "Most rental contracts are registered with ANAF (Romanian tax authority) by the landlord — confirm before signing as registration is your legal protection as a tenant",
            "Furnished vs unfurnished varies a lot — confirm in writing what stays (kitchen, white goods, light fixtures) before paying the deposit",
        ],
    },
    "schools": {
        "summary": "Bucharest has Romania's largest international-school sector, concentrated in the Pipera corridor (north of the city) where most expat families live. Strong IB and British curriculum options with fees well below Western European rates.",
        "publicSystem": "Romanian state schools are free and well-structured but instruction is entirely in Romanian. Realistic only for families with children who already speak Romanian or families planning a long-term stay who prioritise language integration. Most expat families with English-speaking children use the international circuit for at least the first few years.",
        "internationalOptions": "Bucharest's international schools cluster in Pipera (north Bucharest) and along the Aviatorilor / Băneasa corridor. IB Diploma, IB Primary Years Programme, British (Cambridge IGCSE / A-Level), and American (AP) curricula all available. Annual fees run ~$8,000–$16,000/year — significantly below Vienna, Munich, or Paris equivalents. Apply 12–18 months in advance for popular year groups.",
        "languageNotes": "Romanian state schools teach entirely in Romanian. International schools teach in English; some larger schools offer French or German tracks. Romanian is a Romance language and English-speaking children typically reach conversational fluency in 9–12 months in immersion settings.",
        "tip": "Apply to international schools before booking your flights — the most popular IB and British schools in Pipera have multi-year waitlists and do not reserve places without a completed application and supporting documents.",
        "options": [
            {"type": "IB curriculum international schools", "description": "The standard choice for English-speaking expat families. IB Diploma plus IB Primary Years Programme. Concentrated in Pipera north of the city; school buses serve the main expat residential areas.", "fees": "$10,000–$16,000/year typical"},
            {"type": "British curriculum international schools", "description": "British IGCSE (International General Certificate of Secondary Education — Cambridge's globally recognised secondary qualification) and A-Level pathway schools. Several long-established options in Pipera and Băneasa.", "fees": "$8,000–$14,000/year typical"},
            {"type": "American curriculum international schools", "description": "US-style curriculum with AP (Advanced Placement — college-level US courses) tracks. Smaller in number than IB or British options in Bucharest but well regarded.", "fees": "$10,000–$15,000/year typical"},
            {"type": "Romanian state schools", "description": "Free for all residents. All instruction is in Romanian. A realistic option for families with children who already speak Romanian or long-stay families prioritising integration.", "fees": "Free (public)"},
        ],
    },
    "childcare": {
        "summary": "Bucharest has both public and private nursery options. Public creșă (under-3) and grădiniță (3–6) are subsidised but heavily oversubscribed in northern districts. Private bilingual nurseries are more accessible and used by most expat families.",
        "daycareItems": [
            "Creșă (Romanian for nursery — accepts children from a few months to 3 years) and grădiniță (kindergarten — for ages 3–6) form the standard early-childhood structure. Public versions are subsidised but have long waiting lists in Aviatorilor, Floreasca, and Primăverii — apply as soon as your arrival date is confirmed",
            "Private bilingual creșă fees: roughly $400–$900/month depending on hours and language (Romanian + English or Romanian + French). Public grădiniță is free or nominal cost but admission is by district allocation",
            "Many expat families use English-medium or bilingual private nurseries near international schools in Pipera — these are part of the school's pre-K programmes and feed directly into the main school",
            "Visit nurseries in person before committing — quality varies between private providers; ask about staff-to-child ratios, outdoor space, and which language the activities run in",
        ],
        "nannyItems": [
            "Full-time nannies (called bonă or dădacă in Romanian) typically charge $4–$8/hr in Bucharest — significantly below Western European rates",
            "Many bone in northern Bucharest speak some English, particularly those who have worked with expat families in Pipera or with multinational corporate families. Ask for English specifically when searching",
            "Live-in housekeeper-nanny arrangements are common in larger family villas in Băneasa and Pipera — typically ~$700–$1,100/month plus room and board",
            "Start your search 4–6 weeks before arrival — good candidates with English skills go quickly, particularly in the international-school neighbourhoods",
        ],
        "whereToFindItems": [
            "Bonamia.ro — Romania's specialised platform for nannies and babysitters with profile verification",
            "BestJobs.ro — Romania's largest jobs platform with an active 'Domestic Help' section used for bonă listings",
            "Search 'Bucharest Expat Parents' or 'Mămici Expat București' on Facebook — community groups with personal recommendations and bonă introductions",
            "International schools (especially the Pipera cluster) often keep informal nanny lists — ask the school office during enrolment",
        ],
    },
    "healthcare": {
        "tip": "Register with CNAS (Romania's national health insurance fund) once you have your CNP and residence permit — without it your access is limited to private clinics paid out of pocket.",
        "items": [
            "Romania's public healthcare system is run by CNAS (Casa Națională de Asigurări de Sănătate — the national health insurance fund). All registered residents with employment or self-employment status are entitled to coverage; non-EU residents must pay contributions to access it.",
            "Public quality is uneven — central Bucharest hospitals like Spitalul Universitar de Urgență București are well-equipped, but most expat families default to private clinics for routine care and use public hospitals for emergencies only.",
            "Private chains widely used by expat families: MedLife, Regina Maria, Sanador, Medicover. Annual family subscriptions run ~$800–$2,000/year and cover GP, paediatrician, and most specialist visits with English-speaking doctors.",
            "GP and specialist visits at private clinics: roughly $30–$90 per visit; emergencies at private hospitals are more expensive (~$200–$800 per ER visit). International private medical insurance (IPMI — International Private Medical Insurance) is recommended for non-EU residents while waiting for CNAS registration.",
            "Spitalul Clinic de Urgență pentru Copii Maria Sklodowska Curie is Bucharest's main paediatric emergency hospital — used by most families for serious child cases. The Bambini Pediatric Network of private clinics is a popular routine-care choice for expat families.",
        ],
    },
    "safety": {
        "score": 82,
        "summary": "Bucharest is generally safe for families. The main daily risks are traffic, occasional pickpocketing in transit hubs, and winter air quality — not violent crime.",
        "items": [
            "Violent crime is rare in family residential areas — Aviatorilor, Floreasca, Primăverii, Herastrau, and the Pipera corridor are low-risk neighbourhoods for everyday family life",
            "Pickpocketing is the main daily risk — particularly in Gara de Nord (Bucharest's main rail station), busy metro stations, and around tourist sites in the Old Town. Keep bags in front and phones secure",
            "Bucharest traffic is the primary daily hazard — driving culture is aggressive, pedestrian crossings are not always respected, and winter road conditions can be poor. Teach children road awareness early",
            "Air quality dips in winter (November–March) due to heating, traffic, and the geographic basin trapping pollution. Families with asthma or young children should invest in air purifiers and check daily AQI on apps like IQAir",
            "Family residential neighbourhoods (Aviatorilor, Floreasca, Primăverii) are well-lit, active, and safe for evening walks with children. The northern districts have a strong multinational corporate presence and feel notably international",
        ],
    },
    "cost": {
        "monthlyFamilyAllIn": "~$2,800–$4,000 / month",
        "rentRange": "~$1,500 / month",
        "familyDinner": "~$45",
        "nannyRate": "~$6 / hr",
    },
    "communityLinks": [
        {
            "label": "Search 'Bucharest Expats' on Facebook — large active community for housing, school, and settlement advice",
            "searchQuery": "Bucharest Expats Facebook group",
            "url": "https://www.google.com/search?q=Bucharest+Expats+Facebook+group",
            "isVerified": True,
        },
        {
            "label": "Search 'Internations Bucharest' on Google — international community events and meetups",
            "searchQuery": "Internations Bucharest meetups",
            "url": "https://www.google.com/search?q=Internations+Bucharest",
            "isVerified": True,
        },
    ],
    "faq_meta": {"is_island": False, "is_english_native": False},
    "faq_answers": {
        "q1": "Yes — Bucharest is one of the most family-friendly EU capitals on a budget. Strong international school sector, low rent compared to Western Europe, growing tech and corporate sector, and easy weekend trips to the Carpathian mountains. Trade-offs: traffic, winter air quality, and Romanian-language daily life outside expat circles.",
        "q2": "Budget $2,800–$4,000/month for a family of four. Rent for a 3-bedroom in a family neighbourhood (Aviatorilor, Floreasca, Primăverii) runs $1,200–$1,900/month. International school fees of $10,000–$16,000/year are the largest additional cost — but still well below Western European rates.",
        "q3": "Not particularly hard, but the best family flats in northern districts (Aviatorilor, Floreasca, Pipera near international schools) move quickly and most landlords show in person. Budget for a furnished serviced apartment for the first 3–4 weeks while you search. Most landlords require a Romanian CNP (tax code) before signing.",
        "q4": "International school is the standard choice for English-speaking families. Romanian state schools are free but teach entirely in Romanian. Bucharest has a strong international school sector at $10,000–$16,000/year — significantly cheaper than Vienna, Munich, or Paris. Most expat families use it for at least the first few years.",
        "q5": "Yes, once you have your CNP and residence permit. Register with CNAS (Romania's national health insurance fund) for public coverage. Most expat families also subscribe to a private chain (MedLife, Regina Maria, Sanador) at $800–$2,000/year for English-speaking GP and specialist access without waitlists.",
        "q6": "Useful but not essential. Bucharest has a 4-line metro and extensive bus and tram network — most families in central and northern districts can manage car-free. A car becomes useful if you live in Pipera (international-school commute) or for weekend trips to the Carpathians and Black Sea coast.",
        "q7": "Slow and document-heavy. Start with your CNP at the local DGEP, then register at IGI for residency, then with CNAS for healthcare. Apostille every birth and marriage certificate before you arrive. Allow 8–12 weeks for everything to settle. A relocation agent can compress this significantly for a few hundred euros.",
        "q8": "How affordable daily life is — a family dinner at a mid-range restaurant runs ~$45 and a coffee is $2–$3. How traffic-bound the school commute can be from the international-school cluster in Pipera. And how strong the multinational tech corporate community is — Microsoft, Oracle, and dozens of others have major Bucharest offices.",
    },
    "sources_extra": {
        "schools": [
            {"label": "Search 'IB World Schools Romania' on Google", "url": "https://www.google.com/search?q=IB+World+Schools+Romania", "isVerified": True}
        ],
        "healthcare": [
            {"label": "CNAS (Casa Națională de Asigurări de Sănătate)", "url": "https://www.cnas.ro", "isVerified": True}
        ],
    },
}
