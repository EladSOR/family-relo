import { ImageResponse } from "next/og";
import {
  OG_CARD,
  loadPlusJakartaFonts,
  readBrandedOgBackgroundDataUrl,
} from "@/lib/seo/ogImageAssets";
import { SITE_COMPARE_OG_IMAGE_ALT } from "@/lib/seo/constants";

export const runtime = "nodejs";
export const alt = SITE_COMPARE_OG_IMAGE_ALT;
export const size = OG_CARD;
export const contentType = "image/png";

const { width: W, height: H } = OG_CARD;

export default async function Image() {
  const [fonts, bgDataUrl] = await Promise.all([
    loadPlusJakartaFonts(),
    readBrandedOgBackgroundDataUrl(),
  ]);

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
          backgroundColor: "#0f172a",
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
              "linear-gradient(180deg, rgba(8,6,22,0.78) 0%, rgba(12,10,30,0.85) 40%, rgba(8,6,22,0.92) 100%)",
          }}
        />

        {/* Content card */}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 980,
              padding: "44px 52px 48px",
              borderRadius: 28,
              backgroundColor: "rgba(8, 6, 22, 0.78)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            {/* Pill badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,90,95,0.18)",
                border: "1px solid rgba(255,90,95,0.55)",
                borderRadius: 999,
                padding: "10px 22px",
                marginBottom: 28,
                fontSize: 20,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "#ff8a8e",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  marginRight: 10,
                  borderRadius: 999,
                  backgroundColor: "#ff5a5f",
                }}
              />
              Premium · Coming Soon
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
                  lineHeight: 1.04,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -1.5,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                Compare cities,
              </span>
              <span
                style={{
                  fontSize: 56,
                  lineHeight: 1.04,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#ff5a5f",
                  letterSpacing: -1.5,
                  marginTop: 4,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                built for your family.
              </span>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.5,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                textAlign: "center",
                maxWidth: 880,
                textShadow: "0 1px 12px rgba(0,0,0,0.45)",
              }}
            >
              Match scores · budget fit · schools · visas — one personalised
              report, scored to your situation.
            </p>

            {/* Sample scores row */}
            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 32,
              }}
            >
              {[
                { name: "Valencia", score: "91%", color: "#22c55e" },
                { name: "Lisbon", score: "74%", color: "#3b82f6" },
                { name: "Porto", score: "88%", color: "#22c55e" },
              ].map((c) => (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 14,
                    padding: "12px 22px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontFamily: '"Plus Jakarta Sans"',
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      marginTop: 4,
                      fontSize: 28,
                      fontFamily: '"Plus Jakarta Sans"',
                      fontWeight: 800,
                      color: c.color,
                    }}
                  >
                    {c.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts,
    },
  );
}
