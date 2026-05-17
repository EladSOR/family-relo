import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, ArrowRight, Package, RotateCcw, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import Logo from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "My Account | FamiRelo",
  robots: { index: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch purchases + comparisons in parallel
  const [{ data: purchases }, { data: comparisons }] = await Promise.all([
    supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("comparisons")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  // Credits summary across all purchases.
  // Refunded purchases have credits_used === credits_total (revoked) but we
  // surface them differently in the UI so the user understands "you didn't
  // burn through all your credits — some were refunded, not consumed."
  const totalCredits  = (purchases ?? []).reduce((s, p) => s + p.credits_total, 0);
  const usedCredits   = (purchases ?? []).reduce((s, p) => s + p.credits_used,  0);
  const remaining     = totalCredits - usedCredits;
  const hasPurchase   = totalCredits > 0;

  // Refund-aware display state (looks at the most recent refunded purchase).
  // For the simple v1 we only show one purchase's refund context — if the
  // user has multiple purchases mixing refunded + active, the active credits
  // are still usable (remaining > 0) and we hide the refund banner.
  const refundedPurchase = (purchases ?? []).find((p) => p.refunded_at != null);
  const hasActiveCredits = remaining > 0;
  const showRefundState = !!refundedPurchase && !hasActiveCredits;
  const refundUsedAtTime: number = refundedPurchase?.credits_used_at_refund ?? 0;
  const refundedKind: "full" | "partial" | null = refundedPurchase?.refund_kind ?? null;
  const refundedTotal: number = refundedPurchase?.credits_total ?? 0;
  const refundedRevokedCount = Math.max(0, refundedTotal - refundUsedAtTime);

  // Admin shortcut — only rendered when the signed-in user is in ADMIN_EMAILS.
  // Other users never see this link; even if they did, /admin/freshness 404s
  // any non-allowlisted visitor (server-side gate in lib/admin/auth.ts).
  const isAdmin = isAdminEmail(user.email);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={24} />
          </Link>
          <SignOutButton />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
            My account
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Credits banner — three states: refund-aware, active-credits, used-up */}
        {hasPurchase && showRefundState ? (
          // ── Refund state — explain WHY there are no credits, not just "used" ──
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <RotateCcw size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {refundedKind === "full" && refundUsedAtTime === 0 && (
                    <>Your purchase was refunded — no reports created</>
                  )}
                  {refundedKind === "full" && refundUsedAtTime > 0 && (
                    <>
                      Your purchase was refunded — {refundUsedAtTime} report
                      {refundUsedAtTime === 1 ? "" : "s"} created, remaining
                      credits revoked
                    </>
                  )}
                  {refundedKind === "partial" && (
                    <>
                      {refundUsedAtTime} used · {refundedRevokedCount} refunded
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Reports you already created are still saved below — they&apos;re
                  yours to keep. To create new reports, start a new comparison.
                </p>
              </div>
              <Link
                href="/compare/build"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FF5A5F] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
              >
                Buy a new bundle
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ) : hasPurchase ? (
          // ── Normal state — credits remaining or fully used ──────────────────
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#FF5A5F]/20 bg-[#FF5A5F]/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <Package size={18} className="shrink-0 text-[#FF5A5F]" />
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {remaining} report{remaining !== 1 ? "s" : ""} remaining
                </p>
                <p className="text-xs text-slate-500">
                  {usedCredits} of {totalCredits} used
                </p>
              </div>
            </div>
            {remaining > 0 ? (
              <Link
                href="/compare/build"
                className="flex items-center gap-1.5 rounded-xl bg-[#FF5A5F] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
              >
                Build next report
                <ArrowRight size={12} />
              </Link>
            ) : (
              <Link
                href="/compare"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:border-slate-300"
              >
                Buy more
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        ) : null}

        {/* Saved reports */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-800">My comparison reports</h2>
            </div>
            {hasPurchase && remaining > 0 && (
              <Link
                href="/compare/build"
                className="flex items-center gap-1 text-xs font-semibold text-[#FF5A5F] hover:underline"
              >
                <Plus size={12} />
                New
              </Link>
            )}
          </div>

          {/* Report cards */}
          {comparisons && comparisons.length > 0 ? (
            <div className="space-y-3">
              {comparisons.map((c) => {
                // The canonical report_url is stored without ?preview=true;
                // append it so clicking from /account opens the unlocked view.
                const href = c.report_url.includes("preview=")
                  ? c.report_url
                  : `${c.report_url}${c.report_url.includes("?") ? "&" : "?"}preview=true`;
                return (
                <Link
                  key={c.id}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-stone-50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {c.city_names?.join(" · ") ?? "Comparison"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {c.top_match && c.top_pct
                        ? `Best match: ${c.top_match} (${c.top_pct}%)`
                        : "View report"}
                      {" · "}
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight size={14} className="ml-3 shrink-0 text-slate-400" />
                </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="py-4 text-center">
              {hasPurchase ? (
                <>
                  <p className="mb-3 text-sm text-slate-500">
                    No saved reports yet — build your first comparison now.
                  </p>
                  <Link
                    href="/compare/build"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
                  >
                    Build first report
                    <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <p className="mb-1 text-sm font-medium text-slate-600">
                    No reports yet
                  </p>
                  <p className="mb-4 text-xs text-slate-400">
                    Build a comparison — preview is free, full report is $9.
                  </p>
                  <Link
                    href="/compare/build"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
                  >
                    Build a report
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {!hasPurchase && (
          <p className="mt-5 text-center text-xs text-slate-400">
            One-time $9 per report, $19 for a 3-report bundle.{" "}
            <Link href="/compare" className="font-semibold text-[#FF5A5F] hover:underline">
              See what&apos;s included →
            </Link>
          </p>
        )}

        {isAdmin && (
          <Link
            href="/admin/freshness"
            className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Shield size={16} className="shrink-0 text-slate-700" />
              <div>
                <p className="text-sm font-bold text-slate-800">Freshness admin</p>
                <p className="text-xs text-slate-500">
                  Review findings, scan content, manage city updates
                </p>
              </div>
            </div>
            <ArrowRight size={14} className="text-slate-400" />
          </Link>
        )}

        {/* Support — buyers look here first when something is wrong with a
            purchase. Visible mailto reduces refund/chargeback rate. */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Question about a purchase or report? Email{" "}
          <a
            href="mailto:hello@famirelo.com"
            className="font-semibold text-slate-500 hover:text-[#FF5A5F] hover:underline"
          >
            hello@famirelo.com
          </a>{" "}
          — we usually reply within 24 hours.
        </p>
      </div>
    </div>
  );
}
