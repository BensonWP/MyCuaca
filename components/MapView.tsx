"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export type MapLayer = "clouds" | "precipitation" | "temp";

interface Props {
  lat: number;
  lon: number;
  cityName: string;
  layer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
}

const LAYERS: { value: MapLayer; label: string; legend: string }[] = [
  { value: "clouds", label: "Awan", legend: "Lapisan awan menunjukkan tutupan awan dari citra satelit OpenWeather." },
  { value: "precipitation", label: "Curah hujan", legend: "Lapisan curah hujan menunjukkan area hujan yang terdeteksi." },
  { value: "temp", label: "Suhu", legend: "Lapisan suhu menunjukkan sebaran suhu permukaan." },
];

export default function MapView({ lat, lon, cityName, layer, onLayerChange }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const baseRef = useRef<L.TileLayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<MapLayer>(layer);

  function baseLayer(dark: boolean): L.TileLayer {
    return dark
      ? L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "Peta dasar OpenStreetMap dan CARTO",
          maxZoom: 12,
          className: "ow-base",
        })
      : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "Peta dasar OpenStreetMap",
          maxZoom: 12,
          className: "ow-base",
        });
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([lat, lon], 7);
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    baseRef.current = baseLayer(dark);
    baseRef.current.addTo(map);
    L.tileLayer(`/api/tile/${layerRef.current}/{z}/{x}/{y}`, {
      opacity: 0.65,
      maxZoom: 12,
      className: "ow-layer",
    }).addTo(map);
    markerRef.current = L.marker([lat, lon]).addTo(map).bindPopup(cityName);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = (event: MediaQueryListEvent) => {
      const current = mapRef.current;
      if (!current || !baseRef.current) return;
      current.removeLayer(baseRef.current);
      baseRef.current = baseLayer(event.matches);
      baseRef.current.addTo(current);
    };
    media.addEventListener("change", onTheme);
    return () => {
      media.removeEventListener("change", onTheme);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      baseRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lon], map.getZoom());
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]).bindPopup(cityName);
    } else {
      markerRef.current = L.marker([lat, lon]).addTo(map).bindPopup(cityName);
    }
  }, [lat, lon, cityName]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || layer === layerRef.current) return;
    layerRef.current = layer;
    map.eachLayer((candidate) => {
      if (candidate instanceof L.TileLayer && candidate.options.className === "ow-layer") {
        map.removeLayer(candidate);
      }
    });
    L.tileLayer(`/api/tile/${layer}/{z}/{x}/{y}`, {
      opacity: 0.65,
      maxZoom: 12,
      className: "ow-layer",
    }).addTo(map);
  }, [layer]);

  const legend = LAYERS.find((item) => item.value === layer)?.legend ?? "";

  return (
    <section aria-labelledby="peta-cuaca" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="peta-cuaca" className="text-lg font-bold text-zinc-950 dark:text-white">
              Peta {cityName}
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{legend}</p>
          </div>
          <fieldset>
            <legend className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Lapisan cuaca</legend>
            <div className="mt-2 flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
              {LAYERS.map((item) => {
                const active = item.value === layer;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onLayerChange(item.value)}
                    aria-pressed={active}
                    className={`min-h-11 px-4 py-2 text-sm font-semibold ${
                      active
                        ? "bg-sky-700 text-white dark:bg-sky-600"
                        : "bg-white text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
      <div
        ref={containerRef}
        role="application"
        aria-label={`Peta cuaca interaktif untuk ${cityName}`}
        className="h-[62dvh] min-h-96 w-full"
      />
      <p className="border-t border-zinc-200 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        Peta dasar OpenStreetMap. Lapisan cuaca OpenWeather dimuat melalui proxy MyCuaca agar API key tidak terbuka di browser.
      </p>
    </section>
  );
}
