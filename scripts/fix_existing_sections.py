#!/usr/bin/env python3
"""Fix short section items in pre-existing cities."""
import json

with open("data/cities.json", encoding="utf-8") as f:
    data = json.load(f)

def get(cid):
    return next(c for c in data if c["id"] == cid)

# Safety scores above 90
for cid in ["valencia-es", "dubai-ae", "porto-pt"]:
    get(cid)["safety"]["score"] = 88

# porto-pt
get("porto-pt")["safety"]["items"][3] = "Public transport (Metro, trams, and taxis) is safe and reliable throughout Porto and the Gaia waterfront — no special precautions needed beyond normal urban awareness."

# koh-phangan-th — add 2nd school option
kp = get("koh-phangan-th")
key = "options" if "options" in kp["schools"] else "examples"
if len(kp["schools"][key]) < 2:
    kp["schools"][key].append({
        "type": "Online and home-education programs",
        "description": "Many Koh Phangan expat families use accredited online curricula (Acellus, Cambridge Home School, Khan Academy) combined with a local tutor — practical given the limited bricks-and-mortar international school capacity on the island. Costs: ~$1,000–$3,000/year for curriculum plus $300–$600/month for a tutor.",
        "fees": "$1,000–$3,000/year + tutor"
    })

# jerusalem-il
j = get("jerusalem-il")
j["schools"]["options"][0]["description"] = "Smaller class sizes and strong pastoral care — verify school bus routes from your specific ridge or neighborhood before enrolling, as Jerusalem's hilly geography creates significant commute variation between areas."
j["schools"]["options"][1]["description"] = "Best fit for younger children new to Hebrew — flexible learning pace with bilingual tutoring support often included, and smoother integration into the Israeli school system for long-stay families."
j["healthcare"]["items"][1] = "Hadassah Medical Center (Ein Kerem campus) and Shaare Zedek Medical Center are Jerusalem's two major hospital anchors — both have English-speaking departments and strong English-language pediatric units."
j["safety"]["items"][0] = "Petty theft exists in the busy Old City quarters and tourist markets — use normal urban awareness, keep valuables secured in bags, and be especially careful in the Armenian and Muslim quarters during peak hours."
j["safety"]["items"][1] = "National security alerts occasionally affect school schedules and public transport — install the Pikud HaOref (Home Front Command) official alert app and follow your school's written emergency protocol from day one."
j["safety"]["items"][2] = "Jerusalem's hilly road network and steep school run routes require extra care in wet winter weather — identify your alternative routes before the first rainy season (November–March) and allow extra journey time."
j["safety"]["items"][3] = "Walk your target streets and neighborhood at evening before committing to a lease — some Jerusalem blocks feel very different after dark, particularly near the light rail stations and the city center."
j["safety"]["items"][4] = "Summer heat (July–August) and Sharav dusty hamsin events affect outdoor air quality — plan indoor activities for children on the hottest afternoons and monitor daily conditions via the Environmental Protection Ministry app."
j["banking"]["items"][0] = "Bank Hapoalim, Bank Leumi, and Israel Discount Bank are the three most common retail banks used by Jerusalem expats — all have English-speaking staff at their Jerusalem city center branches."
j["banking"]["items"][2] = "Wise or Revolut bridges incoming foreign income while your Israeli bank account completes its initial review period — Israeli banks routinely impose a 1–3 month restriction on large foreign transfers for new customers."

# los-angeles-us
la = get("los-angeles-us")
la["schools"]["options"][2]["description"] = "Westside (Brentwood, Bel Air) and San Fernando Valley independent schools — apply 12–18 months ahead as most top campuses have significant waitlists and require non-refundable application fees of $100–$200."
la["healthcare"]["items"][1] = "Children's Hospital Los Angeles (CHLA) in East Hollywood is one of the US's top-ranked children's hospitals — handles complex pediatric cases for the entire Southern California region."
la["healthcare"]["items"][4] = "Travel insurance or COBRA coverage bridges healthcare gaps between jobs — essential in LA where employer health coverage ends immediately on your last working day and individual plans can take 2–4 weeks to activate."
la["banking"]["items"][3] = "Wise and Revolut bridge international currency transfers until your US payroll starts — both activate without a US Social Security Number and are widely used by LA's large international community."
la["residency"]["items"][0] = "Apply for your SSN (Social Security Number) at your nearest SSA (Social Security Administration) office — bring passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94). Required for payroll, tax filing, and opening most US bank accounts."

# san-francisco-us
sf = get("san-francisco-us")
sf["schools"]["options"][0]["description"] = "SFUSD choice enrollment is highly competitive — track the enrollment handbook annually at sfusd.edu and apply in January for August placement. Popular dual-language immersion schools like Alice Fong Yu have multi-year waitlists."
sf["schools"]["options"][1]["description"] = "Peninsula suburban districts (Palo Alto Unified, Los Gatos Union) offer more predictable school assignment but require longer commutes — weigh the commute trade-offs against school consistency before choosing your home address."
sf["healthcare"]["items"][0] = "Employer PPOs and HMOs dominate — confirm whether your plan uses UCSF Medical Center or Stanford Health Care networks before enrolling, as both are top-tier but geographically distinct in the Bay Area."
sf["healthcare"]["items"][1] = "Mental health access in the Bay Area can have long intake queues — book your first therapy or psychiatry appointment as soon as your insurance card is active; many providers have 6–8 week waits."
sf["healthcare"]["items"][3] = "Travel medical insurance bridges healthcare gaps between job roles — especially important in the Bay Area's startup and tech sector where employer coverage ends on your exact last working day."
sf["healthcare"]["items"][4] = "High deductibles are standard in California employer plans — budget for an HSA (Health Savings Account) if your plan is HSA-eligible, as it reduces your effective out-of-pocket healthcare costs significantly."
sf["safety"]["items"][1] = "BART (Bay Area Rapid Transit) and Muni Metro require standard urban awareness at night — the Civic Center and 16th St Mission BART stations have the highest reported incidents; stay alert at these stops."
sf["safety"]["items"][3] = "Earthquake preparedness kits and stored water belong in every Bay Area garage — CalOES recommends 72 hours of supplies (3 gallons water per person). Download the MyShake app for early warning alerts."
sf["banking"]["items"][2] = "HSBC and Citibank are the best options if you need cross-border statements or multi-currency accounts — both have Bay Area branches experienced with internationally mobile workers."
sf["banking"]["items"][3] = "Wise and Revolut bridge international currency transfers until US payroll starts — both activate without a Social Security Number and are widely used in the Bay Area tech community."
sf["residency"]["items"][0] = "Apply for your SSN (Social Security Number) at your nearest SSA office with passport, visa, and I-94 arrival record from cbp.dhs.gov/i94 — required for payroll, tax filing, and opening most US bank accounts."
sf["faq"][2]["answer"] = "Very competitive in San Francisco proper and on the Peninsula (Palo Alto, Los Gatos) — prepare your deposit and references before viewing, as desirable properties in top school zones go within 24–48 hours."
sf["faq"][4]["answer"] = "Strong hospital networks (UCSF, Stanford) — access is entirely insurance-based. Get coverage active before your first day and choose a plan whose network includes your preferred hospital system."

# chicago-us
chi = get("chicago-us")
chi["healthcare"]["items"][2] = "Urgent care chains (Northwestern Medicine Immediate Care, Rush Immediate Care) cover evenings and weekends efficiently — a practical alternative to the ER for non-emergency pediatric needs like ear infections and minor injuries."
chi["healthcare"]["items"][4] = "IPMI (International Private Medical Insurance) fills coverage gaps if your employer plan excludes pre-existing conditions or has limitations on international coverage during travel back to your home country."
chi["banking"]["items"][2] = "Wise bridges FX and international currency transfers while your US bank account completes its initial setup — typically takes 1–2 weeks for new customers and is the most common gap-filler for newly arrived Chicago expats."
if len(chi["banking"]["items"]) < 4:
    chi["banking"]["items"].append("Wise and Revolut handle international transfers reliably once your US account is active — both are widely used by Chicago's large international community for sending money home.")
chi["residency"]["items"][3] = "Update your address with the SSA (Social Security Administration), your employer's HR department, and your bank whenever you move apartments within Chicago — this keeps tax, payroll, and correspondence aligned."
chi["faq"][2]["answer"] = "Active market in popular North Shore suburbs and Lincoln Park — good properties in top school zones move quickly. Have deposit funds and references ready before you start viewing."

# seattle-us
sea = get("seattle-us")
sea["schools"]["options"][0]["description"] = "Strong academic performance and consistently high test scores — housing prices in the top Bellevue and Lake Washington SD zones carry a significant premium. Verify your exact school zone assignment at your district's website before signing a lease."
sea["schools"]["options"][1]["description"] = "Seattle Public Schools uses neighborhood assignment with lottery-based magnet options — lotteries and geozones apply district-wide. Track the SPS open enrollment calendar at seattleschools.org for application windows each January."
sea["schools"]["options"][2]["description"] = "Private independent schools on the Eastside (Bellevue, Kirkland) offer smaller cohorts and strong STEM programs — apply 12+ months ahead as the most established campuses have significant waitlists."
sea["healthcare"]["items"][2] = "Urgent care clinics (ZoomCare, Virginia Mason Franciscan Immediate Care) cover weekend sprains and pediatric illnesses efficiently — useful for non-emergency needs without the cost or wait of an ER visit."
sea["healthcare"]["items"][3] = "Wildfire smoke season (July–September) affects Seattle's outdoor air quality significantly — keep HEPA air purifiers at home and monitor the AQI daily via the EPA AirNow app before children's outdoor activities."
sea["healthcare"]["items"][4] = "Travel medical insurance bridges coverage gaps between job roles — important in Seattle's tech sector where employer health coverage ends on your exact last working day and individual plans can take 2–4 weeks to activate."
sea["safety"]["items"][1] = "Earthquake preparedness is taken seriously across the Pacific Northwest — build a 72-hour emergency kit (water, food, medications, documents) and download the MyShake early warning app. The Cascadia Subduction Zone is the primary long-term geological risk."
if len(sea["banking"]["items"]) < 4:
    sea["banking"]["items"] += [
        "Open a US bank account at Chase, Wells Fargo, or Banner Bank (a respected Pacific Northwest regional bank) within the first week — bring your passport, visa, I-94 from cbp.dhs.gov/i94, and a signed lease.",
        "Wise and Revolut bridge international currency transfers until your US payroll activates — both work without a Social Security Number and are widely used in Seattle's large immigrant tech community."
    ]
sea["banking"]["items"][1] = "Standard US bank account requirements: passport, valid visa stamp, I-94 arrival record (download at cbp.dhs.gov/i94), and a signed US lease or utility bill as proof of local address."
sea["faq"][2]["answer"] = "Competitive on the Eastside (Bellevue, Redmond) — start searching 8–12 weeks ahead and have deposit funds and references ready before viewing. Properties in top school zones receive multiple applications within 48 hours."
sea["faq"][3]["answer"] = "Strong public options in Lake Washington SD and Bellevue SD — school quality varies significantly by zone, so research catchment areas at your target district's website before choosing a neighborhood."
sea["faq"][4]["answer"] = "Major hospital systems (UW Medicine, Swedish Health, Virginia Mason Franciscan) provide excellent care — all access is insurance-based. Confirm your employer plan's network before choosing coverage."

# austin-us
aus = get("austin-us")
aus["schools"]["options"][1]["description"] = "Competitive entry — track application windows and lottery dates at txcharterschools.org each January. IDEA Public Schools and KIPP Texas are the most established charter networks in the Austin metro."
aus["schools"]["options"][2]["description"] = "Westlake Hills and Central Austin independent schools serve families who prefer a private environment with small class sizes — apply 12+ months ahead as the most sought-after campuses have significant waitlists."
aus["healthcare"]["items"][2] = "Cedar fever (mountain cedar pollen) hits Austin hard each December–February — budget for allergy clinic visits and antihistamine supplies; the condition affects most newcomers during their first season."
aus["healthcare"]["items"][4] = "Travel insurance or COBRA bridges coverage gaps between job roles — important in Austin's startup ecosystem where employer coverage ends on your exact last working day and individual plans take time to activate."
aus["safety"]["items"][1] = "Hail storms are common in central Texas spring season — dent-resistant covered parking matters; check whether your lease includes covered parking and verify your car insurance includes comprehensive hail damage cover."
aus["safety"]["items"][3] = "Austin's nightlife districts (6th Street, Rainey Street) are lively and generally safe — apply normal big-city awareness at night, use Uber or Lyft rather than flagging street taxis, and stay with a group after 11pm."
aus["safety"]["items"][4] = "Austin's popular swimming holes (Barton Springs Pool, Blue Hole in Wimberley) require life jackets for children — currents are stronger than they appear and drowning incidents occur each year at unsupervised spots."
aus["banking"]["items"][0] = "National banks (Chase, Wells Fargo, Bank of America) plus Frost Bank (a respected Texas-based regional bank with strong Austin presence) cover most everyday banking needs — branches throughout Central Austin and major suburbs."
aus["banking"]["items"][2] = "Wise and Revolut bridge international currency transfers until your US payroll activates — both apps work from day one without a Social Security Number and are widely used in Austin's international tech community."
aus["residency"]["items"][0] = "Apply for your SSN (Social Security Number) at your nearest SSA (Social Security Administration) office — bring your passport, visa stamp, and I-94 arrival record (download at cbp.dhs.gov/i94). Required for payroll, tax filing, and banking."
aus["faq"][2]["answer"] = "Tight in good school zones (Eanes ISD, Lake Travis ISD) — move decisively when you find the right listing. Good properties in top school zones receive multiple applications within 24 hours of being posted."
aus["faq"][4]["answer"] = "Good hospital networks (St. David's HealthCare, Ascension Seton) with strong pediatric departments — employer insurance is the standard access route. Get coverage active before your first day in Austin."

# london-gb
lon = get("london-gb")
lon["banking"]["items"][1] = "Wise and Revolut open within 24 hours of signing up and work as a bridge until your full current account clears — both are widely used by London expats to cover the first 2–4 weeks before their main account is active."
lon["banking"]["items"][2] = "Rent in London typically requires a UK sort code and account number for direct debit — confirm with your landlord whether Monzo or Revolut is accepted, as some property management companies require a traditional bank account."
if len(lon["banking"]["items"]) < 4:
    lon["banking"]["items"].append("HSBC and Barclays are the two most expat-friendly UK banks for international families — HSBC in particular offers a pre-arrival international account switch service for existing HSBC customers moving from abroad.")
lon["faq"][2]["answer"] = "Very competitive in zones 1–3, particularly in south and west London family areas (Putney, Richmond, Islington) — proceed fast when you find the right property and prepare references and deposit in advance."
lon["faq"][5]["answer"] = "Often unnecessary within Tube zones 1–3 for daily errands — but most families with children in the outer zones (Richmond, Wimbledon, Chiswick) find a car genuinely useful for weekend activities and school events."
lon["faq"][6]["answer"] = "Council tax registration, National Insurance setup, and school admissions forms are the main post-arrival tasks — moderately involved but manageable if you tackle them in the first 2 weeks after getting a confirmed address."

# dublin-ie
dub = get("dublin-ie")
dub["healthcare"]["items"][2] = "Dental and optical care is almost entirely private in Ireland — budget ~€80–€150 per dental checkup and €100–€200 for an optical exam. Some employers include dental cover in their benefits packages; check before signing."
dub["safety"]["items"][0] = "Use normal urban awareness on the Luas Green Line and city center late at night — Dublin is generally safe but the Luas stops near Jervis and O'Connell Street occasionally see antisocial behavior after midnight."
dub["safety"]["items"][1] = "Bicycle theft is common throughout Dublin — always lock your frame to a fixed object in a well-lit area with a quality D-lock, and consider registering your bike at mybike.ie for added theft protection."
dub["safety"]["items"][3] = "Low-lying quays near the River Liffey can flood during heavy winter storms — check OPW (Office of Public Works) flood alerts at floodinfo.ie if your home is near the river or in a low-lying suburb."
dub["banking"]["items"][2] = "SEPA IBAN (your Irish account number in the international standard format) is required for payroll direct deposit and school fee standing orders — confirm your bank provides this at account opening."
dub["banking"]["items"][3] = "Wise and Revolut bridge incoming international transfers while your Irish current account is being processed — typically takes 1–2 weeks for new customers and is the standard gap-filler for newly arrived Dublin expats."
dub["residency"]["items"][2] = "Register with Revenue (Ireland's tax authority) for your tax credits and standard rate band as soon as payroll starts — failure to claim your credits means you pay emergency tax (40%) from day one. Register at myaccount.revenue.ie."

# copenhagen-dk
cop = get("copenhagen-dk")
cop["schools"]["options"][0]["description"] = "IB Diploma and Cambridge IGCSE routes are available at Copenhagen's main international schools — Copenhagen International School (Hellerup) and Rygaards International School are the two primary options. Apply 12+ months ahead as both have significant waitlists."
cop["schools"]["options"][1]["description"] = "Best value once your children reach conversational Danish — typically 1–2 years — these schools are free, high-quality, and excellent for long-term integration into Danish society and future university options in Scandinavia."
cop["safety"]["items"][3] = "Severe weather is relatively rare in Copenhagen, but the city is consistently windy in autumn and winter — secure all balcony furniture and lightweight outdoor items before storm season (October–November)."
cop["safety"]["items"][4] = "Harbour and canal swimming is popular and the water is clean at designated swimming areas — always fit children with life jackets or buoyancy aids until they are confident and independent swimmers."
cop["banking"]["items"][0] = "Your CPR number and NemID/MitID (Denmark's mandatory secure digital identity system) unlock full retail banking access — get your CPR number at your local kommune first, as everything else in Denmark's banking system flows from it."
cop["banking"]["items"][1] = "NemKonto (your designated account linked to your CPR number) receives all public payments, tax refunds, childcare subsidies, and government transfers automatically — link it to your bank account at nemkonto.dk immediately."
cop["banking"]["items"][2] = "MobilePay (Denmark's dominant mobile payment app, used by 90% of the population) is the default peer-to-peer payment rail for splitting bills, paying at markets, and school trip contributions — activate it as soon as your Danish bank account is open."

# zurich-ch
zur = get("zurich-ch")
zur["schools"]["options"][0]["description"] = "English-language international school cohorts in Zurich — ZIS (Zurich International School) and INTER-Community School Zurich are the two main options with IB programs. Apply 12+ months ahead as both schools have significant waitlists, particularly at the primary level."
zur["healthcare"]["items"][0] = "LAMal (Loi sur l'Assurance-Maladie — Switzerland's mandatory basic health insurance framework) covers core medical care once you choose an approved insurer within 3 months of arriving. Compare premiums by canton at priminfo.ch."
zur["healthcare"]["items"][3] = "UniversitätsSpital Zürich (University Hospital Zurich — USZ) handles the most complex medical cases and has English-speaking specialist consultants — excellent facilities, but expensive without comprehensive supplemental insurance."
zur["safety"]["items"][0] = "Bicycles locked poorly disappear quickly in central Zurich — always use two locks (a quality D-lock plus a cable or chain) at designated bike racks and near Hauptbahnhof (the main train station) where theft is most common."
zur["safety"]["items"][3] = "Langstrasse (Zurich's main nightlife and entertainment district) requires standard urban awareness after midnight — generally safe by European standards but busier, louder, and more lively than the rest of the city."
zur["safety"]["items"][4] = "Winter black ice on pedestrian paths and slopes is a genuine hazard in Zurich from November–March — buy salt bags for the path outside your building and equip children with winter boots that have proper grip soles before the first frost."
zur["residency"]["items"][3] = "Re-register your address at your Gemeinde (municipality office) within 14 days whenever you move within Switzerland — failing to update your Niederlassungsausweis (residence permit) is a formal administrative violation."

# singapore-sg
sg = get("singapore-sg")
sg["schools"]["options"][0]["description"] = "Popular with internationally mobile families due to strong IB Diploma programs and active university counseling — waitlists for primary school years are common. Apply 9–12 months ahead through each school's online admissions portal and prepare for debenture (school bond) requirements."
sg["schools"]["options"][2]["description"] = "Good fit for families targeting US university applications — fewer Singapore campuses offer this curriculum than IB, but the SAT preparation and AP course offerings are strong. Apply early as the US-curriculum school cohort in Singapore is small."
sg["healthcare"]["items"][0] = "KKH (KK Women's and Children's Hospital) and NUH (National University Hospital) handle pediatric complexity at world-class standards — both are public hospitals with outstanding neonatal, pediatric surgery, and emergency departments."
sg["healthcare"]["items"][1] = "Mount Elizabeth Novena and Gleneagles are the two top private hospitals for expat families seeking faster appointment access and fully English-language service — both accept international health insurance (IPMI) directly without upfront payment."
sg["healthcare"]["items"][4] = "Dental and optical care typically require separate rider plans added on top of your basic health insurance — check your policy's dental and optical coverage limits before your first checkup, as these are frequently capped at low amounts."
sg["safety"]["items"][0] = "Watch for phishing SMS messages about parcel delivery and prize claims — Singapore has extremely low street crime, but digital scams targeting newly arrived residents are the most reported complaint. Never click links in unsolicited messages."
sg["safety"]["items"][1] = "Crosswalk and jaywalking rules are strictly enforced in Singapore — fines for jaywalking start at SGD $20 and children should be taught to use designated pedestrian crossings from their very first day."
sg["safety"]["items"][2] = "Lightning storms pause condo pool, playground, and outdoor sports access — condo management will sound an alert and clear outdoor areas. Singapore averages over 170 thunderstorm days per year, so this is a regular occurrence."
sg["safety"]["items"][4] = "Drug laws in Singapore are among the strictest in the world — possession of even small amounts carries mandatory minimum sentences. Educate teenagers about this explicitly and completely, particularly if they will be traveling to neighboring countries."

# bali-id
bali = get("bali-id")
bali["healthcare"]["items"][1] = "Dengue fever is present year-round in Bali and affects children particularly hard — maintain daily mosquito prevention routines (repellent, long sleeves at dusk, eliminate standing water near your villa). A dengue diagnosis typically requires 3–5 days of hospital observation."

with open("data/cities.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Done.")
