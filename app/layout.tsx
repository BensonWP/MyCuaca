import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { WeatherProvider } from "@/app/weather-provider";
import SiteHeader from "@/components/SiteHeader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyCuaca, Prakiraan Cuaca Indonesia",
  description: "Cuaca saat ini, prakiraan 5 hari, kualitas udara, dan peta cuaca untuk kota Anda.",
};

const FOOTER_NAV = [
  { href: "/", label: "Ringkasan" },
  { href: "/prakiraan", label: "Prakiraan" },
  { href: "/peta", label: "Peta" },
  { href: "/udara", label: "Udara" },
  { href: "/kota", label: "Kota" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <WeatherProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
            {children}
          </main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-bold text-zinc-950 dark:text-white">MyCuaca</p>
              <nav aria-label="Navigasi bawah">
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                  {FOOTER_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="min-h-11 inline-flex items-center text-zinc-800 hover:text-sky-800 dark:text-zinc-200 dark:hover:text-sky-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="text-zinc-700 dark:text-zinc-300">
                Data oleh{" "}
                <a href="https://openweathermap.org/" className="font-semibold underline">
                  OpenWeather
                </a>
              </p>
            </div>
          </footer>
        </WeatherProvider>
      </body>
    </html>
  );
}
