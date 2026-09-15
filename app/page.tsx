"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { ErrorBlock, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";
import { useBmkg } from "@/app/bmkg-provider";
import {
  AirListIcon,
  AlertIcon,
  CalendarIcon,
  CameraIcon,
  CityIcon,
  MapIcon,
  QuakeIcon,
  SunTabIcon,
  WavesIcon,
} from "@/lib/icons";

const HomeScreen = lazy(() => import("@/components/HomeScreen"));
const ForecastScreen = lazy(() => import("@/components/ForecastScreen"));
const GempaScreen = lazy(() => import("@/components/GempaScreen"));
const PeringatanScreen = lazy(() => import("@/components/PeringatanScreen"));
const MaritimScreen = lazy(() => import("@/components/MaritimScreen"));
const CitraScreen = lazy(() => import("@/components/CitraScreen"));
const MapScreen = lazy(() => import("@/components/MapScreen"));
const AirScreen = lazy(() => import("@/components/AirScreen"));
const CitiesScreen = lazy(() => import("@/components/CitiesScreen"));

const TABS = [
  { id: "ringkasan", label: "Ringkasan", loading: "Memuat ringkasan", icon: <SunTabIcon /> },
  { id: "prakiraan", label: "Prakiraan", loading: "Memuat prakiraan", icon: <CalendarIcon /> },
  { id: "gempa", label: "Gempa", loading: "Memuat gempa", icon: <QuakeIcon /> },
  { id: "peringatan", label: "Peringatan", loading: "Memuat peringatan", icon: <AlertIcon /> },
  { id: "maritim", label: "Maritim", loading: "Memuat maritim", icon: <WavesIcon /> },
  { id: "citra", label: "Citra", loading: "Memuat citra", icon: <CameraIcon /> },
  { id: "peta", label: "Peta", loading: "Memuat peta", icon: <MapIcon /> },
  { id: "udara", label: "Udara", loading: "Memuat kualitas udara", icon: <AirListIcon /> },
  { id: "kota", label: "Kota", loading: "Memuat kota", icon: <CityIcon /> },
];

const SCREENS: Record<string, React.LazyExoticComponent<() => React.JSX.Element | null>> = {
  ringkasan: HomeScreen,
  prakiraan: ForecastScreen,
  gempa: GempaScreen,
  peringatan: PeringatanScreen,
  maritim: MaritimScreen,
  citra: CitraScreen,
  peta: MapScreen,
  udara: AirScreen,
  kota: CitiesScreen,
};

export default function Home() {
  const { cuaca, cuacaLoading, cuacaError, cuacaUpdatedAt, refresh } = useBmkg();
  const [active, setActive] = useState("ringkasan");
  const hasData = Boolean(cuaca);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );
    for (const tab of TABS) {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [hasData]);

  return (
    <>
      <SiteHeader tabs={TABS} activeTab={active} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        {cuacaLoading && !cuaca ? (
          <LoadingBlock label="Memuat cuaca BMKG" />
        ) : cuacaError && !cuaca ? (
          <ErrorBlock message={cuacaError} onRetry={refresh} />
        ) : !cuaca ? (
          <ErrorBlock message="Data belum tersedia." onRetry={refresh} />
        ) : (
          <div className="flex flex-col gap-12 sm:gap-16">
            {TABS.map((tab) => {
              const Screen = SCREENS[tab.id];
              return (
                <section key={tab.id} id={tab.id} className="scroll-mt-28">
                  <Suspense fallback={<LoadingBlock label={tab.loading} />}>
                    <Screen />
                  </Suspense>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <footer className="border-t border-zinc-200 bg-gradient-to-r from-sky-50 via-white to-blue-50 dark:border-zinc-800 dark:from-sky-950 dark:via-zinc-950 dark:to-blue-950">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-6 pb-24 sm:flex-nowrap sm:px-6 sm:pb-6">
          <p className="flex items-center gap-2 font-extrabold text-zinc-950 dark:text-white">
            <span aria-hidden className="rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 p-1.5 text-sm text-white">☀</span>
            MyCuaca
          </p>
          <p className="text-zinc-700 dark:text-zinc-300">
            Data oleh{" "}
            <a href="https://www.bmkg.go.id/" className="font-semibold underline">
              BMKG
            </a>
            {", "}
            <a href="https://openweathermap.org/" className="font-semibold underline">
              OpenWeather
            </a>
            {" (AQI, pencarian, peta) · "}
            <a href="https://www.rainviewer.com/" className="font-semibold underline">
              RainViewer
            </a>
            {" · aplikasi non-resmi"}
          </p>
        </div>
      </footer>
    </>
  );
}
