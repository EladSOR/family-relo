"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AuthButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className={
          compact
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50"
            : "flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
        }
        aria-label="Sign in"
      >
        {compact ? <User size={14} /> : "Sign in"}
      </Link>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5A5F]/10 text-xs font-bold text-[#FF5A5F] transition-all hover:bg-[#FF5A5F]/20"
        aria-label="Account menu"
      >
        {initials}
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200]"
            onClick={() => setMenuOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-[201] w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
            <div className="mb-1 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-400">Signed in as</p>
              <p className="truncate text-xs font-bold text-slate-800">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <User size={14} />
              My account
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
