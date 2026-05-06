import type { Destination } from "@/lib/types";

/**
 * Parses the private nursery monthly band from the first daycare bullet labelled "Typical fees:".
 * Keeps legacy comparison digests aligned with whatever the city JSON currently publishes.
 */
export function extractTypicalPrivateNurseryMonthlyBand(dest: Destination): string | null {
  for (const item of dest.childcare.daycareItems) {
    const m = item.match(/Typical fees:\s*(\$[\d,]+\s*[–\-]\s*\$[\d,]+(?:\s*\/month)?)/i);
    if (m) return m[1].replace(/\s+/g, "");
  }
  return null;
}
