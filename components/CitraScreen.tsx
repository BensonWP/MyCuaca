"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SectionIntro from "@/components/SectionIntro";
import { useBmkg } from "@/app/bmkg-provider";

const CitraView = dynamic(() => import("@/components/CitraView"), {
  ssr: false,
  loading: () => <div className="shimmer h-[52dvh] min-h-80 w-full rounded-2xl" />,
});

interface Frame {
  time: number;
  path: string;
}

type Kind = "radar" | "satelit";

export default function CitraScreen() {
  const { cityCoords } = useBmkg();
  const [kind, setKind] = useState<Kind>("radar");
  const [host, setHost] = useState("");
  const [radar, setRadar] = useState<Frame[]>([]);
  const [satellite, setSatellite] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/bmkg/citra")
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Gagal");
        if (cancel) return;
        setHost(body.host as string);
        setRadar(body.radar as Frame[]);
        setSatellite(body.satellite as Frame[]);
      })
      .catch((err: unknown) => !cancel && setError(err instanceof Error ? err.message : "Gagal"))
      .finally(() => !cancel && setLoading(false));
    return () => { cancel = true; };
  }, []);

  const frames = kind === "radar" ? radar : satellite;

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow="Radar & Satelit"
        title="Citra cuaca"
        description="Animasi radar dan satelit inframerah (RainViewer) untuk memantau pergerakan awan dan hujan. Sumber tile: RainViewer."
      />
      <div role="group" aria-label="Jenis citra" className="flex gap-1 self-start rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-900">
        {(["radar", "satelit"] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`stateful min-h-9 rounded-full px-5 text-[13px] font-bold capitalize ${
              kind === k ? "bg-[#0B3D91] text-white shadow" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {k === "radar" ? "📡 Radar" : "🛰 Satelit"}
          </button>
        ))}
      </div>
      {loading && <div className="shimmer h-[52dvh] min-h-80 rounded-2xl" role="status" aria-label="Memuat citra" />}
      {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{error}</p>}
      {!loading && !error && frames.length > 0 && (
        <section aria-label={`Citra ${kind}`} className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm sm:p-5 dark:border-zinc-700/70 dark:bg-zinc-900">
          <CitraView key={`${kind}-${frames.length}`} host={host} frames={frames} kind={kind} lat={cityCoords.lat} lon={cityCoords.lon} />
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Biru–hijau = hujan ringan, kuning–merah = hujan lebat. Satelit inframerah menunjukkan suhu puncak awan (putih = awan tinggi/dingin).
          </p>
        </section>
      )}
      {!loading && !error && frames.length === 0 && (
        <p className="rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900">Belum ada frame {kind} saat ini.</p>
      )}
    </div>
  );
}
