import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/theme-provider";
import { WeatherProvider } from "@/app/weather-provider";
import { BmkgProvider } from "@/app/bmkg-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyCuaca ala BMKG, Cuaca Indonesia",
  description: "Prakiraan BMKG per kelurahan, gempa terkini, peringatan dini, maritim, dan citra radar untuk Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("mycuaca.theme")||"sistem";var d=s==="sistem"?window.matchMedia("(prefers-color-scheme: dark)").matches:s==="gelap";if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <WeatherProvider>
            <BmkgProvider>
              {children}
            </BmkgProvider>
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
