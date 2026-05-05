#!/usr/bin/env python3
"""Flag every city whose actionChecklist does not begin with at least one visa-targeted item."""
import json
from pathlib import Path

CITIES = json.load(open(Path(__file__).parent.parent / "data" / "cities.json"))

bad = []
for entry in CITIES:
    checklist = entry.get("actionChecklist", [])
    if not checklist:
        bad.append((entry["id"], "EMPTY"))
        continue
    first = checklist[0]
    target = first.get("targetSection", "")
    if target != "visa":
        # not visa-first; check if visa appears anywhere in first 3 items
        first_three_targets = [c.get("targetSection", "") for c in checklist[:3]]
        bad.append((entry["id"], f"first={target!r}, first3={first_three_targets}"))

print(f"Cities NOT starting with a visa item: {len(bad)} / {len(CITIES)}\n")
for id_, info in bad:
    print(f"  - {id_:<30} {info}")
