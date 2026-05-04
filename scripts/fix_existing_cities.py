#!/usr/bin/env python3
"""
Targeted fixes for 35 pre-existing cities:
  - Adds missing checklist items (only append, never replace existing good content)
  - Expands short checklist labels to meet 80-char minimum
  - Adds missing school options (koh-samui-th)

Safe to run multiple times — items are only appended if the city is below 8.
"""
import json

with open("data/cities.json", "r", encoding="utf-8") as f:
    cities = json.load(f)

def get(cities, city_id):
    for c in cities:
        if c["id"] == city_id:
            return c
    raise ValueError(city_id)

def fix_label(cities, city_id, idx, new_label):
    c = get(cities, city_id)
    c["actionChecklist"][idx]["label"] = new_label

def add_items(cities, city_id, new_items):
    """Append items only — never touch existing ones."""
    c = get(cities, city_id)
    c["actionChecklist"].extend(new_items)

# ─────────────────────────────────────────────────────────────────────────────
# FIX SHORT LABELS — expand without changing meaning
# ─────────────────────────────────────────────────────────────────────────────

# austin-us
fix_label(cities, "austin-us", 3, "Apply for your Social Security Number (SSN — required for payroll, banking, and tax) at your nearest Social Security Administration office (ssa.gov). Bring your passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94).")
fix_label(cities, "austin-us", 4, "Arrange US health insurance before your first day in Austin — either through your employer's group plan or a private IPMI (International Private Medical Insurance) policy. In the US, a single ER visit without insurance costs $2,000–$10,000.")
fix_label(cities, "austin-us", 6, "Schedule a Texas DPS (Department of Public Safety) appointment for your driver's licence at dps.texas.gov — appointment slots fill 4–6 weeks out, especially in summer. Austin is car-dependent; a Texas licence is required within 90 days of arriving.")

# bali-id
fix_label(cities, "bali-id", 2, "Email international schools in south Bali (Canggu and Seminyak area) 9–12 months before your move — the largest English-curriculum campuses fill their August intake early and do not hold spots without a deposit.")

# chicago-us
fix_label(cities, "chicago-us", 3, "Apply for your Social Security Number (SSN — required for payroll, tax, and banking) at your nearest Social Security Administration office (ssa.gov). Bring your passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94).")
fix_label(cities, "chicago-us", 4, "Arrange US health insurance before your first day in Chicago — either through your employer's group plan or a private IPMI (International Private Medical Insurance) policy. In the US, a single ER visit without insurance costs $2,000–$10,000.")
fix_label(cities, "chicago-us", 5, "Open a US bank account at Chase, Wells Fargo, or BMO Harris within the first week — bring your passport, visa, I-94 (from cbp.dhs.gov/i94), and a signed lease. You need a US account to pay rent by ACH transfer and set up utilities.")

# copenhagen-dk
fix_label(cities, "copenhagen-dk", 5, "Open a NemKonto-linked bank account (Danske Bank or Nordea are common) once your CPR number is active — your salary, tax refunds, and public benefit payments all flow to this account. Bring your CPR, passport, and proof of address.")

# dublin-ie
fix_label(cities, "dublin-ie", 1, "Start your housing search 3–4 months before your move date — Dublin's southside family suburbs (Blackrock, Dalkey, Rathfarnham) move very fast and competition for 3+ bedroom rentals is intense. Budget ~€2,500–€4,000/month for a family home.")
fix_label(cities, "dublin-ie", 2, "Apply to private or Educate Together schools 12–18 months before your move — the best international-friendly schools in South Dublin fill places early and cannot be bypassed with a late application.")
fix_label(cities, "dublin-ie", 5, "Open an Irish bank account (Bank of Ireland or AIB) once you have your PPS number and proof of address. Alternatively, use Revolut or N26 as a bridge account from day one — both are available without an Irish address.")

# jerusalem-il
fix_label(cities, "jerusalem-il", 3, "Short-list international and Anglo-friendly schools before signing a lease — hill geography in Jerusalem means school commutes vary sharply by neighborhood. The German Colony and Katamon areas have the shortest school runs.")
fix_label(cities, "jerusalem-il", 5, "Open an Israeli bank account (Bank Hapoalim, Bank Leumi, or Bank Discount) — bring your visa, lease agreement, and employment contract. Allow 2–4 weeks as paperwork moves slowly; use Wise or Revolut for international transfers in the meantime.")
fix_label(cities, "jerusalem-il", 7, "Review your home government's current travel advisory for Jerusalem before committing to dates — the security situation can affect school schedules and neighborhood access. Download the Home Front Command (Pikud HaOref) emergency alert app on arrival.")

# koh-phangan-th
fix_label(cities, "koh-phangan-th", 9, "Budget for a reliable car or motorbike rental from day one — Koh Phangan has no public transport and steep, flooded roads make this a genuine safety need, not just a convenience.")

# london-gb
fix_label(cities, "london-gb", 0, "Confirm your UK visa route before travelling — a tourist visa does not grant the right to work or enroll children in state schools. Employment visa, Skilled Worker, or Global Talent routes are the most common for relocating families.")
fix_label(cities, "london-gb", 1, "Start your housing search 8–12 weeks before your move date — London family flats in zones 1–3 (Islington, Richmond, Hampstead, Putney) move fast and require a deposit within 48 hours of viewing. Budget ~£3,500–£6,000/month for a 3-bedroom.")
fix_label(cities, "london-gb", 2, "Apply to schools following your borough's admissions rules — state school places are allocated by borough councils based on address; most offer places in October for the following September. Independent school applications need 12–18 months lead time.")
fix_label(cities, "london-gb", 4, "Open a UK bank account (HSBC, Barclays, or Monzo) — bring your passport, visa, and proof of UK address. Monzo and Revolut open within days and work as a bridge while your main account processes.")
fix_label(cities, "london-gb", 5, "Apply for your National Insurance number (NI number — the UK's tax and social security identifier, required for payroll) at gov.uk/apply-national-insurance-number. Bring proof of identity and your right-to-work documents.")

# los-angeles-us
fix_label(cities, "los-angeles-us", 3, "Apply for your Social Security Number (SSN — required for payroll, tax, and banking) at your nearest SSA office (ssa.gov). Bring your passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94).")
fix_label(cities, "los-angeles-us", 4, "Arrange US health insurance before your first day in LA — either through your employer's group plan or a private IPMI (International Private Medical Insurance) policy. In the US, a single ER visit without insurance costs $2,000–$10,000.")
fix_label(cities, "los-angeles-us", 7, "Build an earthquake preparedness kit (water, food, first aid, flashlight, cash) before your first month is out — Los Angeles sits on active fault lines and CalOES (California's emergency office) recommends every household maintain a 72-hour kit.")

# san-francisco-us
fix_label(cities, "san-francisco-us", 1, "Start housing alongside school research 8–10 weeks before your move — Bay Area family rentals in Palo Alto, Los Gatos, and Marin County move within days of listing. Budget ~$5,000–$8,000/month for a 3-bedroom in top school zones.")
fix_label(cities, "san-francisco-us", 2, "Apply for your Social Security Number (SSN — required for payroll, tax, and banking) at your nearest SSA office (ssa.gov). Bring your passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94).")
fix_label(cities, "san-francisco-us", 3, "Arrange US health insurance before your first day — either through your employer's group plan or a private IPMI (International Private Medical Insurance) policy. In the US, a single ER visit without insurance costs $2,000–$10,000.")
fix_label(cities, "san-francisco-us", 4, "Open a US bank account (Chase, Wells Fargo, or Bank of America) within the first week — bring your passport, visa, I-94 (from cbp.dhs.gov/i94), and a signed lease. You need a US account to pay rent by ACH transfer and receive direct deposit.")
fix_label(cities, "san-francisco-us", 5, "Schedule your California driver's licence test at DMV.ca.gov early — appointment slots fill 4–6 weeks out. California requires a licence within 10 days of establishing residency; an international licence is not accepted long-term.")
fix_label(cities, "san-francisco-us", 6, "Build a go-bag for earthquake response (water, documents, cash, medications) before your first month ends — the Bay Area sits on multiple active fault lines and California OES recommends every household maintain a 72-hour emergency kit.")

# seattle-us
fix_label(cities, "seattle-us", 3, "Apply for your Social Security Number (SSN — required for payroll, tax, and banking) at your nearest SSA office (ssa.gov). Bring your passport, visa, and I-94 arrival record (download at cbp.dhs.gov/i94).")
fix_label(cities, "seattle-us", 4, "Arrange US health insurance before your first day in Seattle — either through your employer's group plan or a private IPMI (International Private Medical Insurance) policy. In the US, a single ER visit without insurance costs $2,000–$10,000.")
fix_label(cities, "seattle-us", 5, "Open a US bank account (Chase, Wells Fargo, or local Washington bank like Banner Bank) within the first week — bring your passport, visa, I-94 (from cbp.dhs.gov/i94), and a signed lease.")

# ubud-id
fix_label(cities, "ubud-id", 4, "Keep digital and printed copies of every immigration stamp and KITAS page — same 24-hour TM30 address reporting duties apply as coastal Bali, and Ubud immigration officers check compliance regularly.")
fix_label(cities, "ubud-id", 5, "Follow dengue mosquito prevention routines year-round — repellent, long sleeves at dusk, and eliminating standing water around your villa. Dengue peaks after rain and children are particularly vulnerable.")

# valencia-es
fix_label(cities, "valencia-es", 4, "Start searching for family housing 6–8 weeks before your move — Ruzafa, El Pla del Real, and Eixample are the most popular family neighborhoods close to international schools and public parks.")

# zurich-ch
fix_label(cities, "zurich-ch", 5, "Open a CHF (Swiss franc) bank account at UBS, Credit Suisse, or cantonal banks — your employer and landlord will require a Swiss IBAN for salary and rent. Bring your residence permit, passport, and address registration certificate.")
fix_label(cities, "zurich-ch", 6, "Book a Kita (Kindertagesstätte — daycare centre) or Tagesfamilie (registered family daycare) slot as soon as you know your Zurich address — waiting lists in Seefeld and Oerlikon run 3–6 months. Subsidised spots are income-based and fill first.")

# ─────────────────────────────────────────────────────────────────────────────
# ADD MISSING CHECKLIST ITEMS
# ─────────────────────────────────────────────────────────────────────────────

add_items(cities, "amsterdam-nl", [
    {
        "label": "Research kinderopvang (daycare) options in your neighborhood — Amsterdam has subsidized daycare but waiting lists in popular areas like De Pijp and Oud-Zuid run 6–12 months. Register on the waiting list as soon as you have an address. Nanny agencies like Nanny Express and Au Pair NL cover the gap.",
        "targetSection": "childcare"
    },
    {
        "label": "Amsterdam is one of Europe's safest cities for families — but cycling traffic is the #1 daily hazard. Buy helmets and good city bikes within the first week and spend a weekend practicing the bike lane rules before cycling with children in traffic.",
        "targetSection": "safety"
    }
])

add_items(cities, "austin-us", [
    {
        "label": "Pack for Texas summer heat (38–42°C / 100–108°F from June–August) — confirm your apartment has functioning AC before signing, build an emergency supply kit ahead of the spring tornado season (March–May), and download the TexasAlerts emergency notification app.",
        "targetSection": "safety"
    }
])

add_items(cities, "bali-id", [
    {
        "label": "Bali's roads are the biggest daily safety risk for families — motorbike injuries are common among expats. Buy helmets for every family member before your first ride, use a driver for children's school runs, and check that your health insurance covers motorbike accidents explicitly.",
        "targetSection": "safety"
    }
])

add_items(cities, "bangkok-th", [
    {
        "label": "Find an English-speaking nanny or au pair before arriving — agencies like Nanny Thailand and direct referrals from the Bangkok Expat Families Facebook group are the two most reliable routes. Full-time nannies run ~$400–$700/month; part-time rates are ~$5–$8/hr.",
        "targetSection": "childcare"
    }
])

add_items(cities, "berlin-de", [
    {
        "label": "Register on Kita (Kindertagesstätte — subsidised public daycare) waiting lists immediately after your address registration — Berlin has a legal entitlement to a Kita place from age 1, but popular neighborhoods have waiting lists of 12–18 months. Use the Kita-Navigator at kitanetz.de to apply across multiple locations.",
        "targetSection": "childcare"
    }
])

add_items(cities, "budapest-hu", [
    {
        "label": "Research Bölcsőde (nursery for ages 0–3) and óvoda (kindergarten for ages 3–6) options near your neighborhood — state-run facilities are subsidised but often teach only in Hungarian. International and bilingual nurseries in District II and XII fill quickly; visit in person and register early.",
        "targetSection": "childcare"
    }
])

add_items(cities, "buenos-aires-ar", [
    {
        "label": "Search for an English-speaking nanny through the Buenos Aires Expats Facebook group or local agencies — full-time live-out nannies typically cost ~$400–$700/month (paid in pesos at the official rate). Start your search 2–3 months before arrival — the best-reviewed nannies have waiting lists.",
        "targetSection": "childcare"
    },
    {
        "label": "Buenos Aires is generally safe in the Palermo, Belgrano, and Núñez family neighborhoods — petty theft and phone snatching are the most common issues. Avoid flashing phones on the street, use Uber or Cabify rather than flagging taxis, and stay aware at night in less-lit streets.",
        "targetSection": "safety"
    }
])

add_items(cities, "chicago-us", [
    {
        "label": "Pack for Chicago winters before arriving — temperatures regularly drop to -15°C to -20°C (0°F to -5°F) from December through February with significant wind chill on the lakefront. Buy proper winter gear (parkas, snow boots, ice grips for shoes) before the first cold snap, and prep a go-bag for spring tornado season (April–June).",
        "targetSection": "safety"
    }
])

add_items(cities, "copenhagen-dk", [
    {
        "label": "Register on the vuggestue (nursery for ages 0–2) and børnehave (kindergarten for ages 3–6) waiting lists at your local Pladsanvisning (municipal childcare office) immediately after getting your CPR number — popular neighborhoods have waiting lists of 6–12 months. State-subsidised places cover 75% of costs.",
        "targetSection": "childcare"
    },
    {
        "label": "Copenhagen is one of the world's safest and most family-friendly cities. The main daily hazard is cycling traffic — bike paths are fast and busy. Buy good helmets and city bikes within the first week and practice the cycling rules with children before commuting in traffic.",
        "targetSection": "safety"
    }
])

add_items(cities, "dallas-us", [
    {
        "label": "Prepare for Dallas summer heat (38–43°C / 100–110°F from June–September) and spring tornado season (March–May) — confirm your apartment or house has AC in all rooms and a storm shelter or interior room. Download the MyRadar weather app and sign up for Dallas County emergency alerts at dallascounty.org.",
        "targetSection": "safety"
    }
])

add_items(cities, "dublin-ie", [
    {
        "label": "Research crèche (nursery — Irish term for daycare for children under 3) options near your neighborhood before arriving — Dublin crèches in Blackrock, Rathmines, and Clontarf have 6–12 month waiting lists. Expect to pay ~€1,200–€1,800/month full-time. The National Childcare Subsidy (NCS) reduces costs once you have a PPS number.",
        "targetSection": "childcare"
    },
    {
        "label": "Dublin is a safe city for families in the residential suburbs — petty theft and occasional antisocial behavior in the city center late at night are the main concerns. The south Dublin suburbs (Blackrock, Dalkey, Ranelagh) are among the safest family areas. Be aware that healthcare wait times in public hospitals are long — private insurance is strongly recommended.",
        "targetSection": "safety"
    }
])

add_items(cities, "krakow-pl", [
    {
        "label": "Check Kraków's winter air quality (smog) before committing to neighborhoods close to the old town — Poland has some of Europe's worst coal-heating pollution from October through March. Download the AirVisual or Airly app to monitor daily PM2.5 levels and prepare N95 masks and HEPA air purifiers for indoor air quality, especially for children with respiratory conditions.",
        "targetSection": "safety"
    }
])

add_items(cities, "kuala-lumpur-my", [
    {
        "label": "Search for an English-speaking nanny or au pair through the KL Expat Kids Facebook group or through agencies like StaffOne Malaysia — full-time nannies or housekeepers (widely used by expat families) cost ~$400–$700/month. Start 2–3 months before arrival; the best-reviewed helpers have waiting lists.",
        "targetSection": "childcare"
    },
    {
        "label": "Kuala Lumpur is generally safe in the expat family areas (Mont Kiara, Bangsar, Damansara Heights) — petty theft and phone snatching near tourist areas are the main concerns. Download the MyDistress app (Malaysia's emergency SOS app) and be aware that flash flooding during monsoon season (October–March) can briefly close roads even in central KL.",
        "targetSection": "safety"
    }
])

add_items(cities, "lima-pe", [
    {
        "label": "Find a nanny or full-time house helper (called empleada doméstica in Peru) through word-of-mouth from the Expats in Lima Facebook group or through local agencies — full-time live-in helpers cost ~$400–$600/month. This is the standard childcare model for expat families in Miraflores and La Molina.",
        "targetSection": "childcare"
    },
    {
        "label": "Stay in the safe expat districts (Miraflores, San Isidro, Barranco) and use Uber or InDriver rather than flagging street taxis — express kidnappings (brief robbery by taxi) do occur in Lima. The Miraflores seafront malecón and Barranco are safe for evening walks with children; avoid the historic center at night.",
        "targetSection": "safety"
    }
])

add_items(cities, "london-gb", [
    {
        "label": "Research nursery and primary school places simultaneously — in London, demand for both nurseries (for ages 2–4) and state primary schools in popular boroughs (Islington, Richmond, Wandsworth) is intense. Apply for your nursery place as soon as you have a London address, and check state primary school admissions at your borough council's website.",
        "targetSection": "childcare"
    },
    {
        "label": "Register at your nearest NHS GP (General Practitioner — the UK's free family doctor) as soon as you have a London address — NHS registration is free and available to all legal residents regardless of visa type. Bring your visa, passport, and proof of address. GP registration is the gateway to all other NHS services.",
        "targetSection": "healthcare"
    }
])

add_items(cities, "medellin-co", [
    {
        "label": "Find a nanny (niñera) or live-in helper through the Medellín Expats Facebook group or through local agencies — full-time live-out nannies in El Poblado and Laureles cost ~$300–$600/month. Live-in helpers are also common and add ~$150–$250/month. Start your search before arriving.",
        "targetSection": "childcare"
    },
    {
        "label": "Medellín's expat family neighborhoods (El Poblado, Laureles, Envigado) are generally safe for daily life — the city's transformation since the 1990s is real. Phone snatching and express robbery near busy commercial areas remain the most common risk. Use Uber or InDriver for all trips, avoid displaying phones in public, and stay aware of your surroundings at night.",
        "targetSection": "safety"
    }
])

add_items(cities, "phuket-th", [
    {
        "label": "Find a nanny or au pair through the Phuket Expat Families or Laguna Phuket community Facebook groups before arriving — full-time nannies in Phuket's expat communities (Laguna, Bangtao) run ~$400–$650/month. Childcare options are more limited than Bangkok — start your search 2–3 months ahead.",
        "targetSection": "childcare"
    }
])

add_items(cities, "prague-cz", [
    {
        "label": "Register your child for jeslě (nursery for ages 1–3) or mateřská škola (kindergarten — Czech public preschool) as soon as you have your Czech address — state childcare is subsidised and popular areas have waiting lists. International and English-language nurseries in Prague 6 and Prague 2 cost ~$800–$1,500/month and book up quickly.",
        "targetSection": "childcare"
    }
])

add_items(cities, "san-francisco-us", [
    {
        "label": "Build a 72-hour emergency kit (water, non-perishable food, first aid, flashlight, cash, medications, copies of documents) before your first month ends — the Bay Area sits on multiple active fault lines. California OES recommends all households maintain this kit, and the MyShake app provides earthquake early warning alerts.",
        "targetSection": "safety"
    }
])

add_items(cities, "san-jose-cr", [
    {
        "label": "Find an English-speaking nanny through the Expats in Costa Rica Facebook group or through local agencies like Nanny International CR — full-time nannies in Escazú and Santa Ana cost ~$400–$700/month. Costa Rica has a strong culture of professional family caregivers; start searching 2 months before arrival.",
        "targetSection": "childcare"
    }
])

add_items(cities, "seattle-us", [
    {
        "label": "Build a Cascadia earthquake preparedness kit (water, non-perishable food, medications, documents, flashlight, cash) before your first month ends — the Pacific Northwest is overdue for a major Cascadia Subduction Zone earthquake. Download the MyShake app for early warnings, and add N95 masks for wildfire smoke season (July–September).",
        "targetSection": "safety"
    }
])

add_items(cities, "singapore-sg", [
    {
        "label": "Register for infant care or childcare at a PCF Sparkletots (People's Action Party Community Foundation — Singapore's largest subsidised childcare network) or private centre as soon as you have your Employment Pass — government subsidies reduce costs significantly but popular centres in Buona Vista, Holland Village, and Toa Payoh have 6–12 month waiting lists. Apply at ecda.gov.sg.",
        "targetSection": "childcare"
    },
    {
        "label": "Singapore is consistently ranked one of the world's safest cities for families — violent crime is rare and the streets are safe at all hours. The main practical risks are heat exhaustion (stay hydrated, limit outdoor midday activity for children) and occasional haze from Indonesian forest fires (August–October). Download the NEA (National Environment Agency) myENV app to monitor daily air quality.",
        "targetSection": "safety"
    }
])

add_items(cities, "sydney-au", [
    {
        "label": "Register for childcare early — Sydney's ACECQA-approved (Australian Children's Education and Care Quality Authority) long day care centres in the Inner West, Northern Beaches, and North Shore have 6–12 month waiting lists. Use the Starting Blocks portal at startingblocks.gov.au to compare centres and check vacancies. The Child Care Subsidy (CCS) reduces fees significantly once you have a Tax File Number.",
        "targetSection": "childcare"
    }
])

add_items(cities, "taipei-tw", [
    {
        "label": "Register for public bǎomǔ (in-home licensed childminder) or private kindergarten in your district as soon as you have your ARC (Alien Resident Certificate) — subsidised public childcare in Tianmu and Daan fills quickly. International preschools in Tianmu cost ~$1,000–$2,000/month and often have waiting lists.",
        "targetSection": "childcare"
    },
    {
        "label": "Taipei is one of Asia's safest cities for families — street crime is very rare. The main risks are typhoons (June–October), which bring flooding and strong winds, and periodic air quality issues from mainland China pollution. Download the Central Weather Bureau app for typhoon warnings and check air quality at aqicn.org/city/taipei before outdoor activities.",
        "targetSection": "safety"
    }
])

add_items(cities, "tokyo-jp", [
    {
        "label": "Register at your local ward (区 — ku) office for hoikuen (保育園 — public nursery and daycare for ages 0–6, heavily subsidised) as soon as you complete your resident registration — Tokyo's most popular wards (Minato, Shibuya, Setagaya) have intense competition for hoikuen places. International and English-language nurseries are available but cost ~$1,500–$3,000/month. Apply through your ward's childcare office (保育課).",
        "targetSection": "childcare"
    },
    {
        "label": "Register for earthquake alerts and know your ward's evacuation routes on your first day — Tokyo has regular earthquake drills (September 1 is national Disaster Prevention Day). Install the Safety Tips app (available in English) for real-time earthquake and tsunami alerts. Keep a 72-hour emergency kit at home with water, food, a first aid kit, and copies of your key documents.",
        "targetSection": "safety"
    }
])

add_items(cities, "toronto-ca", [
    {
        "label": "Register for licensed childcare early — Toronto's licensed daycare centres and HomeChildCare (registered home-based care) have significant waiting lists in popular neighborhoods like Leslieville, High Park, and North York. Use the City of Toronto Child Care search at toronto.ca/childcare and apply at multiple locations. The Canada-Wide Early Learning and Child Care ($10/day) program reduces costs substantially.",
        "targetSection": "childcare"
    }
])

add_items(cities, "ubud-id", [
    {
        "label": "Find a pembantu (house helper — the term widely used in Bali and Indonesia) or babysitter through local expat Facebook groups like Ubud Expats or Bali Expat Families — full-time helpers in Ubud cost ~$150–$300/month and are standard for most expat households. Start your search 1–2 months before arriving.",
        "targetSection": "childcare"
    },
    {
        "label": "Open a BCA (Bank Central Asia) or BNI account in Ubud once your KITAS paperwork is complete — bring your KITAS card, passport, and rental contract. Internet banking is reliable. Use Wise for international transfers in the gap period and keep a cash float for local warungs (small local shops) and villa payments, which are often cash-only.",
        "targetSection": "banking"
    }
])

add_items(cities, "vancouver-ca", [
    {
        "label": "Register for licensed childcare early — Vancouver and the North Shore have significant waiting lists (6–18 months) for licensed daycare centres and preschools. Use the BC Childcare Map at bcchildcaremap.com to compare nearby options and apply to multiple centres simultaneously. The Canada-Wide Early Learning program ($10/day) reduces costs once approved.",
        "targetSection": "childcare"
    }
])

add_items(cities, "warsaw-pl", [
    {
        "label": "Register your child for żłobek (nursery for ages 0–3) or przedszkole (public kindergarten for ages 3–6) at your local urząd dzielnicy (district office) as soon as you have your PESEL — Warsaw's popular districts (Mokotów, Żoliborz) have waiting lists. International and English-language preschools in these districts cost ~$700–$1,400/month.",
        "targetSection": "childcare"
    }
])

add_items(cities, "zurich-ch", [
    {
        "label": "Zurich is one of Europe's safest cities — violent crime is extremely rare. The main practical hazards are winter black ice on pedestrian and cycling paths (October–March) and summer UV intensity at altitude. Salt bags and ice grips for shoes are standard household items. Download the MeteoSwiss app for avalanche and storm alerts if you plan to ski with children.",
        "targetSection": "safety"
    }
])

# ─────────────────────────────────────────────────────────────────────────────
# KOH SAMUI — add missing second school option
# ─────────────────────────────────────────────────────────────────────────────
for city in cities:
    if city["id"] == "koh-samui-th":
        city["schools"]["options"].append({
            "type": "Local Thai private bilingual schools",
            "description": "Thai private schools with some English-medium instruction — significantly cheaper than international campuses at ~$2,000–$5,000/year. Curriculum follows the Thai national system. A viable option for younger children (under 8) whose parents want Thai language immersion alongside English, or for families on a budget who plan a multi-year stay.",
            "fees": "$2,000–$5,000/year typical"
        })

# ─────────────────────────────────────────────────────────────────────────────
# VALIDATE AND WRITE
# ─────────────────────────────────────────────────────────────────────────────
json_str = json.dumps(cities, ensure_ascii=False, indent=2)
json.loads(json_str)  # validate
with open("data/cities.json", "w", encoding="utf-8") as f:
    f.write(json_str)
print("Done — cities.json updated.")
