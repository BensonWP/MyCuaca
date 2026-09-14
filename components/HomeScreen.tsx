"use client";

import Link from "next/link";
import { useWeather } from "@/app/weather-provider";
import SkyHero from "@/components/SkyHero";
import KeyFacts from "@/components/KeyFacts";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import { EmptyBlock, ErrorBlock, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";
import { warningsForDay } from "@/lib/forecast";

export default function HomeScreen() {
  const { city, matchedData, loading, error, offline, updatedAt, unit, favorites, selectCity, refresh, toggleFavoriteCity } =
    useWeather();
  const data = matchedData;

  if (loading && !data) return <LoadingBlock label="Memuat cuaca" />;
  if ((error && !data) || (!loading && !data)) {
    return <ErrorBlock message={error ?? "Data belum tersedia."} onRetry={refresh} />;
  }
  if (!data || !city) return <LoadingBlock label="Memuat cuaca" />;

  const isFavorite = favorites.some((fav) => fav.lat === city.lat && fav.lon === city.lon);
  const preview = data.forecast.list.slice(0, 4);
  const warnings = warningsForDay(data.forecast.list.slice(0, 8)).map((warning) => warning.text);
  const shortcuts = favorites.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      {offline && <OfflineBanner updatedAt={updatedAt} />}
      {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}
      <SkyHero
        current={data.current}
        unit={unit}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavoriteCity({ ...city, name: data.current.name })}
        updatedAt={updatedAt}
        onRefresh={refresh}
      />
      <WarningList warnings={warnings} />
      <KeyFacts current={data.current} unit={unit} />
      <HourlyTimeline id="cuaca-beberapa-jam" title="Beberapa jam ke depan" items={preview} unit={unit} />

      <section aria-labelledby="kota-cepat" className="rounded-2xl bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="kota-cepat" className="text-lg font-bold text-zinc-950 dark:text-white">
            Kota yang sering dibuka
          </h3>
          <Link href="/kota" className="min-h-11 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:border-sky-700 hover:text-sky-800 dark:border-zinc-700 dark:hover:text-sky-300">
            Kelola semua kota
          </Link>
        </div>
        {shortcuts.length === 0 ? (
          <EmptyBlock
            title="Belum ada kota favorit"
            message="Jadikan kota yang sedang tampil sebagai favorit agar bisa dibuka cepat dari halaman ini."
          />
        ) : (
          <ul className="mt-2">
            {shortcuts.map((item) => (
              <li key={`${item.lat},${item.lon}`} className="flex items-center justify-between gap-3 border-b border-zinc-300 py-3 last:border-b-0 dark:border-zinc-700">
                <span className="text-base font-bold text-zinc-950 dark:text-white">{item.name}</span>
                <button
                  onClick={() => selectCity(item)}
                  className="stateful min-h-11 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
                >
                  Buka
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label="Lanjutan" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { href: "/prakiraan", label: "Lihat prakiraan 5 hari" },
          { href: "/peta", label: "Buka peta cuaca" },
          { href: "/udara", label: "Periksa kualitas udara" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="min-h-11 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-bold hover:border-sky-700 hover:text-sky-800 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:text-sky-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
