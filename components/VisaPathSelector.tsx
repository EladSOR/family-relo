"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
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
  "visa-d8":        "dnv",   // Portugal D8
  "visa-income":    "dnv",
  "visa-documents": "dnv",
  "visa-insurance": "dnv",
  "visa-apply":     "dnv",
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

  useEffect(() => {
    const highlight = (hash: string) => {
      if (!VISA_ANCHORS.has(hash)) return;
      const mapped = ANCHOR_PATH[hash];
      if (mapped) setPath(mapped);
      // Always restart the timer so re-clicking the same item re-triggers
      if (timerRef.current) clearTimeout(timerRef.current);
      setHighlightId(hash);
      timerRef.current = setTimeout(() => setHighlightId(null), 2500);
    };

    // hashchange covers first-click navigation and external/shared links
    const onHashChange = () => highlight(window.location.hash.slice(1));
    window.addEventListener("hashchange", onHashChange);

    // click covers re-clicking the same anchor — hashchange does not fire
    // when the hash is already the same value, so we need this separately
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#")) highlight(href.slice(1));
    };
    document.addEventListener("click", onClick);

    // Handle page load with a hash already in the URL
    if (window.location.hash) highlight(window.location.hash.slice(1));

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* Path selector */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PATH_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPath(id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              path === id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Option cards */}
      <div className="space-y-3">
        {options.map((opt, i) => {
          const relevant = isRelevant(opt.anchor, path);
          const inner = (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-900">{opt.type}</p>
                <div className="flex shrink-0 items-center gap-2">
                  {opt.duration && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                      {opt.duration}
                    </span>
                  )}
                  {opt.anchor && (
                    <ChevronRight
                      size={15}
                      className="text-slate-400 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />
                  )}
                </div>
              </div>
              {opt.description && (
                <p className="mt-1.5 text-sm text-slate-500">{opt.description}</p>
              )}
              {opt.officialLink && (
                <a
                  href={opt.officialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
                >
                  <ExternalLink size={11} />
                  {opt.officialLink.label}
                </a>
              )}
            </>
          );

          const cls = [
            "block rounded-xl bg-slate-50 px-4 py-3.5 transition-opacity duration-200",
            relevant ? "" : "opacity-30",
            opt.anchor ? "group cursor-pointer hover:bg-slate-100" : "",
          ].filter(Boolean).join(" ");

          return opt.anchor ? (
            <a key={i} href={`#${opt.anchor}`} className={cls}>{inner}</a>
          ) : (
            <div key={i} className={cls}>{inner}</div>
          );
        })}
      </div>

      {/* Detail sections */}
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
                            {sec.officialLink && (
                              <a
                                href={sec.officialLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#FF5A5F]/25 px-3 py-1.5 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FF5A5F]/5"
                              >
                                <ExternalLink size={12} />
                                {sec.officialLink.label}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Flat list for options without named sub-sections (EU, Tourist) */
                    <>
                      <ul className="space-y-2.5">
                        {opt.details!.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {opt.officialLink && (
                        <a
                          href={opt.officialLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#FF5A5F]/25 px-3 py-1.5 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FF5A5F]/5"
                        >
                          <ExternalLink size={12} />
                          {opt.officialLink.label}
                        </a>
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
