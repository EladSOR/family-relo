import { Suspense } from "react";
import SingleCityResultsClient from "@/components/single-city/SingleCityResultsClient";
import Logo from "@/components/brand/Logo";

export const metadata = {
  title: "Your Single-City Report",
  robots: { index: false },
};

function Loading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center">
          <Logo size={24} />
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-3 h-10 w-72 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function SingleCityResultsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SingleCityResultsClient />
    </Suspense>
  );
}
