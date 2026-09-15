"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useBmkg } from "@/app/bmkg-provider";
import type { MapLayer } from "@/components/MapView";
import SectionIntro from "@/components/SectionIntro";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-[62dvh] min-h-96 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />,
});

export default function MapScreen() {
  const { cityName, cityCoords, currentConditions } = useBmkg();
  const [layer, setLayer] = useState<MapLayer>("clouds");

  if (!currentConditions) return null;

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        eyebrow={`Konteks spasial untuk ${cityName}`}
        title="Peta cuaca"
      />
      <MapView
        lat={cityCoords.lat}
        lon={cityCoords.lon}
        cityName={cityName}
        temp={Math.round(currentConditions.temp)}
        feelsLike={Math.round(currentConditions.temp)}
        humidity={currentConditions.humidity}
        windSpeed={currentConditions.windSpeed}
        description={currentConditions.weatherDesc}
        icon={currentConditions.icon}
        layer={layer}
        onLayerChange={setLayer}
      />
    </div>
  );
}
