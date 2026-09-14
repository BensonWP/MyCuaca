"use client";

import { useEffect } from "react";
import { useWeather } from "@/app/weather-provider";
import CityManager from "@/components/CityManager";
import { Horizon } from "@/components/Status";

export default function CitiesScreen() {
  const { city, favorites, history, favoriteWeather, unit, selectCity, removeFavorite, clearSearchHistory, requestMyLocation, loadFavoriteWeather } =
    useWeather();

  useEffect(() => {
    const id = setTimeout(() => {
      void loadFavoriteWeather(favorites);
    }, 0);
    return () => clearTimeout(id);
  }, [loadFavoriteWeather, favorites]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">Pustaka lokasi tersimpan di perangkat ini</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          Kota saya
        </h2>
        <Horizon />
      </div>
      <CityManager
        active={city}
        favorites={favorites}
        history={history}
        favoriteWeather={favoriteWeather}
        unit={unit}
        onSelect={(next) => selectCity(next)}
        onRemoveFavorite={removeFavorite}
        onClearHistory={clearSearchHistory}
        onUseLocation={requestMyLocation}
      />
    </div>
  );
}
