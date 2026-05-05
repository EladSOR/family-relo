#!/usr/bin/env python3
"""Add a 3rd entry to childcare.whereToFindItems for cities flagged with <3."""
import json
from pathlib import Path

DATA = Path(__file__).parent.parent / "data" / "cities.json"
cities = json.loads(DATA.read_text())

EXTRAS = {
    "phuket-th": "International schools (e.g. UWC Thailand, BIS Phuket) often keep informal nanny lists — ask the school office once your child is enrolled or in the application stage",
    "tel-aviv-il": "Yad2.co.il (Israel's largest classifieds site) — search the 'mishmeret yeladim' (childcare) section for local nannies and au pairs",
    "eilat-il": "Word-of-mouth through Eilat's small expat community — ask at international school open days and at synagogues with English-speaking congregations",
    "jerusalem-il": "Yad2.co.il (Israel's largest classifieds site) — has a dedicated 'metaplot' (childcare) category widely used in Jerusalem",
}


def main():
    for c in cities:
        if c["id"] not in EXTRAS:
            continue
        items = c.get("childcare", {}).get("whereToFindItems", [])
        items.append(EXTRAS[c["id"]])
        c["childcare"]["whereToFindItems"] = items
        print(f"  {c['id']} :: now {len(items)} entries")
    DATA.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
