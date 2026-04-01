"use client";

import { TrackedAnchor } from "@/components/analytics/tracked-anchor";
import { TrackedLink } from "@/components/analytics/tracked-link";

type MobileActionShelfEventParams = Record<string, string | number | boolean | null | undefined>;

type MobileAction = {
  href: string;
  label: string;
  eventName: string;
  eventParams?: MobileActionShelfEventParams;
  ariaLabel?: string;
  kind?: "primary" | "secondary" | "text";
};

type MobileActionShelfProps = {
  eyebrow: string;
  title: string;
  summary?: string;
  actions: MobileAction[];
};

function actionClassName(kind: MobileAction["kind"]) {
  if (kind === "secondary") {
    return "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
  }

  if (kind === "text") {
    return "text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600 underline decoration-brand-gold/60 underline-offset-4 transition hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
  }

  return "inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";
}

export function MobileActionShelf({
  eyebrow,
  title,
  summary,
  actions,
}: MobileActionShelfProps) {
  const primaryActions = actions.filter((action) => action.kind !== "text");
  const textActions = actions.filter((action) => action.kind === "text");

  return (
    <section
      role="region"
      aria-label="Quick actions"
      className="border-y border-stone-200/70 bg-white md:hidden"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-burgundy">
            {eyebrow}
          </p>
          <p className="text-sm font-semibold text-stone-900">{title}</p>
          {summary ? <p className="text-xs leading-5 text-stone-600">{summary}</p> : null}
        </div>

        {primaryActions.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {primaryActions.map((action) => {
              const className = actionClassName(action.kind);

              if (action.href.startsWith("tel:")) {
                return (
                  <TrackedAnchor
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    aria-label={action.ariaLabel}
                    eventName={action.eventName}
                    eventParams={action.eventParams}
                    className={className}
                  >
                    {action.label}
                  </TrackedAnchor>
                );
              }

              return (
                <TrackedLink
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  aria-label={action.ariaLabel}
                  eventName={action.eventName}
                  eventParams={action.eventParams}
                  className={className}
                >
                  {action.label}
                </TrackedLink>
              );
            })}
          </div>
        ) : null}

        {textActions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {textActions.map((action) => (
              <TrackedLink
                key={`${action.href}-${action.label}`}
                href={action.href}
                aria-label={action.ariaLabel}
                eventName={action.eventName}
                eventParams={action.eventParams}
                className={actionClassName("text")}
              >
                {action.label}
              </TrackedLink>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
