import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "3 days ago", "2 months ago" — a compact, human last-updated label. */
export function formatRelativeTime(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;

  const diffMs = Date.now() - then;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> =
    [
      { amount: 60, unit: "second" },
      { amount: 60, unit: "minute" },
      { amount: 24, unit: "hour" },
      { amount: 7, unit: "day" },
      { amount: 4.34524, unit: "week" },
      { amount: 12, unit: "month" },
      { amount: Number.POSITIVE_INFINITY, unit: "year" },
    ];

  let value = diffMs / 1000;
  for (const division of divisions) {
    if (Math.abs(value) < division.amount) {
      return rtf.format(-Math.round(value), division.unit);
    }
    value /= division.amount;
  }
  return null;
}

/** 1200 → "1.2k". Keeps star/stat counts tidy. */
export function formatCompactNumber(value: number): string {
  if (value < 1000) return String(value);
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
