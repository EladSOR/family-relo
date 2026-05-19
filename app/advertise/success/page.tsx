import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Logo from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Payment received | FamiRelo",
  robots: { index: false },
};

export default function AdvertiseSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Link href="/" aria-label="FamiRelo home">
            <Logo size={24} />
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <Check size={22} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Payment received — review next
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Thanks. We'll review your ad within 24 hours. You'll get an email when
          it goes live — or, if we need to reject it, when your refund is on the way.
          Either way, your card is safe.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF5A5F] hover:underline"
        >
          Back to FamiRelo →
        </Link>
      </main>
    </div>
  );
}
