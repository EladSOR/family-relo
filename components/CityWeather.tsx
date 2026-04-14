import type { CityWeatherData } from "@/lib/types";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(m: number) {
  return MONTH_SHORT[m - 1] ?? "?";
}

export function CityWeather({ data }: { data: CityWeatherData }) {
  const months = data.months;
  if (!months?.length) return null;

  const maxHigh = Math.max(...months.map((x) => x.highC), 1);

  const hottest = months.reduce((a, b) => (a.highC >= b.highC ? a : b));
  const coldest = months.reduce((a, b) => (a.lowC <= b.lowC ? a : b));
  const wettest = months.reduce((a, b) => (a.rainMm >= b.rainMm ? a : b));
  const driest = months.reduce((a, b) => (a.rainMm <= b.rainMm ? a : b));

  const chips = [
    {
      key: "hot",
      label: "Hottest",
      value: `${monthLabel(hottest.month)} · ${hottest.highC}°C`,
      sub: "mean daily high",
      className: "bg-sky-50 text-sky-950 ring-sky-100",
    },
    {
      key: "cold",
      label: "Coolest",
      value: `${monthLabel(coldest.month)} · ${coldest.lowC}°C`,
      sub: "mean daily low",
      className: "bg-indigo-50 text-indigo-950 ring-indigo-100",
    },
    {
      key: "wet",
      label: "Wettest",
      value: `${monthLabel(wettest.month)} · ${wettest.rainMm} mm`,
      sub: "month total",
      className: "bg-blue-50 text-blue-950 ring-blue-100",
    },
    {
      key: "dry",
      label: "Driest",
      value: `${monthLabel(driest.month)} · ${driest.rainMm} mm`,
      sub: "month total",
      className: "bg-amber-50 text-amber-950 ring-amber-100",
    },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-xl bg-slate-50/80 px-3.5 py-3 sm:bg-transparent sm:px-0 sm:py-0">
        <p className="text-xs leading-snug text-slate-600 sm:text-sm sm:leading-relaxed">
          <span className="font-medium text-slate-700">Monthly normals ({data.normalsPeriod})</span>
          <span className="text-slate-500"> · {data.dataSeries}</span>
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-slate-500 sm:mt-2 sm:text-sm sm:text-slate-600">
          Rainy-day counts are approximate (from monthly rainfall).
        </p>
      </div>

      {/* 2×2 grid on mobile — denser than a single column of pills */}
      <ul className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {chips.map((c) => (
          <li
            key={c.key}
            className={`flex min-h-[4.25rem] flex-col justify-center rounded-xl px-3 py-2.5 ring-1 sm:min-h-0 sm:rounded-full sm:px-3.5 sm:py-2 ${c.className}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600/90 sm:text-[11px]">
              {c.label}
            </span>
            <span className="mt-0.5 text-sm font-semibold tabular-nums leading-tight">{c.value}</span>
            <span className="mt-0.5 text-[10px] leading-snug text-slate-600/90 sm:text-[11px]">{c.sub}</span>
          </li>
        ))}
      </ul>

      {/* Mobile: compact cards — no horizontal scroll */}
      <div className="space-y-2 md:hidden">
        {months.map((row) => (
          <div
            key={row.month}
            className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
              <span className="text-sm font-semibold text-slate-800">{monthLabel(row.month)}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
                    style={{ width: `${Math.min(100, (row.highC / maxHigh) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{row.highC}°C</span>
              </div>
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Low</dt>
                <dd className="text-xs font-medium tabular-nums text-slate-700">{row.lowC}°C</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Rain</dt>
                <dd className="text-xs font-medium tabular-nums text-slate-700">{row.rainMm} mm</dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Wet days</dt>
                <dd className="text-xs font-medium tabular-nums text-slate-600">~{row.rainDays}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden overflow-x-auto rounded-xl ring-1 ring-slate-100 md:block">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2.5">Month</th>
              <th className="px-3 py-2.5">Typical high</th>
              <th className="px-3 py-2.5">Typical low</th>
              <th className="px-3 py-2.5">Rain (total)</th>
              <th className="px-3 py-2.5">Rainy days (~)</th>
            </tr>
          </thead>
          <tbody>
            {months.map((row) => (
              <tr key={row.month} className="border-b border-slate-50 last:border-0">
                <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{monthLabel(row.month)}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-200 to-orange-400"
                        style={{ width: `${Math.min(100, (row.highC / maxHigh) * 100)}%` }}
                      />
                    </div>
                    <span className="tabular-nums text-slate-700">{row.highC}°C</span>
                  </div>
                </td>
                <td className="px-3 py-2 tabular-nums text-slate-700">{row.lowC}°C</td>
                <td className="px-3 py-2 tabular-nums text-slate-700">{row.rainMm} mm</td>
                <td className="px-3 py-2 tabular-nums text-slate-600">{row.rainDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.familyHighlights && data.familyHighlights.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:mb-2.5">Family notes</p>
          <ul className="space-y-2">
            {data.familyHighlights.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{data.disclaimer}</p>

      {data.gridLatitude != null && data.gridLongitude != null && (
        <p className="text-[11px] text-slate-400">
          Grid cell used: {data.gridLatitude.toFixed(3)}°, {data.gridLongitude.toFixed(3)}° (WGS84)
        </p>
      )}
    </div>
  );
}
