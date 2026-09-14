// 16 mata angin searah jarum jam dimulai dari Utara.
const SECTORS = [
  "Utara",
  "Utara Timur Laut",
  "Timur Laut",
  "Timur Timur Laut",
  "Timur",
  "Timur Tenggara",
  "Tenggara",
  "Selatan Tenggara",
  "Selatan",
  "Selatan Barat Daya",
  "Barat Daya",
  "Barat Barat Daya",
  "Barat",
  "Barat Barat Laut",
  "Barat Laut",
  "Utara Barat Laut",
];

export function windDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  return SECTORS[Math.round(normalized / 22.5) % 16];
}

export function clock(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
