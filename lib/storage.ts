export interface FavCity {
  name: string;
  lat: number;
  lon: number;
}

const FAV_KEY = "mycuaca.favorites";
const HIST_KEY = "mycuaca.history";
const UNIT_KEY = "mycuaca.unit";
const SELECTED_KEY = "mycuaca.selected";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getFavorites(): FavCity[] {
  const favs = readStored<FavCity[]>(FAV_KEY, []);
  return Array.isArray(favs) ? favs : [];
}

export function toggleFavorite(city: FavCity): FavCity[] {
  const favs = getFavorites();
  const exists = favs.some(
    (f) => f.name === city.name && f.lat === city.lat && f.lon === city.lon
  );
  const next = exists
    ? favs.filter((f) => !(f.name === city.name && f.lat === city.lat && f.lon === city.lon))
    : [...favs, city].slice(-8);
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function removeFavorite(city: FavCity): FavCity[] {
  const next = getFavorites().filter(
    (fav) => !(fav.name === city.name && fav.lat === city.lat && fav.lon === city.lon)
  );
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function getHistory(): FavCity[] {
  const hist = readStored<FavCity[]>(HIST_KEY, []);
  return Array.isArray(hist) ? hist : [];
}

export function pushHistory(city: FavCity): FavCity[] {
  const hist = getHistory().filter(
    (h) => !(h.name === city.name && h.lat === city.lat && h.lon === city.lon)
  );
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
  const city = readStored<FavCity | null>(SELECTED_KEY, null);
  if (!city || typeof city.lat !== "number" || typeof city.lon !== "number") return null;
  return city;
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
