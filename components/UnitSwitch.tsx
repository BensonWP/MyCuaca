"use client";

import { Unit } from "@/lib/storage";

interface Props {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitSwitch({ unit, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Satuan suhu"
      className="flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
    >
      {(["metric", "imperial"] as Unit[]).map((option) => {
        const active = unit === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`stateful min-h-11 min-w-11 px-3 py-2 text-sm font-semibold ${
              active
                ? "bg-sky-700 text-white dark:bg-sky-700"
                : "bg-white text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            }`}
          >
            {option === "metric" ? "°C" : "°F"}
          </button>
        );
      })}
    </div>
  );
}
