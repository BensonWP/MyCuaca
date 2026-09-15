// Proxy daftar frame citra radar + satelit RainViewer (gratis, tanpa key).
// Tile dicache CDN tilecache.rainviewer.com dan dimuat langsung dari browser.

export async function GET() {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
      headers: { "User-Agent": "MyCuaca/1.0" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`RainViewer ${res.status}`);
    const body = await res.json();
    return Response.json({
      host: body.host as string,
      radar: (body.radar?.past ?? []).slice(-12) as { time: number; path: string }[],
      satellite: (body.satellite?.infrared ?? []).slice(-8) as { time: number; path: string }[],
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("RainViewer fetch error:", err);
    }
    return Response.json({ error: "Gagal memuat data citra" }, { status: 502 });
  }
}
