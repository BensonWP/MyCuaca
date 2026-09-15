"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Frame {
  time: number;
  path: string;
}

interface Props {
  host: string;
  frames: Frame[];
  kind: "radar" | "satelit";
  lat: number;
  lon: number;
}

function frameTime(t: number): string {
  return new Date(t * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CitraView({ host, frames, kind, lat, lon }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.TileLayer[]>([]);
  const idxRef = useRef(frames.length - 1);
  // Parent me-remount via key saat kind/frames berubah, jadi snapshot mount-once aman.
  const [init] = useState(() => ({ host, frames, kind, lat, lon }));
  const timeId = `citra-time-${kind}`;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true }).setView([init.lat, init.lon], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Peta dasar OpenStreetMap",
      maxZoom: 12,
    }).addTo(map);
    const color = init.kind === "radar" ? 2 : 0;
    const options = init.kind === "radar" ? "smooth_snow" : "hatch";
    layersRef.current = init.frames.map((f, i) =>
      L.tileLayer(`${init.host}${f.path}/256/{z}/{x}/{y}/${color}/${options}.png`, {
        opacity: i === init.frames.length - 1 ? 0.7 : 0,
        maxZoom: 12,
        zIndex: 10,
      }).addTo(map)
    );
    idxRef.current = init.frames.length - 1;
    mapRef.current = map;
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      layersRef.current = [];
    };
  }, [init]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) map.setView([lat, lon], map.getZoom());
  }, [lat, lon]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden || layersRef.current.length === 0) return;
      idxRef.current = (idxRef.current + 1) % layersRef.current.length;
      layersRef.current.forEach((layer, i) => layer.setOpacity(i === idxRef.current ? 0.7 : 0));
      const el = document.getElementById(timeId);
      const f = frames[idxRef.current];
      if (el && f) el.textContent = frameTime(f.time);
    }, 1200);
    return () => clearInterval(id);
  }, [frames, timeId]);

  const current = frames[frames.length - 1];

  return (
    <div>
      <div
        ref={containerRef}
        role="application"
        aria-label={`Animasi citra ${kind} untuk Indonesia`}
        className="h-[52dvh] min-h-80 w-full rounded-2xl"
      />
      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        Frame: <span id={timeId} className="font-bold">{current ? frameTime(current.time) : "-"}</span> · animasi berputar otomatis · {frames.length} frame terakhir
      </p>
    </div>
  );
}
