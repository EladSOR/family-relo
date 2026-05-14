"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, Scale } from "lucide-react";
import { usePathname } from "next/navigation";

const DISMISS_KEY = "compare_banner_dismissed_v2"; // bumped — old key was for "Coming soon" copy

/**
 * Subtle floating "build a personalized comparison" pill.
 *
 * Visible on every page except /compare/* and /account, dismissible, persists
 * dismissal in localStorage. Sits bottom-right, well clear of the MapToggle.
 *
 * Copy is now post-launch credible — no "Coming soon" claim.
 */
export default function CompareBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on the compare flow itself and on /account (already a CTA-heavy surface).
  const isHiddenSurface =
    !!pathname &&
    (pathname.startsWith("/compare") || pathname.startsWith("/account"));

  useEffect(() => {
    if (isHiddenSurface) return;
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) {
        const t = setTimeout(() => setVisible(true), 2500);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available (SSR safety)
    }
  }, [isHiddenSurface]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible || isHiddenSurface) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[75] w-72 animate-in fade-in slide-in-from-bottom-4 duration-300 md:bottom-6 md:right-6"
      role="complementary"
      aria-label="Personalized city comparison"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />

        {/* Dismiss button — outside flex children so it's positioned to the card */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        <div className="p-4">
          {/* Icon + label */}
          <div className="mb-2 flex items-center gap-2.5 pr-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
              <Scale size={15} className="text-[#FF5A5F]" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-900">
                Compare cities for your family
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF5A5F]">
                From $9 · pay once · free preview
              </p>
            </div>
          </div>

          <p className="mb-3.5 text-xs leading-relaxed text-slate-500">
            Match scores, budget fit, schools &amp; visa paths — weighted to
            your priorities.
          </p>

          <Link
            href="/compare"
            onClick={dismiss}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#e84a4f]"
          >
            Try it now
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
