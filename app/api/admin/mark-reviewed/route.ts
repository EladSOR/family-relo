/**
 * POST /api/admin/mark-reviewed
 * Body: { cityId: string }
 *
 * Updates a single city's `lastReviewed` field to the current YYYY-MM in
 * data/cities.json via the GitHub Contents API. The resulting commit on
 * `main` triggers a Vercel rebuild, so the change goes live within ~1 min.
 *
 * Auth: ADMIN_EMAILS allowlist only. Anyone else → 404 (no leak).
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { getFile, putFile } from "@/lib/admin/github";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";

interface CityRow {
  id: string;
  city?: string;
  country?: string;
  lastReviewed?: string;
}

function currentYearMonth(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  let body: { cityId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cityId = (body.cityId ?? "").trim();
  if (!cityId) return NextResponse.json({ error: "cityId required" }, { status: 400 });

  let file: { sha: string; text: string };
  try {
    file = await getFile("data/cities.json");
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to read cities.json: ${(err as Error).message}` },
      { status: 502 },
    );
  }

  let cities: CityRow[];
  try {
    cities = JSON.parse(file.text);
  } catch (err) {
    return NextResponse.json(
      { error: `cities.json is not valid JSON: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  const idx = cities.findIndex(c => c.id === cityId);
  if (idx < 0) return NextResponse.json({ error: `City '${cityId}' not found` }, { status: 404 });

  const ym = currentYearMonth();
  const prev = cities[idx].lastReviewed;
  if (prev === ym) {
    return NextResponse.json({ ok: true, unchanged: true, lastReviewed: ym });
  }
  cities[idx].lastReviewed = ym;

  const newText = JSON.stringify(cities, null, 2) + "\n";
  const label   = cities[idx].city ?? cityId;

  try {
    const { commitSha } = await putFile({
      path: "data/cities.json",
      text: newText,
      sha: file.sha,
      message: `chore(freshness): mark ${label} reviewed (${ym})`,
      authorName:  admin.email.split("@")[0],
      authorEmail: admin.email,
    });
    return NextResponse.json({ ok: true, commitSha, lastReviewed: ym });
  } catch (err) {
    return NextResponse.json(
      { error: `GitHub commit failed: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
