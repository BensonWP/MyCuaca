"use client";

import type { ForecastItem } from "@/lib/openweather";
import { Unit, formatTemp } from "@/lib/storage";
import { formatHour } from "@/lib/forecast";

interface Props {
  items: ForecastItem[];
  unit: Unit;
  title: string;
}

export default function TempCurve({ items, unit, title }: Props) {
  if (items.length === 0) return null;
  const temps = items.map((item) => item.main.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;
  const W = 600;
  const H = 180;
  const PAD = 36;
  const x = (i: number) => PAD + (i / Math.max(1, items.length - 1)) * (W - PAD * 2);
  const y = (t: number) => PAD + (1 - (t - min) / span) * (H - PAD * 2);
  const points = items.map((item, i) => `${x(i)},${y(item.main.temp)}`).join(" ");
  const smooth = items
    .map((item, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(item.main.temp).toFixed(1)}`)
    .join(" ");
  const area = `${PAD},${H - PAD} ${points} ${W - PAD},${H - PAD}`;
  const minIndex = temps.indexOf(min);
  const maxIndex = temps.indexOf(max);

  return (
    <figure
      role="img"
      aria-label={`${title}: suhu terendah ${formatTemp(min, unit)} pukul ${formatHour(items[minIndex].dt)}, tertinggi ${formatTemp(max, unit)} pukul ${formatHour(items[maxIndex].dt)}`}
      className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-700/70 dark:bg-zinc-900"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-lg font-extrabold text-zinc-950 dark:text-white">
          {title}
        </figcaption>
        <div className="flex gap-1.5 text-[11px] font-bold">
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
            Maks {formatTemp(max, unit)}
          </span>
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
            Min {formatTemp(min, unit)}
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-48 w-full sm:h-56" aria-hidden>
        <defs>
          <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="tempLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        {[min, max].map((line) => (
          <g key={line}>
            <line
              x1={PAD}
              x2={W - PAD}
              y1={y(line)}
              y2={y(line)}
              strokeWidth="1"
              strokeDasharray="4 4"
              className="stroke-zinc-300 dark:stroke-zinc-700"
            />
            <text x={PAD - 6} y={y(line) + 4} textAnchor="end" fontSize="12" fontWeight="bold" className="fill-zinc-500 dark:fill-zinc-400">
              {Math.round(line)}°
            </text>
          </g>
        ))}
        <polygon points={area} fill="url(#tempArea)" />
        <path
          d={smooth}
          fill="none"
          stroke="url(#tempLine)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {items.map((item, i) => {
          const isExtreme = i === minIndex || i === maxIndex;
          return (
            <g key={item.dt}>
              <circle
                cx={x(i)}
                cy={y(item.main.temp)}
                r={isExtreme ? 6 : 3.5}
                className={isExtreme ? "fill-amber-400 stroke-white" : "fill-white stroke-sky-600 dark:fill-zinc-900"}
                strokeWidth={isExtreme ? 2 : 2.5}
              />
              {isExtreme && (
                <text
                  x={x(i)}
                  y={y(item.main.temp) - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  className="fill-zinc-900 dark:fill-white"
                >
                  {formatTemp(item.main.temp, unit)}
                </text>
              )}
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fontWeight={isExtreme ? "bold" : "normal"} className="fill-zinc-600 dark:fill-zinc-400">
                {formatHour(item.dt)}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
