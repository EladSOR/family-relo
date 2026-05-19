"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

type Variant = "footer" | "inline";

interface Props {
  source: string;            // analytics tag — "footer", "paywall", "compare-page"
  variant?: Variant;
  placeholder?: string;
  cta?: string;
  successMsg?: string;
  className?: string;
}

const STYLES: Record<Variant, {
  form: string;
  input: string;
  button: string;
  success: string;
}> = {
  footer: {
    form:    "flex w-full max-w-sm items-center gap-2",
    input:   "min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300",
    button:  "shrink-0 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60",
    success: "flex items-center gap-2 text-sm font-semibold text-emerald-600",
  },
  inline: {
    form:    "flex w-full items-center gap-2",
    input:   "min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#FF5A5F]",
    button:  "shrink-0 cursor-pointer rounded-lg bg-[#FF5A5F] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-60",
    success: "flex items-center gap-2 text-sm font-semibold text-emerald-600",
  },
};

export default function EmailCapture({
  source,
  variant = "inline",
  placeholder = "you@example.com",
  cta = "Notify me",
  successMsg = "You're on the list — we'll email you at launch.",
  className = "",
}: Props) {
  const [email,    setEmail]    = useState("");
  const [status,   setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const styles = STYLES[variant];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/audience/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Subscribe failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Subscribe failed");
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.success} ${className}`}>
        <Check size={15} className="shrink-0" />
        <span>{successMsg}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* suppressHydrationWarning: password manager extensions (Dashlane,
          Grammarly, LastPass) inject `data-*` attributes into form/input
          elements before React hydrates, which Next 16 flags as a hydration
          mismatch. The mismatch is benign — the extension always re-injects
          on the client — so we suppress the warning on the two elements
          extensions actually touch. */}
      <form onSubmit={handleSubmit} className={styles.form} suppressHydrationWarning>
        <div className="relative min-w-0 flex-1">
          <Mail
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === "loading"}
            className={`${styles.input} pl-9`}
            suppressHydrationWarning
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={styles.button}
        >
          {status === "loading" ? "…" : cta}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-1.5 text-xs text-rose-500">{errorMsg}</p>
      )}
    </div>
  );
}
