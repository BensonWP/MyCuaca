// Tipe + helper server-side untuk data terbuka BMKG.
// Cuaca: api.bmkg.go.id/publik/prakiraan-cuaca?adm4= (60 req/menit/IP, wajib atribusi).
// Gempa: data.bmkg.go.id/DataMKG/TEWS/{autogempa,gempaterkini,gempadirasakan}.json (publik, tanpa key).
// Maritim: maritim.bmkg.go.id/marine2026-data/{meta,pelabuhan,perairan}/... (publik).

export interface BmkgLokasi {
  adm1: string;
  adm2: string;
  adm3: string;
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
  timezone: string;
}

export interface BmkgSlot {
  datetime: string;
  local_datetime: string;
  t: number;
  hu: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  wd_deg: number;
  wd: string;
  wd_to: string;
  ws: number;
  tcc: number;
  tp: number;
  vs: number;
  vs_text: string;
  image: string;
  analysis_date: string;
}

export interface BmkgCuacaResponse {
  lokasi: BmkgLokasi;
  days: BmkgSlot[][];
}

// Normalisasi slot BMKG pertama jadi format hero (mirip CurrentWeather tapi dari BMKG).
export interface BmkgCurrentConditions {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  windDir: string;
  cloudCover: number;
  visibility: number;
  visibilityText: string;
  precipitation: number;
  weatherCode: number;
  weatherDesc: string;
  weatherDescEn: string;
  icon: string;
  image: string;
  analysisDate: string;
  localDatetime: string;
}

export function bmkgToCurrentConditions(slot: BmkgSlot, localHour: number): BmkgCurrentConditions {
  return {
    temp: slot.t,
    humidity: slot.hu,
    windSpeed: slot.ws,
    windDeg: slot.wd_deg,
    windDir: slot.wd,
    cloudCover: slot.tcc,
    visibility: slot.vs,
    visibilityText: slot.vs_text,
    precipitation: slot.tp,
    weatherCode: slot.weather,
    weatherDesc: slot.weather_desc,
    weatherDescEn: slot.weather_desc_en,
    icon: bmkgToIcon(slot.weather, localHour),
    image: slot.image,
    analysisDate: slot.analysis_date,
    localDatetime: slot.local_datetime,
  };
}

export interface BmkgGempa {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string;
}

export interface BmkgMaritimMeta {
  code: string;
  name: string;
  province: string;
  lon: number;
  lat: number;
}

export interface BmkgMaritimSlot {
  time: string;
  weather?: string;
  visibility?: number;
  temp_avg?: number;
  rh_avg?: number;
  wind_from?: string;
  wind_speed?: number;
  wind_gust?: number;
  wave_cat?: string;
  wave_height?: number;
  current_to?: string;
  current_speed?: number;
  tides?: number;
}

export interface BmkgMaritimForecast {
  code: string;
  name: string;
  issued: string;
  valid_from: string;
  valid_to: string;
  forecast_day1: BmkgMaritimSlot[];
  forecast_day2?: BmkgMaritimSlot[];
  forecast_day3?: BmkgMaritimSlot[];
  forecast_day4?: BmkgMaritimSlot[];
}

// Kode weather BMKG 0..100+ → label ringkas + perkiraan ikon OpenWeather untuk efek langit.
export function bmkgWeatherLabel(code: number): string {
  if (code <= 1) return "Cerah";
  if (code === 2) return "Cerah Berawan";
  if (code === 3) return "Berawan";
  if (code === 4) return "Berawan Tebal";
  if (code === 5) return "Udara Kabur";
  if (code === 10) return "Asap";
  if (code === 45) return "Berkabut";
  if (code === 60) return "Hujan Ringan";
  if (code === 61) return "Hujan Sedang";
  if (code === 63) return "Hujan Lebat";
  if (code === 65) return "Hujan Sangat Lebat";
  if (code === 80) return "Hujan Lokal";
  if (code === 95) return "Hujan Petir";
  if (code === 97) return "Hujan Petir & Lebat";
  return "Berawan";
}

export function bmkgToIcon(code: number, localHour: number): string {
  const night = localHour < 6 || localHour >= 18;
  const n = night ? "n" : "d";
  if (code <= 1) return `01${n}`;
  if (code === 2) return `02${n}`;
  if (code <= 4) return `04${n}`;
  if (code === 5 || code === 10 || code === 45) return `50${n}`;
  if (code >= 60 && code < 95) return `10${n}`;
  return `11${n}`;
}

export function waveCategory(height: number): { label: string; chip: string } {
  if (height < 0.5) return { label: "Tenang", chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" };
  if (height < 1.25) return { label: "Rendah", chip: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" };
  if (height < 2.5) return { label: "Sedang", chip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
  if (height < 4) return { label: "Tinggi", chip: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" };
  if (height < 6) return { label: "Sangat Tinggi", chip: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
  return { label: "Ekstrem", chip: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" };
}

export interface BmkgWarning {
  level: "aman" | "waspada" | "siaga";
  title: string;
  body: string;
}

// Aturan peringatan lokal dari slot BMKG (jujur dilabeli otomatis, bukan produk resmi MHEWS).
export function warningsFromBmkg(days: BmkgSlot[][]): BmkgWarning[] {
  const out: BmkgWarning[] = [];
  const all = days.flat();
  if (all.length === 0) return out;
  const maxTp = Math.max(...all.map((s) => s.tp));
  const maxWs = Math.max(...all.map((s) => s.ws));
  const heavy = all.filter((s) => s.tp >= 10);
  const storm = all.filter((s) => s.weather >= 95);
  const fog = all.filter((s) => s.weather === 45 || s.vs < 2000);

  if (storm.length > 0) {
    out.push({
      level: "siaga",
      title: "Potensi hujan petir",
      body: `${storm.length} slot prakiraan menunjukkan hujan petir. Hindari berteduh di bawah pohon dan tunda aktivitas luar.`,
    });
  } else if (maxTp >= 10) {
    out.push({
      level: "siaga",
      title: "Hujan lebat",
      body: `Curah hujan hingga ${maxTp.toFixed(1)} mm per 3 jam (${heavy.length} slot). Waspadai banjir dan jalan licin.`,
    });
  } else if (maxTp >= 2) {
    out.push({
      level: "waspada",
      title: "Hujan sedang",
      body: `Curah hujan hingga ${maxTp.toFixed(1)} mm per 3 jam. Siapkan payung atau jas hujan.`,
    });
  }
  if (maxWs >= 40) {
    out.push({
      level: "siaga",
      title: "Angin kencang",
      body: `Kecepatan angin hingga ${maxWs.toFixed(0)} km/jam. Amankan jemuran dan benda ringan di luar.`,
    });
  } else if (maxWs >= 25) {
    out.push({
      level: "waspada",
      title: "Angin cukup kencang",
      body: `Kecepatan angin hingga ${maxWs.toFixed(0)} km/jam. Hati-hati saat berkendara.`,
    });
  }
  if (fog.length > 0) {
    out.push({
      level: "waspada",
      title: "Jarak pandang pendek",
      body: `${fog.length} slot berkabut. Nyalakan lampu dan jaga jarak aman berkendara.`,
    });
  }
  return out;
}

const CUACA_BASE = "https://api.bmkg.go.id/publik/prakiraan-cuaca";
const GEMPA_BASE = "https://data.bmkg.go.id/DataMKG/TEWS";
const MARITIM_BASE = "https://maritim.bmkg.go.id/marine2026-data";

export class BmkgError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchJson(url: string, timeoutMs = 15000): Promise<unknown> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "MyCuaca/1.0 (kontak: aplikasi non-resmi, sumber BMKG)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new BmkgError(res.status, `BMKG ${res.status}`);
    const text = await res.text();
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new BmkgError(502, "Respons BMKG bukan JSON (kode wilayah mungkin salah)");
    }
  } catch (err) {
    if (err instanceof BmkgError) throw err;
    throw new BmkgError(502, "Gagal menghubungi BMKG");
  } finally {
    clearTimeout(id);
  }
}

export function isValidAdm4(adm4: string): boolean {
  return /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4.trim());
}

export async function getBmkgCuaca(adm4: string): Promise<BmkgCuacaResponse> {
  const code = adm4.trim();
  if (!isValidAdm4(code)) throw new BmkgError(400, "Kode adm4 tidak valid (format: 31.71.03.1001)");
  const raw = (await fetchJson(`${CUACA_BASE}?adm4=${encodeURIComponent(code)}`)) as {
    lokasi: BmkgLokasi;
    data: { lokasi: BmkgLokasi; cuaca: BmkgSlot[][] }[];
  };
  if (!raw?.lokasi || !Array.isArray(raw?.data)) throw new BmkgError(502, "Format data BMKG tak dikenal");
  return { lokasi: raw.lokasi, days: raw.data[0]?.cuaca ?? [] };
}

export async function getGempa(kind: "realtime" | "terkini" | "dirasakan"): Promise<BmkgGempa[]> {
  const file = kind === "realtime" ? "autogempa.json" : kind === "terkini" ? "gempaterkini.json" : "gempadirasakan.json";
  const raw = (await fetchJson(`${GEMPA_BASE}/${file}`)) as { Infogempa: { gempa: BmkgGempa | BmkgGempa[] } };
  const g = raw?.Infogempa?.gempa;
  if (!g) throw new BmkgError(502, "Format data gempa tak dikenal");
  return Array.isArray(g) ? g : [g];
}

export async function getMaritimMeta(kind: "pelabuhan" | "perairan"): Promise<BmkgMaritimMeta[]> {
  const raw = (await fetchJson(`${MARITIM_BASE}/meta/${kind}.json`)) as {
    features: { properties: { code: string; name: string; province: string }; geometry: { coordinates: [number, number] } }[];
  };
  if (!Array.isArray(raw?.features)) throw new BmkgError(502, "Format meta maritim tak dikenal");
  return raw.features.map((f) => ({
    code: f.properties.code,
    name: f.properties.name,
    province: f.properties.province,
    lon: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }));
}

export async function getMaritimForecast(kind: "pelabuhan" | "perairan", code: string): Promise<BmkgMaritimForecast> {
  const clean = code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{2,12}$/.test(clean)) throw new BmkgError(400, "Kode maritim tidak valid");
  const raw = (await fetchJson(`${MARITIM_BASE}/${kind}/${encodeURIComponent(clean)}.json`)) as BmkgMaritimForecast;
  if (!raw?.forecast_day1) throw new BmkgError(502, "Format prakiraan maritim tak dikenal");
  return raw;
}

export function shakemapUrl(file: string): string {
  return `https://data.bmkg.go.id/DataMKG/TEWS/${file}`;
}

export function parseCoords(coords: string): { lat: number; lon: number } | null {
  const parts = coords.split(",").map((p) => Number(p.trim()));
  if (parts.length !== 2 || parts.some((n) => !Number.isFinite(n))) return null;
  return { lat: parts[0], lon: parts[1] };
}
