"use client";

import { HelpCircle } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VISA_GLOSSARY } from "@/lib/visaGlossary";

interface Props {
  /** Key in {@link VISA_GLOSSARY} */
  termId: string;
  /** Selected filter chip on dark background (white icon ring). */
  tone?: "default" | "lightOnDark";
}

type PopupPos = { top: number; left: number; width: number };

/**
 * Compact ⓘ control: hover (or focus) shows definition on fine pointers;
 * on touch-first devices, tap toggles a bubble. Mobile uses fixed positioning
 * so the panel never clips past the viewport edge.
 */
export function TermHint({ termId, tone = "default" }: Props) {
  const def = VISA_GLOSSARY[termId];
  const panelId = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tapOpen, setTapOpen] = useState(false);
  const [useHoverUi, setUseHoverUi] = useState(true);
  const [popupPos, setPopupPos] = useState<PopupPos | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setUseHoverUi(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const closeMobile = useCallback(() => {
    setTapOpen(false);
    setPopupPos(null);
  }, []);

  useLayoutEffect(() => {
    if (useHoverUi || !tapOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const el = buttonRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const margin = 12;
      const vw = window.innerWidth;
      const maxPanel = 320;
      const width = Math.min(maxPanel, vw - 2 * margin);
      const centerX = r.left + r.width / 2;
      let left = centerX - width / 2;
      left = Math.max(margin, Math.min(left, vw - margin - width));
      const top = r.bottom + 8;
      setPopupPos({ top, left, width });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [tapOpen, useHoverUi]);

  useEffect(() => {
    if (useHoverUi || !tapOpen) return;
    const close = (e: PointerEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      const portal = document.getElementById(`termhint-portal-${panelId}`);
      if (portal?.contains(t)) return;
      closeMobile();
    };
    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [tapOpen, useHoverUi, panelId, closeMobile]);

  if (!def) return null;

  const mobilePanel =
    !useHoverUi &&
    tapOpen &&
    popupPos &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        id={`termhint-portal-${panelId}`}
        role="tooltip"
        className="pointer-events-auto fixed z-[200] rounded-lg border border-slate-200 bg-white p-3 text-left shadow-xl md:hidden"
        style={{
          top: popupPos.top,
          left: popupPos.left,
          width: popupPos.width,
          maxHeight: "min(50vh, 22rem)",
          overflowY: "auto",
        }}
      >
        <span className="block text-xs font-semibold text-slate-900">{termId}</span>
        <span className="mt-1 block text-xs leading-snug text-slate-600">{def}</span>
      </div>,
      document.body,
    );

  return (
    <span ref={rootRef} className="group/hint relative inline-flex items-baseline">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${termId}: ${def}`}
        aria-expanded={useHoverUi ? undefined : tapOpen}
        aria-controls={useHoverUi ? undefined : `termhint-portal-${panelId}`}
        onClick={(e) => {
          e.stopPropagation();
          if (useHoverUi) return;
          setTapOpen((v) => {
            if (v) setPopupPos(null);
            return !v;
          });
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

      {mobilePanel}

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
