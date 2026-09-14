export interface WeatherDesc {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: { lat: number; lon: number };
  weather: WeatherDesc[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  rain?: { "1h"?: number };
  snow?: { "1h"?: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
}

export interface ForecastItem {
  dt: number;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: WeatherDesc[];
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  pop: number;
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  dt_txt: string;
}

export interface ForecastResponse {
  city: { name: string; country: string; coord: { lat: number; lon: number } };
  list: ForecastItem[];
}

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

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as WeatherError | null;
    throw new OpenWeatherError(res.status, body?.message ?? `OpenWeather error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getCurrent(lat: number, lon: number, lang = "id") {
  return owFetch<CurrentWeather>("/data/2.5/weather", { lat, lon, lang, units: "metric" });
}

export function getForecast(lat: number, lon: number, lang = "id") {
  return owFetch<ForecastResponse>("/data/2.5/forecast", { lat, lon, lang, units: "metric" });
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
