"use client";

import { useWeather } from "@/app/weather-provider";
import CitySearch from "@/components/CitySearch";
import ThemeSwitch from "@/components/ThemeSwitch";
import UnitSwitch from "@/components/UnitSwitch";
import TabNav, { type Tab } from "@/components/TabNav";

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function SiteHeader({ tabs, activeTab, onTabChange }: Props) {
  const { unit, switchUnit } = useWeather();

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => onTabChange("ringkasan")} className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            <span className="text-sky-700 dark:text-sky-300">My</span>Cuaca
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeSwitch />
            <UnitSwitch unit={unit} onChange={switchUnit} />
          </div>
        </div>
        <CitySearch compact />
        {/* Desktop tab nav */}
        <div className="hidden sm:block">
          <TabNav tabs={tabs} active={activeTab} onChange={onTabChange} />
        </div>
      </div>
      {/* Mobile bottom tab nav */}
      <nav
        aria-label="Navigasi seluler"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="relative">
          <div className="grid grid-cols-5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTabChange(tab.id)}
                  className={`stateful flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                    isActive
                      ? "text-sky-800 dark:text-sky-300"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span aria-hidden className="[&>svg]:h-5 [&>svg]:w-5">
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
          {/* Indikator aktif mobile */}
          {(() => {
            const idx = tabs.findIndex((t) => t.id === activeTab);
            const pct = (idx / 5) * 100;
            return (
              <div
                aria-hidden
                className="absolute top-0 h-0.5 w-1/5 rounded-full bg-sky-700 transition-transform duration-300 ease-out dark:bg-sky-400"
                style={{ transform: `translateX(${pct * 1}%)` }}
              />
            );
          })()}
        </div>
      </nav>
    </header>
  );
}
