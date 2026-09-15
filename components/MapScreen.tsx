"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useWeather } from "@/app/weather-provider";
import type { MapLayer } from "@/components/MapView";
import SectionIntro from "@/components/SectionIntro";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-[62dvh] min-h-96 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />,
});

export default function MapScreen() {
  const { city, matchedData } = useWeather();
  const data = matchedData;
  const [layer, setLayer] = useState<MapLayer>("clouds");

  if (!data || !city) return null;

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        eyebrow={`Konteks spasial untuk ${data.current.name}`}
        title="Peta cuaca"
      />
      <MapView
        lat={data.current.coord.lat}
        lon={data.current.coord.lon}
        cityName={data.current.name}
        temp={Math.round(data.current.main.temp)}
        feelsLike={Math.round(data.current.main.feels_like)}
        humidity={data.current.main.humidity}
        windSpeed={data.current.wind.speed}
        description={data.current.weather[0]?.description ?? "-"}
        icon={data.current.weather[0]?.icon ?? "01d"}
        layer={layer}
        onLayerChange={setLayer}
      />
    </div>
  );
}
