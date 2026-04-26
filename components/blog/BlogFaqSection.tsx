import type { ReactNode } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export type BlogFaqItem = { question: string; answer: ReactNode };

type Props = {
  id?: string;
  /** Section heading, e.g. "Common questions" */
  title?: string;
  items: BlogFaqItem[];
};

/**
 * Accordion FAQ aligned with city guide FAQ styling — `details`/`summary` + chevron.
 * Content should match JSON-LD FAQPage on the same URL.
 */
export function BlogFaqSection({ id = "faq", title = "Common questions", items }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 scroll-mt-28" id={id} aria-labelledby={`${id}-heading`}>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <h2
          id={`${id}-heading`}
          className="flex items-center gap-2.5 border-b border-stone-100 bg-stone-50/80 px-4 py-3.5 text-base font-bold text-slate-900 md:px-5 md:text-lg"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#E84A4F]"
            aria-hidden
          >
            <HelpCircle size={19} strokeWidth={2.25} />
          </span>
          {title}
        </h2>
        <div className="divide-y divide-stone-100">
          {items.map((item, i) => (
            <details key={i} className="group/faq px-4 open:bg-slate-50/50 md:px-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 pr-0 text-left text-sm font-semibold text-slate-800 marker:hidden md:py-4 md:text-[15px]">
                <span className="min-w-0 flex-1 leading-snug">{item.question}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.25}
                  className="shrink-0 text-slate-400 transition-transform duration-200 group-open/faq:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 pr-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
