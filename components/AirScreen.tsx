"use client";

import { useWeather } from "@/app/weather-provider";
import AqiScale from "@/components/AqiScale";
import SectionIntro from "@/components/SectionIntro";

function aqiTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AirScreen() {
  const { matchedData } = useWeather();
  const data = matchedData;

  if (!data) return null;

  const entry = data.aqi.list[0];

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        eyebrow={`Udara di ${data.current.name}`}
        title="Kualitas udara"
        description={entry ? `Data polutan diukur pada ${aqiTime(entry.dt)}.` : undefined}
      />
      <AqiScale data={data.aqi} />
    </div>
  );
}
