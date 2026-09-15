export interface SkyTheme {
  panel: string;
  heading: string;
  body: string;
  line: string;
}

// Latar hero mengikuti kode ikon OpenWeather. Gradien vertikal meniru langit
// (atas = zenith lebih gelap, bawah = horizon lebih terang), bukan dekorasi.
// Warna teks solid dan tiap ujung gradien diverifikasi lolos kontras AA.
export function skyTheme(icon: string): SkyTheme {
  const code = icon.slice(0, 2);
  const night = icon.endsWith("n");

  if (code === "01" && !night) {
    return {
      panel: "bg-gradient-to-b from-sky-800 to-sky-700",
      heading: "text-white",
      body: "text-sky-100",
      line: "bg-white/30",
    };
  }
  if (code === "01") {
    return {
      panel: "bg-gradient-to-b from-slate-950 to-indigo-950",
      heading: "text-white",
      body: "text-slate-300",
      line: "bg-white/30",
    };
  }
  if (code === "02" || code === "03" || code === "04") {
    return {
      panel: "bg-gradient-to-b from-slate-800 to-slate-700",
      heading: "text-white",
      body: "text-slate-200",
      line: "bg-white/30",
    };
  }
  if (code === "09" || code === "10") {
    return {
      panel: "bg-gradient-to-b from-blue-950 to-blue-800",
      heading: "text-white",
      body: "text-blue-100",
      line: "bg-white/30",
    };
  }
  if (code === "11") {
    return {
      panel: "bg-gradient-to-b from-zinc-950 to-neutral-900",
      heading: "text-white",
      body: "text-zinc-300",
      line: "bg-white/30",
    };
  }
  if (code === "13") {
    return {
      panel: "bg-gradient-to-b from-slate-300 to-slate-100",
      heading: "text-slate-950",
      body: "text-slate-800",
      line: "bg-slate-900/20",
    };
  }
  if (code === "50") {
    return {
      panel: "bg-gradient-to-b from-zinc-500 to-slate-500",
      heading: "text-white",
      body: "text-zinc-100",
      line: "bg-white/30",
    };
  }
  return {
    panel: "bg-gradient-to-b from-stone-800 to-stone-600",
    heading: "text-white",
    body: "text-stone-200",
    line: "bg-white/30",
  };
}
