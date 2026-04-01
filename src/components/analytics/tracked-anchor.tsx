"use client";

import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

type TrackedAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> & {
  href: string;
  children: ReactNode;
  eventName: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function TrackedAnchor({
  href,
  children,
  eventName,
  eventParams,
  onClick,
  ...rest
}: TrackedAnchorProps) {
  const pathname = usePathname();

  return (
    <a
      href={href}
      {...rest}
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
    </a>
  );
}
