"use client";

import { useBmkg } from "@/app/bmkg-provider";
import { bmkgToIcon } from "@/lib/bmkg";
import WeatherEffects from "@/components/WeatherEffects";
import { EmptyBlock } from "@/components/Status";

function localHour(iso: string): number {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? 12 : d.getHours();
}

export default function BmkgHero() {
  const { cuaca, cuacaLoading, cuacaError, cuacaUpdatedAt, bmkgActive, refresh } = useBmkg();

  if (!bmkgActive) {
    return (
      <EmptyBlock
        title="Modul BMKG nonaktif"
        message="Kota aktif di luar Indonesia. Pilih wilayah Indonesia untuk data BMKG."
      />
    );
  }

  if (cuacaLoading && !cuaca) {
    return <div className="shimmer h-64 rounded-2xl" role="status" aria-label="Memuat cuaca BMKG" />;
  }
  if (!cuaca) {
    return (
      <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
        <p className="font-bold">Cuaca BMKG belum bisa dimuat</p>
        <p className="mt-1">{cuacaError ?? "Coba lagi beberapa saat."}</p>
        <button onClick={refresh} className="mt-3 min-h-11 rounded-xl bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-800">
          Coba lagi
        </button>
      </div>
    );
  }

  const slots = cuaca.days.flat();
  const now = slots[0];
  const icon = bmkgToIcon(now.weather, localHour(now.local_datetime));

  return (
    <section aria-labelledby="bmkg-kota" className="animate-rise relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B3D91] via-[#0e4cb3] to-[#083070] text-white shadow-lg">
      <WeatherEffects icon={icon} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-sm">🇮🇩 BMKG</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
            {cuaca.lokasi.provinsi} › {cuaca.lokasi.kotkab} › {cuaca.lokasi.kecamatan}
          </span>
        </div>
        <h2 id="bmkg-kota" className="mt-2 text-2xl font-extrabold tracking-tight drop-shadow-sm sm:text-4xl">
          {cuaca.lokasi.desa} · <span className="font-semibold">{now.weather_desc}</span>
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={now.image} alt={now.weather_desc} width={96} height={96} className="animate-float drop-shadow-xl" />
            <div>
              <p className="text-7xl font-extrabold leading-none tracking-tighter drop-shadow-md sm:text-8xl">
                {Math.round(now.t)}°
              </p>
              <p className="mt-1 text-xs text-sky-100 sm:text-sm">
                Analisis {new Date(now.analysis_date).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:text-[13px]">
            {[
              ["Kelembapan", `${now.hu}%`],
              ["Angin", `${now.wd} ${Math.round(now.ws)} km/jam`],
              ["Tutupan awan", `${now.tcc}%`],
              ["Jarak pandang", now.vs_text],
              ["Hujan", `${now.tp} mm`],
              ["Diperbarui", cuacaUpdatedAt ? cuacaUpdatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
                <dt className="text-sky-100">{k}</dt>
                <dd className="mt-0.5 font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 text-[11px] text-sky-100/90">Sumber data: BMKG (api.bmkg.go.id). Aplikasi ini non-resmi.</p>
      </div>
    </section>
  );
}
