import { BmkgError, getBmkgCuaca } from "@/lib/bmkg";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm4 = searchParams.get("adm4")?.trim() ?? "";
  try {
    return Response.json(await getBmkgCuaca(adm4));
  } catch (err) {
    if (err instanceof BmkgError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Gagal memuat data BMKG" }, { status: 502 });
  }
}
