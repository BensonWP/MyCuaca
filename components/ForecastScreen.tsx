"use client";

import { useMemo, useState } from "react";
import { useWeather } from "@/app/weather-provider";
import DailySelector from "@/components/DailySelector";
import HourlyTimeline from "@/components/HourlyTimeline";
import WarningList from "@/components/WarningList";
import { ErrorBlock, Horizon, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";
import { aggregateDaily, formatDay, groupByDay, warningsForDay } from "@/lib/forecast";

export default function ForecastScreen() {
  const { city, matchedData, loading, error, offline, updatedAt, unit, refresh } = useWeather();
  const data = matchedData;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

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
    <div className="flex flex-col gap-6">
      {offline && <OfflineBanner updatedAt={updatedAt} />}
      {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Prakiraan untuk {data.current.name}</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Lima hari ke depan
        </h2>
        <Horizon />
        <p className="mt-2 max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
          Pilih satu hari untuk melihat rincian tiga jamannya. Data berasal dari prakiraan tiga jam OpenWeather yang dikelompokkan per tanggal.
        </p>
      </div>
      <DailySelector days={days} selectedKey={activeKey} onSelect={setSelectedKey} unit={unit} />
      <WarningList warnings={warnings} />
      <HourlyTimeline
        id={`linimasa-${activeKey}`}
        title={activeDay ? `Rincian ${formatDay(activeDay.date)}` : "Rincian hari"}
        items={activeItems}
        unit={unit}
      />
    </div>
  );
}
