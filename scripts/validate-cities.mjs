#!/usr/bin/env node
/**
 * City data validator for data/cities.json
 * Run: npm run validate-cities
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Config ─────────────────────────────────────────────────────────────────

const REQUIRED_TOP_LEVEL = [
  "id", "citySlug", "countrySlug", "city", "country",
  "tagline", "summary", "lastReviewed",
  "actionChecklist", "familyFit",
  "housing", "schools", "childcare", "healthcare", "safety",
  "cost", "residency", "banking", "sources",
];

const REQUIRED_SECTION_FIELDS = {
  housing:    ["status", "summary", "searchPortals"],
  schools:    ["status", "summary"],
  childcare:  ["status", "summary"],
  healthcare: ["status", "summary"],
  safety:     ["status", "score", "summary"],
  cost:       ["rentRange", "familyDinner", "nannyRate"],
  residency:  ["items"],
  banking:    ["items"],
};

const VALID_TARGET_SECTIONS = new Set([
  "visa", "housing", "schools", "residency",
  "banking", "healthcare", "childcare", "safety",
]);

// Trusted Spain/Portugal housing portal domains — already in use in the project
const TRUSTED_HOUSING_DOMAINS = new Set([
  "www.idealista.com",
  "www.fotocasa.es",
  "www.habitaclia.com",
  "www.pisos.com",
  "www.idealista.pt",
  "www.imovirtual.com",
  "www.casa.sapo.pt",
]);

// Patterns that indicate a plain-text Facebook mention (not converted to Google search)
const PLAIN_FACEBOOK_PATTERNS = [
  /facebook\.com\/groups/i,
  /\bfacebook\b(?!.*google\.com\/search)/i,
  /\bFB group\b/i,
];

// ── Helpers ────────────────────────────────────────────────────────────────

function isGoogleSearchUrl(url) {
  return typeof url === "string" && url.startsWith("https://www.google.com/search?q=");
}

function isTrustedHousingDomain(url) {
  try {
    const host = new URL(url).hostname;
    return TRUSTED_HOUSING_DOMAINS.has(host);
  } catch {
    return false;
  }
}

function isAllowedPortalUrl(url) {
  return isGoogleSearchUrl(url) || isTrustedHousingDomain(url);
}

/**
 * Recursively collect text strings that should be checked for plain-text
 * Facebook mentions, but SKIP label fields on objects that already have a
 * Google search URL — those labels can legitimately describe the Facebook group
 * being searched for.
 */
function collectPlainTextStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectPlainTextStrings);
  if (value && typeof value === "object") {
    const result = [];
    for (const [k, v] of Object.entries(value)) {
      // Skip "label" fields on objects whose "url" is already a Google search URL
      if (k === "label" && isGoogleSearchUrl(value.url)) continue;
      result.push(...collectPlainTextStrings(v));
    }
    return result;
  }
  return [];
}

// ── Load data ──────────────────────────────────────────────────────────────

const citiesPath = resolve(ROOT, "data/cities.json");
const constantsPath = resolve(ROOT, "lib/constants.ts");

let cities;
try {
  cities = JSON.parse(readFileSync(citiesPath, "utf8"));
} catch (e) {
  console.error(`❌  Cannot parse data/cities.json: ${e.message}`);
  process.exit(1);
}

// Extract CITY_IMAGES keys from constants.ts via regex (no TS compilation needed)
let cityImageKeys = new Set();
try {
  const src = readFileSync(constantsPath, "utf8");
  // Only keep entries inside the CITY_IMAGES block
  const block = src.match(/CITY_IMAGES[^=]*=\s*\{([^}]+)\}/s)?.[1] ?? "";
  const blockKeys = [...block.matchAll(/"([^"]+)"\s*:/g)].map((m) => m[1]);
  cityImageKeys = new Set(blockKeys);

  // Also extract the actual URLs to flag empty ones
  var cityImageUrls = {};
  for (const m of block.matchAll(/"([^"]+)"\s*:\s*"([^"]*)"/g)) {
    cityImageUrls[m[1]] = m[2];
  }
} catch (e) {
  console.error(`⚠️   Cannot read lib/constants.ts — image checks skipped: ${e.message}`);
}

// ── Validate ───────────────────────────────────────────────────────────────

let totalIssues = 0;
const results = [];

for (const city of cities) {
  const name = city.city ?? city.id ?? "(unknown)";
  const issues = [];

  // 1. Required top-level fields
  for (const field of REQUIRED_TOP_LEVEL) {
    if (city[field] === undefined || city[field] === null) {
      issues.push(`Missing top-level field: "${field}"`);
    }
  }

  // 2. Required section fields
  for (const [section, fields] of Object.entries(REQUIRED_SECTION_FIELDS)) {
    const sec = city[section];
    if (!sec) continue; // already caught by rule 1
    for (const field of fields) {
      if (sec[field] === undefined || sec[field] === null) {
        issues.push(`[${section}] Missing field: "${field}"`);
      }
    }
  }

  // 3. actionChecklist targetSection values
  if (Array.isArray(city.actionChecklist)) {
    city.actionChecklist.forEach((item, i) => {
      if (!item.targetSection) {
        issues.push(`[actionChecklist #${i + 1}] Missing targetSection`);
      } else if (!VALID_TARGET_SECTIONS.has(item.targetSection)) {
        issues.push(
          `[actionChecklist #${i + 1}] Invalid targetSection: "${item.targetSection}" ` +
          `(valid: ${[...VALID_TARGET_SECTIONS].join(", ")})`
        );
      }
    });
  }

  // 4. housing.searchPortals URL allow-list
  if (Array.isArray(city.housing?.searchPortals)) {
    city.housing.searchPortals.forEach((portal, i) => {
      const url = portal.url;
      if (!url) {
        issues.push(`[housing.searchPortals #${i + 1}] Missing URL (label: "${portal.label}")`);
      } else if (!isAllowedPortalUrl(url)) {
        issues.push(
          `[housing.searchPortals #${i + 1}] Risky/unknown URL: "${url}" — ` +
          `must be a Google search URL or trusted Spain/Portugal domain`
        );
      }
    });
  }

  // 5. Plain-text Facebook mentions anywhere in the city object
  //    (labels on portals with Google search URLs are intentionally excluded)
  const allTextValues = collectPlainTextStrings(city);
  for (const text of allTextValues) {
    if (typeof text !== "string") continue;
    // Skip if it's already inside a google search URL (fine)
    if (text.includes("google.com/search")) continue;
    if (PLAIN_FACEBOOK_PATTERNS.some((re) => re.test(text))) {
      const snippet = text.length > 100 ? text.slice(0, 100) + "…" : text;
      issues.push(`Plain-text Facebook mention (not converted to search fallback): "${snippet}"`);
    }
  }

  // 6. Image checks — each city needs `CITY_IMAGES[city]` or `heroImage` (https URL)
  if (cityImageKeys.size > 0) {
    const heroOk =
      typeof city.heroImage === "string" &&
      city.heroImage.startsWith("https://") &&
      city.heroImage.length > 12;
    if (!cityImageKeys.has(name) && !heroOk) {
      issues.push(
        `Missing hero image: add CITY_IMAGES["${name}"] in lib/constants.ts or set "heroImage" on the city`,
      );
    } else if (cityImageKeys.has(name) && cityImageUrls && cityImageUrls[name] === "") {
      issues.push(`Empty image URL in lib/constants.ts for "${name}"`);
    }
  }

  results.push({ name, issues });
  totalIssues += issues.length;
}

// ── Report ─────────────────────────────────────────────────────────────────

const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

console.log(`\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
console.log(`${BOLD}  City Data Validator — data/cities.json${RESET}`);
console.log(`${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

for (const { name, issues } of results) {
  if (issues.length === 0) {
    console.log(`  ${GREEN}✓ PASS${RESET}  ${name}`);
  } else {
    console.log(`  ${RED}✗ FAIL${RESET}  ${BOLD}${name}${RESET}  ${DIM}(${issues.length} issue${issues.length > 1 ? "s" : ""})${RESET}`);
    for (const issue of issues) {
      console.log(`         ${YELLOW}→${RESET} ${issue}`);
    }
  }
}

console.log(`\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

if (totalIssues === 0) {
  console.log(`\n  ${GREEN}${BOLD}All ${results.length} cities passed validation.${RESET}\n`);
} else {
  const failCount = results.filter((r) => r.issues.length > 0).length;
  console.log(
    `\n  ${RED}${BOLD}${totalIssues} issue${totalIssues > 1 ? "s" : ""} found across ${failCount}/${results.length} cities.${RESET}\n`
  );
  process.exit(1);
}
