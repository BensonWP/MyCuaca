export interface FavCity {
  name: string;
  lat: number;
  lon: number;
}

const FAV_KEY = "mycuaca.favorites";
const HIST_KEY = "mycuaca.history";
const UNIT_KEY = "mycuaca.unit";
const SELECTED_KEY = "mycuaca.selected";

export function getFavorites(): FavCity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]") as FavCity[];
  } catch {
    return [];
  }
}

export function toggleFavorite(city: FavCity): FavCity[] {
  const favs = getFavorites();
  const exists = favs.some((f) => f.lat === city.lat && f.lon === city.lon);
  const next = exists
    ? favs.filter((f) => !(f.lat === city.lat && f.lon === city.lon))
    : [...favs, city].slice(-8);
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function removeFavorite(city: FavCity): FavCity[] {
  const next = getFavorites().filter((fav) => !(fav.lat === city.lat && fav.lon === city.lon));
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function isFavorite(favs: FavCity[], city: FavCity): boolean {
  return favs.some((f) => f.lat === city.lat && f.lon === city.lon);
}

export function getHistory(): FavCity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HIST_KEY) ?? "[]") as FavCity[];
  } catch {
    return [];
  }
}

export function pushHistory(city: FavCity): FavCity[] {
  const hist = getHistory().filter((h) => h.name !== city.name);
  const next = [city, ...hist].slice(0, 10);
  localStorage.setItem(HIST_KEY, JSON.stringify(next));
  return next;
}

export type Unit = "metric" | "imperial";

export function getUnit(): Unit {
  if (typeof window === "undefined") return "metric";
  return localStorage.getItem(UNIT_KEY) === "imperial" ? "imperial" : "metric";
}

export function setUnit(u: Unit) {
  localStorage.setItem(UNIT_KEY, u);
}

export function getSelected(): FavCity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SELECTED_KEY);
    if (!raw) return null;
    const city = JSON.parse(raw) as FavCity;
    if (!city || typeof city.lat !== "number" || typeof city.lon !== "number") return null;
    return city;
  } catch {
    return null;
  }
}

export function setSelected(city: FavCity) {
  localStorage.setItem(SELECTED_KEY, JSON.stringify(city));
}

export function clearHistory() {
  localStorage.removeItem(HIST_KEY);
}

export function formatTemp(celsius: number, unit: Unit): string {
  return unit === "metric"
    ? `${Math.round(celsius)}°C`
    : `${Math.round(celsius * 9 / 5 + 32)}°F`;
}

export function formatSpeed(ms: number, unit: Unit): string {
  return unit === "metric" ? `${Math.round(ms * 3.6)} km/j` : `${Math.round(ms * 2.237)} mph`;
}
