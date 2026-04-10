"use client";

import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { TrackedAnchor } from "./tracked-anchor";

type BusinessAction = "phone_call" | "email_contact" | "directions" | "reviews";

const EVENT_NAME_BY_ACTION: Record<BusinessAction, string> = {
  phone_call: "phone_call_click",
  email_contact: "email_contact_click",
  directions: "directions_click",
  reviews: "review_click",
};

type BusinessActionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href"
> & {
  action: BusinessAction;
  href: string;
  placement: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
};

export function BusinessActionLink({
  action,
  href,
  placement,
  children,
  eventParams,
  onClick,
  ...props
}: BusinessActionLinkProps) {
  return (
    <TrackedAnchor
      {...props}
      href={href}
      eventName={EVENT_NAME_BY_ACTION[action]}
      eventParams={{
        business_action: action,
        placement,
        ...eventParams,
      }}
      onClick={onClick}
    >
      {children}
    </TrackedAnchor>
  );
}
