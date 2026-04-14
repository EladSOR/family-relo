#!/usr/bin/env python3
"""One-off: insert 5 Costa Rica destination pages cloned from san-jose-cr template."""
import json
from copy import deepcopy
from typing import List, Optional, Tuple
from urllib.parse import quote_plus

with open("data/cities.json", "r", encoding="utf-8") as f:
    cities = json.load(f)

idx = next(i for i, c in enumerate(cities) if c.get("id") == "san-jose-cr")
base = deepcopy(cities[idx])


def visa_for_city(scout_line: str):
    v = deepcopy(base["visa"])
    v["options"][0]["details"][3] = scout_line
    return v


def residency_block():
    return deepcopy(base["residency"])


def banking_with_extra(extra: Optional[List[str]]):
    b = deepcopy(base["banking"])
    if extra:
        b["items"] = b["items"][:2] + extra + b["items"][2:]
    return b


def housing_block(
    summary: str,
    best_areas: list[str],
    intro2: str,
    intro3: str,
    fb_search_q: str,
    typical_prices: list[str],
    what_rent: list[str],
):
    portals = deepcopy(base["housing"]["searchPortals"])
    q = quote_plus(f"{fb_search_q} Facebook group")
    portals[-1] = {
        "label": f"Facebook groups — search: '{fb_search_q}' for local community listings",
        "url": f"https://www.google.com/search?q={q}",
        "isVerified": True,
    }
    return {
        "status": "estimated",
        "summary": summary,
        "bestAreas": best_areas,
        "searchPortalsIntro": [
            "These are Costa Rica's main long-term rental platforms — this is where residents rent long-term housing (cheaper than Airbnb).",
            intro2,
            intro3,
        ],
        "searchPortals": portals,
        "typicalPrices": typical_prices,
        "whatYouNeedToRent": what_rent,
    }


def std_checklist(extra: List[Tuple[str, str]]):
    out = [
        {
            "label": "Check your entry rules — citizens of the US, EU, UK, Canada, and Australia enter Costa Rica visa-free for up to 90 days; most Western passport holders do not need a visa in advance",
            "targetSection": "visa",
        },
        {
            "label": "Remote workers earning $3,000/month or more: apply for Costa Rica's Digital Nomad Visa (Visa de Trabajo para Nomadas Digitales) at the Costa Rican Consulate before or shortly after arriving",
            "targetSection": "visa",
        },
    ]
    for label, sec in extra:
        out.append({"label": label, "targetSection": sec})
    return out


def sources_cost(label: str, url: str):
    return {
        "visa": deepcopy(base["sources"]["visa"]),
        "schools": [],
        "cost": [{"label": label, "url": url, "isVerified": True}],
    }


def make_city(**kw):
    o = deepcopy(base)
    o["id"] = kw["id"]
    o["citySlug"] = kw["citySlug"]
    o["city"] = kw["city"]
    o["tagline"] = kw["tagline"]
    o["summary"] = kw["summary"]
    o["lastReviewed"] = "2026-04"
    o["actionChecklist"] = kw["actionChecklist"]
    o["familyFit"] = {"bestFor": kw["bestFor"], "watchOutFor": kw["watchOutFor"]}
    o["visa"] = visa_for_city(kw["visa_scout_line"])
    o["residency"] = residency_block()
    o["banking"] = banking_with_extra(kw.get("banking_extra"))
    o["housing"] = housing_block(**kw["housing"])
    o["schools"] = kw["schools"]
    o["childcare"] = kw["childcare"]
    o["healthcare"] = kw["healthcare"]
    o["safety"] = kw["safety"]
    o["cost"] = kw["cost"]
    o["sources"] = sources_cost(kw["cost_label"], kw["cost_url"])
    o["communityLinks"] = kw["communityLinks"]
    faq_name = kw["faq_city_name"]
    o["faq"] = [
        {"question": f"Is {faq_name} good for families?", "answer": kw["faq"][0]},
        {"question": "How much does a family typically need per month here?", "answer": kw["faq"][1]},
        {"question": "Is housing hard to find here?", "answer": kw["faq"][2]},
        {"question": "Do children need international school here, or can local schools work?", "answer": kw["faq"][3]},
        {"question": "Is healthcare easy to access as a newcomer?", "answer": kw["faq"][4]},
        {"question": f"Do you need a car in {faq_name}?", "answer": kw["faq"][5]},
        {"question": "How difficult is the paperwork and bureaucracy after moving?", "answer": kw["faq"][6]},
        {"question": "What usually surprises families after arrival?", "answer": kw["faq"][7]},
    ]
    return o


NUMBEO_CR = (
    "Costa Rica cost of living — Numbeo (national reference)",
    "https://www.numbeo.com/cost-of-living/country_result.jsp?country=Costa+Rica",
)

what_std = deepcopy(base["housing"]["whatYouNeedToRent"])

new = []

# --- Tamarindo ---
new.append(
    make_city(
        id="tamarindo-cr",
        citySlug="tamarindo",
        city="Tamarindo",
        tagline="Guanacaste's best-known beach town — surf, sunsets, and a large foreign-resident scene",
        summary="Tamarindo is a Pacific beach town in Guanacaste province — hot and dry much of the year, with a strong tourism economy and a long-standing expat community. Families come for beach life, international schooling options spread across the province (often with driving), and Liberia's airport (LIR — Daniel Oduber Quirós International Airport) within about an hour. Trade-offs are high seasonality, beach-town prices, petty theft in busy areas, and less concentrated school choice than the Central Valley.",
        actionChecklist=std_checklist(
            [
                (
                    "Start housing 6–8 weeks before arrival — Tamarindo and Playa Langosta fill fast in high season; confirm whether rent is quoted in US dollars or colones",
                    "housing",
                ),
                (
                    "Apply to bilingual or international programmes early — Guanacaste spots are fewer than San Jose; many families plan school before locking housing",
                    "schools",
                ),
                (
                    "Arrange IPMI — International Private Medical Insurance — before arrival; use San Jose private hospitals (CIMA, Clínica Bíblica) for complex care and know the route to Liberia for regional emergencies",
                    "healthcare",
                ),
                (
                    "Apply for your DIMEX (Documento de Identidad Migratoria para Extranjeros — Costa Rica's official foreign resident ID card) after your visa is approved — required for banking and long-term services",
                    "residency",
                ),
                (
                    "Open a Costa Rican bank account (BAC Credomatic or Banco Nacional) after receiving your DIMEX — many landlords expect local payment rails",
                    "banking",
                ),
                (
                    "Line up childcare early — fewer English-speaking daycares than the Central Valley; nannies often sourced through community referrals",
                    "childcare",
                ),
                (
                    "Watch ocean safety with children — rip currents and surf breaks are a real daily risk; teach beach rules before you arrive",
                    "safety",
                ),
            ]
        ),
        bestFor=[
            "Families who want Pacific beach life with an established foreign-resident community and English widely heard in shops and services",
            "Parents comfortable driving children to school elsewhere in Guanacaste or coordinating transport — beach towns rarely put every service within walking distance",
            "Remote workers using Liberia (LIR) airport for US connections while basing in a coastal town",
            "Families prioritising surf, nature, and outdoor life over big-city infrastructure",
        ],
        watchOutFor=[
            "Tourism-driven pricing — rents spike in high season and short-term competition pushes up long-term costs",
            "School logistics — bilingual and international options exist in the region but are not as dense as Escazú / Santa Ana; expect commutes or waitlists",
            "Heat and sun — Guanacaste is hotter and drier than the Central Valley; young children and outdoor workers need shade and hydration routines",
            "Petty theft and unattended items — busy beach strips and parked cars are common targets; lock up surf gear and bags",
        ],
        visa_scout_line="Good use: scout Tamarindo and Playa Langosta for housing, confirm Guanacaste school commutes, and apply for your Digital Nomad Visa before your 90-day entry window becomes tight.",
        banking_extra=[
            "Beach-town banking is branch-limited — BAC and Banco Nacional operate in larger Guanacaste towns; confirm cash and wire cut-off times during holidays",
        ],
        housing=dict(
            summary="Tamarindo and Playa Langosta are the main family-oriented beach strips — walkable cores with the most inventory. Villarreal and Huacas nearby offer slightly lower rents with a short drive. Long-term listings appear on the same national platforms as San Jose; many landlords quote rent in US dollars.",
            best_areas=[
                "Tamarindo centro",
                "Playa Langosta",
                "Huacas / Villarreal (inland)",
                "Playa Grande area (across the estuary)",
                "Brasilito / Flamingo corridor (within driving distance)",
            ],
            intro2="Search 'Tamarindo' or 'Langosta' inside each platform to filter local listings.",
            intro3="Tip: book a short furnished stay while you visit schools and confirm commute times — dry-season dust and rainy-season mud both affect daily routes.",
            fb_search_q="Tamarindo Costa Rica expats housing",
            typical_prices=[
                "2-bed near Tamarindo beach: $1,400–$2,200/month",
                "3-bed house with pool, Tamarindo / Langosta: $2,200–$3,500/month",
                "Inland 10–15 min drive (Villarreal / Huacas): $1,100–$1,800/month",
                "Short-stay furnished (while you search): often $2,500–$4,500/month in peak season",
            ],
            what_rent=what_std,
        ),
        schools=dict(
            status="curated",
            searchContext="in Tamarindo, Langosta, and greater Guanacaste (Flamingo, Huacas, Liberia area), Costa Rica",
            summary="Guanacaste has a smaller set of bilingual and international-style programmes relative to the Central Valley — families often choose based on commute tolerance and start dates rather than walking-distance convenience. Apply as early as you can.",
            publicSystem=base["schools"]["publicSystem"],
            internationalOptions="English-Spanish bilingual and US-style programmes exist in the province but are spread out — expect driving between Tamarindo, the Flamingo–Potrero corridor, and sometimes Liberia. Fees are broadly similar to Costa Rica's private sector nationally but vary by campus.",
            languageNotes=base["schools"]["languageNotes"],
            tip="Confirm school placement before signing a 12-month beach lease — Guanacaste waitlists and daily drives surprise families who assume a single neighbourhood has everything.",
            options=[
                {
                    "type": "Bilingual private schools (English/Spanish)",
                    "description": "Smaller selection than the Central Valley — often a drive from Tamarindo. Check start dates and bus routes before you move.",
                    "fees": "$6,000–$14,000/year typical",
                },
                {
                    "type": "International-style / US curriculum programmes",
                    "description": "Available in pockets across Guanacaste — compare commutes from Tamarindo versus moving closer to a campus.",
                    "fees": "$8,000–$16,000/year typical",
                },
                {
                    "type": "Costa Rican public schools",
                    "description": "Spanish-medium state schools exist locally; English support is limited for older children unless they already speak Spanish.",
                    "fees": "Free",
                },
            ],
        ),
        childcare=dict(
            status="estimated",
            summary="Private daycares and preschools exist in Tamarindo but English-speaking staff are less guaranteed than in Escazú — start early and ask other parents for vetted referrals.",
            daycareItems=[
                "Private guarderías and kinders serve young children — bilingual coverage varies; visit in person before paying deposits",
                "CEN-CINAI (Centro de Educación y Nutrición — Costa Rica's state early childhood centres) are rarely the practical route for new arrivals without DIMEX and local qualifying paperwork",
                "Typical private preschool monthly fees in beach towns are often $350–$700 — higher than many Central Valley towns for comparable facilities",
                "Rainy-season flooding on side roads can delay pickups — choose caregivers with predictable hours",
            ],
            nannyItems=[
                "Full-time niñera (nanny): often $600–$1,000/month in Guanacaste beach towns — higher than the Central Valley for experienced bilingual carers",
                "Part-time nanny: roughly $5–$9/hr depending on English and references",
                "Many families share referrals through school WhatsApp groups rather than anonymous online ads",
                "Start 6–8 weeks ahead — peak tourist season overlaps with caregiver shortages",
            ],
            whereToFindItems=[
                "Search 'Expats in Costa Rica' on Google — national group threads often include Tamarindo caregiver recommendations",
                "ConMuchoGusto.net — Costa Rica classifieds; verify references in person before hiring",
                "Ask at your chosen school office — administrators usually know which nannies already pass school gates safely",
            ],
        ),
        healthcare=dict(
            status="estimated",
            tip="For serious or specialist paediatric issues, plan transfers to private hospitals in San Jose — beach clinics stabilise emergencies but complex care concentrates in the capital.",
            items=[
                "CAJA (Caja Costarricense de Seguro Social — Costa Rica's public healthcare system) works the same nationally once you have DIMEX — enrolment is handled through your local CAJA office, not the beach town hall",
                "Day-to-day private care exists in Tamarindo / Huacas for minor issues; Liberia (~1 hour) offers more specialist capacity for urgent imaging and admissions",
                "San Jose private hospitals (CIMA Hospital and Clinica Biblica) remain the reference for complex surgery and paediatric subspecialties — budget time and transport",
                "International private medical insurance (IPMI) is strongly recommended — air-ambulance clauses matter if you want San Jose-level care without paying out of pocket",
                "Pharmacies (farmacias) stock most routine medicines; carry prescriptions translated to Spanish for borderline-controlled drugs",
            ],
        ),
        safety=dict(
            status="estimated",
            score=77,
            summary="Tamarindo is broadly manageable for attentive families — the main issues are petty theft in busy tourist strips and water safety on the beach.",
            items=[
                "Violent crime is relatively uncommon in family residential pockets — most problems are theft from cars, villas, and unattended bags on the sand",
                "Rip currents and surf impact are the #1 injury risk — swim only where locals swim and teach children flag systems",
                "Night driving on unlit coastal roads — wildlife and pedestrians appear suddenly; avoid rushing after dark",
                "Dust in dry season and mud in rainy season affect scooters and walking paths — plan footwear and stroller routes",
                "Tourism crowds bring opportunistic theft — treat phones and laptops like you would in any busy resort town",
            ],
        ),
        cost=dict(status="estimated", rentRange="~$2,200 / month", familyDinner="~$48", nannyRate="~$8 / hr"),
        cost_label=NUMBEO_CR[0],
        cost_url=NUMBEO_CR[1],
        communityLinks=[
            {
                "label": "Search 'Tamarindo Costa Rica families' on Google — community threads for school and housing leads",
                "searchQuery": "Tamarindo Costa Rica families Facebook",
                "url": "https://www.google.com/search?q=Tamarindo+Costa+Rica+families+Facebook+group",
                "isVerified": True,
            },
            {
                "label": "Search 'Expats in Costa Rica' on Google — national group with Guanacaste sub-threads",
                "searchQuery": "Expats in Costa Rica Facebook group",
                "url": "https://www.google.com/search?q=Expats+in+Costa+Rica+Facebook+group",
                "isVerified": True,
            },
        ],
        faq_city_name="Tamarindo",
        faq=[
            "Yes — for families who prioritise beach life and accept driving for schools and some healthcare. Trade-offs are tourism pricing, heat, and thinner services than the Central Valley.",
            "Budget roughly $4,500–$7,500/month all-in for a family of four depending on housing tier, school fees, and insurance — Guanacaste can feel expensive in peak season.",
            "Competitive in high season — start early, use the same national platforms as San Jose, and verify whether quotes include utilities and HOA (homeowners association) fees.",
            "Public schools are Spanish-medium; many expat families choose bilingual private programmes regionally — plan placement and transport before you move.",
            "Routine private care is available locally; complex cases still route to San Jose private hospitals — carry IPMI that covers transfers you are comfortable with.",
            "Yes — school runs, grocery hauls, and Guanacaste heat make a car the default for most families; distances feel short on a map but take longer on coastal roads.",
            "Same national immigration rules as the rest of Costa Rica — DIMEX appointments still centre on DGME in San Jose; paperwork is Spanish-heavy wherever you live.",
            "How dry and dusty the high season feels — and how much school commutes shape your week when listings look 'close' on a map.",
        ],
    )
)

# --- Heredia ---
new.append(
    make_city(
        id="heredia-cr",
        citySlug="heredia",
        city="Heredia",
        tagline="Central Valley living without San Jose's sprawl — cooler air and a strong commuter link to the capital",
        summary="Heredia is a major Central Valley city north-east of San Jose — spring-like temperatures, real urban services, and lower rents than prime Escazú in many neighbourhoods. Many families live here while using bilingual schools in Heredia, Belén, or the western San Jose suburbs (sometimes with school runs). Trade-offs are traffic on the General Cañas corridor, Spanish-first bureaucracy, and the same DIMEX-driven onboarding as everywhere else in Costa Rica.",
        actionChecklist=std_checklist(
            [
                (
                    "Start housing 4–6 weeks before arrival — compare Heredia centro versus Belén / San Francisco de Heredia for commute time to your chosen school",
                    "housing",
                ),
                (
                    "Apply to bilingual schools early — options exist in Heredia and the western suburbs; confirm morning traffic before you sign a lease",
                    "schools",
                ),
                (
                    "Arrange IPMI before arrival — routine care exists locally; complex cases still funnel to CIMA or Clínica Bíblica in San Jose",
                    "healthcare",
                ),
                (
                    "Apply for your DIMEX (Documento de Identidad Migratoria para Extranjeros — Costa Rica's official foreign resident ID card) after your visa is approved — required for banking and CAJA enrolment",
                    "residency",
                ),
                (
                    "Open a Costa Rican bank account after receiving your DIMEX — BAC Credomatic and Banco Nacional both serve Heredia with branch networks",
                    "banking",
                ),
                (
                    "Book daycare or nanny interviews before peak school intake — Central Valley caregivers are shared across Heredia and Alajuela expat circles",
                    "childcare",
                ),
                (
                    "Plan for earthquake and heavy-rain protocols — the Central Valley shakes occasionally and flash flooding can affect low crossings after storms",
                    "safety",
                ),
            ]
        ),
        bestFor=[
            "Families who want Central Valley climate and services without paying Escazú premiums for every square metre",
            "Parents working in northern San Jose or Alajuela who can tolerate structured commutes when traffic is managed",
            "Those who prefer a more Costa Rican urban feel than gated beach resorts — walkable barrios and local markets still thrive here",
            "Families already considering bilingual schools in the broader metro — Heredia slots into the same ecosystem",
        ],
        watchOutFor=[
            "Rush-hour congestion on routes toward San Jose — school start times and office hours stack on the same roads",
            "Spanish-first paperwork — fewer English-speaking notaries and municipal windows than Escazú; hire bilingual help for property and immigration steps",
            "Noise in denser barrios — buses, motorcycles, and street life can be louder than suburban Escazú",
            "Air quality on still days — valley smog is not unique to Heredia but affects children with respiratory sensitivity",
        ],
        visa_scout_line="Good use: scout Heredia centro, San Francisco de Heredia, and Belén for housing, test school-run times on the General Cañas, and line up your Digital Nomad Visa before tourist entry expires.",
        banking_extra=[
            "Heredia has full-service bank branches — English support is patchier than Escazú; bring a Spanish speaker for account opening day if possible",
        ],
        housing=dict(
            summary="Heredia offers a mix of older centro apartments and newer condominiums toward Belén and Ulloa. Many listings are on the same national platforms as San Jose — search by neighbourhood, not just the city name, because commutes vary block by block.",
            best_areas=[
                "San Francisco de Heredia",
                "Mercedes norte",
                "Belén (Heredia side)",
                "Ulloa",
                "Heredia centro (walkable, bus-linked)",
            ],
            intro2="Search 'Heredia' plus your target barrio (e.g. 'Belén Heredia') inside each platform.",
            intro3="Tip: visit at rush hour once before you sign — the same apartment feels different at 7:30am on school days.",
            fb_search_q="Heredia Costa Rica expats housing",
            typical_prices=[
                "2-bed apartment, Heredia / Belén: $800–$1,300/month",
                "3-bed house or townhouse, outer Heredia: $1,100–$1,800/month",
                "Newer condo with amenities: $1,300–$2,000/month",
                "Short-stay furnished while searching: $1,200–$2,000/month",
            ],
            what_rent=what_std,
        ),
        schools=dict(
            status="curated",
            searchContext="in Heredia, Belén, and greater Central Valley, Costa Rica",
            summary="Heredia sits inside the same bilingual private ecosystem as the wider San Jose metro — some campuses are in Heredia or Belén; others require crossing toward Escazú. Apply early and map traffic, not just distance.",
            publicSystem=base["schools"]["publicSystem"],
            internationalOptions="US-style, IB, and bilingual programmes are available within driving distance — some families prioritise a Heredia-side campus to shorten commutes; others still choose Escazú schools and accept the drive.",
            languageNotes=base["schools"]["languageNotes"],
            tip="Do a dry-run school commute on a Tuesday morning before you commit to a lease — GPS times understate peak congestion.",
            options=[
                {
                    "type": "Bilingual private schools (English/Spanish)",
                    "description": "Several well-regarded options sit in Heredia province — verify bus routes and after-school activities match your work hours.",
                    "fees": "$6,000–$12,000/year typical",
                },
                {
                    "type": "International / IB programmes in the metro",
                    "description": "The same Central Valley inventory San Jose families use — feasible from Heredia if you plan transport carefully.",
                    "fees": "$8,000–$15,000/year typical",
                },
                {
                    "type": "Costa Rican public schools",
                    "description": "Spanish-medium state schools are accessible locally; younger children adapt faster with tutoring support.",
                    "fees": "Free",
                },
            ],
        ),
        childcare=dict(
            status="estimated",
            summary="Daycares and preschools exist across Heredia — bilingual coverage is better than beach towns but still verify staff languages in person.",
            daycareItems=[
                "Private guarderías cluster near Belén and San Francisco — monthly fees often $350–$650 depending on hours and bilingual staff",
                "CEN-CINAI (Centro de Educación y Nutrición — Costa Rica's state early childhood centres) remain difficult for fresh arrivals without full DIMEX paperwork",
                "Tour facilities for earthquake retrofit basics — older buildings vary widely",
                "Align pickup times with rush hour — late fees sting when traffic stalls your route home",
            ],
            nannyItems=[
                "Full-time niñera (nanny): typically $500–$850/month — similar to wider San Jose metro rates",
                "Part-time nanny: roughly $4–$7/hr",
                "Many caregivers commute from Alajuela and Heredia suburbs — confirm punctuality expectations during rainy season",
                "References from school parent networks remain the gold standard",
            ],
            whereToFindItems=[
                "Search 'Expats in Costa Rica' on Google — Heredia families often post caregiver leads in the main national thread",
                "ConMuchoGusto.net — filter for Heredia; interview in person before hiring",
                "Local parent WhatsApp groups through your school — fastest vetted referrals",
            ],
        ),
        healthcare=dict(
            status="estimated",
            tip="Identify whether your preferred paediatrician practises in Heredia, San Jose, or both — split care gets confusing during fevers and vaccinations.",
            items=[
                "CAJA (Caja Costarricense de Seguro Social — Costa Rica's public healthcare system) facilities serve Heredia once you are enrolled through your DIMEX — queues vary by clinic",
                "Private hospitals in San Jose (CIMA Hospital and Clinica Biblica) remain the default for complex admissions — Heredia clinics handle much routine work",
                "Typical private GP visits: roughly $60–$100; specialists in San Jose $100–$200 before insurance reimbursement",
                "IPMI is still the practical bridge before CAJA kicks in cleanly — budget $200–$600/month for a family depending on coverage",
                "Pharmacies are widespread — carry paediatric formulations in Spanish packaging photos so pharmacists can match brands",
            ],
        ),
        safety=dict(
            status="estimated",
            score=78,
            summary="Heredia is broadly similar to the Central Valley — violent crime is not the everyday story for attentive families; traffic and petty theft dominate planning.",
            items=[
                "Violent crime is uncommon in typical family neighbourhoods — most issues are opportunistic theft from vehicles and unsecured yards",
                "Traffic collisions are a major risk — motorbikes filter unpredictably; install proper child seats and avoid phone use while driving",
                "Earthquakes occur — teach children drop-cover-hold and keep emergency water at home",
                "Flash flooding after storms can block low roads between Heredia and San Jose — check Waze and local alerts before school pickup",
                "Street lighting varies — plan walking routes with older children before dark",
            ],
        ),
        cost=dict(status="estimated", rentRange="~$1,400 / month", familyDinner="~$36", nannyRate="~$7 / hr"),
        cost_label=NUMBEO_CR[0],
        cost_url=NUMBEO_CR[1],
        communityLinks=[
            {
                "label": "Search 'Heredia Costa Rica expats' on Google — neighbourhood-specific housing and school threads",
                "searchQuery": "Heredia Costa Rica expats Facebook",
                "url": "https://www.google.com/search?q=Heredia+Costa+Rica+expats+Facebook+group",
                "isVerified": True,
            },
            {
                "label": "Search 'Expats in Costa Rica' on Google — national community with Heredia members",
                "searchQuery": "Expats in Costa Rica Facebook group",
                "url": "https://www.google.com/search?q=Expats+in+Costa+Rica+Facebook+group",
                "isVerified": True,
            },
        ],
        faq_city_name="Heredia",
        faq=[
            "Yes — especially for families who want Central Valley schools and healthcare access with somewhat lower housing pressure than prime Escazú. Trade-offs are commutes and Spanish-first admin outside expat bubbles.",
            "Budget roughly $3,800–$6,000/month all-in for a family of four depending on school tier and housing — generally a bit below premium western-San Jose rents.",
            "Reasonable inventory on national platforms — the hard part is judging commute time, not finding any listing at all.",
            "Public schools are Spanish-medium; bilingual private remains the common expat path — map school location before you sign a lease.",
            "Routine private care is available in Heredia; specialists still cluster in San Jose — same CAJA and IPMI logic as the capital.",
            "Usually yes — even if some errands are walkable, school runs and weekend trips favour a car; public buses work but rarely replace family logistics.",
            "Same national stack — DGME in San Jose for immigration milestones, Spanish contracts for housing, and patience with bank queues.",
            "How much rush hour reshapes your day — a '15 km' school run can eat an hour if timed wrong.",
        ],
    )
)

# --- Atenas ---
new.append(
    make_city(
        id="atenas-cr",
        citySlug="atenas",
        city="Atenas",
        tagline="Small-town Central Valley life — mild weather, tight expat circles, and regular trips to San Jose for services",
        summary="Atenas is a hillside town west of Alajuela known for expat retirees and families seeking a slower pace than San Jose — pleasant temperatures, mountain views, and a compact centro. Daily life leans local and Spanish-forward; international schools and major private hospitals still mean driving toward the western suburbs or San Jose. Trade-offs are winding roads, limited late-night services, and the need to plan errands in bigger towns.",
        actionChecklist=std_checklist(
            [
                (
                    "Rent short-term in Atenas before buying or signing long-term — test the drive to your chosen school and workplace at rush hour",
                    "housing",
                ),
                (
                    "Map bilingual school options before you commit — many Atenas families commute toward Escazú / Santa Ana or Alajuela; confirm bus or car-pool realistic",
                    "schools",
                ),
                (
                    "Keep IPMI that covers San Jose hospitals — local clinics handle basics; paediatric emergencies often move downhill to the metro",
                    "healthcare",
                ),
                (
                    "Apply for your DIMEX (Documento de Identidad Migratoria para Extranjeros — Costa Rica's official foreign resident ID card) on the same national timeline — Atenas does not speed up DGME processing",
                    "residency",
                ),
                (
                    "Plan banking trips — full-service branches cluster in Alajuela and Escazú; mobile banking reduces mountain drives once accounts are open",
                    "banking",
                ),
                (
                    "Ask expat parents for nanny referrals early — fewer agencies than the capital; word-of-mouth dominates",
                    "childcare",
                ),
                (
                    "Drive defensively on mountain roads — fog, trucks, and motorcycles appear suddenly on curves",
                    "safety",
                ),
            ]
        ),
        bestFor=[
            "Families who want a quieter Central Valley base with cooler nights and a strong sense of neighbourhood",
            "Parents comfortable batching metro errands — schools, speciality doctors, and major shopping still pull you toward San Jose or Alajuela",
            "Those prioritising garden space and birdsong over condo towers",
            "Remote workers who do not need daily face time in an office downtown",
        ],
        watchOutFor=[
            "School commutes — bilingual options rarely sit inside Atenas itself; budget car time or bus coordination",
            "Limited evening services — restaurants and clinics close earlier than in Escazú",
            "Mountain weather microclimates — houses higher up can be cooler and foggier than listings suggest",
            "Septic, water, and power quirks on rural lots — due diligence on infrastructure before you buy",
        ],
        visa_scout_line="Good use: stay in Atenas short-term while you test drives to schools and DGME appointments in San Jose — tourist entry buys time to file your Digital Nomad Visa.",
        banking_extra=[
            "ATM and branch visits often mean a run to Alajuela or greater San Jose — open accounts with strong mobile apps once DIMEX clears",
        ],
        housing=dict(
            summary="Inventory mixes traditional Tico houses and newer expat-oriented homes with views. Listings appear on Encuentra24 and Facebook community posts — many properties sit on rural roads, so visit after rain to judge access.",
            best_areas=[
                "Atenas centro",
                "San Isidro de Atenas",
                "Concepción (rural lots)",
                "Jesús (lower elevations, warmer)",
                "Río Grande (greener, more rural)",
            ],
            intro2="Search 'Atenas' and nearby district names inside each platform — spellings vary (Atenas vs Athens listings).",
            intro3="Tip: verify water source (ayA — Costa Rica's public water utility — versus private well) and internet line-of-sight before paying deposits on hillside homes.",
            fb_search_q="Atenas Costa Rica expats housing",
            typical_prices=[
                "2-bed house with garden: $900–$1,400/month",
                "3-bed with views and pool: $1,400–$2,200/month",
                "Furnished short-term while searching: $1,200–$1,900/month",
                "Rural finca (farm property) long-term: highly variable — inspect road grade first",
            ],
            what_rent=what_std,
        ),
        schools=dict(
            status="curated",
            searchContext="in Atenas, Alajuela, and greater Central Valley, Costa Rica",
            summary="Most families commute to bilingual schools in the Alajuela corridor or toward Escazú — local public schools are Spanish-only. Honest planning means measuring drive minutes twice daily, not kilometres alone.",
            publicSystem=base["schools"]["publicSystem"],
            internationalOptions="International and bilingual offerings mirror the wider metro — nothing uniquely 'inside Atenas' at scale; choose based on commute tolerance and bus availability.",
            languageNotes=base["schools"]["languageNotes"],
            tip="If children need continuity with US or IB curricula, secure school seats before optimising for the prettiest mountain view.",
            options=[
                {
                    "type": "Bilingual private schools (English/Spanish)",
                    "description": "Typically reached by car toward Alajuela or the western suburbs — ask about car-pool boards at enrolment",
                    "fees": "$6,000–$12,000/year typical",
                },
                {
                    "type": "International / IB programmes",
                    "description": "Same Central Valley inventory other families use — feasible with a disciplined commute from Atenas",
                    "fees": "$8,000–$15,000/year typical",
                },
                {
                    "type": "Costa Rican public schools",
                    "description": "Local escuelas are Spanish-medium; younger children can integrate with tutoring if parents speak Spanish at home",
                    "fees": "Free",
                },
            ],
        ),
        childcare=dict(
            status="estimated",
            summary="Fewer standalone daycare centres than San Jose — many families hire nannies who commute from Alajuela or share au-pair-style arrangements within the expat community.",
            daycareItems=[
                "Small private guarderías exist — visit for licencing basics and child-to-staff ratios",
                "CEN-CINAI (Centro de Educación y Nutrición — Costa Rica's state early childhood centres) follow the same DIMEX barriers as elsewhere",
                "Mountain roads complicate midday pickups — align caregiver location with your route, not straight-line distance",
                "Power cuts affect some rural zones — ask if backup water pumps exist",
            ],
            nannyItems=[
                "Full-time niñera (nanny): $500–$850/month — similar to metro rates but fewer candidates; start search early",
                "Part-time help: $4–$7/hr",
                "Live-in arrangements appear — contract and social insurance (INS — Instituto Nacional de Seguros) obligations need a bilingual lawyer review",
                "Rainy season lateness is cultural — build buffer into work calls",
            ],
            whereToFindItems=[
                "Search 'Atenas Costa Rica community' on Google — small forums and Facebook groups post caregiver leads",
                "Word-of-mouth through the farmers' market and church communities — still central to hiring in town",
                "ConMuchoGusto.net — filter Alajuela province; interview at the family's home before hiring",
            ],
        ),
        healthcare=dict(
            status="estimated",
            tip="Register with a GP in Alajuela or San Jose for continuity — mountain clinics may rotate doctors seasonally.",
            items=[
                "CAJA (Caja Costarricense de Seguro Social — Costa Rica's public healthcare system) clinics exist regionally — enrolment still depends on DIMEX and contributions through payroll or self-pay",
                "Private urgent issues often mean transport to CIMA or Clinica Biblica in San Jose — plan paediatric fever protocols accordingly",
                "Typical private GP visit $60–$100 in town; imaging and labs may require a drive",
                "IPMI remains essential until CAJA coverage is predictable for your family",
                "Snake and dog-bite awareness on rural properties — teach children paths and footwear rules early",
            ],
        ),
        safety=dict(
            status="estimated",
            score=79,
            summary="Atenas feels calmer than central San Jose — risks skew toward road safety, weather, and property access rather than street violence.",
            items=[
                "Violent crime rates are generally lower than dense urban barrios — most issues are opportunistic theft from unsecured homes",
                "Mountain road visibility — fog, sharp curves, and occasional landslides after storms",
                "Domestic animals on roads — collisions with dogs or cattle happen; drive slowly at dawn and dusk",
                "Wildfire and brushfire smoke in dry months — air quality can dip; sensitive children may need indoor days",
                "Limited street lighting — plan torch routes if children walk after sunset",
            ],
        ),
        cost=dict(status="estimated", rentRange="~$1,200 / month", familyDinner="~$34", nannyRate="~$7 / hr"),
        cost_label=NUMBEO_CR[0],
        cost_url=NUMBEO_CR[1],
        communityLinks=[
            {
                "label": "Search 'Atenas Costa Rica expats' on Google — small community groups for newcomers",
                "searchQuery": "Atenas Costa Rica expats Facebook",
                "url": "https://www.google.com/search?q=Atenas+Costa+Rica+expats+Facebook+group",
                "isVerified": True,
            },
            {
                "label": "Search 'Expats in Costa Rica' on Google — national threads include Atenas families",
                "searchQuery": "Expats in Costa Rica Facebook group",
                "url": "https://www.google.com/search?q=Expats+in+Costa+Rica+Facebook+group",
                "isVerified": True,
            },
        ],
        faq_city_name="Atenas",
        faq=[
            "Yes — for families who value small-town rhythm and can handle drives for schools and specialists. It is quieter than Escazú and less walkable for teen independence.",
            "Budget roughly $3,200–$5,500/month all-in for a family of four — housing can be cheaper than the western suburbs but fuel and school transport add back cost.",
            "Inventory is thinner than San Jose — patience wins; many best homes trade through community word-of-mouth before they hit portals.",
            "Public schools are Spanish-medium; bilingual private usually means commuting — plan realistically before moving.",
            "Basic private care exists nearby; anything complex still points to San Jose hospitals — keep IPMI and transport plans aligned.",
            "Essentially yes — winding roads, grocery runs, and school routes rarely work on buses alone with young children.",
            "Same national bureaucracy — DGME trips to San Jose remain part of life; rural addresses can confuse couriers.",
            "How much driving consolidates into one or two weekly 'city days' — life becomes calendaring errands rather than popping out for one thing.",
        ],
    )
)

# --- Puerto Viejo ---
new.append(
    make_city(
        id="puerto-viejo-cr",
        citySlug="puerto-viejo",
        city="Puerto Viejo",
        tagline="Caribbean Costa Rica — humid, laid-back, and culturally distinct from the Pacific coast",
        summary="Puerto Viejo de Talamanca is a small coastal town on the Caribbean side — Afro-Caribbean and Bri Bri communities, humid tropical weather, and a slower rhythm than Guanacaste. Some English appears in tourism, but Spanish still runs daily life and government. International schooling is limited compared with the Central Valley; serious healthcare often means travel to Limón city or San Jose. Trade-offs are humidity, infrastructure variability, and honest planning for education continuity.",
        actionChecklist=std_checklist(
            [
                (
                    "Book short-term housing before shipping containers — humidity damages poorly ventilated units; inspect for mould and airflow",
                    "housing",
                ),
                (
                    "Decide schooling early — bilingual options are fewer than in San Jose; some families choose online programmes or relocate teens back to the valley",
                    "schools",
                ),
                (
                    "Carry IPMI with evacuation clarity — regional hospitals handle basics; complex paediatric care routes to San Jose",
                    "healthcare",
                ),
                (
                    "Apply for your DIMEX (Documento de Identidad Migratoria para Extranjeros — Costa Rica's official foreign resident ID card) on the national timeline — Limón province follows the same DGME rules",
                    "residency",
                ),
                (
                    "Open bank accounts when visiting San Jose or Limón — Caribbean towns have thinner branch coverage; digital banking matters",
                    "banking",
                ),
                (
                    "Interview nannies with references from long-term residents — tourism churn makes rushed hires risky",
                    "childcare",
                ),
                (
                    "Teach children beach and river safety — rip currents and flash flooding after storms are serious hazards",
                    "safety",
                ),
            ]
        ),
        bestFor=[
            "Families drawn to Caribbean culture, reggae cafés, and bilingual (English-Spanish) exposure in a small-town setting",
            "Parents who accept more DIY education planning — homeschooling pods, online school, or commuting for secondary options",
            "Nature-focused households — wildlife, coral reefs, and jungle reserves are daily backdrops",
            "Those prioritising community scale over international school density",
        ],
        watchOutFor=[
            "Humidity and mould — electronics, musical instruments, and respiratory health need proactive climate control",
            "Limited specialist healthcare — paediatric subspecialties may require San Jose flights or long drives",
            "Slower bureaucracy at distance — couriers and bank letters take longer than in the capital",
            "Tourism income swings — many local jobs follow high season; remote workers should not assume coworking redundancy",
        ],
        visa_scout_line="Good use: rent short-term while you validate schooling plans — Caribbean life charms quickly, but education logistics deserve a clear answer before your 90-day tourist window tightens.",
        banking_extra=[
            "Plan occasional trips to Limón or San Jose for notarised paperwork — local branches may lack English-speaking staff on busy days",
        ],
        housing=dict(
            summary="Inventory ranges from simple Caribbean cottages to newer concrete homes set back from the beach. Long-term rentals appear on national classifieds and community posts — inspect hurricane-season drainage and backup power options.",
            best_areas=[
                "Puerto Viejo centro",
                "Playa Cocles",
                "Punta Uva",
                "Playa Chiquita",
                "Manzanillo (quieter, farther south)",
            ],
            intro2="Search 'Puerto Viejo Talamanca' or 'Limón Caribbean' inside each platform to avoid mixing up other towns named Puerto Viejo.",
            intro3="Tip: visit during a heavy rain week if you can — drainage and road grit become obvious fast.",
            fb_search_q="Puerto Viejo Costa Rica Caribbean housing",
            typical_prices=[
                "1-bed cottage near town: $600–$1,000/month",
                "2–3-bed house with garden: $1,000–$1,800/month",
                "Newer build with AC throughout: $1,500–$2,400/month",
                "Short-stay furnished: $1,400–$2,800/month depending on season",
            ],
            what_rent=what_std,
        ),
        schools=dict(
            status="curated",
            searchContext="in Puerto Viejo de Talamanca, Limón province, and Caribbean Costa Rica",
            summary="Bilingual and small international-style programmes exist but are limited — many families blend local Spanish schools with tutoring, choose online options, or commute to the Central Valley for secondary school. Honesty upfront prevents stranded teenagers without pathways.",
            publicSystem=base["schools"]["publicSystem"],
            internationalOptions="Expect a handful of private bilingual offerings and micro-schools — compare Limón city options versus staying local; high school planning may require creative scheduling or relocation.",
            languageNotes="English appears in tourism, but Spanish still dominates schools and paperwork — bilingual children thrive; monolingual English teens may feel isolated without structured study.",
            tip="Before you move teenagers, confirm exam boards and university pathways — switching countries mid-stream is harder here than in Escazú.",
            options=[
                {
                    "type": "Bilingual / micro-school programmes",
                    "description": "Small cohorts — verify accreditation and teacher turnover before enrolling",
                    "fees": "$4,000–$10,000/year typical (wide variance)",
                },
                {
                    "type": "Costa Rican public schools",
                    "description": "Spanish-medium local escuelas — viable for younger children with parental Spanish support",
                    "fees": "Free",
                },
                {
                    "type": "Online / hybrid schooling",
                    "description": "Common workaround for secondary grades — budget time zones, tutors, and social outlets separately",
                    "fees": "Varies by programme",
                },
            ],
        ),
        childcare=dict(
            status="estimated",
            summary="Daycare options are limited — many parents share carers or import routines from Limón. Cultural fluency matters; screen for reliability during high season when tourism jobs compete for attention.",
            daycareItems=[
                "Small private guarderías exist — inspect hygiene and storm readiness",
                "CEN-CINAI (Centro de Educación y Nutrición — Costa Rica's state early childhood centres) remain hard to access immediately for newcomers",
                "Humidity control in play spaces matters — mould triggers asthma in some children",
                "Backup generators are uneven — ask how caregivers handle power loss",
            ],
            nannyItems=[
                "Full-time niñera (nanny): $450–$800/month — lower base than Escazú but variable skill levels",
                "Part-time: $3–$6/hr — verify references with long-term expats, not only seasonal residents",
                "Live-out helps may rely on buses — weather can delay arrivals",
                "Discuss holiday pay clearly — Caribbean high season overlaps with caregiver travel home to other provinces",
            ],
            whereToFindItems=[
                "Search 'Puerto Viejo Costa Rica families' on Google — small groups coordinate swaps and nanny shares",
                "Ask at bilingual schools and yoga studios — informal job boards still work here",
                "Limón city Facebook groups — wider caregiver pool willing to commute for higher wages",
            ],
        ),
        healthcare=dict(
            status="estimated",
            tip="Know the route to Hospital Dr. Tony Facio Castro in Limón for regional emergencies — confirm ambulance response times with neighbours.",
            items=[
                "CAJA (Caja Costarricense de Seguro Social — Costa Rica's public healthcare system) facilities serve Limón province — enrolment still requires DIMEX and monthly contributions",
                "Complex paediatric cases transfer to San Jose private hospitals — travel time and cost belong in your insurance policy",
                "Dengue and other mosquito-borne illnesses require proactive repellent routines — paediatricians emphasise prevention",
                "IPMI with medevac language is strongly recommended for families uncomfortable with regional limitations",
                "Pharmacies stock basics; specialised paediatric formulations may need San Jose pharmacies",
            ],
        ),
        safety=dict(
            status="estimated",
            score=76,
            summary="Puerto Viejo is manageable for aware families — focus on water safety, petty theft in tourist strips, and respectful engagement with local communities.",
            items=[
                "Petty theft from bikes and hostel-adjacent housing happens — upgrade locks and avoid displaying electronics on patios",
                "Rip currents and river flash flooding are serious — supervise children closely after storms",
                "Road safety on the coastal highway — bicycles and pedestrians share narrow shoulders with trucks",
                "Cultural sensitivity matters — Afro-Caribbean and Indigenous Bri Bri communities deserve respectful behaviour from newcomers",
                "Night walking without lights — plan torch-lit routes and group travel after dark",
            ],
        ),
        cost=dict(status="estimated", rentRange="~$1,400 / month", familyDinner="~$40", nannyRate="~$6 / hr"),
        cost_label=NUMBEO_CR[0],
        cost_url=NUMBEO_CR[1],
        communityLinks=[
            {
                "label": "Search 'Puerto Viejo Costa Rica families' on Google — Caribbean-specific threads",
                "searchQuery": "Puerto Viejo Costa Rica families Facebook",
                "url": "https://www.google.com/search?q=Puerto+Viejo+Costa+Rica+families+Facebook+group",
                "isVerified": True,
            },
            {
                "label": "Search 'Expats in Costa Rica' on Google — filter threads mentioning Talamanca or Limón",
                "searchQuery": "Expats in Costa Rica Facebook group",
                "url": "https://www.google.com/search?q=Expats+in+Costa+Rica+Facebook+group",
                "isVerified": True,
            },
        ],
        faq_city_name="Puerto Viejo",
        faq=[
            "It can be — for families who love the Caribbean culture and can solve schooling creatively. It is harder for families who expect Escazú-level international school density.",
            "Budget roughly $3,500–$6,000/month all-in depending on housing AC usage, school path, and insurance — humidity and travel add hidden costs.",
            "Moderate inventory — uniqueness beats volume; inspect mould, power, and drainage in person.",
            "Public schools are Spanish-medium; bilingual private is limited — many families blend approaches or use online secondary programmes.",
            "Basic care exists locally; specialists concentrate in San Jose — align insurance with realistic evacuation paths.",
            "Bicycles work for some errands but school runs and wet-season roads push most families toward a rugged vehicle.",
            "Same national rules — but distance from San Jose makes every paperwork hiccup feel slower; courier timing matters.",
            "How intense humidity feels year-round — and how much education planning differs from Pacific coast expat towns.",
        ],
    )
)

# --- Santa Teresa ---
new.append(
    make_city(
        id="santa-teresa-cr",
        citySlug="santa-teresa",
        city="Santa Teresa",
        tagline="Nicoya Peninsula surf strip — remote beach life with a serious road-access learning curve",
        summary="Santa Teresa is a beach community on the southern Nicoya Peninsula — known for surf, steep dirt roads, and a younger expat scene that now includes some families. It sits far from San Jose: expect long drives or combined ferry plus driving. Schooling and paediatric depth cannot match the Central Valley — many families plan homeschooling, online programmes, or boarding school options for secondary years. Trade-offs are cost inflation, power and water quirks, and medical evacuation planning.",
        actionChecklist=std_checklist(
            [
                (
                    "Rent before you buy — test the unpaved roads in both dry and rainy seasons; 4x4 is often essential, not optional",
                    "housing",
                ),
                (
                    "Lock education strategy before arrival — small local programmes exist but high-school pathways usually need creative planning (online, relocation to the valley, or international boarding)",
                    "schools",
                ),
                (
                    "Carry IPMI that explicitly covers medevac to San Jose — stabilisation may happen locally; definitive care is hours away",
                    "healthcare",
                ),
                (
                    "Apply for your DIMEX (Documento de Identidad Migratoria para Extranjeros — Costa Rica's official foreign resident ID card) through the same DGME process — living remotely does not waive appointments in San Jose",
                    "residency",
                ),
                (
                    "Use digital banking heavily — branch visits mean Cobano, Puntarenas, or San Jose; plan cash needs during festivals when ATMs run dry",
                    "banking",
                ),
                (
                    "Source childcare through long-term resident referrals — tourism churn makes rushed nanny hires risky",
                    "childcare",
                ),
                (
                    "Treat surf and rip currents as daily risk management — formal lifeguard coverage is limited compared with Tamarindo",
                    "safety",
                ),
            ]
        ),
        bestFor=[
            "Surf-focused families who want ocean-front routines and can handle logistical spartan charm",
            "Parents with flexible education plans — online school, world-schooling, or split residence with the Central Valley",
            "Remote workers who thrive with coworking + early mornings and accept unreliable power as a planning problem",
            "Families prioritising nature and tight-knit expat circles over shopping malls",
        ],
        watchOutFor=[
            "Road access — river crossings and steep grades can interrupt supply runs during storms",
            "Higher cost per amenity — groceries and imports arrive over long supply chains",
            "Limited paediatric depth — chronic conditions need a San Jose strategy",
            "Noise and nightlife in parts of the strip — acoustic mismatch with early bedtimes for young kids",
        ],
        visa_scout_line="Good use: stay on tourist entry only long enough to validate roads, schools, and insurance — file your Digital Nomad Visa before remote logistics trap you without DIMEX.",
        banking_extra=[
            "Nearest meaningful branches sit in Cobano or across the gulf — schedule banking around ferry timetables during rainy season",
        ],
        housing=dict(
            summary="Santa Teresa blends Mal País and Playa Carmen listings in practice — search both town names. Many homes perch on hills for breeze; others sit near noisy beach bars — visit at night before signing.",
            best_areas=[
                "North Santa Teresa strip",
                "Playa Carmen",
                "Mal País (quieter southern end)",
                "Hillside above the strip (breeze, quieter nights)",
                "Cobano (inland services, not walking distance to surf)",
            ],
            intro2="Search 'Santa Teresa' and 'Mal Pais' inside each platform — listings split across spellings.",
            intro3="Tip: ask whether water is from ayA (Costa Rica's public water utility) or private tanks — pressure and filtration needs change with both.",
            fb_search_q="Santa Teresa Costa Rica Mal Pais housing",
            typical_prices=[
                "1-bed near the beach: $1,200–$2,000/month",
                "2–3-bed with pool: $2,200–$3,800/month",
                "Inland toward Cobano: $900–$1,500/month with longer drives",
                "Short-stay peak season surcharges: add 30–60% over long-term rates",
            ],
            what_rent=what_std,
        ),
        schools=dict(
            status="curated",
            searchContext="in Santa Teresa, Mal Pais, Cobano, and Nicoya Peninsula, Costa Rica",
            summary="Micro-schools and bilingual primary options exist but thin out for secondary grades — brutally honest planning is kindness. Families often combine local early years with online middle/high school or eventual relocation to the Central Valley for diploma continuity.",
            publicSystem=base["schools"]["publicSystem"],
            internationalOptions="Do not expect Escazú-style choice — verify accreditation, teacher retention, and exam pathways. Older teens frequently need boarding, online AP/IB substitutes, or family moves.",
            languageNotes=base["schools"]["languageNotes"],
            tip="Interview schools with the same rigour you would use for a mountain road easement — education promises here require verification.",
            options=[
                {
                    "type": "Small bilingual primary programmes",
                    "description": "Visit classrooms, ask for turnover stats, and meet the actual teacher who will teach your child next year",
                    "fees": "$5,000–$11,000/year typical (varies widely)",
                },
                {
                    "type": "Online / hybrid secondary schooling",
                    "description": "Common path — budget tutors, social clubs, and ferry runs for standardised tests elsewhere",
                    "fees": "Varies by programme",
                },
                {
                    "type": "Costa Rican public schools",
                    "description": "Spanish-medium options exist toward Cobano — evaluate daily bus rides on unpaved roads before committing",
                    "fees": "Free",
                },
            ],
        ),
        childcare=dict(
            status="estimated",
            summary="Few regulated daycare centres — nannies and informal shares dominate. Screen carefully for seasonal turnover tied to tourism.",
            daycareItems=[
                "Small guarderías may operate informally — verify basic safety and first-aid training",
                "CEN-CINAI (Centro de Educación y Nutrición — Costa Rica's state early childhood centres) are not the fast path for newcomers",
                "Dust and mould alternate by season — indoor air quality matters for toddlers",
                "Power cuts interrupt nap climate control — ask caregivers about backup fans",
            ],
            nannyItems=[
                "Full-time niñera (nanny): $600–$1,000/month — wide spread based on English and driving ability",
                "Part-time: $5–$9/hr",
                "Drivers who can handle 4x4 roads command premiums — negotiate fuel fairly",
                "Tourism season competes for attention — lock schedules in writing",
            ],
            whereToFindItems=[
                "Search 'Santa Teresa Costa Rica families' on Google — small pods coordinate childcare swaps",
                "Cobano parent networks — wider pool willing to commute for the right salary",
                "ConMuchoGusto.net — verify IDs and references in person; do not hire solely from airport flyers",
            ],
        ),
        healthcare=dict(
            status="estimated",
            tip="Save CIMA Hospital and Clinica Biblica contact cards in Spanish — medevac decisions happen under stress; pre-translate paediatric allergies.",
            items=[
                "Regional clinics stabilise trauma and infections — assume San Jose for anything complex",
                "Ferry plus ambulance timing affects outcomes — insurance should not only cover helicopters but also ground transfers you can actually obtain",
                "Snakebite and surf injury protocols differ from city life — take a paediatric first-aid course locally if offered",
                "IPMI is non-negotiable for most relocating families — verify coverage in Nicoya specifically, not just 'Costa Rica'",
                "Pharmacies in Cobano carry basics; chronic meds may need San Jose fulfilment",
            ],
        ),
        safety=dict(
            status="estimated",
            score=76,
            summary="Santa Teresa is manageable with informed choices — prioritise road safety, surf risk, and securing homes during tourist peaks.",
            items=[
                "Night driving on unpaved roads — potholes and river crossings surprise newcomers",
                "Theft from rental villas — use lockboxes and avoid leaving boards and electronics visible",
                "Limited lifeguard culture — children need constant supervised swimming plans",
                "Motorcycles mixing with pedestrians — helmets for teens are non-negotiable if they ride",
                "Earthquake and tsunami awareness — know your elevation and evacuation walking route",
            ],
        ),
        cost=dict(status="estimated", rentRange="~$2,000 / month", familyDinner="~$46", nannyRate="~$8 / hr"),
        cost_label=NUMBEO_CR[0],
        cost_url=NUMBEO_CR[1],
        communityLinks=[
            {
                "label": "Search 'Santa Teresa Costa Rica families' on Google — small parent-led groups",
                "searchQuery": "Santa Teresa Costa Rica families Facebook",
                "url": "https://www.google.com/search?q=Santa+Teresa+Costa+Rica+families+Facebook+group",
                "isVerified": True,
            },
            {
                "label": "Search 'Expats in Costa Rica' on Google — Nicoya threads appear regularly",
                "searchQuery": "Expats in Costa Rica Facebook group",
                "url": "https://www.google.com/search?q=Expats+in+Costa+Rica+Facebook+group",
                "isVerified": True,
            },
        ],
        faq_city_name="Santa Teresa",
        faq=[
            "It can be — for ocean-focused families with flexible education plans. It is challenging for families who expect turnkey international schooling like Escazú.",
            "Budget roughly $4,000–$7,500/month all-in once you add transport, insurance surcharges, and education subscriptions — remote does not mean cheap.",
            "Inventory is tight and noisy listings hide road access issues — visit after rain before signing.",
            "Public schools exist toward Cobano but commutes bite; many families blend small primaries with online secondary — plan early.",
            "Stabilisation locally, definitive care in San Jose — align insurance with realistic evacuation, not wishful thinking.",
            "Yes — 4x4 strongly recommended; walking alone rarely covers groceries, school if inland, and night safety.",
            "Same DIMEX pipeline — remote living makes missed appointments costlier; schedule San Jose trips deliberately.",
            "How tiring supply runs become — and how much education pathways differ from Instagram surf reels.",
        ],
    )
)

# Insert before Vancouver (idempotent — skip if already present)
existing_ids = {c.get("id") for c in cities}
if any(c["id"] in existing_ids for c in new):
    print("Skip: one or more CR cities already in cities.json")
else:
    vidx = next(i for i, c in enumerate(cities) if c.get("id") == "vancouver-ca")
    for j, obj in enumerate(new):
        cities.insert(vidx + j, obj)
    with open("data/cities.json", "w", encoding="utf-8") as f:
        json.dump(cities, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("Inserted", len(new), "cities before vancouver-ca:", [c["id"] for c in new])
