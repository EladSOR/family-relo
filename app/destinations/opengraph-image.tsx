import { ImageResponse } from "next/og";
import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";
import { OG_CARD, loadPlusJakartaFonts, readBrandedOgBackgroundDataUrl } from "@/lib/seo/ogImageAssets";
import { SITE_DESTINATIONS_OG_IMAGE_ALT } from "@/lib/seo/constants";

export const runtime = "nodejs";
export const alt = SITE_DESTINATIONS_OG_IMAGE_ALT;
export const size = OG_CARD;
export const contentType = "image/png";

const { width: W, height: H } = OG_CARD;

export default async function Image() {
  const count = (citiesData as Destination[]).length;
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
              "linear-gradient(180deg, rgba(8,6,22,0.75) 0%, rgba(12,10,30,0.82) 35%, rgba(8,6,22,0.88) 100%)",
          }}
        />
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
                marginBottom: 24,
                fontSize: 20,
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
              {count} family-friendly cities
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  lineHeight: 1.08,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: -1,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                Explore the world
              </span>
              <span
                style={{
                  fontSize: 48,
                  lineHeight: 1.08,
                  fontFamily: '"Plus Jakarta Sans"',
                  fontWeight: 800,
                  color: "#f8fafc",
                  letterSpacing: -1,
                  marginTop: 6,
                  textShadow: "0 2px 18px rgba(0,0,0,0.55)",
                }}
              >
                with your family.
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.5,
                fontFamily: '"Plus Jakarta Sans"',
                fontWeight: 700,
                color: "rgba(255,255,255,0.94)",
                textAlign: "center",
                maxWidth: 880,
                textShadow: "0 1px 12px rgba(0,0,0,0.45)",
              }}
            >
              Visa rules, schools, childcare costs, and safety — browse every relocation guide in one
              place.
            </p>
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
