import { BmkgError, getMaritimForecast, getMaritimMeta } from "@/lib/bmkg";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jenis = searchParams.get("jenis") ?? "";
  const kode = searchParams.get("kode")?.trim() ?? "";
  try {
    if (jenis === "meta-pelabuhan") return Response.json(await getMaritimMeta("pelabuhan"));
    if (jenis === "meta-perairan") return Response.json(await getMaritimMeta("perairan"));
    if ((jenis === "pelabuhan" || jenis === "perairan") && kode) {
      return Response.json(await getMaritimForecast(jenis, kode));
    }
    throw new BmkgError(400, "jenis tidak valid (meta-pelabuhan|meta-perairan|pelabuhan|perairan + kode)");
  } catch (err) {
    if (err instanceof BmkgError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Gagal memuat data maritim BMKG" }, { status: 502 });
  }
}
