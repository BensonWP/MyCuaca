"use client";

import { useEffect, useRef, useState } from "react";
import type { CurrentWeather } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { clock } from "@/lib/format";
import { skyTheme } from "@/lib/sky";
import SunArc from "@/components/SunArc";
import WindDial from "@/components/WindDial";
import WeatherEffects from "@/components/WeatherEffects";

interface Props {
  current: CurrentWeather;
  unit: Unit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  updatedAt: Date | null;
  onRefresh: () => void;
}

// Angka suhu bergerak menuju nilai baru saat kota berganti.
// Mati total saat pengguna meminta reduced motion.
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

export default function SkyHero({ current, unit, isFavorite, onToggleFavorite, updatedAt, onRefresh }: Props) {
  const weather = current.weather[0];
  const theme = skyTheme(weather.icon);
  const temp = useAnimatedNumber(current.main.temp);

  return (
    <section aria-labelledby="kota-aktif" className={`animate-rise relative overflow-hidden rounded-2xl shadow-lg ${theme.panel}`}>
      <WeatherEffects icon={weather.icon} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" aria-hidden />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm ${theme.body}`}>
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              {current.sys.country} · {clock(current.dt)} waktu setempat
            </p>
            <h2 id="kota-aktif" className={`mt-2 text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-4xl ${theme.heading}`}>
              {current.name} · <span className="font-semibold capitalize">{weather.description}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              className={`stateful min-h-11 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-transform hover:scale-105 active:scale-95 ${
                isFavorite
                  ? "bg-amber-300 text-amber-950"
                  : "border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              }`}
            >
              {isFavorite ? "★ Favorit" : "☆ Favorit"}
            </button>
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
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.description}
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
                  Terasa {formatTemp(current.main.feels_like, unit)}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                  {formatSpeed(current.wind.speed, unit)}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                  {current.main.humidity}% lembap
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <SunArc sunrise={current.sys.sunrise} sunset={current.sys.sunset} now={current.dt} />
          </div>
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <WindDial speed={current.wind.speed} deg={current.wind.deg} unit={unit} />
          </div>
        </div>

        <div aria-hidden className={`mt-5 h-px w-full ${theme.line}`} />
        <p className={`mt-2 text-xs ${theme.body}`}>
          Diperbarui{" "}
          {updatedAt
            ? updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            : "baru saja"}{" "}
          · Matahari {clock(current.sys.sunrise)}–{clock(current.sys.sunset)} ·{" "}
          {current.coord.lat.toFixed(2)}, {current.coord.lon.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
