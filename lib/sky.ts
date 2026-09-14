export interface SkyTheme {
  panel: string;
  heading: string;
  body: string;
  line: string;
}

// Latar hero mengikuti kode ikon OpenWeather agar halaman ringkasan terasa reaktif.
// Kombinasi warna dipilih untuk teks terang pada panel utama.
export function skyTheme(icon: string): SkyTheme {
  const code = icon.slice(0, 2);
  const night = icon.endsWith("n");
  const base = {
    heading: "text-white",
    body: "text-white/85",
    line: "bg-white/30",
  };

  if (code === "01" && !night) {
    return { ...base, panel: "bg-sky-700 dark:bg-sky-800" };
  }
  if (code === "01") {
    return { ...base, panel: "bg-slate-950 dark:bg-black" };
  }
  if (code === "02" || code === "03" || code === "04") {
    return { ...base, panel: "bg-slate-700 dark:bg-slate-900" };
  }
  if (code === "09" || code === "10") {
    return { ...base, panel: "bg-blue-900 dark:bg-blue-950" };
  }
  if (code === "11") {
    return { ...base, panel: "bg-zinc-950 dark:bg-black" };
  }
  if (code === "13") {
    return {
      heading: "text-slate-950 dark:text-white",
      body: "text-slate-800 dark:text-white/85",
      line: "bg-slate-900/20 dark:bg-white/30",
      panel: "bg-slate-200 dark:bg-slate-900",
    };
  }
  return { ...base, panel: "bg-stone-700 dark:bg-stone-900" };
}
