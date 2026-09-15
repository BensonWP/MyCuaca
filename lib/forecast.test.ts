import { describe, expect, it } from "vitest";
import { aggregateDaily, groupByDay, warningsForDay } from "./forecast";
import type { BmkgSlot } from "./bmkg";

function slot(over: Partial<BmkgSlot> = {}): BmkgSlot {
  return {
    datetime: "2026-09-15T04:00:00Z",
    local_datetime: "2026-09-15 11:00:00",
    t: 30,
    hu: 60,
    weather: 1,
    weather_desc: "Cerah",
    weather_desc_en: "Sunny",
    wd_deg: 90,
    wd: "E",
    wd_to: "W",
    ws: 10,
    tcc: 20,
    tp: 0,
    vs: 10000,
    vs_text: "> 10 km",
    image: "",
    analysis_date: "2026-09-15T00:00:00",
    ...over,
  };
}

describe("groupByDay", () => {
  it("mengelompokkan per tanggal lokal dari local_datetime", () => {
    const slots = [
      slot({ local_datetime: "2026-09-15 11:00:00" }),
      slot({ local_datetime: "2026-09-15 14:00:00" }),
      slot({ local_datetime: "2026-09-16 11:00:00" }),
    ];
    const g = groupByDay(slots);
    expect(g.size).toBe(2);
    const keys = [...g.keys()];
    expect(g.get(keys[0])).toHaveLength(2);
  });
});

describe("aggregateDaily", () => {
  it("list kosong → kartu kosong (tidak Infinity)", () => {
    expect(aggregateDaily([])).toEqual([]);
  });

  it("menghitung min, maks, dan rain", () => {
    const slots = [
      slot({ local_datetime: "2026-09-15 11:00:00", t: 25, tp: 2 }),
      slot({ local_datetime: "2026-09-15 14:00:00", t: 31, tp: 0 }),
    ];
    const [card] = aggregateDaily(slots);
    expect(card.min).toBe(25);
    expect(card.max).toBe(31);
    expect(card.rain).toBe(2);
  });

  it("weather kosong → ikon fallback tanpa crash", () => {
    const slots = [slot({ local_datetime: "2026-09-15 12:00:00", weather: 0 })];
    const [card] = aggregateDaily(slots);
    expect(card.icon).toBeTruthy();
  });
});

describe("warningsForDay", () => {
  it("list kosong → tanpa peringatan", () => {
    expect(warningsForDay([])).toEqual([]);
  });

  it("hujan deras memicu peringatan", () => {
    const slots = [slot({ tp: 12 })];
    expect(warningsForDay(slots).some((w) => w.text.includes("12.0"))).toBe(true);
  });

  it("angin kencang memicu peringatan", () => {
    const slots = [slot({ ws: 30 })];
    expect(warningsForDay(slots).length).toBeGreaterThan(0);
  });

  it("cuaca tenang → tanpa peringatan", () => {
    expect(warningsForDay([slot()])).toEqual([]);
  });
});
