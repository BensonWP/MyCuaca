"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { LoadingBlock } from "@/components/Status";

const HomeScreen = lazy(() => import("@/components/HomeScreen"));
const ForecastScreen = lazy(() => import("@/components/ForecastScreen"));
const MapScreen = lazy(() => import("@/components/MapScreen"));
const AirScreen = lazy(() => import("@/components/AirScreen"));
const CitiesScreen = lazy(() => import("@/components/CitiesScreen"));

const TABS = [
  { id: "ringkasan", label: "Ringkasan", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> },
  { id: "prakiraan", label: "Prakiraan", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id: "peta", label: "Peta", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg> },
  { id: "udara", label: "Udara", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> },
  { id: "kota", label: "Kota", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14"/><path d="M9 9h1M9 13h1M17 9h1M17 13h1"/></svg> },
];

const SCREENS: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  ringkasan: HomeScreen,
  prakiraan: ForecastScreen,
  peta: MapScreen,
  udara: AirScreen,
  kota: CitiesScreen,
};

export default function Home() {
  const [active, setActive] = useState("ringkasan");
  const Screen = SCREENS[active];

  useEffect(() => {
    const go = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (SCREENS[id]) setActive(id);
    };
    window.addEventListener("mycuaca:tab", go);
    return () => window.removeEventListener("mycuaca:tab", go);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  return (
    <>
      <SiteHeader tabs={TABS} activeTab={active} onTabChange={setActive} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        <div className="tab-content" key={active}>
          <Suspense fallback={<LoadingBlock label="Memuat halaman" />}>
            <Screen />
          </Suspense>
        </div>
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-6 pb-24 text-sm sm:flex-nowrap sm:px-6 sm:pb-6">
          <p className="font-bold text-zinc-950 dark:text-white">MyCuaca</p>
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
