import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "My Account | Famirelo",
  robots: { index: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-slate-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A5F] text-white">
              <MapPin size={13} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">
              FamiRelo
            </span>
          </Link>
          <SignOutButton />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF5A5F]">
            My account
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            You&apos;re in
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Reports */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800">My comparison reports</h2>
          </div>
          <p className="text-sm text-slate-500">
            You don&apos;t have any saved reports yet. Start by building a free preview — 
            full personalized reports are coming very soon.
          </p>
          <Link
            href="/compare/build"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF5A5F] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e84a4f]"
          >
            Build a free preview
          </Link>
        </div>
      </div>
    </div>
  );
}
