/**
 * Finding = a single discrepancy the scanner spotted between our JSON
 * content and a live source (visa portal, school site, government page).
 *
 * Storage: sidecar JSON file `data/scan-findings.json`. Sidecar (not the
 * DB) because:
 *   • zero infra/migration cost,
 *   • findings ship with the repo so a Vercel preview deploy already has
 *     test data,
 *   • approving a finding writes to `data/cities.json` via the same
 *     GitHub Contents API path we already use for "mark reviewed".
 *
 * Lifecycle:
 *   open  →  approved  (commits change to cities.json)
 *         →  rejected  (kept for audit, never re-suggested)
 *         →  stale     (a newer scan supersedes it; auto-archived)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { configFor, priorityRank, type Priority, type SectionKey } from "./scanConfig";

export type FindingStatus = "open" | "approved" | "rejected" | "stale";

export interface Finding {
  id: string;                          // stable hash of cityId+section+field
  cityId: string;
  cityName: string;
  country: string;
  section: SectionKey | string;        // string fallback for unknown sections
  /** dot-path inside the city JSON, e.g. `visa.options[0].details[2]` */
  fieldPath: string;
  /** Human-readable label of what the scanner thinks needs changing */
  summary: string;
  /** Current value in cities.json — pulled at scan time */
  currentValue: string;
  /** What the scanner thinks it should be, based on the source */
  proposedValue: string;
  /** Source URL the scanner read to form the proposal */
  sourceUrl: string;
  /** 0.0 – 1.0 model self-confidence */
  confidence: number;
  /** ISO timestamp */
  detectedAt: string;
  status: FindingStatus;
  /** ISO timestamp once status moves off "open" */
  resolvedAt?: string;
  /** Why the scanner thinks the value drifted — one sentence */
  rationale: string;
}

export interface FindingsFile {
  generatedAt: string | null;
  /** Demo data flag — true if these are seeded sample findings (no real scan) */
  isDemo: boolean;
  findings: Finding[];
}

const FILE_PATH = "data/scan-findings.json";

function abs(): string {
  return path.join(process.cwd(), FILE_PATH);
}

export function loadFindings(): FindingsFile {
  const file = abs();
  if (!existsSync(file)) {
    return { generatedAt: null, isDemo: false, findings: [] };
  }
  try {
    return JSON.parse(readFileSync(file, "utf8")) as FindingsFile;
  } catch {
    return { generatedAt: null, isDemo: false, findings: [] };
  }
}

export function saveFindings(data: FindingsFile): void {
  const file = abs();
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── Sorting helpers ─────────────────────────────────────────────────────────

export function sortByPriority(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const sa = configFor(a.section).priority;
    const sb = configFor(b.section).priority;
    const p = priorityRank(sb) - priorityRank(sa);
    if (p !== 0) return p;
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return a.cityName.localeCompare(b.cityName);
  });
}

export function groupByPriority(findings: Finding[]): Record<Priority, Finding[]> {
  const out: Record<Priority, Finding[]> = { must: [], should: [], nice: [] };
  for (const f of findings) {
    const p = configFor(f.section).priority;
    out[p].push(f);
  }
  return out;
}
