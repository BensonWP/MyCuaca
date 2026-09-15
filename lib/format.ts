// 16 mata angin searah jarum jam dimulai dari Utara.
// Konvensi Indonesia: [Arah Primer] [Arah Sekunder]
const SECTORS = [
  "Utara",
  "Timur Laut Utara",
  "Timur Laut",
  "Timur Laut Timur",
  "Timur",
  "Timur Tenggara",
  "Tenggara",
  "Tenggara Selatan",
  "Selatan",
  "Barat Daya Selatan",
  "Barat Daya",
  "Barat Daya Barat",
  "Barat",
  "Barat Laut Barat",
  "Barat Laut",
  "Barat Laut Utara",
];

export function windDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  return SECTORS[Math.round(normalized / 22.5) % 16];
}

export function formatHour(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Parser waktu lokal BMKG "YYYY-MM-DD HH:MM:SS".
// Prioritaskan timestamp UTC jika tersedia, fallback ke local_datetime dengan asumsi WIB (UTC+7).
function parseBmkgLocal(local: string, utc?: string): Date {
  if (utc) {
    const d = new Date(utc);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(local.replace(" ", "T") + "+07:00");
  if (!isNaN(d.getTime())) return d;
  return new Date(local.replace(" ", "T"));
}

export function formatBmkgHour(local: string, utc?: string): string {
  const d = parseBmkgLocal(local, utc);
  if (Number.isNaN(d.getTime())) return local.slice(11, 16);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function formatBmkgDay(local: string, utc?: string): string {
  const d = parseBmkgLocal(local, utc);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}
