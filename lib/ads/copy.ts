/**
 * Static placeholder content + modal copy for ads.
 *
 * Slots 1 & 2 are filled by FamiRelo's own products / partner until paid
 * advertisers fill them. Slot 3 is the "open" slot — clicking it opens the
 * advertise modal / sends the user to /advertise.
 *
 * Copy is intentionally evergreen: no "we're launching", no months, no
 * specific projections that go stale. Edit ADVERTISE_COPY here to tweak the
 * pitch sitewide.
 */

import type { RenderableSlot } from "./types";

export const AD_PRICE_USD_QUARTER = 297;
export const AD_PRICE_USD_MONTHLY_EQUIV = 99;
/** Label used wherever billing cadence is shown — single source of truth. */
export const AD_BILLING_LABEL = `$${AD_PRICE_USD_MONTHLY_EQUIV}/mo · billed $${AD_PRICE_USD_QUARTER} every 3 months`;

/** Slot 1 — FamiRelo's own product (Comparison feature). */
export const PLACEHOLDER_SLOT_1: RenderableSlot = {
  position: 1,
  kind: "placeholder",
  brand_name: "Compare cities",
  tagline: "Side-by-side family-fit scores for any 2–3 cities. Built for relocating parents.",
  click_url: "/compare",
  logo_url: null,
};

/** Slot 2 — Sortino (performance marketing partner). Copy variant B. */
export const PLACEHOLDER_SLOT_2: RenderableSlot = {
  position: 2,
  kind: "placeholder",
  brand_name: "Sortino",
  tagline: "Paid ads, SEO, analytics — done by a team that's made millions for clients.",
  click_url: "https://sortino.io/",
  logo_url: "/brand/sortino.png",
};

/** Slot 3 — open for sale. Always rendered as the "Apply" CTA. */
export const OPEN_SLOT: RenderableSlot = {
  position: 3,
  kind: "open",
  brand_name: "Your brand here",
  // Tagline doubles as billing disclosure to prevent surprise at checkout.
  tagline: `Founding rate · ${AD_BILLING_LABEL}`,
  click_url: "/advertise",
  logo_url: null,
};

/**
 * Modal / advertise-page copy. Evergreen — no dates, no "launching", no
 * specific traffic projections. Edit this one block to tweak the pitch.
 */
export const ADVERTISE_COPY = {
  badges: [
    { label: "Limited slots", sub: "We keep it small" },
    { label: "Founding rate", sub: "Locked in for life" },
    { label: "Family audience", sub: "High-intent relocators" },
  ],
  heading: "Reach relocating families — at the founding rate.",
  body:
    "Our visitors aren't browsing — they're parents in the middle of a move, " +
    "researching schools, visas, and housing for an actual relocation. The " +
    "founding rate is locked in for life, even as our pricing rises. Limited " +
    "slots, kept small on purpose.",
  cta: `Apply — ${AD_BILLING_LABEL}`,
  fineprint:
    `${AD_BILLING_LABEL}. Renews automatically until you cancel. ` +
    `Full refund if your ad doesn't pass our review.`,
  /** Things we always reject — saves people time before they apply. */
  notAcceptedHeading: "We don't accept",
  notAccepted: [
    "Adult content or anything sexually suggestive",
    "Gambling, sportsbooks, casinos",
    "Crypto, NFTs, web3 token sales",
    "MLM, dropshipping, get-rich-quick offers",
    "Loans, debt consolidation, financial scams",
    "Anything we wouldn't show our own family",
  ],
} as const;
