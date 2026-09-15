"use client";

import { useMemo } from "react";
import { useBmkg } from "@/app/bmkg-provider";
import SectionIntro from "@/components/SectionIntro";
import { warningsFromBmkg } from "@/lib/bmkg";

const LEVEL_STYLE: Record<string, { card: string; badge: string; icon: string }> = {
  siaga: {
    card: "border-red-400 bg-gradient-to-br from-red-600 to-[#7f1d1d] text-white",
    badge: "bg-white/20",
    icon: "🚨",
  },
  waspada: {
    card: "border-amber-300 bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950",
    badge: "bg-black/10",
    icon: "⚠",
  },
  aman: {
    card: "border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
    badge: "bg-white/20",
    icon: "✓",
  },
};

export default function PeringatanScreen() {
  const { cuaca, gempa, bmkgActive } = useBmkg();

  const warnings = useMemo(
    () => (cuaca && bmkgActive ? warningsFromBmkg(cuaca.days) : []),
    [cuaca, bmkgActive]
  );
  const quakes = useMemo(
    () => [...(gempa?.terkini ?? [])].filter((g) => Number(g.Magnitude) >= 5).slice(0, 5),
    [gempa]
  );

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow="BMKG · MHEWS ala MyCuaca"
        title="Peringatan dini"
        description="Dihitung otomatis dari data BMKG (prakiraan 3 hari + gempa M5+). Bukan produk resmi MHEWS BMKG — untuk keadaan darurat ikuti infoBMKG resmi."
      />
      {!bmkgActive && (
        <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          <p className="font-bold">Peringatan cuaca nonaktif</p>
          <p className="mt-1">Kota aktif di luar Indonesia. Pilih wilayah Indonesia untuk peringatan BMKG — daftar gempa M5+ di bawah tetap tampil karena nasional.</p>
        </div>
      )}
      {bmkgActive && warnings.length === 0 && (
        <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-sm">
          <p className="flex items-center gap-2 text-base font-extrabold">✓ Aman</p>
          <p className="mt-1 text-sm text-white/90">
            {cuaca
              ? `Tidak ada parameter ekstrem untuk ${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan} dalam 3 hari ke depan.`
              : "Menunggu data BMKG…"}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {warnings.map((w) => {
          const s = LEVEL_STYLE[w.level] ?? LEVEL_STYLE.waspada;
          return (
            <div key={w.title} className={`rounded-2xl border p-5 shadow-sm ${s.card}`}>
              <p className="flex items-center gap-2 text-base font-extrabold">
                <span aria-hidden>{s.icon}</span> {w.title}
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase ${s.badge}`}>
                  {w.level}
                </span>
              </p>
              <p className="mt-1 text-sm opacity-90">{w.body}</p>
            </div>
          );
        })}
      </div>
      {quakes.length > 0 && (
        <section aria-label="Gempa besar terbaru" className="rounded-2xl bg-surface p-5 sm:p-6">
          <h3 className="text-lg font-extrabold text-zinc-950 dark:text-white">Gempa M 5,0+ terbaru</h3>
          <ul className="mt-3 space-y-2">
            {quakes.map((g, i) => (
              <li key={`${g.DateTime}-${i}`} className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
                <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-extrabold text-white">M {g.Magnitude}</span>
                <span className="font-bold text-zinc-950 dark:text-white">{g.Wilayah}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{g.Tanggal} · {g.Jam} · {g.Kedalaman}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Aturan: hujan ≥10 mm/3 jam atau petir = Siaga; hujan ≥2 mm, angin ≥25 km/jam, atau kabut = Waspada. Gelombang ikut kategori BMKG (Sedang 1.25–2.5 m, Tinggi 2.5–4 m, Sangat Tinggi 4–6 m, Ekstrem &gt;6 m).
      </p>
    </div>
  );
}
