import type { ForecastItem } from "@/lib/openweather";

export interface DailyCard {
  key: string;
  date: Date;
  icon: string;
  description: string;
  min: number;
  max: number;
  pop: number;
  wind: number;
  gust: number;
  rain: number;
}

export function groupByDay(items: ForecastItem[]): Map<string, ForecastItem[]> {
  const byDate = new Map<string, ForecastItem[]>();
  for (const item of items) {
    const key = item.dt_txt.slice(0, 10);
    byDate.set(key, [...(byDate.get(key) ?? []), item]);
  }
  return byDate;
}

export function aggregateDaily(items: ForecastItem[]): DailyCard[] {
  const cards: DailyCard[] = [];
  for (const [key, list] of groupByDay(items)) {
    const noon =
      list.find((item) => new Date(item.dt * 1000).getHours() >= 12) ??
      list[Math.floor(list.length / 2)];
    const temps = list.map((item) => item.main.temp);
    cards.push({
      key,
      date: new Date(`${key}T12:00:00`),
      icon: noon.weather[0].icon,
      description: noon.weather[0].description,
      min: Math.min(...temps),
      max: Math.max(...temps),
      pop: Math.max(...list.map((item) => item.pop)),
      wind: Math.max(...list.map((item) => item.wind.speed)),
      gust: Math.max(...list.map((item) => item.wind.gust ?? item.wind.speed)),
      rain: Math.max(...list.map((item) => item.rain?.["3h"] ?? 0)),
    });
  }
  return cards;
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
}

export function formatHour(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Ambang peringatan ditulis eksplisit agar tidak menjadi angka misterius di UI.
export const HEAVY_RAIN_3H_MM = 10;
export const STRONG_WIND_MS = 10.8;
export const STRONG_GUST_MS = 13.9;

export interface DayWarning {
  text: string;
}

export function warningsForDay(items: ForecastItem[]): DayWarning[] {
  const warnings: DayWarning[] = [];
  const maxRain = Math.max(...items.map((item) => item.rain?.["3h"] ?? 0));
  const maxWind = Math.max(...items.map((item) => item.wind.speed));
  const maxGust = Math.max(...items.map((item) => item.wind.gust ?? item.wind.speed));
  if (maxRain >= HEAVY_RAIN_3H_MM) {
    warnings.push({ text: `Hujan dapat mencapai ${maxRain.toFixed(1)} mm dalam 3 jam.` });
  }
  if (maxWind >= STRONG_WIND_MS || maxGust >= STRONG_GUST_MS) {
    warnings.push({
      text: `Angin maksimum ${maxWind.toFixed(1)} m/s dengan hembusan ${maxGust.toFixed(1)} m/s.`,
    });
  }
  return warnings;
}
