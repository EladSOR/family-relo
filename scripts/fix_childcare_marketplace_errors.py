#!/usr/bin/env python3
"""
Replace fabricated or wrong-marketplace nanny channels with real ones.

Pattern flagged: I (or earlier passes) listed general goods marketplaces
or fabricated platform names as ways to find nannies. Specific errors:

  • Tel Aviv / Jerusalem — pointed at Yad2 (goods classifieds, no real
    nanny vertical)
  • Medellín — pointed at Metrocuadrado (real estate ONLY, no domestic
    services section exists)
  • Buenos Aires / Lima — pointed at ConMuchoGusto.net (real platform but
    only operates in Costa Rica)
  • Thessaloniki — pointed at car.gr / offers.gr (goods only) and
    Ergani.gr (government labour ministry, not for hiring nannies)

Each city gets honest replacements: WhatsApp/Facebook groups (universal),
school referrals, real specialised agencies where they exist.
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())

REPLACEMENTS = {
    "tel-aviv-il": [
        "Search 'Tel Aviv Expat Parents' or 'Olim Families Tel Aviv' on Facebook — the most active English-language communities for personal nanny referrals",
        "Israeli relocation agencies (e.g. Ocean Relocation, Anglo-List Israel) — many maintain a vetted childcare referral list specifically for incoming expat families",
        "WhatsApp parent groups — the dominant hiring channel in Tel Aviv. Ask at Anglo-friendly preschools (Gan Yeladim) and Olim families groups for invitations to local hiring groups",
        "Star Au Pair Israel and Au Pair International — licensed Israeli au pair agencies that handle live-in foreign nanny placements with full visa support",
    ],
    "jerusalem-il": [
        "Search 'Jerusalem Anglo Parents' or 'Olim Families Jerusalem' on Facebook — active English-speaking community with nanny referrals",
        "Local parent WhatsApp groups are the primary hiring channel in Jerusalem — ask at Anglo-friendly synagogues and English-language preschools (Gan Yeladim) for invitations",
        "Israeli relocation agencies — most maintain a vetted childcare referral list for incoming Anglo families (Nefesh B'Nefesh keeps an updated list of trusted local providers)",
    ],
    "eilat-il": [
        "Search 'Eilat Anglo Parents' or 'Olim Families Eilat' on Facebook for English-speaking parent groups and nanny referrals",
        "Israeli relocation agencies — most maintain vetted childcare referral lists for incoming families and can suggest English-comfortable local nannies",
        "Word-of-mouth through Eilat's small expat community — ask at international school open days and at Anglo-friendly synagogues; the city is small enough that 1–2 introductions usually find a candidate",
    ],
    "medellin-co": [
        "Computrabajo Colombia (computrabajo.com.co) — the largest Colombian jobs platform with a real 'Servicio Doméstico y Cuidado de Niños' (domestic and childcare) section",
        "Cuidadoras.co — a specialised Colombian platform for caregivers and nannies with vetted profiles",
        "Search 'Medellín Expat Families' or 'Mamás Medellín' on Facebook for personal recommendations and direct hiring leads",
        "International schools (Columbus School, Colegio Albania) often keep informal nanny referral lists — ask the school office during the application process",
    ],
    "buenos-aires-ar": [
        "ZonaJobs (zonajobs.com.ar) and Bumeran (bumeran.com.ar) — Argentina's largest job platforms with active 'Servicio Doméstico' sections used for nanny hiring",
        "Search 'Buenos Aires Expat Families' or 'Mamás Expats BA' on Facebook for personal recommendations and direct hiring leads",
        "International schools (Lincoln, Northlands, St. Andrew's) often keep informal nanny referral lists — ask the school office during the application process",
    ],
    "lima-pe": [
        "Computrabajo Perú (computrabajo.com.pe) — Peru's largest jobs platform with an active 'Servicio Doméstico' section used by Lima families",
        "Search 'Lima Expat Families' or 'Mamás Expats Lima' on Facebook for personal recommendations and direct hiring leads",
        "International schools (Colegio Roosevelt, Markham, Newton) often keep informal nanny referral lists — ask the school office during the application process",
    ],
    "thessaloniki-gr": [
        "Babysitting.gr — Greece's main specialised platform for nannies and babysitters, with profile verification",
        "Skywalker.gr — Greece's largest jobs platform with an active 'Φύλαξη Παιδιών' (childcare) section used for nanny hiring",
        "Search 'Thessaloniki Expat Families' or 'Διεθνείς Οικογένειες Θεσσαλονίκη' on Facebook for personal recommendations and direct hiring leads",
    ],
}


def main():
    for c in cities:
        cid = c["id"]
        if cid not in REPLACEMENTS:
            continue
        c["childcare"]["whereToFindItems"] = REPLACEMENTS[cid]
        print(f"  {cid} :: {len(REPLACEMENTS[cid])} entries replaced")
    DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
