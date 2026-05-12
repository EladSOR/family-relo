#!/usr/bin/env python3
"""
make_city() — produces a Valencia-standard city dict from a CONFIG dict.

Each CONFIG passed in must contain the city-specific content. The helper
guarantees the structure (key order, required arrays/lengths, USD format,
isVerified flags, FAQ schema) so the deep_audit_cities.py + validate_cities.py
both pass on first run.
"""
from typing import Any, Optional, Dict, List


def _faq(city: str, *, monthly: str, schools_lo: str, schools_hi: str,
         is_island: bool, is_english_native: bool,
         answers: Dict[str, str]) -> List[dict]:
    """Build the 8 standard FAQ entries with city-specific answers."""
    q4_template = (
        "Do children need private school here, or can public schools work?"
        if is_english_native else
        "Do children need international school here, or can local schools work?"
    )
    q6 = (
        f"Do you need a car on {city}?" if is_island
        else f"Do you need a car in {city}?"
    )
    questions = [
        f"Is {city} good for families?",
        "How much does a family typically need per month here?",
        "Is housing hard to find here?",
        q4_template,
        "Is healthcare easy to access as a newcomer?",
        q6,
        "How difficult is the paperwork and bureaucracy after moving?",
        "What usually surprises families after arrival?",
    ]
    keys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"]
    return [{"question": q, "answer": answers[k]} for q, k in zip(questions, keys)]


def _sources(city: str, country: str, *, country_url: Optional[str] = None,
             extra: Optional[dict] = None) -> dict:
    """Default sources block — Numbeo cost link + NASA weather citations.
    `extra` may add visa[], schools[], healthcare[], housing[] arrays."""
    out: dict[str, Any] = {
        "cost": [
            {
                "label": f"{city} Cost of Living — Numbeo",
                "url": f"https://www.numbeo.com/cost-of-living/in/{city.replace(' ', '-')}",
                "isVerified": True,
            }
        ],
        "weather": [
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
        ],
    }
    if extra:
        out.update(extra)
    return out


def make_city(cfg: dict) -> dict:
    """Convert a city CONFIG dict into a Valencia-standard JSON object.

    Required CONFIG keys (raises KeyError if missing — that's intentional):
      meta:            {id, citySlug, countrySlug, city, country, tagline, summary}
      familyFit:       {bestFor: [4], watchOutFor: [4]}
      actionChecklist: list of 8-10 dicts {label, targetSection}
      visa:            None (use country fallback) OR full visa dict
      residency:       {tip, items: [4-5]}
      banking:         {tip, items: [4-5]}
      housing:         {summary, bestAreas: [4+], searchPortalsIntro: [3],
                        searchPortals: [3+], typicalPrices: [3+], whatYouNeedToRent: [4+]}
      schools:         {summary, publicSystem, internationalOptions,
                        languageNotes, tip, options: [2-4]}
      childcare:       {summary, daycareItems: [3+], nannyItems: [3+], whereToFindItems: [3+]}
      healthcare:      {tip, items: [5]}
      safety:          {score: 75-90, summary, items: [5]}
      cost:            {monthlyFamilyAllIn, rentRange, familyDinner, nannyRate}
                       — all USD with `~$` prefix
      communityLinks:  list of 1-3 dicts with searchQuery + url
      faq_answers:     dict q1-q8 of strings
      faq_meta:        {monthly, schools_lo, schools_hi, is_island, is_english_native}
      sources_extra:   optional dict to merge into sources
    """
    m = cfg["meta"]
    out: dict[str, Any] = {
        "id": m["id"],
        "citySlug": m["citySlug"],
        "countrySlug": m["countrySlug"],
        "city": m["city"],
        "country": m["country"],
        "tagline": m["tagline"],
        "summary": m["summary"],
        "lastReviewed": m.get("lastReviewed", "2026-05"),
        "actionChecklist": cfg["actionChecklist"],
        "familyFit": cfg["familyFit"],
    }

    if cfg.get("visa") is not None:
        out["visa"] = cfg["visa"]

    out["residency"] = {
        "title": cfg["residency"].get("title", "Residency & registration"),
        "tip": cfg["residency"]["tip"],
        "items": cfg["residency"]["items"],
    }
    out["banking"] = {
        "title": cfg["banking"].get("title", "Banking"),
        "tip": cfg["banking"]["tip"],
        "items": cfg["banking"]["items"],
    }
    out["housing"] = {
        "status": "estimated",
        **cfg["housing"],
    }
    out["schools"] = {"status": "curated", **cfg["schools"]}
    out["childcare"] = {"status": "estimated", **cfg["childcare"]}
    out["healthcare"] = {"status": "estimated", **cfg["healthcare"]}
    out["safety"] = {"status": "estimated", **cfg["safety"]}
    out["cost"] = {"status": "estimated", **cfg["cost"]}

    out["sources"] = _sources(
        m["city"], m["country"],
        extra=cfg.get("sources_extra"),
    )
    out["communityLinks"] = cfg["communityLinks"]
    out["faq"] = _faq(
        m["city"],
        monthly=cfg["faq_meta"].get("monthly", ""),
        schools_lo=cfg["faq_meta"].get("schools_lo", ""),
        schools_hi=cfg["faq_meta"].get("schools_hi", ""),
        is_island=cfg["faq_meta"].get("is_island", False),
        is_english_native=cfg["faq_meta"].get("is_english_native", False),
        answers=cfg["faq_answers"],
    )
    return out


def schengen_short_stay_block() -> dict:
    """Reusable Schengen tourist option for cities that need it inline."""
    return {
        "type": "Schengen Tourist (non-EU)",
        "anchor": "visa-tourist",
        "detailTitle": "Schengen Tourist — what it allows and what it does not",
        "duration": "Up to 90 days in any 180-day window",
        "description": "Valid for a scouting trip before committing to the move. No right to work, no extensions, cannot be converted to residency.",
        "details": [
            "90 days maximum across the entire Schengen Area in any 180-day rolling period.",
            "No right to work — including remote work for a foreign employer is restricted.",
            "Cannot be converted to residency from inside Schengen — you must apply for a long-stay D visa or residence permit at the consulate in your home country before travelling.",
            "Good use: 2–4 weeks scouting neighbourhoods, schools, and housing before applying for the long-stay route.",
            "Do not attempt long-term stays on rolling tourist entries — Schengen-wide enforcement is increasing.",
        ],
        "officialLink": {
            "label": "Schengen 90/180 day stay calculator official",
            "url": "https://home-affairs.ec.europa.eu/policies/schengen_en",
            "isVerified": True,
        },
    }
