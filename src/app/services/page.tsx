import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getServicesWithImages } from "@/lib/content-images";
import Image from "next/image";
import { ServicesGrid } from "@/components/services-grid";

export default async function ServicesPage() {
  const services = await getServicesWithImages();
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Services
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              Choose your repair service.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-stone-600">
              All work is performed locally with master‑level care. Ask for a
              fast quote or book a free assessment to confirm timing and
              pricing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-600">
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Same‑week timing
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Insured handling
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Local pickup
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-burgundy-deep"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="rounded-lg border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-burgundy transition hover:bg-brand-gold/10"
              >
                Book a Repair
              </Link>
            </div>

            <div className="mt-10 reveal-on-scroll">
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
                Jump to a service
              </p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {services.map((s: any) => (
                  <Link
                    key={s.slug}
                    href={`#service-${s.slug}`}
                    className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-[11px] font-semibold text-stone-700 transition hover:border-brand-gold/60 hover:text-brand-burgundy"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative reveal-on-scroll">
            <div className="relative h-[320px] overflow-hidden rounded-2xl border border-stone-200 shadow-sm md:h-[380px]">
              <Image
                src={services?.[0]?.image_url || services?.[0]?.image || "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A//www.w3.org/2000/svg'%20width%3D'1200'%20height%3D'900'%3E%3Crect%20width%3D'1200'%20height%3D'900'%20fill%3D'%23faf7f2'/%3E%3C/svg%3E"}
                alt="Jewelry repair workbench"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-burgundy/10 via-transparent to-brand-gold/20" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="relative h-28 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
                <Image
                  src={services?.[1]?.image_url || services?.[1]?.image || "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A//www.w3.org/2000/svg'%20width%3D'800'%20height%3D'600'%3E%3Crect%20width%3D'800'%20height%3D'600'%20fill%3D'%23f3ece5'/%3E%3C/svg%3E"}
                  alt="Repair detail"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-28 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
                <Image
                  src={services?.[2]?.image_url || services?.[2]?.image || "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A//www.w3.org/2000/svg'%20width%3D'800'%20height%3D'600'%3E%3Crect%20width%3D'800'%20height%3D'600'%20fill%3D'%23efe2d7'/%3E%3C/svg%3E"}
                  alt="Finished jewelry"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid
        services={services as any}
        kicker="All Services"
        title="In-house repair services"
        id="services-grid"
      />
    </SiteShell>
  );
}
