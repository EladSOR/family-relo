import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_HOME_OG_IMAGE_ALT } from "@/lib/seo/constants";

export const runtime = "nodejs";
export const alt = SITE_HOME_OG_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const W = 1200;
const H = 630;

/** Latin WOFF from Fontsource CDN — matches site typography (Plus Jakarta Sans). */
async function font(weight: 700 | 800) {
  const w = weight === 800 ? "800" : "700";
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.2.5/files/plus-jakarta-sans-latin-${w}-normal.woff`;
  return fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Font fetch failed: ${url}`);
    return r.arrayBuffer();
  });
}

export default async function Image() {
  const [font700, font800, bgBuf] = await Promise.all([
    font(700),
    font(800),
    readFile(join(process.cwd(), "public/og-home.png")).catch(() => null),
  ]);

  const bgDataUrl = bgBuf
    ? `data:image/png;base64,${bgBuf.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e1b4b",
        }}
      >
        {bgDataUrl ? (
          <img
            src={bgDataUrl}
            alt=""
            width={W}
            height={H}
            style={{
              position: "absolute",
              inset: 0,
              width: W,
              height: H,
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,12,35,0.82) 0%, rgba(30,27,75,0.88) 45%, rgba(15,12,35,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 56px",
            width: "100%",
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 999,
              padding: "10px 22px",
              marginBottom: 28,
              fontSize: 22,
              fontFamily: '"Plus Jakarta Sans"',
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                marginRight: 10,
                borderRadius: 999,
                backgroundColor: "#34d399",
              }}
            />
            Trusted by 2,000+ relocating families
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: 22,
            }}
          >
            <span
              style={{
                fontSize: 56,
                lineHeight: 1.1,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: -1,
              }}
            >
              {`Plan your family's move.`}
            </span>
            <span
              style={{
                fontSize: 56,
                lineHeight: 1.1,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 800,
                color: "rgba(255,255,255,0.92)",
                letterSpacing: -1,
                marginTop: 4,
              }}
            >
              Without the chaos.
            </span>
          </div>
          <p
            style={{
              margin: 0,
              marginBottom: 16,
              fontSize: 24,
              lineHeight: 1.45,
              fontFamily: '"Plus Jakarta Sans"',
              fontWeight: 700,
              color: "rgba(255,255,255,0.78)",
              textAlign: "center",
              maxWidth: 920,
            }}
          >
            Everything families need to relocate — visas, schools, real costs — finally in one
            place.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              fontFamily: '"Plus Jakarta Sans"',
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
            }}
          >
            Built for families, by a family.
          </p>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "Plus Jakarta Sans", data: font700, weight: 700, style: "normal" },
        { name: "Plus Jakarta Sans", data: font800, weight: 800, style: "normal" },
      ],
    },
  );
}
