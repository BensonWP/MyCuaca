export type ThemeSetting = "terang" | "gelap" | "sistem";
export type ResolvedTheme = "terang" | "gelap";

const THEME_KEY = "mycuaca.theme";

export function getThemeSetting(): ThemeSetting {
  if (typeof window === "undefined") return "sistem";
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "terang" || stored === "gelap" || stored === "sistem" ? stored : "sistem";
}

export function saveThemeSetting(setting: ThemeSetting) {
  localStorage.setItem(THEME_KEY, setting);
}

export function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  if (setting === "gelap") return "gelap";
  if (setting === "terang") return "terang";
  if (typeof window === "undefined") return "terang";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang";
}

export function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "gelap");
}
