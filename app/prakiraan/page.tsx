import type { Metadata } from "next";
import ForecastScreen from "@/components/ForecastScreen";

export const metadata: Metadata = {
  title: "Prakiraan 5 Hari",
  description: "Prakiraan harian dan rincian tiga jam untuk kota yang sedang dipilih.",
};

export default function Page() {
  return <ForecastScreen />;
}
