"use client";

import { ThemeSetting } from "@/lib/theme";
import { useTheme } from "@/app/theme-provider";

const OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: "terang", label: "Terang" },
  { value: "gelap", label: "Gelap" },
  { value: "sistem", label: "Sistem" },
];

export default function ThemeSwitch() {
  const { setting, setSetting } = useTheme();
  return (
    <div
      role="group"
      aria-label="Tema tampilan"
      className="flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
    >
      {OPTIONS.map((option) => {
        const active = setting === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setSetting(option.value)}
            aria-pressed={active}
            className={`min-h-11 px-2 py-2 text-xs font-semibold sm:px-3 sm:text-sm ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                : "bg-white text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
