/**
 * Server-side helpers that read ad data from Supabase.
 *
 * These run in Server Components and route handlers. They query the public
 * `active_ad_spots` view (which only exposes display fields of `status='active'`
 * rows), so we never accidentally leak pending or rejected ads to visitors.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { RenderableSlot } from "./types";
import {
  OPEN_SLOT,
  PLACEHOLDER_SLOT_1,
  PLACEHOLDER_SLOT_2,
} from "./copy";

interface ActiveAdRow {
  position: number;
  brand_name: string;
  tagline: string;
  click_url: string;
  logo_url: string;
}

/**
 * Returns the three slots that the SponsorStrip renders, in order.
 *
 * Slot 1 → live ad if approved, else placeholder (Compare cities)
 * Slot 2 → live ad if approved, else placeholder (Sortino)
 * Slot 3 → live ad if approved, else "open / apply" CTA
 *
 * Failure to load (Supabase down, env vars missing) → all-placeholder fallback.
 * The site never breaks because ads are unavailable.
 */
export async function getRenderableSlots(): Promise<RenderableSlot[]> {
  const fallback: RenderableSlot[] = [
    PLACEHOLDER_SLOT_1,
    PLACEHOLDER_SLOT_2,
    OPEN_SLOT,
  ];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("active_ad_spots")
      .select("position, brand_name, tagline, click_url, logo_url");

    if (error || !data) return fallback;

    const byPosition = new Map<number, ActiveAdRow>();
    for (const row of data as ActiveAdRow[]) {
      byPosition.set(row.position, row);
    }

    return [1, 2, 3].map((pos): RenderableSlot => {
      const live = byPosition.get(pos);
      if (live) {
        return {
          position: pos as 1 | 2 | 3,
          kind: "live",
          brand_name: live.brand_name,
          tagline: live.tagline,
          click_url: live.click_url,
          logo_url: live.logo_url,
        };
      }
      if (pos === 1) return PLACEHOLDER_SLOT_1;
      if (pos === 2) return PLACEHOLDER_SLOT_2;
      return OPEN_SLOT;
    });
  } catch {
    return fallback;
  }
}

/** Are there any open (non-live) public-sale slots? Used by the badge. */
export function getOpenSlotCount(slots: RenderableSlot[]): number {
  return slots.filter(s => s.kind === "open").length;
}
