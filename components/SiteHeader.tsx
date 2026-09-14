"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeather } from "@/app/weather-provider";
import CitySearch from "@/components/CitySearch";
import ThemeSwitch from "@/components/ThemeSwitch";
import UnitSwitch from "@/components/UnitSwitch";

const NAV = [
  { href: "/", label: "Ringkasan" },
  { href: "/prakiraan", label: "Prakiraan" },
  { href: "/peta", label: "Peta" },
  { href: "/udara", label: "Udara" },
  { href: "/kota", label: "Kota" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { unit, switchUnit } = useWeather();

  return (
    <header className="border-b border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            <span className="text-sky-700 dark:text-sky-300">My</span>Cuaca
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeSwitch />
            <UnitSwitch unit={unit} onChange={switchUnit} />
          </div>
        </div>
        <CitySearch compact />
        <nav aria-label="Navigasi utama" className="hidden sm:block">
          <ul className="flex flex-wrap gap-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-lg border px-4 py-2 text-sm font-semibold ${
                      active
                        ? "border-sky-700 bg-sky-700 text-white dark:border-sky-500 dark:bg-sky-600"
                        : "border-zinc-300 text-zinc-800 hover:border-sky-700 hover:text-sky-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-sky-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <nav
        aria-label="Navigasi seluler"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/98 pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-zinc-800 dark:bg-zinc-950/98"
      >
        <ul className="grid grid-cols-5 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-semibold ${
                    active
                      ? "text-sky-800 dark:text-sky-300"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span aria-hidden className={`h-1 w-8 rounded-sm ${active ? "bg-sky-700 dark:bg-sky-400" : "bg-transparent"}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
