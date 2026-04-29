"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Sticky bottom CTA bar for the /compare landing page.
 * Hides until the user scrolls past the hero CTA button so there's no
 * visual duplication at the top of the page.
 */
export default function CompareStickyBar({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [heroRef]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[90] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-md md:py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900">
              City Comparison Reports
            </p>
            <p className="text-xs text-slate-500">
              From $9 · Pay once · No subscription
            </p>
          </div>
          <Link
            href="/compare/build"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e84a4f] sm:w-auto"
          >
            Start free preview
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
