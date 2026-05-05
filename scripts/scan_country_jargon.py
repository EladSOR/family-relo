#!/usr/bin/env python3
"""
Scan every city entry in data/cities.json and flag content where local jargon
clearly belongs to a different country than the city's own countrySlug.

We treat each entry as a single JSON-stringified blob and look for jargon
patterns that should NEVER appear in cities outside their home country.
"""
import json
import re
from pathlib import Path

CITIES = json.load(open(Path(__file__).parent.parent / "data" / "cities.json"))

# Map jargon term -> set of countrySlug(s) where it is legitimate.
# If a city's country is NOT in this set, the term is a flag.
JARGON = {
    # Italy
    "Codice Fiscale": {"italy"},
    "Permesso di Soggiorno": {"italy"},
    "Agenzia delle Entrate": {"italy"},
    "Questura": {"italy"},
    "Ufficio Anagrafe": {"italy"},
    "asilo nido": {"italy"},
    "asili nido": {"italy"},
    "Scuola dell'infanzia": {"italy"},
    "Tessera Sanitaria": {"italy"},
    "tessera sanitaria": {"italy"},
    "Servizio Sanitario Nazionale": {"italy"},
    "Azienda Sanitaria Locale": {"italy"},
    "Intesa Sanpaolo": {"italy"},
    "UniCredit": {"italy", "austria"},  # operates in Austria too
    "Sistema Pubblico di Identità Digitale": {"italy"},
    "Ministero degli Affari Esteri": {"italy"},
    "Po Valley": {"italy"},
    "Lake Como": {"italy"},
    "Porta Venezia": {"italy"},
    "Navigli": {"italy"},
    "Brera": {"italy"},
    "Sempione": {"italy"},
    "Isola": {"italy"},
    "dichiarazione di residenza": {"italy"},
    # Spain
    "Padrón Municipal": {"spain"},
    "Ayuntamiento": {"spain"},
    "Empadronamiento": {"spain"},
    "Centro de Salud": {"spain"},
    "BBVA": {"spain"},
    "Sabadell": {"spain"},
    "guardería": {"spain"},
    "cuidadora": {"spain"},
    " NIE ": {"spain"},
    "TIE ": {"spain"},
    " SIP ": {"spain"},
    "Extranjería": {"spain"},
    # Portugal
    " NIF ": {"portugal"},
    "Junta de Freguesia": {"portugal"},
    "Finanças": {"portugal"},
    " AIMA": {"portugal"},
    " SNS ": {"portugal"},
    " NHR ": {"portugal"},
    "creche": {"portugal", "france"},  # also French
    # France
    "Carte Vitale": {"france"},
    "Préfecture": {"france", "monaco"},
    "OFII": {"france"},
    "CAF ": {"france"},
    # Germany
    "Anmeldung": {"germany"},
    "Bürgeramt": {"germany"},
    "Aufenthaltstitel": {"germany", "austria"},
    "Krankenversicherung": {"germany", "austria"},
    "TK ": {"germany"},
    # Netherlands
    "BSN ": {"netherlands"},
    "Gemeente": {"netherlands"},
    # UAE
    "Emirates ID": {"uae", "united-arab-emirates"},
    "EJARI": {"uae", "united-arab-emirates"},
    " KHDA": {"uae", "united-arab-emirates"},
    "GDRFA": {"uae", "united-arab-emirates"},
    # Thailand
    " TM30": {"thailand"},
    "90-day report": {"thailand"},
    " DTV ": {"thailand"},
    " moo ban ": {"thailand"},
    "Bangkok Bank": {"thailand"},
    "Kasikorn": {"thailand"},
    "Thailand Elite": {"thailand"},
    "Bumrungrad": {"thailand"},
    "Samitivej": {"thailand"},
    "Sukhumvit": {"thailand"},
    "Thonglor": {"thailand"},
    # Japan
    "myNumber": {"japan"},
    "Hanko": {"japan"},
    "Zairyu": {"japan"},
    # Singapore
    " EP ": {"singapore"},
    "MOM ": {"singapore"},
    "FIN ": {"singapore"},
    # Indonesia
    "KITAS": {"indonesia"},
    " KITAP": {"indonesia"},
    "BPJS": {"indonesia"},
    # Vietnam
    " MOET ": {"vietnam"},
    # India — mostly OK, but flag pure Indian-only
    "PAN card": {"india"},
    "Aadhaar": {"india"},
}


def scan_entry(entry):
    blob = json.dumps(entry, ensure_ascii=False)
    country = entry.get("countrySlug", "")
    findings = []
    for term, countries in JARGON.items():
        if term in blob and country not in countries:
            count = blob.count(term)
            findings.append((term, count))
    return findings


def main():
    print(f"Scanning {len(CITIES)} cities...\n")
    flagged = []
    for entry in CITIES:
        findings = scan_entry(entry)
        if findings:
            flagged.append((entry["id"], entry["countrySlug"], findings))
    if not flagged:
        print("No country-jargon mismatches found.")
        return
    print(f"Flagged {len(flagged)} cities:\n")
    for id_, country, findings in flagged:
        print(f"  - {id_} (country={country})")
        for term, count in findings:
            print(f"      - '{term}' x{count}")
    print()
    print("Done.")


if __name__ == "__main__":
    main()
