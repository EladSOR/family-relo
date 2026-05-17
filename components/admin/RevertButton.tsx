"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";

interface Props {
  commitSha: string;
  message: string;
}

export default function RevertButton({ commitSha, message }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onClick() {
    const ok = confirm(
      `Revert this change?\n\n${message}\n\nThis restores data/cities.json to the state it was in before this commit, as a new commit on main.`,
    );
    if (!ok) return;

    startTransition(async () => {
      setErrorMsg(null);
      try {
        const res = await fetch("/api/admin/revert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commitSha }),
        });
        const json = await res.json();
        if (!res.ok) {
          setErrorMsg(json.error ?? "Revert failed");
          return;
        }
        router.refresh();
      } catch (err) {
        setErrorMsg((err as Error).message);
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end gap-0.5">
      <button
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-700 disabled:opacity-50"
      >
        {pending ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
        Revert
      </button>
      {errorMsg ? <span className="text-[10px] text-red-600">{errorMsg}</span> : null}
    </div>
  );
}
