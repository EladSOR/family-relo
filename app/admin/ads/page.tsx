import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Clock, Check } from "lucide-react";

import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdSpot } from "@/lib/ads/types";
import AdActionButtons from "./AdActionButtons";

export const metadata: Metadata = {
  title: "Ads | FamiRelo Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdsAdminPage() {
  const admin = await getAdminUser();
  if (!admin) notFound();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ad_spots")
    .select("*")
    .order("created_at", { ascending: false });

  const ads: AdSpot[] = error ? [] : (data ?? []) as AdSpot[];
  const pending = ads.filter(a => a.status === "pending_review");
  const live    = ads.filter(a => a.status === "active");
  const archive = ads.filter(a => a.status === "rejected" || a.status === "expired");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
              FamiRelo admin
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Ads</h1>
          </div>
          <p className="text-xs text-slate-500">Signed in as {admin.email}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Failed to load ads: {error.message}
          </div>
        )}

        <Section
          title={`Pending review (${pending.length})`}
          subtitle="Approve to go live, or reject + refund. Rejection deletes the uploaded logo."
        >
          {pending.length === 0
            ? <Empty message="Nothing pending. New submissions land here as soon as the buyer pays." icon={<Clock size={16} />} />
            : pending.map(ad => <PendingCard key={ad.id} ad={ad} />)}
        </Section>

        <Section
          title={`Live ads (${live.length})`}
          subtitle="These are rendering on city pages and the homepage right now."
        >
          {live.length === 0
            ? <Empty message="No live ads yet. Approve a pending ad to fill a slot." icon={<Check size={16} />} />
            : live.map(ad => <LiveCard key={ad.id} ad={ad} />)}
        </Section>

        {archive.length > 0 && (
          <Section title={`Archive (${archive.length})`} subtitle="Rejected and expired ads.">
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 text-left uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Brand</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Reason</th>
                    <th className="px-3 py-2 font-semibold">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {archive.map(ad => (
                    <tr key={ad.id} className="hover:bg-stone-50/60">
                      <td className="px-3 py-2 font-semibold text-slate-800">{ad.brand_name}</td>
                      <td className="px-3 py-2 text-slate-600">{ad.status}</td>
                      <td className="px-3 py-2 text-slate-500">{ad.rejection_reason ?? "—"}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                        {new Date(ad.reviewed_at ?? ad.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}

// ── Components ──────────────────────────────────────────────────────────────

function Section({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Empty({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-6 py-8 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon}
      </div>
      <p className="text-xs text-slate-500">{message}</p>
    </div>
  );
}

function PendingCard({ ad }: { ad: AdSpot }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <LogoBox url={ad.logo_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-base font-extrabold text-slate-900">{ad.brand_name}</p>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Slot {ad.position}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{ad.tagline}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Field label="Click URL">
              <a href={ad.click_url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-[#FF5A5F]">
                {ad.click_url} <ExternalLink size={11} />
              </a>
            </Field>
            <Field label="Buyer">
              <span className="text-xs text-slate-700">{ad.contact_email}</span>
            </Field>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <AdActionButtons adId={ad.id} brandName={ad.brand_name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveCard({ ad }: { ad: AdSpot }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <LogoBox url={ad.logo_url} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-slate-900">{ad.brand_name}</p>
          <p className="truncate text-xs text-slate-600">{ad.tagline}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Slot {ad.position} · renews {ad.current_period_end ? new Date(ad.current_period_end).toLocaleDateString() : "—"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
          Live
        </span>
      </div>
    </div>
  );
}

function LogoBox({ url }: { url: string }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-11 w-11 object-contain" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
