export interface SkyTheme {
  panel: string;
  heading: string;
  body: string;
  line: string;
}

// Latar hero mengikuti kode ikon OpenWeather. Warna teks solid, bukan transparan,
// dan tiap pasangan sudah diverifikasi lolos kontras AA (contrast-check.py).
export function skyTheme(icon: string): SkyTheme {
  const code = icon.slice(0, 2);
  const night = icon.endsWith("n");

  if (code === "01" && !night) {
    return { panel: "bg-sky-700", heading: "text-white", body: "text-sky-100", line: "bg-white/30" };
  }
  if (code === "01") {
    return { panel: "bg-slate-950", heading: "text-white", body: "text-slate-300", line: "bg-white/30" };
  }
  if (code === "02" || code === "03" || code === "04") {
    return { panel: "bg-slate-700", heading: "text-white", body: "text-slate-200", line: "bg-white/30" };
  }
  if (code === "09" || code === "10") {
    return { panel: "bg-blue-900", heading: "text-white", body: "text-blue-100", line: "bg-white/30" };
  }
  if (code === "11") {
    return { panel: "bg-zinc-950", heading: "text-white", body: "text-zinc-300", line: "bg-white/30" };
  }
  if (code === "13") {
    return {
      panel: "bg-slate-200",
      heading: "text-slate-950",
      body: "text-slate-800",
      line: "bg-slate-900/20",
    };
  }
  return { panel: "bg-stone-700", heading: "text-white", body: "text-stone-200", line: "bg-white/30" };
}
