/**
 * POST /api/ads/upload-logo
 *
 * Multipart upload of an advertiser's logo. Server-side validation:
 *   - File must be PNG, JPEG, or SVG
 *   - Max 200 KB
 *   - User must be authenticated
 *
 * On success: uploads to the `ad-logos` Supabase Storage bucket using the
 * service role (anon role has no write permission), and returns the public URL
 * + storage path. The path is later stored in `ad_spots.logo_path` so the
 * admin reject flow can delete the file.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BYTES = 200 * 1024;
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/svg+xml"]);
const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
};

export async function POST(req: NextRequest) {
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Logo must be PNG, JPEG, or SVG" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Logo must be 200 KB or smaller" },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = EXT_BY_MIME[file.type];
  const path = `${user.id}/${Date.now()}.${ext}`;

  try {
    const admin = createAdminClient();
    const { error: upErr } = await admin
      .storage
      .from("ad-logos")
      .upload(path, buf, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    const { data: pub } = admin
      .storage
      .from("ad-logos")
      .getPublicUrl(path);

    return NextResponse.json({ url: pub.publicUrl, path });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
