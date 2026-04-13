"use client";

import { HelpCircle } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { VISA_GLOSSARY } from "@/lib/visaGlossary";

interface Props {
  /** Key in {@link VISA_GLOSSARY} */
  termId: string;
  /** Selected filter chip on dark background (white icon ring). */
  tone?: "default" | "lightOnDark";
}

/**
 * Compact ⓘ control: hover (or focus) shows definition on fine pointers;
 * on touch-first devices, tap toggles a bubble. Mobile affordance: bordered button.
 */
export function TermHint({ termId, tone = "default" }: Props) {
  const def = VISA_GLOSSARY[termId];
  const panelId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [tapOpen, setTapOpen] = useState(false);
  const [useHoverUi, setUseHoverUi] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setUseHoverUi(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (useHoverUi || !tapOpen) return;
    const close = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setTapOpen(false);
      }
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [tapOpen, useHoverUi]);

  if (!def) return null;

  return (
    <span ref={rootRef} className="group/hint relative inline-flex items-baseline">
      <button
        type="button"
        aria-label={`${termId}: ${def}`}
        aria-expanded={useHoverUi ? undefined : tapOpen}
        aria-controls={useHoverUi ? undefined : `panel-${panelId}`}
        onClick={() => {
          if (!useHoverUi) setTapOpen((v) => !v);
        }}
        className={
          tone === "lightOnDark"
            ? "ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/45 " +
              "bg-white/10 text-white shadow-none transition hover:border-white/70 hover:bg-white/15 " +
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 " +
              "md:ml-0.5 md:h-[1.125rem] md:w-[1.125rem]"
            : "ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-400/80 " +
              "bg-white text-slate-500 shadow-sm transition hover:border-slate-500 hover:text-slate-800 " +
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 " +
              "md:ml-0.5 md:h-[1.125rem] md:w-[1.125rem] md:border-slate-300 md:bg-transparent md:shadow-none"
        }
      >
        <HelpCircle className="h-3 w-3" strokeWidth={2.2} aria-hidden />
      </button>

      {/* Touch / coarse pointer: tap panel */}
      {!useHoverUi && tapOpen && (
        <span
          id={`panel-${panelId}`}
          role="tooltip"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[min(92vw,20rem)] rounded-lg border border-slate-200 bg-white p-3 text-left shadow-xl"
        >
          <span className="block text-xs font-semibold text-slate-900">{termId}</span>
          <span className="mt-1 block text-xs leading-snug text-slate-600">{def}</span>
        </span>
      )}

      {/* Fine pointer: hover / focus tooltip (hidden on touch-first layouts) */}
      {useHoverUi && (
        <span
          className={
            "pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 hidden w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 " +
            "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-left text-xs leading-snug text-white shadow-xl " +
            "opacity-0 transition-opacity duration-150 md:block " +
            "group-hover/hint:opacity-100 group-focus-within/hint:opacity-100"
          }
        >
          <span className="block font-semibold text-white">{termId}</span>
          <span className="mt-1 block text-white/90">{def}</span>
        </span>
      )}
    </span>
  );
}
