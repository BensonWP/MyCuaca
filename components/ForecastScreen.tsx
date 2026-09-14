"use client";

import { useMemo, useRef, useState } from "react";
import { useWeather } from "@/app/weather-provider";
import TempStripes from "@/components/TempStripes";
import TempCurve from "@/components/TempCurve";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import { ErrorBlock, Horizon, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";
import { aggregateDaily, formatDay, groupByDay, warningsForDay } from "@/lib/forecast";

export default function ForecastScreen() {
  const { city, matchedData, loading, error, offline, updatedAt, unit, refresh } = useWeather();
  const data = matchedData;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  function pickDay(key: string) {
    setSelectedKey(key);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 0);
  }

  const days = useMemo(
    () => (data ? aggregateDaily(data.forecast.list) : []),
    [data]
  );

  if (loading && !data) return <LoadingBlock label="Memuat prakiraan" />;
  if ((error && !data) || !data || !city) {
    return <ErrorBlock message={error ?? "Prakiraan belum tersedia."} onRetry={refresh} />;
  }

  const activeKey =
    selectedKey && days.some((day) => day.key === selectedKey)
      ? selectedKey
      : (days[0]?.key ?? "");
  const activeItems = groupByDay(data.forecast.list).get(activeKey) ?? [];
  const warnings = warningsForDay(activeItems).map((warning) => warning.text);
  const activeDay = days.find((day) => day.key === activeKey);

  return (
    <div className="flex flex-col gap-5">
      {offline && <OfflineBanner updatedAt={updatedAt} />}
      {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}

      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Prakiraan untuk {data.current.name}</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          {days.length > 0 ? `${days.length} hari ke depan` : "Prakiraan"}
        </h2>
        <Horizon />
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          Pilih satu hari untuk melihat rincian cuacanya.
        </p>
      </div>

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
