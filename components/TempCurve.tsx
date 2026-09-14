"use client";

import type { ForecastItem } from "@/lib/openweather";
import { Unit, formatTemp } from "@/lib/storage";
import { formatHour } from "@/lib/forecast";

interface Props {
  items: ForecastItem[];
  unit: Unit;
  title: string;
}

// Kurva suhu per 3 jam: menjawab "kapan hari ini paling panas/dingin" sekilas.
// Daftar HourlyTimeline di bawahnya membawa angka pastinya.
export default function TempCurve({ items, unit, title }: Props) {
  if (items.length === 0) return null;
  const temps = items.map((item) => item.main.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;
  const W = 600;
  const H = 180;
  const PAD = 28;
  const x = (i: number) => PAD + (i / Math.max(1, items.length - 1)) * (W - PAD * 2);
  const y = (t: number) => PAD + (1 - (t - min) / span) * (H - PAD * 2);
  const points = items.map((item, i) => `${x(i)},${y(item.main.temp)}`).join(" ");
  const area = `${PAD},${H - PAD} ${points} ${W - PAD},${H - PAD}`;
  const minIndex = temps.indexOf(min);
  const maxIndex = temps.indexOf(max);

  return (
    <figure
      role="img"
      aria-label={`${title}: suhu terendah ${formatTemp(min, unit)} pukul ${formatHour(items[minIndex].dt)}, tertinggi ${formatTemp(max, unit)} pukul ${formatHour(items[maxIndex].dt)}`}
      className="rounded-2xl bg-surface p-5 sm:p-6"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full sm:h-52" aria-hidden>
        <polygon points={area} className="fill-sky-200 dark:fill-sky-900" opacity="0.6" />
        <polyline
          points={points}
          fill="none"
          className="stroke-sky-700 dark:stroke-sky-400"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {items.map((item, i) => (
          <g key={item.dt}>
            <circle cx={x(i)} cy={y(item.main.temp)} r="4" className="fill-sky-700 dark:fill-sky-400" />
            {(i % 2 === 0 || i === items.length - 1) && (
              <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="13" className="fill-zinc-600 dark:fill-zinc-400">
                {formatHour(item.dt)}
              </text>
            )}
          </g>
        ))}
        <text x={W - PAD} y={y(max) - 8} textAnchor="end" fontSize="14" fontWeight="bold" className="fill-zinc-900 dark:fill-white">
          {formatTemp(max, unit)}
        </text>
        <text x={W - PAD} y={y(min) + 18} textAnchor="end" fontSize="14" fontWeight="bold" className="fill-zinc-900 dark:fill-white">
          {formatTemp(min, unit)}
        </text>
      </svg>
    </figure>
  );
}
