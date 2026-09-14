"use client";

import { clock } from "@/lib/format";

interface Props {
  sunrise: number;
  sunset: number;
  now: number;
}

// Busur perjalanan matahari: menjawab "siang sudah sejauh apa" sekilas.
// Titik dihitung dari waktu terbit, terbenam, dan waktu data saat ini.
export default function SunArc({ sunrise, sunset, now }: Props) {
  const progress = Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)));
  const day = now >= sunrise && now <= sunset;
  const angle = progress * Math.PI;
  const x = 100 - 80 * Math.cos(angle);
  const y = 100 - 80 * Math.sin(angle);

  return (
    <div role="img" aria-label={`Matahari terbit ${clock(sunrise)}, terbenam ${clock(sunset)}`}>
      <svg viewBox="0 0 200 112" className="h-24 w-44" aria-hidden>
        <line x1="8" y1="100" x2="192" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        {day && <circle cx={x} cy={y} r="7" fill="currentColor" />}
      </svg>
      <div className="mt-1 flex w-44 justify-between text-xs opacity-90">
        <span>{clock(sunrise)}</span>
        <span>{clock(sunset)}</span>
      </div>
    </div>
  );
}
