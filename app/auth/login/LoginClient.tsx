"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Mail, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/account");
    });
  }, [router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <Link href="/" className="flex w-fit items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
            <MapPin size={13} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            FamiRelo
          </span>
        </Link>
      </nav>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            {sent ? (
              /* ── Success state ── */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <Check size={22} className="text-emerald-500" />
                </div>
                <h1 className="mb-2 text-lg font-extrabold text-slate-900">
                  Check your email
                </h1>
                <p className="text-sm leading-relaxed text-slate-500">
                  We sent a sign-in link to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>.
                  Click the link to continue — no password needed.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="mt-6 text-xs text-slate-400 hover:text-slate-600"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              /* ── Login form ── */
              <>
                <div className="mb-6 text-center">
                  <h1 className="mb-1 text-xl font-extrabold tracking-tight text-slate-900">
                    Sign in to Famirelo
                  </h1>
                  <p className="text-sm text-slate-500">
                    No password needed — we&apos;ll send you a link.
                  </p>
                </div>

                {/* Magic link form */}
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF5A5F]/50 focus:ring-2 focus:ring-[#FF5A5F]/10"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-rose-500">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Send sign-in link"}
                    {!loading && <ArrowRight size={14} strokeWidth={2.5} />}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Google OAuth */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
                  By signing in you agree to our{" "}
                  <Link href="/legal/terms" className="underline hover:text-slate-600">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="underline hover:text-slate-600">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
