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
  const mid = (min + max) / 2;
  const maxPop = Math.max(...items.map((item) => item.pop));

  return (
    <figure
      role="img"
      aria-label={`${title}: suhu terendah ${formatTemp(min, unit)} pukul ${formatHour(items[minIndex].dt)}, tertinggi ${formatTemp(max, unit)} pukul ${formatHour(items[maxIndex].dt)}, peluang hujan tertinggi ${Math.round(maxPop * 100)} persen`}
      className="rounded-2xl bg-surface p-5 sm:p-6"
    >
      <figcaption className="mb-3 text-lg font-bold text-zinc-950 dark:text-white">
        {title}
      </figcaption>
      <svg viewBox={`-4 0 ${W + 44} ${H}`} className="h-48 w-full sm:h-56" aria-hidden>
        {[min, mid, max].map((line) => (
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
            <text x={W - PAD + 4} y={y(line) + 4} fontSize="12" className="fill-zinc-500 dark:fill-zinc-400">
              {Math.round(line)}°
            </text>
          </g>
        ))}
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
            {item.pop > 0.05 && (
              <rect
                x={x(i) - 5}
                y={H - PAD - Math.max(3, item.pop * 34)}
                width={10}
                height={Math.max(3, item.pop * 34)}
                rx={2}
                className="fill-sky-500 dark:fill-sky-400"
                opacity={0.35 + item.pop * 0.55}
              />
            )}
            <circle
              cx={x(i)}
              cy={y(item.main.temp)}
              r={i === minIndex || i === maxIndex ? 6 : 3.5}
              className="fill-sky-700 stroke-white dark:fill-sky-400 dark:stroke-zinc-950"
              strokeWidth={i === minIndex || i === maxIndex ? 2 : 0}
            />
            <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="12" className="fill-zinc-600 dark:fill-zinc-400">
              {formatHour(item.dt)}
            </text>
          </g>
        ))}
        <text x={W - PAD} y={y(max) - 10} textAnchor="end" fontSize="14" fontWeight="bold" className="fill-zinc-900 dark:fill-white">
          {formatTemp(max, unit)}
        </text>
        <text x={W - PAD} y={y(min) + 20} textAnchor="end" fontSize="14" fontWeight="bold" className="fill-zinc-900 dark:fill-white">
          {formatTemp(min, unit)}
        </text>
      </svg>
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        Batang biru di bawah menunjukkan peluang hujan per 3 jam.
      </p>
    </figure>
  );
}
