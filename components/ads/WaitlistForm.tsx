"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Single-input waitlist form shown when all ad slots are full.
 *
 * - Pre-fills the visitor's email if they're signed in (one-tap submit).
 * - POSTs to /api/ads/waitlist which writes the row + emails the admin.
 * - Shows a green confirmation in place of the form on success.
 * - Idempotent on the server: same email twice silently succeeds.
 */
export default function WaitlistForm({
  source = "advertise_page",
}: {
  source?: "advertise_page" | "modal";
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/ads/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Could not save");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not save");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={18} strokeWidth={3} />
        </div>
        <p className="text-sm font-bold text-emerald-900">You're on the waitlist</p>
        <p className="mt-1 text-xs leading-relaxed text-emerald-800">
          We'll email you the moment a slot opens up — usually within a few weeks.
          No spam, no marketing — just the heads-up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@yourbrand.com"
        autoComplete="email"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Notify me when a slot opens"}
        {!submitting && <ArrowRight size={14} strokeWidth={2.5} />}
      </button>

      <p className="text-center text-[11px] text-slate-400">
        We'll only email you when a slot opens. No marketing.
      </p>
    </form>
  );
}
