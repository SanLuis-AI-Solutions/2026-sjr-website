import type { ComponentPropsWithoutRef } from "react";

type BrandMarkProps = ComponentPropsWithoutRef<"svg">;

export function BrandMark({ className, ...rest }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="6" y="6" width="52" height="52" rx="18" fill="#FAF7F2" />
      <rect
        x="6.75"
        y="6.75"
        width="50.5"
        height="50.5"
        rx="17.25"
        stroke="#D1B882"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path
        d="M23 18.5L32 10L41 18.5L36.5 29H27.5L23 18.5Z"
        fill="#D1B882"
        fillOpacity="0.28"
        stroke="#7A2E3A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 29H36.5"
        stroke="#7A2E3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 36C20 29.3726 25.3726 24 32 24C38.6274 24 44 29.3726 44 36C44 42.6274 38.6274 48 32 48C25.3726 48 20 42.6274 20 36Z"
        stroke="#7A2E3A"
        strokeWidth="3.5"
      />
      <circle cx="32" cy="18.5" r="3" fill="#7A2E3A" />
    </svg>
  );
}
