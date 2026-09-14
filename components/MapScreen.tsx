"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useWeather } from "@/app/weather-provider";
import { useTheme } from "@/app/theme-provider";
import type { MapLayer } from "@/components/MapView";
import { ErrorBlock, Horizon, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-[62dvh] min-h-96 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />,
});

export default function MapScreen() {
  const { city, matchedData, loading, error, offline, updatedAt, refresh } = useWeather();
  const { resolved } = useTheme();
  const data = matchedData;
  const [layer, setLayer] = useState<MapLayer>("clouds");

  if (loading && !data) return <LoadingBlock label="Memuat peta" />;
  if ((error && !data) || !data || !city) {
    return <ErrorBlock message={error ?? "Peta belum tersedia."} onRetry={refresh} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {offline && <OfflineBanner updatedAt={updatedAt} />}
      {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Konteks spasial untuk {data.current.name}</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Peta cuaca
        </h2>
        <Horizon />
      </div>
      <MapView
        lat={data.current.coord.lat}
        lon={data.current.coord.lon}
        cityName={data.current.name}
        layer={layer}
        onLayerChange={setLayer}
        dark={resolved === "gelap"}
      />
    </div>
  );
}
