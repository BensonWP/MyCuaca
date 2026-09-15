// Daftar wilayah populer terverifikasi langsung ke api.bmkg.go.id (Sep 2026).
// Format adm4 Kemendagri: provinsi.kabkota.kecamatan.kelurahan.

import { isValidAdm4 } from "@/lib/bmkg";

export interface Wilayah {
  adm4: string;
  label: string;
  sub: string;
}

export const WILAYAH_POPULER: Wilayah[] = [
  { adm4: "31.71.03.1001", label: "Kemayoran", sub: "Jakarta Pusat, DKI Jakarta" },
  { adm4: "31.71.01.1001", label: "Menteng", sub: "Jakarta Pusat, DKI Jakarta" },
  { adm4: "32.73.01.1001", label: "Sukarasa", sub: "Bandung, Jawa Barat" },
  { adm4: "35.78.01.1001", label: "Surabaya", sub: "Kota Surabaya, Jawa Timur" },
  { adm4: "12.71.01.1001", label: "Medan", sub: "Kota Medan, Sumatera Utara" },
  { adm4: "33.74.01.1001", label: "Semarang", sub: "Kota Semarang, Jawa Tengah" },
  { adm4: "34.71.01.1001", label: "Yogyakarta", sub: "Kota Yogyakarta, DIY" },
  { adm4: "73.71.01.1001", label: "Makassar", sub: "Kota Makassar, Sulawesi Selatan" },
  { adm4: "51.71.01.1001", label: "Denpasar", sub: "Kota Denpasar, Bali" },
  { adm4: "16.71.01.1001", label: "Palembang", sub: "Kota Palembang, Sumatera Selatan" },
  { adm4: "64.71.01.1001", label: "Balikpapan", sub: "Kota Balikpapan, Kalimantan Timur" },
  { adm4: "71.71.01.1001", label: "Manado", sub: "Kota Manado, Sulawesi Utara" },
  { adm4: "91.71.01.1001", label: "Jayapura", sub: "Kota Jayapura, Papua" },
  { adm4: "35.29.24.2001", label: "Pajanangger", sub: "Sumenep, Jawa Timur" },
];

export const DEFAULT_ADM4 = "31.71.03.1001";

const WILAYAH_KEY = "mycuaca.bmkg.wilayah";

// Batas kasar Indonesia untuk menentukan modul BMKG aktif/nonaktif.
export function isIndonesia(lat: number, lon: number): boolean {
  return lat >= -11.5 && lat <= 6.5 && lon >= 94 && lon <= 142;
}

export function getStoredAdm4(): string {
  if (typeof window === "undefined") return DEFAULT_ADM4;
  const stored = localStorage.getItem(WILAYAH_KEY)?.trim() ?? "";
  return isValidAdm4(stored) ? stored : DEFAULT_ADM4;
}

export function saveAdm4(adm4: string) {
  localStorage.setItem(WILAYAH_KEY, adm4.trim());
}
