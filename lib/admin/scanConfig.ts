/**
 * Per-section scan configuration for the content monitor.
 *
 * Tuning rules:
 *   • cadenceDays — how often we want a section reviewed against its source.
 *     Picked to match real-world drift speed (visa rules slow, rent fast).
 *   • priority — controls sort order in the Findings inbox. "must" floats
 *     above "should" floats above "nice".
 *   • enabled — per-section kill switch. The master kill switch is
 *     SCAN_ENABLED=true|false in env (default false).
 *
 * Adding a new section to a city's JSON:
 *   When you introduce a new section (e.g. "taxes"), add a one-liner here
 *   so the scanner knows what cadence to apply. If a section appears in
 *   cities.json but is missing from this map, the scanner uses
 *   DEFAULT_SECTION_CONFIG and prints a warning so you can tune it later.
 */

export type SectionKey =
  | "visa"
  | "residency"
  | "banking"
  | "housing"
  | "schools"
  | "childcare"
  | "healthcare"
  | "safety"
  | "cost";

export type Priority = "must" | "should" | "nice";

export interface SectionConfig {
  enabled: boolean;
  cadenceDays: number;
  priority: Priority;
  /** Short label used in the dashboard UI */
  label: string;
}

export const DEFAULT_SECTION_CONFIG: SectionConfig = {
  enabled: false,
  cadenceDays: 180,
  priority: "should",
  label: "Section",
};

export const SECTION_CONFIG: Record<SectionKey, SectionConfig> = {
  visa:       { enabled: false, cadenceDays: 60,  priority: "must",   label: "Visa rules" },
  healthcare: { enabled: false, cadenceDays: 180, priority: "must",   label: "Healthcare" },
  safety:     { enabled: false, cadenceDays: 180, priority: "must",   label: "Safety" },
  housing:    { enabled: false, cadenceDays: 90,  priority: "should", label: "Housing" },
  cost:       { enabled: false, cadenceDays: 90,  priority: "should", label: "Cost benchmarks" },
  schools:    { enabled: false, cadenceDays: 180, priority: "should", label: "Schools" },
  childcare:  { enabled: false, cadenceDays: 180, priority: "should", label: "Childcare" },
  residency:  { enabled: false, cadenceDays: 365, priority: "nice",   label: "Residency" },
  banking:    { enabled: false, cadenceDays: 365, priority: "nice",   label: "Banking" },
};

export function isMasterEnabled(): boolean {
  return (process.env.SCAN_ENABLED ?? "false").toLowerCase() === "true";
}

/**
 * Resolve config for a section, applying env-var overrides.
 *
 * Env var pattern: `SCAN_<SECTION>=true|false`
 *   e.g. SCAN_VISA=true   → enable visa scans
 *        SCAN_HOUSING=false → keep housing scans off (also the default)
 *
 * The master switch (SCAN_ENABLED) gates the whole cron — individual
 * section flags only matter once the master is on.
 */
export function configFor(section: string): SectionConfig {
  const base = (SECTION_CONFIG as Record<string, SectionConfig | undefined>)[section] ?? DEFAULT_SECTION_CONFIG;
  const envKey = `SCAN_${section.toUpperCase()}`;
  const raw = process.env[envKey];
  if (raw === undefined) return base;
  return { ...base, enabled: raw.toLowerCase() === "true" };
}

/** Snapshot of the effective config for every known section. */
export function effectiveSectionConfig(): Record<SectionKey, SectionConfig> {
  const out = {} as Record<SectionKey, SectionConfig>;
  for (const key of Object.keys(SECTION_CONFIG) as SectionKey[]) {
    out[key] = configFor(key);
  }
  return out;
}

const PRIORITY_RANK: Record<Priority, number> = { must: 3, should: 2, nice: 1 };

export function priorityRank(p: Priority): number {
  return PRIORITY_RANK[p];
}
