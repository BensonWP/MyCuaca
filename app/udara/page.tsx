import type { Metadata } from "next";
import AirScreen from "@/components/AirScreen";

export const metadata: Metadata = {
  title: "Kualitas Udara",
  description: "Indeks kualitas udara dan komponen polutan utama untuk kota yang sedang dipilih.",
};

export default function Page() {
  return <AirScreen />;
}
