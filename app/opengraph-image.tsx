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
        {/* Stronger base tint so bright water/sky don’t blow out behind type */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,6,22,0.75) 0%, rgba(12,10,30,0.82) 35%, rgba(8,6,22,0.88) 100%)",
          }}
        />
        {/* Extra darkness in the center band where the copy sits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 95% 85% at 50% 48%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 55%, transparent 72%)",
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
            padding: "40px 48px",
            width: "100%",
            maxWidth: 1080,
          }}
        >
          {/* Solid panel: keeps all lines readable on busy aerials */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 980,
              padding: "36px 44px 40px",
              borderRadius: 28,
              backgroundColor: "rgba(8, 6, 22, 0.78)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                padding: "10px 22px",
                marginBottom: 26,
                fontSize: 21,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "#ffffff",
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
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 52,
                  lineHeight: 1.08,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -1,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                {`Plan your family's move.`}
              </span>
              <span
                style={{
                  fontSize: 52,
                  lineHeight: 1.08,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#f8fafc",
                  letterSpacing: -1,
                  marginTop: 6,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                Without the chaos.
              </span>
            </div>
            <p
              style={{
                margin: 0,
                marginBottom: 14,
                fontSize: 23,
                lineHeight: 1.5,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "rgba(255,255,255,0.94)",
                textAlign: "center",
                maxWidth: 900,
                textShadow: "0 1px 12px rgba(0,0,0,0.45)",
              }}
            >
              Everything families need to relocate — visas, schools, real costs — finally in one
              place.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 19,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                textAlign: "center",
                textShadow: "0 1px 10px rgba(0,0,0,0.4)",
              }}
            >
              Built for families, by a family.
            </p>
          </div>
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
