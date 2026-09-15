import { tileUrl, OpenWeatherError } from "@/lib/openweather";

type TileCtx = { params: Promise<{ layer: string; z: string; x: string; y: string }> };

const LAYERS = new Set(["clouds", "precipitation", "temp", "wind", "pressure"]);

function parseTileCoord(value: string, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new OpenWeatherError(400, "Koordinat tile tidak valid");
  }
  return n;
}

export async function GET(_req: Request, ctx: TileCtx) {
  const { layer, z, x, y } = await ctx.params;
  try {
    if (!LAYERS.has(layer)) throw new OpenWeatherError(400, "Layer tidak valid");
    const zi = parseTileCoord(z, 0, 19);
    const xi = parseTileCoord(x, 0, 2 ** zi - 1);
    const yi = parseTileCoord(y, 0, 2 ** zi - 1);
    const target = tileUrl(layer, zi, xi, yi);
    const res = await fetch(target);
    if (!res.ok) throw new OpenWeatherError(res.status, `Tile error ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image/")) {
      throw new OpenWeatherError(502, `Tile error ${res.status}`);
    }
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=600" },
    });
  } catch (err) {
    if (err instanceof OpenWeatherError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Gagal mengambil tile" }, { status: 502 });
  }
}
