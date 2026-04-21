#!/usr/bin/env python3
"""
Generate monthly climate normals for each city in data/cities.json.

Methodology (reproducible, citable):
  - NASA Prediction of Worldwide Energy Resources (POWER) Climatology API — point endpoint
  - Meteorology: MERRA-2 reanalysis (NASA GMAO), ~0.5° × 0.625° grid
  - Parameters: T2M_MAX_AVG (average of daily maximum 2 m temperature per calendar month),
    T2M_MIN_AVG (average of daily minimum 2 m temperature per calendar month),
    PRECTOTCORR (corrected precipitation, mm/day for the month)
  - Reference period: January 2001 – December 2020 (stated in API response header)

These are grid-cell climatologies near the coordinates — not readings from a city-centre
weather station. Coastal, elevation, and urban heat-island effects can differ.

Geocoding: Open-Meteo Geocoding API (first result matching ISO country code).

Usage:
  python3 scripts/generate_city_weather.py
"""

from __future__ import annotations

import json
import math
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CITIES_PATH = ROOT / "data" / "cities.json"

COUNTRY_CODE = {
    "australia": "AU",
    "austria": "AT",
    "argentina": "AR",
    "canada": "CA",
    "colombia": "CO",
    "costa-rica": "CR",
    "czech-republic": "CZ",
    "denmark": "DK",
    "france": "FR",
    "germany": "DE",
    "greece": "GR",
    "hungary": "HU",
    "indonesia": "ID",
    "ireland": "IE",
    "israel": "IL",
    "italy": "IT",
    "japan": "JP",
    "malaysia": "MY",
    "netherlands": "NL",
    "new-zealand": "NZ",
    "peru": "PE",
    "poland": "PL",
    "portugal": "PT",
    "singapore": "SG",
    "spain": "ES",
    "switzerland": "CH",
    "taiwan": "TW",
    "thailand": "TH",
    "uae": "AE",
    "united-kingdom": "GB",
    "usa": "US",
}

MONTH_KEYS = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
]
MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

# Open-Meteo sometimes misses very small localities — use verified WGS84 coordinates.
MANUAL_COORDS: dict[str, tuple[float, float]] = {
    "santa-teresa-cr": (9.6463, -85.1684),  # Santa Teresa, Puntarenas
}

POWER_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point"
GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"

WEATHER_SOURCES = [
    {
        "label": "NASA POWER — Climatology API (methodology)",
        "url": "https://power.larc.nasa.gov/docs/services/api/temporal/climatology/",
        "isVerified": True,
    },
    {
        "label": "MERRA-2 reanalysis (meteorological source)",
        "url": "https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/",
        "isVerified": True,
    },
]


def http_get_json(url: str, timeout: float = 45.0, attempts: int = 5) -> dict:
    import urllib.error

    last: Exception | None = None
    for i in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "relocation-engine-weather-script/1.1"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode())
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as e:
            last = e
            time.sleep(2.0 * (i + 1))
    raise RuntimeError(f"HTTP failed after {attempts} tries: {url} — {last}")


def geocode_city(city: str, country_slug: str) -> tuple[float, float]:
    cc = COUNTRY_CODE[country_slug]
    q = urllib.parse.urlencode({"name": city, "count": 20, "language": "en"})
    url = f"{GEOCODE_URL}?{q}"
    data = http_get_json(url, timeout=30.0)
    for res in data.get("results") or []:
        if res.get("country_code") == cc:
            return float(res["latitude"]), float(res["longitude"])
    raise RuntimeError(f"No geocoding match for {city!r} in country {cc}")


def fetch_nasa_climatology(lat: float, lon: float) -> dict:
    q = urllib.parse.urlencode(
        {
            "parameters": "T2M_MAX_AVG,T2M_MIN_AVG,PRECTOTCORR",
            "community": "SB",
            "longitude": lon,
            "latitude": lat,
            "format": "JSON",
        }
    )
    return http_get_json(f"{POWER_URL}?{q}")


def safe_float(x) -> float:
    if x is None or (isinstance(x, float) and math.isnan(x)):
        return 0.0
    return float(x)


def months_from_nasa(resp: dict) -> list[dict]:
    params = resp["properties"]["parameter"]
    tmax = params["T2M_MAX_AVG"]
    tmin = params["T2M_MIN_AVG"]
    pday = params["PRECTOTCORR"]

    months_out: list[dict] = []
    for i, mk in enumerate(MONTH_KEYS):
        dim = DAYS_PER_MONTH[i]
        mm_day = safe_float(pday[mk])
        rain_mm = round(mm_day * dim, 1)
        # Approximate wet days from monthly total (no daily series in this endpoint)
        rain_days = min(dim, max(1, round(rain_mm / 12.0)))

        months_out.append(
            {
                "month": i + 1,
                "highC": round(safe_float(tmax[mk]), 1),
                "lowC": round(safe_float(tmin[mk]), 1),
                "rainMm": rain_mm,
                "rainDays": float(rain_days),
            }
        )
    return months_out


def family_highlights(months: list[dict]) -> list[str]:
    hottest = max(months, key=lambda x: x["highC"])
    coldest = min(months, key=lambda x: x["lowC"])
    wettest = max(months, key=lambda x: x["rainMm"])
    driest = min(months, key=lambda x: x["rainMm"])

    lines: list[str] = []

    lines.append(
        f"Warmest month on average: {MONTH_NAMES[hottest['month'] - 1]} "
        f"(mean daily high ~{hottest['highC']:.0f}°C); coolest: {MONTH_NAMES[coldest['month'] - 1]} "
        f"(mean daily low ~{coldest['lowC']:.0f}°C)."
    )
    lines.append(
        f"Most rainfall on average: {MONTH_NAMES[wettest['month'] - 1]} (~{wettest['rainMm']:.0f} mm total); "
        f"driest: {MONTH_NAMES[driest['month'] - 1]} (~{driest['rainMm']:.0f} mm)."
    )

    hot_block = [x for x in months if x["highC"] >= 32]
    if len(hot_block) >= 2:
        names = ", ".join(MONTH_NAMES[x["month"] - 1] for x in sorted(hot_block, key=lambda z: z["month"]))
        lines.append(
            f"Mean daily highs reach about 32°C or more in {names} — plan air-conditioning, shade, "
            "and limited midday outdoor time for babies and young children."
        )

    if any(x["highC"] >= 35 for x in months):
        lines.append(
            "Peak months can average above 35°C for daily highs — schedule playgrounds, walks, and errands for mornings "
            "or evenings when possible."
        )

    if any(x["lowC"] <= 2 for x in months):
        cold_ms = [MONTH_NAMES[x["month"] - 1] for x in months if x["lowC"] <= 2]
        lines.append(
            f"Winter nights can dip near freezing ({', '.join(cold_ms)}) — reliable home heating and warm "
            "layers for school commutes matter for children."
        )

    if wettest["rainMm"] >= 150:
        lines.append(
            "Very wet months mean waterproofs, covered waiting at school pickup, and extra room to dry uniforms and shoes."
        )

    return lines[:6]


def build_weather_record(resp: dict) -> dict:
    geom = resp.get("geometry") or {}
    coords = geom.get("coordinates") or [None, None]
    lon, lat = coords[0], coords[1]
    months = months_from_nasa(resp)

    return {
        "status": "verified",
        "dataSeries": "MERRA-2 (NASA POWER)",
        "normalsPeriod": "2001–2020",
        "gridLatitude": round(float(lat), 5) if lat is not None else None,
        "gridLongitude": round(float(lon), 5) if lon is not None else None,
        "disclaimer": (
            "These values are long-term monthly climatologies from NASA POWER (MERRA-2 reanalysis) for the nearest "
            "model grid cell to these coordinates — not a single city-centre weather station. Spatial resolution is "
            "about 50 km; coastal belts, hills, and dense urban cores can differ. Precipitation is corrected MERRA-2 "
            "rainfall; rainy-day counts are approximated from monthly totals."
        ),
        "months": months,
        "familyHighlights": family_highlights(months),
    }


def write_cities(cities: list[dict]) -> None:
    CITIES_PATH.write_text(json.dumps(cities, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    cities = json.loads(CITIES_PATH.read_text())

    for i, city in enumerate(cities):
        cid = city["id"]
        w = city.get("weather")
        if isinstance(w, dict) and w.get("months") and len(w["months"]) == 12:
            print(f"[{i+1}/{len(cities)}] {cid} — skip (already has weather)", flush=True)
            continue

        print(f"[{i+1}/{len(cities)}] {cid} …", flush=True)

        if cid in MANUAL_COORDS:
            lat, lon = MANUAL_COORDS[cid]
        else:
            lat, lon = geocode_city(city["city"], city["countrySlug"])
            time.sleep(0.4)

        nasa = fetch_nasa_climatology(lat, lon)
        if nasa.get("header") == "The POWER Climatology API failed to complete your request":
            raise RuntimeError(f"NASA POWER error for {cid}: {nasa.get('messages')}")

        city["weather"] = build_weather_record(nasa)

        src = city.setdefault("sources", {})
        src["weather"] = WEATHER_SOURCES

        write_cities(cities)
        print(f"    saved {cid}", flush=True)
        time.sleep(0.6)

    print("Done —", CITIES_PATH)


if __name__ == "__main__":
    main()
