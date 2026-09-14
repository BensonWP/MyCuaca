"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ResolvedTheme,
  ThemeSetting,
  applyTheme,
  getThemeSetting,
  resolveTheme,
  saveThemeSetting,
} from "@/lib/theme";

interface ThemeContextValue {
  setting: ThemeSetting;
  resolved: ResolvedTheme;
  setSetting: (setting: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>("sistem");
  const [resolved, setResolved] = useState<ResolvedTheme>("terang");

  useEffect(() => {
    const id = setTimeout(() => {
      const stored = getThemeSetting();
      const next = resolveTheme(stored);
      setSettingState(stored);
      setResolved(next);
      applyTheme(next);
    }, 0);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getThemeSetting() === "sistem") {
        const next = resolveTheme("sistem");
        setResolved(next);
        applyTheme(next);
      }
    };
    media.addEventListener("change", onChange);
    return () => {
      clearTimeout(id);
      media.removeEventListener("change", onChange);
    };
  }, []);

  const setSetting = useCallback((next: ThemeSetting) => {
    saveThemeSetting(next);
    setSettingState(next);
    const resolvedNext = resolveTheme(next);
    setResolved(resolvedNext);
    applyTheme(resolvedNext);
  }, []);

  const value = useMemo(() => ({ setting, resolved, setSetting }), [setting, resolved, setSetting]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  return ctx;
}
