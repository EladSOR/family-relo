"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, AlertCircle } from "lucide-react";

const REASON_PRESETS = [
  "Adult content / not aligned with our family audience.",
  "Gambling, crypto, or financial scheme — outside our editorial standards.",
  "MLM / unverifiable business — we couldn't validate the brand.",
  "Destination URL did not resolve or appears unsafe.",
];

export default function AdActionButtons({
  adId, brandName,
}: { adId: string; brandName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  async function approve() {
    if (!confirm(`Approve "${brandName}" and put it live on the site?`)) return;
    setBusy("approve");
    setError("");
    try {
      const res = await fetch("/api/admin/ads/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Approve failed");
        setBusy(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Approve failed");
      setBusy(null);
    }
  }

  async function reject() {
    if (!reason.trim()) {
      setError("Add a short reason (the buyer will see it).");
      return;
    }
    setBusy("reject");
    setError("");
    try {
      const res = await fetch("/api/admin/ads/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, reason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Reject failed");
        setBusy(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Reject failed");
      setBusy(null);
    }
  }

  if (showReject) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700">Reason for rejection</p>
        <div className="flex flex-wrap gap-1.5">
          {REASON_PRESETS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setReason(p)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 hover:bg-stone-50"
            >
              {p.length > 36 ? p.slice(0, 36) + "…" : p}
            </button>
          ))}
        </div>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value.slice(0, 400))}
          rows={3}
          placeholder="Brief explanation — sent to the buyer with their refund."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
        />
        {error && (
          <p className="flex items-start gap-1 text-xs text-rose-600">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reject}
            disabled={busy !== null || !reason.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            <X size={13} strokeWidth={2.5} />
            {busy === "reject" ? "Rejecting…" : "Reject + refund"}
          </button>
          <button
            type="button"
            onClick={() => { setShowReject(false); setReason(""); setError(""); }}
            disabled={busy !== null}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={approve}
          disabled={busy !== null}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check size={13} strokeWidth={2.5} />
          {busy === "approve" ? "Approving…" : "Approve & go live"}
        </button>
        <button
          type="button"
          onClick={() => setShowReject(true)}
          disabled={busy !== null}
          className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          <X size={13} strokeWidth={2.5} />
          Reject + refund
        </button>
      </div>
      {error && (
        <p className="mt-2 flex items-start gap-1 text-xs text-rose-600">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
