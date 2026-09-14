"use client";

import type { AirPollution } from "@/lib/openweather";

const SCALE = [
  { value: 1, label: "Baik" },
  { value: 2, label: "Sedang" },
  { value: 3, label: "Tidak sehat bagi kelompok sensitif" },
  { value: 4, label: "Tidak sehat" },
  { value: 5, label: "Sangat tidak sehat" },
];

const COMPONENTS: Record<string, string> = {
  pm2_5: "PM2.5",
  pm10: "PM10",
  o3: "Ozon",
  no2: "Nitrogen dioksida",
  so2: "Sulfur dioksida",
  co: "Karbon monoksida",
};

export default function AqiScale({ data }: { data: AirPollution }) {
  const entry = data.list[0];
  if (!entry) return null;
  const active = SCALE.find((item) => item.value === entry.main.aqi) ?? {
    value: entry.main.aqi,
    label: "Tidak diketahui",
  };
  const marker = Math.min(100, Math.max(0, ((entry.main.aqi - 1) / 4) * 100));
  const rows = Object.entries(entry.components)
    .filter(([key]) => COMPONENTS[key])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section aria-labelledby="skala-aqi" className="rounded-2xl bg-surface p-5 sm:p-8">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">Indeks kualitas udara OpenWeather</p>
      <h3 id="skala-aqi" className="mt-1 text-7xl font-extrabold tracking-tight text-zinc-950 sm:text-8xl dark:text-white">
        {entry.main.aqi}
      </h3>
      <p className="mt-1 text-lg font-bold text-zinc-950 dark:text-white">{active.label}</p>
      <div className="mt-6" role="img" aria-label={`AQI ${entry.main.aqi}, ${active.label}, skala 1 sampai 5`}>
        <div className="relative h-5 rounded-sm bg-zinc-300 dark:bg-zinc-700">
          <span
            aria-hidden
            style={{ left: `${marker}%` }}
            className="absolute top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-sky-700 dark:bg-sky-400"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {SCALE.map((item) => (
            <span key={item.value}>{item.value}</span>
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          Skala 1 berarti baik dan skala 5 berarti sangat tidak sehat menurut kategori OpenWeather.
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([key, value]) => (
          <div key={key} className="flex items-baseline justify-between border-b border-zinc-300 pb-2 dark:border-zinc-700">
            <dt className="text-sm text-zinc-700 dark:text-zinc-300">{COMPONENTS[key]}</dt>
            <dd className="text-base font-bold text-zinc-950 dark:text-white">
              {value.toFixed(1)} mikrogram per meter kubik
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
