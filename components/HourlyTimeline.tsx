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
  const nearestIdx = findNearestIndex(items);
  const temps = items.map((i) => i.main.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;

  return (
    <section aria-labelledby={id} className="rounded-2xl bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Jam per jam
          </p>
          <h3 id={id} className="mt-1 text-lg font-extrabold text-zinc-950 sm:text-xl dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Geser →</p>
      </div>
      <ol className="no-scrollbar -mx-1 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {items.map((item, idx) => {
          const isNow = idx === nearestIdx;
          const heat = (item.main.temp - min) / span;
          return (
            <li
              key={item.dt}
              className={`stateful flex min-w-[104px] snap-center flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-transform hover:-translate-y-1 ${
                isNow
                  ? "border-sky-500 bg-gradient-to-b from-sky-600 to-blue-700 text-white shadow-md"
                  : "border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <span
                className={`text-xs font-bold ${isNow ? "text-sky-100" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                {formatHour(item.dt)}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt=""
                width={44}
                height={44}
                className="-my-1"
              />
              <span className={`text-base font-extrabold ${isNow ? "text-white" : "text-zinc-950 dark:text-white"}`}>
                {formatTemp(item.main.temp, unit)}
              </span>
              <span
                aria-hidden
                className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
              >
                <span
                  className={`block h-full rounded-full ${
                    isNow ? "bg-amber-300" : "bg-gradient-to-r from-sky-400 to-blue-600"
                  }`}
                  style={{ width: `${Math.round(25 + heat * 75)}%` }}
                />
              </span>
              <span
                className={`max-w-full truncate text-[11px] capitalize ${
                  isNow ? "text-sky-100" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {item.weather[0].description}
              </span>
              {item.pop > 0.05 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isNow ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                  }`}
                >
                  {Math.round(item.pop * 100)}%
                </span>
              )}
              {isNow && (
                <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-extrabold text-amber-950">
                  Sekarang
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
