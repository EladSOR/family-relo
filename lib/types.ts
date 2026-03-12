// ── Domain types ──────────────────────────────────────────────────────────────

export interface Visa {
  type: string;
  duration?: string;
  description?: string;
}

export interface City {
  id: string;
  citySlug: string;
  countrySlug: string;
  name: string;
  country: string;
  visas: Visa[];
  safetyScore: number;
  nannyCostPerHour: number;
  bestNeighborhood: string;
}

// ── Search / UI types ─────────────────────────────────────────────────────────

export interface GuestCounts {
  adults: number;
  infants: number;
  children: number;
  teens: number;
}

export type OpenPanel = "where" | "who" | "duration" | null;

export interface GuestRow {
  key: keyof GuestCounts;
  label: string;
  sub: string;
}
