"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { ErrorBlock, LoadingBlock, OfflineBanner, RefreshBanner } from "@/components/Status";
import { useWeather } from "@/app/weather-provider";

const HomeScreen = lazy(() => import("@/components/HomeScreen"));
const ForecastScreen = lazy(() => import("@/components/ForecastScreen"));
const MapScreen = lazy(() => import("@/components/MapScreen"));
const AirScreen = lazy(() => import("@/components/AirScreen"));
const CitiesScreen = lazy(() => import("@/components/CitiesScreen"));

const TABS = [
  { id: "ringkasan", label: "Ringkasan", loading: "Memuat ringkasan", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> },
  { id: "prakiraan", label: "Prakiraan", loading: "Memuat prakiraan", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id: "peta", label: "Peta", loading: "Memuat peta", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg> },
  { id: "udara", label: "Udara", loading: "Memuat kualitas udara", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> },
  { id: "kota", label: "Kota", loading: "Memuat kota", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14"/><path d="M9 9h1M9 13h1M17 9h1M17 13h1"/></svg> },
];

const SCREENS: Record<string, React.LazyExoticComponent<() => React.JSX.Element | null>> = {
  ringkasan: HomeScreen,
  prakiraan: ForecastScreen,
  peta: MapScreen,
  udara: AirScreen,
  kota: CitiesScreen,
};

export default function Home() {
  const { matchedData, loading, error, offline, updatedAt, refresh } = useWeather();
  const [active, setActive] = useState("ringkasan");
  const hasData = Boolean(matchedData);

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
        {offline && <OfflineBanner updatedAt={updatedAt} />}
        {error && !loading && !offline && <RefreshBanner message={error} onRetry={refresh} />}
        {loading && !matchedData ? (
          <LoadingBlock label="Memuat cuaca" />
        ) : !matchedData ? (
          <ErrorBlock message={error ?? "Data belum tersedia."} onRetry={refresh} />
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
            <a href="https://openweathermap.org/" className="font-semibold underline">
              OpenWeather
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}