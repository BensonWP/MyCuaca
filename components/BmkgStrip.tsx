"use client";

import { useBmkg } from "@/app/bmkg-provider";
import { formatBmkgDay, formatBmkgHour } from "@/lib/format";

export default function BmkgStrip({ limitDays = 3 }: { limitDays?: number }) {
  const { cuaca, bmkgActive } = useBmkg();
  if (!bmkgActive || !cuaca) return null;
  const days = cuaca.days.slice(0, limitDays);

  return (
    <section aria-label="Prakiraan BMKG per 3 jam" className="rounded-2xl bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-300">
            🇮🇩 Prakiraan BMKG · per 3 jam
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-zinc-950 sm:text-xl dark:text-white">
            3 hari ke depan
          </h3>
        </div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Geser →</p>
      </div>
      <div className="mt-4 flex flex-col gap-5">
        {days.map((slots, di) => (
          <div key={di}>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {slots[0] ? formatBmkgDay(slots[0].local_datetime, slots[0].datetime) : `Hari ${di + 1}`}
            </p>
            <ol className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
              {slots.map((s) => {
                return (
                  <li
                    key={s.local_datetime}
                    className="stateful flex min-w-[104px] snap-center flex-col items-center gap-1 rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {formatBmkgHour(s.local_datetime, s.datetime)}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.weather_desc} width={44} height={44} className="-my-1" loading="lazy" />
                    <span className="text-base font-extrabold text-zinc-950 dark:text-white">
                      {Math.round(s.t)}°
                    </span>
                    <span className="max-w-full truncate text-[11px] text-zinc-600 dark:text-zinc-400">
                      {s.weather_desc}
                    </span>
                    <span className="flex gap-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      <span>💧{s.hu}%</span>
                      <span>🌧{s.tp}mm</span>
                    </span>
                    <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                      {s.wd} {Math.round(s.ws)}
                    </span>
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
