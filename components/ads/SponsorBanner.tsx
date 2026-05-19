/**
 * SponsorBanner — single-card sponsor placement for tops of pages.
 *
 * Designed to live ABOVE long content (above the destinations grid on the
 * homepage, mid-page on city guides) so it's visible regardless of how much
 * content sits below it. Doesn't break with 300+ destinations or long city
 * guides — it's anchored to a fixed point in the page hierarchy, not the
 * scroll-end.
 *
 * Behavior:
 *   • If there's an open slot, shows the OPEN slot card (the apply CTA)
 *     so visibility translates to applications.
 *   • If all 3 slots are filled, shows a single LIVE ad
 *     (rotates on each request via Math.random — good enough; if you sell
 *     out we can promote a smarter rotation).
 *   • Always labeled "Sponsored" per ad-disclosure rules.
 */

import { ArrowUpRight } from "lucide-react";
import OpenSlotCard from "./OpenSlotCard";
import { getRenderableSlots } from "@/lib/ads/queries";
import type { RenderableSlot } from "@/lib/ads/types";

export default async function SponsorBanner() {
  const slots = await getRenderableSlots();
  const openSlot = slots.find(s => s.kind === "open");
  const liveSlots = slots.filter(s => s.kind === "live");

  let card: React.ReactNode;
  if (openSlot) {
    card = <OpenSlotCard slot={openSlot} />;
  } else if (liveSlots.length > 0) {
    // Show one live ad (random) — keeps inventory varied across pageviews.
    const pick = liveSlots[Math.floor(Math.random() * liveSlots.length)];
    card = <LiveCard slot={pick} />;
  } else {
    // All placeholders — fall through to the placeholder slot 1 (Compare).
    card = <LiveCard slot={slots[0]} />;
  }

  return (
    <section
      aria-label="Sponsored"
      className="border-y border-slate-100 bg-stone-50/60"
    >
      <div className="mx-auto flex max-w-5xl items-start gap-4 px-4 py-4 md:items-center md:py-3">
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-500 md:inline">
          Sponsored
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 md:hidden">
            Sponsored
          </span>
          <div className="mt-1 md:mt-0">{card}</div>
        </div>
      </div>
    </section>
  );
}

function LiveCard({ slot }: { slot: RenderableSlot }) {
  const isExternal = slot.click_url?.startsWith("http") ?? false;
  const href = slot.click_url ?? "#";
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "sponsored noopener noreferrer" }
    : { href };

  return (
    <a
      {...linkProps}
      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-all hover:border-slate-200 hover:shadow-sm"
    >
      <LogoTile slot={slot} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-slate-900">{slot.brand_name}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-600 line-clamp-1">{slot.tagline}</p>
      </div>
      <ArrowUpRight size={12} className="shrink-0 text-slate-400 group-hover:text-slate-700" />
    </a>
  );
}

function LogoTile({ slot }: { slot: RenderableSlot }) {
  if (slot.logo_url) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slot.logo_url} alt="" className="h-7 w-7 object-contain" />
      </div>
    );
  }
  const initial = slot.brand_name.slice(0, 1).toUpperCase();
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
      <span className="text-sm font-extrabold">{initial}</span>
    </div>
  );
}
