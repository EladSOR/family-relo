/**
 * POST /api/admin/revert
 * Body: { commitSha: string }
 *
 * Restores data/cities.json to the state it was in *before* the given
 * commit. The revert lands as a new commit on `main`, so the change is
 * fully recoverable (you can revert the revert).
 *
 * Auth: ADMIN_EMAILS allowlist only. Anyone else → 404.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { revertCitiesJsonAt } from "@/lib/admin/github";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) return new NextResponse("Not Found", { status: 404 });

  let body: { commitSha?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const commitSha = (body.commitSha ?? "").trim();
  if (!/^[0-9a-f]{7,40}$/i.test(commitSha)) {
    return NextResponse.json({ error: "commitSha required (7–40 hex chars)" }, { status: 400 });
  }

  try {
    const { commitSha: newSha } = await revertCitiesJsonAt(commitSha);
    return NextResponse.json({ ok: true, commitSha: newSha });
  } catch (err) {
    return NextResponse.json(
      { error: `Revert failed: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
