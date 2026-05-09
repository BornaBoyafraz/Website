import type { SVGProps } from "react";

type LoomIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export default function LoomIcon({
  size = 24,
  width,
  height,
  ...props
}: LoomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width ?? size}
      height={height ?? size}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.75 8.65v6.7L15.6 12 9.75 8.65Z"
        fill="currentColor"
      />
    </svg>
  );
}
