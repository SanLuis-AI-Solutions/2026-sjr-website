import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

type BreadcrumbItem = {
  name: string;
  href: string;
};

type BreadcrumbTrailProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BreadcrumbTrail({ items, className = "" }: BreadcrumbTrailProps) {
  if (items.length === 0) return null;

  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 ${className}`.trim()}
      >
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <span key={item.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true" className="text-stone-400">/</span> : null}
              {isCurrent ? (
                <span aria-current="page" className="text-brand-burgundy">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  prefetch={false}
                  className="transition hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
