/**
 * FamiRelo brand logo.
 *
 * Use this component everywhere the logo appears in the UI — it inlines
 * the SVG mark so there's no extra HTTP request and it stays sharp at any
 * size. The wordmark uses the site font (extends `font-extrabold tracking-tight`)
 * so it visually matches surrounding headings.
 *
 * For external surfaces (emails, social profiles, README images), use the
 * standalone SVGs in `/public/brand/`:
 *   - `/brand/logo-mark.svg`  — square mark only
 *   - `/brand/logo-full.svg`  — mark + wordmark lockup
 *
 * Variants:
 *   - "mark"      Just the pin icon (favicons, tight nav slots)
 *   - "full"      Mark + "FamiRelo" wordmark (default — main nav, footer)
 *   - "wordmark"  Wordmark only (when context already implies brand)
 */

type Variant = "mark" | "full" | "wordmark";

type Props = {
  variant?: Variant;
  /** Pixel size of the mark. Wordmark scales proportionally. Defaults to 28. */
  size?: number;
  /** Optional className applied to the root element. */
  className?: string;
  /** Tailwind text class for the wordmark. Default `text-slate-900`. */
  wordmarkClassName?: string;
  /** When true, mark + wordmark are inverted for dark backgrounds. */
  onDark?: boolean;
};

function Mark({ size, onDark }: { size: number; onDark: boolean }) {
  // Solid pin in brand color with a tiny house silhouette inside the head.
  // Inverted variant inverts the pin/house colors so the mark reads on the
  // brand color (e.g. promo banners) without losing recognisability.
  const pinFill = onDark ? "#FFFFFF" : "#FF5A5F";
  const houseFill = onDark ? "#FF5A5F" : "#FFFFFF";
  const doorFill = onDark ? "#FFFFFF" : "#FF5A5F";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="FamiRelo logo"
      className="shrink-0"
    >
      <path
        d="M32 4C17.64 4 6 15.64 6 30c0 7.4 4.6 14.55 10.83 20.5C23.16 56.5 32 60 32 60s8.84-3.5 15.17-9.5C53.4 44.55 58 37.4 58 30 58 15.64 46.36 4 32 4Z"
        fill={pinFill}
      />
      <path d="M22.5 30 L32 21 L41.5 30 L41.5 38 L22.5 38 Z" fill={houseFill} />
      <rect x="29.5" y="32" width="5" height="6" fill={doorFill} />
    </svg>
  );
}

function Wordmark({
  size,
  className,
  onDark,
}: {
  size: number;
  className?: string;
  onDark: boolean;
}) {
  // Wordmark height roughly matches mark height when sized at ~size.
  // 28 → 18px text, 32 → 20px, etc. Keeps the lockup balanced.
  const fontSizePx = Math.round(size * 0.62);
  const baseColor = className
    ? className
    : onDark
      ? "text-white"
      : "text-slate-900";

  return (
    <span
      className={`font-extrabold tracking-tight ${baseColor}`}
      style={{ fontSize: `${fontSizePx}px`, lineHeight: 1 }}
    >
      Fami<span className="text-[#FF5A5F]">Relo</span>
    </span>
  );
}

export default function Logo({
  variant = "full",
  size = 28,
  className,
  wordmarkClassName,
  onDark = false,
}: Props) {
  if (variant === "mark") {
    return (
      <span className={className}>
        <Mark size={size} onDark={onDark} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={className}>
        <Wordmark size={size} className={wordmarkClassName} onDark={onDark} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Mark size={size} onDark={onDark} />
      <Wordmark size={size} className={wordmarkClassName} onDark={onDark} />
    </span>
  );
}
