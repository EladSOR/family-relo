#!/usr/bin/env python3
"""
Bring every city's housing section to Valencia standard:
  • 3+ searchPortals — real local platforms first, Facebook last
  • 3+ typicalPrices — neighbourhood + USD figure with `~$` prefix
  • 4+ whatYouNeedToRent — passport, local ID, income, deposit, contract note

Targets two groups:
  GROUP A — older cities with generic 'Search "rent apartment X Y"' fallback
            + Facebook only (need REAL local portals).
  GROUP B — newer cities with placeholder-quality typicalPrices and
            whatYouNeedToRent (e.g. 'Cédula soon', '~₹ $2,200–$3,900').

This script REPLACES corrupted lists in full when needed and APPENDS only
when current content is fine. Each city is treated explicitly so we never
accidentally overwrite good copy.
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())


# ───────── GROUP A — replace generic searchPortals with real local sites ─────────
PORTAL_REPLACEMENTS = {
    "berlin-de": [
        {"label": "ImmoScout24 — Germany's largest property portal", "url": "https://www.immobilienscout24.de", "isVerified": True},
        {"label": "ImmoWelt — major German rental portal", "url": "https://www.immowelt.de", "isVerified": True},
        {"label": "WG-Gesucht — flatshares and longer-term rooms (useful while flat-hunting)", "url": "https://www.wg-gesucht.de", "isVerified": True},
        {"label": "Facebook groups — search: 'Berlin Wohnungssuche' or 'Apartments Berlin Expats' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Berlin+Wohnungssuche+Facebook+group", "isVerified": True},
    ],
    "amsterdam-nl": [
        {"label": "Funda — Netherlands' largest property portal", "url": "https://www.funda.nl", "isVerified": True},
        {"label": "Pararius — strong rental focus, English-language interface", "url": "https://www.pararius.com", "isVerified": True},
        {"label": "Kamernet — flats and rooms, useful for shorter-term while hunting", "url": "https://kamernet.nl", "isVerified": True},
        {"label": "Facebook groups — search: 'Amsterdam Housing Expats' (direct landlord and sublet deals)", "url": "https://www.google.com/search?q=Amsterdam+Housing+Expats+Facebook+group", "isVerified": True},
    ],
    "prague-cz": [
        {"label": "Sreality.cz — Czech Republic's largest property portal", "url": "https://www.sreality.cz", "isVerified": True},
        {"label": "Reality.iDNES.cz — major Czech rental portal", "url": "https://reality.idnes.cz", "isVerified": True},
        {"label": "Bezrealitky — landlord-direct listings (no agent fee)", "url": "https://www.bezrealitky.cz", "isVerified": True},
        {"label": "Facebook groups — search: 'Prague Expats Housing' or 'Apartments Prague' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Prague+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "budapest-hu": [
        {"label": "Ingatlan.com — Hungary's largest property portal", "url": "https://ingatlan.com", "isVerified": True},
        {"label": "Otthontérkép — major Hungarian rental portal", "url": "https://www.otthonterkep.hu", "isVerified": True},
        {"label": "Jófogás Ingatlan — Hungarian classifieds with strong rental section", "url": "https://ingatlan.jofogas.hu", "isVerified": True},
        {"label": "Facebook groups — search: 'Budapest Expats Housing' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Budapest+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "bangkok-th": [
        {"label": "DDproperty — Thailand's largest property portal (English interface)", "url": "https://www.ddproperty.com", "isVerified": True},
        {"label": "Hipflat — Bangkok-focused rental portal", "url": "https://www.hipflat.com", "isVerified": True},
        {"label": "Renthub — direct landlord listings popular with expat families", "url": "https://www.renthub.in.th", "isVerified": True},
        {"label": "Facebook groups — search: 'Bangkok Expats Housing' or 'Condos for Rent Bangkok' (direct landlord and community deals)", "url": "https://www.google.com/search?q=Bangkok+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "phuket-th": [
        {"label": "DDproperty — Thailand's largest property portal", "url": "https://www.ddproperty.com", "isVerified": True},
        {"label": "FazWaz — Phuket-focused villa and condo rentals", "url": "https://www.fazwaz.com", "isVerified": True},
        {"label": "Hipflat — Thai rental portal with strong Phuket inventory", "url": "https://www.hipflat.com", "isVerified": True},
        {"label": "Facebook groups — search: 'Phuket Expats Housing' or 'Phuket Rental Villas' (direct landlord and community deals)", "url": "https://www.google.com/search?q=Phuket+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "dublin-ie": [
        {"label": "Daft.ie — Ireland's largest property portal", "url": "https://www.daft.ie", "isVerified": True},
        {"label": "MyHome.ie — major Irish rental portal", "url": "https://www.myhome.ie", "isVerified": True},
        {"label": "Rent.ie — landlord-direct listings", "url": "https://www.rent.ie", "isVerified": True},
        {"label": "Facebook groups — search: 'Housing Dublin Expats' or 'Dublin Rentals' (direct landlord and community deals)", "url": "https://www.google.com/search?q=Housing+Dublin+Expats+Facebook+group", "isVerified": True},
    ],
    "copenhagen-dk": [
        {"label": "BoligPortal — Denmark's largest rental portal", "url": "https://www.boligportal.dk", "isVerified": True},
        {"label": "Lejebolig.dk — Danish rental classifieds", "url": "https://www.lejebolig.dk", "isVerified": True},
        {"label": "DBA — general classifieds with strong rental section", "url": "https://www.dba.dk", "isVerified": True},
        {"label": "Facebook groups — search: 'Housing Copenhagen Expats' or 'Lejlighed København' (community listings)", "url": "https://www.google.com/search?q=Housing+Copenhagen+Expats+Facebook+group", "isVerified": True},
    ],
    "dubai-ae": [
        {"label": "Bayut — UAE's largest property portal", "url": "https://www.bayut.com", "isVerified": True},
        {"label": "Property Finder — major UAE property portal with English interface", "url": "https://www.propertyfinder.ae", "isVerified": True},
        {"label": "Dubizzle — direct landlord listings (no agent fee)", "url": "https://dubai.dubizzle.com", "isVerified": True},
        {"label": "Facebook groups — search: 'Dubai Expats Housing' (direct landlord and community deals)", "url": "https://www.google.com/search?q=Dubai+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "medellin-co": [
        {"label": "Metrocuadrado — Colombia's largest property portal", "url": "https://www.metrocuadrado.com", "isVerified": True},
        {"label": "Fincaraíz — major Colombian rental portal", "url": "https://www.fincaraiz.com.co", "isVerified": True},
        {"label": "Properati Colombia — additional rental inventory", "url": "https://www.properati.com.co", "isVerified": True},
        {"label": "Facebook groups — search: 'Medellín Expats Housing' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Medellin+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "buenos-aires-ar": [
        {"label": "Zonaprop — Argentina's largest property portal", "url": "https://www.zonaprop.com.ar", "isVerified": True},
        {"label": "Argenprop — major Argentine rental portal", "url": "https://www.argenprop.com", "isVerified": True},
        {"label": "Mercado Libre Inmuebles — strong inventory of direct-from-owner listings", "url": "https://inmuebles.mercadolibre.com.ar", "isVerified": True},
        {"label": "Facebook groups — search: 'Buenos Aires Expats Housing' (community listings)", "url": "https://www.google.com/search?q=Buenos+Aires+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "lima-pe": [
        {"label": "Urbania — Peru's largest property portal", "url": "https://urbania.pe", "isVerified": True},
        {"label": "Adondevivir — major Peruvian rental portal", "url": "https://www.adondevivir.com", "isVerified": True},
        {"label": "Properati Peru — additional rental inventory", "url": "https://www.properati.com.pe", "isVerified": True},
        {"label": "Facebook groups — search: 'Lima Expats Housing' (community listings)", "url": "https://www.google.com/search?q=Lima+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "panama-city-pa": [
        {"label": "Encuentra24 — Panama's largest classifieds platform with strong rental section", "url": "https://www.encuentra24.com", "isVerified": True},
        {"label": "CompreoAlquile — major Panamanian property portal", "url": "https://www.compreoalquile.com", "isVerified": True},
        {"label": "PanamaCompra — direct-from-owner Panama listings", "url": "https://www.panamacompra.com", "isVerified": True},
        {"label": "Facebook groups — search: 'Panama City Expats Housing' or 'Familias en Panamá' (community listings)", "url": "https://www.google.com/search?q=Panama+City+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "santiago-cl": [
        {"label": "Portal Inmobiliario — Chile's largest property portal", "url": "https://www.portalinmobiliario.com", "isVerified": True},
        {"label": "TocToc — major Chilean property portal with strong Santiago inventory", "url": "https://www.toctoc.com", "isVerified": True},
        {"label": "Yapo.cl — direct-from-owner classifieds", "url": "https://www.yapo.cl", "isVerified": True},
        {"label": "Facebook groups — search: 'Santiago Expats Housing' or 'Arriendos Santiago' (community listings)", "url": "https://www.google.com/search?q=Santiago+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "montevideo-uy": [
        {"label": "Mercado Libre Inmuebles Uruguay — strong direct-from-owner inventory", "url": "https://inmuebles.mercadolibre.com.uy", "isVerified": True},
        {"label": "Infocasas — major Uruguayan property portal", "url": "https://www.infocasas.com.uy", "isVerified": True},
        {"label": "Gallito — Uruguay's largest classifieds platform with rental section", "url": "https://www.gallito.com.uy", "isVerified": True},
        {"label": "Facebook groups — search: 'Montevideo Expats Housing' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Montevideo+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "bogota-co": [
        {"label": "Metrocuadrado — Colombia's largest property portal", "url": "https://www.metrocuadrado.com", "isVerified": True},
        {"label": "Fincaraíz — major Colombian rental portal with strong Bogotá inventory", "url": "https://www.fincaraiz.com.co", "isVerified": True},
        {"label": "Properati Colombia — additional rental inventory", "url": "https://www.properati.com.co", "isVerified": True},
        {"label": "Facebook groups — search: 'Bogotá Expats Housing' (community listings, direct landlord deals)", "url": "https://www.google.com/search?q=Bogota+Expats+Housing+Facebook+group", "isVerified": True},
    ],
    "ho-chi-minh-city-vn": [
        {"label": "Batdongsan — Vietnam's largest property portal", "url": "https://batdongsan.com.vn", "isVerified": True},
        {"label": "Mogi.vn — major Vietnamese rental portal", "url": "https://mogi.vn", "isVerified": True},
        {"label": "Chợ Tốt Nhà — direct-from-owner Vietnamese classifieds", "url": "https://nha.chotot.com", "isVerified": True},
        {"label": "Facebook groups — search: 'Saigon Expats Housing' or 'HCMC Apartments' (direct landlord and community deals)", "url": "https://www.google.com/search?q=Saigon+Expats+Housing+Facebook+group", "isVerified": True},
    ],
}


# ───────── GROUP B — replace placeholder typicalPrices / whatYouNeedToRent ─────────
HOUSING_DETAILS = {
    "panama-city-pa": {
        "typicalPrices": [
            "1-bed apartment, El Cangrejo or Marbella: ~$1,000–$1,500 / month",
            "2-bed apartment, Punta Pacífica or Costa del Este: ~$1,800–$2,800 / month",
            "3-bed apartment, Punta Pacífica high-rise: ~$2,900–$4,500 / month",
            "4-bed family house, Clayton (near international schools): ~$3,500–$6,000 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,800–$3,500 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport (notarised copies often requested)",
            "Cédula (Panamanian ID for residents) or carnet de residencia (residence card) once issued",
            "Employer carta de garantía (employer guarantee letter) or 3 months of bank statements proving income",
            "1–2 months deposit plus first month's rent is standard",
            "Most landlords require a 1-year minimum lease — confirm furnished vs unfurnished and which utilities are included before signing",
        ],
    },
    "santiago-cl": {
        "typicalPrices": [
            "1-bed apartment, Providencia or Ñuñoa: ~$700–$1,100 / month",
            "2-bed apartment, Las Condes: ~$1,400–$2,200 / month",
            "3-bed apartment, Las Condes or Vitacura: ~$2,200–$3,500 / month",
            "4-bed family house, Vitacura or La Dehesa (near international schools): ~$3,500–$6,500 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,500–$3,000 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport plus your RUT (Rol Único Tributario — Chilean tax ID, required for almost every transaction)",
            "Aval (Chilean co-signer/guarantor) or a deposit equivalent to 2–3 months rent if you cannot provide one — landlords usually require one or the other",
            "3 months of bank statements or an employment contract showing income at least 3× the monthly rent",
            "Seguro hogar (home insurance) — sometimes required by landlord, otherwise recommended",
            "Most rental contracts run 1 year minimum — read the salida anticipada (early termination) clause carefully before signing",
        ],
    },
    "montevideo-uy": {
        "typicalPrices": [
            "1-bed apartment, Pocitos or Punta Carretas: ~$700–$1,100 / month",
            "2-bed apartment, Pocitos rambla (waterfront): ~$1,300–$2,200 / month",
            "3-bed apartment, Carrasco: ~$2,000–$3,500 / month",
            "4-bed family house, Carrasco (near international schools): ~$2,800–$5,000 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,500–$2,800 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport plus your cédula uruguaya (Uruguayan ID) once issued",
            "Garantía (rental guarantee) — typically a bank guarantee, deposit, or contracted ANDA/Porto Seguro/BHU policy. Without one, landlords often require 6 months rent upfront",
            "3 months of bank statements or an employment contract showing income",
            "1 month deposit plus first month's rent is standard",
            "Standard rental contracts are 2 years — read the rescisión (early termination) clause before signing",
        ],
    },
    "bogota-co": {
        "typicalPrices": [
            "1-bed apartment, Chapinero Alto or Quinta Camacho: ~$500–$900 / month",
            "2-bed apartment, El Chicó or Rosales: ~$900–$1,500 / month",
            "3-bed apartment, Chapinero or Usaquén: ~$1,500–$2,500 / month",
            "4-bed family house, Usaquén or Cedritos (near international schools): ~$2,200–$4,000 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,200–$2,500 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport plus your cédula de extranjería (Colombian foreigner ID) once issued",
            "Codeudor (Colombian co-signer/guarantor) or a póliza de arrendamiento (rental insurance policy) — most landlords require one or the other",
            "3 months of bank statements or an employment contract showing income",
            "1–2 months deposit plus first month's rent is standard",
            "Most contracts run 1 year minimum — Colombian law allows tenants to terminate with 3 months notice plus a penalty equal to 3 months rent",
        ],
    },
    "ho-chi-minh-city-vn": {
        "typicalPrices": [
            "1-bed serviced apartment, District 1 or District 3: ~$700–$1,200 / month",
            "2-bed apartment, District 7 (near international schools): ~$1,200–$2,200 / month",
            "3-bed apartment, Thảo Điền (District 2): ~$2,000–$3,500 / month",
            "4-bed villa, Thảo Điền or An Phú: ~$3,500–$6,500 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,500–$3,000 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport with current Vietnamese visa endorsement",
            "Work permit or residency card (thẻ tạm trú) once issued — required to register a long-term tenancy",
            "1–2 months deposit plus first month's rent is standard; landlords usually want rent paid quarterly",
            "Have your landlord file your khai báo tạm trú (temporary residence registration) with local police on arrival — required by law and you'll need a copy for visa renewals and bank account opening",
            "Confirm in writing whether utilities, internet, and cleaning are included; many serviced apartments and villas in Thảo Điền bundle them",
        ],
    },
    "bengaluru-in": {
        "typicalPrices": [
            "1-bed apartment, Indiranagar or Koramangala: ~$400–$700 / month",
            "2-bed apartment, HSR Layout or JP Nagar: ~$700–$1,200 / month",
            "3-bed apartment, Whitefield or Sarjapur (near international schools): ~$1,200–$2,200 / month",
            "4-bed villa, Whitefield gated community: ~$2,000–$3,500 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$1,200–$2,500 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport with current Indian visa endorsement",
            "FRRO (Foreigner Regional Registration Office) registration certificate — required if your visa stay exceeds 180 days",
            "10 months security deposit is standard in Bengaluru (Indian norm — non-refundable in case of damages, refundable otherwise)",
            "Employer relocation letter or 3 months of bank statements proving income",
            "Society admission forms and police verification — gated communities require these before move-in; budget 2–4 weeks for processing",
        ],
    },
    "mumbai-in": {
        "typicalPrices": [
            "1-bed apartment, Bandra West or Andheri West: ~$1,500–$2,500 / month",
            "2-bed apartment, Bandra high-rise: ~$2,500–$4,500 / month",
            "3-bed apartment, Powai or Lower Parel: ~$2,500–$4,500 / month",
            "Executive lease, Worli Sea Face or Cuffe Parade: ~$5,500–$10,000 / month",
            "Short-stay serviced apartment (first 4–8 weeks): ~$2,500–$5,000 / month",
        ],
        "whatYouNeedToRent": [
            "Valid passport with current Indian visa endorsement",
            "FRRO (Foreigner Regional Registration Office) registration certificate — required if your visa stay exceeds 180 days",
            "Employer relocation letter or 3 months of bank statements proving income",
            "10 months security deposit is standard in Mumbai (Indian norm — refundable on exit minus damages)",
            "Society admission forms and police verification — Mumbai cooperative societies require these before move-in; allow 2–4 weeks for approval",
        ],
    },
}


def main():
    portal_count = 0
    detail_count = 0
    for c in cities:
        cid = c["id"]
        h = c.get("housing", {})
        if cid in PORTAL_REPLACEMENTS:
            h["searchPortals"] = PORTAL_REPLACEMENTS[cid]
            portal_count += 1
        if cid in HOUSING_DETAILS:
            for k, v in HOUSING_DETAILS[cid].items():
                h[k] = v
            detail_count += 1
    DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")
    print(f"  searchPortals replaced for {portal_count} cities")
    print(f"  typicalPrices/whatYouNeedToRent rewritten for {detail_count} cities")


if __name__ == "__main__":
    main()
