/**
 * GET /api/admin/scan/cron
 *
 * Called by Vercel Cron on a schedule (see vercel.json). Runs only when
 * BOTH conditions are met:
 *   • SCAN_ENABLED=true   (master kill switch)
 *   • OPENAI_API_KEY set  (no key, no spend)
 *
 * Verifies the Vercel-cron secret header so this endpoint can't be triggered
 * by a random visitor with the URL. (Vercel sets `x-vercel-cron-signature`
 * automatically; we also accept a manual `CRON_SECRET` for testing.)
 *
 * Scans every (city, enabled-section) pair whose last finding-detection or
 * city `lastReviewed` is older than the section cadence. Caps spend by
 * stopping after MAX_SCANS_PER_RUN.
 */

import { NextResponse, type NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  SECTION_CONFIG,
  configFor,
  isMasterEnabled,
  type SectionKey,
} from "@/lib/admin/scanConfig";
import { scanCitySection } from "@/lib/admin/scanner";
import { readFindings, writeFindings } from "@/lib/admin/findingsPersist";
import type { Finding } from "@/lib/admin/findings";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";
export const maxDuration = 60;

const MAX_SCANS_PER_RUN = 30;

interface CityRow {
  id: string;
  city: string;
  country: string;
  lastReviewed: string;
  [k: string]: unknown;
}

function daysSinceISO(iso: string | undefined, now: Date): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const t = Date.parse(iso);
  if (isNaN(t)) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - t) / (1000 * 60 * 60 * 24));
}

function daysSinceYearMonth(ym: string, now: Date): number {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - Date.UTC(y, m - 1, 1)) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  // Auth: Vercel cron sets x-vercel-cron header. For local/manual testing, accept ?secret=<CRON_SECRET>.
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const manualSecret = new URL(req.url).searchParams.get("secret");
  const expected = process.env.CRON_SECRET;
  const okSecret = expected && manualSecret && expected === manualSecret;
  if (!isVercelCron && !okSecret) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!isMasterEnabled()) {
    return NextResponse.json({ skipped: "SCAN_ENABLED=false" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ skipped: "OPENAI_API_KEY missing" });
  }

  const cities = JSON.parse(readFileSync(path.join(process.cwd(), "data/cities.json"), "utf8")) as CityRow[];
  const findingsFile = readFindings();
  const now = new Date();

  // Map of cityId × section → most recent detectedAt for an OPEN finding,
  // so we can avoid re-scanning sections that already have a fresh finding.
  const lastDetected = new Map<string, string>();
  for (const f of findingsFile.findings) {
    const key = `${f.cityId}::${f.section}`;
    const cur = lastDetected.get(key);
    if (!cur || f.detectedAt > cur) lastDetected.set(key, f.detectedAt);
  }

  type Target = { city: CityRow; section: SectionKey; staleness: number };
  const targets: Target[] = [];

  for (const city of cities) {
    for (const sectionKey of Object.keys(SECTION_CONFIG) as SectionKey[]) {
      const cfg = configFor(sectionKey);
      if (!cfg.enabled) continue;
      if (!(sectionKey in city)) continue;

      const key = `${city.id}::${sectionKey}`;
      const sinceDetected = daysSinceISO(lastDetected.get(key), now);
      const sinceReview   = daysSinceYearMonth(city.lastReviewed, now);
      const staleness     = Math.min(sinceDetected, sinceReview);
      if (staleness >= cfg.cadenceDays) {
        targets.push({ city, section: sectionKey, staleness });
      }
    }
  }

  // Most stale first, hard cap so a single cron run can't burn through budget.
  targets.sort((a, b) => b.staleness - a.staleness);
  const toRun = targets.slice(0, MAX_SCANS_PER_RUN);

  const newFindings: Finding[] = [];
  const errors: Array<{ cityId: string; section: string; error: string }> = [];
  for (const { city, section } of toRun) {
    try {
      const out = await scanCitySection(city, section);
      newFindings.push(...out);
    } catch (err) {
      errors.push({ cityId: city.id, section, error: (err as Error).message });
    }
  }

  const previous = findingsFile.isDemo ? [] : findingsFile.findings;
  const byId = new Map<string, Finding>();
  for (const p of previous) byId.set(p.id, p);
  const touched = new Set(newFindings.map(f => f.id));
  for (const nf of newFindings) byId.set(nf.id, nf);
  for (const [id, f] of byId.entries()) {
    if (f.status === "open" && !touched.has(id) && toRun.some(t => t.city.id === f.cityId && t.section === f.section)) {
      byId.set(id, { ...f, status: "stale", resolvedAt: new Date().toISOString() });
    }
  }

  await writeFindings(
    { generatedAt: now.toISOString(), isDemo: false, findings: [...byId.values()] },
    `chore(scan-cron): ${newFindings.length} new finding(s) from ${toRun.length} scan(s)`,
    "cron@famirelo.com",
  );

  return NextResponse.json({
    ok: true,
    candidates: targets.length,
    scanned: toRun.length,
    newFindings: newFindings.length,
    errors,
  });
}
