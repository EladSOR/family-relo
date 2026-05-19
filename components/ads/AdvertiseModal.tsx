"use client";

import { useEffect, useRef } from "react";
import { X, Sparkles, Lock, Users, Clock } from "lucide-react";
import AdvertiseForm from "./AdvertiseForm";
import WaitlistForm from "./WaitlistForm";
import { ADVERTISE_COPY } from "@/lib/ads/copy";

/**
 * Modal/sheet for the advertise flow.
 *
 *   • Desktop: centered card, max-width ~640px.
 *   • Mobile:  bottom sheet, ~85% viewport height, page visible behind.
 *
 * Two modes:
 *   • mode="apply"    — full ad-application form (default; slots available)
 *   • mode="waitlist" — single-input waitlist signup (when all slots taken)
 *
 * Always shows a sticky header with the X close button so users on mobile
 * never feel trapped. Body scrolls; CTA stays visible inside the form.
 *
 * Closes on:
 *   • X click
 *   • Esc key
 *   • Backdrop click
 */
export default function AdvertiseModal({
  open, onClose, mode = "apply",
}: {
  open: boolean;
  onClose: () => void;
  mode?: "apply" | "waitlist";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Prevent the underlying page from scrolling while the sheet is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Advertise on FamiRelo"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={ref}
        className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl"
      >
        {/* Sticky header — always shows X */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
            {mode === "waitlist" ? "Advertiser waitlist" : "Advertise on FamiRelo"}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-5">
          {mode === "waitlist" ? (
            <WaitlistBody />
          ) : (
            <ApplyBody />
          )}
        </div>
      </div>
    </div>
  );
}

/** Default body — full ad-application flow. */
function ApplyBody() {
  return (
    <>
      {/* Top badges */}
      <div className="grid grid-cols-3 gap-2">
        <Badge icon={<Users size={12} />} title={ADVERTISE_COPY.badges[0].label} sub={ADVERTISE_COPY.badges[0].sub} />
        <Badge icon={<Lock size={12} />} title={ADVERTISE_COPY.badges[1].label} sub={ADVERTISE_COPY.badges[1].sub} />
        <Badge icon={<Sparkles size={12} />} title={ADVERTISE_COPY.badges[2].label} sub={ADVERTISE_COPY.badges[2].sub} highlight />
      </div>

      {/* Heading + body — centered */}
      <h2 className="mt-5 text-center text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
        {ADVERTISE_COPY.heading}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-[13px] leading-relaxed text-slate-600">
        {ADVERTISE_COPY.body}
      </p>

      {/* Form */}
      <div className="mt-6">
        <AdvertiseForm compact />
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
        {ADVERTISE_COPY.fineprint}{" "}
        <a
          href="/legal/terms#advertising"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          Advertising terms apply
        </a>
        .
      </p>

      {/* What we don't accept — sets expectations before they pay. */}
      <details className="mt-5 rounded-xl border border-slate-100 bg-stone-50 px-4 py-3 text-xs">
        <summary className="cursor-pointer list-none font-bold text-slate-700 marker:hidden">
          {ADVERTISE_COPY.notAcceptedHeading} →
        </summary>
        <ul className="mt-2 space-y-1 text-slate-600">
          {ADVERTISE_COPY.notAccepted.map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-slate-400">
          We refund in full if we reject. No back-and-forth.
        </p>
      </details>
    </>
  );
}

/** Alt body — slim waitlist signup, used when all slots are full. */
function WaitlistBody() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F]">
        <Clock size={20} strokeWidth={2} />
      </div>
      <h2 className="text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
        All ad slots are full
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-slate-600">
        We keep this section deliberately small. Drop your email — we'll reach out
        the moment a slot opens (usually within a few weeks).
      </p>

      <div className="mx-auto mt-6 max-w-sm text-left">
        <WaitlistForm source="modal" />
      </div>

      <p className="mx-auto mt-4 max-w-sm text-[11px] leading-relaxed text-slate-400">
        We don't run a payment until we have a slot for you — so you'll never need
        a refund from being on the waitlist.
      </p>
    </div>
  );
}

function Badge({
  icon, title, sub, highlight,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-2 py-2 text-center ${
        highlight ? "border-[#FF5A5F]/30 bg-[#FF5A5F]/5" : "border-slate-100 bg-stone-50"
      }`}
    >
      <div className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full ${
        highlight ? "bg-[#FF5A5F]/10 text-[#FF5A5F]" : "bg-white text-slate-500"
      }`}>
        {icon}
      </div>
      <p className="text-[11px] font-extrabold leading-tight text-slate-900">{title}</p>
      <p className="mt-0.5 text-[9px] leading-tight text-slate-500">{sub}</p>
    </div>
  );
}
