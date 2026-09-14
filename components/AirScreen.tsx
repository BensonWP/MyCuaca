"use client";

import { useWeather } from "@/app/weather-provider";
import AqiScale from "@/components/AqiScale";
import { ErrorBlock, Horizon, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";

function aqiTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AirScreen() {
  const { matchedData, loading, error, offline, updatedAt, refresh } = useWeather();
  const data = matchedData;

  if (loading && !data) return <LoadingBlock label="Memuat kualitas udara" />;
  if ((error && !data) || !data) {
    return <ErrorBlock message={error ?? "Data udara belum tersedia."} onRetry={refresh} />;
  }

  const entry = data.aqi.list[0];

  return (
    <div className="flex flex-col gap-6">
      {offline && <OfflineBanner updatedAt={updatedAt} />}
      {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Udara di {data.current.name}</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Kualitas udara
        </h2>
        <Horizon />
        {entry && (
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            Data polutan diukur pada {aqiTime(entry.dt)}.
          </p>
        )}
      </div>
      <AqiScale data={data.aqi} />
    </div>
  );
}
