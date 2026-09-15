import { BmkgError, getGempa } from "@/lib/bmkg";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jenis = searchParams.get("jenis") ?? "all";
  try {
    if (jenis === "all") {
      const [realtime, terkini, dirasakan] = await Promise.allSettled([
        getGempa("realtime"),
        getGempa("terkini"),
        getGempa("dirasakan"),
      ]);
      return Response.json({
        realtime: realtime.status === "fulfilled" ? realtime.value : [],
        terkini: terkini.status === "fulfilled" ? terkini.value : [],
        dirasakan: dirasakan.status === "fulfilled" ? dirasakan.value : [],
      });
    }
    if (jenis === "realtime" || jenis === "terkini" || jenis === "dirasakan") {
      return Response.json(await getGempa(jenis));
    }
    throw new BmkgError(400, "jenis tidak valid (all|realtime|terkini|dirasakan)");
  } catch (err) {
    if (err instanceof BmkgError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Gagal memuat data gempa BMKG" }, { status: 502 });
  }
}
