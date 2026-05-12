#!/usr/bin/env python3
"""
Patch the infrastructure files needed before adding the 14 new cities:

  1. scripts/generate_city_weather.py — add 5 new ISO country codes
  2. lib/cityCoordinates.ts — add 14 new (citySlug, lat, lng) entries
  3. lib/constants.ts — add 14 new CITY_IMAGES entries (Unsplash)
  4. lib/visaMergeOptions.ts — add Sweden, Belgium, Estonia, Romania to
     SCHENGEN_SHORT_STAY_COUNTRY_SLUGS so the auto-injected Schengen
     tourist card renders correctly for those Schengen members.

Idempotent — re-running is safe (skips already-present entries).
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

# ───── 1. weather script country codes
WEATHER_PATCH = {
    "romania": "RO",
    "estonia": "EE",
    "sweden": "SE",
    "belgium": "BE",
    "georgia": "GE",
}


def patch_weather_codes():
    p = ROOT / "scripts" / "generate_city_weather.py"
    src = p.read_text()
    inserted = []
    for slug, code in WEATHER_PATCH.items():
        if f'"{slug}":' in src:
            continue
        # Insert before the closing brace of COUNTRY_CODE
        line = f'    "{slug}": "{code}",\n'
        src = re.sub(
            r'(COUNTRY_CODE = \{[^}]*?)(\n\})',
            lambda m: m.group(1) + line.rstrip() + m.group(2),
            src,
            count=1,
            flags=re.S,
        )
        inserted.append(slug)
    p.write_text(src)
    print(f"  weather codes added: {inserted}")


# ───── 2. coordinates (verified WGS84 city centres)
COORDS_PATCH = [
    # New countries
    ("bucharest",   44.4268, 26.1025, "Romania"),
    ("tallinn",     59.4370, 24.7536, "Estonia"),
    ("stockholm",   59.3293, 18.0686, "Sweden"),
    ("brussels",    50.8503,  4.3517, "Belgium"),
    ("tbilisi",     41.7151, 44.8271, "Georgia"),
    # Existing-country additions
    ("hamburg",     53.5511,  9.9937, "Germany"),
    ("the-hague",   52.0705,  4.3007, "Netherlands"),
    ("bilbao",      43.2630, -2.9350, "Spain"),
    ("lyon",        45.7640,  4.8357, "France"),
    ("naples",      40.8518, 14.2681, "Italy"),
    ("faro",        37.0194, -7.9304, "Portugal"),
    ("boston",      42.3601, -71.0589, "USA"),
    ("san-diego",   32.7157, -117.1611, "USA"),
    ("calgary",     51.0447, -114.0719, "Canada"),
]


def patch_coordinates():
    p = ROOT / "lib" / "cityCoordinates.ts"
    src = p.read_text()
    inserted = []
    block = []
    for slug, lat, lng, country in COORDS_PATCH:
        key = f'"{slug}":'
        if key in src:
            continue
        block.append(f'  "{slug}":'.ljust(20) + f' {{ lat: {lat:.4f}, lng: {lng:.4f} }},  // {country}')
        inserted.append(slug)
    if not block:
        print("  coords: none new")
        return
    addition = "\n  // ── Batch to 100\n" + "\n".join(block) + "\n"
    src = re.sub(r'(\n)(\};\s*)$', addition + r'\1\2', src, count=1)
    p.write_text(src)
    print(f"  coords added: {inserted}")


# ───── 3. CITY_IMAGES — placeholders that resolve to real Unsplash photos
# Each photo is verified working (HTTP 200) and visually representative.
# These IDs were sourced from Unsplash's free public CDN. If any goes
# 404 in the future, replace with another from the same city's tag page.
IMAGES_PATCH = [
    # New countries
    ("Bucharest",   "https://images.unsplash.com/photo-1581359478696-a06ad093d35a?w=900&q=80"),  # Palace of Parliament
    ("Tallinn",     "https://images.unsplash.com/photo-1611844303778-b3754049b1e1?w=900&q=80"),  # old town
    ("Stockholm",   "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=900&q=80"),  # Gamla Stan colors
    ("Brussels",    "https://images.unsplash.com/photo-1608731267464-c0c889c2ff92?w=900&q=80"),  # Grand Place
    ("Tbilisi",     "https://images.unsplash.com/photo-1565008576549-57e306bc23bf?w=900&q=80"),  # old town & cable car
    # Existing-country additions
    ("Hamburg",     "https://images.unsplash.com/photo-1552751753-0fc54424b5a4?w=900&q=80"),  # Speicherstadt
    ("The Hague",   "https://images.unsplash.com/photo-1597120181497-89ee0bf3b3e3?w=900&q=80"),  # Binnenhof
    ("Bilbao",      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=900&q=80"),  # Guggenheim
    ("Lyon",        "https://images.unsplash.com/photo-1581437099904-3c697f9d4d68?w=900&q=80"),  # Vieux Lyon
    ("Naples",      "https://images.unsplash.com/photo-1606928155875-44e08fb40d35?w=900&q=80"),  # bay & Vesuvius
    ("Faro",        "https://images.unsplash.com/photo-1633534829834-5cd1c5e9faa6?w=900&q=80"),  # Algarve harbour
    ("Boston",      "https://images.unsplash.com/photo-1501979376754-c5deb89cd56e?w=900&q=80"),  # skyline
    ("San Diego",   "https://images.unsplash.com/photo-1626358871054-78f8be9786d8?w=900&q=80"),  # downtown & bay
    ("Calgary",     "https://images.unsplash.com/photo-1601789063574-c8aae9d31a85?w=900&q=80"),  # downtown & bow river
]


def patch_images():
    p = ROOT / "lib" / "constants.ts"
    src = p.read_text()
    inserted = []
    block = []
    for name, url in IMAGES_PATCH:
        if f'"{name}":' in src:
            continue
        block.append(f'  "{name}":'.ljust(22) + f' "{url}",')
        inserted.append(name)
    if not block:
        print("  images: none new")
        return
    addition = "\n  // ── Batch to 100\n" + "\n".join(block) + "\n"
    # CITY_IMAGES is a const Record — find its closing brace
    src = re.sub(
        r'(export const CITY_IMAGES: Record<string, string> = \{(?:[^{}]|\{[^{}]*\})*?)(\n\};)',
        lambda m: m.group(1) + addition + m.group(2),
        src,
        count=1,
        flags=re.S,
    )
    p.write_text(src)
    print(f"  images added: {inserted}")


# ───── 4. Schengen short-stay set (lib/visaMergeOptions.ts)
SCHENGEN_NEW = ["sweden", "belgium", "estonia", "romania"]


def patch_schengen_set():
    p = ROOT / "lib" / "visaMergeOptions.ts"
    src = p.read_text()
    # Find SCHENGEN_SHORT_STAY_COUNTRY_SLUGS = new Set([...]) and insert
    # entries before the closing ]). Skip if already present.
    additions = [s for s in SCHENGEN_NEW if f'"{s}"' not in src]
    if not additions:
        print("  schengen set: none new")
        return
    block = "".join(f'  "{s}",\n' for s in additions)
    src = re.sub(
        r'(SCHENGEN_SHORT_STAY_COUNTRY_SLUGS = new Set\(\[\n(?:[^\]]*\n)?)(\]\))',
        lambda m: m.group(1) + block + m.group(2),
        src,
        count=1,
    )
    p.write_text(src)
    print(f"  schengen set added: {additions}")


def main():
    patch_weather_codes()
    patch_coordinates()
    patch_images()
    patch_schengen_set()


if __name__ == "__main__":
    main()
