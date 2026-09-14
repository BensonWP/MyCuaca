"use client";

import { useEffect, useRef, useState } from "react";
import { useWeather } from "@/app/weather-provider";
import { FavCity } from "@/lib/storage";

export default function CitySearch({ compact = false }: { compact?: boolean }) {
  const { selectCity, history } = useWeather();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FavCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) {
      setError("Isi nama kota dulu, lalu tekan Cari.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?type=geocode&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Pencarian gagal");
      const cities = (data as { name: string; lat: number; lon: number }[]).map((item) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
      }));
      setResults(cities);
      setOpen(true);
      if (cities.length === 0) setError("Kota tidak ditemukan. Periksa ejaan nama kota lalu coba lagi.");
    } catch {
      setError("Pencarian gagal. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function pick(city: FavCity) {
    setQuery(city.name);
    setResults([]);
    setOpen(false);
    selectCity(city);
  }

  const showHistory = open && results.length === 0 && query.trim() === "" && history.length > 0;

  return (
    <div ref={boxRef} className={`relative ${compact ? "w-full" : "w-full max-w-xl"}`}>
      <form onSubmit={search} className="flex gap-2" role="search">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Cari kota, mis. Bandung"
          aria-label="Cari kota"
          className="min-h-11 w-full rounded-lg border border-zinc-400 bg-white px-4 py-2.5 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-500 focus:border-sky-700 focus:ring-2 focus:ring-sky-200 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus:ring-sky-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-11 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
        >
          {loading ? "Mencari" : "Cari"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {open && (results.length > 0 || showHistory) && (
        <ul
          id="city-results"
          aria-label="Hasil pencarian kota"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-zinc-300 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-950"
        >
          {results.map((item) => (
            <li key={`${item.lat},${item.lon}`}>
              <button
                onClick={() => pick(item)}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-sky-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <span>{item.name}</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {item.lat.toFixed(2)}, {item.lon.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
          {showHistory &&
            history.map((item) => (
              <li key={`history-${item.lat},${item.lon}`}>
                <button
                  onClick={() => pick(item)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-sky-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Riwayat</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
