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
  return (
    <div role="group" aria-label="Pilih hari prakiraan" className="grid grid-cols-5 gap-2 sm:gap-3">
      {days.map((day) => {
        const active = day.key === selectedKey;
        return (
          <button
            key={day.key}
            onClick={() => onSelect(day.key)}
            aria-pressed={active}
            aria-label={`${formatDay(day.date)}, ${day.description}, maks ${formatTemp(day.max, unit)}, min ${formatTemp(day.min, unit)}, hujan ${Math.round(day.pop * 100)} persen`}
            className={`stateful min-h-11 rounded-lg border p-2 text-center sm:p-3 ${
              active
                ? "border-sky-700 bg-sky-50 dark:border-sky-500 dark:bg-sky-950"
                : "border-zinc-300 bg-white hover:border-sky-700 dark:border-zinc-700 dark:bg-zinc-950"
            }`}
          >
            <span className="block truncate text-xs font-bold capitalize text-zinc-950 sm:text-sm dark:text-white">
              {day.date.toLocaleDateString("id-ID", { weekday: "short" })}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              width={48}
              height={48}
              className="mx-auto mt-1"
            />
            <span className="mt-1 block text-sm font-bold text-zinc-950 dark:text-white">
              {formatTemp(day.max, unit)}
            </span>
            <span className="mt-1 block text-xs font-semibold text-sky-800 dark:text-sky-300">
              {Math.round(day.pop * 100)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
