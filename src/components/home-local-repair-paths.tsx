import Link from "next/link";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { PRIORITY_REPAIR_PATHS } from "@/lib/priority-repair-paths";

export function HomeLocalRepairPaths() {
  return (
    <section className="bg-[#faf7f2] py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-stone-200 bg-white/82 p-5 shadow-[0_18px_44px_rgba(58,25,16,0.10)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Local repair paths
              </p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
                Start with the route that matches your repair.
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-700 md:leading-7">
                If you are comparing nearby service, city pages explain the drive-in workflow.
                If the issue is specific, these guides help you decide whether to quote first or
                book an in-shop assessment.
              </p>
            </div>

            <div className="grid gap-3 md:hidden">
              <details className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-stone-900">
                  Nearby city pages
                </summary>
                <div className="mt-3 grid gap-2">
                  {SERVICE_AREA_PAGES.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/services/${area.slug}`}
                      className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Jewelry repair near {area.city}
                    </Link>
                  ))}
                </div>
              </details>

              <details className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-stone-900">
                  Decision guides
                </summary>
                <div className="mt-3 grid gap-2">
                  {PRIORITY_REPAIR_PATHS.slice(0, 4).map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="rounded-xl border border-stone-200 bg-white px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      <span className="block text-sm font-semibold text-stone-900">
                        {guide.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-stone-600">
                        {guide.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </details>
            </div>

            <div className="hidden gap-5 md:grid md:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                  Nearby cities
                </p>
                <div className="mt-3 grid gap-2">
                  {SERVICE_AREA_PAGES.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/services/${area.slug}`}
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Jewelry repair near {area.city}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                  Decision guides
                </p>
                <div className="mt-3 grid gap-2">
                  {PRIORITY_REPAIR_PATHS.slice(0, 4).map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 transition hover:border-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      <span className="block text-sm font-semibold text-stone-900">
                        {guide.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-stone-600">
                        {guide.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
