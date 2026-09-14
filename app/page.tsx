import type { Metadata } from "next";
import HomeScreen from "@/components/HomeScreen";

export const metadata: Metadata = {
  title: "Ringkasan Cuaca",
  description: "Kondisi cuaca saat ini, fakta kunci, beberapa jam ke depan, dan kota favorit.",
};

export default function Page() {
  return <HomeScreen />;
}
