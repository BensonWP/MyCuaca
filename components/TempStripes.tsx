"use client";

import type { DailyCard } from "@/lib/forecast";
import { Unit, formatTemp } from "@/lib/storage";
import { formatDay } from "@/lib/forecast";

interface Props {
  days: DailyCard[];
  selectedKey: string;
  onSelect: (key: string) => void;
  unit: Unit;
}

export default function TempStripes({ days, selectedKey, onSelect, unit }: Props) {
  if (days.length === 0) return null;
  const allMin = Math.min(...days.map((d) => d.min));
  const allMax = Math.max(...days.map((d) => d.max));
  const span = allMax - allMin || 1;
  const hottest = days.reduce((a, b) => (b.max > a.max ? b : a), days[0]);
  const coldest = days.reduce((a, b) => (b.min < a.min ? b : a), days[0]);

  return (
    <div role="group" aria-label="Pilih hari prakiraan" className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
      {days.map((day) => {
        const active = day.key === selectedKey;
        const left = ((day.min - allMin) / span) * 100;
        const width = Math.max(12, ((day.max - day.min) / span) * 100);
        return (
          <button
            key={day.key}
            onClick={() => onSelect(day.key)}
            aria-pressed={active}
            aria-label={`${formatDay(day.date)}, ${day.description}, maks ${formatTemp(day.max, unit)}, min ${formatTemp(day.min, unit)}, hujan ${Math.round(day.pop * 100)} persen`}
            className={`stateful relative min-h-11 min-w-[7.5rem] shrink-0 snap-center overflow-hidden rounded-2xl border p-3 text-center transition-transform hover:-translate-y-1 sm:min-w-0 sm:snap-none ${
              active
                ? "border-sky-500 bg-gradient-to-b from-sky-600 to-blue-700 text-white shadow-lg"
                : "border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            }`}
          >
            {day.key === hottest.key && (
              <span className="absolute left-2 top-2 rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                Terpanas
              </span>
            )}
            {day.key === coldest.key && day.key !== hottest.key && (
              <span className="absolute left-2 top-2 rounded-full bg-sky-200 px-2 py-0.5 text-[10px] font-extrabold text-sky-900">
                Terdingin
              </span>
            )}
            <span className={`block truncate text-xs font-extrabold uppercase tracking-wide ${active ? "text-sky-100" : "text-zinc-500 dark:text-zinc-400"}`}>
              {day.date.toLocaleDateString("id-ID", { weekday: "short" })}
            </span>
            <span className={`block text-[11px] font-semibold ${active ? "text-sky-100" : "text-zinc-500 dark:text-zinc-400"}`}>
              {day.date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              width={52}
              height={52}
              className="mx-auto mt-1 drop-shadow"
            />
            <span className={`mt-1 block text-sm font-extrabold ${active ? "text-white" : "text-zinc-950 dark:text-white"}`}>
              {formatTemp(day.max, unit)} <span className={`font-semibold ${active ? "text-sky-200" : "text-zinc-500 dark:text-zinc-400"}`}>/ {formatTemp(day.min, unit)}</span>
            </span>
            <span aria-hidden className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${active ? "bg-white/25" : "bg-zinc-200 dark:bg-zinc-700"}`}>
              <span className="block h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-500" style={{ marginLeft: `${left}%`, width: `${width}%` }} />
            </span>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-white/20 text-white" : day.pop >= 0.4 ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
              {Math.round(day.pop * 100)}% hujan
            </span>
          </button>
        );
      })}
    </div>
  );
}
