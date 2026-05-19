"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AdvertiseModal from "./AdvertiseModal";
import type { RenderableSlot } from "@/lib/ads/types";

/**
 * Client wrapper for the "Apply" / open-slot card in the SponsorStrip.
 * Opens the AdvertiseModal in-page instead of navigating away — that way
 * mobile users don't lose context (a leading concern when the sale lives
 * inside a popup, not on a separate page).
 */
export default function OpenSlotCard({ slot }: { slot: RenderableSlot }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-[#FF5A5F]/40 bg-white p-4 text-left transition-all hover:border-[#FF5A5F] hover:bg-[#FF5A5F]/5"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-[#FF5A5F]/30 bg-[#FF5A5F]/5 text-[#FF5A5F]">
          <span className="text-xl font-extrabold">+</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#FF5A5F]">{slot.brand_name}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{slot.tagline}</p>
        </div>
        <ArrowUpRight size={14} className="shrink-0 text-[#FF5A5F] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <AdvertiseModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
