"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { SearchHint } from "@/components/SearchHint";
import type { VisaOption } from "@/lib/types";

// ── Visa path types ───────────────────────────────────────────────────────────

type VisaPath = "eu" | "dnv" | "tourist" | "unsure";

const PATH_OPTIONS: { id: VisaPath; label: string }[] = [
  { id: "eu",      label: "EU / EEA passport" },
  { id: "dnv",     label: "Non-EU remote worker" },
  { id: "tourist", label: "Short-term visitor" },
  { id: "unsure",  label: "Not sure yet" },
];

/** Maps every visa anchor id to the path it belongs to. */
const ANCHOR_PATH: Record<string, VisaPath> = {
  "visa-eu":        "eu",
  "visa-tourist":   "tourist",
  "visa-dnv":       "dnv",
  "visa-d8":        "dnv",
  "visa-income":    "dnv",
  "visa-documents": "dnv",
  "visa-insurance": "dnv",
  "visa-apply":     "dnv",
  "visa-dtv":       "dnv",
  "visa-elite":     "dnv",
  "visa-arrival":   "tourist",
  "visa-vwp":       "dnv",
  "visa-golden":    "dnv",
};

const VISA_ANCHORS = new Set(Object.keys(ANCHOR_PATH));

function isRelevant(anchor: string | undefined, path: VisaPath): boolean {
  if (path === "unsure" || !anchor) return true;
  return ANCHOR_PATH[anchor] === path;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  options: VisaOption[];
}

export default function VisaPathSelector({ options }: Props) {
  const [path,        setPath]        = useState<VisaPath>("unsure");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Extracted to useCallback so it is stable across renders.
   * Called from three places:
   *   1. hashchange listener (external navigation / URL sharing)
   *   2. document click listener (any <a href="#..."> elsewhere on the page)
   *   3. card onClick handlers (the option card divs below)
   */
  const highlight = useCallback((hash: string) => {
    if (!VISA_ANCHORS.has(hash)) return;
    const mapped = ANCHOR_PATH[hash];
    if (mapped) setPath(mapped);
    if (timerRef.current) clearTimeout(timerRef.current);
    setHighlightId(hash);
    timerRef.current = setTimeout(() => setHighlightId(null), 2500);
  }, []);

  useEffect(() => {
    const onHashChange = () => highlight(window.location.hash.slice(1));
    window.addEventListener("hashchange", onHashChange);

    // Handles <a href="#..."> elements elsewhere on the page (e.g. checklist links)
    const onDocClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#")) highlight(href.slice(1));
    };
    document.addEventListener("click", onDocClick);

    if (window.location.hash) highlight(window.location.hash.slice(1));

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onDocClick);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [highlight]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* Path selector */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PATH_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPath(id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors md:px-3.5 md:py-1.5 ${
              path === id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Option cards
          ─────────────────────────────────────────────────────────────────────
          IMPORTANT: These are <div role="button"> NOT <a> elements.
          SearchHint renders its own <a> (the "Search on Google" button).
          Using <a> here would create invalid nested anchors → hydration error.
          Navigation is handled via onClick → highlight() + history.pushState.
      */}
      <div className="space-y-3">
        {options.map((opt, i) => {
          const relevant = isRelevant(opt.anchor, path);

          const inner = (
            <>
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <p className="font-semibold text-slate-900">{opt.type}</p>
                <div className="flex items-center gap-2">
                  {opt.duration && (
                    <span className="break-words rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200 md:rounded-full">
                      {opt.duration}
                    </span>
                  )}
                  {opt.anchor && (
                    <ChevronRight
                      size={15}
                      className="shrink-0 text-slate-400 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />
                  )}
                </div>
              </div>
              {opt.description && (
                <p className="mt-1.5 text-sm text-slate-500">{opt.description}</p>
              )}
              {/* SearchHint renders an <a> — safe here because the outer is a <div> */}
              {opt.officialLink && (
                <SearchHint query={opt.officialLink.label} />
              )}
            </>
          );

          const cls = [
            "rounded-xl bg-slate-50 px-4 py-3.5 transition-opacity duration-200",
            relevant ? "" : "opacity-30",
            opt.anchor ? "group cursor-pointer hover:bg-slate-100" : "",
          ].filter(Boolean).join(" ");

          if (opt.anchor) {
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                className={cls}
                onClick={() => {
                  highlight(opt.anchor!);
                  // Update URL hash for sharing/bookmarking without triggering hashchange
                  history.pushState(null, "", `#${opt.anchor}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    highlight(opt.anchor!);
                    history.pushState(null, "", `#${opt.anchor}`);
                  }
                }}
              >
                {inner}
              </div>
            );
          }

          return <div key={i} className={cls}>{inner}</div>;
        })}
      </div>

      {/* Detail sections — these are scroll targets, not clickable wrappers */}
      {options.some(o => o.anchor && (o.sections?.length || o.details?.length)) && (
        <div className="mt-6 space-y-4">
          {options
            .filter(o => o.anchor && (o.sections?.length || o.details?.length))
            .map((opt, i) => {
              const relevant    = isRelevant(opt.anchor, path);
              const highlighted = highlightId === opt.anchor;
              return (
                <div
                  key={i}
                  id={opt.anchor}
                  className={[
                    "scroll-mt-28 rounded-xl border px-4 py-4 transition-all duration-300",
                    highlighted ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300 ring-offset-1"
                    : relevant  ? "border-slate-100 bg-white"
                    :             "border-slate-100 bg-white opacity-30",
                  ].join(" ")}
                >
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    {opt.detailTitle ?? opt.type}
                  </h3>

                  {/* Structured sub-sections */}
                  {opt.sections?.length ? (
                    <div className="space-y-5">
                      {opt.sections.map((sec) => {
                        const secHighlighted = highlightId === sec.id;
                        return (
                          <div
                            key={sec.id}
                            id={sec.id}
                            className={[
                              "-mx-2 rounded-lg px-2 py-1 scroll-mt-28 transition-all duration-300",
                              secHighlighted ? "bg-emerald-50 ring-2 ring-emerald-300" : "",
                            ].join(" ")}
                          >
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                              {sec.heading}
                            </h4>
                            <ul className="space-y-2">
                              {sec.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                            {/* SearchHint is safe here — parent is a plain <div> */}
                            {sec.officialLink && (
                              <SearchHint query={sec.officialLink.label} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Flat list for options without named sub-sections */
                    <>
                      <ul className="space-y-2.5">
                        {opt.details!.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {/* SearchHint is safe here — parent is a plain <div> */}
                      {opt.officialLink && (
                        <SearchHint query={opt.officialLink.label} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
