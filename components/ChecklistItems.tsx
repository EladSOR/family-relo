"use client";

import { ChevronRight } from "lucide-react";
import { useRef } from "react";

type Step = {
  label: string;
  targetSection?: string;
};

export function ChecklistItems({ steps }: { steps: Step[] }) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (!el) return;

    // Scroll with extra breathing room below the sticky header
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });

    // Highlight: snap to emerald-100, hold 2 s, then fade out over 1 s
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    el.style.transition = "none";
    el.style.backgroundColor = "#d1fae5"; // emerald-100
    holdTimer.current = setTimeout(() => {
      el.style.transition = "background-color 1s ease";
      el.style.backgroundColor = "";
      fadeTimer.current = setTimeout(() => {
        el.style.transition = "";
      }, 1100);
    }, 2000);
  }

  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={i}>
          {step.targetSection ? (
            <a
              href={`#${step.targetSection}`}
              onClick={(e) => handleClick(e, step.targetSection!)}
              className="group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                {i + 1}
              </span>
              <span className="flex-1 text-[15px] font-medium leading-snug text-slate-800 transition-colors group-hover:text-emerald-800">
                {step.label}
              </span>
              <ChevronRight
                size={16}
                className="mt-0.5 shrink-0 text-slate-300 transition-[color,transform] duration-150 group-hover:translate-x-1 group-hover:text-emerald-500"
              />
            </a>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-400">
                {i + 1}
              </span>
              <span className="text-[15px] leading-snug text-slate-500">{step.label}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
