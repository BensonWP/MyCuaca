// Hanya menyimpan geocode, AQI, dan tile URL dari OpenWeather.
// Cuaca utama sudah menggunakan BMKG.

export interface GeocodeResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface AirPollution {
  list: {
    main: { aqi: number };
    components: Record<string, number>;
    dt: number;
  }[];
}

export type WeatherError = { cod: number; message: string };

const BASE = "https://api.openweathermap.org";
const TILE_BASE = "https://tile.openweathermap.org";

export class OpenWeatherError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function owFetch<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new OpenWeatherError(500, "OPENWEATHER_API_KEY belum di-set");

  const url = new URL(path, BASE);
  url.searchParams.set("appid", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { next: { revalidate: 600 }, signal: ctrl.signal });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as WeatherError | null;
      throw new OpenWeatherError(res.status, body?.message ?? `OpenWeather error ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof OpenWeatherError) throw err;
    throw new OpenWeatherError(502, "Gagal menghubungi OpenWeather");
  } finally {
    clearTimeout(id);
  }
}

export function geocode(query: string) {
  return owFetch<GeocodeResult[]>("/geo/1.0/direct", { q: query, limit: 5, lang: "id" });
}

export function reverseGeocode(lat: number, lon: number) {
  return owFetch<GeocodeResult[]>("/geo/1.0/reverse", { lat, lon, limit: 1, lang: "id" });
}

export function getAirPollution(lat: number, lon: number) {
  return owFetch<AirPollution>("/data/2.5/air_pollution", { lat, lon });
}

export function tileUrl(layer: string, z: number, x: number, y: number) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new OpenWeatherError(500, "OPENWEATHER_API_KEY belum di-set");
  if (!/^(clouds|precipitation|temp|wind|pressure)$/.test(layer)) {
    throw new OpenWeatherError(400, "Layer tidak valid");
  }
  return new URL(`/map/${layer}/${z}/${x}/${y}.png`, TILE_BASE).href + `?appid=${key}`;
}
