"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-checked={isDark}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-7 w-[52px] items-center rounded-full border p-0.5",
        "border-border bg-secondary hover:bg-accent",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          "pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full shadow-sm",
          "bg-card text-primary",
          "transition-transform duration-300 ease-out",
          isDark ? "translate-x-[24px]" : "translate-x-0"
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
