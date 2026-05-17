"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ScanNowButton from "./ScanNowButton";
import MarkReviewedButton from "./MarkReviewedButton";

export interface CityRow {
  id: string;
  city: string;
  country: string;
  lastReviewed: string;
  daysSinceReview: number;
}

interface Props {
  rows: CityRow[];
}

export default function CitiesTable({ rows }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.city.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q),
    );
  }, [rows, query]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city, country, or id…"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
          />
        </div>
        <span className="text-xs text-slate-500">
          {filtered.length === rows.length
            ? `${rows.length} cities`
            : `${filtered.length} of ${rows.length}`}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">City</th>
              <th className="px-3 py-2 font-semibold">Country</th>
              <th className="px-3 py-2 font-semibold">Last reviewed</th>
              <th className="px-3 py-2 font-semibold">Days</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs text-slate-400">
                  No cities match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="hover:bg-stone-50/60">
                  <td className="px-3 py-2 font-medium text-slate-800">{r.city}</td>
                  <td className="px-3 py-2 text-slate-600">{r.country}</td>
                  <td className="px-3 py-2 text-slate-600">{r.lastReviewed}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {Number.isFinite(r.daysSinceReview) ? `${r.daysSinceReview}d` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <ScanNowButton cityId={r.id} label="Scan city" compact />
                      <MarkReviewedButton cityId={r.id} cityName={r.city} compact />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
