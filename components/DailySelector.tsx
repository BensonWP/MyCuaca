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

export default function DailySelector({ days, selectedKey, onSelect, unit }: Props) {
  return (
    <div role="group" aria-label="Pilih hari prakiraan" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {days.map((day) => {
        const active = day.key === selectedKey;
        return (
          <button
            key={day.key}
            onClick={() => onSelect(day.key)}
            aria-pressed={active}
            className={`stateful min-h-11 rounded-xl border p-4 text-left ${
              active
                ? "border-sky-700 bg-sky-50 dark:border-sky-500 dark:bg-sky-950"
                : "border-zinc-300 bg-white hover:border-sky-700 dark:border-zinc-700 dark:bg-zinc-950"
            }`}
          >
            <span className="block text-sm font-bold capitalize text-zinc-950 dark:text-white">
              {formatDay(day.date)}
            </span>
            <span className="mt-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                width={48}
                height={48}
              />
              <span className="text-base font-bold text-zinc-950 dark:text-white">
                {formatTemp(day.max, unit)}
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {formatTemp(day.min, unit)}
              </span>
            </span>
            <span className="mt-2 block text-sm capitalize text-zinc-700 dark:text-zinc-300">
              {day.description}
            </span>
            <span className="mt-1 block text-sm font-semibold text-sky-800 dark:text-sky-300">
              Hujan {Math.round(day.pop * 100)} persen
            </span>
          </button>
        );
      })}
    </div>
  );
}
