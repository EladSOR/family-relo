"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, BarChart2 } from "lucide-react";
import { usePathname } from "next/navigation";

const DISMISS_KEY = "compare_banner_dismissed";

export default function CompareBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on compare pages themselves
  const isComparePage = pathname?.startsWith("/compare");

  useEffect(() => {
    if (isComparePage) return;
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) {
        // Small delay so it doesn't pop immediately on page load
        const t = setTimeout(() => setVisible(true), 2500);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage not available (SSR safety)
    }
  }, [isComparePage]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible || isComparePage) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[75] w-72 animate-in fade-in slide-in-from-bottom-4 duration-300 md:bottom-6 md:right-6"
      role="complementary"
      aria-label="City comparison feature"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF5A5F] to-[#ff8c5a]" />

        <div className="p-4">
          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors hover:text-slate-500"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          {/* Icon + label */}
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5A5F]/10">
              <BarChart2 size={16} className="text-[#FF5A5F]" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-900">
                Compare cities side by side
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF5A5F]">
                Coming soon · Free preview now
              </p>
            </div>
          </div>

          <p className="mb-3.5 text-xs leading-relaxed text-slate-500">
            Personalized match scores, budget fit, schools &amp; visa paths — weighted to your family.
          </p>

          <Link
            href="/compare"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#e84a4f]"
          >
            See how it works
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
