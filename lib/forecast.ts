import type { BmkgSlot } from "@/lib/bmkg";
import { bmkgToIcon } from "@/lib/bmkg";

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

function slotDateKey(slot: BmkgSlot): string {
  const d = new Date(slot.local_datetime.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function slotHour(slot: BmkgSlot): number {
  const d = new Date(slot.local_datetime.replace(" ", "T"));
  return isNaN(d.getTime()) ? 12 : d.getHours();
}

export function groupByDay(slots: BmkgSlot[]): Map<string, BmkgSlot[]> {
  const byDate = new Map<string, BmkgSlot[]>();
  for (const slot of slots) {
    const key = slotDateKey(slot);
    if (!key) continue;
    byDate.set(key, [...(byDate.get(key) ?? []), slot]);
  }
  return byDate;
}

export function aggregateDaily(slots: BmkgSlot[]): DailyCard[] {
  const cards: DailyCard[] = [];
  for (const [key, list] of groupByDay(slots)) {
    if (list.length === 0) continue;
    const mid = list[Math.floor(list.length / 2)];
    if (!mid) continue;
    const h = slotHour(mid);
    const temps = list.map((s) => s.t);
    cards.push({
      key,
      date: new Date(`${key}T12:00:00`),
      icon: bmkgToIcon(mid.weather, h),
      description: mid.weather_desc,
      min: Math.min(...temps),
      max: Math.max(...temps),
      pop: Math.max(...list.map((s) => s.tp > 0 ? 1 : 0)),
      wind: Math.max(...list.map((s) => s.ws)),
      gust: Math.max(...list.map((s) => s.ws)),
      rain: Math.max(...list.map((s) => s.tp)),
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

// Ambang peringatan ditulis eksplisit agar tidak menjadi angka misterius di UI.
export const HEAVY_RAIN_3H_MM = 10;
export const STRONG_WIND_KMH = 25;

export interface DayWarning {
  text: string;
}

export function warningsForDay(slots: BmkgSlot[]): DayWarning[] {
  const warnings: DayWarning[] = [];
  if (slots.length === 0) return warnings;
  const maxRain = Math.max(...slots.map((s) => s.tp));
  const maxWind = Math.max(...slots.map((s) => s.ws));
  if (maxRain >= HEAVY_RAIN_3H_MM) {
    warnings.push({ text: `Hujan dapat mencapai ${maxRain.toFixed(1)} mm dalam 3 jam.` });
  }
  if (maxWind >= STRONG_WIND_KMH) {
    warnings.push({
      text: `Angin maksimum ${maxWind.toFixed(0)} km/jam.`,
    });
  }
  return warnings;
}
