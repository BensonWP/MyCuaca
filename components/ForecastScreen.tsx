"use client";

import { useMemo, useRef, useState } from "react";
import { useWeather } from "@/app/weather-provider";
import TempStripes from "@/components/TempStripes";
import TempCurve from "@/components/TempCurve";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import SectionIntro from "@/components/SectionIntro";
import { aggregateDaily, formatDay, groupByDay, warningsForDay } from "@/lib/forecast";

export default function ForecastScreen() {
  const { city, matchedData, unit } = useWeather();
  const data = matchedData;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  function pickDay(key: string) {
    setSelectedKey(key);
    detailRef.current?.scrollIntoView({ block: "start" });
  }

  const days = useMemo(
    () => (data ? aggregateDaily(data.forecast.list) : []),
    [data]
  );

  if (!data || !city) return null;

  const activeKey =
    selectedKey && days.some((day) => day.key === selectedKey)
      ? selectedKey
      : (days[0]?.key ?? "");
  const activeItems = groupByDay(data.forecast.list).get(activeKey) ?? [];
  const warnings = warningsForDay(activeItems).map((warning) => warning.text);
  const activeDay = days.find((day) => day.key === activeKey);

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow={`Prakiraan untuk ${data.current.name}`}
        title={days.length > 0 ? `${days.length} hari ke depan` : "Prakiraan"}
        description="Pilih satu hari untuk melihat rincian cuacanya."
      />

      <TempStripes days={days} selectedKey={activeKey} onSelect={pickDay} unit={unit} />
      <WarningList warnings={warnings} />

      <div ref={detailRef} className="flex scroll-mt-24 flex-col gap-5">
        <TempCurve
          items={activeItems}
          unit={unit}
          title={activeDay ? `Kurva suhu ${formatDay(activeDay.date)}` : "Kurva suhu"}
        />
        <HourlyTimeline
          id={`linimasa-${activeKey}`}
          title={activeDay ? `Rincian ${formatDay(activeDay.date)}` : "Rincian hari"}
          items={activeItems}
          unit={unit}
        />
      </div>
    </div>
  );
}
