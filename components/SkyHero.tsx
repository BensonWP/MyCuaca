"use client";

import { useEffect, useRef, useState } from "react";
import type { BmkgCurrentConditions } from "@/lib/bmkg";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { formatHour, windDirection } from "@/lib/format";
import { skyTheme } from "@/lib/sky";
import WindDial from "@/components/WindDial";
import WeatherEffects from "@/components/WeatherEffects";

interface Props {
  current: BmkgCurrentConditions;
  cityName: string;
  coords: { lat: number; lon: number };
  unit: Unit;
  updatedAt: Date | null;
  onRefresh: () => void;
}

function useAnimatedNumber(target: number): number {
  const [display, setDisplay] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    if (ref.current === target) return;
    const from = ref.current;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 1 : 600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = from + (target - from) * eased;
      ref.current = value;
      setDisplay(value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return display;
}

export default function SkyHero({ current, cityName, coords, unit, updatedAt, onRefresh }: Props) {
  const theme = skyTheme(current.icon);
  const temp = useAnimatedNumber(current.temp);

  return (
    <section aria-labelledby="kota-aktif" className={`animate-rise relative overflow-hidden rounded-2xl shadow-lg ${theme.panel}`}>
      <WeatherEffects icon={current.icon} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" aria-hidden />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm ${theme.body}`}>
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              🇮🇩 BMKG · {cityName}
            </p>
            <h2 id="kota-aktif" className={`mt-2 text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-4xl ${theme.heading}`}>
              {cityName} · <span className="font-semibold capitalize">{current.weatherDesc}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onRefresh}
              className="stateful min-h-11 rounded-full border border-white/60 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20 active:scale-95"
            >
              ⟳ Muat ulang
            </button>
          </div>
        </div>

        <div className={`mt-5 flex flex-wrap items-center gap-x-8 gap-y-5 ${theme.body}`}>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={current.weatherDesc}
              width={104}
              height={104}
              className="animate-float drop-shadow-xl"
            />
            <div>
              <p className={`text-7xl font-extrabold leading-none tracking-tighter drop-shadow-md sm:text-8xl ${theme.heading}`}>
                {formatTemp(temp, unit)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold sm:text-[13px]">
                <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                  {formatSpeed(current.windSpeed, unit)}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                  {current.humidity}% lembap
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <WindDial speed={current.windSpeed} deg={current.windDeg} unit={unit} />
          </div>
        </div>

        <div aria-hidden className={`mt-5 h-px w-full ${theme.line}`} />
        <p className={`mt-2 text-xs ${theme.body}`}>
          Diperbarui{" "}
          {updatedAt
            ? updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            : "baru saja"}{" "}
          · Analisis {new Date(current.analysisDate).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} ·{" "}
          {coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
