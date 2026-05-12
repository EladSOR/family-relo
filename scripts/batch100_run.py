#!/usr/bin/env python3
"""
batch100_run.py — merge city configs from scripts/batch100/*.py into
data/cities.json using batch100_helper.make_city().

Idempotent: replaces a city by id if it already exists, appends otherwise.
Supports an --only filter for partial/intermediate merges.

Usage:
    python3 scripts/batch100_run.py                     # all cities found
    python3 scripts/batch100_run.py --only bucharest tallinn   # subset
"""
import argparse
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
CITIES_PATH = ROOT / "data" / "cities.json"
BATCH_DIR = Path(__file__).parent / "batch100"

sys.path.insert(0, str(Path(__file__).parent))
from batch100_helper import make_city  # noqa: E402


def load_module(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", help="Only process these citySlugs (or stem names of files in batch100/)")
    args = parser.parse_args()

    # Discover all city config files
    config_files = sorted(BATCH_DIR.glob("*.py"))
    config_files = [p for p in config_files if not p.name.startswith("_")]

    if args.only:
        wanted = set(args.only)
        config_files = [p for p in config_files if p.stem in wanted]

    if not config_files:
        print("No city configs found.")
        return

    print(f"Loading {len(config_files)} city config(s)...")

    # Pre-load existing cities for clone_visa_from support
    existing_cities = json.loads(CITIES_PATH.read_text())
    existing_by_id = {c["id"]: c for c in existing_cities}

    # Build city dicts
    new_cities = []
    for path in config_files:
        mod = load_module(path)
        if not hasattr(mod, "CITY"):
            print(f"  SKIP {path.name} — no CITY dict")
            continue
        cfg = mod.CITY
        # Resolve clone_visa_from: copy sister city's visa block (visa rules are national)
        clone_from = cfg.get("clone_visa_from")
        if clone_from:
            sister = existing_by_id.get(clone_from)
            if not sister or "visa" not in sister:
                raise ValueError(f"{path.name}: clone_visa_from={clone_from} not found or has no visa block")
            cfg["visa"] = sister["visa"]
        city = make_city(cfg)
        new_cities.append(city)
        print(f"  ✓ {city['id']}")

    # Merge into cities.json (idempotent by id)
    cities = json.loads(CITIES_PATH.read_text())
    by_id = {c["id"]: i for i, c in enumerate(cities)}

    added = []
    replaced = []
    for nc in new_cities:
        if nc["id"] in by_id:
            cities[by_id[nc["id"]]] = nc
            replaced.append(nc["id"])
        else:
            cities.append(nc)
            added.append(nc["id"])

    CITIES_PATH.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")
    print(f"\nResult: {len(cities)} cities total in data/cities.json")
    print(f"  Added:    {added}")
    print(f"  Replaced: {replaced}")


if __name__ == "__main__":
    main()
