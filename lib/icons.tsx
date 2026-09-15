interface IconProps {
  className?: string;
}

function base(className = "h-5 w-5") {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  } as const;
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 2.7 17.66 8.36a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function WindIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CloudIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

export function ThermometerIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function SunriseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 9V2m0 0L8 6m4-4 4 4" />
      <path d="M4 22h16M2 18h2m16 0h2" />
    </svg>
  );
}

export function SunsetIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 2v7m0 0-4-4m4 4 4-4" />
      <path d="M4 22h16M2 18h2m16 0h2" />
    </svg>
  );
}

export function GaugeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M12 12 19 5M5 19a9 9 0 1 1 14 0" />
    </svg>
  );
}

export function UmbrellaIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 2a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 11v9m0 0a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ShirtIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Ikon navigasi tab + pintasan (satu sumber, dipakai page.tsx dan HomeScreen).
export function SunTabIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function MapIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
      <path d="M8 2v16M16 6v16" />
    </svg>
  );
}

export function AirListIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 22c4-4 8-7.5 8-12A8 8 0 0 0 4 10c0 4.5 4 8 8 12z" />
      <path d="M12 12V6" />
      <path d="M8 9l4-3 4 3" />
    </svg>
  );
}

export function CityIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14" />
      <path d="M9 9h1M9 13h1M17 9h1M17 13h1" />
    </svg>
  );
}

export function QuakeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4m0 4h.01" />
    </svg>
  );
}

export function WavesIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M2 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      <path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      <path d="M12 3v10m0 0-4-4m4 4 4-4" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
