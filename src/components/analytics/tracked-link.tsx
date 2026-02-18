"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
};

export function TrackedLink({
  href,
  className,
  children,
  eventName,
  eventParams,
}: TrackedLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackGaEvent(eventName, {
          page_path: pathname || "/",
          destination: href,
          ...eventParams,
        })
      }
    >
      {children}
    </Link>
  );
}
