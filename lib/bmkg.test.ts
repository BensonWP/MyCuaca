import { describe, expect, it } from "vitest";
import {
  bmkgToIcon,
  bmkgWeatherLabel,
  isValidAdm4,
  parseCoords,
  warningsFromBmkg,
  waveCategory,
  type BmkgSlot,
} from "./bmkg";

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

describe("isValidAdm4", () => {
  it("menerima format Kemendagri", () => {
    expect(isValidAdm4("31.71.03.1001")).toBe(true);
  });
  it("menolak format salah", () => {
    expect(isValidAdm4("jakarta")).toBe(false);
    expect(isValidAdm4("31.71.03")).toBe(false);
    expect(isValidAdm4(" 31.71.03.1001 ")).toBe(true);
  });
});

describe("parseCoords", () => {
  it("memecah lat,lon gempa", () => {
    expect(parseCoords("-8.26,120.57")).toEqual({ lat: -8.26, lon: 120.57 });
  });
  it("mengembalikan null bila invalid", () => {
    expect(parseCoords("di mana")).toBeNull();
    expect(parseCoords("1,2,3")).toBeNull();
  });
});

describe("waveCategory", () => {
  it("batas kategori BMKG", () => {
    expect(waveCategory(0.2).label).toBe("Tenang");
    expect(waveCategory(1.5).label).toBe("Sedang");
    expect(waveCategory(3).label).toBe("Tinggi");
    expect(waveCategory(5).label).toBe("Sangat Tinggi");
    expect(waveCategory(7).label).toBe("Ekstrem");
  });
});

describe("bmkgWeatherLabel / bmkgToIcon", () => {
  it("kode umum", () => {
    expect(bmkgWeatherLabel(0)).toBe("Cerah");
    expect(bmkgWeatherLabel(61)).toBe("Hujan Sedang");
    expect(bmkgWeatherLabel(95)).toBe("Hujan Petir");
  });
  it("siang vs malam", () => {
    expect(bmkgToIcon(0, 12)).toBe("01d");
    expect(bmkgToIcon(0, 22)).toBe("01n");
    expect(bmkgToIcon(61, 12)).toBe("10d");
  });
});

describe("warningsFromBmkg", () => {
  it("data kosong → aman", () => {
    expect(warningsFromBmkg([])).toEqual([]);
  });
  it("hujan petir → siaga", () => {
    const w = warningsFromBmkg([[slot({ weather: 95 })]]);
    expect(w.some((x) => x.level === "siaga" && x.title.includes("petir"))).toBe(true);
  });
  it("hujan lebat 10mm → siaga", () => {
    const w = warningsFromBmkg([[slot({ tp: 12 })]]);
    expect(w.some((x) => x.level === "siaga")).toBe(true);
  });
  it("hujan ringan 3mm → waspada", () => {
    const w = warningsFromBmkg([[slot({ tp: 3 })]]);
    expect(w).toHaveLength(1);
    expect(w[0].level).toBe("waspada");
  });
  it("angin 45 km/jam → siaga", () => {
    const w = warningsFromBmkg([[slot({ ws: 45 })]]);
    expect(w.some((x) => x.title.includes("Angin"))).toBe(true);
  });
  it("kabut → waspada jarak pandang", () => {
    const w = warningsFromBmkg([[slot({ weather: 45, vs: 1000 })]]);
    expect(w.some((x) => x.title.includes("pandang"))).toBe(true);
  });
  it("cuaca tenang → tanpa peringatan", () => {
    expect(warningsFromBmkg([[slot()]])).toEqual([]);
  });
});
