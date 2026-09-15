import {
  geocode,
  reverseGeocode,
  getAirPollution,
  OpenWeatherError,
} from "@/lib/openweather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  try {
    if (type === "geocode") {
      const q = searchParams.get("q")?.trim().slice(0, 60);
      if (!q) throw new OpenWeatherError(400, "Query kosong");
      return Response.json(await geocode(q));
    }

    if (type === "reverse") {
      if (!Number.isFinite(lat) || !Number.isFinite(lon))
        throw new OpenWeatherError(400, "lat/lon tidak valid");
      return Response.json(await reverseGeocode(lat, lon));
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lon))
      throw new OpenWeatherError(400, "lat/lon tidak valid");

    switch (type) {
      case "aqi":
        return Response.json(await getAirPollution(lat, lon));
      default:
        throw new OpenWeatherError(400, "type tidak valid");
    }
  } catch (err) {
    if (err instanceof OpenWeatherError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Gagal menghubungi OpenWeather" }, { status: 502 });
  }
}
