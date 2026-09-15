"use client";

import { useEffect, useMemo, useState } from "react";
import SectionIntro from "@/components/SectionIntro";
import { waveCategory, type BmkgMaritimForecast, type BmkgMaritimMeta } from "@/lib/bmkg";

type Kind = "pelabuhan" | "perairan";
const LAST_KEY = "mycuaca.bmkg.maritim";

function fmtTime(utc: string): string {
  const d = new Date(utc.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return utc;
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function MaritimScreen() {
  const [kind, setKind] = useState<Kind>("pelabuhan");
  const [meta, setMeta] = useState<BmkgMaritimMeta[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [forecast, setForecast] = useState<BmkgMaritimForecast | null>(null);
  const [fcLoading, setFcLoading] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch(`/api/bmkg/maritim?jenis=meta-${kind}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Gagal memuat daftar");
        if (cancel) return;
        const list = body as BmkgMaritimMeta[];
        setMeta(list);
        setFcLoading(true);
        setFcError(null);
        try {
          const last = JSON.parse(localStorage.getItem(LAST_KEY) ?? "null") as { kind: Kind; code: string } | null;
          if (last && last.kind === kind && list.some((m) => m.code === last.code)) {
            setCode(last.code);
            return;
          }
        } catch { /* abaikan */ }
        setCode(list[0]?.code ?? null);
      })
      .catch((err: unknown) => !cancel && setMetaError(err instanceof Error ? err.message : "Gagal"))
      .finally(() => !cancel && setMetaLoading(false));
    return () => { cancel = true; };
  }, [kind]);

  useEffect(() => {
    if (!code) return;
    let cancel = false;
    fetch(`/api/bmkg/maritim?jenis=${kind}&kode=${encodeURIComponent(code)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Gagal memuat prakiraan");
        if (!cancel) setForecast(body as BmkgMaritimForecast);
      })
      .catch((err: unknown) => !cancel && setFcError(err instanceof Error ? err.message : "Gagal"))
      .finally(() => !cancel && setFcLoading(false));
    return () => { cancel = true; };
  }, [kind, code]);

  function pickKind(k: Kind) {
    if (k === kind) return;
    setMetaLoading(true);
    setMetaError(null);
    setFcLoading(true);
    setFcError(null);
    setCode(null);
    setForecast(null);
    setKind(k);
  }

  function pickCode(c: string) {
    setFcLoading(true);
    setFcError(null);
    setCode(c);
    try { localStorage.setItem(LAST_KEY, JSON.stringify({ kind, code: c })); } catch { /* abaikan */ }
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return meta.slice(0, 60);
    return meta.filter(
      (m) => m.name.toLowerCase().includes(needle) || m.province.toLowerCase().includes(needle) || m.code.toLowerCase().includes(needle)
    ).slice(0, 60);
  }, [meta, q]);

  const day1 = forecast?.forecast_day1 ?? [];
  const maxWave = day1.length > 0 ? Math.max(...day1.map((s) => s.wave_height ?? 0)) : 0;
  const maxCat = waveCategory(maxWave);

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow="BMKG · Meteorologi Maritim"
        title="Cuaca maritim"
        description="Tinggi gelombang, angin, dan arus per pelabuhan/perairan. Sumber: maritim.bmkg.go.id. Aplikasi non-resmi."
      />
      <div className="flex flex-wrap gap-2">
        <div role="group" aria-label="Jenis lokasi maritim" className="flex gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-900">
          {(["pelabuhan", "perairan"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => pickKind(k)}
              aria-pressed={kind === k}
              className={`stateful min-h-9 rounded-full px-4 text-[13px] font-bold capitalize ${
                kind === k ? "bg-[#0B3D91] text-white shadow" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari pelabuhan / perairan / provinsi…"
          aria-label="Cari lokasi maritim"
          className="stateful min-h-11 min-w-52 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      {metaLoading && <div className="shimmer h-24 rounded-2xl" role="status" aria-label="Memuat daftar maritim" />}
      {metaError && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{metaError}</p>}
      {!metaLoading && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="listbox" aria-label="Pilih lokasi">
          {filtered.map((m) => (
            <button
              key={m.code}
              role="option"
              aria-selected={m.code === code}
              onClick={() => pickCode(m.code)}
              className={`stateful min-h-11 shrink-0 snap-start rounded-full border px-4 py-2 text-left text-[13px] font-bold ${
                m.code === code
                  ? "border-[#0B3D91] bg-[#0B3D91] text-white shadow"
                  : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              {m.name}
              <span className={`block text-[11px] font-medium ${m.code === code ? "text-sky-100" : "text-zinc-500"}`}>{m.province}</span>
            </button>
          ))}
        </div>
      )}
      {fcLoading && <div className="shimmer h-64 rounded-2xl" role="status" aria-label="Memuat prakiraan maritim" />}
      {fcError && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{fcError}</p>}
      {forecast && (
        <section aria-label={`Prakiraan ${forecast.name}`} className="overflow-hidden rounded-2xl bg-[#0B3D91] text-white shadow-lg">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold sm:text-xl">{forecast.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${maxCat.chip}`}>🌊 Maks {maxCat.label} {maxWave.toFixed(1)} m</span>
            </div>
            <p className="mt-1 text-xs text-sky-100">
              Terbit {forecast.issued} · berlaku {forecast.valid_from} s/d {forecast.valid_to}
            </p>
            <ol className="no-scrollbar -mx-1 mt-4 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
              {day1.slice(0, 24).map((s) => {
                const cat = waveCategory(s.wave_height ?? 0);
                return (
                  <li key={s.time} className="min-w-[132px] snap-start rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                    <p className="text-[11px] font-bold text-sky-100">{fmtTime(s.time)}</p>
                    <p className="mt-1 text-sm font-extrabold">{s.weather ?? "-"}</p>
                    <p className="mt-1 text-2xl font-extrabold">{(s.wave_height ?? 0).toFixed(1)}<span className="text-xs font-bold"> m</span></p>
                    <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-extrabold ${cat.chip}`}>{s.wave_cat ?? cat.label}</p>
                    <p className="mt-1.5 text-[11px] text-sky-100">💨 {s.wind_from} {s.wind_speed} kn (gust {s.wind_gust})</p>
                    <p className="text-[11px] text-sky-100">🌡 {s.temp_avg}° · 💧 {s.rh_avg}% · 👁 {s.visibility} km</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
