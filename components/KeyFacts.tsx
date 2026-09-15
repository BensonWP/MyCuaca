"use client";

import type { BmkgCurrentConditions } from "@/lib/bmkg";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { windDirection } from "@/lib/format";
import StatCard from "@/components/StatCard";
import {
  CloudIcon,
  DropletIcon,
  EyeIcon,
  ThermometerIcon,
  WindIcon,
} from "@/lib/icons";

export default function KeyFacts({ current, unit }: { current: BmkgCurrentConditions; unit: Unit }) {
  const facts = [
    {
      label: "Kelembapan",
      value: `${current.humidity}%`,
      sub: current.humidity >= 80 ? "Cukup gerah, banyak minum." : "Masih nyaman.",
      icon: <DropletIcon />,
      tint: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
      progress: current.humidity / 100,
    },
    {
      label: "Angin",
      value: formatSpeed(current.windSpeed, unit),
      sub: `Dari arah ${windDirection(current.windDeg)}`,
      icon: <WindIcon />,
      tint: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    },
    {
      label: "Tutupan awan",
      value: `${current.cloudCover}%`,
      sub: current.cloudCover > 70 ? "Langit mendung." : "Langit cukup cerah.",
      icon: <CloudIcon />,
      tint: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
      progress: current.cloudCover / 100,
    },
    {
      label: "Jarak pandang",
      value: current.visibilityText,
      sub: current.visibility < 5000 ? "Berkabut, hati-hati berkendara." : "Pandangan jelas.",
      icon: <EyeIcon />,
      tint: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      progress: Math.min(1, current.visibility / 10000),
    },
    {
      label: "Curah hujan",
      value: `${current.precipitation} mm`,
      sub: current.precipitation > 5 ? "Hujan cukup deras." : "Tidak ada hujan signifikan.",
      icon: <DropletIcon className="h-5 w-5" />,
      tint: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      label: "Suhu",
      value: formatTemp(current.temp, unit),
      sub: `Arah angin ${windDirection(current.windDeg)}`,
      icon: <ThermometerIcon />,
      tint: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
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
            Fakta kunci dari BMKG
          </h3>
        </div>
        <p className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 dark:bg-sky-900 dark:text-sky-200">
          6 kartu live
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
