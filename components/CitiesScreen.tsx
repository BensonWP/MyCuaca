"use client";

import { useEffect } from "react";
import { useWeather } from "@/app/weather-provider";
import CityManager from "@/components/CityManager";
import SectionIntro from "@/components/SectionIntro";

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
      <SectionIntro
        eyebrow="Pustaka lokasi tersimpan di perangkat ini"
        title="Kota saya"
      />
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
