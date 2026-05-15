import { ImageResponse } from "next/og";

/**
 * Apple touch icon — 180×180 PNG generated at build time.
 *
 * iOS uses this when a user adds the site to their home screen. We render
 * the brand mark on a white background with rounded corners (iOS applies
 * its own mask but a white card looks better than an edge-to-edge pin).
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: 36,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width={130}
          height={130}
        >
          <path
            d="M32 4C17.64 4 6 15.64 6 30c0 7.4 4.6 14.55 10.83 20.5C23.16 56.5 32 60 32 60s8.84-3.5 15.17-9.5C53.4 44.55 58 37.4 58 30 58 15.64 46.36 4 32 4Z"
            fill="#FF5A5F"
          />
          <path
            d="M22.5 30 L32 21 L41.5 30 L41.5 38 L22.5 38 Z"
            fill="#FFFFFF"
          />
          <rect x="29.5" y="32" width="5" height="6" fill="#FF5A5F" />
        </svg>
      </div>
    ),
    size,
  );
}
