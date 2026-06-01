"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  Download,
  Info,
  ShieldAlert,
  Calendar,
  Plane,
  Wallet,
  GraduationCap,
  Heart,
} from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useMemo, useState, useEffect, useRef } from "react";
import citiesData from "@/data/cities.json";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Destination, VisaOption } from "@/lib/types";
import {
  scoreCity,
  PRIORITY_LABELS,
  budgetFitLabel,
  type UserInputs,
  type CityScore,
  type Priority,
  type FamilySize,
  type WorkSituation,
  type KidsAge,
  type NumKids,
  type PassportTier,
} from "@/lib/scoring";
import { rankVisaOptions } from "@/lib/visaRanking";

const ALL_CITIES = citiesData as Destination[];

const DIM_KEYS = ["cost", "safety", "schools", "weather", "lifestyle"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePriorities(raw: string): Priority[] {
  const valid: Priority[] = ["cost", "safety", "schools", "weather", "lifestyle"];
  return raw
    .split(",")
    .filter((p): p is Priority => valid.includes(p as Priority));
}

function formatBudget(n: number): string {
  return `$${n.toLocaleString()}`;
}

function matchColor(pct: number): string {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 65) return "text-blue-600";
  if (pct >= 50) return "text-amber-600";
  return "text-rose-500";
}

function matchBg(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 65) return "bg-blue-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-rose-400";
}

function dimColor(score: number): string {
  if (score >= 78) return "bg-emerald-500";
  if (score >= 62) return "bg-blue-400";
  if (score >= 46) return "bg-amber-400";
  return "bg-rose-400";
}

function budgetFitStyle(fit: CityScore["budgetFit"]): string {
  switch (fit) {
    case "comfortable":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "fits":
      return "text-blue-700 bg-blue-50 border-blue-200";
    case "tight":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "over":
      return "text-rose-700 bg-rose-50 border-rose-200";
  }
}

/**
 * Verdict label for a single-city match.
 *
 * Framing rule (legal-safe — see chat handoff):
 *   - Phrases are OPINION (like a movie review), not advice.
 *   - Anchored to the match %, not arbitrary heuristics.
 *   - Never says "you should move there" / "you shouldn't" — always frames
 *     as how well it fits the inputs the user gave us.
 */
function verdictForPct(pct: number): {
  label: string;
  blurb: string;
  cls: string;
  Icon: typeof Check;
} {
  if (pct >= 78) {
    return {
      label: "Strong fit",
      blurb:
        "Based on your inputs, this city scores in the top tier across the dimensions that matter most to you. It deserves to be on your shortlist.",
      cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
      Icon: Check,
    };
  }
  if (pct >= 62) {
    return {
      label: "Worth considering",
      blurb:
        "Solid match overall — some areas are strong, others have trade-offs to think through. Likely workable with planning.",
      cls: "border-blue-200 bg-blue-50 text-blue-800",
      Icon: Info,
    };
  }
  if (pct >= 46) {
    return {
      label: "Mixed fit",
      blurb:
        "Notable trade-offs vs. your stated priorities. Workable, but expect to compromise on at least one dimension you flagged as important.",
      cls: "border-amber-200 bg-amber-50 text-amber-800",
      Icon: Info,
    };
  }
  return {
    label: "Be cautious",
    blurb:
      "Several gaps vs. your stated priorities. Possible to make it work, but go in with eyes open — visit first if you haven't already.",
    cls: "border-rose-200 bg-rose-50 text-rose-800",
    Icon: ShieldAlert,
  };
}


// ── Sub-components ────────────────────────────────────────────────────────────

function BlurredRow({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-4 rounded-md bg-slate-200"
      style={{ width }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SingleCityResultsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null | undefined>(undefined);
  const [unlockedViaPayment, setUnlockedViaPayment] = useState(false);
  // Tracks which plan's checkout is currently spinning ("single_city" = $7
  // single report, "bundle" = $19 three-report bundle). null when idle.
  const [checkoutLoading, setCheckoutLoading] = useState<"single_city" | "bundle" | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const snapshotRef = useRef({
    score: null as CityScore | null,
    city: null as Destination | null,
    budget: 5000,
    familySize: "family" as FamilySize,
    work: "remote" as WorkSituation,
    priorities: [] as Priority[],
    numKids: undefined as NumKids | undefined,
    kidsAge: undefined as KidsAge | undefined,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const cityId = params.get("city") ?? "";
  const budget = Number(params.get("budget") ?? 5000);
  const familySize = (params.get("family") ?? "family") as FamilySize;
  const work = (params.get("work") ?? "remote") as WorkSituation;
  const passport = (() => {
    const raw = params.get("passport");
    return raw && ["eu", "tier1", "other"].includes(raw)
      ? (raw as PassportTier)
      : ("other" as PassportTier);
  })();
  const priorities = parsePriorities(params.get("priorities") ?? "cost,safety");
  const isPreview = params.get("preview") === "true";
  const isUnlocked = isPreview || unlockedViaPayment;

  const sessionIdParam = params.get("session_id");

  const rawKids = params.get("kids");
  const rawKidsAge = params.get("kidsage");
  const numKids: NumKids | undefined =
    familySize === "family" && rawKids
      ? (Math.min(3, Math.max(1, Number(rawKids))) as NumKids)
      : undefined;
  const kidsAge: KidsAge | undefined =
    familySize === "family" && rawKidsAge
      ? (["preschool", "primary", "secondary"].includes(rawKidsAge)
          ? (rawKidsAge as KidsAge)
          : "primary")
      : undefined;

  const inputs: UserInputs = {
    budget,
    familySize,
    workSituation: work,
    priorities,
    numKids,
    kidsAge,
  };

  const city = useMemo(
    () => ALL_CITIES.find((c) => c.id === cityId) ?? null,
    [cityId],
  );

  const score: CityScore | null = useMemo(
    () => (city ? scoreCity(city, inputs) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.toString()],
  );

  snapshotRef.current = {
    score,
    city,
    budget,
    familySize,
    work,
    priorities,
    numKids,
    kidsAge,
  };

  if (!city || !score) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <p className="mb-4 text-slate-500">City not found. Please start over.</p>
        <Link
          href="/single-city/build"
          className="rounded-xl bg-[#FF5A5F] px-6 py-3 text-sm font-bold text-white"
        >
          Start over
        </Link>
      </div>
    );
  }

  const kidsAgeLabel: Record<KidsAge, string> = {
    preschool: "under 5",
    primary: "ages 5–12",
    secondary: "ages 13+",
  };

  const familyLabel =
    familySize === "solo"
      ? "Solo"
      : familySize === "couple"
        ? "Couple"
        : numKids && kidsAge
          ? `Family · ${numKids === 3 ? "3+" : numKids} kid${numKids > 1 ? "s" : ""} ${kidsAgeLabel[kidsAge]}`
          : "Family with kids";

  const workLabel =
    work === "remote" ? "remote work" : work === "local" ? "local job" : "freelance";

  // ── Post-payment confirmation flow (Stripe return + save report) ──────────
  useEffect(() => {
    if (!sessionIdParam || !user) return;
    const sessionId: string = sessionIdParam;
    let cancelled = false;

    async function completeReturn() {
      const snap = snapshotRef.current;
      if (!snap.score) return;

      for (let i = 0; i < 12; i++) {
        if (cancelled) return;
        const r = await fetch(
          `/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (r.status === 401) return;
        if (r.status === 202) {
          await new Promise((res) => setTimeout(res, 1000));
          continue;
        }
        if (!r.ok) return;
        const data = (await r.json()) as { pending?: boolean; purchaseId?: string };
        if (data.pending) {
          await new Promise((res) => setTimeout(res, 1000));
          continue;
        }
        if (!data.purchaseId || cancelled) return;

        const reportQs = new URLSearchParams(window.location.search);
        reportQs.delete("session_id");
        const reportUrl = `${window.location.pathname}?${reportQs.toString()}`;

        const saveRes = await fetch("/api/comparisons/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purchase_id: data.purchaseId,
            // Single-element arrays — same `comparisons` table is reused for
            // both compare reports and single-city reports.
            city_ids: [snap.score.city.id],
            city_names: [snap.score.city.city],
            inputs: {
              budget: snap.budget,
              familySize: snap.familySize,
              workSituation: snap.work,
              priorities: snap.priorities,
              numKids: snap.numKids,
              kidsAge: snap.kidsAge,
            },
            report_url: reportUrl,
            top_match: snap.score.city.city,
            top_pct: snap.score.matchPct,
          }),
        });
        if (cancelled) return;
        if (saveRes.ok) {
          setUnlockedViaPayment(true);
          reportQs.set("preview", "true");
          router.replace(`/single-city/results?${reportQs.toString()}`);
        }
        return;
      }
    }

    void completeReturn();
    return () => {
      cancelled = true;
    };
  }, [sessionIdParam, user?.id, router]);

  /**
   * Start a Stripe Checkout session.
   *   plan = "single_city" → $7 single report (default flow)
   *   plan = "bundle"      → $19 bundle upsell. We always pass
   *                          returnPath = "/single-city/results" so the
   *                          user lands back on THIS report after paying.
   *                          1 of their 3 new credits will then unlock it
   *                          via the auto-save flow below.
   */
  async function startCheckout(plan: "single_city" | "bundle") {
    setPayError(null);
    setCheckoutLoading(plan);

    if (!user) {
      const qs = new URLSearchParams(window.location.search);
      qs.delete("session_id");
      qs.delete("preview");
      qs.set("autoCheckout", plan);
      const next = `${window.location.pathname}?${qs.toString()}`;
      router.push(`/auth/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const qs = new URLSearchParams(window.location.search);
    qs.delete("session_id");
    qs.delete("preview");
    qs.delete("autoCheckout");
    const r = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        reportQs: qs.toString(),
        // Keep the user on this single-city report even when buying a bundle,
        // so the post-payment auto-save unlocks the report they were
        // looking at instead of dropping them into an empty /compare/results.
        returnPath: "/single-city/results",
      }),
    });
    const data = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
    setCheckoutLoading(null);
    if (r.status === 401) {
      const qs2 = new URLSearchParams(window.location.search);
      qs2.set("autoCheckout", plan);
      router.push(
        `/auth/login?next=${encodeURIComponent(window.location.pathname + "?" + qs2.toString())}`,
      );
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setPayError(data.error ?? "Checkout unavailable. Try again soon.");
  }

  // Auto-resume checkout after login redirect (for either plan).
  const autoCheckoutFlag = params.get("autoCheckout");
  useEffect(() => {
    if (!user) return;
    if (autoCheckoutFlag !== "single_city" && autoCheckoutFlag !== "bundle") return;
    if (checkoutLoading) return;
    void startCheckout(autoCheckoutFlag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, autoCheckoutFlag]);

  // Fetch credit balance — bundle owners can redeem on single-city reports too.
  useEffect(() => {
    if (!user) {
      setCredits(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetch("/api/credits/balance", { cache: "no-store" });
        if (!r.ok || cancelled) return;
        const data = (await r.json()) as { remaining?: number };
        if (typeof data.remaining === "number") setCredits(data.remaining);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  async function redeemCredit() {
    if (!user || redeeming) return;
    setPayError(null);
    setRedeeming(true);

    const snap = snapshotRef.current;
    if (!snap.score) {
      setRedeeming(false);
      return;
    }
    const reportQs = new URLSearchParams(window.location.search);
    reportQs.delete("session_id");
    reportQs.delete("autoCheckout");
    reportQs.delete("preview");
    const reportUrl = `${window.location.pathname}?${reportQs.toString()}`;

    try {
      const r = await fetch("/api/comparisons/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_ids: [snap.score.city.id],
          city_names: [snap.score.city.city],
          inputs: {
            budget: snap.budget,
            familySize: snap.familySize,
            workSituation: snap.work,
            priorities: snap.priorities,
            numKids: snap.numKids,
            kidsAge: snap.kidsAge,
          },
          report_url: reportUrl,
          top_match: snap.score.city.city,
          top_pct: snap.score.matchPct,
        }),
      });

      if (r.status === 402) {
        setPayError("No credits remaining. Buy this report below.");
        setCredits(0);
        return;
      }
      if (!r.ok) {
        setPayError("Could not unlock with credit. Try again.");
        return;
      }
      const data = (await r.json()) as { duplicate?: boolean };
      if (!data.duplicate) {
        setCredits((c) => (typeof c === "number" ? Math.max(0, c - 1) : c));
      }
      setUnlockedViaPayment(true);
      reportQs.set("preview", "true");
      router.replace(`/single-city/results?${reportQs.toString()}`);
    } catch {
      setPayError("Network error. Try again.");
    } finally {
      setRedeeming(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadPDF() {
    window.print();
  }

  // ── Computed view data ───────────────────────────────────────────────────
  const verdict = verdictForPct(score.matchPct);
  const visaOptions = city.visa?.options ?? [];
  const {
    ranked: rankedVisaOptions,
    topReasoning,
    topAdvisory,
  } = rankVisaOptions(visaOptions, work, passport, city.countrySlug);
  const headroom = budget - score.budgetMid;

  // Personalised checklist — reorder so the user's top priority sections
  // surface first. Same items, just resequenced. Always show all of them.
  const personalizedChecklist = useMemo(() => {
    const list = [...city.actionChecklist];
    const prioritySectionMap: Record<Priority, string[]> = {
      cost: ["banking", "housing"],
      safety: ["safety", "healthcare"],
      schools: ["schools", "childcare"],
      weather: [],
      lifestyle: ["residency"],
    };
    const priorityWeight = (section: string | undefined): number => {
      if (!section) return 0;
      for (let i = 0; i < priorities.length; i++) {
        if (prioritySectionMap[priorities[i]]?.includes(section)) {
          return priorities.length - i; // higher priority = larger weight
        }
      }
      return 0;
    };
    return list.sort(
      (a, b) =>
        priorityWeight(b.targetSection) - priorityWeight(a.targetSection),
    );
  }, [city, priorities]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="no-print border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={24} />
          </Link>
          <div className="no-print flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  Share
                </>
              )}
            </button>
            {isUnlocked && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#FF5A5F]/30 bg-[#FF5A5F]/5 px-3 py-2 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FF5A5F]/10"
                title="Opens your browser's print dialog — choose 'Save as PDF' as destination"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Save as PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            )}
            <Link
              href="/single-city/build"
              className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 md:flex"
            >
              <ArrowLeft size={13} />
              Edit
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
        {unlockedViaPayment && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <Check size={16} className="shrink-0 text-emerald-600" />
            <div className="flex-1 text-sm">
              <p className="font-bold text-emerald-800">Payment confirmed — full report unlocked</p>
              <p className="text-xs text-emerald-700">
                Saved to <Link href="/account" className="font-semibold underline">your account</Link>. Receipt sent by email.
              </p>
            </div>
          </div>
        )}

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-6 md:mb-8">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F] md:text-xs">
            Should we move here?
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {city.city}, {city.country}
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">{city.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {familyLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {formatBudget(budget)}/mo
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              {workLabel}
            </span>
            {priorities.slice(0, 2).map((p) => (
              <span
                key={p}
                className="rounded-full border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-2.5 py-1 text-[11px] font-semibold text-[#FF5A5F]"
              >
                {PRIORITY_LABELS[p]}
              </span>
            ))}
          </div>
        </div>

        {/* ── "What this report is" disclaimer (always visible — trust signal) ── */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500 md:mb-8 md:px-5 md:py-4 md:text-sm">
          <p className="mb-1 flex items-center gap-1.5 font-bold text-slate-700">
            <Info size={13} className="text-slate-400" />
            What this report is
          </p>
          <p>
            A personalized starting point based on your inputs, built on
            FamiRelo&apos;s published {city.city} data
            {city.lastReviewed && (
              <>
                {" "}(last reviewed {city.lastReviewed})
              </>
            )}
            . Use it to focus your research, not replace it. Visa rules, school
            fees, and rents change — confirm specifics with the linked official
            sources before making decisions.
          </p>
        </div>

        {/* ── Verdict + Match score ─────────────────────────────────────── */}
        <section className="mb-8 grid gap-4 md:grid-cols-[1fr,1.5fr]">
          {/* Match score card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm md:p-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Match for your family
            </p>
            <p className={`text-6xl font-black tabular-nums ${matchColor(score.matchPct)} md:text-7xl`}>
              {score.matchPct}
            </p>
            <p className="text-xs font-medium text-slate-400">out of 100</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${matchBg(score.matchPct)}`}
                style={{ width: `${score.matchPct}%` }}
              />
            </div>
          </div>

          {/* Verdict box */}
          <div className={`rounded-2xl border p-6 shadow-sm md:p-8 ${verdict.cls}`}>
            <div className="mb-3 flex items-center gap-2">
              <verdict.Icon size={18} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Verdict</p>
            </div>
            <p className="text-xl font-extrabold tracking-tight md:text-2xl">
              {verdict.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed md:text-base">{verdict.blurb}</p>
          </div>
        </section>

        {/* ── Score breakdown ────────────────────────────────────────────── */}
        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
            Score breakdown
          </h2>
          <div className="space-y-4">
            {DIM_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <p className="w-28 shrink-0 text-xs font-semibold text-slate-600 md:w-36 md:text-sm">
                  {PRIORITY_LABELS[key]}
                </p>
                <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 8 }}>
                  <div
                    className={`h-full rounded-full ${dimColor(score.dimensions[key])}`}
                    style={{ width: `${score.dimensions[key]}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-slate-600 md:text-sm">
                  {score.dimensions[key]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Budget reality check ──────────────────────────────────────── */}
        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-4 flex items-center gap-2">
            <Wallet size={16} className="text-slate-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Your {formatBudget(budget)}/month budget
            </h2>
          </div>

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 md:text-base">
                Typical {city.city} family budget
              </p>
              <p className="text-xs text-slate-400">
                ~{formatBudget(score.budgetMin)}–{formatBudget(score.budgetMax)}/mo
                {" "}(median ~{formatBudget(score.budgetMid)})
              </p>
            </div>
            <span
              className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${budgetFitStyle(score.budgetFit)}`}
            >
              {budgetFitLabel(score.budgetFit)}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${matchBg(score.dimensions.cost)}`}
              style={{ width: `${Math.min(100, (budget / (score.budgetMax * 1.4)) * 100)}%` }}
            />
          </div>

          {score.kidsMonthlyEstimate !== undefined && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
              <span className="text-xs font-medium text-amber-700 md:text-sm">
                + Estimated school / childcare
              </span>
              <span className="text-xs font-bold text-amber-800 md:text-sm">
                ~{formatBudget(score.kidsMonthlyEstimate)}/mo
              </span>
            </div>
          )}

          {headroom > 0 && score.budgetFit !== "over" && (
            <p className="mt-3 text-xs font-medium text-slate-500 md:text-sm">
              You&apos;d typically have ~{formatBudget(headroom)} headroom each month
              {score.kidsMonthlyEstimate !== undefined && " (before kids costs)"}.
            </p>
          )}
          {score.budgetFit === "tight" && (
            <p className="mt-3 text-xs font-medium text-amber-700 md:text-sm">
              This is a tight fit — workable, but expect to budget carefully
              and skip some discretionary spend.
            </p>
          )}
          {score.budgetFit === "over" && (
            <p className="mt-3 text-xs font-medium text-rose-700 md:text-sm">
              Your budget is below the typical range here. Consider a less
              central neighborhood or a longer commute — or revisit the budget.
            </p>
          )}
        </section>

        {/* ── 3 strengths + 3 watch-outs (always visible, free preview part) ── */}
        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            <Heart size={14} />
            Family fit · what works & what to watch
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                What works for {familyLabel.toLowerCase()}
              </p>
              <ul className="space-y-2.5">
                {city.familyFit.bestFor.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-snug text-slate-700"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Watch out for
              </p>
              <ul className="space-y-2.5">
                {city.familyFit.watchOutFor.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-snug text-slate-700"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Paywalled content ─────────────────────────────────────────── */}
        {isUnlocked ? (
          <>
            {/* ── Visa paths ──────────────────────────────────────────── */}
            <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
              <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
                <Plane size={16} className="text-[#FF5A5F]" />
                Visa paths that match your profile
              </h2>
              <p className="mb-5 text-xs leading-relaxed text-slate-500 md:text-sm">
                Filtered and ranked based on your inputs — not advice. Always
                confirm exact requirements with an immigration lawyer before
                applying.
              </p>

              {rankedVisaOptions.length === 0 ? (
                <p className="rounded-xl border border-slate-100 bg-stone-50 p-4 text-sm text-slate-500">
                  Visa rules for this country are handled in the country guide —
                  see the &ldquo;Visa &amp; residency&rdquo; section on the{" "}
                  <Link
                    href={`/${city.countrySlug}/${city.citySlug}#visa`}
                    className="font-semibold text-[#FF5A5F] hover:underline"
                  >
                    {city.city} guide
                  </Link>{" "}
                  for the full breakdown.
                </p>
              ) : (
                <div className="space-y-4">
                  {rankedVisaOptions.slice(0, 4).map((opt, i) => (
                    <div
                      key={opt.anchor ?? opt.type ?? i}
                      className={`rounded-xl border p-4 md:p-5 ${
                        i === 0 && topReasoning
                          ? "border-[#FF5A5F]/30 bg-[#FF5A5F]/5"
                          : "border-slate-100 bg-stone-50/40"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900 md:text-base">
                            {opt.type}
                          </p>
                          {opt.duration && (
                            <p className="mt-0.5 text-xs text-slate-500">
                              Duration: {opt.duration}
                            </p>
                          )}
                        </div>
                        {i === 0 && topReasoning && (
                          <span className="shrink-0 rounded-full border border-[#FF5A5F]/30 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
                            Most likely match
                          </span>
                        )}
                      </div>
                      {opt.description && (
                        <p className="mb-3 text-sm leading-snug text-slate-700">
                          {opt.description}
                        </p>
                      )}
                      {i === 0 && topReasoning && (
                        <p className="mb-3 rounded-lg bg-white px-3 py-2 text-xs leading-snug text-[#FF5A5F]">
                          {topReasoning}
                        </p>
                      )}
                      {i === 0 && topAdvisory && (
                        <p className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-snug text-slate-600">
                          {topAdvisory}
                        </p>
                      )}
                      {opt.details && opt.details.length > 0 && (
                        <ul className="space-y-1.5">
                          {opt.details.slice(0, 4).map((d, di) => (
                            <li
                              key={di}
                              className="flex items-start gap-2 text-xs leading-snug text-slate-600 md:text-sm"
                            >
                              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500 md:text-xs">
                Confirm exact eligibility, income / savings thresholds, and
                document lists with a licensed immigration lawyer before
                applying. This is filtered information, not legal advice.
              </p>
            </section>

            {/* ── Schools snapshot (only if family with kids) ───────────── */}
            {familySize === "family" && (
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
                <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
                  <GraduationCap size={16} className="text-[#FF5A5F]" />
                  Schools snapshot for your kids
                </h2>
                <p className="mb-5 text-xs leading-relaxed text-slate-500 md:text-sm">
                  {kidsAge && (
                    <>For {kidsAgeLabel[kidsAge]} · </>
                  )}
                  Based on what the {city.city} market typically offers expat
                  families.
                </p>
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-slate-700">
                    {city.schools.summary}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {city.schools.internationalOptions}
                  </p>
                  {city.schools.tip && (
                    <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm font-medium leading-snug text-amber-900">
                      ⚡ {city.schools.tip}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── Personalized 90-day pre-arrival checklist ─────────────── */}
            <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
              <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg">
                <Calendar size={16} className="text-[#FF5A5F]" />
                Your 90-day pre-arrival checklist
              </h2>
              <p className="mb-5 text-xs leading-relaxed text-slate-500 md:text-sm">
                Ordered by what matters most to you. Tap each item on the{" "}
                <Link
                  href={`/${city.countrySlug}/${city.citySlug}`}
                  className="font-semibold text-[#FF5A5F] hover:underline"
                >
                  {city.city} guide
                </Link>{" "}
                for full instructions and sources.
              </p>
              <ul className="space-y-2.5">
                {personalizedChecklist.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 bg-stone-50/50 px-3 py-2.5"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-[10px] font-bold text-slate-400">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-snug text-slate-700">
                      {item.label}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Final verdict + next steps ─────────────────────────── */}
            <section className="mb-8 rounded-2xl border border-[#FF5A5F]/15 bg-gradient-to-br from-[#FF5A5F]/5 to-white p-6 shadow-sm md:p-8">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#FF5A5F]">
                Final read
              </p>
              <h2 className="mb-3 text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
                {verdict.label} for {familyLabel.toLowerCase()} at{" "}
                {formatBudget(budget)}/mo
              </h2>
              <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                {verdict.blurb} Your top strength here is{" "}
                <strong>
                  {([...DIM_KEYS] as Priority[])
                    .sort((a, b) => score.dimensions[b] - score.dimensions[a])
                    .map((k) => PRIORITY_LABELS[k])[0]
                    .toLowerCase()}
                </strong>{" "}
                ({Math.max(...Object.values(score.dimensions))}/100). Your biggest
                trade-off is{" "}
                <strong>
                  {([...DIM_KEYS] as Priority[])
                    .sort((a, b) => score.dimensions[a] - score.dimensions[b])
                    .map((k) => PRIORITY_LABELS[k])[0]
                    .toLowerCase()}
                </strong>{" "}
                ({Math.min(...Object.values(score.dimensions))}/100).
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/${city.countrySlug}/${city.citySlug}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
                >
                  Open the full {city.city} guide
                </Link>
                <Link
                  href={`/compare/build?cities=${encodeURIComponent(city.id)}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-300"
                >
                  Compare {city.city} to other cities
                </Link>
              </div>
            </section>
          </>
        ) : (
          /* ── Paywall (blurred preview + payment) ──────────────────── */
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Visa paths
                </h2>
                <div className="space-y-3">
                  <BlurredRow width="85%" />
                  <BlurredRow width="70%" />
                  <BlurredRow width="80%" />
                </div>
              </section>
              <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
                  90-day checklist
                </h2>
                <div className="space-y-3">
                  <BlurredRow width="90%" />
                  <BlurredRow width="75%" />
                  <BlurredRow width="85%" />
                </div>
              </section>
              <section className="mb-8 rounded-2xl border border-[#FF5A5F]/10 bg-gradient-to-br from-[#FF5A5F]/5 to-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                  Final read
                </h2>
                <BlurredRow width="95%" />
                <div className="mt-2" />
                <BlurredRow width="80%" />
              </section>
            </div>

            {/* Paywall card */}
            <div className="no-print absolute inset-0 flex items-start justify-center pt-6 md:pt-10">
              <div className="mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <Lock size={20} className="text-slate-500" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                    Unlock your full report
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Visa paths that match your profile, schools snapshot,
                    90-day checklist &amp; a personalized final read — yours
                    forever.
                  </p>
                </div>

                <ul className="mb-6 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-medium text-slate-600">
                  {[
                    "Visa paths ranked for you",
                    "Schools snapshot",
                    "90-day pre-arrival checklist",
                    "Personalized final read",
                    "Shareable link",
                    "Download as PDF",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check size={11} className="shrink-0 text-[#FF5A5F]" />
                      {item}
                    </li>
                  ))}
                </ul>

                {credits && credits > 0 ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" strokeWidth={2.5} />
                      <p className="text-sm font-bold text-emerald-800">
                        You have {credits} report{credits !== 1 ? "s" : ""} remaining
                      </p>
                    </div>
                    <p className="mb-4 text-xs text-emerald-700/80">
                      Use 1 credit to unlock this report — no extra charge.
                    </p>
                    <button
                      type="button"
                      disabled={redeeming}
                      onClick={() => { void redeemCredit(); }}
                      className="w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {redeeming ? "Unlocking…" : "Unlock with 1 credit"}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Primary CTA — the $7 single-city report */}
                    <p className="mb-1 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
                      <span>Launch price</span>
                      <span className="text-base font-extrabold normal-case tracking-normal text-slate-900">
                        $7
                      </span>
                      <span className="text-base font-bold normal-case tracking-normal text-slate-300 line-through">
                        $14
                      </span>
                    </p>
                    <button
                      type="button"
                      disabled={user === undefined || checkoutLoading !== null}
                      onClick={() => { void startCheckout("single_city"); }}
                      className="w-full cursor-pointer rounded-xl bg-[#FF5A5F] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#e84a4f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkoutLoading === "single_city" ? "…" : "Pay $7 — unlock this report"}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-slate-400">
                      One-time payment · Yours forever · Email receipt
                    </p>

                    {/* Bundle upsell — single line of pitch. Bundle = 3
                        comparison reports (3 cities each); a credit can
                        ALSO be redeemed for another single-city report,
                        but we don't lead with that to keep the choice
                        simple at the point of sale. */}
                    <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <span className="h-px flex-1 bg-slate-200" />
                      Or
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* Whole card is clickable. We also include an explicit
                        button-like CTA pill at the bottom-right so the
                        affordance is unambiguous at a glance. */}
                    <button
                      type="button"
                      disabled={user === undefined || checkoutLoading !== null}
                      onClick={() => { void startCheckout("bundle"); }}
                      className="group w-full cursor-pointer rounded-xl border-2 border-[#FF5A5F]/40 bg-[#FF5A5F]/5 px-4 py-3.5 text-left transition-all hover:border-[#FF5A5F]/60 hover:bg-[#FF5A5F]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="flex items-baseline gap-2 text-base font-extrabold text-slate-900">
                          Compare cities instead — $19
                          <span className="text-sm font-bold text-slate-300 line-through">
                            $39
                          </span>
                        </span>
                        <span className="shrink-0 text-[11px] font-bold text-slate-500">
                          3 reports
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF5A5F]">
                        Launch price
                      </p>
                      <p className="mt-1 text-xs leading-snug text-slate-600">
                        3 full comparison reports (up to 3 cities each) — better
                        if you have a shortlist instead of one city in mind.
                      </p>
                      <div className="mt-3 flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#FF5A5F] shadow-sm ring-1 ring-[#FF5A5F]/30 transition-all group-hover:bg-[#FF5A5F] group-hover:text-white group-hover:ring-[#FF5A5F]">
                          {checkoutLoading === "bundle" ? "…" : "Choose bundle"}
                          <ArrowRight size={12} strokeWidth={2.5} />
                        </span>
                      </div>
                    </button>

                    {user === null && (
                      <p className="mt-3 text-center text-[11px] text-slate-400">
                        You&apos;ll sign in with your email as part of checkout —
                        takes 10 seconds.
                      </p>
                    )}
                  </>
                )}

                {payError && (
                  <p className="mt-2 text-center text-xs font-medium text-rose-600">{payError}</p>
                )}

                {user && (
                  <p className="mt-2 text-center text-[11px] text-slate-400">
                    Signed in as <span className="font-semibold">{user.email}</span> — reports save to your account
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
