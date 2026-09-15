import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearHistory,
  formatSpeed,
  formatTemp,
  getFavorites,
  getHistory,
  getSelected,
  getUnit,
  pushHistory,
  setSelected,
  setUnit,
  toggleFavorite,
  type FavCity,
} from "./storage";

function memoryStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() { return Object.keys(store).length; },
    clear: () => { store = {}; },
    getItem: (k: string) => store[k] ?? null,
    key: (i: number) => Object.keys(store)[i] ?? null,
    removeItem: (k: string) => { delete store[k]; },
    setItem: (k: string, v: string) => { store[k] = v; },
  };
}

beforeEach(() => {
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", memoryStorage());
});

const city = (n: number): FavCity => ({ name: `Kota${n}`, lat: n, lon: n + 0.5 });

describe("toggleFavorite", () => {
  it("tambah lalu hapus (toggle)", () => {
    expect(toggleFavorite(city(1))).toHaveLength(1);
    expect(toggleFavorite(city(1))).toHaveLength(0);
  });
  it("maksimal 8, yang terlama dibuang", () => {
    for (let i = 1; i <= 10; i++) toggleFavorite(city(i));
    const favs = getFavorites();
    expect(favs).toHaveLength(8);
    expect(favs.some((f) => f.name === "Kota1")).toBe(false);
    expect(favs.some((f) => f.name === "Kota10")).toBe(true);
  });
});

describe("pushHistory", () => {
  it("maksimal 10 dan terbaru di depan", () => {
    for (let i = 1; i <= 12; i++) pushHistory(city(i));
    const hist = getHistory();
    expect(hist).toHaveLength(10);
    expect(hist[0].name).toBe("Kota12");
  });
  it("duplikat nama+koordinat naik ke depan tanpa ganda", () => {
    pushHistory(city(1));
    pushHistory(city(2));
    // Koordinat sama → dedup (naik ke depan)
    pushHistory(city(1));
    const hist1 = getHistory();
    expect(hist1.filter((h) => h.name === "Kota1")).toHaveLength(1);
    expect(hist1[0].name).toBe("Kota1");
  });
  it("nama sama tapi koordinat berbeda → tidak dedup", () => {
    pushHistory(city(1));
    pushHistory({ ...city(1), lat: 99 });
    const hist = getHistory();
    expect(hist.filter((h) => h.name === "Kota1")).toHaveLength(2);
  });
  it("clearHistory mengosongkan", () => {
    pushHistory(city(1));
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});

describe("unit & selected", () => {
  it("default metric, bisa imperial", () => {
    expect(getUnit()).toBe("metric");
    setUnit("imperial");
    expect(getUnit()).toBe("imperial");
  });
  it("getSelected menolak data rusak", () => {
    localStorage.setItem("mycuaca.selected", "{rusak");
    expect(getSelected()).toBeNull();
    localStorage.setItem("mycuaca.selected", JSON.stringify({ name: "X" }));
    expect(getSelected()).toBeNull();
    setSelected(city(5));
    expect(getSelected()?.name).toBe("Kota5");
  });
});

describe("format", () => {
  it("formatTemp metric/imperial", () => {
    expect(formatTemp(30, "metric")).toBe("30°C");
    expect(formatTemp(0, "imperial")).toBe("32°F");
  });
  it("formatSpeed metric/imperial", () => {
    expect(formatSpeed(10, "metric")).toBe("36 km/j");
    expect(formatSpeed(10, "imperial")).toBe("22 mph");
  });
});
