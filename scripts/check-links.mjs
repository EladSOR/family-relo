/**
 * Broken-link checker for relocation data.
 *
 * Scans data/cities.json and data/countries.json for every { url } field that
 * is `isVerified: true` (or has no `isVerified` field), HEADs each one, and:
 *   1. Prints a human-readable report to stdout.
 *   2. Writes data/link-health-report.json — consumed by the admin dashboard
 *      to surface broken links per city/section.
 *
 * Exit code:
 *   0   no broken links (redirects allowed)
 *   1   one or more BROKEN URLs OR any unexpected error
 *
 * Usage:
 *   node scripts/check-links.mjs            # check + write report
 *   node scripts/check-links.mjs --no-write # report only, don't update JSON
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NO_WRITE = process.argv.includes("--no-write");

// ── Tunables ─────────────────────────────────────────────────────────────────

const TIMEOUT_MS         = 10_000;
const PER_HOST_DELAY_MS  = 2_000;        // rate limit: 1 req/host/2s
const CONCURRENT_HOSTS   = 6;            // run N hosts in parallel, sequential per host
const USER_AGENT         = "FamiRelo-LinkChecker/1.0 (+https://famirelo.com)";

// ── Collect every URL with breadcrumb path + scope (city/country) ────────────

/**
 * Recursively walk a JSON value, yielding every { url } object we find along
 * with the path of keys taken to reach it. We skip anything explicitly marked
 * `isVerified: false`.
 *
 * Returns: [{ url, label, path, scope, scopeId, scopeName, section }]
 */
function collectFromValue(value, breadcrumb, scope, scopeId, scopeName, out) {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((v, i) => collectFromValue(v, [...breadcrumb, String(i)], scope, scopeId, scopeName, out));
    return;
  }

  // Found a link object
  if (typeof value.url === "string" && value.url.startsWith("http")) {
    if (value.isVerified !== false) {
      const sectionKey = breadcrumb.find(seg => isNaN(Number(seg))) || "root";
      out.push({
        url: value.url,
        label: value.label ?? "",
        path: breadcrumb.join("."),
        scope,
        scopeId,
        scopeName,
        section: sectionKey,
      });
    }
  }

  for (const [k, v] of Object.entries(value)) {
    collectFromValue(v, [...breadcrumb, k], scope, scopeId, scopeName, out);
  }
}

function collectCityLinks(cities) {
  const out = [];
  for (const city of cities) {
    collectFromValue(city, [], "city", city.id, `${city.city}, ${city.country}`, out);
  }
  return out;
}

function collectCountryLinks(countries) {
  const out = [];
  for (const [slug, country] of Object.entries(countries)) {
    collectFromValue(country, [], "country", slug, country.name ?? slug, out);
  }
  return out;
}

// ── HEAD-check one URL ───────────────────────────────────────────────────────

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status >= 200 && res.status < 300) return { status: "OK",       code: res.status };
    if (res.status >= 300 && res.status < 400) {
      return { status: "REDIRECT", code: res.status, redirectTo: res.headers.get("location") ?? "" };
    }
    // Some servers (esp. government, cloudflare-fronted) reject HEAD with 4xx.
    // Re-try as GET with stream-cancel to confirm.
    if (res.status === 403 || res.status === 405 || res.status === 501) {
      try {
        const get = await fetch(url, {
          method: "GET",
          redirect: "manual",
          headers: { "User-Agent": USER_AGENT, "Accept": "text/html" },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (get.status >= 200 && get.status < 300) return { status: "OK", code: get.status };
        if (get.status >= 300 && get.status < 400) {
          return { status: "REDIRECT", code: get.status, redirectTo: get.headers.get("location") ?? "" };
        }
        return { status: "BROKEN", code: get.status };
      } catch (err) {
        return { status: "BROKEN", code: err instanceof Error ? err.message : "unknown" };
      }
    }
    return { status: "BROKEN", code: res.status };
  } catch (err) {
    return { status: "BROKEN", code: err instanceof Error ? err.message : "unknown" };
  }
}

// ── Per-host queue: group by hostname, run hosts in parallel, sequential per host ─

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return "invalid"; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runHostQueue(hostname, entries) {
  const results = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const result = await checkUrl(entry.url);
    results.push({ ...entry, ...result });
    if (i < entries.length - 1) await sleep(PER_HOST_DELAY_MS);
  }
  return results;
}

async function runAll(entries) {
  const byHost = new Map();
  for (const e of entries) {
    const h = hostOf(e.url);
    if (!byHost.has(h)) byHost.set(h, []);
    byHost.get(h).push(e);
  }

  const hosts = [...byHost.entries()];
  const all = [];

  for (let i = 0; i < hosts.length; i += CONCURRENT_HOSTS) {
    const batch = hosts.slice(i, i + CONCURRENT_HOSTS);
    const settled = await Promise.all(batch.map(([h, items]) => runHostQueue(h, items)));
    for (const arr of settled) all.push(...arr);
    process.stdout.write(`  …processed ${Math.min(i + CONCURRENT_HOSTS, hosts.length)}/${hosts.length} hosts\n`);
  }
  return all;
}

// ── Dedup, but keep ALL locations so we can show "broken in 3 cities" ────────
// The same URL may appear in multiple cities — we still only HEAD once, but
// the report retains every occurrence so the dashboard can group correctly.

function dedupForCheck(entries) {
  const seen = new Map();
  for (const e of entries) {
    if (!seen.has(e.url)) seen.set(e.url, e);
  }
  return [...seen.values()];
}

function expandResults(results, allEntries) {
  // Map url → result; then re-emit one record per occurrence.
  const byUrl = new Map(results.map(r => [r.url, { status: r.status, code: r.code, redirectTo: r.redirectTo }]));
  return allEntries.map(e => ({ ...e, ...(byUrl.get(e.url) ?? { status: "UNKNOWN", code: 0 }) }));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const cities    = JSON.parse(readFileSync(resolve(root, "data/cities.json"),    "utf8"));
  const countries = JSON.parse(readFileSync(resolve(root, "data/countries.json"), "utf8"));

  const allEntries = [
    ...collectCityLinks(cities),
    ...collectCountryLinks(countries),
  ];

  const uniqueEntries = dedupForCheck(allEntries);
  console.log(`\nChecking ${uniqueEntries.length} unique URLs across ${allEntries.length} occurrences...\n`);

  const uniqueResults = await runAll(uniqueEntries);
  const fullResults   = expandResults(uniqueResults, allEntries);

  // ── Console summary ──
  const ICON   = { OK: "✓", REDIRECT: "→", BROKEN: "✗", UNKNOWN: "?" };
  const counts = { OK: 0, REDIRECT: 0, BROKEN: 0, UNKNOWN: 0 };
  for (const r of uniqueResults) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
    const tag    = r.status.padEnd(8);
    const suffix = r.label ? `  (${r.label})` : "";
    console.log(`${ICON[r.status]} ${tag} [${r.code}]  ${r.url}${suffix}`);
  }
  console.log(`\n─────────────────────────────────────────`);
  console.log(`  ✓ OK        ${counts.OK}`);
  console.log(`  → REDIRECT  ${counts.REDIRECT}`);
  console.log(`  ✗ BROKEN    ${counts.BROKEN}`);
  console.log(`─────────────────────────────────────────\n`);

  // ── Structured report ──
  const broken   = fullResults.filter(r => r.status === "BROKEN");
  const redirects = fullResults.filter(r => r.status === "REDIRECT");

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      uniqueUrls:    uniqueEntries.length,
      occurrences:   allEntries.length,
      ok:            counts.OK,
      redirect:      counts.REDIRECT,
      broken:        counts.BROKEN,
    },
    broken:    broken.map(stripForReport),
    redirects: redirects.map(stripForReport),
  };

  if (!NO_WRITE) {
    const out = resolve(root, "data/link-health-report.json");
    writeFileSync(out, JSON.stringify(report, null, 2) + "\n", "utf8");
    console.log(`Report written → data/link-health-report.json`);
  }

  process.exit(counts.BROKEN > 0 ? 1 : 0);
}

function stripForReport(r) {
  return {
    url: r.url,
    label: r.label,
    code: r.code,
    redirectTo: r.redirectTo,
    scope: r.scope,
    scopeId: r.scopeId,
    scopeName: r.scopeName,
    section: r.section,
    path: r.path,
  };
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
