import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Circle, KeyRound, Power, AlertTriangle } from "lucide-react";

import { getAdminUser } from "@/lib/admin/auth";
import { isMasterEnabled, effectiveSectionConfig } from "@/lib/admin/scanConfig";
import { readFindings } from "@/lib/admin/findingsPersist";
import { groupByPriority, sortByPriority } from "@/lib/admin/findings";
import { listRecentDataCommits } from "@/lib/admin/github";
import {
  daysSinceYearMonth,
  severityFor,
  sortByUrgency,
  type FreshnessRow,
} from "@/lib/admin/freshness";
import type { CityRow as TableRow } from "@/components/admin/CitiesTable";

import FindingCard from "@/components/admin/FindingCard";
import ScanNowButton from "@/components/admin/ScanNowButton";
import CollapsibleSection from "@/components/admin/CollapsibleSection";
import CitiesTable from "@/components/admin/CitiesTable";
import RevertButton from "@/components/admin/RevertButton";
import RefreshHistory from "@/components/admin/RefreshHistory";

export const metadata: Metadata = {
  title: "Freshness | FamiRelo Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CityFile {
  id: string;
  city: string;
  country: string;
  lastReviewed: string;
}

function readJson<T>(rel: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), rel), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export default async function FreshnessAdminPage() {
  const admin = await getAdminUser();
  if (!admin) notFound();

  const cities  = readJson<CityFile[]>("data/cities.json", []);
  const fileF   = readFindings();
  const openF   = fileF.findings.filter(f => f.status === "open");
  const grouped = groupByPriority(sortByPriority(openF));

  const masterOn   = isMasterEnabled();
  const keyPresent = !!process.env.OPENAI_API_KEY;
  const sections   = effectiveSectionConfig();
  const enabledSectionCount = Object.values(sections).filter(s => s.enabled).length;

  // Recent commits (used in the collapsible "Recent changes" section)
  let recentCommits: Awaited<ReturnType<typeof listRecentDataCommits>> = [];
  let commitsError: string | null = null;
  try {
    recentCommits = await listRecentDataCommits(20);
  } catch (err) {
    commitsError = (err as Error).message;
  }

  // Freshness rows for the "All cities" table (collapsed by default)
  const rows: FreshnessRow[] = cities.map(c => {
    const days = daysSinceYearMonth(c.lastReviewed);
    return {
      id: c.id,
      city: c.city,
      country: c.country,
      lastReviewed: c.lastReviewed,
      daysSinceReview: days,
      severity: severityFor(days),
      brokenLinkCount: 0,
    };
  });
  const tableRows: TableRow[] = sortByUrgency(rows).map(r => ({
    id: r.id,
    city: r.city,
    country: r.country,
    lastReviewed: r.lastReviewed,
    daysSinceReview: r.daysSinceReview,
  }));

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
              FamiRelo admin
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Freshness</h1>
          </div>
          <p className="text-xs text-slate-500">Signed in as {admin.email}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {/* ── Status bar ──────────────────────────────────────────────────── */}
        <StatusBar
          masterOn={masterOn}
          keyPresent={keyPresent}
          enabledSections={enabledSectionCount}
          totalSections={Object.keys(sections).length}
          findingsCount={openF.length}
          isDemo={fileF.isDemo}
          lastScan={fileF.generatedAt}
        />

        {/* ── Findings inbox ─────────────────────────────────────────────── */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Findings to review</h2>
              <p className="text-xs text-slate-500">
                {openF.length === 0
                  ? "Nothing to review. The scanner found no discrepancies — your content matches sources."
                  : `${openF.length} open finding${openF.length === 1 ? "" : "s"} — approve to apply the change to cities.json, reject to dismiss.`}
              </p>
            </div>
            <ScanNowButton label="Scan all enabled sections" />
          </div>

          {openF.length === 0 ? (
            <EmptyState
              title="Nothing pending."
              message={
                !masterOn
                  ? "Scanner is OFF. Findings will appear after you enable it and the first scan runs."
                  : "Last scan found no drift. The next scheduled scan runs on the 1st of next month."
              }
            />
          ) : (
            <div className="space-y-6">
              <PriorityBucket label="Must update — high impact and overdue" tone="must" findings={grouped.must} isDemo={fileF.isDemo} />
              <PriorityBucket label="Should update" tone="should" findings={grouped.should} isDemo={fileF.isDemo} />
              <PriorityBucket label="Nice to have" tone="nice" findings={grouped.nice} isDemo={fileF.isDemo} />
            </div>
          )}
        </section>

        {/* ── Sections configuration ─────────────────────────────────────── */}
        <CollapsibleSection
          title="Sections & cadence"
          subtitle={`${enabledSectionCount} of ${Object.keys(sections).length} sections enabled · toggle by setting env vars`}
        >
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Section</th>
                  <th className="px-3 py-2 font-semibold">Priority</th>
                  <th className="px-3 py-2 font-semibold">Cadence</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Env var</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Object.entries(sections) as Array<[string, typeof sections[keyof typeof sections]]>).map(([key, cfg]) => (
                  <tr key={key} className="hover:bg-stone-50/60">
                    <td className="px-3 py-2 font-medium text-slate-800">{cfg.label}</td>
                    <td className="px-3 py-2">
                      <PriorityChip priority={cfg.priority} />
                    </td>
                    <td className="px-3 py-2 text-slate-600">every {cfg.cadenceDays}d</td>
                    <td className="px-3 py-2">
                      {cfg.enabled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          <Circle size={8} className="fill-emerald-600 text-emerald-600" /> On
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                          <Circle size={8} className="fill-slate-400 text-slate-400" /> Off
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-500">
                      SCAN_{key.toUpperCase()}={cfg.enabled ? "true" : "false"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Toggle per section by setting <code className="rounded bg-stone-100 px-1">SCAN_&lt;SECTION&gt;=true|false</code> in
            Vercel env vars. The master switch <code className="rounded bg-stone-100 px-1">SCAN_ENABLED</code> must also be{" "}
            <code>true</code> for the scheduled scan to run. The <strong>Scan now</strong> button bypasses both flags — it scans
            on demand using whichever sections you target.
          </p>
        </CollapsibleSection>

        {/* ── All cities (collapsed, with search) ────────────────────────── */}
        <CollapsibleSection
          title="All cities"
          subtitle={`${rows.length} total · search to find a city, scan or mark reviewed individually`}
          defaultOpen={false}
        >
          <CitiesTable rows={tableRows} />
        </CollapsibleSection>

        {/* ── Recent changes (collapsed) ─────────────────────────────────── */}
        <CollapsibleSection
          title="Recent changes"
          subtitle="Last 20 edits to data/cities.json · one-click revert"
        >
          {commitsError ? (
            <EmptyState
              title="Couldn't load commit history."
              message={`${commitsError} — set GITHUB_REVIEW_TOKEN and GITHUB_REPO to enable.`}
            />
          ) : recentCommits.length === 0 ? (
            <EmptyState title="No edits yet." message="Apply a finding or mark a city reviewed and it will appear here." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">When</th>
                    <th className="px-3 py-2 font-semibold">Change</th>
                    <th className="px-3 py-2 font-semibold">Author</th>
                    <th className="px-3 py-2 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentCommits.map(c => (
                    <tr key={c.sha} className="hover:bg-stone-50/60">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                        {new Date(c.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                      </td>
                      <td className="px-3 py-2 text-slate-800">
                        <span className="font-medium">{c.message}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{c.author}</td>
                      <td className="px-3 py-2 text-right">
                        <RevertButton commitSha={c.sha} message={c.message} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CollapsibleSection>

        <RefreshHistory />
      </main>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBar({
  masterOn,
  keyPresent,
  enabledSections,
  totalSections,
  findingsCount,
  isDemo,
  lastScan,
}: {
  masterOn: boolean;
  keyPresent: boolean;
  enabledSections: number;
  totalSections: number;
  findingsCount: number;
  isDemo: boolean;
  lastScan: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      {isDemo && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            <strong>Demo data showing.</strong> These findings are seeded so you can see the dashboard. Once the scanner runs
            for real, demo entries are replaced with actual discrepancies. Approving demo findings does nothing.
          </p>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-4">
        <StatusCell
          icon={<Power size={14} />}
          label="Scanner"
          value={masterOn ? "On" : "Off"}
          tone={masterOn ? "good" : "muted"}
          hint={masterOn ? "Scheduled scans run monthly" : "SCAN_ENABLED=false"}
        />
        <StatusCell
          icon={<KeyRound size={14} />}
          label="OpenAI key"
          value={keyPresent ? "Set" : "Missing"}
          tone={keyPresent ? "good" : "warn"}
          hint={keyPresent ? "Scans will run when triggered" : "Add OPENAI_API_KEY to enable"}
        />
        <StatusCell
          icon={<Circle size={14} />}
          label="Sections enabled"
          value={`${enabledSections} / ${totalSections}`}
          tone={enabledSections > 0 ? "good" : "muted"}
          hint="Toggle below"
        />
        <StatusCell
          icon={<Circle size={14} />}
          label="Open findings"
          value={String(findingsCount)}
          tone={findingsCount > 0 ? "warn" : "good"}
          hint={lastScan ? `Last scan ${new Date(lastScan).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Never scanned"}
        />
      </div>
    </div>
  );
}

function StatusCell({
  icon, label, value, tone, hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "good" | "warn" | "muted";
  hint?: string;
}) {
  const toneMap = {
    good:  "text-emerald-700",
    warn:  "text-amber-700",
    muted: "text-slate-500",
  } as const;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {icon}
        {label}
      </div>
      <p className={`mt-0.5 text-base font-extrabold ${toneMap[tone]}`}>{value}</p>
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

function PriorityChip({ priority }: { priority: "must" | "should" | "nice" }) {
  const map = {
    must:   "bg-red-50 text-red-700",
    should: "bg-amber-50 text-amber-700",
    nice:   "bg-slate-100 text-slate-600",
  } as const;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${map[priority]}`}>{priority}</span>;
}

function PriorityBucket({
  label, tone, findings, isDemo,
}: {
  label: string;
  tone: "must" | "should" | "nice";
  findings: import("@/lib/admin/findings").Finding[];
  isDemo: boolean;
}) {
  if (findings.length === 0) return null;
  const ringMap = {
    must:   "border-red-200",
    should: "border-amber-200",
    nice:   "border-slate-200",
  } as const;
  return (
    <div className={`rounded-2xl border ${ringMap[tone]} bg-white p-4 shadow-sm`}>
      <div className="mb-3 flex items-center gap-2">
        <PriorityChip priority={tone} />
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <span className="text-xs text-slate-500">({findings.length})</span>
      </div>
      <div className="space-y-3">
        {findings.map(f => <FindingCard key={f.id} finding={f} isDemo={isDemo} />)}
      </div>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{message}</p>
    </div>
  );
}
