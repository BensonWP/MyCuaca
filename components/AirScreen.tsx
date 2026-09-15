"use client";

import { useWeather } from "@/app/weather-provider";
import { useBmkg } from "@/app/bmkg-provider";
import AqiScale from "@/components/AqiScale";
import SectionIntro from "@/components/SectionIntro";
import { EmptyBlock } from "@/components/Status";

function aqiTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AirScreen() {
  const { aqi, loadAqi } = useWeather();
  const { cityName, cityCoords } = useBmkg();

  if (!aqi) {
    return (
      <div className="flex flex-col gap-6">
        <SectionIntro eyebrow={`Udara di ${cityName}`} title="Kualitas udara" />
        <EmptyBlock title="Data udara kosong" message="Muat ulang atau coba lagi nanti." />
      </div>
    );
  }

  const entry = aqi.list?.[0];
  if (!entry) {
    return (
      <div className="flex flex-col gap-6">
        <SectionIntro eyebrow={`Udara di ${cityName}`} title="Kualitas udara" />
        <EmptyBlock title="Data udara kosong" message="API mengembalikan daftar polutan kosong. Coba muat ulang." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        eyebrow={`Udara di ${cityName}`}
        title="Kualitas udara"
        description={`Data polutan diukur pada ${aqiTime(entry.dt)}.`}
      />
      <AqiScale data={aqi} />
    </div>
  );
}
