"use client";

import { useMemo, useState } from "react";
import { useBmkg } from "@/app/bmkg-provider";
import { WILAYAH_POPULER } from "@/lib/wilayah";
import { isValidAdm4 } from "@/lib/bmkg";

export default function WilayahSearch({ compact = false }: { compact?: boolean }) {
  const { adm4, selectWilayah, cuaca } = useBmkg();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return WILAYAH_POPULER;
    return WILAYAH_POPULER.filter(
      (w) =>
        w.label.toLowerCase().includes(needle) ||
        w.sub.toLowerCase().includes(needle) ||
        w.adm4.includes(needle)
    );
  }, [q]);

  const customValid = isValidAdm4(q);
  const activeLabel = cuaca
    ? `${cuaca.lokasi.desa}, ${cuaca.lokasi.kecamatan}`
    : WILAYAH_POPULER.find((w) => w.adm4 === adm4)?.label ?? adm4;

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
            📍
          </span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={`Wilayah: ${activeLabel} — ketik nama kota atau kode adm4`}
            aria-label="Cari wilayah Indonesia (kode adm4 BMKG)"
            className="stateful min-h-11 w-full rounded-xl border border-[#0B3D91]/30 bg-white py-2 pl-9 pr-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 dark:border-sky-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        {customValid && (
          <button
            onClick={() => {
              selectWilayah(q);
              setOpen(false);
            }}
            className="stateful min-h-11 shrink-0 rounded-xl bg-[#0B3D91] px-4 py-2 text-sm font-bold text-white hover:bg-[#0a357e]"
          >
            Pakai {q.trim()}
          </button>
        )}
      </div>
      {open && (
        <>
          <button
            aria-label="Tutup daftar wilayah"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label="Wilayah populer BMKG"
            className="absolute inset-x-0 z-20 mt-2 max-h-72 overflow-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            {results.length === 0 && (
              <li className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                Tidak ketemu. Tempel kode adm4 (contoh 31.71.03.1001) lalu tekan Pakai.
              </li>
            )}
            {results.map((w) => {
              const active = w.adm4 === adm4;
              return (
                <li key={w.adm4}>
                  <button
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      selectWilayah(w.adm4);
                      setQ("");
                      setOpen(false);
                    }}
                    className={`stateful flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${
                      active ? "bg-[#0B3D91]/10 text-[#0B3D91] dark:text-sky-300" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold text-zinc-950 dark:text-white">
                        {w.label} {active ? "✓" : ""}
                      </span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                        {w.sub} · {w.adm4}
                      </span>
                    </span>
                    {!compact && (
                      <span className="shrink-0 rounded-full bg-[#0B3D91]/10 px-2 py-0.5 text-[11px] font-bold text-[#0B3D91] dark:text-sky-300">
                        BMKG
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
