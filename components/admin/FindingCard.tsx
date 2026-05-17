"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import type { Finding } from "@/lib/admin/findings";

interface Props {
  finding: Finding;
  isDemo: boolean;
}

export default function FindingCard({ finding, isDemo }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    if (isDemo) {
      alert("This is demo data. Real findings appear after you enable the scanner and it runs against your live sources.");
      return;
    }
    const verb = action === "approve" ? "apply this change to cities.json and commit to main" : "reject this finding";
    if (!confirm(`Confirm: ${verb}?`)) return;

    startTransition(async () => {
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/admin/findings/${finding.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        const json = await res.json();
        if (!res.ok) {
          setErrorMsg(json.error ?? "Failed");
          return;
        }
        router.refresh();
      } catch (err) {
        setErrorMsg((err as Error).message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{finding.cityName}</span>
            <span>·</span>
            <span>{finding.country}</span>
            <span>·</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-slate-600">
              {finding.section}
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">{finding.summary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => decide("reject")}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-800 disabled:opacity-50"
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
            Reject
          </button>
          <button
            onClick={() => decide("approve")}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            Approve & apply
          </button>
        </div>
      </div>

      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-red-700">Current</p>
          <p className="text-slate-800">{finding.currentValue}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Proposed</p>
          <p className="text-slate-800">{finding.proposedValue}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setExpanded(v => !v)}
          className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800"
        >
          {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          Why
        </button>
        <a
          href={finding.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-[#FF5A5F]"
        >
          Open source
          <ExternalLink size={11} />
        </a>
      </div>

      {expanded && (
        <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
          <p className="whitespace-pre-line">{finding.rationale}</p>
          <p className="mt-2 text-[10px] text-slate-400">
            Field: <code className="font-mono">{finding.fieldPath}</code>
          </p>
        </div>
      )}

      {errorMsg && (
        <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-[11px] text-red-700">{errorMsg}</p>
      )}
    </div>
  );
}
