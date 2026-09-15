"use client";

import { useTheme } from "@/app/theme-provider";
import { useWeather } from "@/app/weather-provider";
import type { ThemeSetting } from "@/lib/theme";
import type { Unit } from "@/lib/storage";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const THEME_OPTIONS: { value: Exclude<ThemeSetting, "sistem">; label: string; title: string; icon: React.ReactNode }[] = [
  { value: "terang", label: "Terang", title: "Tema terang", icon: <SunIcon /> },
  { value: "gelap", label: "Gelap", title: "Tema gelap", icon: <MoonIcon /> },
];

const UNIT_OPTIONS: { value: Unit; label: string; title: string }[] = [
  { value: "metric", label: "°C", title: "Celcius" },
  { value: "imperial", label: "°F", title: "Fahrenheit" },
];

export default function HeaderControls() {
  const { setting, resolved, setSetting } = useTheme();
  const { unit, switchUnit } = useWeather();
  // Pengguna lama mungkin masih tersimpan "sistem": petakan ke tema resolved agar tetap ada pill aktif.
  const activeTheme = setting === "sistem" ? resolved : setting;

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-100 p-1 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900 dark:shadow-none">
      <div role="group" aria-label="Tema tampilan" className="flex items-center gap-0.5">
        {THEME_OPTIONS.map((option) => {
          const active = activeTheme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSetting(option.value)}
              aria-pressed={active}
              title={option.title}
              className={`stateful flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:px-3 sm:text-[13px] ${
                active
                  ? "bg-white text-sky-700 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-sky-300 dark:ring-zinc-700"
                  : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>

      <div aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-zinc-300 dark:bg-zinc-700" />

      <div role="group" aria-label="Satuan suhu" className="flex items-center gap-0.5">
        {UNIT_OPTIONS.map((option) => {
          const active = unit === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => switchUnit(option.value)}
              aria-pressed={active}
              title={option.title}
              className={`stateful flex min-h-9 min-w-10 items-center justify-center rounded-full px-2.5 text-xs font-bold sm:text-[13px] ${
                active
                  ? "bg-white text-sky-700 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-sky-300 dark:ring-zinc-700"
                  : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
