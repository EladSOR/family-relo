"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Tiny pill-tab nav that lives in every admin page header.
 *
 * Add a new entry here when adding a new /admin/* page.
 */
const TABS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/admin/freshness", label: "Freshness" },
  { href: "/admin/ads",       label: "Ads" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
      {TABS.map(tab => {
        const isActive = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              isActive
                ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm"
                : "rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
