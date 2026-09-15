"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { BmkgCuacaResponse, BmkgCurrentConditions, BmkgGempa, BmkgSlot } from "@/lib/bmkg";
import { bmkgToCurrentConditions, isValidAdm4 } from "@/lib/bmkg";
import { DEFAULT_ADM4, getStoredAdm4, saveAdm4 } from "@/lib/wilayah";

interface GempaBundle {
  realtime: BmkgGempa[];
  terkini: BmkgGempa[];
  dirasakan: BmkgGempa[];
}

interface BmkgContextValue {
  adm4: string;
  cuaca: BmkgCuacaResponse | null;
  cuacaLoading: boolean;
  cuacaError: string | null;
  cuacaUpdatedAt: Date | null;
  gempa: GempaBundle | null;
  gempaLoading: boolean;
  gempaError: string | null;
  bmkgActive: boolean;
  setBmkgActive: (active: boolean) => void;
  selectWilayah: (adm4: string) => void;
  refresh: () => void;
  // Derived fields untuk UI
  currentConditions: BmkgCurrentConditions | null;
  cityName: string;
  cityCoords: { lat: number; lon: number };
  allSlots: BmkgSlot[];
}

const BmkgContext = createContext<BmkgContextValue | null>(null);

const REFRESH_MS = 10 * 60 * 1000;

function localHour(iso: string): number {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? 12 : d.getHours();
}

export function BmkgProvider({ children }: { children: React.ReactNode }) {
  const [adm4, setAdm4] = useState<string>(DEFAULT_ADM4);
  const [cuaca, setCuaca] = useState<BmkgCuacaResponse | null>(null);
  const [cuacaLoading, setCuacaLoading] = useState(true);
  const [cuacaError, setCuacaError] = useState<string | null>(null);
  const [cuacaUpdatedAt, setCuacaUpdatedAt] = useState<Date | null>(null);
  const [gempa, setGempa] = useState<GempaBundle | null>(null);
  const [gempaLoading, setGempaLoading] = useState(true);
  const [gempaError, setGempaError] = useState<string | null>(null);
  const [bmkgActive, setBmkgActive] = useState(true);
  const cuacaSeqRef = useRef(0);
  const gempaSeqRef = useRef(0);

  const loadCuaca = useCallback(async (code: string) => {
    const seq = ++cuacaSeqRef.current;
    setCuacaLoading(true);
    setCuacaError(null);
    try {
      const res = await fetch(`/api/bmkg/cuaca?adm4=${encodeURIComponent(code)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memuat cuaca BMKG");
      if (seq !== cuacaSeqRef.current) return;
      setCuaca(body as BmkgCuacaResponse);
      setCuacaUpdatedAt(new Date());
    } catch (err) {
      if (seq !== cuacaSeqRef.current) return;
      setCuacaError(err instanceof Error ? err.message : "Gagal memuat cuaca BMKG");
    } finally {
      if (seq === cuacaSeqRef.current) setCuacaLoading(false);
    }
  }, []);

  const loadGempa = useCallback(async () => {
    const seq = ++gempaSeqRef.current;
    setGempaLoading(true);
    setGempaError(null);
    try {
      const res = await fetch("/api/bmkg/gempa?jenis=all");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal memuat gempa BMKG");
      if (seq !== gempaSeqRef.current) return;
      setGempa(body as GempaBundle);
    } catch (err) {
      if (seq !== gempaSeqRef.current) return;
      setGempaError(err instanceof Error ? err.message : "Gagal memuat gempa BMKG");
    } finally {
      if (seq === gempaSeqRef.current) setGempaLoading(false);
    }
  }, []);

  const selectWilayah = useCallback(
    (code: string) => {
      const clean = code.trim();
      if (!isValidAdm4(clean)) return;
      setAdm4(clean);
      saveAdm4(clean);
      setBmkgActive(true);
      void loadCuaca(clean);
    },
    [loadCuaca]
  );

  const refresh = useCallback(() => {
    void loadCuaca(adm4);
    void loadGempa();
  }, [adm4, loadCuaca, loadGempa]);

  useEffect(() => {
    const id = setTimeout(() => {
      const stored = getStoredAdm4();
      setAdm4(stored);
      void loadCuaca(stored);
      void loadGempa();
    }, 0);
    return () => clearTimeout(id);
  }, [loadCuaca, loadGempa]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadCuaca(adm4);
        void loadGempa();
      }
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [adm4, loadCuaca, loadGempa]);

  // Derived: all slots flat
  const allSlots = useMemo(() => cuaca?.days.flat() ?? [], [cuaca]);

  // Derived: current conditions dari slot pertama
  const currentConditions = useMemo(() => {
    if (!cuaca || allSlots.length === 0) return null;
    return bmkgToCurrentConditions(allSlots[0], localHour(allSlots[0].local_datetime));
  }, [cuaca, allSlots]);

  // Derived: city name
  const cityName = cuaca ? `${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan}` : "";

  // Derived: city coords
  const cityCoords = useMemo(
    () => ({
      lat: cuaca?.lokasi.lat ?? -6.2088,
      lon: cuaca?.lokasi.lon ?? 106.8456,
    }),
    [cuaca]
  );

  const value = useMemo<BmkgContextValue>(
    () => ({
      adm4,
      cuaca,
      cuacaLoading,
      cuacaError,
      cuacaUpdatedAt,
      gempa,
      gempaLoading,
      gempaError,
      bmkgActive,
      setBmkgActive,
      selectWilayah,
      refresh,
      currentConditions,
      cityName,
      cityCoords,
      allSlots,
    }),
    [adm4, cuaca, cuacaLoading, cuacaError, cuacaUpdatedAt, gempa, gempaLoading, gempaError, bmkgActive, selectWilayah, refresh, currentConditions, cityName, cityCoords, allSlots]
  );

  return <BmkgContext.Provider value={value}>{children}</BmkgContext.Provider>;
}

export function useBmkg(): BmkgContextValue {
  const ctx = useContext(BmkgContext);
  if (!ctx) throw new Error("useBmkg harus dipakai di dalam BmkgProvider");
  return ctx;
}
