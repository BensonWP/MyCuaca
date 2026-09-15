"use client";

import { useEffect } from "react";
import { useWeather } from "@/app/weather-provider";
import { useBmkg } from "@/app/bmkg-provider";
import CityManager from "@/components/CityManager";
import SectionIntro from "@/components/SectionIntro";
import WilayahSearch from "@/components/WilayahSearch";

export default function CitiesScreen() {
  const { favorites, history, favoriteWeather, unit, selectCity, removeFavorite, clearSearchHistory, requestMyLocation, loadFavoriteWeather } =
    useWeather();
  const { cityName, cityCoords } = useBmkg();

  useEffect(() => {
    const id = setTimeout(() => {
      void loadFavoriteWeather(favorites);
    }, 0);
    return () => clearTimeout(id);
  }, [loadFavoriteWeather, favorites]);

  const active = favorites.find((f) => f.lat === cityCoords.lat && f.lon === cityCoords.lon) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro
        eyebrow="Pustaka lokasi tersimpan di perangkat ini"
        title="Kota saya"
        description="Cari kota dunia di bawah (pencarian global) atau pilih wilayah Indonesia untuk data BMKG."
      />
      <WilayahSearch />
      <CityManager
        active={active}
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
