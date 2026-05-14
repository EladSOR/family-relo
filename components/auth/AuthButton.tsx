"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AuthButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close on outside click + Escape — no overlay needed (overlay was eating clicks
  // inside the nav's own stacking context).
  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setMenuOpen(false);
      setSigningOut(false);
      // Hard redirect ensures any server-rendered "signed in" UI is invalidated
      window.location.href = "/";
    }
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
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FF5A5F]/10 text-xs font-bold text-[#FF5A5F] transition-all hover:bg-[#FF5A5F]/20"
        aria-label="Account menu"
        aria-expanded={menuOpen}
      >
        {initials}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-[9999] w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-lg"
        >
          <div className="mb-1 px-3 py-2">
            <p className="text-[11px] font-semibold text-slate-400">Signed in as</p>
            <p className="truncate text-xs font-bold text-slate-800">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <User size={14} />
            My account
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={signingOut}
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut size={14} />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
