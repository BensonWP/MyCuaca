import type { Metadata } from "next";
import CitiesScreen from "@/components/CitiesScreen";

export const metadata: Metadata = {
  title: "Kota Saya",
  description: "Kelola kota aktif, kota favorit, dan riwayat pencarian MyCuaca.",
};

export default function Page() {
  return <CitiesScreen />;
}
