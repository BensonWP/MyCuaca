"use client";

import type { DailyCard } from "@/lib/forecast";
import { Unit, formatTemp } from "@/lib/storage";
import { formatDay, tempStripeColor } from "@/lib/forecast";

interface Props {
  days: DailyCard[];
  selectedKey: string;
  onSelect: (key: string) => void;
  unit: Unit;
}

// Pita suhu ala warming stripes: warna tiap hari dinormalisasi dari min-maks
// 5 hari. Strip adalah lapisan sekilas; angka min-maks di bawahnya membawa informasi
// yang sama untuk pengguna yang tidak membedakan warna.
export default function TempStripes({ days, selectedKey, onSelect, unit }: Props) {
  const allTemps = days.flatMap((day) => [day.min, day.max]);
  const min = Math.min(...allTemps);
  const max = Math.max(...allTemps);

  return (
    <div role="group" aria-label="Pilih hari prakiraan" className="grid grid-cols-5 gap-2 sm:gap-3">
      {days.map((day) => {
        const active = day.key === selectedKey;
        return (
          <button
            key={day.key}
            onClick={() => onSelect(day.key)}
            aria-pressed={active}
            aria-label={`${formatDay(day.date)}, maks ${formatTemp(day.max, unit)}, min ${formatTemp(day.min, unit)}, hujan ${Math.round(day.pop * 100)} persen`}
            className={`stateful min-h-11 rounded-lg border p-2 text-center sm:p-3 ${
              active
                ? "border-sky-700 bg-sky-50 dark:border-sky-500 dark:bg-sky-950"
                : "border-zinc-300 bg-white hover:border-sky-700 dark:border-zinc-700 dark:bg-zinc-950"
            }`}
          >
            <span className="block truncate text-xs font-bold capitalize text-zinc-950 sm:text-sm dark:text-white">
              {day.date.toLocaleDateString("id-ID", { weekday: "short" })}
            </span>
            <span
              aria-hidden
              style={{ backgroundColor: tempStripeColor(day.max, min, max) }}
              className="mx-auto mt-2 block h-20 w-full rounded-sm sm:h-28"
            />
            <span className="mt-2 block text-sm font-bold text-zinc-950 dark:text-white">
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
