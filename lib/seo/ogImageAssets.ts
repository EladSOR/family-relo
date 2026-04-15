import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** OG / Twitter card size (Next.js + platforms expect ~1.91:1). */
export const OG_CARD = { width: 1200, height: 630 } as const;

/** Latin WOFF from Fontsource CDN — Plus Jakarta Sans (matches site). */
export async function loadPlusJakartaFonts() {
  const base =
    "https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.2.5/files/plus-jakarta-sans-latin";
  const [w700, w800] = await Promise.all([
    fetch(`${base}-700-normal.woff`).then((r) => {
      if (!r.ok) throw new Error("Plus Jakarta 700 fetch failed");
      return r.arrayBuffer();
    }),
    fetch(`${base}-800-normal.woff`).then((r) => {
      if (!r.ok) throw new Error("Plus Jakarta 800 fetch failed");
      return r.arrayBuffer();
    }),
  ]);
  return [
    { name: "Plus Jakarta Sans", data: w700, weight: 700 as const, style: "normal" as const },
    { name: "Plus Jakarta Sans", data: w800, weight: 800 as const, style: "normal" as const },
  ];
}

/** Shared aerial background used on generated social cards (`public/og-home.png`). */
export async function readBrandedOgBackgroundDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public/og-home.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
