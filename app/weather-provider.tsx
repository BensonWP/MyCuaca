"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AirPollution } from "@/lib/openweather";
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

export interface FavoriteWeather {
  temp: number;
  icon: string;
  description: string;
  at: number;
}

interface WeatherContextValue {
  unit: Unit;
  favorites: FavCity[];
  history: FavCity[];
  favoriteWeather: Record<string, FavoriteWeather>;
  aqi: AirPollution | null;
  selectCity: (city: FavCity, record?: boolean) => void;
  requestMyLocation: () => void;
  loadFavoriteWeather: (favorites: FavCity[]) => void;
  loadAqi: (lat: number, lon: number) => void;
  toggleFavoriteCity: (city: FavCity) => void;
  removeFavorite: (city: FavCity) => void;
  clearSearchHistory: () => void;
  switchUnit: (unit: Unit) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

const JAKARTA: FavCity = { name: "Jakarta", lat: -6.2088, lon: 106.8456 };

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<Unit>("metric");
  const [favorites, setFavorites] = useState<FavCity[]>([]);
  const [history, setHistory] = useState<FavCity[]>([]);
  const [favoriteWeather] = useState<Record<string, FavoriteWeather>>({});
  const [aqi, setAqi] = useState<AirPollution | null>(null);

  // Favorit memakai koordinat global tanpa kode adm4 BMKG, jadi tidak ada
  // suhu live yang bisa dimuat — dipertahankan sebagai no-op agar API stabil.
  const loadFavoriteWeather = useCallback(async (_targets: FavCity[]) => {
    return;
  }, []);

  // Load AQI dari OpenWeather
  const loadAqi = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(`/api/weather?type=aqi&lat=${lat}&lon=${lon}`);
      if (!res.ok) return;
      const data = (await res.json()) as AirPollution;
      setAqi(data);
    } catch {
      // AQI optional — abaikan error
    }
  }, []);

  const selectCity = useCallback(
    (next: FavCity, record = true) => {
      setSelected(next);
      if (record) setHistory(pushHistory(next));
    },
    []
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

  const value = useMemo<WeatherContextValue>(
    () => ({
      unit,
      favorites,
      history,
      favoriteWeather,
      aqi,
      selectCity,
      requestMyLocation,
      loadFavoriteWeather,
      loadAqi,
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
    [unit, favorites, history, favoriteWeather, aqi, selectCity, requestMyLocation, loadFavoriteWeather, loadAqi]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather harus dipakai di dalam WeatherProvider");
  return ctx;
}
