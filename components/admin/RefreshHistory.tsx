"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/**
 * Tiny "refresh" button for the admin dashboard — re-runs the server component
 * via `router.refresh()` so the user can see the result of an action (commit,
 * revert) without a hard reload. The page is `force-dynamic` so the next
 * render hits GitHub + reads cities.json from disk.
 */
export default function RefreshHistory() {
  const router = useRouter();
  return (
    <div className="flex justify-center pt-2">
      <button
        onClick={() => router.refresh()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-800"
      >
        <RefreshCw size={11} />
        Refresh
      </button>
    </div>
  );
}
