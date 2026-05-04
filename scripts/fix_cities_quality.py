#!/usr/bin/env python3
"""
Comprehensive quality rewrite for 19 cities in FamiRelo cities.json.
Fixes: politely artifacts, thin healthcare/safety sections, wrong FAQ questions,
cost field format, familyFit counts, childcare structure, banking/residency content.
Preserves: weather blocks, sources blocks.
"""

import json
import re

TARGET_IDS = [
    'charlotte-us', 'raleigh-us', 'charleston-us', 'greenville-sc-us',
    'atlanta-us', 'denver-us', 'nashville-us', 'salt-lake-city-us',
    'phoenix-us', 'tampa-us', 'portland-or-us',
    'mexico-city-mx', 'panama-city-pa', 'santiago-cl', 'montevideo-uy',
    'bogota-co', 'ho-chi-minh-city-vn', 'bengaluru-in', 'mumbai-in'
]

# ─────────────────────────────────────────────────────────────────────────────
# CITY UPDATES
# Each entry contains the sections to fully replace.
# weather and sources are preserved automatically.
# ─────────────────────────────────────────────────────────────────────────────

CITY_UPDATES = {

# ═══════════════════════════════════════════════════════════════════
# CHARLOTTE, NC
# ═══════════════════════════════════════════════════════════════════
'charlotte-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,500–$8,500 / month',
    'rentRange': '~$2,800 / month',
    'familyDinner': '~$65',
    'nannyRate': '~$20 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Banking and finance professionals relocating to Charlotte\'s major corporate headquarters (Bank of America, Truist, Wells Fargo regional offices)',
      'Families wanting mild winters and four seasons without extreme cold or snow',
      'Parents seeking strong public school zones in suburban areas like Ballantyne and Ardrey Kell',
      'Hybrid workers needing frequent flights — Charlotte Douglas International Airport (CLT) is a major Southeast hub',
    ],
    'watchOutFor': [
      'CMS school lottery pressure — popular public school zones are highly competitive; private backup schools cost $15,000–$25,000/year',
      'Humid July and August are oppressive — south-facing homes with no shade become very uncomfortable for outdoor play',
      'No state income tax advantage — North Carolina levies a 4.5% flat income tax on top of federal taxes',
      'Charlotte is entirely car-dependent — there is no practical public transit for suburban families; budget for two vehicles',
    ],
  },
  'healthcare': {
    'tip': 'Activate your employer health plan or enroll in ACA marketplace coverage at healthcare.gov before your first appointment.',
    'items': [
      'Public healthcare in the US does not cover non-citizens — expat families must have private insurance through an employer plan or the ACA marketplace before any medical appointment',
      'Atrium Health (Carolinas Medical Center) and Novant Health are Charlotte\'s two major hospital systems — both have pediatric emergency departments in Ballantyne, SouthPark, and Huntersville',
      'Typical costs without insurance: GP visit $150–$250, specialist $300–$500, ER $1,500–$3,000; with a good employer plan, most visits are copay-only ($25–$50)',
      'Families without employer coverage should enroll in an ACA marketplace plan at healthcare.gov within 60 days of losing prior coverage — family plans cost roughly $700–$1,400/month depending on coverage tier',
      'Charlotte\'s spring pollen season (March–May) is severe — oak, pine, and grass pollen trigger respiratory issues; refill antihistamine and inhaler prescriptions before April and book a pediatric allergist in January',
    ],
  },
  'safety': {
    'score': 80,
    'items': [
      'Violent crime in Charlotte is concentrated in specific corridors (north and west areas near Beatties Ford Road) — family suburbs of Ballantyne, Myers Park, SouthPark, and Dilworth are statistically very safe',
      'Traffic accidents on I-485 and I-77 are the main daily risk — rush hours run 7–9 AM and 4–7 PM; school pickup zones on surface roads require extra patience',
      'Tornado and severe thunderstorm season runs March–May — keep a NOAA weather radio in the house and rehearse your family\'s shelter plan before the season starts',
      'Property crime (package theft, car break-ins) occurs even in affluent suburbs — use video doorbells and don\'t leave valuables visible in parked cars',
      'Charlotte summers are extremely humid and hot (35°C+ feels-like July–August) — keep children hydrated and avoid outdoor play between noon and 4 PM on Code Orange air-quality days',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Charlotte has a wide range of childcare options — licensed centers, church programs, and a strong nanny market across the southern suburbs.',
    'daycareItems': [
      'Licensed daycare centers in Charlotte charge $1,400–$2,400/month for full-day infant and toddler care — prices are highest near Ballantyne and SouthPark corporate corridors',
      'NC Pre-K is a state-funded program for income-eligible 4-year-olds — apply via the Charlotte-Mecklenburg Schools website by January for the following fall',
      'Check NC DHHS star ratings before choosing a center — search "NC child care search" on Google to see state inspection results and star levels for any licensed facility in Charlotte',
    ],
    'nannyItems': [
      'Full-time nanny rates in Charlotte run $18–$22/hr ($3,200–$4,000/month) — expect to pay toward the upper end if the nanny provides transportation to activities',
      'Part-time babysitting runs $16–$20/hr; many families split costs through a two-family nanny share, which can reduce per-family spend by 25–30%',
      'As a household employer paying over $2,700/year in nanny wages, you must withhold and pay payroll taxes — use a service like HomePay or SurePayroll to handle quarterly filings',
    ],
    'whereToFindItems': [
      'Care.com — the largest US caregiver database; filter by "Charlotte NC" to browse verified nanny and sitter profiles with background checks',
      'UrbanSitter — popular with Charlotte families in Dilworth and Myers Park; supports same-day booking for backup care',
      'Search "Charlotte Moms Group" on Facebook — active community where families post caregiver referrals and nanny share opportunities regularly',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Bank of America is headquartered in Charlotte — branches and relationship bankers are accessible citywide, making account setup straightforward for new arrivals.',
    'items': [
      'Bank of America, Chase, and Wells Fargo all have extensive Charlotte branches and accept new-arrival documentation — bring passport, US visa stamp, I-94 from cbp.dhs.gov/i94, and signed lease',
      'Documents required to open a US bank account: passport, valid visa stamp, I-94 printout from cbp.dhs.gov/i94, and proof of address (a signed lease agreement works)',
      'Use Wise or Revolut as a bridge for international transfers before your US account is active — both open online without a US address and hold multiple currencies',
      'Wise is significantly cheaper than US bank wires for international transfers — bank wires cost $25–$45 per transfer; Wise charges 0.5–1.5% with no flat fee',
      'Charlotte is largely cashless — contactless payments are accepted almost everywhere; keep $50–$100 in cash for farmers markets, tips at local restaurants, and some parking meters',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN application in during your first week — your payroll, bank account, and NC driver\'s license timeline all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN — the US\'s primary individual tax and identity number) at any SSA office in week one — bring passport, visa stamp, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, tax filing, and utilities',
      'Get your North Carolina driver\'s license within 60 days of establishing state residency — book at ncdot.gov/dmv; bring passport, visa, I-94, SSN card, and two proofs of NC address (lease + utility bill)',
      'Your children\'s school enrollment in Charlotte-Mecklenburg Schools (CMS) requires proof of address and up-to-date immunization records — contact the CMS school assignment office to confirm your home address\'s zone',
      'Register your vehicle at a NC DMV office within 30 days of establishing residency — you need your title, proof of NC insurance, and an emissions inspection (required in Mecklenburg County)',
      'File a NC state income tax return (Form D-400) for any income earned while resident — NC levies a flat 4.5% income tax; most employers handle withholding automatically but you must file Form D-400 annually',
    ],
  },
  'faq': [
    {'question': 'Is Charlotte good for families?', 'answer': 'Yes — Charlotte is a genuinely family-friendly city with strong suburban school zones, low crime in the right neighborhoods, and a healthy job market anchored by banking, finance, and healthcare. The main trade-off is that the city is entirely car-dependent and very spread out.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $6,500–$8,500/month all-in — covering rent (~$2,800), groceries, childcare, transport, and utilities, but not private school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'The rental market in popular suburbs like Ballantyne and Myers Park moves fast — start searching 8–10 weeks before your move and be ready to sign a lease within days of a viewing.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Most expat families use Charlotte-Mecklenburg public schools — quality varies strongly by zone. Check your address against the CMS boundary map before signing a lease; Ballantyne and south Charlotte zones consistently rank highest.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes, but you need private health insurance — there is no public coverage for non-citizens. Charlotte has two major hospital systems and excellent specialist care; the key task is confirming your insurance before your first appointment.'},
    {'question': 'Do you need a car in Charlotte?', 'answer': 'Yes — Charlotte is one of the most car-dependent cities in the US. You need a car for school runs, grocery shopping, and most activities. Budget for two vehicles if both adults work.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork is sequential but manageable: get your I-94 printout → apply for SSN → open a bank account → get your NC driver\'s license. The full process takes 4–8 weeks; the SSN is the key bottleneck.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how spread out Charlotte is — what looks like a short distance on a map can be a 30-minute drive in traffic. The spring pollen season (March–May) is also more intense than most newcomers expect.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# RALEIGH, NC
# ═══════════════════════════════════════════════════════════════════
'raleigh-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,000–$8,000 / month',
    'rentRange': '~$2,600 / month',
    'familyDinner': '~$60',
    'nannyRate': '~$19 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Pharmaceutical, biotech, and tech professionals relocating to Research Triangle Park (RTP) — home to Biogen, Cisco, SAS, and hundreds of life-science companies',
      'Parents valuing collegiate culture, university hospital access, and strong suburban public school systems',
      'Families using RDU Airport frequently — direct routes to major US hubs and some European destinations',
      'STEM-focused families who want access to NC State, UNC, and Duke campus resources and extracurricular programmes',
    ],
    'watchOutFor': [
      'Wake County school zone maps change periodically — verify your address\'s zone assignment before committing to a lease, not after',
      'Severe spring pollen season from March to May challenges families with asthma or allergies; pediatric allergist waitlists are long in the Triangle',
      'Childcare near RTP is expensive and competitive — expect $1,300–$2,200/month for licensed infant daycare; waitlists form 6–12 months out',
      'North Carolina levies a 4.5% flat state income tax — factor this into salary negotiations if relocating from a no-income-tax state',
    ],
  },
  'healthcare': {
    'tip': 'Most RTP employers offer comprehensive health insurance from day one — confirm your coverage start date before your first appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must secure employer group insurance or enroll in an ACA marketplace plan at healthcare.gov before their first appointment',
      'UNC REX Hospital and Duke Raleigh Hospital are the two main full-service hospitals serving the Triangle — both have pediatric departments and 24-hour emergency care',
      'Typical uninsured costs: GP visit $150–$250, specialist $300–$500, ER $1,500–$3,000; with employer insurance, most visits are copay-only ($20–$50)',
      'Most Research Triangle Park employers provide comprehensive group health insurance — families without employer coverage should enroll in an ACA plan at healthcare.gov within 60 days of moving',
      'Raleigh\'s spring pollen season (March–May) is severe — oak, pine, and grass pollen cause intense symptoms; stock antihistamines before April and book a pediatric allergist in January if your child has respiratory sensitivities',
    ],
  },
  'safety': {
    'score': 82,
    'items': [
      'Violent crime in Raleigh is concentrated in older south and east Raleigh neighborhoods — family areas like North Raleigh, Cary, and Wake Forest are statistically very safe for families',
      'Traffic on I-40 and the I-540 outer loop is the main daily hazard — rush hours run 7:30–9 AM and 4:30–7 PM; build 15–20 extra minutes into school pickup runs',
      'Severe thunderstorms and occasional tornadoes occur March–May — keep a NOAA weather radio and review your home\'s shelter plan before the season starts',
      'Property crime (porch package theft, car break-ins) occurs across all neighborhoods — use video doorbells and don\'t leave valuables visible in parked cars',
      'Raleigh summers are hot and humid (33–36°C feels-like July–August) — limit outdoor activities during the 11 AM–4 PM window on Code Orange air-quality days',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'The Triangle has a strong childcare market with licensed centers, church preschools, and good nanny availability — but infant daycare fills fast near RTP.',
    'daycareItems': [
      'Licensed daycare centers in Raleigh charge $1,300–$2,200/month for full-day infant care — centers near RTP and North Raleigh are most convenient for commuters',
      'NC Pre-K is a state-funded program for income-eligible 4-year-olds — apply via the Wake County Schools website; submit applications by January for fall enrollment',
      'Check the NC DHHS star-rating system before choosing a center — search "NC child care search" on Google to see state inspection results and star ratings for any licensed facility',
    ],
    'nannyItems': [
      'Full-time nannies in Raleigh typically charge $18–$22/hr ($3,200–$4,000/month) — RTP-area nannies are in high demand so good ones place quickly',
      'Part-time babysitting runs $15–$19/hr; nanny shares between two RTP families are common and can reduce per-family cost by 30%',
      'Household employers paying over $2,700/year must handle payroll taxes — services like HomePay or SurePayroll file quarterly employer returns on your behalf',
    ],
    'whereToFindItems': [
      'Care.com — search "Raleigh NC" for local nanny and sitter profiles with background-check options; widely used across Triangle family neighborhoods',
      'Search "Wake County Parents Network" on Facebook — an active group where families post caregiver referrals and nanny share listings',
      'NC State and UNC Chapel Hill student job boards frequently list students and graduates seeking nanny and childcare work in the Triangle',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Most RTP employers use direct-deposit payroll onboarding — your first US bank account is often easiest to open through your employer\'s preferred bank.',
    'items': [
      'Chase, Bank of America, and Wells Fargo all have multiple Raleigh branches and accept new-arrival documentation — bring passport, visa, I-94 from cbp.dhs.gov/i94, and a signed lease',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of NC address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address and hold multiple currencies',
      'Wise is the most cost-effective way to transfer money internationally from the US — bank wires cost $25–$45; Wise charges 0.5–1.5% with no flat fee',
      'Raleigh is a cashless-friendly city — most vendors accept contactless payment; keep $50–$100 in cash for the State Farmers Market and parking in some downtown lots',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN application in during week one — your NC driver\'s license, bank account, and payroll all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office in week one — bring passport, valid visa, and I-94 from cbp.dhs.gov/i94; SSN is required for all US payroll, banking, and tax filing',
      'Get your North Carolina driver\'s license within 60 days of becoming a resident — book at ncdot.gov/dmv; bring passport, visa, I-94, SSN, and two proofs of NC address (lease + utility or bank statement)',
      'Enroll your children in Wake County Public Schools (WCPSS) within 14 days of establishing residency — bring proof of address, immunization records, and any prior school transcripts',
      'Register your vehicle at a DMV office within 30 days of establishing NC residency — you need your vehicle title, proof of NC insurance, and an emissions inspection (required in Wake County)',
      'File a NC state income tax return (Form D-400) for any income earned while resident — NC levies a 4.5% flat rate; employers handle withholding but you must file annually',
    ],
  },
  'faq': [
    {'question': 'Is Raleigh good for families?', 'answer': 'Yes — Raleigh and the Research Triangle are consistently ranked among the best US metros for families, with strong suburban schools, good healthcare, and a lower cost of living than comparable tech hubs. The main trade-off is car dependency and suburban sprawl.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home near RTP typically spends $6,000–$8,000/month all-in — covering rent (~$2,600), groceries, childcare, transport, and utilities.'},
    {'question': 'Is housing hard to find here?', 'answer': 'The rental market near RTP and in North Raleigh is competitive — start searching 8 weeks before your move and be prepared to sign quickly. Cary and Morrisville are slightly less competitive alternatives.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in Wake County work well for most expat families — quality is strong in North Raleigh, Cary, and Morrisville zones. Research your specific zone on the Wake County school assignment map before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Raleigh has excellent healthcare infrastructure with UNC REX and Duke as the major systems. You need private insurance (employer or ACA marketplace); there is no public coverage for non-citizens.'},
    {'question': 'Do you need a car in Raleigh?', 'answer': 'Yes — Raleigh is entirely car-dependent outside a small downtown core. School runs, grocery shopping, and most activities require a car; plan for two vehicles in a two-adult household.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork is sequential but manageable: get your I-94 → apply for SSN → open a bank account → get your NC driver\'s license. The full process takes 4–8 weeks.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how intense the spring pollen season is (March–May) — the Triangle is one of the worst pollen regions in the US. Families also underestimate how car-dependent the suburbs are.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# CHARLESTON, SC
# ═══════════════════════════════════════════════════════════════════
'charleston-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,000–$8,000 / month',
    'rentRange': '~$2,600 / month',
    'familyDinner': '~$65',
    'nannyRate': '~$19 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Defense, aerospace, and manufacturing professionals (Boeing, Bosch, Mercedes-Benz Vans) relocating to Charleston\'s industrial corridor',
      'Families who value coastal lifestyle — beach access, water sports, and outdoor recreation are the city\'s primary draws year-round',
      'Remote workers or small business owners seeking mild winters and a slower pace than major metros',
      'Food and culture lovers — Charleston\'s nationally recognized restaurant and hospitality scene is accessible on a mid-range budget',
    ],
    'watchOutFor': [
      'Hurricane season risk is real — home insurance premiums are high in coastal zip codes, and some areas face mandatory evacuation orders several times per decade',
      'Housing inventory is tight and prices have risen sharply since 2020 — start searching early and expect competition for rentals in Mount Pleasant and downtown',
      'South Carolina levies a state income tax (up to 6.5%) and property insurance is expensive in flood-prone zip codes',
      'Summer heat and humidity (34–37°C feels-like June–September) make outdoor activities difficult for young children midday; plan all outdoor time before 10 AM or after 6 PM',
    ],
  },
  'healthcare': {
    'tip': 'Confirm your health insurance is active before your first day in Charleston — MUSC Health and Roper St. Francis are both in-network with major employer and ACA plans.',
    'items': [
      'Non-citizens in the US have no public healthcare coverage — all expat families must secure employer-provided or ACA marketplace insurance before arriving',
      'MUSC Health (Medical University of South Carolina) is Charleston\'s leading hospital for complex and specialist care; Roper St. Francis is the major community hospital network with pediatric emergency departments',
      'Typical uninsured costs: GP visit $150–$250, specialist $300–$500, ER $1,500–$3,000; with employer insurance, copays typically run $25–$50',
      'Families without employer coverage should enroll in an ACA marketplace plan at healthcare.gov within 60 days of arriving — MUSC Health and Roper St. Francis are in-network with most ACA plans',
      'Flooding during heavy rain events can temporarily block roads to hospitals and urgent care clinics — know your alternate route to the nearest ER before the June–November hurricane season starts',
    ],
  },
  'safety': {
    'score': 78,
    'items': [
      'Violent crime is concentrated in parts of North Charleston — the downtown historic district, Mount Pleasant, and West Ashley are statistically safe for families',
      'Traffic accidents are a main daily risk, particularly during the summer tourist season when downtown roads and the Arthur Ravenel Jr. Bridge become congested',
      'Hurricane season runs June–November — keep a 72-hour emergency kit stocked, know your evacuation zone (search "Charleston County evacuation zones"), and be prepared to evacuate within 24 hours when Category 3+ storms approach',
      'Property crime (car break-ins, opportunistic theft) is common near tourist areas — don\'t leave bags or electronics visible in parked cars, even in residential neighborhoods',
      'Mosquitoes and ticks are prevalent near wetlands and marsh areas from April through October — use repellent on children for outdoor play and check for ticks after nature walks',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Charleston has a growing childcare market with licensed centers, church programs, and an active nanny community — hurricane closures require a backup plan in season.',
    'daycareItems': [
      'Licensed daycare centers in Charleston charge $1,200–$2,000/month for full-day infant care — centers in Mount Pleasant and West Ashley are most convenient for families in those suburbs',
      'SC ABC Voucher Program provides subsidized childcare for income-eligible families — search "South Carolina ABC voucher" on Google to check eligibility and apply through the SC Department of Social Services',
      'Visit centers in person and ask specifically about hurricane-closure plans — some centers close 3–5 days per weather event; you need a backup plan for June–November',
    ],
    'nannyItems': [
      'Full-time nannies in Charleston charge $18–$22/hr ($3,200–$4,000/month) — waterfront and historic district locations attract experienced nannies but competition is high',
      'Part-time babysitting typically runs $16–$20/hr; beach-focused nanny shares are popular among families in Sullivan\'s Island and Isle of Palms',
      'As a household employer, you must withhold and pay Social Security and Medicare taxes on wages above $2,700/year — use HomePay or SurePayroll to manage quarterly filings',
    ],
    'whereToFindItems': [
      'Care.com — largest US caregiver platform; filter by "Charleston SC" to browse vetted nanny profiles with background checks',
      'Search "Holy City Moms" on Facebook — an active Charleston parent community where caregiver referrals and nanny share opportunities are posted regularly',
      'Youth sports sideline introductions and local church networks are the most reliable word-of-mouth channels for long-term nannies in Charleston',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Regional banks like TD Bank and First Reliance have Charleston branches; national banks (Bank of America, Wells Fargo) are best for new arrivals needing quick account setup.',
    'items': [
      'Bank of America, Wells Fargo, and TD Bank all have Charleston branches and accept new-arrival documentation — bring passport, visa, I-94 from cbp.dhs.gov/i94, and a signed lease to open an account',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of SC address (signed lease or utility bill)',
      'Use Wise or Revolut for international transfers before your US account is established — both work online without a US address and hold multiple currencies',
      'Wise is the cheapest option for international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% with no flat fee',
      'Charleston has good contactless payment adoption downtown — carry $40–$60 cash for farmers markets, beach parking, and some smaller restaurants in the old town',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN in week one — it is the key that unlocks your bank account, utility contracts, and payroll setup.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office in your first week — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, and tax filing in the US',
      'Get your South Carolina driver\'s license within 90 days of establishing residency — book at scdmvonline.com; bring passport, visa, SSN, proof of SC address, and proof of SC vehicle insurance',
      'Enroll children in Charleston County School District (CCSD) using proof of address and current immunization records — district zone boundaries determine which school your address is assigned to',
      'Register your vehicle at an SC DMV office within 45 days of becoming resident — you need your vehicle title, proof of SC insurance, and a vehicle inspection',
      'File a South Carolina state income tax return (rates up to 6.5%) for any income earned as a state resident — your employer handles withholding but you must file Form SC1040 annually',
    ],
  },
  'faq': [
    {'question': 'Is Charleston good for families?', 'answer': 'Yes — Charleston offers a high quality of life with beach access, a strong food scene, and safe family neighborhoods in Mount Pleasant and West Ashley. The main trade-offs are hurricane season risk and rising housing costs.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $6,000–$8,000/month all-in — covering rent (~$2,600), groceries, childcare, transport, and utilities.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Charleston\'s housing market has tightened significantly since 2020 — start searching 8–10 weeks before your move. Mount Pleasant rentals move particularly fast; West Ashley offers more inventory at slightly lower prices.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in Charleston County work well for most expat families — Mount Pleasant schools are consistently strong. Research specific zone assignments before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — MUSC Health is an excellent academic medical center and Roper St. Francis covers the community well. You need private insurance; there is no public coverage for non-citizens.'},
    {'question': 'Do you need a car in Charleston?', 'answer': 'Yes — Charleston is car-dependent outside the small downtown peninsula. School runs, grocery shopping, and suburban activities all require a car.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork is sequential but manageable: I-94 → SSN → bank account → SC driver\'s license. The process takes 4–8 weeks; the SSN is the key bottleneck.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most newcomers are surprised by the heat and humidity from June through September — outdoor activities are limited to early mornings. Hurricane season (June–November) also requires more active preparation than most families expect.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# GREENVILLE, SC
# ═══════════════════════════════════════════════════════════════════
'greenville-sc-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$5,000–$6,800 / month',
    'rentRange': '~$2,000 / month',
    'familyDinner': '~$55',
    'nannyRate': '~$17 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Automotive and manufacturing engineers relocating to Upstate SC (BMW, Michelin, GE, and their suppliers all have major operations near Greenville)',
      'Outdoor-loving families who want mountain trails, whitewater rivers, and a walkable downtown at a fraction of Asheville or Charlotte prices',
      'Cost-conscious families leaving pricier metros — Greenville offers Southern metro quality of life at significantly lower housing costs',
      'Families who value a compact, walkable city center with a thriving restaurant scene and strong sense of community',
    ],
    'watchOutFor': [
      'Greenville\'s public school system is large and variable — magnet school applications require early planning; research your specific zone before signing a lease',
      'South Carolina levies a state income tax (up to 6.5%) and sales tax applies to groceries at a reduced rate',
      'Greenville is car-dependent outside the downtown corridor — you need a car for school runs, grocery shopping, and accessing the suburbs',
      'Summer gnats and mosquitoes near the Reedy River and lake areas are a genuine nuisance from May through September',
    ],
  },
  'healthcare': {
    'tip': 'Prisma Health is the dominant health system in Greenville — confirm your insurance is in-network with Prisma before your first appointment.',
    'items': [
      'There is no public healthcare coverage for non-citizens in the US — expat families must secure employer-provided or ACA marketplace insurance before their first appointment',
      'Prisma Health Greenville Memorial Hospital has the Upstate\'s only Level I Trauma Center — Bon Secours St. Francis covers suburban areas with pediatric emergency care',
      'Typical uninsured costs: GP visit $130–$220, specialist $280–$450, ER $1,200–$2,800; with employer insurance, copays typically run $25–$50',
      'Families without employer coverage should enroll in an ACA plan at healthcare.gov within 60 days of establishing residency — Prisma Health is in-network with most ACA plans in the Upstate',
      'Piedmont pollen season (March–May) is intense — oak and grass pollen trigger severe symptoms; refill inhaler and antihistamine prescriptions before spring and ask your employer about Prisma Health\'s pediatric allergy clinic',
    ],
  },
  'safety': {
    'score': 83,
    'items': [
      'Violent crime is very low in Greenville\'s family suburbs (Simpsonville, Mauldin, Taylors, Greer) — the city core near downtown also has low violent crime by US standards',
      'Traffic on US-385 and I-85 can be heavy during rush hours and BMW plant shift changes — build extra time into school pickup schedules on weekday afternoons',
      'Flash floods occur quickly in low-lying areas during severe storms — check FEMA flood zone maps before choosing a rental and keep a 72-hour emergency kit at home',
      'Property crime (car break-ins, package theft) is relatively low by US standards but occurs in suburban neighborhoods — use video doorbells and don\'t leave valuables in parked cars',
      'Summer humidity can be intense (33–36°C feels-like July–August) — schedule outdoor play in the morning and keep children hydrated; the Swamp Rabbit Trail offers shaded riverside walking and cycling',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Greenville has a growing childcare market with licensed centers, YMCA programs, and a strong nanny network — costs are significantly lower than Charlotte or Atlanta.',
    'daycareItems': [
      'Licensed daycare centers in Greenville charge $990–$1,600/month for full-day infant care — centers near the I-85 corridor and Five Forks area are convenient for BMW and manufacturing workers',
      'SC ABC Voucher Program provides subsidized childcare for income-eligible families — search "South Carolina ABC voucher childcare" on Google to check eligibility and apply',
      'YMCA of Greenville operates several child development centers — their after-school programs are popular with families near the Swamp Rabbit Trail neighborhoods; search the Y\'s website for current availability',
    ],
    'nannyItems': [
      'Full-time nannies in Greenville charge $15–$19/hr ($2,600–$3,400/month) — rates are lower than Charlotte or Atlanta but experienced nannies who drive are in high demand',
      'Part-time babysitting runs $13–$17/hr; Furman University and Clemson students are a popular pool for flexible babysitting and after-school tutoring',
      'Household employers must pay payroll taxes on nanny wages above $2,700/year — use HomePay or SurePayroll to manage filings; Zelle and Venmo are commonly used for informal weekly payments',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Greenville SC" to browse local nanny and sitter profiles; most families in Verdae and Simpsonville use this as their primary search tool',
      'Nextdoor Greenville — active neighborhood network where residents post and recommend caregivers; particularly useful for finding part-time babysitters with local references',
      'Furman University and Clemson University student job boards list students seeking nanny, tutoring, and after-school care work in Greenville',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Wells Fargo and Bank of America both have multiple Greenville branches — either is a reliable first banking choice for new arrivals.',
    'items': [
      'Wells Fargo, Bank of America, and TD Bank all have Greenville branches and accept new-arrival documentation — bring passport, visa, I-94 from cbp.dhs.gov/i94, and a signed lease',
      'Documents required: passport, valid US visa stamp, I-94 printout, and proof of SC address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and transfers typically land the same or next business day',
      'Greenville has good contactless payment adoption in downtown restaurants and shops — carry $40–$60 cash for the Saturday Swamp Rabbit Trail Farmers Market and smaller vendors',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Your SSN application is the first thing to do — banking, driver\'s license, and utility setup all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at the Greenville SSA office — bring passport, valid visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, tax filing, and utilities',
      'Get your South Carolina driver\'s license within 90 days of establishing residency — book at scdmvonline.com; bring passport, visa, SSN, proof of address, and proof of SC vehicle insurance',
      'Enroll your children in Greenville County Schools (GCS) using proof of address and current immunization records — research school zones at greenville.k12.sc.us before signing a lease',
      'Register your vehicle at an SC DMV office within 45 days of establishing residency — you need your vehicle title, proof of SC insurance, and a vehicle inspection',
      'File a South Carolina state income tax return for income earned as a SC resident — SC taxes income at rates up to 6.5%; your employer handles withholding but you must file Form SC1040 annually',
    ],
  },
  'faq': [
    {'question': 'Is Greenville good for families?', 'answer': 'Yes — Greenville offers an excellent quality of life at a very competitive price point. The downtown is walkable and welcoming, outdoor recreation is excellent, and the manufacturing job market is strong. It\'s a smaller city, which suits some families perfectly.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $5,000–$6,800/month all-in — one of the most affordable budgets among mid-size US metros.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Greenville\'s rental market is less pressured than Charlotte or Raleigh — you\'ll find good inventory in Simpsonville, Five Forks, and Taylors, though downtown units go quickly.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Greenville County public schools work well for most expat families. Research zone assignments carefully — district quality varies, and a lease in the right zone makes a significant difference.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Prisma Health is a comprehensive system with a Level I Trauma Center and good pediatric coverage. You need private insurance; there is no public coverage for non-citizens.'},
    {'question': 'Do you need a car in Greenville?', 'answer': 'Yes — Greenville is car-dependent outside the walkable downtown core. School runs and most daily activities require a car.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork follows the same sequence everywhere: I-94 → SSN → bank account → SC driver\'s license. The process takes 4–8 weeks and is generally manageable.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most newcomers are surprised by how much Greenville has grown — the downtown is far more vibrant than outsiders expect. The summer heat and humidity from June to September also catches families off guard.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# ATLANTA, GA
# ═══════════════════════════════════════════════════════════════════
'atlanta-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,500–$9,000 / month',
    'rentRange': '~$2,800 / month',
    'familyDinner': '~$65',
    'nannyRate': '~$20 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Corporate professionals relocating to Atlanta\'s Fortune 500 headquarters (Delta, Coca-Cola, UPS, Home Depot, NCR Voyix) or tech hubs',
      'Parents who value access to Children\'s Healthcare of Atlanta (CHOA) — one of the top pediatric hospital systems in the US',
      'Families seeking a major city with Southern hospitality and a lower cost of living than New York, LA, or San Francisco',
      'Food and culture enthusiasts — Atlanta has a nationally recognized restaurant scene and excellent African-American cultural institutions',
    ],
    'watchOutFor': [
      'Atlanta traffic is severe — I-285 and I-75 are among the worst US commutes; factor 45–90 minutes per trip into any school-choice and housing calculations',
      'School quality varies sharply by suburb and zone — Alpharetta, Decatur, and Dunwoody schools perform very differently from in-city APS schools; research before signing a lease',
      'Georgia levies a flat 5.49% state income tax; property taxes in Fulton County are moderate but rising with home values',
      'Summer heat and high ozone levels from June through September create frequent Code Orange air-quality days — outdoor activities require careful scheduling for children with asthma',
    ],
  },
  'healthcare': {
    'tip': 'Children\'s Healthcare of Atlanta (CHOA) has suburban campuses in Alpharetta, Forsyth, and Lawrenceville — confirm which campus is nearest to your neighborhood.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must have employer-provided or ACA marketplace insurance in place before their first appointment',
      'Emory University Hospital and Children\'s Healthcare of Atlanta (CHOA) — one of the top pediatric hospital systems in the US — are the two anchor institutions for families with suburban campuses across the metro',
      'Typical uninsured costs: GP visit $150–$280, specialist $300–$550, ER $1,800–$3,500; with a good employer plan, copays run $25–$50 per visit',
      'Most large Atlanta employers (Delta, Coca-Cola, UPS, NCR) offer comprehensive group health insurance — families without employer coverage should enroll in an ACA plan at healthcare.gov within 60 days',
      'Atlanta\'s spring pollen season (March–May) is among the most intense in the US — pine and oak pollen coat surfaces yellow; stock antihistamines in February and book a pediatric allergist before March',
    ],
  },
  'safety': {
    'score': 76,
    'items': [
      'Atlanta has elevated crime in specific areas — downtown tourist zones, parts of Midtown, and southwest Atlanta; family suburbs like Buckhead, Dunwoody, Alpharetta, and Decatur are statistically very safe',
      'Traffic accidents on I-285, I-75, and I-85 are the main daily risk — Atlanta consistently ranks among the worst US cities for commute traffic; precise school pickup planning is essential',
      'Tornado and severe thunderstorm season runs March–May — keep a NOAA weather radio and review your family\'s shelter plan; tornadoes have struck suburban Atlanta neighborhoods',
      'Property crime (car break-ins, package theft) is common even in affluent suburbs — use video doorbells, lock cars, and avoid leaving bags visible in parked vehicles',
      'Atlanta summers are very hot and humid (35–38°C feels-like June–September) — keep children hydrated, schedule outdoor play before 10 AM, and avoid outdoor activities on Code Red air-quality days',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Atlanta has a large and varied childcare market — the best centers near Buckhead and Midtown have 6–12 month waitlists for infants; start searching early.',
    'daycareItems': [
      'Licensed daycare centers in Atlanta charge $1,400–$2,700/month for full-day infant care — centers near Buckhead, Midtown, and the I-285 Tech Center corridor serve the highest concentration of expat families',
      'Georgia Childcare and Parent Services (CAPS) provides subsidized childcare for income-eligible families — search "Georgia CAPS childcare" on Google to check eligibility requirements',
      'Most quality daycare centers near corporate campuses have 6–12 month waitlists for infants — get on multiple waitlists as soon as your Atlanta relocation is confirmed, even before you have a start date',
    ],
    'nannyItems': [
      'Full-time nannies in Atlanta typically charge $19–$23/hr ($3,400–$4,200/month) — nannies who drive children to activities and manage after-school logistics command a premium',
      'Part-time babysitting runs $17–$21/hr; nanny shares are common in Buckhead and Decatur, allowing two families to share costs and reduce per-family spend by 25–30%',
      'As a household employer in Georgia, you must pay federal payroll taxes on wages above $2,700/year — use HomePay or SurePayroll to handle quarterly filings correctly',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Atlanta GA" to browse vetted caregiver profiles; most families in Buckhead and Dunwoody use this as their primary search tool',
      'Search "Atlanta Moms Group" and "ATL Mommas" on Facebook — active communities where families post nanny referrals and share childcare recommendations',
      'Spelman College and Georgia Tech job boards are reliable sources for qualified part-time nannies and tutors in the Midtown and Decatur areas',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Wells Fargo and Bank of America both have extensive Atlanta networks — either is the fastest route to your first US bank account.',
    'items': [
      'Wells Fargo, Bank of America, and Chase all have numerous Atlanta-area branches and accept new-arrival documentation — bring passport, US visa stamp, I-94 from cbp.dhs.gov/i94, and signed lease',
      'Documents required: passport, valid visa stamp, I-94 from cbp.dhs.gov/i94, and proof of Georgia address (signed lease or utility bill)',
      'Use Wise or Revolut as a bridge for international transfers before your US account is active — both open online without a US address and support multiple currencies',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and is significantly cheaper for regular transfers',
      'Atlanta is largely cashless in restaurants and retail — carry $50–$100 for the Peachtree Road Farmers Market, tips at cash-preferred restaurants, and Ponce City Market vendors',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Apply for your SSN in week one — payroll, your bank account, and your Georgia driver\'s license all require it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any Social Security Administration office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, tax filing, and most utilities',
      'Get your Georgia driver\'s license within 30 days of establishing state residency — book at dds.georgia.gov; bring passport, visa, I-94, SSN card, and two proofs of Georgia address',
      'Enroll your children through the relevant county school district (Atlanta Public Schools, Fulton County, or DeKalb) — bring proof of address and immunization records; zone assignment is based on your home address',
      'Register your vehicle through the Georgia Department of Revenue within 30 days of becoming a resident — you need your title, proof of Georgia insurance, and an emissions test (required in metro Atlanta counties)',
      'File a Georgia state income tax return (Form 500) for income earned as a resident — Georgia levies a flat 5.49% income tax; most employers handle withholding but you must file annually',
    ],
  },
  'faq': [
    {'question': 'Is Atlanta good for families?', 'answer': 'Atlanta is excellent for families who choose their neighborhood carefully. The suburbs of Alpharetta, Dunwoody, and Decatur have strong schools, low crime, and great amenities. The trade-off is severe traffic — your home location relative to work and school matters enormously.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four in a good suburb typically spends $6,500–$9,000/month all-in — covering rent (~$2,800), groceries, childcare, transport, and utilities. The upper end includes private school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'The Atlanta metro is large with plentiful inventory, but popular suburbs like Alpharetta and Dunwoody move fast. Start searching 8 weeks before your move and have a school zone map open before you commit.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in the right suburbs (Alpharetta, Dunwoody, Decatur) are excellent and serve many expat families well. Research zone assignments carefully — there is significant variation across the metro.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Atlanta has outstanding healthcare including Children\'s Healthcare of Atlanta (CHOA), one of the top pediatric systems in the US. Private insurance is required; confirm yours is active before arrival.'},
    {'question': 'Do you need a car in Atlanta?', 'answer': 'Yes — Atlanta is one of the most car-dependent metros in the US. MARTA rail serves a few corridors but is not practical for suburban family logistics. Budget for two vehicles.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork is sequential but manageable: I-94 → SSN → bank account → Georgia driver\'s license → vehicle registration. The full process takes 4–8 weeks.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by the severity of Atlanta traffic — even short distances can take 45–60 minutes during rush hour. The spring pollen (March–May) is also notably intense.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# DENVER, CO
# ═══════════════════════════════════════════════════════════════════
'denver-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$7,000–$9,500 / month',
    'rentRange': '~$3,200 / month',
    'familyDinner': '~$70',
    'nannyRate': '~$22 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Outdoor-loving families who want immediate access to ski resorts, hiking, mountain biking, and camping within 1–2 hours of the city',
      'Clean energy, aerospace, and tech professionals (Lockheed Martin, Ball Aerospace, NREL, and many start-ups are headquartered along the I-25 corridor)',
      'Remote workers who value a strong work-life balance with mountain scenery and an active outdoor community',
      'Families who value access to nationally ranked Children\'s Hospital Colorado and the University of Colorado healthcare system',
    ],
    'watchOutFor': [
      'Denver is expensive by US inland city standards — housing, childcare, and general living costs are higher than most other non-coastal cities',
      'Altitude adjustment takes 1–4 weeks for most adults and children — expect fatigue, headaches, and reduced exercise tolerance when you first arrive',
      'Wildfire smoke in August–October can be severe for several weeks — families with asthma or respiratory conditions should budget for air purifiers and have contingency plans for outdoor activities',
      'Colorado levies a flat 4.4% state income tax plus a Denver city occupational privilege tax; housing has appreciated sharply and rental inventory is tight',
    ],
  },
  'healthcare': {
    'tip': 'Children\'s Hospital Colorado is one of the top-ranked pediatric hospitals in the US — confirm your insurance is in-network before your first pediatric appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must have private insurance through an employer plan or the ACA marketplace before their first appointment',
      'UCHealth University of Colorado Hospital and Children\'s Hospital Colorado (nationally top-ranked for pediatric care) are the primary institutions for complex care in Denver',
      'Typical uninsured costs: GP visit $150–$280, specialist $300–$550, ER $1,500–$3,500; with employer insurance, most visits are copay-only ($25–$60)',
      'Most major Denver employers provide comprehensive group health insurance — families without employer coverage should enroll at healthcare.gov within 60 days; Children\'s Hospital Colorado is in-network with most ACA plans',
      'Denver\'s altitude (1,600 m / 5,280 ft) causes headaches, fatigue, and shortness of breath in the first 1–2 weeks for most newcomers — hydrate heavily, avoid alcohol initially, and be cautious with children\'s outdoor exertion at altitude',
    ],
  },
  'safety': {
    'score': 79,
    'items': [
      'Violent crime is concentrated in specific downtown Denver neighborhoods (parts of Capitol Hill, Five Points, and near Colfax Avenue) — family suburbs like Cherry Creek, Highlands Ranch, Stapleton/Central Park, and Parker are very safe',
      'Traffic on I-25 and I-70 is the main daily risk — rush hours run 7–9 AM and 4–7 PM; winter driving on I-70 mountain roads requires snow tires or chains',
      'Wildfire smoke from August through October is a serious health concern — keep HEPA air purifiers in your home and watch AirNow.gov alerts; keep children indoors when AQI exceeds 100',
      'Property crime (car break-ins, catalytic converter theft) is common across Denver metro — use secure parking where possible and don\'t leave items visible in cars',
      'Winter conditions can be extreme with heavy snowfall — keep all-season or snow tires on your vehicle November through March and maintain emergency supplies in case of road closures',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Denver has an active childcare market but limited infant availability near the Tech Center — get on waitlists 6–12 months in advance.',
    'daycareItems': [
      'Licensed daycare centers in Denver charge $1,600–$2,900/month for full-day infant care — centers near Stapleton (Central Park), Highlands Ranch, and Cherry Creek are most popular with families',
      'Colorado Child Care Assistance Program (CCCAP) provides income-based subsidies — search "Colorado CCCAP" on Google and apply through your county human services office',
      'Quality infant daycare near the Tech Center and downtown has 6–12 month waitlists — get on multiple waitlists as soon as your Denver relocation is confirmed',
    ],
    'nannyItems': [
      'Full-time nannies in Denver typically charge $21–$26/hr ($3,800–$4,700/month) — demand near tech and aerospace employers is high; ski-season nanny demand spikes November–March',
      'Part-time babysitting runs $18–$22/hr; book summer-to-autumn childcare plans well in advance if you need winter ski-season coverage',
      'Household employers must pay Oregon state unemployment insurance in addition to federal payroll taxes — use HomePay or NannyChex, which handle both federal and Colorado-specific filings',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Denver CO" or specific suburbs like Highlands Ranch and Stapleton; most families in tech-corridor neighborhoods rely on this as their primary tool',
      'Search "Denver Moms Group" and "5280 Babies Denver" on Facebook — active communities that post nanny referrals and share childcare recommendations',
      'University of Denver and CU Denver student job boards often list students seeking part-time nanny and tutoring work in Denver and surrounding suburbs',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Wells Fargo and Chase both have extensive Denver coverage — open an account in your first week to start building your US credit history.',
    'items': [
      'Chase, Wells Fargo, and Bank of America all have numerous Denver branches and accept new-arrival documentation — bring passport, visa stamp, I-94 from cbp.dhs.gov/i94, and a signed lease',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of Colorado address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address',
      'Use Wise for ongoing international transfers — bank wire fees cost $25–$45; Wise charges 0.5–1.5% and transfers typically arrive in 1–2 business days',
      'Denver is a very cashless city — most venues, restaurants, and markets accept contactless payment; carry $50–$100 for farmers markets and mountain town cash-preferred vendors',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Apply for your SSN in your first week — your Colorado driver\'s license, bank account, and payroll all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any Social Security Administration office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for all US payroll, banking, and tax filing',
      'Get your Colorado driver\'s license within 30 days of establishing state residency — book at mydmv.colorado.gov; bring passport, visa, I-94, SSN, and two proofs of Colorado address',
      'Enroll your children through Denver Public Schools or the relevant suburban district — bring proof of address and up-to-date immunization records; zone assignment is based on your home address',
      'Register your vehicle at a Colorado DMV office within 90 days of becoming a resident — you need your title, proof of Colorado insurance, and an emissions test (required in most metro Denver counties)',
      'File a Colorado state income tax return (Form DR 0104) for income earned as a resident — Colorado taxes income at a flat 4.4%; employers handle withholding but you must file annually',
    ],
  },
  'faq': [
    {'question': 'Is Denver good for families?', 'answer': 'Yes — Denver is a top choice for active families who want outdoor access, good schools in the suburbs, and a strong job market. The main trade-offs are the high cost of living, altitude adjustment, and wildfire smoke in late summer.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a family suburb typically spends $7,000–$9,500/month all-in — covering rent (~$3,200), groceries, childcare, transport, and utilities.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Yes — Denver\'s rental market is tight, particularly in desirable suburbs like Cherry Creek, Highlands Ranch, and Central Park. Start searching 8–10 weeks before your move.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in Denver suburbs work well for most expat families — Cherry Creek School District and Douglas County are consistently strong. Research zone assignments before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Denver has outstanding healthcare including Children\'s Hospital Colorado, nationally ranked for pediatric care. Private insurance is required; confirm yours is active before arrival.'},
    {'question': 'Do you need a car in Denver?', 'answer': 'Yes for suburban family living — most school runs and grocery trips require a car. RTD light rail covers some corridors but is not practical for most family schedules.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'US newcomer paperwork follows a standard sequence: I-94 → SSN → bank account → Colorado driver\'s license. The altitude adjustment is harder than the paperwork for most families.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by the altitude — expect 1–2 weeks of fatigue, headaches, and shortness of breath for adults and children alike. Wildfire smoke in August–September is also worse than most newcomers anticipate.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# NASHVILLE, TN
# ═══════════════════════════════════════════════════════════════════
'nashville-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,500–$8,500 / month',
    'rentRange': '~$2,800 / month',
    'familyDinner': '~$65',
    'nannyRate': '~$20 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Healthcare executives, hospital professionals, and medical researchers — Nashville is home to over 500 healthcare companies including HCA Healthcare\'s global headquarters',
      'Music industry professionals, media creatives, and content producers drawn to Nashville\'s booming entertainment and technology sectors',
      'Families prioritizing no state income tax — Tennessee has no personal income tax on wages, creating a meaningful take-home pay advantage',
      'Parents who value strong suburban public schools — Williamson County (Brentwood, Franklin) consistently ranks among the top school districts in the Southeast',
    ],
    'watchOutFor': [
      'Property taxes and home insurance in Nashville have surged with the city\'s rapid growth — budgets that worked a few years ago may not hold today',
      'Tornado season (February–May) requires rehearsed family emergency plans — tornadoes have struck residential neighborhoods with very little warning',
      'Nashville\'s infrastructure has not kept pace with population growth — traffic on I-65 and I-40 is severe; factor in commute times before choosing where to live relative to work',
      'The city is very car-dependent — there is no practical public transit for suburban families; budget for two vehicles from day one',
    ],
  },
  'healthcare': {
    'tip': 'Vanderbilt University Medical Center and Monroe Carell Jr. Children\'s Hospital are the region\'s top tier — confirm your insurance is in-network before your first appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must secure employer-provided or ACA marketplace insurance before their first appointment',
      'Vanderbilt University Medical Center is Nashville\'s premier hospital for complex care — Monroe Carell Jr. Children\'s Hospital at Vanderbilt is the region\'s leading pediatric facility',
      'Typical uninsured costs: GP visit $150–$270, specialist $300–$550, ER $1,500–$3,500; with employer insurance (common among Nashville healthcare and tech employers), copays run $25–$50',
      'Families without employer coverage should enroll in an ACA plan at healthcare.gov within 60 days — most Nashville hospitals are in-network with major ACA plans',
      'Nashville\'s tornado season runs February–May — children\'s and family emergency plans should include a designated shelter location; tornadoes have struck multiple Nashville neighborhoods in recent years',
    ],
  },
  'safety': {
    'score': 77,
    'items': [
      'Violent crime is concentrated in specific areas (parts of north Nashville near Dickerson Pike) — family neighborhoods like Brentwood, Franklin, Green Hills, and Belle Meade are statistically very safe',
      'Flash flooding along the Cumberland River and its tributaries is a genuine risk during heavy rain events — verify your rental is not in a FEMA flood zone before signing a lease',
      'Tornado season runs February–May — keep a NOAA weather radio in your home and review your family shelter plan; tornadoes have struck multiple Nashville neighborhoods with little warning',
      'Property crime (package theft, car break-ins) occurs in all neighborhoods — use video doorbells and avoid leaving valuables visible in parked cars, even in suburban driveways',
      'Nashville\'s rapid growth has strained roads — I-65, I-40, and I-24 congestion is severe during rush hours; build 15–30 extra minutes into school pickup schedules September through June',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Nashville has an active childcare market — church programs, licensed centers, and a good nanny pool in Williamson County, though infant spots fill fast.',
    'daycareItems': [
      'Licensed daycare centers in Nashville charge $1,300–$2,400/month for full-day infant care — centers in Brentwood, Franklin, and Green Hills are most convenient for families in those suburbs',
      'Tennessee\'s Voluntary Pre-K program is available for income-eligible 4-year-olds — apply through the Metro Nashville Public Schools website; spots are competitive so apply by January for fall',
      'Church-affiliated Mother\'s Morning Out programs are popular in Nashville\'s family suburbs — fees are lower ($600–$1,100/month) but they are part-time (usually 3 days/week)',
    ],
    'nannyItems': [
      'Full-time nannies in Nashville charge $18–$22/hr ($3,200–$4,000/month) — nannies who drive children to activities are in high demand in the Williamson County suburbs',
      'Part-time babysitting runs $16–$20/hr; Vanderbilt University students are a popular pool for flexible babysitting in Midtown and Green Hills',
      'Household employers must pay federal payroll taxes on nanny wages above $2,700/year — use HomePay or SurePayroll to manage quarterly filings; Zelle and Venmo are standard for weekly payments',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Nashville TN" to browse local nanny profiles; most families in Brentwood and Green Hills use this as their primary search tool',
      'Search "Nashville Moms Group" on Facebook — active community where families post caregiver referrals and nanny share opportunities',
      'Vanderbilt University student job boards often list students and graduate students seeking part-time nanny and tutoring work in Nashville',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Most Nashville healthcare employers offer payroll direct deposit — open your first US bank account the same week you receive your employment paperwork.',
    'items': [
      'Wells Fargo, Bank of America, and Avenue Bank (Nashville-headquartered) all have Nashville locations and accept new-arrival documentation — bring passport, visa, I-94, and signed lease',
      'Documents required: passport, valid US visa, I-94 from cbp.dhs.gov/i94, and proof of Tennessee address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge while your US account is being set up — both work online without a US address',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and typically transfers in 1–2 business days',
      'Nashville is largely cashless in restaurants and retail — carry $40–$60 for the Nashville Farmers\' Market and cash-preferred parking lots downtown',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN in week one — payroll, your bank account, and your Tennessee driver\'s license all require it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, and tax filing in the US',
      'Get your Tennessee driver\'s license within 30 days of establishing residency — book at tn.gov/safety/; bring passport, visa, I-94, SSN card, and two proofs of Tennessee address',
      'Enroll your children through Metro Nashville Public Schools (MNPS) or the relevant county district — bring proof of address and current immunization records; school zone is determined by your home address',
      'Register your vehicle at a Tennessee County Clerk\'s office within 30 days of becoming a resident — bring your vehicle title, proof of Tennessee insurance, and a vehicle inspection certificate',
      'Tennessee has no personal income tax on wages — there is no state income tax return to file for wage earners; however, you must file a federal return annually and may owe taxes on investment income',
    ],
  },
  'faq': [
    {'question': 'Is Nashville good for families?', 'answer': 'Yes — Nashville offers strong suburban schools in Williamson County, no state income tax, and a booming job market in healthcare, tech, and music industries. Rapid growth has brought traffic and housing cost challenges.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $6,500–$8,500/month all-in — covering rent (~$2,800), groceries, childcare, transport, and utilities.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Nashville\'s rental market is competitive, particularly in Brentwood and Franklin. Start searching 8 weeks before your move; suburban inventory is better than inner Nashville but still moves quickly.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Williamson County public schools (Brentwood, Franklin) are excellent and serve most expat families well. Research zone assignments before signing a lease — there is significant variation across the metro.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Vanderbilt University Medical Center and Monroe Carell Jr. Children\'s Hospital are world-class. Private insurance is required; confirm yours is active before your family\'s first appointment.'},
    {'question': 'Do you need a car in Nashville?', 'answer': 'Yes — Nashville is entirely car-dependent. There is no practical public transit for suburban families. Budget for two vehicles in a two-adult household.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Tennessee is one of the simpler US states for newcomers — no state income tax return to file for wage earners. The standard sequence is: I-94 → SSN → bank account → TN driver\'s license.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how expensive Nashville has become — rents and home prices have surged significantly since 2020. Tornado season readiness (February–May) also requires more active preparation than many newcomers expect.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# SALT LAKE CITY, UT
# ═══════════════════════════════════════════════════════════════════
'salt-lake-city-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,000–$7,800 / month',
    'rentRange': '~$2,400 / month',
    'familyDinner': '~$60',
    'nannyRate': '~$19 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Tech professionals relocating to Utah\'s "Silicon Slopes" corridor — Adobe, Oracle, Qualtrics, and hundreds of start-ups are headquartered along the I-15 tech corridor',
      'Ski-loving families who want immediate access to world-class ski resorts (Park City, Snowbird, Alta, Brighton) within 30–45 minutes of the city',
      'Large families — Salt Lake City has above-average family-size demographics, excellent family-oriented infrastructure, and relatively affordable housing by West Coast standards',
      'Remote workers who value mountain recreation and a quieter, more spacious environment compared to coastal tech hubs',
    ],
    'watchOutFor': [
      'Winter temperature inversions cause serious air-quality hazards (Red Air Days) November–February — families with asthma or respiratory conditions find the winter months challenging',
      'Utah\'s liquor laws are notably restrictive — restaurants have different licensing categories, and wine purchase requires a state liquor store',
      'Salt Lake City is car-dependent outside the downtown TRAX light-rail corridor — budget for two vehicles for most suburban family setups',
      'Great Salt Lake water-level declines are raising dust concerns — the area may see more frequent dust events affecting air quality in coming years',
    ],
  },
  'healthcare': {
    'tip': 'Primary Children\'s Hospital is one of the top-ranked pediatric hospitals in the US — confirm your insurance is in-network before your first pediatric appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must secure employer-provided or ACA marketplace insurance before their first appointment',
      'University of Utah Health and Primary Children\'s Hospital (nationally top-ranked for pediatric care) are the primary institutions — Intermountain Health is the major community network',
      'Typical uninsured costs: GP visit $130–$250, specialist $280–$500, ER $1,400–$3,000; with employer insurance, most visits are copay-only ($20–$50)',
      'Most Silicon Slopes tech employers provide comprehensive group health insurance — families without employer coverage should enroll in an ACA plan at healthcare.gov within 60 days',
      'Salt Lake City\'s winter temperature inversions trap air pollution (PM2.5) in the valley November–February — keep a HEPA air purifier running and monitor the Utah Air app; children with asthma should have inhalers current before November',
    ],
  },
  'safety': {
    'score': 84,
    'items': [
      'Violent crime in Salt Lake City is very low by US standards — family suburbs like Draper, Sandy, South Jordan, and Sugar House are statistically safe; the downtown core has moderate property crime',
      'Traffic accidents on I-15 and SR-201 are the main daily risk, particularly during winter snowstorms when roads become icy — ensure your vehicle has all-season or snow tires from November through March',
      'Winter inversions trap smog in the valley November–February, creating significant air-quality hazards — keep HEPA filters running and limit outdoor play for children on Red Air Day alerts',
      'Property crime (car break-ins, catalytic converter theft) occurs across all zip codes — lock vehicles, remove valuables, and use a dash cam as a deterrent',
      'Winter canyon roads to ski resorts require traction tires or chains — check Utah DOT road conditions at udot.utah.gov before any ski trip with children',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Salt Lake City has a large and varied childcare market driven by Utah\'s high birth rate — LDS-affiliated programs are common but secular options are widely available.',
    'daycareItems': [
      'Licensed daycare centers in Salt Lake City charge $1,300–$2,600/month for full-day infant care — centers along the Wasatch Front (Sandy, Draper, Cottonwood Heights) are convenient for Silicon Slopes commuters',
      'Utah Child Care Assistance Program (CCAP) provides income-based subsidies — search "Utah CCAP child care assistance" on Google and apply through the Utah Department of Workforce Services',
      'LDS Church-affiliated preschool programs are common and generally high-quality — check holiday schedules carefully before enrolling, as they follow LDS church calendars',
    ],
    'nannyItems': [
      'Full-time nannies in Salt Lake City charge $17–$22/hr ($3,000–$4,000/month) — ski-season nanny demand spikes November–March; book full-time coverage before September for winter',
      'Part-time babysitting runs $15–$19/hr; BYU and University of Utah students are a popular and reliable pool for flexible babysitting',
      'Household employers must pay federal payroll taxes on nanny wages above $2,700/year — use HomePay or SurePayroll; Venmo is common for weekly payment in Salt Lake City',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Salt Lake City UT" to browse local nanny profiles; widely used across Sandy, Draper, and Sugar House family neighborhoods',
      'Search "Salt Lake City Moms Group" and "Wasatch Moms" on Facebook — active communities where caregiver referrals and nanny shares are posted regularly',
      'BYU and University of Utah student job boards frequently list students seeking part-time nanny and childcare work in the Salt Lake Valley',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Zions Bank is Utah\'s largest regional bank — national chains are easier for new international arrivals needing quick account setup.',
    'items': [
      'Wells Fargo, Chase, and Zions Bank all have multiple Salt Lake City locations and accept new-arrival documentation — bring passport, visa, I-94 from cbp.dhs.gov/i94, and signed lease',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of Utah address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and is significantly cheaper for regular remittances',
      'Salt Lake City is largely cashless in restaurants and retail — carry $40–$60 for the Downtown Farmers Market and mountain town vendors that prefer cash',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Apply for your SSN in week one — your Utah driver\'s license, bank account, and payroll all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, tax filing, and utility deposits in the US',
      'Get your Utah driver\'s license within 60 days of establishing state residency — book at dmv.utah.gov; bring passport, visa, I-94, SSN, and two proofs of Utah address',
      'Enroll your children through Jordan, Canyons, or Salt Lake City School District — bring proof of address and immunization records; school zone is determined by your home address',
      'Register your vehicle at a Utah DMV office within 60 days — you need your title, proof of Utah insurance, and an emissions inspection (required in Salt Lake and Utah counties)',
      'File a Utah state income tax return (Form TC-40) for income earned as a resident — Utah taxes income at a flat 4.65%; employers handle withholding but you must file annually',
    ],
  },
  'faq': [
    {'question': 'Is Salt Lake City good for families?', 'answer': 'Yes — Salt Lake City is one of the most family-friendly US metros with excellent outdoor recreation, good public schools, and a lower cost of living than West Coast tech hubs. The main drawbacks are winter air-quality inversions and liquor law restrictions.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four in a good suburb typically spends $6,000–$7,800/month all-in — one of the more affordable budgets among West Coast-adjacent tech markets.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Salt Lake City\'s rental market is tighter than it used to be following Silicon Slopes growth, but inventory is still better than Denver or Seattle. Draper and Sandy offer good family inventory.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in Salt Lake City\'s suburbs work well for most expat families. Jordan and Canyons districts consistently rank well. Research zone assignments before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Primary Children\'s Hospital and Intermountain Health provide excellent care. Private insurance is required; confirm yours is active before arrival.'},
    {'question': 'Do you need a car in Salt Lake City?', 'answer': 'Yes for suburban family living — TRAX light rail covers some corridors but most school runs and family activities require a car. Snow driving skills are essential from November to March.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Utah is a relatively straightforward state for newcomers: I-94 → SSN → bank account → Utah driver\'s license. The vehicle emissions test is an extra step in Salt Lake County.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most newcomers are surprised by the severity of winter air-quality inversions — during Red Air Days, Salt Lake\'s air quality can be worse than Beijing. The liquor laws also require adjustment for families used to European or coastal US norms.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# PHOENIX, AZ
# ═══════════════════════════════════════════════════════════════════
'phoenix-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,000–$8,000 / month',
    'rentRange': '~$2,500 / month',
    'familyDinner': '~$60',
    'nannyRate': '~$19 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Semiconductor and electronics engineers relocating to Phoenix\'s chip manufacturing corridor (Intel Chandler, TSMC, Microchip Technology) — the largest semiconductor cluster outside East Asia',
      'Golf-loving families and outdoor sports enthusiasts who enjoy a warm-weather lifestyle with hiking and desert recreation year-round',
      'Budget-conscious families leaving California — no California-level income tax (Arizona\'s flat rate is 2.5%), and housing is significantly more affordable',
      'Remote workers who value sunny weather, large suburban homes, and a modern lifestyle without the cost of LA or San Francisco',
    ],
    'watchOutFor': [
      'Summer heat from June through September is extreme (42–45°C) — outdoor activities are limited to early morning; many families reduce outdoor commitments entirely during the hottest months',
      'Phoenix is extremely car-dependent — there is essentially no way to live without a car; budget for two vehicles in a two-adult household',
      'Scorpion encounters in suburban areas bordering desert are common — require consistent preventive habits with young children (shaking shoes, checking towels)',
      'Water scarcity is an escalating long-term concern — Arizona\'s reliance on Colorado River water faces increasing constraints affecting long-term habitability',
    ],
  },
  'healthcare': {
    'tip': 'Mayo Clinic Arizona (Scottsdale campus) and Phoenix Children\'s Hospital are the top-tier options — confirm your insurance is in-network before your first appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must have employer-provided or ACA marketplace insurance before their first appointment',
      'Mayo Clinic Arizona (Scottsdale) and Banner – University Medical Center are premier institutions for complex care; Phoenix Children\'s Hospital is the region\'s leading pediatric facility',
      'Typical uninsured costs: GP visit $150–$280, specialist $300–$550, ER $1,500–$3,500; with employer insurance, copays typically run $25–$60',
      'Most Phoenix-area employers (Intel, Amazon, TSMC, healthcare systems) provide comprehensive group insurance — families without employer coverage should enroll at healthcare.gov within 60 days',
      'Phoenix summer heat is extreme (42–45°C July–August) and causes rapid dehydration in children — never leave a child in a car, keep water bottles with all children, and limit outdoor time between 10 AM and 6 PM from June through August',
    ],
  },
  'safety': {
    'score': 75,
    'items': [
      'Violent crime in Phoenix metro is low in family suburbs like Scottsdale, Chandler, Gilbert, and Tempe — north Phoenix and the Scottsdale suburban ring are among the safest areas in the Southwest',
      'Extreme heat is the greatest health and safety risk in Phoenix — temperatures above 42°C in July–August cause heat exhaustion rapidly in children; know the signs and act immediately',
      'Haboobs (dust storms) can reduce driving visibility to near-zero in minutes — pull off the road, turn off headlights, keep your foot off the brake, and wait out the storm',
      'Monsoon flash flooding (July–September) can rapidly fill dry washes and underpasses — never drive through flooded roads; Arizona\'s "turn around, don\'t drown" rule is enforced by police',
      'Scorpions are common in areas bordering desert — shake out shoes and towels before use, keep garage doors closed, and inspect children\'s outdoor play areas regularly',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Phoenix has a large childcare market across the East Valley suburbs — quality varies significantly, so checking AZ state licensing records before enrolling is essential.',
    'daycareItems': [
      'Licensed daycare centers in the Phoenix metro charge $1,400–$2,600/month for full-day infant care — centers near Chandler, Scottsdale, and Tempe are most convenient for tech-corridor workers',
      'Arizona\'s Child Care Assistance Program (CCAP) provides income-based childcare subsidies — search "Arizona CCAP DES" on Google to check eligibility; apply through the AZ Department of Economic Security',
      'Quality infant daycare near the semiconductor corridor has 6–12 month waitlists — get on multiple waitlists as soon as your Phoenix relocation is confirmed',
    ],
    'nannyItems': [
      'Full-time nannies in Phoenix charge $19–$23/hr ($3,400–$4,200/month) — summer pool-safety certification is a strong plus in Phoenix, where most family homes have private pools',
      'Part-time babysitting runs $16–$20/hr; Arizona State University students are a popular pool for flexible babysitting in Tempe, Scottsdale, and Chandler',
      'Household employers must pay federal payroll taxes on nanny wages above $2,700/year — use HomePay or SurePayroll; Venmo and Zelle are standard for weekly payment',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Phoenix AZ" or specific suburbs like Scottsdale or Chandler; most families in the East Valley use this as their primary search tool',
      'Search "East Valley Moms" and "Scottsdale Moms Group" on Facebook — active communities where families post nanny referrals and childcare recommendations',
      'Arizona State University and Grand Canyon University student job boards frequently list students and graduates seeking nanny and after-school care work in the Phoenix metro',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Chase and Wells Fargo both have hundreds of Phoenix-area branches — either is the fastest route to your first US bank account.',
    'items': [
      'Chase, Wells Fargo, and Desert Financial Credit Union (Arizona\'s largest credit union) all have multiple Phoenix locations and accept new-arrival documentation — bring passport, visa, I-94, and signed lease',
      'Documents required: passport, valid US visa, I-94 from cbp.dhs.gov/i94, and proof of Arizona address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and is significantly cheaper for regular remittances',
      'Phoenix is very cashless — contactless payments are accepted in most restaurants and retail; carry $40–$60 for farmers markets, cash parking in downtown Scottsdale, and informal vendors',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN application in during week one — your Arizona driver\'s license, bank account, and utility deposits all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for payroll, banking, tax filing, and utility contracts',
      'Get your Arizona driver\'s license within 30 days of establishing state residency — book at servicearizona.com; bring passport, visa, I-94, SSN, and two proofs of Arizona address',
      'Enroll your children through the relevant school district (Scottsdale Unified, Chandler Unified, Gilbert Public Schools) — bring proof of address and immunization records',
      'Register your vehicle at an Arizona MVD office within 15 days of establishing residency — you need your title, proof of Arizona insurance, and an emissions inspection (required in Maricopa County)',
      'File an Arizona state income tax return (Form 140) for income earned as a resident — Arizona taxes income at a flat 2.5%; employers handle withholding but you must file annually',
    ],
  },
  'faq': [
    {'question': 'Is Phoenix good for families?', 'answer': 'Phoenix is a good choice for families who can tolerate the summer heat and are comfortable with a car-dependent suburban lifestyle. Excellent schools in Chandler and Scottsdale, very low crime in the suburbs, and no state income tax burden are the main draws.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $6,000–$8,000/month all-in — one of the more affordable budgets among major Sun Belt metros.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Phoenix has more rental inventory than most major US cities — the market is competitive near Chandler and Scottsdale but you can typically secure a lease within 4–6 weeks.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Public schools in Chandler Unified, Scottsdale Unified, and Gilbert Public Schools are strong and serve most expat families well. Research zone assignments before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Phoenix has excellent healthcare including Mayo Clinic Arizona and Phoenix Children\'s Hospital. Private insurance is required; confirm yours is active before your family arrives.'},
    {'question': 'Do you need a car in Phoenix?', 'answer': 'Yes — Phoenix is one of the most car-dependent metros in the US. There is essentially no way to manage school runs, grocery shopping, or activities without a car; most families need two.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Arizona has a flat 2.5% income tax and straightforward newcomer administration: I-94 → SSN → bank account → AZ driver\'s license → vehicle registration. The process takes 3–6 weeks.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Almost everyone underestimates the summer heat — 42–45°C in July and August is genuinely extreme, and it affects outdoor activities, car seat safety, and daily logistics. Most families spend their first summer planning afternoon activities exclusively indoors.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# TAMPA, FL
# ═══════════════════════════════════════════════════════════════════
'tampa-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$6,500–$8,500 / month',
    'rentRange': '~$2,700 / month',
    'familyDinner': '~$65',
    'nannyRate': '~$20 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Logistics, maritime, and finance professionals relocating to Tampa\'s corporate base (Citigroup, USAA, Amazon, and numerous defense contractors have offices here)',
      'Beach-loving families who want Gulf Coast beaches, warm winters, and no Florida state income tax',
      'Remote workers and entrepreneurs seeking a Florida lifestyle at lower cost than Miami — Tampa is 30–40% cheaper than South Florida on most family-spending metrics',
      'Families who value outdoor water sports — kayaking, paddleboarding, boating, and beach access are available year-round',
    ],
    'watchOutFor': [
      'Tampa Bay has high hurricane storm-surge risk — home and flood insurance premiums are among the highest in the US, and some insurers have stopped writing new policies in Florida',
      'Tampa is car-dependent — there is no practical public transit for suburban families; budget for two vehicles in a two-adult household',
      'Florida levies no personal income tax but has high sales tax (7.5% in Hillsborough County) and rising property taxes as home values have surged post-2020',
      'Summer heat and humidity (35–38°C feels-like June–September) with daily afternoon thunderstorms limits outdoor activities to early mornings or evenings',
    ],
  },
  'healthcare': {
    'tip': 'Johns Hopkins All Children\'s Hospital in St. Petersburg is the region\'s premier pediatric facility — confirm your insurance is in-network before any pediatric specialist visit.',
    'items': [
      'There is no public healthcare for non-citizens in the US — expat families must have employer-provided or ACA marketplace insurance before their first appointment',
      'Tampa General Hospital and AdventHealth Tampa are the two main general hospitals; Johns Hopkins All Children\'s Hospital in nearby St. Petersburg is the region\'s premier pediatric facility for serious cases',
      'Typical uninsured costs: GP visit $150–$270, specialist $300–$500, ER $1,500–$3,000; with employer insurance, most visits are copay-only ($25–$50)',
      'Florida Blue and UnitedHealthcare dominate the Tampa market — most large employers offer group plans; families without employer coverage should enroll via healthcare.gov within 60 days',
      'Red tide events near Tampa Bay (typically September–November) release airborne toxins that worsen asthma — check the Florida FWC red tide tracker and keep windows closed on active red-tide days',
    ],
  },
  'safety': {
    'score': 74,
    'items': [
      'Violent crime in Tampa is concentrated in specific east Tampa neighborhoods — family areas like South Tampa, Westchase, Carrollwood, and New Tampa are statistically very safe',
      'Hurricane season runs June 1 – November 30 and Tampa Bay has one of the highest storm-surge risk profiles in the US — stock a 72-hour kit, know your evacuation zone, and be prepared to evacuate when Category 3+ storms approach',
      'Lightning strikes are more frequent in Tampa than almost anywhere in the US — keep children out of pools and off open fields during 2–6 PM summer afternoon thunderstorms',
      'Property crime (car break-ins, package theft) is common across the metro — use video doorbells, lock cars, and avoid leaving bags visible in parked vehicles',
      'Flooding after heavy rain events can temporarily close roads in low-lying neighborhoods — verify your rental is not in a FEMA flood zone before signing a lease; flood insurance may be required by your landlord',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Tampa has a large childcare market across the suburbs — Florida\'s free Voluntary Pre-K program saves significant money for 4-year-olds.',
    'daycareItems': [
      'Licensed daycare centers in Tampa charge $1,300–$2,400/month for full-day infant care — centers in South Tampa, Carrollwood, and Westchase are most convenient for those suburbs',
      'Florida\'s Voluntary Pre-K (VPK) program is free for all Florida 4-year-olds — search "Florida VPK" on Google to find a participating provider and enroll by January for fall; this saves approximately $8,000–$12,000/year in childcare costs',
      'Hurricane season (June–November) can cause 3–5 day center closures per weather event — have a backup childcare plan and work with your employer on flexible scheduling during hurricane alerts',
    ],
    'nannyItems': [
      'Full-time nannies in Tampa charge $18–$22/hr ($3,200–$4,000/month) — nannies who provide pool supervision are in especially high demand',
      'Part-time babysitting runs $16–$20/hr; University of Tampa and USF students are a popular pool for flexible babysitting in South Tampa and Carrollwood',
      'Household employers must pay federal payroll taxes on nanny wages above $2,700/year — use HomePay or SurePayroll; Zelle and Venmo are standard for weekly payment',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Tampa FL" to browse local nanny profiles; widely used across South Tampa, Westchase, and New Tampa',
      'Search "Tampa Bay Moms Group" on Facebook — active community where families post nanny referrals and coordinate childcare sharing',
      'University of Tampa and USF student job boards list students seeking nanny work; Hillsborough County Facebook neighborhood groups are also reliable for word-of-mouth referrals',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Most Tampa employers use direct deposit — open your US bank account the same week you receive your employment paperwork.',
    'items': [
      'Chase, Bank of America, and Wells Fargo all have numerous Tampa-area branches and accept new-arrival documentation — bring passport, visa, I-94 from cbp.dhs.gov/i94, and signed lease',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of Florida address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address and hold multiple currencies',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and is typically 5–10x cheaper for regular remittances',
      'Tampa is largely cashless in restaurants and retail — carry $40–$60 for the Saturday morning farmers market in Hyde Park and some cash-only beach vendors',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN in week one — your Florida driver\'s license, bank account, and payroll all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for US payroll, banking, tax filing, and utility contracts',
      'Get your Florida driver\'s license within 30 days of establishing state residency — book at flhsmv.gov; bring passport, visa, I-94, SSN, and two proofs of Florida address (lease + utility bill)',
      'Enroll your children in Hillsborough County Public Schools (HCPS) using proof of address and current immunization records — search the HCPS school finder on Google to determine your zone assignment',
      'Register your vehicle at a Florida Tax Collector\'s office within 30 days of establishing residency — bring your title, proof of Florida insurance, and an odometer reading',
      'Florida has no personal state income tax on wages — there is no FL state return to file; however, you must file a federal return annually and may owe taxes on investment or rental income',
    ],
  },
  'faq': [
    {'question': 'Is Tampa good for families?', 'answer': 'Tampa is a great choice for families who want warm weather, beach access, and no state income tax. South Tampa, Westchase, and Carrollwood are safe and family-friendly. Hurricane season preparation is a real responsibility, not just a theoretical concern.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a good suburb typically spends $6,500–$8,500/month all-in — covering rent (~$2,700), groceries, childcare, transport, and utilities.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Tampa\'s rental market is competitive, particularly in South Tampa and Carrollwood. Start searching 8 weeks before your move; New Tampa and Wesley Chapel offer more inventory at slightly lower prices.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Hillsborough County public schools work well for most expat families. Quality varies by zone — research school assignments before committing to a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Tampa has solid healthcare infrastructure. Johns Hopkins All Children\'s in St. Petersburg is exceptional for pediatric care. Private insurance is required; confirm yours is active before arrival.'},
    {'question': 'Do you need a car in Tampa?', 'answer': 'Yes — Tampa is entirely car-dependent. There is no practical public transit for suburban families. Budget for two vehicles in a two-adult household.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Florida is one of the simpler US states for newcomers — no state income tax return for wage earners. The sequence is: I-94 → SSN → bank account → FL driver\'s license → vehicle registration.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how seriously residents take hurricane preparedness — it\'s not optional. The afternoon thunderstorms from June through September also restrict outdoor activities daily in ways newcomers don\'t expect.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# PORTLAND, OR
# ═══════════════════════════════════════════════════════════════════
'portland-or-us': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$7,500–$10,000 / month',
    'rentRange': '~$3,000 / month',
    'familyDinner': '~$70',
    'nannyRate': '~$23 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Nike, Adidas, and Precision Castparts employees — these employers anchor Portland\'s corporate landscape and often provide relocation packages',
      'Outdoor-loving families who want access to skiing (Mt. Hood), hiking (Columbia River Gorge), and year-round outdoor activities within an hour of the city',
      'Craft industry creatives, animators, and technology professionals attracted to Portland\'s distinctive culture and startup scene',
      'Families who value transit-accessible urban living — Portland\'s MAX light-rail network connects many neighborhoods without requiring a car for all trips',
    ],
    'watchOutFor': [
      'Oregon levies no sales tax but has one of the highest personal income tax rates in the US (up to 9.9%) — this significantly reduces take-home pay versus Texas, Florida, or Washington',
      'Portland has a visible homelessness challenge in parts of downtown and Burnside — scout neighborhoods both in daytime and at night before committing to a rental',
      'Wildfire smoke in August–October affects outdoor activities and air quality for weeks — families with respiratory conditions should plan carefully for this season',
      'Portland is among the most expensive US cities in which to rent a family home — a 3-bedroom in a family-friendly suburb costs $3,000–$4,000/month',
    ],
  },
  'healthcare': {
    'tip': 'Oregon Health & Science University (OHSU) and Doernbecher Children\'s Hospital are the region\'s premier academic medical facilities — confirm your insurance is in-network before your first appointment.',
    'items': [
      'There is no public healthcare for non-citizens in the US on temporary visas — expat families must have employer-provided or ACA marketplace insurance before their first appointment; Oregon\'s Medicaid (OHP) covers qualifying lawful permanent residents, not temporary visa holders',
      'Oregon Health & Science University (OHSU) is the state\'s premier academic medical center — Doernbecher Children\'s Hospital on the OHSU campus is the region\'s top pediatric facility',
      'Typical uninsured costs: GP visit $150–$300, specialist $300–$600, ER $1,800–$4,000; with employer insurance, copays run $25–$60',
      'Families without employer coverage should enroll in an ACA marketplace plan at healthcare.gov within 60 days — Providence Health, Kaiser Permanente, and Legacy Health are the main provider networks',
      'Wildfire smoke from August through October can cause dangerous air-quality conditions for several weeks — invest in a HEPA air purifier before August, monitor AirNow.gov, and keep children indoors when AQI exceeds 100',
    ],
  },
  'safety': {
    'score': 73,
    'items': [
      'Violent crime in certain downtown and Burnside corridor areas has increased since 2020 — family neighborhoods like Lake Oswego, Beaverton, West Linn, and the West Hills are statistically much safer and are where most expat families live',
      'Portland lies on the Cascadia Subduction Zone, which carries significant major earthquake risk — secure tall furniture to walls, keep a 72-hour earthquake emergency kit, and check your building\'s seismic rating before renting',
      'Wildfire smoke in August–October can reach hazardous levels for several weeks per year — keep HEPA air purifiers running and have a family plan for smoke days when children should not go outside',
      'Property crime (car break-ins, bike theft, package theft) is common across the metro — use secure parking, quality bike locks, and video doorbells regardless of neighborhood',
      'Traffic on I-5, I-205, and the Sunset Highway is heavy during rush hours — build 20–30 extra minutes into school pickup schedules and plan alternative routes for major bridge closures',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Portland has high childcare costs — Oregon has some of the most expensive infant care in the US; start searching and applying to waitlists early.',
    'daycareItems': [
      'Licensed daycare centers in Portland charge $1,800–$3,200/month for full-day infant care — Oregon has some of the highest childcare costs in the US; centers near the Nike campus in Beaverton are in high demand',
      'Oregon\'s Employment-Related Day Care (ERDC) program provides income-based subsidies for families earning up to 85% of state median income — search "Oregon ERDC childcare assistance" on Google and apply through Oregon DHS',
      'Oregon requires all licensed daycare facilities to be state-licensed through the Office of Child Care (OCC) — look for "OCC licensed" facilities when searching; this provides an extra quality verification layer',
    ],
    'nannyItems': [
      'Full-time nannies in Portland charge $21–$26/hr ($3,800–$4,700/month) — Oregon\'s high minimum wage ($14.20/hr statewide) means nanny rates are among the highest in non-coastal US cities',
      'Part-time babysitting runs $18–$23/hr; Portland State University and Reed College students are a popular pool for flexible babysitting in inner Portland neighborhoods',
      'Household employers must pay Oregon state unemployment insurance in addition to federal payroll taxes — use HomePay or NannyChex, which handle both federal and Oregon-specific filings',
    ],
    'whereToFindItems': [
      'Care.com — filter by "Portland OR" or specific suburbs like Beaverton and Lake Oswego; most Portland families use this as their primary nanny search tool',
      'Search "Portland Moms Group" and "PDX Parents Network" on Facebook — active communities for nanny referrals and childcare sharing arrangements',
      'Portland State University and Reed College student job boards often list students seeking part-time nanny and childcare work in Portland\'s inner neighborhoods',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Oregon has no sales tax but one of the highest personal income tax rates in the US (up to 9.9%) — factor this into your paycheck calculations from day one.',
    'items': [
      'Chase, Wells Fargo, and Umpqua Bank (an Oregon-based regional bank known for customer service) all have multiple Portland locations — bring passport, visa, I-94 from cbp.dhs.gov/i94, and a signed lease to open an account',
      'Documents required: passport, valid US visa stamp, I-94 from cbp.dhs.gov/i94, and proof of Oregon address (signed lease or utility bill)',
      'Use Wise or Revolut as an international transfer bridge before your US account is active — both work online without a US address and hold multiple currencies',
      'Use Wise for ongoing international transfers — US bank wires cost $25–$45; Wise charges 0.5–1.5% and is the standard tool for expat international money transfers',
      'Portland is largely cashless for restaurants and retail — carry $50–$80 for the Portland Saturday Market, some food trucks, and farmers markets across the metro',
    ],
  },
  'residency': {
    'title': 'Registration & Social Security Number',
    'tip': 'Get your SSN in week one — your Oregon driver\'s license, bank account, and payroll all depend on it.',
    'items': [
      'Apply for your Social Security Number (SSN) at any SSA office — bring passport, visa, and I-94 from cbp.dhs.gov/i94; SSN is required for US payroll, banking, tax filing, and utility contracts',
      'Get your Oregon driver\'s license within 30 days of establishing state residency — book at oregon.gov/odot/dmv; bring passport, visa, I-94, SSN, and two proofs of Oregon address (lease + utility bill)',
      'Enroll your children through Portland Public Schools (PPS) or the relevant suburban district (Beaverton, Lake Oswego) — bring proof of address and current immunization records; zone assignment is based on your home address',
      'Register your vehicle at an Oregon DMV office within 30 days of establishing residency — Oregon requires a vehicle registration fee based on model year; no emissions test is required in most counties',
      'File an Oregon state income tax return (Form OR-40) for income earned as a resident — Oregon has a graduated income tax up to 9.9%; employers handle withholding but investment and rental income may require estimated quarterly payments',
    ],
  },
  'faq': [
    {'question': 'Is Portland good for families?', 'answer': 'Portland has genuine appeal for families who value outdoor recreation, progressive culture, and transit accessibility. The main trade-offs are Oregon\'s high income tax (up to 9.9%), expensive childcare, high rents, and wildfire smoke in late summer.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom home in a family suburb typically spends $7,500–$10,000/month all-in — one of the higher budgets among inland US metros due to Oregon\'s income tax and expensive childcare.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Portland\'s rental market is competitive, particularly in Lake Oswego, Beaverton, and inner SE Portland. Start searching 8–10 weeks before your move. Suburban options in Beaverton offer more availability.'},
    {'question': 'Do children need international school here, or can public schools work?', 'answer': 'Portland Public Schools and Beaverton School District work well for most expat families. Research zone assignments and school ratings before signing a lease.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — OHSU and Providence Health provide excellent care. Private insurance is required; confirm yours is active before arrival. Wildfire smoke season requires an additional health preparation step.'},
    {'question': 'Do you need a car in Portland?', 'answer': 'Less so than most US cities — Portland\'s MAX light rail covers key corridors and many inner neighborhoods are walkable. However, suburban family life (school runs, activities) still typically requires a car.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Oregon\'s income tax system is complex by US standards — Oregon Form OR-40 has multiple local income tax add-ons (Metro, Multnomah County). The standard newcomer sequence is: I-94 → SSN → bank account → OR driver\'s license.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by Oregon\'s high income tax — take-home pay can be 8–10% lower than expected if relocating from Texas or Florida. Wildfire smoke in August–September is also more severe than most newcomers anticipate.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# MEXICO CITY, MX
# ═══════════════════════════════════════════════════════════════════
'mexico-city-mx': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$5,500–$8,000 / month',
    'rentRange': '~$2,200 / month',
    'familyDinner': '~$45',
    'nannyRate': '~$9 / hr',
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Mexico City" or specific colonia names (Polanco, Roma, Condesa) inside each platform to filter local listings.',
      'Tip: start with a 2–4 week serviced apartment rental in your target colonia — it is much easier to negotiate a long-term lease after viewing the neighborhood in person.',
    ],
  },
  'schools': {
    'options': [
      {
        'type': 'Bilingual IB and AP curriculum schools (ASOMEX-member)',
        'description': 'Mexico City has 20+ internationally accredited bilingual schools offering IB, AP, or US diploma programmes. Most follow Mexican school holidays and require Spanish alongside English instruction. Located primarily in Polanco, Santa Fe, Lomas de Chapultepec, and Pedregal.',
        'fees': '$14,000–$28,000/year typical'
      },
      {
        'type': 'Montessori and progressive bilingual nurseries',
        'description': 'Established Montessori schools with waitlists in Roma and Condesa. Good option for younger children (ages 2–6) before transitioning to a full international curriculum.',
        'fees': '$9,000–$18,000/year typical'
      },
      {
        'type': 'Public SEC-registered schools',
        'description': 'Free and generally adequate but instruction is entirely in Spanish. Suitable only for children with strong Spanish skills or those planning a long-term stay (2+ years) with dedicated language support.',
        'fees': 'Free'
      }
    ],
  },
  'familyFit': {
    'bestFor': [
      'Executives and entrepreneurs based in one of Latin America\'s largest business hubs — Mexico City hosts hundreds of multinational regional headquarters',
      'Families who want a full international city lifestyle (arts, food, culture, international schools) at a fraction of the cost of European or North American equivalents',
      'Parents looking for affordable international schooling — quality bilingual schools charge $14,000–$28,000/year, well below comparable US or UK options',
      'Spanish-learning families who want full immersion in a vibrant cultural environment while maintaining access to a strong expat community',
    ],
    'watchOutFor': [
      'Air pollution is a genuine health concern on high-alert days — pollution peaks March–May before rains clear the air; the altitude (2,240 m) also takes 1–2 weeks to adjust to',
      'Traffic congestion is severe and unpredictable — school pickup schedules and cross-city commutes are highly variable; budget 1–2 hours for longer journeys',
      'Bureaucratic processes for residency and work permits are slow — plan 4–8 weeks and hire a local immigration lawyer to avoid common pitfalls',
      'Water safety requires daily attention — always drink bottled or filtered water; carry a filter bottle for children in school',
    ],
  },
  'healthcare': {
    'tip': 'ABC Medical Center and Hospital Ángeles Pedregal are the top choices for English-speaking expat families — confirm your IPMI policy covers both before registering.',
    'items': [
      'IMSS (Instituto Mexicano del Seguro Social — Mexico\'s mandatory social security healthcare system) covers formally employed workers in Mexico; without IMSS enrollment, all expats use private hospitals exclusively',
      'For families without IMSS, ABC Medical Center (Santa Fe and Observatorio campuses) and Hospital Ángeles Pedregal are the two top private hospitals — both have English-speaking staff and dedicated pediatric departments',
      'Typical private costs: GP consultation ~$50–$80, specialist ~$80–$170, ER ~$300–$750; significantly cheaper than equivalent US care but international insurance is still essential',
      'International private medical insurance (IPMI) is recommended for all expat families — Cigna Global, Bupa Global, and AXA are widely used; expect $3,000–$6,000/year for a family of four',
      'Mexico City sits at 2,240 m altitude — expect 3–10 days of adjustment (headaches, fatigue, breathlessness) on arrival; children may feel the effects more acutely; stay well-hydrated and reduce children\'s physical exertion for the first week',
    ],
  },
  'safety': {
    'score': 71,
    'items': [
      'Violent crime in Mexico City is concentrated in specific outer colonias — the expat family areas of Polanco, Condesa, Roma, Santa Fe, and Lomas de Chapultepec have low violent crime rates and are safe for daily family life',
      'Express kidnapping (brief forced ATM withdrawal) and phone snatching are the most serious risks affecting expats — use only Uber or CDMX-licensed taxis, never street-hail taxis, and keep phones out of sight in busy streets',
      'Mexico City sits on a lakebed with significant earthquake risk — earthquakes above 6.0 have occurred in 1985, 2017, and 2019; register with the SASMEX seismic alert app and practice family evacuation drills',
      'Air pollution (ozone and PM2.5) is a concern March–May and on weather inversion days — monitor the CDMX Calidad del Aire app and keep children indoors when the index exceeds 150',
      'Always use Uber or a trusted private driver for airport transfers and late-night travel — Uber is reliable, inexpensive, and tracked; never use unregistered taxis',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Mexico City has a strong childcare market with licensed guarderías, agency-sourced nannies, and expat community referral networks, particularly in Polanco and Condesa.',
    'daycareItems': [
      'Licensed guarderías (daycare centers) in Polanco, Condesa, and Santa Fe charge $850–$1,600/month for full-day infant and toddler care — centers affiliated with bilingual schools often have sibling enrollment priority',
      'IMSS-sponsored guarderías are free for IMSS-enrolled families but have strict enrollment criteria and limited availability near expat neighborhoods',
      'Visit guarderías in person and ask about earthquake evacuation protocols in Spanish — most operate in Spanish only, and their emergency procedures are important to understand before enrolling',
    ],
    'nannyItems': [
      'Full-time live-out nanny (nana or cuidadora) rates in Mexico City run $950–$1,400/month — legally mandated 13th-month aguinaldo bonus in December adds approximately one month\'s salary annually',
      'As an employer of a domestic worker, you are legally required to enroll your nanny in IMSS (social security) — the monthly employer contribution is roughly 10–15% of wages; consult a local HR advisor',
      'English-speaking nannies charge a 20–30% premium — find them through expat Facebook groups or domestic staffing agencies in Polanco and Santa Fe',
    ],
    'whereToFindItems': [
      'Search "Mexico City Expats & Families" and "CDMX Expat Moms" on Facebook — the largest English-language parent communities for nanny recommendations and childcare tips',
      'Private domestic staffing agencies near Polanco and Pedregal pre-screen candidates and assist with IMSS registration — ask explicitly for IMSS-registered candidates',
      'Parent WhatsApp groups at international schools are the most reliable word-of-mouth channel for trusted nanny referrals in Mexico City\'s expat community',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'BBVA Mexico and Santander Mexico are the most accessible banks for new residents — your employer\'s HR team can accelerate the account-opening process.',
    'items': [
      'BBVA Mexico and Santander Mexico offer expat-friendly procedures — bring your passport, FM2 or FM3 immigration card, RFC (Registro Federal de Contribuyentes — Mexico\'s tax ID), and proof of address (utility bill or lease with your name)',
      'HSBC Mexico is useful if your employer banks there — international wire transfers are faster between same-bank branches globally and English-language support is good',
      'Use Wise or Revolut as a bridge while waiting for your Mexico account — both hold USD and MXN and allow international transfers without a Mexican bank account',
      'Mexico uses SPEI (Sistema de Pagos Electrónicos Interbancarios — Mexico\'s real-time bank-to-bank transfer system) for all local payments; transfers between Mexican banks are instant and are the standard for rent, school fees, and utilities',
      'Cash (pesos) is widely used at markets, local restaurants, and taxis — keep MXN 500–1,000 (~$25–$50) on hand; some informal markets do not accept cards',
    ],
  },
  'residency': {
    'title': 'Immigration & Registration',
    'tip': 'Hire a local immigration lawyer — Mexico\'s residency paperwork involves multiple appointments and requirements that change frequently.',
    'items': [
      'Apply for Temporary Residency (Residencia Temporal) at the nearest Mexican consulate before arriving — valid for 1–4 years; renewal is done at an INM (Instituto Nacional de Migración — Mexico\'s immigration authority) office in Mexico City',
      'Convert your entry visa to a Tarjeta de Residencia (physical resident card) at the INM office within 30 days of arrival — bring passport, entry documents, and four passport photos',
      'Obtain your RFC (Registro Federal de Contribuyentes — Mexico\'s tax ID) at any SAT (Servicio de Administración Tributaria — Mexico\'s tax authority) office or at sat.gob.mx — required for banking, payroll, and formal contracts',
      'Enroll your children in school with your Tarjeta de Residencia and proof of address (comprobante de domicilio) — apostilled school transcripts may be required for admission to Mexican private schools',
      'Your Tarjeta de Residencia serves as your primary local ID for daily admin — carry a copy at all times and keep the original in a safe at home',
    ],
  },
  'faq': [
    {'question': 'Is Mexico City good for families?', 'answer': 'Yes — for families who do their neighborhood homework. Polanco, Roma, Condesa, and Santa Fe offer a safe, cosmopolitan lifestyle with excellent schools, food, and culture at a fraction of US costs. Air pollution and altitude require preparation.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in an expat colonia typically spends $5,500–$8,000/month all-in — covering rent (~$2,200), groceries, full-time domestic help, and school transport, but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Rental inventory in Polanco and Condesa is limited at the family-home level — start searching 6–8 weeks before your move. Roma and Santa Fe have more availability at a range of price points.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'Most expat children attend bilingual private schools — the top ASOMEX-affiliated schools offer IB or AP programmes and are excellent value versus US or UK equivalents. Apply 12+ months in advance.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — ABC Medical Center and Hospital Ángeles Pedregal have English-speaking staff and modern facilities. You need international private medical insurance (IPMI); confirm it covers Mexico City hospitals before arrival.'},
    {'question': 'Do you need a car in Mexico City?', 'answer': 'Not necessarily — CDMX has an extensive Metro, Metrobús, and Ecobici bike-share system. Most expat families in Polanco and Roma use Uber for longer trips and walk for daily errands. A car adds convenience but also traffic stress.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderate — Mexico\'s residency and tax registration processes require in-person appointments and can be slow. Hiring a local immigration lawyer ($500–$1,500 one-time) reduces stress dramatically and avoids common compliance errors.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how livable and safe the expat neighborhoods are — the city\'s reputation for danger does not reflect day-to-day family life in Polanco or Condesa. The altitude and air-quality days also require more adaptation than anticipated.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# PANAMA CITY, PA
# ═══════════════════════════════════════════════════════════════════
'panama-city-pa': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$5,500–$8,000 / month',
    'rentRange': '~$2,600 / month',
    'familyDinner': '~$50',
    'nannyRate': '~$10 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Finance, shipping, logistics, and maritime professionals — Panama City is the commercial hub of Central America and home to major shipping companies, multinationals, and the Panama Canal Authority',
      'Families seeking a dollarized economy with no currency conversion risk — banking, real estate, and daily transactions all use US dollars',
      'Parents looking for tropical lifestyle, year-round warm weather, and affordable domestic help while maintaining access to quality international schools',
      'Remote workers or entrepreneurs drawn to Panama\'s territorial tax system — foreign-sourced income is legally exempt from Panamanian income tax',
    ],
    'watchOutFor': [
      'Rainy season (May–November) brings heavy daily afternoon rain and some flooding — apartment selection should prioritize upper floors and verified drainage infrastructure',
      'Traffic congestion on the Corredor Norte, Via España, and Via Israel is severe in rush hours — choosing a home close to your school and workplace matters more than in most cities',
      'International school fees are high relative to overall living costs — $9,000–$22,000/year is standard; book 12+ months in advance as top schools fill fast',
      'Bureaucratic processes (residency, driving license transfer, school enrollment) require apostilled documents, Spanish translations, and multiple in-person appointments',
    ],
  },
  'healthcare': {
    'tip': 'Hospital Punta Pacífica (Johns Hopkins affiliated) and Hospital San Fernando are the top private hospitals for expats — confirm your IPMI covers both before registering.',
    'items': [
      'Panama City has a two-tier system — public MINSA (Ministerio de Salud — Panama\'s Ministry of Health) facilities serve citizens but are not used by expats; private hospitals offer modern care with English-speaking staff',
      'Hospital Punta Pacífica (affiliated with Johns Hopkins Medicine International) and Clínica Hospital San Fernando are the two top choices for expat families — both are in Marbella/San Francisco with pediatric departments and emergency care',
      'Typical private costs: GP consultation $60–$120, specialist $100–$200, ER $500–$1,500 — significantly cheaper than the US for comparable care quality',
      'International private medical insurance (IPMI) is recommended — Cigna Global and Bupa Global both have strong Panama network coverage; expect $2,500–$5,000/year for a family of four',
      'Dengue fever is present year-round and spikes May–November (rainy season) — use mosquito repellent daily on children, eliminate standing water around your home, and know the symptoms (sudden high fever, severe headache, rash)',
    ],
  },
  'safety': {
    'score': 72,
    'items': [
      'Violent crime is concentrated in specific neighborhoods (El Chorrillo, Curundu, parts of San Miguelito) — family areas like Clayton, Albrook, San Francisco, Marbella, and Punta Pacífica are safe for daily family life',
      'Phone and bag snatching by motorcyclists is the most common crime affecting expats — keep phones in pockets in public, use cross-body bags, and avoid displaying expensive jewelry outdoors',
      'Flash flooding during the May–November rainy season can temporarily close roads and ground-floor apartments — check drainage infrastructure before renting and keep important documents in a waterproof container',
      'Lightning frequency during the rainy season is high — keep children out of pools and off outdoor sports fields during afternoon storms, particularly 1–5 PM',
      'Panama City is generally safe in established expat neighborhoods — a large US government and Canal Zone presence means security standards are high in the corridors where most families live',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Panama City" or specific neighborhood names (Clayton, San Francisco, Marbella) inside each platform to filter local listings.',
      'Tip: start with a furnished short-term rental in your target neighborhood for the first 4–6 weeks — it is much easier to negotiate a long-term lease once you are on the ground.',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Panama City has bilingual daycare centers and a strong domestic staffing market — US-dollar pricing and formal labor compliance are expected by most providers.',
    'daycareItems': [
      'Private bilingual daycare centers in Clayton, San Francisco, and Marbella charge $700–$1,400/month for full-day infant and toddler care — centers associated with international schools often have sibling enrollment priority',
      'MEDUCA (Ministerio de Educación — Panama\'s Ministry of Education) operates subsidized public preschools, but instruction is entirely in Spanish and quality varies — most expat families use private bilingual centers',
      'Visit centers in person and verify IPHE (Instituto Panameño de Habilitación Especial — Panama\'s childcare regulatory body) licensing — ask specifically about emergency and flooding evacuation procedures',
    ],
    'nannyItems': [
      'Full-time live-out nannies (niñeras) in Panama City charge $850–$1,400/month — live-in domestic help typically costs $700–$1,100/month plus room and board plus legally mandated benefits',
      'Panama\'s labor code requires domestic workers to receive CSS (Caja de Seguro Social — Panama\'s social security system) enrollment and a 13th-month bonus (décimo tercer mes) — a local attorney or HR advisor sets up the paperwork correctly',
      'English-speaking nannies with expat family experience charge a 20–30% premium — find them through bilingual agency networks or expat community groups in Clayton and Albrook',
    ],
    'whereToFindItems': [
      'Search "Panama City Expats" and "Panama Family Network" on Facebook — the most active English-language expat communities for nanny referrals and childcare recommendations',
      'Bilingual domestic staffing agencies in Marbella and San Francisco pre-screen candidates and ensure CSS registration compliance — the most reliable route for new arrivals',
      'School parent WhatsApp groups at international schools are the primary word-of-mouth channel for trusted nanny and domestic worker referrals',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Panama uses the US dollar as its official currency — there is no currency conversion risk, which makes banking simpler than in most Latin American countries.',
    'items': [
      'Banco General and HSBC Panama are the two most commonly used banks by expats — both offer English-language service and accept expat residency documentation; bring passport, visa, proof of address, and income documentation',
      'Banks require proof of income (employer letter or bank statements showing regular deposits) and thorough compliance documentation — a local attorney can accelerate the process significantly',
      'Use Wise or Revolut as a bridge for international transfers until your Panama account is active — USD transfers are straightforward given the dollarized system',
      'All local transactions in Panama use US dollars — there is no currency exchange needed; international wire transfers from Panamanian banks are standard for expats with overseas accounts',
      'Cash is widely used at local markets, smaller restaurants, and informal vendors — keep $50–$100 on hand for day-to-day expenses; ATMs are widely available in family neighborhoods',
    ],
  },
  'residency': {
    'title': 'Residency & Registration',
    'tip': 'Panama has one of the most accessible legal residency programs in the world — apply early and use a local immigration lawyer.',
    'items': [
      'Panama\'s Friendly Nations Visa is available to citizens of 50+ countries (including the US, UK, EU, and Israel) and requires a job offer, business registration, or economic ties to Panama — apply through an immigration lawyer; expect 2–4 months processing',
      'The Temporary Resident Visa for employees requires apostilled birth certificates, a criminal background check, and a medical certificate — your employer\'s HR team typically manages this with an immigration attorney',
      'Obtain your Cédula de Extranjería (Panama\'s foreigner resident ID card) from the Tribunal Electoral once your residency is approved — required for banking, school enrollment, and most official transactions',
      'Register your children at MEDUCA (Panama\'s education ministry) with apostilled school records — international schools guide you through the local paperwork requirements during enrollment',
      'Your RUC (Registro Único de Contribuyentes — Panama\'s tax ID) is required for any formal employment or business activity — your employer registers this for you if you work for a registered Panama-based company',
    ],
  },
  'faq': [
    {'question': 'Is Panama City good for families?', 'answer': 'Yes — Panama City is genuinely family-friendly in the right neighborhoods (Clayton, Albrook, Marbella). The dollarized economy eliminates currency risk, the tax system is favorable for expats, and international schooling is available. Rainy season and traffic are the main daily challenges.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in a family neighborhood typically spends $5,500–$8,000/month all-in — covering rent (~$2,600), groceries, domestic help, and school transport but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Rental inventory in Clayton and Marbella is adequate but family-sized apartments in the best buildings fill fast. Start searching 6–8 weeks before your move.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'Most expat children attend private bilingual schools — the public system is in Spanish only and not well-suited for non-Spanish-speaking newcomer children. Apply 12+ months in advance for the best schools.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Hospital Punta Pacífica (Johns Hopkins affiliated) and Hospital San Fernando offer excellent English-language care at a fraction of US costs. International private medical insurance is essential.'},
    {'question': 'Do you need a car in Panama City?', 'answer': 'Yes in most neighborhoods — traffic is heavy and public transport is limited for family logistics. Most families use Uber for most trips and keep one car for school runs and weekend travel.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderately complex — Panama\'s Friendly Nations Visa is one of the most accessible expat routes globally, but residency paperwork requires apostilled documents, Spanish translations, and a local attorney. Budget 2–4 months and $1,500–$3,000 for legal fees.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how modern and well-infrastructure Panama City\'s expat neighborhoods are — the city is far more developed than its Central American neighbors. The intensity of the rainy season afternoon storms also surprises most newcomers.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# SANTIAGO, CL
# ═══════════════════════════════════════════════════════════════════
'santiago-cl': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$4,500–$7,000 / month',
    'rentRange': '~$1,800 / month',
    'familyDinner': '~$45',
    'nannyRate': '~$9 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Mining, energy, and finance executives — Santiago is the commercial hub of Chile and hosts regional headquarters for major Latin American multinationals',
      'Families who want Latin American big-city amenities with significantly lower crime and better infrastructure than most other regional capitals',
      'Outdoor-loving families — the Andes are 40 minutes away for skiing (Valle Nevado, Portillo) and the coast (Viña del Mar) is 1.5 hours west',
      'Spanish-immersion families who want full cultural integration with access to a well-established and growing expat community',
    ],
    'watchOutFor': [
      'Santiago\'s winter air quality (June–August) is genuinely bad during smog alerts — families with asthma should have an air purifier budget and outdoor activity contingency plans',
      'Chile is expensive by South American standards — costs are closer to Southern European levels than neighboring LatAm countries; schooling and housing in expat neighborhoods are particularly high',
      'The Chilean peso (CLP) fluctuates significantly against the dollar — rent and school fees quoted in CLP can vary by 10–15% in USD terms over a year',
      'Earthquake risk is real and regular — buildings are constructed to high seismic standards, but families should drill evacuation plans and keep emergency supplies stocked',
    ],
  },
  'healthcare': {
    'tip': 'Clínica Alemana is the first choice for most expat families — confirm your Isapre plan covers it before registering.',
    'items': [
      'Chile has a two-tier system — Fonasa (public, requires formal employment and residency) and Isapre (private mandatory health insurance for salaried workers); most expat families use private Isapres',
      'Clínica Alemana de Santiago and Clínica Las Condes are the two top private hospitals for expat families — both have pediatric departments, English-speaking staff, and internationally accredited facilities in the Vitacura/Las Condes corridor',
      'Typical private costs: GP consultation CLP 50,000–80,000 (~$55–$90), specialist CLP 80,000–150,000 (~$90–$170), ER CLP 300,000–800,000 (~$330–$880)',
      'Expats employed in Chile pay into Isapre automatically as a 7% payroll deduction — choose your Isapre plan within 30 days of starting work; Banmédica and Cruz Blanca are popular options',
      'Santiago\'s air quality is poor June–August due to temperature inversions — keep a HEPA air purifier running and monitor the MMA air-quality index; limit outdoor play for children when the index exceeds 100',
    ],
  },
  'safety': {
    'score': 74,
    'items': [
      'Violent crime in Santiago is low by Latin American standards — family neighborhoods in Las Condes, Vitacura, Lo Barnechea, and Providencia are statistically safe for daily family life',
      'Petty theft (phone snatching, pickpocketing) is the most common crime affecting expats — be alert on the Metro, avoid displaying expensive phones in public, and hold bags close in crowded areas',
      'Chile has significant seismic activity — earthquakes above 5.0 occur several times per year; check your building\'s seismic certification, bolt tall furniture to walls, and practice family evacuation plans',
      'Social protests (marchas) occur periodically near Plaza Italia and central Santiago — they are generally peaceful but can disrupt traffic; monitor local news on school days and have alternative pickup routes planned',
      'Smog during winter temperature inversions (June–August) reaches hazardous levels — limit outdoor sports and play on red-alert days and keep HEPA air purifiers in children\'s bedrooms',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Santiago" or specific commune names (Las Condes, Vitacura, Providencia) inside each platform to filter local listings.',
      'Tip: start with a furnished short-term rental in your target commune — long-term landlords prefer tenants who can view properties in person and sign quickly.',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Santiago has a well-developed private childcare market in Las Condes and Vitacura — bilingual options are available but at a significant premium.',
    'daycareItems': [
      'Private jardines infantiles (nurseries) in Las Condes, Vitacura, and Providencia charge CLP 450,000–900,000/month (~$500–$1,000) for full-day infant care — bilingual (Spanish-English) centers charge 20–30% more',
      'Junji (Junta Nacional de Jardines Infantiles — Chile\'s national early-education body) operates subsidized public nurseries free for income-eligible families — instruction is entirely in Spanish; waitlists in expat areas are long',
      'Visit 3–4 centers before enrolling and ask specifically about air-quality protocols on smog-alert days — good centers should have procedures for keeping children indoors on high-pollution winter days',
    ],
    'nannyItems': [
      'Full-time live-out nanny (nana) rates in Santiago run CLP 650,000–1,100,000/month (~$700–$1,200) — English-speaking nannies in Vitacura and Las Condes command CLP 1,200,000/month ($1,300+) or more',
      'Chilean labor law requires written contracts, 15 days annual leave, and AFP (Administradora de Fondos de Pensiones — pension fund) enrollment for all domestic workers — a labor attorney or HR platform like Buk helps set this up',
      'English-speaking nannies charge a 25–40% premium — find them through Santiago expat community networks or bilingual domestic staffing agencies in Providencia and Las Condes',
    ],
    'whereToFindItems': [
      'Search "Santiago Expats Network" and "Mamas Expats Santiago" on Facebook — active communities where families post nanny referrals and childcare recommendations',
      'Yapo.cl (Chile\'s major classifieds portal) has a domestic services section — filter for Las Condes and Vitacura to find candidates in expat neighborhoods',
      'Parent WhatsApp groups at international schools are the most reliable source of word-of-mouth nanny recommendations in Santiago\'s expat community',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Open your Chilean bank account as soon as your RUT is issued — everything from rent to school fees is paid by bank transfer in Chile.',
    'items': [
      'Banco de Chile and BancoEstado are the two most accessible banks for new residents — bring your RUT (Rol Único Tributario — Chile\'s national tax and identity number), carnet de extranjería (resident ID), proof of address, and income documentation',
      'New residents cannot open a bank account without a valid RUT and carnet de extranjería — plan for a 4–8 week gap between arrival and account opening; use Wise or Revolut during this period',
      'Wise and Revolut both support CLP and are the best tools for international transfers and managing USD/CLP currency exchange during your first months in Santiago',
      'Most rent and school fees are paid via Transferencia Electrónica (bank transfer) — once your account is active, transfers are instant between Chilean banks using the RUT number as the recipient identifier',
      'Cash (Chilean pesos) is used at local markets, smaller restaurants, and some parking lots — keep CLP 20,000–50,000 (~$20–$55) on hand; larger transactions are always by card or bank transfer',
    ],
  },
  'residency': {
    'title': 'Residency & Registration',
    'tip': 'Apply for your carnet de extranjería as soon as possible — it unlocks banking, healthcare enrollment, school registration, and rental contracts.',
    'items': [
      'Apply for Temporary Residency (Residencia Temporal) at PDI (Policía de Investigaciones de Chile — Chile\'s civil investigative police, which handles immigration) or online at extranjeria.gob.cl within 90 days of arrival',
      'Obtain your RUT (Rol Único Tributario — Chile\'s national tax and identity number) at the SII (Servicio de Impuestos Internos — Chile\'s tax authority) — needed for banking, contracts, utilities, and payroll; your employer can often assist with registration',
      'Your carnet de extranjería (resident ID card) is issued by PDI and takes 1–3 months — in the interim, use your passport plus your temporary residency receipt as ID',
      'Enroll your children in school with your carnet de extranjería, apostilled birth certificates, and prior school transcripts — international schools guide you through the paperwork requirements',
      'Apply for your Isapre (private health plan) within 30 days of starting work in Chile — visit any major Isapre office (Banmédica, Cruz Blanca) with your RUT and employment contract',
    ],
  },
  'faq': [
    {'question': 'Is Santiago good for families?', 'answer': 'Yes — Santiago is one of South America\'s most livable capitals for expat families. Safe neighborhoods in Las Condes and Vitacura, excellent private schools, and proximity to the Andes make it appealing. The trade-offs are winter smog and Chile\'s high cost of living by South American standards.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in an expat neighborhood typically spends $4,500–$7,000/month all-in — covering rent (~$1,800), groceries, domestic help, and transport, but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Rental inventory in Las Condes and Vitacura is reasonable but family apartments go quickly in peak season (January–March). Start searching 6–8 weeks before your move.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'Most expat children attend bilingual private schools — Chilean public schools are in Spanish only. Waitlists at top international schools are long; apply 12–18 months in advance.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Clínica Alemana and Clínica Las Condes are internationally accredited with English-speaking staff. Isapre (private health insurance) is mandatory for salaried workers; your employer registers you within 30 days.'},
    {'question': 'Do you need a car in Santiago?', 'answer': 'It depends on where you live — the Metro covers Providencia and Las Condes well. Families in Vitacura and Lo Barnechea generally need a car for school runs and weekend Andes trips.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderate — getting your RUT and carnet de extranjería takes 2–4 months, and without them banking and school enrollment are delayed. Hire a relocation agent or immigration lawyer for the first 90 days.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most newcomers are surprised by how expensive Chile is relative to other South American countries — Santiago\'s costs can approach Southern European levels. The winter smog (June–August) is also worse than most outsiders expect.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# MONTEVIDEO, UY
# ═══════════════════════════════════════════════════════════════════
'montevideo-uy': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$3,500–$5,500 / month',
    'rentRange': '~$1,500 / month',
    'familyDinner': '~$40',
    'nannyRate': '~$8 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Families seeking a safe, stable, and relatively affordable Latin American base with a mature and welcoming expat community',
      'Remote workers and digital nomads attracted to Uruguay\'s reliable internet infrastructure, stable institutions, and favorable tax treatment for foreign-sourced income',
      'Parents who value good public healthcare, low crime, and a relaxed coastal lifestyle — Punta del Este is 1.5 hours away',
      'Families considering Uruguayan permanent residency as a pathway to long-term Southern Cone stability',
    ],
    'watchOutFor': [
      'Montevideo is more expensive than many people expect — food, imported goods, and school fees are significantly higher than Argentina or Colombia due to Uruguay\'s high import duties',
      'International school options are limited compared to Buenos Aires or Santiago — apply 12–18 months in advance for the best bilingual schools',
      'The city can feel slow-paced and somewhat provincial compared to Buenos Aires or Santiago — social life and cultural events are less active, particularly in the off-season',
      'Spanish is essential for daily life — English is not widely spoken outside of the business and expat communities; language preparation before arriving helps significantly',
    ],
  },
  'healthcare': {
    'tip': 'British Hospital (Hospital Británico) is the standard choice for English-speaking expat families — confirm your IPMI or mutualista plan covers it before registering.',
    'items': [
      'Uruguay has a universal healthcare system — employees and their families access care through FONASA/IAMC mutualistas (member-owned healthcare cooperatives); the main ones used by expats are British Hospital, Médica Uruguaya, and CASMU',
      'British Hospital (Hospital Británico) is Montevideo\'s top facility for English-speaking families — pediatric departments, specialist services, and internationally accredited standards; located in Pocitos',
      'Monthly mutualista membership costs approximately UYU 2,500–4,500/month per person (~$60–$110) — significantly cheaper than private insurance in comparable countries and covers most routine care',
      'For complex specialist care not covered by mutualistas, international private medical insurance (IPMI) is recommended as a supplement — Cigna Global is widely used among Montevideo expats',
      'Uruguayan healthcare is generally high quality but has limited English-language services outside British Hospital — learn basic medical Spanish for routine appointments at other facilities',
    ],
  },
  'safety': {
    'score': 82,
    'items': [
      'Montevideo is one of the safest capitals in Latin America — violent crime rates are significantly lower than Buenos Aires, Santiago, or São Paulo; most expat families feel very comfortable in Pocitos, Carrasco, and Punta Carretas',
      'Petty theft (phone snatching, pickpocketing) is the most common security issue — be alert in Ciudad Vieja (the old city) and near bus terminals; keep phones in pockets and bags held close in crowded areas',
      'Bicycle theft along the rambla (Montevideo\'s iconic waterfront promenade) is occasional — use quality locks and avoid leaving bikes unattended for extended periods',
      'Montevideo has very little heavy traffic outside rush hour — traffic accidents are rare by regional standards; pedestrian crossings are generally respected, making it a walkable family city',
      'Mild weather and low natural disaster risk make Montevideo one of the safest family cities on environmental factors — occasional flooding in low-lying streets during heavy rain is the main weather concern',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Montevideo" or specific barrio names (Pocitos, Carrasco, Punta Carretas) inside each platform to filter local listings.',
      'Tip: start with a furnished rental in Pocitos or Punta Carretas for the first 4–6 weeks — it is much easier to find a long-term lease once you are on the ground.',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Montevideo has a manageable childcare market — private bilingual jardines cover expat needs, and the domestic worker labor framework is straightforward.',
    'daycareItems': [
      'Licensed private jardines de infantes (nurseries) in Pocitos, Carrasco, and Punta Carretas charge UYU 22,000–45,000/month (~$550–$1,100) for full-day infant and toddler care',
      'CAIF (Centros de Atención a la Infancia y la Familia — Uruguay\'s state-subsidized early childhood centers) are free for eligible families — instruction is in Spanish; apply through INAU (Instituto del Niño y Adolescente del Uruguay)',
      'Visit 3–4 centers in person before enrolling — ask whether the center has a bilingual or English enrichment program, as availability varies significantly across Montevideo neighborhoods',
    ],
    'nannyItems': [
      'Full-time live-out nanny rates in Montevideo run UYU 30,000–50,000/month (~$750–$1,250) — live-in domestic workers charge somewhat less but accommodation costs are additional',
      'Uruguay\'s Ley de Trabajo Doméstico (domestic work law) requires written contracts, BPS (Banco de Previsión Social — Uruguay\'s social security institute) enrollment, and an 8-hour work day — a local labor attorney sets this up correctly',
      'English-speaking nannies charge a premium and are found through expat community networks or through English-language schools that maintain referral lists',
    ],
    'whereToFindItems': [
      'Search "Expats in Montevideo" and "Montevideo Mums" on Facebook — active English-language communities for nanny referrals and childcare tips',
      'Gallito.com.uy (Uruguay\'s main classifieds site) has a domestic services section — filter by Pocitos and Carrasco for candidates in expat neighborhoods',
      'Word-of-mouth through parent networks at bilingual schools is the most reliable channel for trusted nanny recommendations in Montevideo',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Uruguay\'s banking system is stable and offers accounts in both USD and UYU — accounts in USD are available and widely used by expats.',
    'items': [
      'Banco ITAÚ Uruguay and BBVA Uruguay are the most commonly used banks by expats — both offer USD accounts and accept resident documentation; bring your cédula de identidad (resident ID), proof of address, and income documentation',
      'Opening a bank account requires your cédula de residencia (temporary or permanent resident ID card) — plan for 4–8 weeks between arrival and account opening; use Wise or Revolut during the gap',
      'Wise supports UYU and is the standard tool for international transfers — USD received from abroad lands without the reporting requirements common in some other LatAm banking systems',
      'Most expats keep USD accounts for savings and UYU accounts for day-to-day expenses — Uruguayan banks offer both; USD account interest rates have been reasonable in recent years',
      'Cash (pesos) is commonly used at local markets and smaller restaurants — keep UYU 1,000–3,000 (~$25–$75) on hand; most restaurants and retail accept card payments',
    ],
  },
  'residency': {
    'title': 'Residency & Registration',
    'tip': 'Apply for permanent residency immediately upon arrival — Uruguay has one of the most accessible permanent residency programs in South America.',
    'items': [
      'Apply for Residencia Permanente (Uruguay Permanent Residency) through DNIC (Dirección Nacional de Identificación Civil — Uruguay\'s national civil registry) — bring apostilled birth certificates, criminal record certificate, and proof of income; processing takes 3–9 months',
      'While waiting, your cédula de identidad (temporary resident ID) serves as your main local ID — apply for this immediately when starting the residency process',
      'Obtain your RUT (Registro Único Tributario — Uruguay\'s tax ID number) from DGI (Dirección General Impositiva — Uruguay\'s tax authority) — required for employment contracts, bank accounts, and utilities',
      'Register your children at ANEP (Administración Nacional de Educación Pública — Uruguay\'s national education authority) or directly at the private school — apostilled birth certificates and prior school records are required',
      'BPS (Banco de Previsión Social — Uruguay\'s social security institute) enrollment is mandatory for all employees — your employer handles this for registered companies; it covers pension, healthcare, and parental leave contributions',
    ],
  },
  'faq': [
    {'question': 'Is Montevideo good for families?', 'answer': 'Yes — Montevideo is one of Latin America\'s safest and most livable capitals for families. Low crime, good healthcare, and a relaxed atmosphere are the main draws. The trade-off is higher costs than most South American cities and a limited international school selection.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in Pocitos or Carrasco typically spends $3,500–$5,500/month all-in — one of the most affordable budgets in the region for a high quality of life.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Rental inventory in Pocitos and Punta Carretas is reasonable — start searching 6 weeks before your move. Demand from digital nomads has increased but hasn\'t yet caused the shortages seen in Lisbon or Barcelona.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'Most expat children attend private bilingual schools — the public system is entirely in Spanish. Apply 12–18 months in advance for the best bilingual options; the waitlists are real.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — joining British Hospital or Médica Uruguaya as a mutualista member gives comprehensive coverage at a very reasonable monthly cost. The system is genuinely good for routine and preventive care.'},
    {'question': 'Do you need a car in Montevideo?', 'answer': 'Not necessarily — Montevideo\'s bus network covers most neighborhoods, and the city is compact and walkable in Pocitos and Punta Carretas. A car becomes useful for beach trips and Punta del Este weekends.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Uruguay is one of the easier LatAm countries for expat residency — permanent residency is accessible and processing is straightforward. The main gap is the 4–6 months between arrival and receiving your cédula de residencia.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by the cost of food and imported goods — Uruguay\'s import duties make supermarket staples noticeably more expensive than neighboring Argentina. The quality of the healthcare system also exceeds most newcomers\' expectations.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# BOGOTÁ, CO
# ═══════════════════════════════════════════════════════════════════
'bogota-co': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$3,000–$4,500 / month',
    'rentRange': '~$1,200 / month',
    'familyDinner': '~$30',
    'nannyRate': '~$5 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Executives at multinational companies with Colombian operations — Bogotá hosts offices for hundreds of Fortune 500 firms across oil, finance, and tech sectors',
      'Families on a budget who want a full big-city lifestyle (arts, culture, dining, international schools) at prices 40–60% lower than Santiago, Panama City, or Mexico City',
      'Parents who value Bogotá\'s strong bilingual school scene — 30+ international and bilingual schools charge $8,000–$20,000/year, far below US or UK equivalents',
      'Remote workers attracted to Colombia\'s digital nomad visa, mild spring-like year-round climate (18–20°C), and growing tech startup ecosystem',
    ],
    'watchOutFor': [
      'Safety requires consistent street-smart habits — phone snatching and bag theft are common in public spaces; neighborhoods require careful research before choosing where to live',
      'Bogotá\'s altitude (2,640 m — the third highest capital in the world) affects energy levels, sleep, and exercise capacity for 1–4 weeks after arrival',
      'Traffic and transport are significant daily challenges — the lack of a metro means all family logistics depend on rideshares or cars; Bogotá\'s traffic is among the worst in South America',
      'Bureaucracy for residency, school enrollment, and banking is slow and requires Spanish-only in-person appointments — hiring a local relocation assistant is strongly recommended',
    ],
  },
  'healthcare': {
    'tip': 'Fundación Santa Fe de Bogotá in Usaquén is the standard choice for expat families — confirm your EPS or IPMI covers it before registering.',
    'items': [
      'Colombia has a mandatory national health system (EPS — Entidades Promotoras de Salud) — employees contribute 12.5% of salary (shared between employer and employee) and gain access to comprehensive healthcare benefits',
      'For families seeking English-language care and shorter wait times, Fundación Santa Fe de Bogotá and Clínica del Country are the two top private hospitals in the Usaquén/Chapinero Norte area — both have pediatric departments and internationally trained staff',
      'Typical private costs: GP consultation COP 80,000–160,000 (~$20–$40), specialist COP 150,000–350,000 (~$37–$88), ER COP 500,000–1,500,000 (~$125–$375)',
      'Expats employed in Colombia must enroll in EPS — most multinationals use Colsanitas or Sanitas, which have English-language support and private clinics near Chapinero Norte and Usaquén',
      'Bogotá\'s altitude (2,640 m) is the highest capital in South America after Quito — expect a 1–2 week adjustment period (headaches, fatigue, shortness of breath); reduce children\'s physical activity for the first week; stay very well-hydrated',
    ],
  },
  'safety': {
    'score': 71,
    'items': [
      'Bogotá\'s family neighborhoods (Usaquén, Chicó, La Cabrera, Rosales, El Nogal) are safe for daily life — violent crime is concentrated in outer southern and peripheral areas well outside expat zones',
      'Phone snatching and express robbery near TransMilenio (Bogotá\'s bus rapid transit system) stops are the most common crimes affecting expats — use Uber or InDriver for all trips and keep phones pocketed in public',
      'Bogotá\'s traffic on Carrera 7, Calle 100, and the Circunvalar is severe — school pickup times require precise scheduling; pico y placa (a traffic restriction banning specific plates on specific weekdays) affects driving',
      'Air quality is moderate but spikes in February–March before the rains — monitor the SISAIRE air-quality dashboard and limit outdoor play for children on high-pollution days',
      'Most expat apartment complexes in north Bogotá have private security (vigilancia) and gated entrances — this is standard, not exceptional, and provides a reasonable layer of daily security',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Bogotá" or specific barrio names (Usaquén, Chicó, Rosales) inside each platform to filter local listings.',
      'Tip: rent a furnished short-term apartment in Usaquén or Chicó for 4–6 weeks — long-term landlords strongly prefer tenants who can view properties in person and sign quickly.',
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Bogotá has a well-developed bilingual childcare market in north Bogotá — ICBF-subsidized centers exist but expat families typically use private bilingual jardines.',
    'daycareItems': [
      'Licensed jardines infantiles (nurseries) in Usaquén, Chicó, and Chapinero Norte charge COP 1,500,000–3,000,000/month (~$375–$750) for full-day infant care — bilingual centers charge 20–30% more',
      'ICBF (Instituto Colombiano de Bienestar Familiar — Colombia\'s family welfare institute) operates subsidized hogares comunitarios (community daycare) for income-eligible Colombian families — instruction is in Spanish only',
      'Visit 3–4 centers before enrolling and ask about earthquake and emergency protocols — Colombian nurseries are required to have evacuation plans, but implementation quality varies',
    ],
    'nannyItems': [
      'Full-time live-out nanny rates in Bogotá run COP 1,200,000–2,000,000/month (~$300–$500) — English-speaking nannies in expat neighborhoods charge COP 2,000,000–3,000,000/month ($500–$750)',
      'Colombian labor law requires domestic workers to receive formal contracts, SGSSS (social security) enrollment, a cesantías (severance fund), and annual leave — use a labor attorney or HR platform to set this up correctly',
      'Most expat families find reliable nannies through school parent networks at international schools — word of mouth is the most trusted channel in Bogotá\'s expat community',
    ],
    'whereToFindItems': [
      'Search "Bogotá Expats" and "Colombia Families Network" on Facebook — the most active English-language communities for nanny referrals and childcare advice',
      'Computrabajo.com (Colombia\'s major job platform) has a domestic services section — filter by Usaquén and Chicó for candidates near expat neighborhoods',
      'Parent WhatsApp groups at Bogotá\'s international schools are the primary referral network for trusted domestic workers',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Open a Bancolombia or Davivienda account as soon as your cédula de extranjería is issued — the account unlocks payroll, school fee payments, and rent transfers.',
    'items': [
      'Bancolombia and Davivienda are the two most commonly used banks by expat families — both have English-language helplines and accept cédula de extranjería and income documentation; bring your NIT (tax ID), cédula, and a utility bill',
      'You need a cédula de extranjería (Colombia\'s foreigner resident ID — issued by Migración Colombia after visa approval) before most banks will open an account — plan for a 6–10 week gap from arrival to account activation; use Wise during this period',
      'Wise and Revolut support COP (Colombian peso) and are the standard tools for international transfers — significantly cheaper than Bancolombia\'s international wire service',
      'Nequi (Bancolombia\'s mobile wallet) and Daviplata (Davivienda\'s equivalent) are Colombia\'s most widely used digital payment apps — essential for day-to-day transactions including paying domestic staff and utilities',
      'Cash (pesos) is used at local markets, smaller restaurants, and informal vendors — keep COP 100,000–200,000 (~$25–$50) on hand; ATMs (cajeros automáticos) are widely available in expat neighborhoods',
    ],
  },
  'residency': {
    'title': 'Immigration & Registration',
    'tip': 'Apply for your cédula de extranjería immediately after your visa is stamped — it is required for banking, school enrollment, and virtually all official transactions.',
    'items': [
      'Apply for your cédula de extranjería at a Migración Colombia office within 15 days of visa approval — bring passport, visa, and a passport photo; this ID card is required for banking, contracts, and healthcare enrollment',
      'Register your address on the Migración Colombia portal (migracioncolombia.gov.co) within 3 days of arrival — failure to report your address is a common compliance error that results in fines',
      'Obtain your NIT (Número de Identificación Tributaria — Colombia\'s tax number for foreigners) at any DIAN (Dirección de Impuestos y Aduanas Nacionales — Colombia\'s tax authority) office — required for payroll, banking, and formal contracts',
      'Enroll your children in school with your cédula de extranjería, apostilled birth certificates, and prior school transcripts — most international schools require apostilled records from your home country',
      'Your employer must enroll you in EPS (Entidad Promotora de Salud — Colombia\'s mandatory health insurance system) within 30 days of your start date — this covers healthcare costs for you and your enrolled dependants',
    ],
  },
  'faq': [
    {'question': 'Is Bogotá good for families?', 'answer': 'Yes, if you choose the right neighborhood and maintain street-smart habits. North Bogotá (Usaquén, Chicó, Rosales) is safe, cosmopolitan, and has excellent bilingual schools at a fraction of US costs. The altitude, traffic, and bureaucracy require active adjustment.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in north Bogotá typically spends $3,000–$4,500/month all-in — one of the best value-to-quality ratios of any major Latin American city.'},
    {'question': 'Is housing hard to find here?', 'answer': 'No — Bogotá has ample rental inventory in north Bogotá. Quality apartments in Usaquén and Chicó are available with 4–6 weeks of searching.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'Most expat children attend private bilingual schools — Colombian public schools are in Spanish only and not suited to non-Spanish-speaking newcomers. Bogotá has 30+ bilingual schools at very competitive prices; apply 6–12 months in advance.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — EPS enrollment (mandatory for employees) provides good coverage, and top private hospitals like Fundación Santa Fe offer excellent care. Your employer handles EPS registration within 30 days of your start date.'},
    {'question': 'Do you need a car in Bogotá?', 'answer': 'Yes in most neighborhoods — Bogotá lacks a metro and rideshares (Uber, InDriver) fill the gap for most daily travel. Many families use rideshares exclusively and skip car ownership entirely given the severe traffic.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderately challenging — getting your cédula de extranjería and NIT takes 6–10 weeks and requires multiple in-person appointments. Hiring a local relocation assistant ($300–$600 one-time) is one of the best investments you can make in your first month.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by the altitude — Bogotá at 2,640 m is genuinely physically demanding for the first 1–2 weeks. The spring-like year-round climate (18–20°C) is the pleasant opposite surprise.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# HO CHI MINH CITY, VN
# ═══════════════════════════════════════════════════════════════════
'ho-chi-minh-city-vn': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$3,500–$5,500 / month',
    'rentRange': '~$1,600 / month',
    'familyDinner': '~$30',
    'nannyRate': '~$5 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Executives at multinationals with Vietnam operations — HCMC hosts regional headquarters for hundreds of consumer goods, tech, and manufacturing companies',
      'Families who want a full Southeast Asian expat experience with excellent international schooling, affordable domestic help, and easy regional travel from Tan Son Nhat Airport',
      'Budget-conscious families who want a high quality of life — a family with one full-time helper, private school, and regular dining out can live comfortably on $5,000/month',
      'Remote workers and entrepreneurs attracted by Vietnam\'s growing tech startup scene and well-developed expat infrastructure in Districts 2 and 7',
    ],
    'watchOutFor': [
      'International school costs are high for Southeast Asia — top IB and British curriculum schools cost $18,000–$30,000/year; apply 12–18 months in advance as places are limited',
      'Traffic and motorbike culture require constant vigilance — children need to be taught road safety explicitly, and the volume of motorbikes is disorienting for newcomers',
      'Dengue fever and food safety require ongoing daily attention — use repellent, wash produce in filtered water, and be careful with street food for young children',
      'Bureaucratic processes (visa, TRC, work permit) require multiple in-person appointments and change frequently — use a local relocation agent to navigate the paperwork',
    ],
  },
  'healthcare': {
    'tip': 'FV Hospital in District 7 is the top choice for English-speaking expat families — confirm your IPMI policy covers FV before registering.',
    'items': [
      'Vietnam\'s public healthcare system is not accessible to most expats — all foreign families use private hospitals; public hospitals are understaffed and have very limited English-language capability',
      'FV Hospital (Franco-Vietnamese Hospital) in District 7 is the top choice for expat families — modern equipment, English-speaking staff, dedicated pediatric ward; City International Hospital (CIH) in Binh Tan is a strong second',
      'Typical private costs at FV Hospital: GP consultation $60–$100, specialist $80–$180, ER visit $500–$2,000 — reasonable by international standards for the quality of care',
      'International private medical insurance (IPMI) is essential — Cigna Global and AXA are widely used; expect $3,500–$7,000/year for a family of four; ensure your policy covers evacuation to Singapore for complex cases',
      'Dengue fever is present year-round and spikes June–October — use mosquito repellent on children daily, eliminate standing water in and around your home, and know the symptoms (sudden high fever, severe headache, rash)',
    ],
  },
  'safety': {
    'score': 70,
    'items': [
      'Ho Chi Minh City is generally safe by Southeast Asian standards for daily family life in expat districts (Districts 2/Thu Duc, 7, and Binh Thanh) — violent crime targeting expats is rare; the main safety concern is motorbike traffic, not personal violence',
      'Motorbike bag and phone snatching by passing scooters is the most common crime targeting expats — keep bags zipped and held close to the body, particularly in markets and on sidewalks; phone thieves target anyone using a device outdoors',
      'Traffic is the greatest daily safety hazard — Ho Chi Minh City has millions of motorbikes and limited traffic enforcement; children must be taught pedestrian road-crossing rules before walking independently',
      'Seasonal flooding June–November can make roads impassable in low-lying districts — check your rental\'s flood history before signing, and keep raincoats and waterproof bags ready for children\'s school runs',
      'Air quality in Ho Chi Minh City is affected by traffic and industrial pollution — monitor the Air Visual app; keep HEPA air purifiers in children\'s bedrooms, particularly November–February during the dry season',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Ho Chi Minh City" or specific districts (District 2, District 7, Binh Thanh) inside each platform to filter local listings.',
      'Tip: start with a serviced apartment in District 2 or District 7 for the first 3–4 weeks — long-term landlords prefer tenants who can view properties in person and sign a lease quickly.',
    ],
  },
  'schools': {
    'options': [
      {
        'type': 'IB and British curriculum international schools',
        'description': 'Multiple accredited international schools operate in Districts 2 and 7, offering IB Primary Years Programme, IGCSE, and A-Level pathways. District 2 (Thu Duc) has the highest concentration of expat-focused campuses. Apply 12–18 months in advance as places are strictly limited.',
        'fees': '$14,900–$32,900/year typical'
      },
      {
        'type': 'American curriculum international schools',
        'description': 'Several American-curriculum schools operate in HCMC with Advanced Placement programmes for older students. Good option for families planning eventual return to the US system.',
        'fees': '$12,000–$22,000/year typical'
      },
      {
        'type': 'Vietnamese public schools',
        'description': 'Free but instruction is entirely in Vietnamese. Not suitable for non-Vietnamese-speaking expat children.',
        'fees': 'Free'
      }
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Ho Chi Minh City has a well-developed domestic help and daycare market in Districts 2 and 7 — full-time live-in helpers are common and affordable.',
    'daycareItems': [
      'Private English-medium nurseries (nhà trẻ) in Districts 2, 7, and Binh Thanh charge $550–$1,200/month for full-day infant care — nurseries affiliated with international schools have better English programs and higher fees',
      'Vietnamese public kindergartens are free but instruction is entirely in Vietnamese — not suitable for children who do not speak Vietnamese, as teachers typically have no English capability',
      'Visit nurseries in person and ask the director to demonstrate a typical daily lesson — English-language quality varies significantly even among premium-priced private centers',
    ],
    'nannyItems': [
      'Full-time live-in helper (giúp việc) rates in HCMC run $300–$600/month including accommodation — live-out helpers working full-time charge $400–$700/month; rates in Districts 2 and 7 are higher due to expat demand',
      'Vietnamese labor law provides for a 13th-month bonus and social insurance (BHXH) contributions for full-time domestic workers — a local HR consultant helps set up payroll correctly',
      'Start your helper search 6–8 weeks before arrival — the best-referred helpers are placed quickly; demand from expat families significantly outpaces supply for English-speaking domestic staff',
    ],
    'whereToFindItems': [
      'Search "Saigon Expat Parents" and "HCMC Family Network" on Facebook — the most active English-language communities for domestic worker referrals and childcare recommendations',
      'Expat staffing agencies in Districts 2 and 7 (search "helper agency Ho Chi Minh City" on Google) pre-screen candidates and can provide nannies with basic English and childcare experience',
      'Parent WhatsApp groups at international schools in Districts 2 and 7 are the primary word-of-mouth channel for trusted domestic worker recommendations',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'HSBC Vietnam offers the best English-language service for expats — bring your work permit and TRC to accelerate the account opening process.',
    'items': [
      'HSBC Vietnam and VPBank are the two most commonly used banks by expat families — HSBC offers English-language service and international transfer capabilities; VPBank has the widest ATM network in HCMC',
      'Documents required: passport, valid Vietnam work permit, TRC (Thẻ Tạm Trú — Temporary Resident Card, issued by immigration police after your address is registered), and proof of employment (employer letter)',
      'Use Wise or Revolut for international transfers — Vietnam\'s SWIFT transfers can be slow and expensive; Wise supports VND and is significantly cheaper',
      'MoMo (Vietnam\'s largest e-wallet) is used for day-to-day payments — download it immediately after arrival for delivery apps, taxis (Grab), utilities, and many restaurants and shops; link it to your Vietnamese bank account',
      'Cash (Vietnamese dong, VND) is widely used for markets, street food, and smaller restaurants — keep VND 500,000–1,000,000 (~$20–$40) on hand at all times',
    ],
  },
  'residency': {
    'title': 'Immigration & Registration',
    'tip': 'Register your address within 24 hours of moving — your landlord must file the TM30 form (address registration) with local police; non-compliance results in fines for both parties.',
    'items': [
      'Your landlord must file the TM30 form (address registration form) with local police (công an phường — ward-level police station) within 24 hours of your arrival at any new address — without this, you cannot receive your TRC',
      'Apply for your TRC (Thẻ Tạm Trú — Temporary Resident Card) at the Ho Chi Minh City Immigration Department within 30 days of arrival — bring passport, visa, TM30 registration receipt, work permit, and passport photos; TRC is required for banking and school enrollment',
      'Obtain your work permit (giấy phép lao động) through your employer before starting work — your employer\'s HR team manages this process, which requires apostilled documents from your home country; working without a valid permit is a deportable offense',
      'Enroll your children in school with your TRC, passport, apostilled birth certificates, and prior transcripts — international schools in Districts 2 and 7 assist with the local paperwork requirements',
      'Report your address to immigration every 90 days by visiting the immigration office or using the online reporting system at xuatnhapcanh.gov.vn — your TRC includes a specific renewal date',
    ],
  },
  'faq': [
    {'question': 'Is Ho Chi Minh City good for families?', 'answer': 'Yes — HCMC offers a high quality of life at a very competitive price point, with excellent international schools, affordable domestic help, and easy access to Southeast Asian travel. The learning curve involves traffic, food safety habits, and dengue prevention.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in District 2 or 7 typically spends $3,500–$5,500/month all-in — including rent (~$1,600), groceries, a full-time helper, and transport, but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'No — rental inventory in Districts 2 and 7 is ample. Good serviced apartments are available within 2–3 weeks of searching; for long-term leases, having your TRC ready accelerates landlord negotiations.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'International school is essential for non-Vietnamese-speaking children — Vietnamese public schools are entirely in Vietnamese. Apply 12–18 months in advance for IB and British curriculum schools; places are genuinely limited.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes, through private hospitals — FV Hospital in District 7 is excellent. You need international private medical insurance (IPMI); confirm your policy covers FV Hospital and includes medical evacuation to Singapore before arrival.'},
    {'question': 'Do you need a car in Ho Chi Minh City?', 'answer': 'Not necessarily — Grab (ride-hailing) is inexpensive and widely available for all daily transport. Most expat families in Districts 2 and 7 use Grab for school runs and skip car ownership entirely.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderately complex — TM30 registration, TRC application, and work permit all require coordination and multiple visits. Using a local relocation agent ($300–$600) is strongly recommended for the first 60 days to avoid compliance errors.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how livable and modern Districts 2 and 7 are — the expat infrastructure is far more developed than outsiders expect. The traffic noise and motorbike density also take 2–3 weeks to adapt to.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# BENGALURU, IN
# ═══════════════════════════════════════════════════════════════════
'bengaluru-in': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$3,200–$5,000 / month',
    'rentRange': '~$1,400 / month',
    'familyDinner': '~$25',
    'nannyRate': '~$5 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Technology and engineering professionals relocating to India\'s Silicon Valley — Amazon, Google, Microsoft, Flipkart, Infosys, and hundreds of tech multinationals have major Bengaluru campuses',
      'Families on a budget who want a modern international city lifestyle with good schools and domestic help at costs 50–70% lower than Singapore, Hong Kong, or London',
      'Parents who value access to world-class private medical infrastructure at a fraction of Western costs — Bengaluru\'s hospitals are among the best in Asia for cardiac and orthopedic surgery',
      'Families with an appetite for India\'s rich cultural diversity and energy — Bengaluru is one of India\'s most cosmopolitan and internationally minded cities',
    ],
    'watchOutFor': [
      'Traffic and infrastructure are Bengaluru\'s biggest daily challenge — commutes that look short on maps routinely take 45–90 minutes; living within 5 km of your workplace and school is essential',
      'Monsoon season (June–September) causes significant waterlogging and flooding in low-lying areas — research your neighborhood\'s flood history and avoid ground-floor apartments',
      'International school applications for top schools (Canadian International School, Greenwood High) require 12–18 months in advance — do not wait until you arrive to start this process',
      'Construction dust and noise pollution are constant in Bengaluru\'s growth corridors — invest in a HEPA air purifier and verify that your apartment has sealed windows before signing',
    ],
  },
  'healthcare': {
    'tip': 'Manipal Hospitals (Whitefield campus) is the most accessible top-tier hospital for families in the tech corridor — confirm your IPMI covers it before registering.',
    'items': [
      'India\'s public healthcare system is not used by expats — all foreign families rely on private hospitals; Bengaluru has excellent private infrastructure in the Whitefield, Indiranagar, and Koramangala corridors',
      'Manipal Hospitals (Whitefield campus) and Narayana Health City (Bommasandra) are the two top private hospitals for complex care — Cloudnine Hospital (multiple locations) is the most popular choice for childbirth and pediatric care',
      'Typical private costs: GP consultation ₹800–₹1,500 (~$10–$18), specialist ₹1,500–₹3,000 (~$18–$36), ER visit ₹5,000–₹20,000 (~$60–$240)',
      'International private medical insurance (IPMI) is essential — Cigna Global, AXA, and Bupa Global are widely used; expect $3,000–$6,000/year for a family of four; ensure your policy covers evacuation to Singapore for complex cases',
      'Dengue fever spikes June–October (monsoon season) — use mosquito repellent on children daily and eliminate standing water; construction dust in Bengaluru also causes significant respiratory irritation year-round',
    ],
  },
  'safety': {
    'score': 71,
    'items': [
      'Bengaluru is generally safe by Indian city standards — violent crime rates are low in expat areas like Whitefield, Koramangala, Indiranagar, and Sarjapur Road; the main security concerns are petty theft and traffic',
      'Phone snatching and bag theft are the most common crimes in busy markets and busy streets — keep phones in pockets, use Uber/Ola for all travel, and avoid displaying expensive items outdoors',
      'Traffic in Bengaluru is severe and unpredictable — monsoon rain makes roads particularly chaotic; school pickup routes regularly take 30–60 minutes for short apparent distances; proximity to school matters more here than anywhere else',
      'Construction dust and monsoon waterlogging are the main environmental hazards — Whitefield and Electronic City areas have significant construction activity; HEPA air purifiers are essential in children\'s bedrooms',
      'Most expat gated communities (apartment complexes with 24/7 security guards, intercom systems, and CCTV) are the standard for families in Bengaluru\'s IT corridor — these provide a reliable level of daily security',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Bengaluru" or specific areas (Whitefield, Koramangala, Indiranagar) inside each platform to filter local listings.',
      'Tip: arrive with a 2–3 week serviced apartment booking in your target area — most landlords require an in-person viewing before signing; leases are typically 11 months (renewable) under Indian rental law.',
    ],
    'searchPortals': [
      {
        'label': 'NoBroker.com — India\'s leading no-brokerage rental platform; search Bengaluru to browse directly from landlords',
        'url': 'https://www.nobroker.in',
        'isVerified': True
      },
      {
        'label': 'MagicBricks — India\'s largest property portal; search Bengaluru for a broad range of listings',
        'url': 'https://www.magicbricks.com',
        'isVerified': True
      },
      {
        'label': 'Housing.com — strong in Bengaluru\'s tech-corridor areas (Whitefield, Electronic City, Sarjapur)',
        'url': 'https://housing.com',
        'isVerified': True
      },
      {
        'label': 'Facebook groups — search "Bangalore Expat Housing" for direct landlord leads and expat apartment listings',
        'url': 'https://www.google.com/search?q=Bangalore+Expat+Housing+Facebook+group',
        'isVerified': True
      }
    ],
  },
  'schools': {
    'options': [
      {
        'type': 'IB and international curriculum schools',
        'description': 'Multiple internationally accredited schools offer IB PYP, MYP, and Diploma programmes in Whitefield, Koramangala, and north Bengaluru. The Canadian International School and Greenwood High are most frequently recommended by expat families. Apply 12–18 months in advance.',
        'fees': '$8,000–$18,000/year typical'
      },
      {
        'type': 'CBSE and ICSE curriculum schools',
        'description': 'India\'s national curriculum boards (CBSE — Central Board of Secondary Education; ICSE — Indian Certificate of Secondary Education). High academic standards but instruction is primarily in English with Indian pedagogical style. A viable option for longer-term residents.',
        'fees': '$1,500–$5,000/year typical'
      },
      {
        'type': 'State Board public schools',
        'description': 'Free government schools with instruction in Kannada and English. Not suitable for non-English-speaking newcomers; quality varies significantly by school.',
        'fees': 'Free'
      }
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Bengaluru has a large domestic help market in its gated tech communities — starting your aya search early is essential as the best helpers are placed quickly.',
    'daycareItems': [
      'Private crèches (the Indian term for nursery/daycare) in Whitefield, Koramangala, and Indiranagar charge ₹18,000–₹45,000/month (~$215–$540) for full-day infant care — international-curriculum Montessori centers charge toward the upper end',
      'Anganwadi centers (government-run early childhood development centers) are free for income-eligible Indian families but operate in Kannada and Hindi — not suitable for expat children',
      'Visit crèches in person and ask about air-filtration systems — construction dust in Bengaluru makes indoor air quality a genuine factor; good nurseries should have air purifiers running in infant rooms',
    ],
    'nannyItems': [
      'Full-time live-in ayas (Indian term for a domestic helper or nanny) in Bengaluru charge ₹15,000–₹30,000/month (~$180–$360) including accommodation — live-out nannies charge ₹18,000–₹40,000/month (~$215–$480) depending on experience and English ability',
      'All domestic workers employed in India should be registered with BBMP (Bruhat Bengaluru Mahanagara Palike — Bengaluru\'s municipal authority) — your housing society handles police verification; use a registered staffing agency to ensure background checks are done',
      'English-speaking ayas with experience in expat families are in high demand — start your search 8–10 weeks before arrival through your company\'s HR relocation team or through expat Facebook groups',
    ],
    'whereToFindItems': [
      'Search "Bangalore Expat Family Network" and "Expat Moms Bangalore" on Facebook — the most active English-language communities for aya referrals and childcare recommendations',
      'Registered domestic staffing agencies in Whitefield and Koramangala pre-screen candidates and provide police verification — search "domestic staff agency Bengaluru" on Google; placement fees typically equal one month\'s salary',
      'Company HR teams at major tech employers (Amazon, Google, Infosys) often maintain referral lists for domestic workers vetted through corporate relocation programs',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'Open an NRO or resident savings account as soon as your Aadhaar or employer documentation is ready — payroll and rent transfers depend on it.',
    'items': [
      'HDFC Bank and ICICI Bank are the most commonly used banks by expat tech professionals in Bengaluru — both have English-language support, international wire capabilities, and branches near all major IT parks',
      'Documents required: passport, valid India visa stamp, employer letter, and proof of Bengaluru address (lease works as provisional address proof); Aadhaar (India\'s biometric national ID) and PAN (Permanent Account Number — India\'s tax ID) are required for full-feature accounts',
      'Use Wise or Revolut for international transfers while your Indian account is being set up — both support INR and are significantly cheaper than HDFC or ICICI SWIFT wire fees',
      'UPI (Unified Payments Interface — India\'s real-time bank-to-bank payment system) is the standard for almost all transactions in Bengaluru — link your account to Google Pay or PhonePe; this replaces cash for most daily transactions',
      'Cash (Indian rupees) is still used in local markets, auto-rickshaws, and smaller restaurants — keep ₹2,000–₹5,000 (~$25–$60) on hand; ATMs are widely available near all major gated communities',
    ],
  },
  'residency': {
    'title': 'FRRO Registration & Indian IDs',
    'tip': 'Register with the FRRO within 14 days of arrival — penalties for late registration are strict and affect future visa renewals.',
    'items': [
      'Register with the FRRO (Foreigners Regional Registration Office — India\'s authority for foreign national registration) within 14 days of arrival at indianfrro.gov.in — bring passport, visa, proof of address (lease), and employer letter',
      'Obtain your Aadhaar card (India\'s biometric national ID — required for banking, utilities, school enrollment, and SIM registration) through a designated enrollment center — bring passport and visa; processing takes 30–90 days; use your passport as ID in the interim',
      'Obtain a PAN card (Permanent Account Number — India\'s income tax ID, managed by the Income Tax Department) through your employer\'s HR team or online at incometaxindia.gov.in — required for payroll, banking, and income tax filing',
      'Enroll your children in school with your FRRO registration, apostilled birth certificates, and prior school transcripts — top schools like Canadian International School require these documents at the time of application',
      'Your housing society will arrange a police verification check for all residents including domestic staff — cooperate promptly and retain copies of all submitted documents; it typically takes 2–4 weeks',
    ],
  },
  'faq': [
    {'question': 'Is Bengaluru good for families?', 'answer': 'Yes, for families comfortable with Indian city life and willing to manage traffic strategically. Bengaluru has excellent tech-sector employment, world-class private hospitals, good international schools, and very affordable domestic help. Traffic and monsoon flooding are the main daily challenges.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in Whitefield or Koramangala typically spends $3,200–$5,000/month all-in — including rent (~$1,400), groceries, domestic help, and transport, but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'No — Bengaluru has ample inventory in its tech corridors. Use NoBroker.com to find no-brokerage options and book a 2–3 week serviced apartment for your initial search.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'International school is strongly recommended for non-Indian-curriculum children — IB and CBSE international schools in Whitefield and Koramangala are well-established. Apply 12–18 months in advance for the top schools.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Bengaluru has excellent private hospitals at a fraction of Western costs. International private medical insurance (IPMI) is essential; ensure your policy covers Manipal and Cloudnine hospitals and includes evacuation to Singapore.'},
    {'question': 'Do you need a car in Bengaluru?', 'answer': 'Yes in most cases — Bengaluru\'s traffic and dispersed layout make a car or consistent Uber/Ola access essential. Most families use a combination of their own car plus Uber/Ola for flexibility.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderately complex — FRRO registration, Aadhaar, PAN, and bank account require coordinated effort over 6–10 weeks. Your company\'s HR team handles the most important steps (work permit, PAN); a local relocation agent helps with the rest.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how much time traffic consumes — a 5 km journey can take 45 minutes in peak hours. The warmth and hospitality of the local tech community and domestic staff is the pleasant opposite surprise.'},
  ],
},

# ═══════════════════════════════════════════════════════════════════
# MUMBAI, IN
# ═══════════════════════════════════════════════════════════════════
'mumbai-in': {
  'cost': {
    'status': 'estimated',
    'monthlyFamilyAllIn': '~$5,500–$8,500 / month',
    'rentRange': '~$2,800 / month',
    'familyDinner': '~$40',
    'nannyRate': '~$7 / hr',
  },
  'familyFit': {
    'bestFor': [
      'Finance, media, and entertainment executives — Mumbai is India\'s financial capital and home to the BSE, major banking firms, consulting companies, and Bollywood',
      'Families who want India\'s best urban infrastructure, vibrant dining scene, and maximum cultural diversity concentrated in one city',
      'Parents with access to good expat packages — Mumbai\'s high rents and school fees are most manageable when offset by a housing and education allowance',
      'Families with an appetite for cosmopolitan city life — Mumbai has direct flights to the Middle East, Europe, and Southeast Asia',
    ],
    'watchOutFor': [
      'Mumbai is one of the most expensive cities in India — rent in expat areas (Bandra, Juhu, BKC) is significantly higher than Bengaluru, Pune, or Chennai; budget realistically',
      'Monsoon season (June–September) is intense — flooding, power outages, and transport disruptions are common; these require practical preparation and a different mindset than most cities',
      'International school application timelines are very long — top schools like Dhirubhai Ambani International and JBCN International require applications 12–18 months in advance with real waitlists',
      'Traffic and distance are the most significant quality-of-life factors — Mumbai\'s narrow peninsula creates severe congestion; living within 3–4 km of work and school is essential',
    ],
  },
  'healthcare': {
    'tip': 'Kokilaben Dhirubhai Ambani Hospital in Andheri West and Sir H. N. Reliance Foundation Hospital in Marine Lines are Mumbai\'s two top private hospitals — confirm your IPMI covers both.',
    'items': [
      'India\'s public healthcare system is not used by expats — all foreign families rely on private hospitals; Mumbai has excellent private healthcare in the BKC, Andheri, and Juhu corridors',
      'Kokilaben Dhirubhai Ambani Hospital (Andheri West) and Sir H. N. Reliance Foundation Hospital (Marine Lines) are Mumbai\'s premier private hospitals for complex care and pediatric services',
      'Typical private costs: GP consultation ₹1,000–₹2,000 (~$12–$24), specialist ₹2,000–₹4,000 (~$24–$48), ER visit ₹8,000–₹30,000 (~$96–$360)',
      'International private medical insurance (IPMI) is essential — Cigna Global and AXA are widely used; expect $4,000–$8,000/year for a family of four; ensure coverage includes medical evacuation in the policy',
      'Monsoon season (June–September) increases dengue fever risk and causes mould growth in coastal apartments — run dehumidifiers during monsoon, use mosquito repellent daily on children, and replace HEPA filters after the monsoon season ends',
    ],
  },
  'safety': {
    'score': 72,
    'items': [
      'Mumbai is statistically one of India\'s safer megacities for expat families — violent crime in expat areas (Bandra West, Juhu, Powai, BKC) is rare; the city has a large visible police presence in financial and residential districts',
      'Petty theft and phone snatching near crowded local train stations and markets are the most common security risks — use Uber/Ola for all travel, avoid local trains during peak hours with children, and keep phones secured',
      'Traffic accidents are a significant daily risk — Mumbai\'s roads mix cars, auto-rickshaws, buses, and pedestrians; children must be explicitly taught road safety; use Uber for all school transport',
      'Monsoon season (June–September) brings extreme flooding that can temporarily immobilize the city — keep a 3-day supply of food, water, and medication at home; do not attempt to drive through flooded roads',
      'Coastal apartments are susceptible to mould, salt corrosion, and humidity during monsoon — inspect apartments for existing mould before signing, and budget for dehumidifiers; ground-floor units near the sea are particularly susceptible',
    ],
  },
  'housing': {
    'searchPortalsIntro': [
      'These are local rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).',
      'Search "Mumbai" or specific areas (Bandra West, Juhu, Powai, BKC) inside each platform to filter local listings.',
      'Tip: arrive with a 2–3 week serviced apartment booking in your target area — Mumbai landlords require in-person meetings; leases are 11-month agreements (renewable) under the Maharashtra Rent Control Act.',
    ],
    'searchPortals': [
      {
        'label': 'NoBroker.com — India\'s leading no-brokerage rental platform; search Mumbai to browse directly from landlords',
        'url': 'https://www.nobroker.in',
        'isVerified': True
      },
      {
        'label': 'MagicBricks — India\'s largest property portal; search Mumbai for the broadest range of listings',
        'url': 'https://www.magicbricks.com',
        'isVerified': True
      },
      {
        'label': 'Housing.com — strong in Bandra, BKC, and Powai expat-corridor areas',
        'url': 'https://housing.com',
        'isVerified': True
      },
      {
        'label': 'Facebook groups — search "Mumbai Expat Housing" for direct landlord leads and expat apartment listings',
        'url': 'https://www.google.com/search?q=Mumbai+Expat+Housing+Facebook+group',
        'isVerified': True
      }
    ],
  },
  'schools': {
    'options': [
      {
        'type': 'IB and international curriculum schools',
        'description': 'Mumbai has multiple internationally accredited schools in Bandra, Juhu, and Powai offering IB PYP and Diploma programmes. Dhirubhai Ambani International School and JBCN International are most frequently recommended. Apply 12–18 months in advance; waitlists are real even for fee-paying applicants.',
        'fees': '$10,000–$22,000/year typical'
      },
      {
        'type': 'CBSE and ICSE curriculum schools',
        'description': 'India\'s national curriculum boards (CBSE and ICSE) maintain high academic standards with English-medium instruction. A practical option for families on longer-term assignments comfortable with the Indian curriculum system.',
        'fees': '$2,000–$6,000/year typical'
      },
      {
        'type': 'State Board public schools',
        'description': 'Free government schools with instruction in Marathi and English. Not suitable for non-Marathi-speaking newcomer children.',
        'fees': 'Free'
      }
    ],
  },
  'childcare': {
    'status': 'estimated',
    'summary': 'Mumbai has an active domestic help and crèche market in expat suburbs — agency-sourced ayas are the norm for gated housing societies.',
    'daycareItems': [
      'Private crèches (nurseries) in Bandra West, Juhu, and Powai charge ₹20,000–₹60,000/month (~$240–$720) for full-day infant and toddler care — crèches attached to international schools charge at the upper end',
      'Anganwadi centers (government community centers) are free for eligible Indian families but operate in Marathi and Hindi — not suitable for non-Marathi/Hindi-speaking expat children',
      'Visit crèches in person and ask about monsoon flooding risk and air-quality controls — ground-floor crèches near the coast carry higher flood risk; air purifiers should be running in infant rooms year-round',
    ],
    'nannyItems': [
      'Full-time live-in domestic staff (ayas or bais — the local Marathi term for domestic helpers) in Mumbai charge ₹20,000–₹50,000/month (~$240–$600) including accommodation — rates are higher than Bengaluru or Pune due to Mumbai\'s high cost of living',
      'All domestic workers should be police-verified through the Mumbai Police — your housing society security team facilitates this; registered staffing agencies (search "domestic staff agency Mumbai Bandra") pre-screen and police-verify candidates',
      'English-speaking nannies with expat family experience are in high demand in Bandra, Juhu, and BKC — start searching 8–10 weeks before arrival through company HR relocation teams or expat Facebook groups',
    ],
    'whereToFindItems': [
      'Search "Mumbai Expat Families" and "Expat Moms Mumbai" on Facebook — the most active English-language communities for domestic worker referrals and childcare advice',
      'Registered domestic staffing agencies in Bandra and BKC pre-screen candidates, handle police verification, and provide replacement guarantees — search "domestic staff agency Mumbai" on Google for current agencies in your area',
      'Housing society notice boards and committee WhatsApp groups are reliable community channels for finding domestic help already trusted by neighbors',
    ],
  },
  'banking': {
    'title': 'Banking',
    'tip': 'HDFC Bank and ICICI Bank both have relationship manager services for expat clients at their BKC and Bandra branches — book a Monday morning appointment to start account opening.',
    'items': [
      'HDFC Bank and ICICI Bank are the most commonly used banks by expat professionals in Mumbai — both offer international wire capabilities, English-language support, and proximity to major expat neighborhoods',
      'Documents required: passport, valid India visa, employer letter, and proof of Mumbai address (signed lease); Aadhaar (India\'s biometric ID) and PAN (Permanent Account Number — India\'s income tax ID) are required for full banking access; your employer\'s HR team helps obtain PAN quickly',
      'Use Wise or Revolut for international transfers while your Indian account is being set up — both support INR and are significantly cheaper than HDFC or ICICI SWIFT wire fees',
      'UPI (Unified Payments Interface — India\'s real-time bank-to-bank payment system) is the standard payment method in Mumbai for everything from rent to taxis — link your account to Google Pay or PhonePe once active',
      'Cash (Indian rupees) is used for local markets, auto-rickshaws, and smaller restaurants — keep ₹3,000–₹7,000 (~$35–$85) on hand; ATMs are widely available in all major expat neighborhoods',
    ],
  },
  'residency': {
    'title': 'FRRO Registration & Indian IDs',
    'tip': 'Register with the FRRO within 14 days of arrival — the process is online at indianfrro.gov.in; late registration results in fines and affects future visa renewals.',
    'items': [
      'Register with the FRRO (Foreigners Regional Registration Office — India\'s authority for foreigner registration) within 14 days of arrival at indianfrro.gov.in — bring passport, visa, proof of Mumbai address (lease), and employer letter',
      'Obtain your Aadhaar card (India\'s biometric national ID — required for banking, school enrollment, SIM registration, and utilities) through a designated enrollment center — bring passport and visa; processing takes 30–90 days; use your passport as ID in the interim',
      'Obtain a PAN card (Permanent Account Number — India\'s income tax ID) through your employer\'s HR team or online at incometaxindia.gov.in — required for payroll, banking, and annual income tax filing',
      'Enroll your children in school with your FRRO registration confirmation, apostilled birth certificates, prior school transcripts, and proof of address — most international schools require the FRRO receipt as part of enrollment',
      'Your housing society will arrange a police verification check for all residents — cooperate promptly with this process; it typically takes 2–6 weeks and is required before most Mumbai landlords will hand over keys',
    ],
  },
  'faq': [
    {'question': 'Is Mumbai good for families?', 'answer': 'Yes, for families with a good expat package and a tolerance for the city\'s intensity. Bandra and Juhu offer a very comfortable family lifestyle, and Mumbai\'s cultural richness and career opportunities are unmatched in India. Monsoon flooding and traffic require active management.'},
    {'question': 'How much does a family typically need per month here?', 'answer': 'A family of four renting a 3-bedroom apartment in Bandra or Juhu typically spends $5,500–$8,500/month all-in — including rent (~$2,800), groceries, domestic help, and transport, but not international school tuition.'},
    {'question': 'Is housing hard to find here?', 'answer': 'Yes — Mumbai has the tightest rental market in India. Good apartments in Bandra West and Juhu go very quickly; start your search before you arrive and use a local broker or NoBroker.com to accelerate the process.'},
    {'question': 'Do children need international school here, or can local schools work?', 'answer': 'International school is strongly recommended for non-Indian-curriculum children. Mumbai has good IB and CBSE international options but apply 12–18 months in advance — waitlists at Dhirubhai Ambani and JBCN are genuine.'},
    {'question': 'Is healthcare easy to access as a newcomer?', 'answer': 'Yes — Kokilaben and Sir H. N. Reliance Foundation Hospital are world-class. International private medical insurance (IPMI) is essential; confirm your policy covers Mumbai\'s top hospitals before arriving.'},
    {'question': 'Do you need a car in Mumbai?', 'answer': 'Less so than most Indian cities — Mumbai has an extensive rail network and Uber/Ola are reliable and inexpensive. Many expat families in Bandra and Powai use Uber for daily transport and skip car ownership.'},
    {'question': 'How difficult is the paperwork and bureaucracy after moving?', 'answer': 'Moderately complex — FRRO registration, Aadhaar, PAN, and bank account require coordinated effort over 6–10 weeks. Your company\'s HR team handles work permit and PAN; a local relocation agent helps with housing society formalities and FRRO.'},
    {'question': 'What usually surprises families after arrival?', 'answer': 'Most families are surprised by how intense Mumbai\'s monsoon is — flooding can make some roads impassable for hours. The city\'s 24-hour energy and extraordinary food diversity are the pleasant surprises that make most families stay longer than planned.'},
  ],
},

} # End CITY_UPDATES


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: deep-update a city dict with the updates dict
# ─────────────────────────────────────────────────────────────────────────────

def deep_update(city, updates):
    """Apply updates to city, merging dicts where needed, replacing otherwise."""
    for key, value in updates.items():
        if isinstance(value, dict) and key in city and isinstance(city[key], dict):
            # Merge nested dicts (e.g. housing — only update specified sub-keys)
            for sub_key, sub_value in value.items():
                city[key][sub_key] = sub_value
        else:
            city[key] = value
    return city


# ─────────────────────────────────────────────────────────────────────────────
# CLEANUP: remove "politely", "oddly" artifacts from string values
# ─────────────────────────────────────────────────────────────────────────────

def clean_artifacts(obj):
    """Remove politely/oddly/USD-ish artifacts from all string values."""
    if isinstance(obj, dict):
        return {k: clean_artifacts(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_artifacts(v) for v in obj]
    elif isinstance(obj, str):
        s = obj
        # Remove repeated patterns first
        for _ in range(5):
            s = re.sub(r'\s+politely\b', '', s, flags=re.IGNORECASE)
            s = re.sub(r'\bpolitely\s+', '', s, flags=re.IGNORECASE)
            s = re.sub(r'\bpolitely\b', '', s, flags=re.IGNORECASE)
            s = re.sub(r'\s+oddly\b', '', s, flags=re.IGNORECASE)
            s = re.sub(r'\boddly\s+', '', s, flags=re.IGNORECASE)
            s = re.sub(r'\boddly\b', '', s, flags=re.IGNORECASE)
        # Remove known artifact phrases
        s = re.sub(r'\bUSD-ish\b', 'USD', s, flags=re.IGNORECASE)
        s = re.sub(r'\bCLP-heavy budget plan USD parity swings\b', '', s, flags=re.IGNORECASE)
        s = re.sub(r'\bINR lease\b', 'INR', s, flags=re.IGNORECASE)
        # Clean up multiple spaces and trailing punctuation issues
        s = re.sub(r'\s{2,}', ' ', s)
        s = re.sub(r'\s+([.,;:!?])', r'\1', s)
        s = s.strip()
        # Remove trailing question marks that are artifacts (lone "?")
        s = re.sub(r'\s+\?$', '', s)
        return s
    return obj


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main():
    with open('data/cities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Build index
    idx_map = {c['id']: i for i, c in enumerate(data)}

    for city_id, updates in CITY_UPDATES.items():
        if city_id not in idx_map:
            print(f'WARNING: {city_id} not found in cities.json')
            continue

        idx = idx_map[city_id]
        city = data[idx]

        # Preserve weather and sources before any modification
        preserved_weather = city.get('weather')
        preserved_sources = city.get('sources')

        # Apply explicit updates
        city = deep_update(city, updates)

        # Do a cleanup pass on all fields except weather and sources
        if 'weather' in city:
            del city['weather']
        if 'sources' in city:
            del city['sources']

        city = clean_artifacts(city)

        # Restore weather and sources unchanged
        if preserved_weather is not None:
            city['weather'] = preserved_weather
        if preserved_sources is not None:
            city['sources'] = preserved_sources

        data[idx] = city
        print(f'Updated: {city_id}')

    # Write back
    with open('data/cities.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print('\nDone. Wrote data/cities.json')


if __name__ == '__main__':
    main()
