"use client";

import type { ForecastItem } from "@/lib/openweather";
import { Unit, formatTemp } from "@/lib/storage";
import { formatHour } from "@/lib/forecast";

interface Props {
  id: string;
  title: string;
  items: ForecastItem[];
  unit: Unit;
}

interface TimeGroup {
  label: string;
  items: ForecastItem[];
}

function groupByTime(items: ForecastItem[]): TimeGroup[] {
  const groups: { label: string; from: number; to: number }[] = [
    { label: "Malam", from: 21, to: 3 },
    { label: "Pagi", from: 3, to: 9 },
    { label: "Siang", from: 9, to: 15 },
    { label: "Sore", from: 15, to: 21 },
  ];

  const result: TimeGroup[] = [];
  for (const g of groups) {
    const matched = items.filter((item) => {
      const h = new Date(item.dt * 1000).getHours();
      if (g.from < g.to) return h >= g.from && h < g.to;
      return h >= g.from || h < g.to;
    });
    if (matched.length > 0) result.push({ label: g.label, items: matched });
  }
  return result;
}

function findNearestIndex(items: ForecastItem[]): number {
  const now = Date.now() / 1000;
  let best = 0;
  let bestDist = Infinity;
  items.forEach((item, i) => {
    const d = Math.abs(item.dt - now);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}

export default function HourlyTimeline({ id, title, items, unit }: Props) {
  if (items.length === 0) return null;
  const groups = groupByTime(items);
  const nearestIdx = findNearestIndex(items);
  let globalIdx = -1;

  return (
    <section aria-labelledby={id} className="rounded-2xl bg-surface p-5 sm:p-6">
      <h3 id={id} className="text-lg font-bold text-zinc-950 dark:text-white">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {group.label}
            </p>
            <ol className="flex flex-col gap-1">
              {group.items.map((item) => {
                globalIdx++;
                const isNow = globalIdx === nearestIdx;
                return (
                  <li
                    key={item.dt}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 sm:gap-4 ${
                      isNow
                        ? "bg-sky-50 ring-1 ring-sky-200 dark:bg-sky-950 dark:ring-sky-800"
                        : ""
                    }`}
                  >
                    <span className="w-14 shrink-0 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatHour(item.dt)}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt=""
                      width={32}
                      height={32}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-base font-bold text-zinc-950 dark:text-white">
                        {formatTemp(item.main.temp, unit)}
                      </span>
                      <span className="ml-2 text-sm capitalize text-zinc-700 dark:text-zinc-300">
                        {item.weather[0].description}
                      </span>
                    </div>
                    {item.pop > 0.05 && (
                      <span className="shrink-0 text-xs font-semibold text-sky-700 dark:text-sky-300">
                        {Math.round(item.pop * 100)}%
                      </span>
                    )}
                    {isNow && (
                      <span className="shrink-0 rounded-full bg-sky-700 px-2 py-0.5 text-xs font-bold text-white dark:bg-sky-500">
                        Sekarang
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
