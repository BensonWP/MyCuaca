"use client";

import { useMemo, useState } from "react";
import { useBmkg } from "@/app/bmkg-provider";
import SectionIntro from "@/components/SectionIntro";
import { parseCoords, shakemapUrl, type BmkgGempa } from "@/lib/bmkg";

type Filter = "realtime" | "terkini" | "dirasakan";

function magChip(mag: string): string {
  const m = Number(mag);
  if (m >= 6) return "bg-red-600 text-white";
  if (m >= 5) return "bg-orange-500 text-white";
  return "bg-amber-400 text-amber-950";
}

function GempaCard({ g, highlight = false }: { g: BmkgGempa; highlight?: boolean }) {
  const coords = parseCoords(g.Coordinates);
  const [imgOk, setImgOk] = useState(true);
  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-sm ${
        highlight
          ? "border-red-400 bg-gradient-to-br from-red-600 via-red-700 to-[#7f1d1d] text-white"
          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${magChip(g.Magnitude)}`}>
            M {g.Magnitude}
          </span>
          <span className={`text-xs font-bold ${highlight ? "text-red-100" : "text-zinc-500 dark:text-zinc-400"}`}>
            {g.Tanggal} · {g.Jam}
          </span>
          {g.Potensi && (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${highlight ? "bg-white/20" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
              {g.Potensi}
            </span>
          )}
        </div>
        <h3 className={`mt-2 text-lg font-extrabold ${highlight ? "" : "text-zinc-950 dark:text-white"}`}>
          {g.Wilayah}
        </h3>
        <dl className={`mt-3 grid grid-cols-2 gap-2 text-[13px] sm:grid-cols-4 ${highlight ? "text-red-50" : ""}`}>
          {[
            ["Kedalaman", g.Kedalaman],
            ["Lintang", g.Lintang],
            ["Bujur", g.Bujur],
            ["Dirasakan", g.Dirasakan ?? "-"],
          ].map(([k, v]) => (
            <div key={k} className={`rounded-xl px-3 py-2 ${highlight ? "bg-white/15" : "bg-zinc-100 dark:bg-zinc-800"}`}>
              <dt className={`text-xs ${highlight ? "text-red-100" : "text-zinc-500 dark:text-zinc-400"}`}>{k}</dt>
              <dd className={`mt-0.5 font-bold ${highlight ? "" : "text-zinc-900 dark:text-zinc-100"}`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          {coords && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=7/${coords.lat}/${coords.lon}`}
              target="_blank"
              rel="noreferrer"
              className={`rounded-full px-3 py-1.5 underline ${highlight ? "bg-white/15" : "bg-zinc-100 dark:bg-zinc-800"}`}
            >
              Lihat episenter {coords.lat}, {coords.lon}
            </a>
          )}
        </div>
      </div>
      {g.Shakemap && imgOk && (
        <div className={highlight ? "bg-black/20 p-4" : "bg-zinc-50 p-4 dark:bg-zinc-950"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shakemapUrl(g.Shakemap)}
            alt={`Peta guncangan gempa ${g.Wilayah}`}
            className="mx-auto max-h-72 rounded-xl border border-white/20 bg-white"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
          <p className={`mt-1 text-center text-[11px] ${highlight ? "text-red-100" : "text-zinc-500 dark:text-zinc-400"}`}>
            Shakemap BMKG · sumber: data.bmkg.go.id
          </p>
        </div>
      )}
    </article>
  );
}

export default function GempaScreen() {
  const { gempa, gempaLoading, gempaError, refresh } = useBmkg();
  const [filter, setFilter] = useState<Filter>("realtime");

  const list = useMemo(() => {
    if (!gempa) return [];
    return filter === "realtime" ? gempa.realtime : filter === "terkini" ? gempa.terkini : gempa.dirasakan;
  }, [gempa, filter]);

  if (gempaLoading && !gempa) {
    return (
      <div className="flex flex-col gap-3" role="status" aria-label="Memuat gempa">
        <div className="shimmer h-56 rounded-2xl" />
        <div className="shimmer h-32 rounded-2xl" />
      </div>
    );
  }
  if (!gempa) {
    return (
      <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
        <p className="font-bold">Data gempa BMKG belum bisa dimuat</p>
        <p className="mt-1">{gempaError ?? "Coba lagi."}</p>
        <button onClick={refresh} className="mt-3 min-h-11 rounded-xl bg-red-700 px-4 py-2 font-bold text-white">Coba lagi</button>
      </div>
    );
  }

  const latest = gempa.realtime[0];
  const big = latest && Number(latest.Magnitude) >= 5;

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow="BMKG · Geofisika"
        title="Gempa bumi terkini"
        description="Sumber: data.bmkg.go.id (TEWS). Aplikasi ini non-resmi — selalu cek infoBMKG resmi untuk keadaan darurat."
      />
      {big && (
        <p role="alert" className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md">
          ⚠ Gempa terbaru M {latest.Magnitude} — {latest.Wilayah}. {latest.Potensi ?? ""}
        </p>
      )}
      {latest && <GempaCard g={latest} highlight />}
      <div role="group" aria-label="Filter gempa" className="flex gap-1 rounded-full border border-zinc-200 bg-zinc-100 p-1 sm:w-fit dark:border-zinc-700 dark:bg-zinc-900">
        {(
          [
            ["realtime", "Terbaru"],
            ["terkini", "M 5,0+"],
            ["dirasakan", "Dirasakan"],
          ] as [Filter, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            aria-pressed={filter === v}
            className={`stateful min-h-9 flex-1 rounded-full px-4 text-[13px] font-bold sm:flex-none ${
              filter === v
                ? "bg-[#0B3D91] text-white shadow"
                : "text-zinc-600 hover:bg-white dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.slice(filter === "realtime" ? 1 : 0, 10).map((g, i) => (
          <GempaCard key={`${g.DateTime}-${i}`} g={g} />
        ))}
      </div>
    </div>
  );
}
