import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlowingShadowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowClassName?: string;
}

export function GlowingShadow({
  children,
  className,
  glowClassName,
  ...props
}: GlowingShadowProps) {
  return (
    <div
      className={cn("group/glowing-shadow relative isolate w-full rounded-lg", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 rounded-[inherit] opacity-0 blur-md transition-opacity duration-500",
          "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.34),transparent_58%),linear-gradient(135deg,rgba(245,158,11,0.26),rgba(146,64,14,0.18),rgba(255,255,255,0)_72%)]",
          "group-hover/glowing-shadow:opacity-100 group-focus-within/glowing-shadow:opacity-100",
          glowClassName
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] ring-1 ring-transparent transition duration-500 group-hover/glowing-shadow:ring-amber-500/35 group-focus-within/glowing-shadow:ring-amber-500/35 dark:group-hover/glowing-shadow:ring-amber-400/30 dark:group-focus-within/glowing-shadow:ring-amber-400/30"
      />
      <div className="relative z-10 h-full rounded-[inherit]">{children}</div>
    </div>
  );
}
