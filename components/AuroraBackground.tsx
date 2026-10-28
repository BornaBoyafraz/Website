import { cn } from "@/lib/cn";

/**
 * A soft, slowly-drifting multi-hue aurora. Rendered as an absolute layer
 * inside a section (sits above the section's background color, below content),
 * it injects living color into the dark canvas. Motion is handled by CSS
 * keyframes, so prefers-reduced-motion freezes it automatically.
 */
export default function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="aurora-blob aurora-blob--1" />
      <div className="aurora-blob aurora-blob--2" />
      <div className="aurora-blob aurora-blob--3" />
      <div className="aurora-blob aurora-blob--4" />
      <div className="aurora-blob aurora-blob--5" />
    </div>
  );
}
