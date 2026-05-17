"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

interface Props {
  cityId?: string;
  section?: string;
  label?: string;
  compact?: boolean;
}

export default function ScanNowButton({ cityId, section, label = "Scan now", compact }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    const target = cityId && section ? `${cityId} / ${section}` : cityId ?? "every enabled section across every city";
    if (!confirm(`Run an OpenAI-powered scan now for ${target}? This spends real API credits.`)) return;

    startTransition(async () => {
      setMsg(null);
      try {
        const res = await fetch("/api/admin/scan/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityId, section }),
        });
        const json = await res.json();
        if (!res.ok) {
          setMsg(json.error ?? "Failed");
          return;
        }
        setMsg(`Scanned ${json.scanned} · ${json.newFindings} new`);
        router.refresh();
      } catch (err) {
        setMsg((err as Error).message);
      }
    });
  }

  const baseClass = compact
    ? "rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
    : "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50";

  return (
    <div className="inline-flex flex-col items-end gap-0.5">
      <button onClick={run} disabled={pending} className={baseClass}>
        {pending ? <Loader2 size={11} className="animate-spin" /> : <Search size={11} />}
        <span className="ml-1">{label}</span>
      </button>
      {msg && <span className="text-[10px] text-slate-500">{msg}</span>}
    </div>
  );
}
