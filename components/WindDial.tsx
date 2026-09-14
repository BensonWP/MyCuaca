"use client";

import { formatSpeed } from "@/lib/storage";
import { Unit } from "@/lib/storage";
import { windDirection } from "@/lib/format";

interface Props {
  speed: number;
  deg: number;
  unit: Unit;
}

// Dial kompas: panah menunjuk arah angin bertiup (derajat OpenWeather = arah datangnya angin).
export default function WindDial({ speed, deg, unit }: Props) {
  return (
    <div role="img" aria-label={`Angin ${formatSpeed(speed, unit)} dari arah ${windDirection(deg)}`}>
      <svg viewBox="0 0 96 96" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
        <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <text x="48" y="14" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">U</text>
        <text x="48" y="88" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">S</text>
        <text x="86" y="52" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">T</text>
        <text x="10" y="52" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">B</text>
        <g style={{ transform: `rotate(${(deg + 180) % 360}deg)`, transformOrigin: "48px 48px" }}>
          <line x1="48" y1="48" x2="48" y2="22" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="48,14 43,24 53,24" fill="currentColor" />
        </g>
        <circle cx="48" cy="48" r="4" fill="currentColor" />
      </svg>
      <p className="mt-1 text-center text-xs opacity-90">
        {formatSpeed(speed, unit)} {windDirection(deg)}
      </p>
    </div>
  );
}
