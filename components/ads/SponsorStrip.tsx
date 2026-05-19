/**
 * SponsorStrip — three-card row that renders ad slots.
 *
 * Server component. Fetches at request time (cached at the page level by the
 * caller's `revalidate` setting) and renders:
 *   - Live ads (status='active') in their assigned position
 *   - Placeholders (Compare cities, Sortino) where no live ad exists
 *   - The "Apply" CTA card for the open slot
 *
 * Mobile: stacks 1 per row (3 stacked cards).
 * Desktop: 3 cards across.
 *
 * Placement: rendered at the BOTTOM of city pages and the homepage, just above
 * the global footer. Never interrupts content. Always labeled "Sponsored".
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { getRenderableSlots, getOpenSlotCount } from "@/lib/ads/queries";
import type { RenderableSlot } from "@/lib/ads/types";
import OpenSlotCard from "./OpenSlotCard";
import WaitlistBanner from "./WaitlistBanner";

export default async function SponsorStrip() {
  const slots = await getRenderableSlots();
  // When 0 open slots are visible, the open-slot card disappears — without
  // any other signal, casual visitors lose all discoverability of the
  // advertise/waitlist flow. The WaitlistBanner under the grid restores it.
  const isFull = getOpenSlotCount(slots) === 0;
  return (
    <section
      aria-label="Sponsored"
      className="border-t border-slate-100 bg-stone-50/60"
    >
      {/* Extra bottom padding on mobile so the floating "Show map" pill
          (fixed bottom-center, ~64px tall incl. shadow) never covers the
          last clickable card. The footer's pb-20 takes over below this on
          desktop. */}
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:pb-10 md:pt-10">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Sponsored
          </p>
          <Link
            href="/advertise"
            className="text-[11px] font-medium text-slate-500 hover:text-[#FF5A5F]"
          >
            Advertise →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {slots.map(slot => <SlotCard key={slot.position} slot={slot} />)}
        </div>
        {isFull && <WaitlistBanner />}
      </div>
    </section>
  );
}

function SlotCard({ slot }: { slot: RenderableSlot }) {
  if (slot.kind === "open") {
    return <OpenSlotCard slot={slot} />;
  }

  const isExternal = slot.click_url?.startsWith("http") ?? false;
  const href = slot.click_url ?? "#";
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "sponsored noopener noreferrer" }
    : { href };

  // Placeholder for slot 1 (Compare cities) — internal Next link.
  if (slot.kind === "placeholder" && !isExternal) {
    return (
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-sm"
      >
        <LogoTile slot={slot} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-slate-900">{slot.brand_name}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-600 line-clamp-2">{slot.tagline}</p>
        </div>
      </Link>
    );
  }

  // Live ad OR external placeholder (Sortino) — anchor with rel="sponsored".
  return (
    <a
      {...linkProps}
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-sm"
    >
      <LogoTile slot={slot} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-slate-900">{slot.brand_name}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-600 line-clamp-2">{slot.tagline}</p>
      </div>
      <ArrowUpRight size={12} className="shrink-0 text-slate-400 group-hover:text-slate-700" />
    </a>
  );
}

function LogoTile({ slot }: { slot: RenderableSlot }) {
  // Live ads always have a logo URL. Placeholders fall back to the FamiRelo
  // mark (slot 1) or a typographic monogram (slot 2).
  if (slot.logo_url) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slot.logo_url} alt="" className="h-9 w-9 object-contain" />
      </div>
    );
  }
  if (slot.position === 1) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
        <Logo variant="mark" size={24} />
      </div>
    );
  }
  // Slot 2 placeholder (Sortino) — typographic monogram in brand color.
  const initial = slot.brand_name.slice(0, 1).toUpperCase();
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
      <span className="text-lg font-extrabold">{initial}</span>
    </div>
  );
}
