"use client";

import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    document.documentElement.classList.add("dark");
  }, []);

  const value = {
    theme: "dark" as Theme,
    toggleTheme: () => {},
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
