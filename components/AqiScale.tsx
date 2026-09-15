"use client";

import type { AirPollution } from "@/lib/openweather";

const SCALE = [
  { value: 1, label: "Baik", short: "Baik", marker: "bg-emerald-500 dark:bg-emerald-400", ring: "stroke-emerald-500", chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", bar: "from-emerald-400 to-green-600", advice: "Udara bersih, aman untuk aktivitas luar." },
  { value: 2, label: "Sedang", short: "Sedang", marker: "bg-yellow-400 dark:bg-yellow-500", ring: "stroke-yellow-400", chip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", bar: "from-yellow-300 to-amber-500", advice: "Kualitas udara dapat diterima." },
  { value: 3, label: "Tidak sehat bagi kelompok sensitif", short: "Sensitif", marker: "bg-orange-500 dark:bg-orange-400", ring: "stroke-orange-500", chip: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", bar: "from-orange-400 to-orange-600", advice: "Kelompok sensitif sebaiknya kurangi aktivitas luar." },
  { value: 4, label: "Tidak sehat", short: "Buruk", marker: "bg-red-500 dark:bg-red-400", ring: "stroke-red-500", chip: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", bar: "from-red-400 to-red-600", advice: "Hindari aktivitas luar yang terlalu lama." },
  { value: 5, label: "Sangat tidak sehat", short: "Bahaya", marker: "bg-purple-600 dark:bg-purple-400", ring: "stroke-purple-600", chip: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", bar: "from-purple-500 to-fuchsia-700", advice: "Hindari semua aktivitas luar." },
];

const COMPONENTS: Record<string, { label: string; limit: number }> = {
  pm2_5: { label: "PM2.5", limit: 15 },
  pm10: { label: "PM10", limit: 45 },
  o3: { label: "Ozon", limit: 100 },
  no2: { label: "Nitrogen dioksida", limit: 25 },
  so2: { label: "Sulfur dioksida", limit: 40 },
  co: { label: "Karbon monoksida", limit: 4000 },
};

export default function AqiScale({ data }: { data: AirPollution }) {
  const entry = data.list[0];
  if (!entry) return null;
  const active = SCALE.find((item) => item.value === entry.main.aqi) ?? {
    value: entry.main.aqi,
    label: "Tidak diketahui",
    short: "?",
    marker: "bg-zinc-500 dark:bg-zinc-400",
    ring: "stroke-zinc-400",
    chip: "bg-zinc-200 text-zinc-700",
    bar: "from-zinc-400 to-zinc-600",
    advice: "",
  };
  const rows = Object.entries(entry.components)
    .filter(([key]) => COMPONENTS[key])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const progress = ((entry.main.aqi - 1) / 4) * 100;
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <section aria-labelledby="skala-aqi" className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm sm:p-2 dark:border-zinc-700/70 dark:bg-zinc-900">
      <div className={`bg-gradient-to-br p-5 sm:p-8 ${active.bar} relative overflow-hidden`}>
        <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div aria-hidden className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-black/15 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden>
              <circle cx="64" cy="64" r={R} fill="none" strokeWidth="12" className="stroke-white/25" />
              <circle
                cx="64"
                cy="64"
                r={R}
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                stroke="white"
                strokeDasharray={C}
                strokeDashoffset={C - (C * (20 + progress * 0.8)) / 100}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-6xl font-extrabold leading-none drop-shadow">{entry.main.aqi}</span>
              <span className="mt-1 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-extrabold backdrop-blur-sm">
                {active.short}
              </span>
            </div>
          </div>
          <div className="min-w-52 flex-1 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">Indeks kualitas udara</p>
            <h3 id="skala-aqi" className="mt-1 text-2xl font-extrabold drop-shadow-sm">
              {active.label}
            </h3>
            {active.advice && <p className="mt-1 max-w-md text-sm text-white/90">{active.advice}</p>}
            <div className="mt-4 flex gap-1.5" role="img" aria-label={`AQI ${entry.main.aqi}, ${active.label}, skala 1 sampai 5`}>
              {SCALE.map((item) => (
                <span
                  key={item.value}
                  title={`${item.value}: ${item.label}`}
                  className={`h-2.5 flex-1 rounded-full transition-opacity ${item.value <= entry.main.aqi ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-bold text-white/80">
              <span>1 baik</span>
              <span>5 bahaya</span>
            </div>
          </div>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {rows.map(([key, value]) => {
          const meta = COMPONENTS[key];
          const pct = Math.min(100, (value / meta.limit) * 100);
          const over = value > meta.limit;
          return (
            <div key={key} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{meta.label}</dt>
                <dd className="text-base font-extrabold text-zinc-950 dark:text-white">
                  {value.toFixed(1)} <span className="text-xs font-medium text-zinc-500">µg/m³</span>
                </dd>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700" role="img" aria-label={`${meta.label} ${over ? "melebihi" : "di bawah"} ambang WHO`}>
                <div
                  className={`h-full rounded-full ${over ? "bg-gradient-to-r from-amber-400 to-red-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                Ambang WHO {meta.limit} µg/m³ · {over ? "⚠ melebihi ambang" : "✓ aman"}
              </p>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
