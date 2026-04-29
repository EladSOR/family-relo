import type { Destination } from "./types";
import { parseMonthlyCost } from "./cityCost";

// ── Input types ───────────────────────────────────────────────────────────────

export type FamilySize = "solo" | "couple" | "family";
export type WorkSituation = "remote" | "local" | "freelance";
export type Priority = "cost" | "safety" | "schools" | "weather" | "lifestyle";

export interface UserInputs {
  budget: number;
  familySize: FamilySize;
  workSituation: WorkSituation;
  /** Up to 3 priorities, in order of importance */
  priorities: Priority[];
}

export interface DimensionScores {
  cost: number;
  safety: number;
  schools: number;
  weather: number;
  lifestyle: number;
}

export interface CityScore {
  city: Destination;
  /** 0–99 overall match percentage */
  matchPct: number;
  dimensions: DimensionScores;
  budgetFit: "comfortable" | "fits" | "tight" | "over";
  /** Parsed cost midpoint in USD */
  budgetMid: number;
  budgetMin: number;
  budgetMax: number;
}

// ── Dimension scorers ─────────────────────────────────────────────────────────

function scoreCost(
  city: Destination,
  budget: number,
): { score: number; fit: CityScore["budgetFit"] } {
  const parsed = parseMonthlyCost(city.cost.monthlyFamilyAllIn);
  if (!parsed) return { score: 60, fit: "fits" };

  if (budget >= parsed.max * 1.3) return { score: 96, fit: "comfortable" };
  if (budget >= parsed.max) return { score: 84, fit: "comfortable" };
  if (budget >= parsed.mid) return { score: 70, fit: "fits" };
  if (budget >= parsed.min) return { score: 50, fit: "tight" };
  return { score: 22, fit: "over" };
}

function scoreSafety(city: Destination): number {
  return Math.min(100, city.safety.score);
}

function scoreSchools(city: Destination): number {
  const opts = city.schools.options ?? [];
  const text = (
    city.schools.internationalOptions +
    " " +
    city.schools.summary
  ).toLowerCase();

  let base = 50;
  if (opts.length >= 4) base = 90;
  else if (opts.length >= 3) base = 80;
  else if (opts.length >= 2) base = 68;
  else if (opts.length >= 1) base = 55;

  if (
    text.includes("large") ||
    text.includes("wide range") ||
    text.includes("excellent") ||
    text.includes("strong international")
  )
    base = Math.min(100, base + 10);
  if (
    text.includes("limited") ||
    text.includes("few options") ||
    text.includes("small selection")
  )
    base = Math.max(20, base - 15);
  if (text.includes("english-medium") || text.includes("english medium"))
    base = Math.min(100, base + 5);

  return base;
}

function scoreWeather(city: Destination): number {
  if (!city.weather?.months || city.weather.months.length === 0) return 65;

  const months = city.weather.months;
  const avgHigh = months.reduce((s, m) => s + m.highC, 0) / months.length;
  const avgRainDays = months.reduce((s, m) => s + m.rainDays, 0) / months.length;

  let tempScore: number;
  if (avgHigh < 5) tempScore = 15;
  else if (avgHigh < 10) tempScore = 32;
  else if (avgHigh < 15) tempScore = 52;
  else if (avgHigh < 18) tempScore = 68;
  else if (avgHigh <= 28) tempScore = 95;
  else if (avgHigh <= 32) tempScore = 82;
  else if (avgHigh <= 36) tempScore = 65;
  else tempScore = 45;

  const rainScore =
    avgRainDays <= 3
      ? 95
      : avgRainDays <= 6
        ? 82
        : avgRainDays <= 10
          ? 68
          : avgRainDays <= 14
            ? 52
            : 35;

  return Math.round(tempScore * 0.65 + rainScore * 0.35);
}

function scoreLifestyle(city: Destination, inputs: UserInputs): number {
  const bestFor = city.familyFit.bestFor.join(" ").toLowerCase();
  const watchOut = city.familyFit.watchOutFor.join(" ").toLowerCase();

  let score = 62;

  if (inputs.workSituation === "remote") {
    if (
      bestFor.includes("remote") ||
      bestFor.includes("digital nomad") ||
      bestFor.includes("nomad")
    )
      score += 14;
    if (watchOut.includes("connectivity") || watchOut.includes("internet"))
      score -= 8;
  }
  if (inputs.workSituation === "local") {
    if (
      bestFor.includes("job") ||
      bestFor.includes("career") ||
      bestFor.includes("professional")
    )
      score += 10;
    if (watchOut.includes("english") || watchOut.includes("language barrier"))
      score -= 10;
  }

  if (inputs.familySize === "family") {
    if (
      bestFor.includes("famil") ||
      bestFor.includes("school") ||
      bestFor.includes("kid") ||
      bestFor.includes("children")
    )
      score += 14;
    if (watchOut.includes("waitlist") || watchOut.includes("school"))
      score -= 4;
  }
  if (inputs.familySize === "solo") {
    if (
      bestFor.includes("solo") ||
      bestFor.includes("professional") ||
      bestFor.includes("social scene")
    )
      score += 10;
  }

  if (inputs.budget < 3500) {
    if (
      bestFor.includes("budget") ||
      bestFor.includes("affordable") ||
      bestFor.includes("low cost")
    )
      score += 10;
    if (watchOut.includes("expensive") || watchOut.includes("cost has risen"))
      score -= 10;
  }

  return Math.min(100, Math.max(20, score));
}

// ── Weight calculation ────────────────────────────────────────────────────────

function computeWeights(priorities: Priority[]): Record<Priority, number> {
  const weights: Record<Priority, number> = {
    cost: 20,
    safety: 20,
    schools: 20,
    weather: 20,
    lifestyle: 20,
  };

  // Boost selected priorities; they "steal" weight from lower-ranked ones
  const boosts: number[] = [25, 15, 8];
  priorities.slice(0, 3).forEach((p, i) => {
    weights[p] += boosts[i];
  });

  // Normalize so all weights sum to 100
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  (Object.keys(weights) as Priority[]).forEach((k) => {
    weights[k] = (weights[k] / total) * 100;
  });

  return weights;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function scoreCity(city: Destination, inputs: UserInputs): CityScore {
  const costResult = scoreCost(city, inputs.budget);
  const dimensions: DimensionScores = {
    cost: costResult.score,
    safety: scoreSafety(city),
    schools: scoreSchools(city),
    weather: scoreWeather(city),
    lifestyle: scoreLifestyle(city, inputs),
  };

  const weights = computeWeights(inputs.priorities);
  const raw =
    (dimensions.cost * weights.cost +
      dimensions.safety * weights.safety +
      dimensions.schools * weights.schools +
      dimensions.weather * weights.weather +
      dimensions.lifestyle * weights.lifestyle) /
    100;

  const matchPct = Math.min(99, Math.max(28, Math.round(raw)));

  const parsed = parseMonthlyCost(city.cost.monthlyFamilyAllIn);
  return {
    city,
    matchPct,
    dimensions,
    budgetFit: costResult.fit,
    budgetMid: parsed?.mid ?? 0,
    budgetMin: parsed?.min ?? 0,
    budgetMax: parsed?.max ?? 0,
  };
}

export function scoreCities(
  cities: Destination[],
  inputs: UserInputs,
): CityScore[] {
  return cities
    .map((c) => scoreCity(c, inputs))
    .sort((a, b) => b.matchPct - a.matchPct);
}

// ── Label helpers ─────────────────────────────────────────────────────────────

export const PRIORITY_LABELS: Record<Priority, string> = {
  cost: "Cost of living",
  safety: "Safety",
  schools: "Schools & education",
  weather: "Weather & climate",
  lifestyle: "Lifestyle & community",
};

export const PRIORITY_ICONS: Record<Priority, string> = {
  cost: "💰",
  safety: "🛡️",
  schools: "🎓",
  weather: "☀️",
  lifestyle: "🌍",
};

export function budgetFitLabel(fit: CityScore["budgetFit"]): string {
  switch (fit) {
    case "comfortable":
      return "Comfortable";
    case "fits":
      return "Fits budget";
    case "tight":
      return "Tight fit";
    case "over":
      return "Over budget";
  }
}
