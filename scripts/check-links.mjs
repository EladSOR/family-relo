/**
 * Simple broken-link checker for relocation data.
 * Scans data/cities.json and data/countries.json for every { url } field,
 * then makes a HEAD request to each unique URL and prints OK / REDIRECT / BROKEN.
 *
 * Usage:  node scripts/check-links.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ── Collect every { url, label } pair from a JSON value, recursively ─────────

function collectUrls(value, results = []) {
  if (!value || typeof value !== "object") return results;
  if (Array.isArray(value)) {
    value.forEach(v => collectUrls(v, results));
    return results;
  }
  if (typeof value.url === "string" && value.url.startsWith("http")) {
    results.push({ url: value.url, label: value.label ?? "" });
  }
  for (const v of Object.values(value)) collectUrls(v, results);
  return results;
}

function dedup(entries) {
  const seen = new Set();
  return entries.filter(({ url }) => (seen.has(url) ? false : seen.add(url)));
}

// ── Check a single URL ────────────────────────────────────────────────────────

async function check(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": "FamilyRelo-LinkChecker/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status >= 200 && res.status < 300) return { status: "OK",       code: res.status };
    if (res.status >= 300 && res.status < 400) return { status: "REDIRECT", code: res.status };
    return                                            { status: "BROKEN",   code: res.status };
  } catch (err) {
    return { status: "BROKEN", code: err.message };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const DATA_FILES = ["data/cities.json", "data/countries.json"];

const entries = dedup(
  DATA_FILES.flatMap(f =>
    collectUrls(JSON.parse(readFileSync(resolve(root, f), "utf8")))
  )
);

console.log(`\nChecking ${entries.length} unique URLs...\n`);

const ICON = { OK: "✓", REDIRECT: "→", BROKEN: "✗" };
const counts = { OK: 0, REDIRECT: 0, BROKEN: 0 };

for (const { url, label } of entries) {
  const { status, code } = await check(url);
  counts[status]++;
  const icon    = ICON[status];
  const tag     = status.padEnd(8);
  const suffix  = label ? `  (${label})` : "";
  console.log(`${icon} ${tag} [${code}]  ${url}${suffix}`);
}

console.log(`\n─────────────────────────────────────────`);
console.log(`  ✓ OK        ${counts.OK}`);
console.log(`  → REDIRECT  ${counts.REDIRECT}`);
console.log(`  ✗ BROKEN    ${counts.BROKEN}`);
console.log(`─────────────────────────────────────────\n`);
