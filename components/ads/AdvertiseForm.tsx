"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, ArrowRight, AlertCircle, Check, LogIn } from "lucide-react";
import Link from "next/link";
import { ADVERTISE_COPY } from "@/lib/ads/copy";
import { createClient } from "@/lib/supabase/client";

const MAX_BRAND = 40;
const MAX_TAGLINE = 80;
const MAX_LOGO_KB = 200;

interface UploadedLogo {
  url: string;
  path: string;
}

/**
 * Shared advertise form.
 *
 * Renders inside the modal AND on the /advertise standalone page so we have
 * a single source of truth for validation, upload, checkout, and copy.
 *
 * `compact` collapses spacing for use inside the modal (where vertical room
 * is at a premium on mobile).
 *
 * Auth: if the visitor is not signed in, we show a one-tap "sign in to
 * continue" panel that hands off to /auth/login?next=/advertise. Once signed
 * in they land on the standalone /advertise page (same form).
 */
export default function AdvertiseForm({ compact = false }: { compact?: boolean }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [clickUrl, setClickUrl] = useState("https://");
  const [logo, setLogo] = useState<UploadedLogo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setAuthChecked(true);
    });
  }, []);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > MAX_LOGO_KB * 1024) {
      setError(`Logo must be ${MAX_LOGO_KB} KB or smaller`);
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ads/upload-logo", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      setLogo({ url: json.url, path: json.path });
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!brandName.trim() || !tagline.trim()) {
      setError("Fill in your brand name and tagline.");
      return;
    }
    if (!clickUrl.startsWith("http")) {
      setError("Click URL must start with https://");
      return;
    }
    if (!logo) {
      setError("Upload your logo first.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ads/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          tagline: tagline.trim(),
          clickUrl: clickUrl.trim(),
          logoUrl: logo.url,
          logoPath: logo.path,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error ?? "Could not start checkout");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Could not start checkout");
      setSubmitting(false);
    }
  }

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className={compact ? "py-4 text-center text-xs text-slate-400" : "py-12 text-center text-sm text-slate-400"}>
        Loading…
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className={`text-center ${compact ? "py-4" : "py-6"}`}>
        <div className={`mx-auto mb-3 flex ${compact ? "h-9 w-9" : "h-12 w-12"} items-center justify-center rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F]`}>
          <LogIn size={compact ? 16 : 20} />
        </div>
        <p className={`${compact ? "text-sm" : "text-base"} font-bold text-slate-900`}>
          Sign in to apply
        </p>
        <p className={`mt-1 ${compact ? "text-xs" : "text-sm"} text-slate-500`}>
          We'll send a one-tap sign-in link to your email. Takes 10 seconds.
        </p>
        <Link
          href="/auth/login?next=/advertise"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#e84a4f]"
        >
          Continue
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const brandLeft = MAX_BRAND - brandName.length;
  const taglineLeft = MAX_TAGLINE - tagline.length;
  const gap = compact ? "space-y-3.5" : "space-y-5";

  return (
    <form onSubmit={handleSubmit} className={gap}>
      {/* Live preview card */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Preview</p>
        <PreviewCard logo={logo} brandName={brandName} tagline={tagline} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Brand name" hint={`${brandLeft} chars left`}>
          <input
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value.slice(0, MAX_BRAND))}
            placeholder="e.g. Sortino"
            required
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
          />
        </Field>
        <Field label="Click-through URL" hint="Where the ad links">
          <input
            type="url"
            value={clickUrl}
            onChange={e => setClickUrl(e.target.value)}
            placeholder="https://yourbrand.com"
            required
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
          />
        </Field>
      </div>

      <Field label="Tagline" hint={`${taglineLeft} chars left · 1–2 short lines`}>
        <input
          type="text"
          value={tagline}
          onChange={e => setTagline(e.target.value.slice(0, MAX_TAGLINE))}
          placeholder="What you offer, in one short line."
          required
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
        />
      </Field>

      <Field label="Logo" hint={`PNG / JPG / SVG · max ${MAX_LOGO_KB} KB`}>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleLogoChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {logo ? <Check size={15} className="text-emerald-600" /> : <Upload size={15} className="text-slate-500" />}
            {uploading ? "Uploading…" : logo ? "Logo uploaded — tap to replace" : "Choose logo file"}
          </span>
          <span className="text-[11px] text-slate-400">≤ {MAX_LOGO_KB} KB</span>
        </button>
      </Field>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || uploading || !logo}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Starting checkout…" : ADVERTISE_COPY.cta}
        {!submitting && <ArrowRight size={14} strokeWidth={2.5} />}
      </button>

      <p className="text-center text-[11px] text-slate-400">
        Signed in as {userEmail}. We'll email this address with the receipt and review status.
      </p>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function PreviewCard({
  logo, brandName, tagline,
}: {
  logo: UploadedLogo | null;
  brandName: string;
  tagline: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-stone-50/60 p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
          {logo
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.url} alt="" className="h-9 w-9 object-contain" />
            : <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Logo</span>}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900">
            {brandName || "Your brand"}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-600">
            {tagline || "Your one- or two-line tagline appears here."}
          </p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Sponsored
          </p>
        </div>
      </div>
    </div>
  );
}
