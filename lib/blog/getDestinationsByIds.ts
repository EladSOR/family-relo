import citiesData from "@/data/cities.json";
import type { Destination } from "@/lib/types";

export function getDestinationById(id: string): Destination | undefined {
  return (citiesData as Destination[]).find((d) => d.id === id);
}

export function requireDestinations(ids: string[]): Destination[] | null {
  const out: Destination[] = [];
  for (const id of ids) {
    const d = getDestinationById(id);
    if (!d) return null;
    out.push(d);
  }
  return out;
}
