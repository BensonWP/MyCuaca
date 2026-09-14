"use client";

import { useEffect, useRef, useState } from "react";
import type { CurrentWeather } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { clock } from "@/lib/format";
import { skyTheme } from "@/lib/sky";
import SunArc from "@/components/SunArc";
import WindDial from "@/components/WindDial";

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
    <section aria-labelledby="kota-aktif" className={`animate-rise overflow-hidden rounded-2xl ${theme.panel}`}>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`text-xs ${theme.body}`}>
              {current.sys.country} · {clock(current.dt)} waktu setempat
            </p>
            <h2 id="kota-aktif" className={`mt-0.5 text-2xl font-extrabold tracking-tight sm:text-3xl ${theme.heading}`}>
              {current.name} · <span className="font-semibold capitalize">{weather.description}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              className={`stateful min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold ${
                isFavorite
                  ? "border-white bg-white text-sky-900"
                  : "border-white/70 text-white hover:bg-white/15"
              }`}
            >
              {isFavorite ? "Favorit aktif" : "Jadikan favorit"}
            </button>
            <button
              onClick={onRefresh}
              className="stateful min-h-11 rounded-lg border border-white/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Muat ulang
            </button>
          </div>
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-x-8 gap-y-4 ${theme.body}`}>
          <div className="flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.description}
              width={88}
              height={88}
              className="animate-float"
            />
            <div>
              <p className={`text-6xl font-extrabold leading-none tracking-tight sm:text-7xl ${theme.heading}`}>
                {formatTemp(temp, unit)}
              </p>
              <p className="mt-1 text-xs sm:text-sm">
                Terasa {formatTemp(current.main.feels_like, unit)} · {formatSpeed(current.wind.speed, unit)}
              </p>
            </div>
          </div>
          <SunArc sunrise={current.sys.sunrise} sunset={current.sys.sunset} now={current.dt} />
          <WindDial speed={current.wind.speed} deg={current.wind.deg} unit={unit} />
        </div>

        <div aria-hidden className={`mt-4 h-px w-full ${theme.line}`} />
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
