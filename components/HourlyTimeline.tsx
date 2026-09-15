"use client";

import type { BmkgSlot } from "@/lib/bmkg";
import { bmkgToIcon } from "@/lib/bmkg";
import { Unit, formatTemp } from "@/lib/storage";
import { formatBmkgHour } from "@/lib/format";

interface Props {
  id: string;
  title: string;
  slots: BmkgSlot[];
  unit: Unit;
}

function parseSlotTs(s: BmkgSlot): number {
  const d = new Date(s.local_datetime.replace(" ", "T"));
  return isNaN(d.getTime()) ? 0 : d.getTime() / 1000;
}

function findNearestIndex(slots: BmkgSlot[]): number {
  const now = Date.now() / 1000;
  let best = 0;
  let bestDist = Infinity;
  slots.forEach((s, i) => {
    const d = Math.abs(parseSlotTs(s) - now);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}

function slotHour(s: BmkgSlot): number {
  const d = new Date(s.local_datetime.replace(" ", "T"));
  return isNaN(d.getTime()) ? 12 : d.getHours();
}

export default function HourlyTimeline({ id, title, slots, unit }: Props) {
  if (slots.length === 0) return null;
  const nearestIdx = findNearestIndex(slots);
  const temps = slots.map((s) => s.t);
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
        <p className="animate-scroll-hint text-xs font-semibold text-zinc-500 dark:text-zinc-400">Geser →</p>
      </div>
      <ol className="no-scrollbar -mx-1 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {slots.map((s, idx) => {
          const isNow = idx === nearestIdx;
          const heat = (s.t - min) / span;
          const h = slotHour(s);
          const icon = bmkgToIcon(s.weather, h);
          return (
            <li
              key={s.local_datetime}
              className={`stateful animate-slide-in-up flex min-w-[104px] snap-center flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-transform hover:-translate-y-1 ${
                isNow
                  ? "border-sky-500 bg-gradient-to-b from-sky-600 to-blue-700 text-white shadow-md"
                  : "border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span
                className={`text-xs font-bold ${isNow ? "text-sky-100" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                {formatBmkgHour(s.local_datetime, s.datetime)}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.weather_desc}
                width={44}
                height={44}
                className="-my-1"
              />
              <span className={`text-base font-extrabold ${isNow ? "text-white" : "text-zinc-950 dark:text-white"}`}>
                {formatTemp(s.t, unit)}
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
                {s.weather_desc}
              </span>
              {s.tp > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isNow ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                  }`}
                >
                  🌧 {s.tp}mm
                </span>
              )}
              {isNow && (
                <span className="animate-pulse-glow rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-extrabold text-amber-950">
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
