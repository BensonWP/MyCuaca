"use client";

import { useState } from "react";
import { FavCity, Unit, formatTemp } from "@/lib/storage";
import { FavoriteWeather } from "@/app/weather-provider";

interface Props {
  active: FavCity | null;
  favorites: FavCity[];
  history: FavCity[];
  favoriteWeather: Record<string, FavoriteWeather>;
  unit: Unit;
  onSelect: (city: FavCity) => void;
  onRemoveFavorite: (city: FavCity) => void;
  onClearHistory: () => void;
  onUseLocation: () => void;
}

function CityRow({
  city,
  selected,
  weather,
  unit,
  onSelect,
  action,
}: {
  city: FavCity;
  selected: boolean;
  weather?: FavoriteWeather;
  unit?: Unit;
  onSelect: () => void;
  action?: React.ReactNode;
}) {
  return (
    <li className="stateful flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md sm:p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <button onClick={onSelect} className="stateful min-h-11 flex-1 rounded-xl text-left" aria-current={selected ? "true" : undefined}>
        <span className="flex flex-wrap items-center gap-2">
          <span className={`block text-base font-extrabold ${selected ? "text-sky-700 dark:text-sky-300" : "text-zinc-950 dark:text-white"}`}>
            {city.name}
          </span>
          {selected && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-extrabold text-sky-700 dark:bg-sky-900 dark:text-sky-300">
              Aktif
            </span>
          )}
        </span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
        </span>
      </button>
      {weather && unit && (
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800" aria-label={`Suhu saat ini ${formatTemp(weather.temp, unit)}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={32}
            height={32}
          />
          <span className="text-sm font-extrabold text-zinc-950 dark:text-white">
            {formatTemp(weather.temp, unit)}
          </span>
        </span>
      )}
      {action}
    </li>
  );
}

export default function CityManager({ active, favorites, history, favoriteWeather, unit, onSelect, onRemoveFavorite, onClearHistory, onUseLocation }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section aria-labelledby="kota-aktif-manager" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
        <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div aria-hidden className="absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-sky-300/30 blur-2xl" />
        <div aria-hidden className="wx-cloud wx-cloud-a" />
        <div className="relative">
        <h3 id="kota-aktif-manager" className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-sky-50 backdrop-blur-sm">
          📍 Kota aktif
        </h3>
        {active ? (
          <div className="mt-2">
            <p className="text-4xl font-extrabold tracking-tight drop-shadow-sm sm:text-5xl">{active.name}</p>
            <p className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur-sm">
              {active.lat.toFixed(4)}, {active.lon.toFixed(4)}
            </p>
            <div>
            <button
              onClick={onUseLocation}
              className="stateful mt-5 min-h-11 rounded-full bg-white px-5 py-2 text-sm font-extrabold text-sky-800 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              ◎ Gunakan lokasi saya
            </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-sky-100">Belum ada kota aktif. Cari kota melalui kolom pencarian di bagian atas.</p>
        )}
        </div>
      </section>

      <section aria-labelledby="kota-favorit" className="rounded-2xl bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
        <h3 id="kota-favorit" className="text-lg font-extrabold text-zinc-950 dark:text-white">
          ★ Kota favorit
        </h3>
        {favorites.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            {favorites.length} kota
          </span>
        )}
        </div>
        {favorites.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
            Belum ada favorit. Pilih Jadikan favorit pada kota yang sedang tampil di bagian ringkasan.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3">
            {favorites.map((city) => (
              <CityRow
                key={`${city.lat},${city.lon}`}
                city={city}
                selected={active?.lat === city.lat && active?.lon === city.lon}
                weather={favoriteWeather[`${city.lat},${city.lon}`]}
                unit={unit}
                onSelect={() => onSelect(city)}
                action={
                  <button
                    onClick={() => onRemoveFavorite(city)}
                    aria-label={`Hapus ${city.name} dari favorit`}
                    className="stateful min-h-11 rounded-full border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-500 hover:border-red-500 hover:bg-red-50 hover:text-red-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-red-950"
                  >
                    ✕
                  </button>
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="riwayat-kota" className="rounded-2xl bg-surface p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="riwayat-kota" className="text-lg font-extrabold text-zinc-950 dark:text-white">
            🕘 Riwayat pencarian
          </h3>
          {history.length > 0 && !confirmClear && (
            <button
              onClick={() => setConfirmClear(true)}
              className="min-h-11 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:border-red-700 hover:text-red-800 dark:border-zinc-700 dark:text-zinc-200"
            >
              Hapus riwayat
            </button>
          )}
          {confirmClear && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Konfirmasi hapus riwayat">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Hapus semua riwayat?</span>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="min-h-11 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
              >
                Ya, hapus
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="min-h-11 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
              >
                Batal
              </button>
            </div>
          )}
        </div>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
            Riwayat masih kosong. Cari kota melalui kolom pencarian di bagian atas.
          </p>
        ) : (
          <ul className="mt-2 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {history.map((city) => (
              <CityRow
                key={`${city.lat},${city.lon}-${city.name}`}
                city={city}
                selected={active?.lat === city.lat && active?.lon === city.lon}
                onSelect={() => onSelect(city)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
