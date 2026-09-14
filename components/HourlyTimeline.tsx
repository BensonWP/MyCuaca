"use client";

import type { ForecastItem } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { formatHour } from "@/lib/forecast";

interface Props {
  id: string;
  title: string;
  items: ForecastItem[];
  unit: Unit;
}

export default function HourlyTimeline({ id, title, items, unit }: Props) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 id={id} className="text-lg font-bold text-zinc-950 dark:text-white">
        {title}
      </h3>
      <ol className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={item.dt} className="flex items-center gap-4 py-3">
            <span className="w-14 shrink-0 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {formatHour(item.dt)}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              width={48}
              height={48}
            />
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-zinc-950 dark:text-white">
                {formatTemp(item.main.temp, unit)}
              </p>
              <p className="truncate text-sm capitalize text-zinc-700 dark:text-zinc-300">
                {item.weather[0].description} · hujan {Math.round(item.pop * 100)} persen
              </p>
            </div>
            <span className="shrink-0 text-sm text-zinc-700 dark:text-zinc-300">
              {formatSpeed(item.wind.speed, unit)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
