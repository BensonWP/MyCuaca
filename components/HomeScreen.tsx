"use client";

import { useWeather } from "@/app/weather-provider";
import SkyHero from "@/components/SkyHero";
import AdviceBanner from "@/components/AdviceBanner";
import KeyFacts from "@/components/KeyFacts";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import { EmptyBlock } from "@/components/Status";
import { warningsForDay } from "@/lib/forecast";

const SHORTCUTS = [
  { id: "prakiraan", label: "Lihat prakiraan 5 hari", sub: "Strip + kurva suhu", card: "from-sky-500 to-blue-700", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id: "peta", label: "Buka peta cuaca", sub: "Awan · hujan · angin", card: "from-emerald-500 to-teal-700", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg> },
  { id: "udara", label: "Periksa kualitas udara", sub: "AQI + polutan", card: "from-amber-500 to-rose-600", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> },
];

export default function HomeScreen() {
  const { city, matchedData, updatedAt, unit, favorites, selectCity, refresh, toggleFavoriteCity } =
    useWeather();
  const data = matchedData;

  if (!data || !city) return null;

  const isFavorite = favorites.some((fav) => fav.lat === city.lat && fav.lon === city.lon);
  const preview = data.forecast.list.slice(0, 8);
  const warnings = warningsForDay(data.forecast.list.slice(0, 8)).map((warning) => warning.text);
  const shortcuts = favorites.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <SkyHero
        current={data.current}
        unit={unit}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavoriteCity({ ...city, name: data.current.name })}
        updatedAt={updatedAt}
        onRefresh={refresh}
      />
      <AdviceBanner current={data.current} upcoming={preview} aqi={data.aqi} unit={unit} />
      <WarningList warnings={warnings} />
      <KeyFacts current={data.current} unit={unit} />
      <HourlyTimeline id="cuaca-beberapa-jam" title="Beberapa jam ke depan" items={preview} unit={unit} />

      <section aria-labelledby="kota-cepat" className="rounded-2xl bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Akses cepat
            </p>
            <h3 id="kota-cepat" className="mt-1 text-lg font-extrabold text-zinc-950 sm:text-xl dark:text-white">
              Kota yang sering dibuka
            </h3>
          </div>
          <a
            href="#kota"
            className="stateful flex min-h-11 items-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-sky-300"
          >
            Kelola semua kota →
          </a>
        </div>
        {shortcuts.length === 0 ? (
          <EmptyBlock
            title="Belum ada kota favorit"
            message="Jadikan kota yang sedang tampil sebagai favorit agar bisa dibuka cepat dari halaman ini."
          />
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shortcuts.map((item) => (
              <li key={`${item.lat},${item.lon}`} className="stateful flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                <span>
                  <span className="block text-base font-extrabold text-zinc-950 dark:text-white">{item.name}</span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">{item.lat.toFixed(2)}, {item.lon.toFixed(2)}</span>
                </span>
                <button
                  onClick={() => selectCity(item)}
                  className="stateful min-h-11 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Buka
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label="Lompat ke bagian lain" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SHORTCUTS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`stateful group flex min-h-11 items-center gap-3 rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg ${item.card}`}
          >
            <span aria-hidden className="rounded-xl bg-white/20 p-2.5 transition-transform group-hover:scale-110 [&>svg]:h-5 [&>svg]:w-5">
              {item.icon}
            </span>
            <span>
              <span className="block text-sm font-extrabold">{item.label}</span>
              <span className="block text-xs text-white/80">{item.sub}</span>
            </span>
            <span aria-hidden className="ml-auto text-lg transition-transform group-hover:translate-x-1">→</span>
          </a>
        ))}
      </nav>
    </div>
  );
}