"use client";

import type { CurrentWeather } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";

function clock(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function KeyFacts({ current, unit }: { current: CurrentWeather; unit: Unit }) {
  const facts: { label: string; value: string }[] = [
    { label: "Kelembapan", value: `${current.main.humidity}%` },
    { label: "Tekanan udara", value: `${current.main.pressure} hPa` },
    { label: "Jarak pandang", value: `${(current.visibility / 1000).toFixed(1)} km` },
    { label: "Tutupan awan", value: `${current.clouds.all}%` },
    { label: "Suhu minimum", value: formatTemp(current.main.temp_min, unit) },
    { label: "Suhu maksimum", value: formatTemp(current.main.temp_max, unit) },
    { label: "Matahari terbit", value: clock(current.sys.sunrise) },
    { label: "Matahari terbenam", value: clock(current.sys.sunset) },
  ];

  return (
    <section aria-labelledby="fakta-kunci" className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 id="fakta-kunci" className="text-lg font-bold text-zinc-950 dark:text-white">
        Fakta kunci hari ini
      </h3>
      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <dt className="text-sm text-zinc-700 dark:text-zinc-300">{fact.label}</dt>
            <dd className="mt-1 text-xl font-bold text-zinc-950 dark:text-white">{fact.value}</dd>
          </div>
        ))}
        <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <dt className="text-sm text-zinc-700 dark:text-zinc-300">Angin</dt>
          <dd className="mt-1 text-xl font-bold text-zinc-950 dark:text-white">
            {formatSpeed(current.wind.speed, unit)} dari {current.wind.deg} derajat
          </dd>
        </div>
      </dl>
    </section>
  );
}
