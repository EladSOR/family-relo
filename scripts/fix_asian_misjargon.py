#!/usr/bin/env python3
"""
Fix Thai-only TM30 / 90-day-report content that was incorrectly applied to:
  - ho-chi-minh-city-vn (Vietnam uses 'khai báo tạm trú', not TM30)
  - ubud-id (Indonesia has no TM30 / 90-day report system)

Singapore, Tokyo, Taipei, KL keep their TM30 mentions because those are
intentional comparison statements ("this is NOT Thailand's TM30...") for
readers familiar with Thailand.
"""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())


def find(city_id):
    for c in cities:
        if c["id"] == city_id:
            return c
    raise KeyError(city_id)


# -----------------------------------------------------------------------------
# HO CHI MINH CITY — replace TM30 with Vietnamese terminology
# -----------------------------------------------------------------------------
hcmc = find("ho-chi-minh-city-vn")

# actionChecklist — the address-registration item
hcmc["actionChecklist"][4]["label"] = (
    "Your landlord is legally required to file your khai báo tạm trú "
    "(temporary residence declaration — Vietnam's mandatory address "
    "registration) with the local công an phường (ward-level police station) "
    "within 12 hours of your arrival at any new address — get a written "
    "or photographed receipt. Without this declaration on file you cannot "
    "apply for your TRC."
)
hcmc["actionChecklist"][5]["label"] = (
    "Apply for your TRC (Thẻ Tạm Trú — Temporary Resident Card, Vietnam's "
    "official registration card for long-stay foreigners) at the Ho Chi Minh "
    "City Immigration Department within 30 days of arrival. Bring: passport, "
    "visa, your khai báo tạm trú receipt, work permit, and 2 passport photos. "
    "The TRC is required to open a bank account and enroll children in school."
)

# residency.tip
hcmc["residency"]["tip"] = (
    "Register your address within 12 hours of moving — your landlord must "
    "file your khai báo tạm trú (temporary residence declaration) with local "
    "ward police (công an phường); non-compliance results in fines for both "
    "parties. Most landlords in District 1, 2, 7 do this online via the "
    "national public service portal."
)

# residency.items — fix items containing TM30
hcmc["residency"]["items"] = [
    (
        "Your landlord must file your khai báo tạm trú (temporary residence "
        "declaration — Vietnam's address registration form) with local ward "
        "police (công an phường) within 12 hours of your arrival at any new "
        "address — without this on file, you cannot receive your TRC"
    ),
    (
        "Apply for your TRC (Thẻ Tạm Trú — Temporary Resident Card) at the Ho "
        "Chi Minh City Immigration Department within 30 days of arrival — "
        "bring passport, visa, khai báo tạm trú receipt, work permit, and "
        "passport photos; TRC is required for banking and school enrollment"
    ),
    (
        "Obtain your work permit (giấy phép lao động) through your employer "
        "before starting work — your employer's HR team manages this process, "
        "which requires apostilled documents from your home country; working "
        "without a valid permit is a deportable offense"
    ),
    (
        "Enroll your children in school with your TRC, passport, apostilled "
        "birth certificates, and prior transcripts — international schools in "
        "Districts 2 and 7 assist with the local paperwork requirements"
    ),
    (
        "Re-register your khai báo tạm trú every time you move address, and "
        "track your TRC expiry date carefully — extensions must be filed "
        "before expiry at the HCMC Immigration Department or via the online "
        "portal at xuatnhapcanh.gov.vn (search 'TRC extension xuatnhapcanh' "
        "on Google for the current online form)"
    ),
]

# faq — the bureaucracy answer
for q in hcmc["faq"]:
    if q["question"] == "How difficult is the paperwork and bureaucracy after moving?":
        q["answer"] = (
            "Moderately complex — khai báo tạm trú (temporary residence "
            "declaration filed by your landlord), TRC application, and work "
            "permit all require coordination and multiple visits. Using a "
            "local relocation agent ($300–$600) is strongly recommended for "
            "the first 60 days to avoid compliance errors."
        )

# -----------------------------------------------------------------------------
# UBUD — remove TM30 reference, replace with Indonesia-correct content
# -----------------------------------------------------------------------------
ubud = find("ubud-id")

ubud["actionChecklist"][4]["label"] = (
    "Keep digital and printed copies of every immigration stamp and KITAS "
    "page — Indonesia requires you to register your address with the local "
    "kecamatan (sub-district office) within 14 days of receiving your KITAS, "
    "and Ubud immigration officers (Imigrasi Denpasar branch) check "
    "compliance regularly during inspections."
)

# -----------------------------------------------------------------------------
DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")
json.loads(DATA.read_text())  # sanity reload
print("Wrote", DATA)
print("Fixed: ho-chi-minh-city-vn (TM30 → khai báo tạm trú)")
print("Fixed: ubud-id (TM30 reference removed; Indonesia kecamatan-based)")
