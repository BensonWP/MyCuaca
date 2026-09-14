"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AirPollution, CurrentWeather, ForecastResponse } from "@/lib/openweather";
import {
  FavCity,
  Unit,
  clearHistory,
  getFavorites,
  getHistory,
  getSelected,
  getUnit,
  pushHistory,
  removeFavorite as removeFavoriteStored,
  setSelected,
  setUnit as saveUnit,
  toggleFavorite,
} from "@/lib/storage";

export interface WeatherBundle {
  current: CurrentWeather;
  forecast: ForecastResponse;
  aqi: AirPollution;
}

export interface FavoriteWeather {
  temp: number;
  icon: string;
  description: string;
  at: number;
}

interface WeatherContextValue {
  city: FavCity | null;
  data: WeatherBundle | null;
  matchedData: WeatherBundle | null;
  favoriteWeather: Record<string, FavoriteWeather>;
  loading: boolean;
  error: string | null;
  offline: boolean;
  updatedAt: Date | null;
  unit: Unit;
  favorites: FavCity[];
  history: FavCity[];
  selectCity: (city: FavCity, record?: boolean) => void;
  refresh: () => void;
  requestMyLocation: () => void;
  loadFavoriteWeather: (favorites: FavCity[]) => void;
  toggleFavoriteCity: (city: FavCity) => void;
  removeFavorite: (city: FavCity) => void;
  clearSearchHistory: () => void;
  switchUnit: (unit: Unit) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

const JAKARTA: FavCity = { name: "Jakarta", lat: -6.2088, lon: 106.8456 };
const REFRESH_MS = 10 * 60 * 1000;

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<FavCity | null>(null);
  const [data, setData] = useState<WeatherBundle | null>(null);
  const [dataCity, setDataCity] = useState<FavCity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [unit, setUnitState] = useState<Unit>("metric");
  const [favorites, setFavorites] = useState<FavCity[]>([]);
  const [history, setHistory] = useState<FavCity[]>([]);
  const [favoriteWeather, setFavoriteWeather] = useState<Record<string, FavoriteWeather>>({});

  // Suhu live tiap favorit, di-cache 10 menit. Hanya dipanggil dari halaman Kota.
  const loadFavoriteWeather = useCallback(async (targets: FavCity[]) => {
    const now = Date.now();
    const fresh = targets.filter((target) => {
      const cached = favoriteWeather[`${target.lat},${target.lon}`];
      return !cached || now - cached.at > REFRESH_MS;
    });
    if (fresh.length === 0) return;
    const entries = await Promise.all(
      fresh.map(async (target) => {
        try {
          const res = await fetch(`/api/weather?type=current&lat=${target.lat}&lon=${target.lon}`);
          if (!res.ok) return null;
          const current = (await res.json()) as CurrentWeather;
          return [
            `${target.lat},${target.lon}`,
            {
              temp: current.main.temp,
              icon: current.weather[0].icon,
              description: current.weather[0].description,
              at: now,
            },
          ] as const;
        } catch {
          return null;
        }
      })
    );
    setFavoriteWeather((prev) => {
      const next = { ...prev };
      for (const entry of entries) {
        if (entry) next[entry[0]] = entry[1];
      }
      return next;
    });
  }, [favoriteWeather]);

  const load = useCallback(async (target: FavCity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?type=all&lat=${target.lat}&lon=${target.lon}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memuat data");
      const bundle = body as WeatherBundle;
      const named =
        target.name === "Lokasi saya" && bundle.current.name
          ? { ...target, name: bundle.current.name }
          : target;
      setData(bundle);
      setDataCity(named);
      setUpdatedAt(new Date());
      setOffline(false);
      if (named !== target) {
        setCity(named);
        setSelected(named);
      }
    } catch (err) {
      const disconnected = typeof navigator !== "undefined" && !navigator.onLine;
      setOffline(disconnected);
      setError(
        disconnected
          ? "Tidak ada koneksi internet. Periksa jaringan lalu muat ulang."
          : "Gagal memuat data cuaca. Periksa koneksi lalu coba lagi."
      );
      if (err instanceof Error && process.env.NODE_ENV === "development") {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCity = useCallback(
    (next: FavCity, record = true) => {
      setCity(next);
      setSelected(next);
      if (record) setHistory(pushHistory(next));
      void load(next);
    },
    [load]
  );

  const requestMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      selectCity(JAKARTA, false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectCity(
          { name: "Lokasi saya", lat: pos.coords.latitude, lon: pos.coords.longitude },
          false
        );
      },
      () => selectCity(JAKARTA, false),
      { timeout: 8000 }
    );
  }, [selectCity]);

  useEffect(() => {
    const id = setTimeout(() => {
      setFavorites(getFavorites());
      setHistory(getHistory());
      setUnitState(getUnit());
      const stored = getSelected();
      if (stored) {
        selectCity(stored, false);
      } else {
        requestMyLocation();
      }
    }, 0);
    return () => clearTimeout(id);
  }, [selectCity, requestMyLocation]);

  useEffect(() => {
    if (!city) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void load(city);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [city, load]);

  useEffect(() => {
    const markOnline = () => {
      setOffline(false);
      if (city) void load(city);
    };
    const markOffline = () => setOffline(true);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, [city, load]);

  const matchedData =
    data && city && dataCity && dataCity.lat === city.lat && dataCity.lon === city.lon
      ? data
      : null;

  const value = useMemo<WeatherContextValue>(
    () => ({
      city,
      data,
      matchedData,
      favoriteWeather,
      loading,
      error,
      offline,
      updatedAt,
      unit,
      favorites,
      history,
      selectCity,
      refresh: () => {
        if (city) void load(city);
      },
      requestMyLocation,
      loadFavoriteWeather,
      toggleFavoriteCity: (target) => setFavorites(toggleFavorite(target)),
      removeFavorite: (target) => setFavorites(removeFavoriteStored(target)),
      clearSearchHistory: () => {
        clearHistory();
        setHistory([]);
      },
      switchUnit: (next) => {
        setUnitState(next);
        saveUnit(next);
      },
    }),
    [city, data, matchedData, favoriteWeather, loading, error, offline, updatedAt, unit, favorites, history, selectCity, load, requestMyLocation, loadFavoriteWeather]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather harus dipakai di dalam WeatherProvider");
  return ctx;
}
