"use client";

import type { CurrentWeather } from "@/lib/openweather";
import { Unit, formatSpeed, formatTemp } from "@/lib/storage";
import { skyTheme } from "@/lib/sky";

interface Props {
  current: CurrentWeather;
  unit: Unit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  updatedAt: Date | null;
  onRefresh: () => void;
}

function clock(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SkyHero({ current, unit, isFavorite, onToggleFavorite, updatedAt, onRefresh }: Props) {
  const weather = current.weather[0];
  const theme = skyTheme(weather.icon);

  return (
    <section aria-labelledby="kota-aktif" className={`overflow-hidden rounded-2xl ${theme.panel}`}>
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`text-sm ${theme.body}`}>
              {current.sys.country} · {clock(current.dt)} waktu setempat
            </p>
            <h2 id="kota-aktif" className={`mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl ${theme.heading}`}>
              {current.name}
            </h2>
            <p className={`mt-1 text-base capitalize ${theme.body}`}>{weather.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold ${
                isFavorite
                  ? "border-white bg-white text-sky-900"
                  : "border-white/70 text-white hover:bg-white/15"
              }`}
            >
              {isFavorite ? "Favorit aktif" : "Jadikan favorit"}
            </button>
            <button
              onClick={onRefresh}
              className="min-h-11 rounded-lg border border-white/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Muat ulang
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            width={120}
            height={120}
          />
          <div>
            <p className={`text-7xl font-extrabold leading-none tracking-tight sm:text-8xl ${theme.heading}`}>
              {formatTemp(current.main.temp, unit)}
            </p>
            <p className={`mt-2 text-sm ${theme.body}`}>
              Terasa seperti {formatTemp(current.main.feels_like, unit)} · Angin{" "}
              {formatSpeed(current.wind.speed, unit)}
            </p>
          </div>
        </div>

        <div aria-hidden className={`mt-8 h-px w-full ${theme.line}`} />
        <div className={`mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm ${theme.body}`}>
          <span>
            Diperbarui{" "}
            {updatedAt
              ? updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
              : "baru saja"}
          </span>
          <span>
            Matahari terbit {clock(current.sys.sunrise)} · terbenam {clock(current.sys.sunset)}
          </span>
          <span>
            Koordinat {current.coord.lat.toFixed(2)}, {current.coord.lon.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}
