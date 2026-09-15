"use client";

import type { AirPollution, CurrentWeather, ForecastItem } from "@/lib/openweather";
import type { Unit } from "@/lib/storage";
import { ShirtIcon, SparkleIcon, UmbrellaIcon, WindIcon } from "@/lib/icons";

interface Props {
  current: CurrentWeather;
  upcoming: ForecastItem[];
  aqi?: AirPollution | null;
  unit: Unit;
}

interface Tip {
  title: string;
  body: string;
  card: string;
  icon: React.ReactNode;
}

export default function AdviceBanner({ current, upcoming, aqi, unit }: Props) {
  const tips: Tip[] = [];
  const maxPop = upcoming.length > 0 ? Math.max(...upcoming.map((i) => i.pop)) : 0;
  const maxRain = upcoming.length > 0 ? Math.max(...upcoming.map((i) => i.rain?.["3h"] ?? 0)) : 0;
  const feelsLike = unit === "metric" ? current.main.feels_like : (current.main.feels_like * 9) / 5 + 32;
  const windKmh = current.wind.speed * 3.6;

  if (maxPop >= 0.4 || maxRain >= 2) {
    tips.push({
      title: "Bawa payung",
      body: `Peluang hujan ${Math.round(maxPop * 100)}% dalam beberapa jam ke depan.`,
      card: "from-sky-600 to-blue-700 text-white",
      icon: <UmbrellaIcon className="h-5 w-5" />,
    });
  }

  if (feelsLike >= 33) {
    tips.push({
      title: "Terasa panas",
      body: `Terasa ${Math.round(feelsLike)}° — banyak minum dan cari teduh siang ini.`,
      card: "from-orange-500 to-rose-600 text-white",
      icon: <SparkleIcon className="h-5 w-5" />,
    });
  } else if (feelsLike <= 21) {
    tips.push({
      title: "Pakai jaket",
      body: `Terasa ${Math.round(feelsLike)}° — jaket tipis cukup untuk keluar.`,
      card: "from-indigo-500 to-slate-700 text-white",
      icon: <ShirtIcon className="h-5 w-5" />,
    });
  }

  if (windKmh >= 25) {
    tips.push({
      title: "Angin kencang",
      body: `${windKmh.toFixed(0)} km/h — jemuran dan payung rawan terbang.`,
      card: "from-teal-500 to-emerald-700 text-white",
      icon: <WindIcon className="h-5 w-5" />,
    });
  }

  const aqiValue = aqi?.list[0]?.main.aqi;
  if (aqiValue && aqiValue >= 3) {
    tips.push({
      title: aqiValue >= 4 ? "Udara tidak sehat" : "Udara sedang",
      body:
        aqiValue >= 4
          ? "Kurangi olahraga luar hari ini, terutama sore."
          : "Kelompok sensitif sebaiknya batasi aktivitas luar.",
      card: "from-amber-500 to-red-600 text-white",
      icon: <SparkleIcon className="h-5 w-5" />,
    });
  }

  if (tips.length === 0) {
    tips.push({
      title: "Cuaca bersahabat",
      body: "Waktu yang pas untuk jalan santai atau olahraga ringan di luar.",
      card: "from-emerald-500 to-teal-700 text-white",
      icon: <SparkleIcon className="h-5 w-5" />,
    });
  }

  return (
    <section aria-label="Saran aktivitas" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tips.slice(0, 4).map((tip) => (
        <div
          key={tip.title}
          className={`animate-rise flex items-start gap-3 rounded-2xl bg-gradient-to-br p-4 shadow-sm ${tip.card}`}
        >
          <span aria-hidden className="rounded-xl bg-white/20 p-2">
            {tip.icon}
          </span>
          <span>
            <span className="block text-sm font-extrabold">{tip.title}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-white/90">{tip.body}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
