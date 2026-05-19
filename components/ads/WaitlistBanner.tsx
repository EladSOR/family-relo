"use client";

import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import AdvertiseModal from "./AdvertiseModal";

/**
 * Slim banner shown under the SponsorStrip when all ad slots are full.
 *
 * Replaces the discoverability that the open-slot card normally provides:
 * without it, casual visitors have no signal that the waitlist option even
 * exists. Tapping the banner opens the AdvertiseModal in waitlist mode
 * (single email input) — same modal users see when slots are open, just
 * with a different body.
 */
export default function WaitlistBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-left transition-all hover:border-[#FF5A5F]/50 hover:bg-[#FF5A5F]/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F]">
            <Clock size={15} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900">
              All slots are full — join the waitlist
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
              We'll email you the moment a slot opens. No payment until then.
            </p>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 text-slate-400 transition-colors group-hover:text-[#FF5A5F]"
        />
      </button>

      <AdvertiseModal open={open} onClose={() => setOpen(false)} mode="waitlist" />
    </>
  );
}
