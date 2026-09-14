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
  const H = 160;
  const PAD = 32;
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
      <figcaption className="mb-3 text-lg font-bold text-zinc-950 dark:text-white">
        {title}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full sm:h-52" aria-hidden>
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
            <text x={PAD - 6} y={y(line) + 4} textAnchor="end" fontSize="12" className="fill-zinc-500 dark:fill-zinc-400">
              {Math.round(line)}°
            </text>
          </g>
        ))}
        <polygon points={area} className="fill-sky-200 dark:fill-sky-900" opacity="0.5" />
        <polyline
          points={points}
          fill="none"
          className="stroke-sky-700 dark:stroke-sky-400"
          strokeWidth="2.5"
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
                r={isExtreme ? 5 : 3}
                className="fill-sky-700 dark:fill-sky-400"
              />
              {isExtreme && (
                <text
                  x={x(i)}
                  y={y(item.main.temp) - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  className="fill-zinc-900 dark:fill-white"
                >
                  {formatTemp(item.main.temp, unit)}
                </text>
              )}
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" className="fill-zinc-600 dark:fill-zinc-400">
                {formatHour(item.dt)}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
