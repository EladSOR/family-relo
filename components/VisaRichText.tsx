"use client";

import { Fragment, useMemo, type ReactNode } from "react";
import { buildGlossarySplitRegex, VISA_GLOSSARY } from "@/lib/visaGlossary";
import { TermHint } from "@/components/TermHint";

interface Props {
  text: string;
  /** When true, only the first occurrence of each term gets a hint (less visual noise). */
  firstOccurrenceOnly?: boolean;
}

/**
 * Renders plain copy with TermHint icons after recognised visa acronyms and terms.
 */
export function VisaRichText({ text, firstOccurrenceOnly = true }: Props) {
  const regex = useMemo(() => buildGlossarySplitRegex(), []);
  const parts = useMemo(() => {
    const out: ReactNode[] = [];
    const seen = new Set<string>();
    let last = 0;
    let m: RegExpExecArray | null;
    const r = new RegExp(regex.source, "g");
    while ((m = r.exec(text)) !== null) {
      if (m.index > last) {
        out.push(text.slice(last, m.index));
      }
      const term = m[1];
      const showHint =
        VISA_GLOSSARY[term] &&
        (!firstOccurrenceOnly || !seen.has(term));
      if (firstOccurrenceOnly && VISA_GLOSSARY[term]) seen.add(term);

      out.push(
        <Fragment key={`${m.index}-${term}`}>
          {term}
          {showHint ? <TermHint termId={term} /> : null}
        </Fragment>,
      );
      last = m.index + term.length;
    }
    if (last < text.length) {
      out.push(text.slice(last));
    }
    return out;
  }, [text, regex, firstOccurrenceOnly]);

  return <>{parts}</>;
}
