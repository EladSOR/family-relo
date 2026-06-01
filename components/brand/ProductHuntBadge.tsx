import Image from "next/image";
import { PRODUCT_HUNT_LAUNCH_URL } from "@/lib/constants";

type Variant = "hero" | "cityHero" | "footer";

interface Props {
  variant: Variant;
  className?: string;
}

const LAUNCH_LABEL = "We're live — upvote us";

/**
 * Links to the FamiRelo Product Hunt launch (new tab).
 * Uses official PH mark/wordmark from /public/brand (sourced from producthunt.com/branding).
 */
export default function ProductHuntBadge({ variant, className = "" }: Props) {
  const isLaunchCta = variant === "hero" || variant === "cityHero";
  const isCityHero = variant === "cityHero";

  return (
    <a
      href={PRODUCT_HUNT_LAUNCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "group inline-flex items-center gap-2 rounded-xl font-bold transition-all",
        isLaunchCta
          ? [
              "bg-[#DA552F] text-white shadow-lg shadow-black/25",
              "hover:scale-[1.02] hover:bg-[#c44a28] active:scale-[0.98]",
              isCityHero
                ? "px-3 py-2 text-xs"
                : "px-4 py-2.5 text-sm lg:px-5 lg:py-3 lg:text-base",
            ].join(" ")
          : "border border-[#DA552F]/25 bg-[#DA552F]/5 px-3.5 py-2 text-xs text-[#DA552F] hover:border-[#DA552F]/40 hover:bg-[#DA552F]/10",
        className,
      ].join(" ")}
      aria-label="FamiRelo on Product Hunt — open launch page in a new tab to upvote"
    >
      {isLaunchCta ? (
        <>
          <Image
            src="/brand/product-hunt-wordmark-white.png"
            alt="Product Hunt"
            width={140}
            height={28}
            className={isCityHero ? "h-4 w-auto" : "h-5 w-auto lg:h-6"}
          />
          <span className={[isCityHero ? "leading-snug" : "leading-tight", "hidden sm:inline"].join(" ")}>
            {LAUNCH_LABEL}
          </span>
          <span className="leading-snug sm:hidden">Upvote</span>
        </>
      ) : (
        <>
          <Image
            src="/brand/product-hunt-mark.svg"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0"
            aria-hidden
          />
          <span className="leading-snug">Product Hunt</span>
        </>
      )}
    </a>
  );
}
