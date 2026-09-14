import type { Metadata } from "next";
import MapScreen from "@/components/MapScreen";

export const metadata: Metadata = {
  title: "Peta Cuaca",
  description: "Peta awan, curah hujan, dan suhu untuk kota yang sedang dipilih.",
};

export default function Page() {
  return <MapScreen />;
}
