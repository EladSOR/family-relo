/**
 * PATCH /api/admin/findings/[id]
 * Body: { action: "approve" | "reject" }
 *
 * approve → apply the proposed value to cities.json at the finding's
 *           fieldPath, commit to main, mark the finding "approved".
 * reject  → mark the finding "rejected". No cities.json change.
 *
 * fieldPath supports a tiny dot/index subset:
 *   "visa.options[0].details[2]"
 *   "housing.typicalPrices[1]"
 *   "safety.score"
 *
 * We deliberately don't try to handle deeply nested structural rewrites —
 * only scalar leaf swaps. Anything else is rejected with a clear error so
 * the admin edits the JSON manually.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { getFile, putFile } from "@/lib/admin/github";
import { readFindings, writeFindings } from "@/lib/admin/findingsPersist";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";

function setAtPath(root: unknown, dotPath: string, newValue: string): { ok: true } | { ok: false; reason: string } {
  // Split "a.b[2].c" into tokens: ["a", "b", "[2]", "c"]
  const parts = dotPath.split(/\.|(\[\d+\])/g).filter(Boolean);
  let cursor: unknown = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    cursor = stepInto(cursor, p);
    if (cursor === undefined) return { ok: false, reason: `Path ${dotPath} not found at segment "${p}"` };
  }
  const last = parts[parts.length - 1];
  const idxMatch = last.match(/^\[(\d+)\]$/);
  if (idxMatch && Array.isArray(cursor)) {
    cursor[Number(idxMatch[1])] = newValue;
    return { ok: true };
  }
  if (cursor && typeof cursor === "object" && !Array.isArray(cursor)) {
    const obj = cursor as Record<string, unknown>;
    if (!(last in obj)) return { ok: false, reason: `Field "${last}" not present` };
    const existing = obj[last];
    if (typeof existing !== "string" && typeof existing !== "number") {
      return { ok: false, reason: `Field "${last}" is not a scalar — edit manually.` };
    }
    obj[last] = typeof existing === "number" && /^-?\d+(\.\d+)?$/.test(newValue) ? Number(newValue) : newValue;
    return { ok: true };
  }
  return { ok: false, reason: `Cannot set ${dotPath} — parent is not an object/array` };
}

function stepInto(value: unknown, token: string): unknown {
  if (value === undefined || value === null) return undefined;
  const idxMatch = token.match(/^\[(\d+)\]$/);
  if (idxMatch) {
    if (!Array.isArray(value)) return undefined;
    return value[Number(idxMatch[1])];
  }
  if (typeof value !== "object") return undefined;
  return (value as Record<string, unknown>)[token];
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  const { id } = await ctx.params;

  let body: { action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const action = body.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
  }

  const findingsFile = readFindings();
  const finding = findingsFile.findings.find(f => f.id === id);
  if (!finding) return NextResponse.json({ error: `Finding '${id}' not found` }, { status: 404 });
  if (finding.status !== "open") {
    return NextResponse.json({ error: `Finding already ${finding.status}` }, { status: 409 });
  }

  // ── Reject path ──
  if (action === "reject") {
    const updated = findingsFile.findings.map(f =>
      f.id === id ? { ...f, status: "rejected" as const, resolvedAt: new Date().toISOString() } : f
    );
    await writeFindings(
      { ...findingsFile, isDemo: false, findings: updated },
      `chore(scan): reject ${finding.cityName}/${finding.section} finding`,
      admin.email,
    );
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // ── Approve path: read cities.json from GitHub, patch, commit, then mark finding approved ──
  let citiesFile: { sha: string; text: string };
  try {
    citiesFile = await getFile("data/cities.json");
  } catch (err) {
    return NextResponse.json({ error: `Read cities.json failed: ${(err as Error).message}` }, { status: 502 });
  }

  let cities: Array<Record<string, unknown>>;
  try { cities = JSON.parse(citiesFile.text); } catch (err) {
    return NextResponse.json({ error: `cities.json invalid: ${(err as Error).message}` }, { status: 500 });
  }

  const cityIdx = cities.findIndex(c => c.id === finding.cityId);
  if (cityIdx < 0) return NextResponse.json({ error: `City ${finding.cityId} not found` }, { status: 404 });

  const result = setAtPath(cities[cityIdx], finding.fieldPath, finding.proposedValue);
  if (!result.ok) {
    return NextResponse.json({ error: `Cannot apply proposal: ${result.reason}` }, { status: 422 });
  }

  // Also bump that city's lastReviewed
  const now = new Date();
  cities[cityIdx].lastReviewed = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  try {
    await putFile({
      path: "data/cities.json",
      text: JSON.stringify(cities, null, 2) + "\n",
      sha: citiesFile.sha,
      message: `chore(content): apply scanner finding for ${finding.cityName} (${finding.section})`,
      authorName:  admin.email.split("@")[0],
      authorEmail: admin.email,
    });
  } catch (err) {
    return NextResponse.json({ error: `Commit failed: ${(err as Error).message}` }, { status: 502 });
  }

  const updatedFindings = findingsFile.findings.map(f =>
    f.id === id ? { ...f, status: "approved" as const, resolvedAt: new Date().toISOString() } : f
  );
  await writeFindings(
    { ...findingsFile, isDemo: false, findings: updatedFindings },
    `chore(scan): approve ${finding.cityName}/${finding.section} finding`,
    admin.email,
  );

  return NextResponse.json({ ok: true, status: "approved" });
}
