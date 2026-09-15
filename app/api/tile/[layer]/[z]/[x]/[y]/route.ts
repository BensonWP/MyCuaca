import { tileUrl, OpenWeatherError } from "@/lib/openweather";

type TileCtx = { params: Promise<{ layer: string; z: string; x: string; y: string }> };

export async function GET(_req: Request, ctx: TileCtx) {
  const { layer, z, x, y } = await ctx.params;
  try {
    const target = tileUrl(layer, Number(z), Number(x), Number(y));
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
