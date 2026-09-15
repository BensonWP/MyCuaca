"use client";

function pseudo(i: number, salt: number): number {
  return (i * 37 + salt * 17) % 100;
}

export default function WeatherEffects({ icon }: { icon: string }) {
  const code = icon.slice(0, 2);
  const night = icon.endsWith("n");

  if (code === "01" && !night) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="sun-core" />
        <div className="sun-rays" />
        <div className="wx-cloud wx-cloud-a" />
        <div className="wx-cloud wx-cloud-b" />
      </div>
    );
  }

  if (code === "01") {
    const stars = Array.from({ length: 28 }, (_, i) => ({
      left: `${pseudo(i, 3)}%`,
      top: `${pseudo(i, 7) * 0.6}%`,
      delay: `${(pseudo(i, 11) / 10).toFixed(1)}s`,
    }));
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="moon-glow" />
        {stars.map((s, i) => (
          <span key={i} className="wx-star" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
        ))}
      </div>
    );
  }

  if (code === "02" || code === "03" || code === "04") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="wx-cloud wx-cloud-a" />
        <div className="wx-cloud wx-cloud-b" />
        <div className="wx-cloud wx-cloud-c" />
      </div>
    );
  }

  if (code === "09" || code === "10") {
    const drops = Array.from({ length: 26 }, (_, i) => ({
      left: `${pseudo(i, 5)}%`,
      delay: `${(pseudo(i, 13) / 12).toFixed(2)}s`,
      duration: `${(0.7 + pseudo(i, 29) / 160).toFixed(2)}s`,
    }));
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="wx-cloud wx-cloud-a" />
        <div className="wx-cloud wx-cloud-b" />
        {drops.map((d, i) => (
          <span
            key={i}
            className="rain-drop"
            style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }}
          />
        ))}
      </div>
    );
  }

  if (code === "11") {
    const drops = Array.from({ length: 18 }, (_, i) => ({
      left: `${pseudo(i, 5)}%`,
      delay: `${(pseudo(i, 13) / 12).toFixed(2)}s`,
    }));
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="wx-cloud wx-cloud-a" />
        {drops.map((d, i) => (
          <span key={i} className="rain-drop" style={{ left: d.left, animationDelay: d.delay }} />
        ))}
        <div className="wx-bolt" />
      </div>
    );
  }

  if (code === "13") {
    const flakes = Array.from({ length: 24 }, (_, i) => ({
      left: `${pseudo(i, 2)}%`,
      delay: `${(pseudo(i, 19) / 8).toFixed(2)}s`,
      duration: `${(2.6 + pseudo(i, 23) / 30).toFixed(2)}s`,
    }));
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="snow-flake"
            style={{ left: f.left, animationDelay: f.delay, animationDuration: f.duration }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="fog-band fog-a" />
      <div className="fog-band fog-b" />
    </div>
  );
}
