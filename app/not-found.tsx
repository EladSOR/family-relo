import type { Metadata } from "next";
import Link from "next/link";
import { Compass, MapPin } from "lucide-react";
import SiteHierarchyMenu from "@/components/SiteHierarchyMenu";
import { SITE_SERP_TITLE_BRAND } from "@/lib/seo/constants";
import { clipMetaDescription } from "@/lib/seo/description";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${SITE_SERP_TITLE_BRAND}` },
  description: clipMetaDescription(
    "We could not find that page. Go back to family relocation guides — visas, schools, childcare, rent, and safety by city.",
  ),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 md:max-w-5xl md:px-6">
          <SiteHierarchyMenu variant="light" />
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="FamiRelo home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={16} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">FamiRelo</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center md:max-w-xl md:py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF5A5F]">
          404
        </p>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          This page is not on the map
        </h1>
        <p className="mb-10 text-base leading-relaxed text-slate-600 md:text-lg">
          The link may be old or mistyped. Pick a destination below — every guide covers visas,
          schools, childcare, and real costs for families.
        </p>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#e04e53]"
          >
            <MapPin size={18} strokeWidth={2} aria-hidden />
            Back to home
          </Link>
          <Link
            href="/destinations"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Compass size={18} strokeWidth={2} aria-hidden />
            Browse all destinations
          </Link>
          <Link
            href="/compare"
            className="text-center text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Compare up to three cities
          </Link>
        </div>
      </div>
    </main>
  );
}
