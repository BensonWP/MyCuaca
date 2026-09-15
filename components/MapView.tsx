"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export type MapLayer = "clouds" | "precipitation" | "temp" | "wind" | "pressure";

const OVERLAY_OPACITY = 0.65;

interface Props {
  lat: number;
  lon: number;
  cityName: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  layer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
}

interface LayerMeta {
  value: MapLayer;
  label: string;
  legend: string;
  low: string;
  high: string;
  swatch: string;
}

interface InspectCurrent {
  main: { temp: number; feels_like: number; humidity: number };
  weather?: { description: string; icon: string }[];
  wind: { speed: number };
}

interface ReverseItem {
  name: string;
}

const LAYERS: LayerMeta[] = [
  {
    value: "clouds",
    label: "Awan",
    legend: "Lapisan awan menunjukkan tutupan awan dari citra satelit OpenWeather.",
    low: "Tipis",
    high: "Lebat",
    swatch: "linear-gradient(90deg, #e2e8f0, #1e293b)",
  },
  {
    value: "precipitation",
    label: "Hujan",
    legend: "Lapisan curah hujan menunjukkan area hujan yang terdeteksi satelit.",
    low: "Ringan",
    high: "Lebat",
    swatch: "linear-gradient(90deg, #bfdbfe, #1d4ed8)",
  },
  {
    value: "temp",
    label: "Suhu",
    legend: "Lapisan suhu menunjukkan sebaran suhu permukaan menurut skema OpenWeather.",
    low: "Dingin",
    high: "Panas",
    swatch: "linear-gradient(90deg, #1e40af, #f5f5f4, #b91c1c)",
  },
  {
    value: "wind",
    label: "Angin",
    legend: "Lapisan angin menunjukkan kecepatan angin permukaan.",
    low: "Tenang",
    high: "Kencang",
    swatch: "linear-gradient(90deg, #16a34a, #dc2626)",
  },
  {
    value: "pressure",
    label: "Tekanan",
    legend: "Lapisan tekanan menunjukkan tekanan udara permukaan.",
    low: "Rendah",
    high: "Tinggi",
    swatch: "linear-gradient(90deg, #b91c1c, #1d4ed8)",
  },
];

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function badgeIcon(temp: number, icon: string, label: string): L.DivIcon {
  return L.divIcon({
    className: "ow-badge-wrap",
    html:
      `<span class="ow-badge" role="img" aria-label="${esc(label)}: ${temp} derajat">` +
      `<img src="https://openweathermap.org/img/wn/${esc(icon)}@2x.png" alt="" width="30" height="30" />` +
      `<b>${temp}°</b></span>`,
    iconSize: [82, 38],
    iconAnchor: [41, 44],
    popupAnchor: [0, -44],
  });
}

function infoPopup(
  name: string,
  temp: number,
  feelsLike: number,
  humidity: number,
  windSpeed: number,
  description: string,
): string {
  return (
    `<div class="ow-popup"><b>${esc(name)}</b><br />` +
    `${esc(description)}, ${temp}° (terasa ${feelsLike}°)<br />` +
    `Angin ${windSpeed} m/s · Lembap ${humidity}%</div>`
  );
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function MapView({
  lat,
  lon,
  cityName,
  temp,
  feelsLike,
  humidity,
  windSpeed,
  description,
  icon,
  layer,
  onLayerChange,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const inspectRef = useRef<L.Marker | null>(null);
  const meRef = useRef<L.CircleMarker | null>(null);
  const baseRef = useRef<L.TileLayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<MapLayer>(layer);
  const targetRef = useRef<MapLayer>(layer);
  const seqRef = useRef(0);
  const firstCityRef = useRef(true);
  const [overlayError, setOverlayError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function addOverlay(map: L.Map, name: MapLayer, fadeIn = false) {
    if (fadeIn) targetRef.current = name;
    const overlay = L.tileLayer(`/api/tile/${name}/{z}/{x}/{y}`, {
      opacity: fadeIn ? 0 : OVERLAY_OPACITY,
      maxZoom: 12,
      className: "ow-layer",
    });
    overlay.on("tileerror", () => {
      if (targetRef.current === name) setOverlayError(true);
    });
    overlay.on("tileload", () => {
      if (targetRef.current === name) setOverlayError(false);
    });
    if (fadeIn) {
      overlay.on("load", () => {
        if (targetRef.current !== name) return;
        overlay.setOpacity(OVERLAY_OPACITY);
        map.eachLayer((candidate) => {
          if (
            candidate instanceof L.TileLayer &&
            candidate.options.className === "ow-layer" &&
            candidate !== overlay
          ) {
            map.removeLayer(candidate);
          }
        });
      });
    }
    overlay.addTo(map);
  }

  // Satu-satunya tile dasar: OpenStreetMap. Mode malam digelapkan via
  // filter CSS pada .ow-base (lihat globals.css) agar tidak bergantung ke
  // provider pihak ketiga yang mewajibkan API key.
  function baseLayer(): L.TileLayer {
    return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Peta dasar OpenStreetMap",
      maxZoom: 12,
      className: "ow-base",
    });
  }

  async function inspectPoint(pointLat: number, pointLon: number) {
    const seq = ++seqRef.current;
    setBusy(true);
    setNotice(null);
    try {
      const [curRes, revRes] = await Promise.all([
        fetch(`/api/weather?type=current&lat=${pointLat}&lon=${pointLon}`),
        fetch(`/api/weather?type=reverse&lat=${pointLat}&lon=${pointLon}`),
      ]);
      if (!curRes.ok) throw new Error("current");
      const cur = (await curRes.json()) as InspectCurrent;
      const rev = revRes.ok ? ((await revRes.json()) as ReverseItem[]) : [];
      if (seq !== seqRef.current) return;
      const map = mapRef.current;
      if (!map) return;
      const name = rev[0]?.name ?? `${pointLat.toFixed(2)}, ${pointLon.toFixed(2)}`;
      const t = Math.round(cur.main.temp);
      const ic = cur.weather?.[0]?.icon ?? "01d";
      const desc = cur.weather?.[0]?.description ?? "-";
      if (inspectRef.current) map.removeLayer(inspectRef.current);
      inspectRef.current = L.marker([pointLat, pointLon], {
        icon: badgeIcon(t, ic, name),
        title: name,
      })
        .addTo(map)
        .bindPopup(
          infoPopup(name, t, Math.round(cur.main.feels_like), cur.main.humidity, cur.wind.speed, desc),
        )
        .openPopup();
    } catch {
      if (seq === seqRef.current) setNotice("Tidak dapat memuat cuaca titik ini — coba lagi.");
    } finally {
      if (seq === seqRef.current) setBusy(false);
    }
  }

  function locateMe() {
    const map = mapRef.current;
    if (!map) return;
    if (!navigator.geolocation) {
      setNotice("Perangkat ini tidak mendukung geolokasi.");
      return;
    }
    setBusy(true);
    setNotice(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        const target: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        if (reducedMotion()) map.setView(target, 10);
        else map.flyTo(target, 10, { duration: 1.2 });
        if (meRef.current) map.removeLayer(meRef.current);
        meRef.current = L.circleMarker(target, {
          radius: 9,
          color: "#0284c7",
          weight: 3,
          fillColor: "#38bdf8",
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindPopup("Lokasi Anda — kota aktif tidak berubah.")
          .openPopup();
      },
      () => {
        setBusy(false);
        setNotice("Tidak dapat membaca lokasi — periksa izin lokasi browser.");
      },
      { timeout: 8000 },
    );
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([lat, lon], 7);
    baseRef.current = baseLayer();
    baseRef.current.addTo(map);
    addOverlay(map, layerRef.current);
    L.control.scale({ imperial: false }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      void inspectPoint(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      inspectRef.current = null;
      meRef.current = null;
      baseRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (firstCityRef.current) {
      firstCityRef.current = false;
    } else if (reducedMotion()) {
      map.setView([lat, lon], Math.max(map.getZoom(), 7));
    } else {
      map.flyTo([lat, lon], Math.max(map.getZoom(), 7), { duration: 1.2 });
    }
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    markerRef.current = L.marker([lat, lon], {
      icon: badgeIcon(temp, icon, cityName),
      title: cityName,
    })
      .addTo(map)
      .bindPopup(infoPopup(cityName, temp, feelsLike, humidity, windSpeed, description));
  }, [lat, lon, cityName, temp, feelsLike, humidity, windSpeed, description, icon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || layer === layerRef.current) return;
    layerRef.current = layer;
    addOverlay(map, layer, true);
  }, [layer]);

  const meta = LAYERS.find((item) => item.value === layer) ?? LAYERS[0];

  return (
    <section aria-labelledby="peta-cuaca" className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-700/70 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Eksplorasi
            </p>
            <h3 id="peta-cuaca" className="mt-1 text-lg font-extrabold text-zinc-950 sm:text-xl dark:text-white">
              Peta {cityName}
            </h3>
            <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{meta.legend}</p>
          </div>
          <fieldset className="w-full sm:w-auto">
            <legend className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Lapisan cuaca</legend>
            <div
              role="group"
              aria-label="Pilih lapisan cuaca"
              className="mt-2 flex flex-wrap gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 sm:max-w-md dark:border-zinc-700 dark:bg-zinc-950"
            >
              {LAYERS.map((item) => {
                const active = item.value === layer;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onLayerChange(item.value)}
                    aria-pressed={active}
                    className={`stateful min-h-9 flex-1 rounded-full px-3 py-1.5 text-[13px] font-bold whitespace-nowrap transition-transform hover:scale-105 sm:flex-none ${
                      active
                        ? "bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950"
                        : "text-zinc-600 hover:bg-white hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-zinc-100 p-3 text-xs dark:bg-zinc-950">
          <span className="shrink-0 font-bold text-zinc-700 dark:text-zinc-300">{meta.low}</span>
          <span
            aria-hidden
            className="h-2.5 flex-1 rounded-full shadow-inner"
            style={{ backgroundImage: meta.swatch }}
          />
          <span className="shrink-0 font-bold text-zinc-700 dark:text-zinc-300">{meta.high}</span>
        </div>
        {busy && (
          <p
            role="status"
            className="rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100"
          >
            Memuat data titik…
          </p>
        )}
        {notice && (
          <p
            role="alert"
            className="flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Tutup pemberitahuan"
              className="stateful min-h-11 min-w-11 rounded-lg px-2 font-bold"
            >
              ✕
            </button>
          </p>
        )}
        {overlayError && (
          <p
            role="status"
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
          >
            Lapisan cuaca tidak dapat dimuat — pastikan API key memiliki akses Weather Maps. Peta dasar tetap berfungsi.
          </p>
        )}
      </div>
      <div className="relative">
        <div
          ref={containerRef}
          role="application"
          aria-label={`Peta cuaca interaktif untuk ${cityName}. Klik peta untuk memeriksa cuaca di titik mana pun.`}
          className="h-[62dvh] min-h-96 w-full"
        />
        <button
          type="button"
          onClick={locateMe}
          title="Tampilkan lokasi saya"
          aria-label="Tampilkan lokasi saya di peta"
          className="ow-locate stateful absolute right-3 top-3 z-[1001]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
        </button>
      </div>
      <p className="border-t border-zinc-300 p-4 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
        Peta dasar OpenStreetMap. Klik titik mana pun untuk memeriksa cuacanya; tombol bidik kanan atas menampilkan lokasi Anda tanpa mengubah kota aktif. Lapisan cuaca OpenWeather dimuat melalui proxy MyCuaca agar API key tidak terbuka di browser; warna tiap lapisan mengikuti skema OpenWeather.
      </p>
    </section>
  );
}
