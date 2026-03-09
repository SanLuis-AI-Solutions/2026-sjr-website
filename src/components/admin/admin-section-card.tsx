import { ReactNode } from "react";

type AdminSectionCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AdminSectionCard({
  title,
  eyebrow,
  description,
  action,
  children,
  className = "",
  contentClassName = "",
}: AdminSectionCardProps) {
  return (
    <section
      className={[
        "admin-panel rounded-[1.75rem] border border-stone-200 bg-white/88 p-4 shadow-[0_18px_48px_rgba(58,25,16,0.10)] backdrop-blur-xl md:p-5",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 border-b border-stone-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-burgundy">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 font-serif text-[1.8rem] leading-none text-stone-900">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={["mt-4", contentClassName].join(" ").trim()}>{children}</div>
    </section>
  );
}
