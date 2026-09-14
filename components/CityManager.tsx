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
    <li className="flex items-center justify-between gap-3 border-b border-zinc-300 py-3 last:border-b-0 dark:border-zinc-700">
      <button onClick={onSelect} className="stateful min-h-11 flex-1 rounded-lg text-left" aria-current={selected ? "true" : undefined}>
        <span className={`block text-base font-bold ${selected ? "text-sky-800 dark:text-sky-300" : "text-zinc-950 dark:text-white"}`}>
          {city.name}
          {selected ? " (aktif)" : ""}
        </span>
        <span className="block text-sm text-zinc-700 dark:text-zinc-300">
          {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
        </span>
      </button>
      {weather && unit && (
        <span className="flex shrink-0 items-center gap-2" aria-label={`Suhu saat ini ${formatTemp(weather.temp, unit)}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={40}
            height={40}
          />
          <span className="text-lg font-bold text-zinc-950 dark:text-white">
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
      <section aria-labelledby="kota-aktif" className="rounded-2xl bg-sky-700 p-6 text-white sm:p-8">
        <h3 id="kota-aktif" className="text-sm font-semibold text-sky-100">
          Kota aktif
        </h3>
        {active ? (
          <div className="mt-2">
            <p className="text-4xl font-extrabold tracking-tight">{active.name}</p>
            <p className="mt-2 text-sm text-sky-100">
              {active.lat.toFixed(4)}, {active.lon.toFixed(4)}
            </p>
            <button
              onClick={onUseLocation}
              className="stateful mt-5 min-h-11 rounded-lg border border-white px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-sky-900"
            >
              Gunakan lokasi saya
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-sky-100">Belum ada kota aktif. Cari kota melalui kolom pencarian di bagian atas.</p>
        )}
      </section>

      <section aria-labelledby="kota-favorit" className="rounded-2xl bg-surface p-5 sm:p-6">
        <h3 id="kota-favorit" className="text-lg font-bold text-zinc-950 dark:text-white">
          Kota favorit
        </h3>
        {favorites.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
            Belum ada favorit. Buka halaman ringkasan lalu pilih Jadikan favorit pada kota yang sedang tampil.
          </p>
        ) : (
          <ul className="mt-2">
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
                    className="min-h-11 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 hover:border-red-700 hover:text-red-800 dark:border-zinc-700 dark:text-zinc-200"
                  >
                    Hapus
                  </button>
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="riwayat-kota" className="rounded-2xl bg-surface p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="riwayat-kota" className="text-lg font-bold text-zinc-950 dark:text-white">
            Riwayat pencarian
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
