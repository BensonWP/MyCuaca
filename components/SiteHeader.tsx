"use client";

import CitySearch from "@/components/CitySearch";
import HeaderControls from "@/components/HeaderControls";
import TabNav, { type Tab } from "@/components/TabNav";
import { useBmkg } from "@/app/bmkg-provider";
import { useWeather } from "@/app/weather-provider";

interface Props {
  tabs: Tab[];
  activeTab: string;
}

export default function SiteHeader({ tabs, activeTab }: Props) {
  const { cuaca, bmkgActive } = useBmkg();
  const place =
    bmkgActive && cuaca
      ? `${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan} · ${cuaca.lokasi.kotkab}`
      : "Memuat lokasi…";
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="animate-logo-enter">
            <a href="#ringkasan" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              <span aria-hidden className="animate-badge-pulse rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#0e4cb3] px-2 py-0.5 text-base text-white">BMKG</span>
              <span><span className="text-sky-700 dark:text-sky-300">My</span>Cuaca</span>
            </a>
            <p aria-live="polite" className="mt-0.5 truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              📍 {place}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <HeaderControls />
          </div>
        </div>
        <CitySearch compact />
        {/* Desktop tab nav */}
        <div className="hidden sm:block">
          <TabNav tabs={tabs} active={activeTab} />
        </div>
      </div>
      {/* Mobile bottom tab nav — geser horizontal untuk 9 bagian */}
      <nav
        aria-label="Lompat ke bagian"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="no-scrollbar flex snap-x overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`stateful relative flex min-h-14 min-w-[72px] flex-1 snap-start flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold ${
                  isActive
                    ? "text-sky-800 dark:text-sky-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {isActive && (
                  <span aria-hidden className="absolute top-0 h-0.5 w-full rounded-full bg-sky-700 dark:bg-sky-400" />
                )}
                <span aria-hidden className="[&>svg]:h-5 [&>svg]:w-5">
                  {tab.icon}
                </span>
                {tab.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
