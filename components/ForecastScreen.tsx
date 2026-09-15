"use client";

import { useMemo, useRef, useState } from "react";
import { useBmkg } from "@/app/bmkg-provider";
import { useWeather } from "@/app/weather-provider";
import TempStripes from "@/components/TempStripes";
import TempCurve from "@/components/TempCurve";
import BmkgStrip from "@/components/BmkgStrip";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import SectionIntro from "@/components/SectionIntro";
import { aggregateDaily, formatDay, groupByDay, warningsForDay } from "@/lib/forecast";

export default function ForecastScreen() {
  const { cuaca, cityName, allSlots } = useBmkg();
  const { unit } = useWeather();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => groupByDay(allSlots), [allSlots]);
  const days = useMemo(() => aggregateDaily(allSlots), [allSlots]);

  function pickDay(key: string) {
    setSelectedKey(key);
    detailRef.current?.scrollIntoView({ block: "start" });
  }

  if (!cuaca || allSlots.length === 0) return null;

  const activeKey =
    selectedKey && days.some((day) => day.key === selectedKey)
      ? selectedKey
      : (days[0]?.key ?? "");
  const activeSlots = grouped.get(activeKey) ?? [];
  const warnings = warningsForDay(activeSlots).map((warning) => warning.text);
  const activeDay = days.find((day) => day.key === activeKey);

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow={`Prakiraan BMKG untuk ${cityName}`}
        title={days.length > 0 ? `${days.length} hari ke depan` : "Prakiraan"}
        description="Pilih satu hari untuk melihat rincian cuacanya."
      />

      <TempStripes days={days} selectedKey={activeKey} onSelect={pickDay} unit={unit} />
      <BmkgStrip />
      <WarningList warnings={warnings} />

      <div ref={detailRef} className="flex scroll-mt-24 flex-col gap-5">
        <TempCurve
          slots={activeSlots}
          unit={unit}
          title={activeDay ? `Kurva suhu ${formatDay(activeDay.date)}` : "Kurva suhu"}
        />
        <HourlyTimeline
          id={`linimasa-${activeKey}`}
          title={activeDay ? `Rincian ${formatDay(activeDay.date)}` : "Rincian hari"}
          slots={activeSlots}
          unit={unit}
        />
      </div>
    </div>
  );
}
