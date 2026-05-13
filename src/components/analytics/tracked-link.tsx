"use client";

import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
  id?: string;
  "aria-label"?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  [dataAttribute: `data-${string}`]: string | undefined;
};

export function TrackedLink({
  href,
  className,
  children,
  eventName,
  eventParams,
  id,
  "aria-label": ariaLabel,
  onClick,
  ...dataAttributes
}: TrackedLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      id={id}
      href={href}
      className={className}
      aria-label={ariaLabel}
      {...dataAttributes}
      onClick={(event) => {
        trackGaEvent(eventName, {
          page_path: pathname || "/",
          destination: href,
          ...eventParams,
        });
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
