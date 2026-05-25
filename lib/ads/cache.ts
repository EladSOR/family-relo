import { revalidatePath, revalidateTag } from "next/cache";

/** Shared tag for cached ad-slot queries (`unstable_cache`). */
export const AD_SLOTS_CACHE_TAG = "ad-slots";

/**
 * Bust ad data + all public pages that embed sponsor slots (home + city guides).
 * Call after admin approve/reject so new ads show on the next request.
 */
export function revalidatePublicAdPages(): void {
  revalidateTag(AD_SLOTS_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}
