import { Suspense } from "react";
import CompareResultsClient from "@/components/compare/CompareResultsClient";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Your City Comparison Report",
  robots: { index: false },
};

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5A5F] text-white">
        <MapPin size={18} strokeWidth={2.5} />
      </div>
      <p className="text-sm font-semibold text-slate-500">
        Scoring your cities…
      </p>
    </div>
  );
}

export default function CompareResultsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompareResultsClient />
    </Suspense>
  );
}
