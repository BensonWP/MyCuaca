"use client";

import type { CurrentWeather } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { clock, windDirection } from "@/lib/format";
import StatCard from "@/components/StatCard";
import {
  CloudIcon,
  DropletIcon,
  EyeIcon,
  GaugeIcon,
  SunriseIcon,
  SunsetIcon,
  ThermometerIcon,
  WindIcon,
} from "@/lib/icons";

export default function KeyFacts({ current, unit }: { current: CurrentWeather; unit: Unit }) {
  const facts = [
    {
      label: "Kelembapan",
      value: `${current.main.humidity}%`,
      sub: current.main.humidity >= 80 ? "Cukup gerah, banyak minum." : "Masih nyaman.",
      icon: <DropletIcon />,
      tint: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
      progress: current.main.humidity / 100,
    },
    {
      label: "Angin",
      value: formatSpeed(current.wind.speed, unit),
      sub: `Dari arah ${windDirection(current.wind.deg)}`,
      icon: <WindIcon />,
      tint: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    },
    {
      label: "Terasa seperti",
      value: formatTemp(current.main.feels_like, unit),
      sub: `Aktual ${formatTemp(current.main.temp, unit)}`,
      icon: <ThermometerIcon />,
      tint: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      label: "Jarak pandang",
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      sub: current.visibility < 5000 ? "Berkabut, hati-hati berkendara." : "Pandangan jelas.",
      icon: <EyeIcon />,
      tint: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      progress: Math.min(1, current.visibility / 10000),
    },
    {
      label: "Tutupan awan",
      value: `${current.clouds.all}%`,
      sub: current.clouds.all > 70 ? "Langit mendung." : "Langit cukup cerah.",
      icon: <CloudIcon />,
      tint: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      progress: current.clouds.all / 100,
    },
    {
      label: "Tekanan udara",
      value: `${current.main.pressure} hPa`,
      sub: "Normal 1013 hPa permukaan laut.",
      icon: <GaugeIcon />,
      tint: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      label: "Suhu min–maks",
      value: `${formatTemp(current.main.temp_min, unit)} / ${formatTemp(current.main.temp_max, unit)}`,
      sub: "Rentang hari ini.",
      icon: <ThermometerIcon className="h-5 w-5" />,
      tint: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    },
    {
      label: "Matahari terbit",
      value: clock(current.sys.sunrise),
      sub: "Waktu setempat.",
      icon: <SunriseIcon />,
      tint: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      label: "Matahari terbenam",
      value: clock(current.sys.sunset),
      sub: "Waktu setempat.",
      icon: <SunsetIcon />,
      tint: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
  ];

  return (
    <section aria-labelledby="fakta-kunci" className="rounded-2xl bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Sekilas hari ini
          </p>
          <h3 id="fakta-kunci" className="mt-1 text-lg font-extrabold text-zinc-950 sm:text-xl dark:text-white">
            Fakta kunci hari ini
          </h3>
        </div>
        <p className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-900 dark:text-sky-200">
          9 kartu live
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <StatCard key={fact.label} {...fact} />
        ))}
      </div>
    </section>
  );
}
