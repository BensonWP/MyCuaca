"use client";

import type { BmkgSlot } from "@/lib/bmkg";
import { formatSpeed, formatTemp, type Unit } from "@/lib/storage";
import { ShirtIcon, SparkleIcon, UmbrellaIcon, WindIcon } from "@/lib/icons";

interface Props {
  slots: BmkgSlot[];
  unit: Unit;
}

interface Tip {
  title: string;
  body: string;
  card: string;
  icon: React.ReactNode;
}

export default function AdviceBanner({ slots, unit }: Props) {
  const tips: Tip[] = [];
  const maxTp = slots.length > 0 ? Math.max(...slots.map((s) => s.tp)) : 0;
  const maxWs = slots.length > 0 ? Math.max(...slots.map((s) => s.ws)) : 0;
  const tempNow = slots.length > 0 ? slots[0].t : 25;

  if (maxTp >= 5) {
    tips.push({
      title: "Bawa payung",
      body: `Curah hujan hingga ${maxTp.toFixed(1)} mm per 3 jam ke depan.`,
      card: "from-sky-600 to-blue-700 text-white",
      icon: <UmbrellaIcon className="h-5 w-5" />,
    });
  }

  if (tempNow >= 33) {
    tips.push({
      title: "Terasa panas",
      body: `Suhu ${formatTemp(tempNow, unit)} — banyak minum dan cari teduh siang ini.`,
      card: "from-orange-500 to-rose-600 text-white",
      icon: <SparkleIcon className="h-5 w-5" />,
    });
  } else if (tempNow <= 21) {
    tips.push({
      title: "Pakai jaket",
      body: `Suhu ${formatTemp(tempNow, unit)} — jaket tipis cukup untuk keluar.`,
      card: "from-indigo-500 to-slate-700 text-white",
      icon: <ShirtIcon className="h-5 w-5" />,
    });
  }

  if (maxWs >= 25) {
    tips.push({
      title: "Angin kencang",
      body: `Kecepatan angin hingga ${maxWs.toFixed(0)} km/jam — jemuran dan payung rawan terbang.`,
      card: "from-teal-500 to-emerald-700 text-white",
      icon: <WindIcon className="h-5 w-5" />,
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
