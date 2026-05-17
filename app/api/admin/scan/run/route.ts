/**
 * POST /api/admin/scan/run
 * Body: { cityId?: string; section?: string }
 *
 * Manual on-demand scan. Always runs (bypasses the section `enabled` flag)
 * so the admin can spot-check without flipping the kill switch.
 *
 * • cityId + section → scan exactly one (cost: ~$0.005).
 * • cityId only      → scan every enabled section for that city.
 * • neither          → scan every enabled section for every city (full sweep).
 *
 * Findings are merged into data/scan-findings.json on disk:
 *   • New findings → appended.
 *   • Findings with the same id as a previous open finding → updated.
 *   • Old "open" findings not re-emitted by this scan → marked "stale".
 *
 * Note: writes the findings file LOCALLY (process.cwd()), which on Vercel
 * means within the serverless function's ephemeral filesystem. On Vercel
 * we'll commit findings back to the repo in a follow-up step — for V1 we
 * stash them in-memory and persist via the GitHub Contents API just like
 * the mark-reviewed flow. See lib/admin/findingsPersist.ts.
 */

import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getAdminUser } from "@/lib/admin/auth";
import { SECTION_CONFIG, type SectionKey } from "@/lib/admin/scanConfig";
import { scanCitySection } from "@/lib/admin/scanner";
import { readFindings, writeFindings } from "@/lib/admin/findingsPersist";
import type { Finding } from "@/lib/admin/findings";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";
export const maxDuration = 60;

interface CityRow {
  id: string;
  city: string;
  country: string;
  [k: string]: unknown;
}

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured — scanner cannot run." },
      { status: 412 },
    );
  }

  let body: { cityId?: string; section?: string } = {};
  try { body = await req.json(); } catch { /* empty body is fine */ }

  const cities = JSON.parse(readFileSync(path.join(process.cwd(), "data/cities.json"), "utf8")) as CityRow[];

  // Decide what to scan
  const targets: Array<{ city: CityRow; section: SectionKey }> = [];
  const enabledSections = (Object.keys(SECTION_CONFIG) as SectionKey[])
    .filter(s => SECTION_CONFIG[s].enabled);

  if (body.cityId && body.section) {
    const city = cities.find(c => c.id === body.cityId);
    if (!city) return NextResponse.json({ error: `City '${body.cityId}' not found` }, { status: 404 });
    targets.push({ city, section: body.section as SectionKey });
  } else if (body.cityId) {
    const city = cities.find(c => c.id === body.cityId);
    if (!city) return NextResponse.json({ error: `City '${body.cityId}' not found` }, { status: 404 });
    for (const s of enabledSections) targets.push({ city, section: s });
  } else {
    for (const city of cities) for (const s of enabledSections) targets.push({ city, section: s });
  }

  if (targets.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "No sections enabled — nothing to scan. Toggle sections on first.",
      newFindings: 0,
    });
  }

  // Cost-safety: cap to 30 scans per request so a misclick doesn't blow $5.
  const SAFETY_CAP = 30;
  const wasCapped = targets.length > SAFETY_CAP;
  const toRun = targets.slice(0, SAFETY_CAP);

  const newFindings: Finding[] = [];
  const errors: Array<{ cityId: string; section: string; error: string }> = [];

  for (const { city, section } of toRun) {
    try {
      const found = await scanCitySection(city, section, { force: true });
      newFindings.push(...found);
    } catch (err) {
      errors.push({ cityId: city.id, section, error: (err as Error).message });
    }
  }

  const existing = readFindings();
  const previous = existing.isDemo ? [] : existing.findings;

  const byId = new Map<string, Finding>();
  for (const p of previous) byId.set(p.id, p);

  const touchedIds = new Set(newFindings.map(f => f.id));
  for (const nf of newFindings) byId.set(nf.id, nf);
  for (const [id, f] of byId.entries()) {
    if (f.status === "open" && !touchedIds.has(id)) {
      byId.set(id, { ...f, status: "stale", resolvedAt: new Date().toISOString() });
    }
  }

  const persisted = await writeFindings(
    {
      generatedAt: new Date().toISOString(),
      isDemo: false,
      findings: [...byId.values()],
    },
    `chore(scan): ${newFindings.length} new finding(s) from ${toRun.length} scan(s)`,
    admin.email,
  );

  return NextResponse.json({
    ok: true,
    scanned: toRun.length,
    newFindings: newFindings.length,
    persisted: persisted.committed ? "github" : "local-filesystem",
    errors,
    capped: wasCapped ? `Limited to ${SAFETY_CAP} of ${targets.length} requested.` : null,
  });
}
