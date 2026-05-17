"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

interface Props {
  cityId: string;
  cityName: string;
  compact?: boolean;
}

export default function MarkReviewedButton({ cityId, cityName, compact }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onClick() {
    if (!confirm(`Mark "${cityName}" as reviewed today? This commits to main and triggers a deploy.`)) return;

    startTransition(async () => {
      setState("idle");
      setErrorMsg(null);
      try {
        const res = await fetch("/api/admin/mark-reviewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cityId }),
        });
        const json = await res.json();
        if (!res.ok) {
          setState("error");
          setErrorMsg(json.error ?? "Failed");
          return;
        }
        setState("ok");
        router.refresh();
      } catch (err) {
        setState("error");
        setErrorMsg((err as Error).message);
      }
    });
  }

  const baseClass = compact
    ? "rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
    : "rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50";

  if (state === "ok") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
        <Check size={12} /> Reviewed
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-end gap-0.5">
      <button onClick={onClick} disabled={pending} className={baseClass}>
        {pending ? (
          <span className="inline-flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Saving…</span>
        ) : (
          "Mark reviewed"
        )}
      </button>
      {state === "error" && errorMsg ? (
        <span className="text-[10px] text-red-600">{errorMsg}</span>
      ) : null}
    </div>
  );
}
