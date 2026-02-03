import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getServicesWithImages } from "@/lib/content-images";

export default async function ServicesPage() {
  const services = await getServicesWithImages();
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Services
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              In‑house repairs with transparent pricing
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
          </div>
          <div className="relative">
            <div
              className="h-[320px] rounded-2xl border border-stone-200 bg-cover bg-center shadow-sm md:h-[380px]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTHAFksQKw1RHywD2pW79qW96wBxOfYhr58a-xcgLwvoHAQt7Tj7cwUZZA8mMFyhcG6hUeE7tfx6Qthbgjuel0HIdQ2eDUsPqn2Z60rRMuQaJUK5m0Su8hgl_hEAfPL3WuM4F4YOakawldxzfB9O_3VoYBaXBwx2Xmf2rMew14HPL-M_X6J0MDtZ4il9H9Obfv3WWTJWVdIHV0y2Q35mom5cDvU6M_EvkidgO8zhZo8p0UYfm-I48JOsGr84gZdmn1a43ciaTAOSTC')",
              }}
              aria-hidden="true"
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div
                className="h-28 rounded-xl border border-stone-200 bg-cover bg-center shadow-sm"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASUeinXNm7VbDGm6RZ_5n4DeDScYuC8pIKvDRuw8id5vHJI-kLbUx19MSXQ7qh2VmkjtinhZ19PKr46JLw-U_m3GRyLKZKt5OK0lybRtsGm5oPjHteSS732er3XXV2-yCu8jid148aOjrTolvGaqSElqdVGml43_LYvOidjN3i1yH-XeQujSbwD32WfkZyUCpJaRjuJK0TJZ44vIKSXmrdo-PAlG7T9PEPveBiPYdSZO0e33c8_5Ur8vgfOfRNvBdOSVDln8qnkOso')",
                }}
                aria-hidden="true"
              />
              <div
                className="h-28 rounded-xl border border-stone-200 bg-cover bg-center shadow-sm"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1518544887872-6d1d3ed4b799?auto=format&fit=crop&w=800&q=80')",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-8">
            {services.map((service) => (
              <article
                key={service.slug}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:flex"
              >
                <div
                  className="h-48 w-full bg-cover bg-center md:h-auto md:w-64"
                  style={{ backgroundImage: `url('${service.image_url || service.image}')` }}
                  aria-hidden="true"
                />
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h2 className="font-serif text-2xl text-stone-900">
                      {service.name}
                    </h2>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep"
                    >
                      View details →
                    </Link>
                  </div>
                  <p className="mt-3 text-sm text-stone-600">
                    {service.summary || service.short_summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-600">
                    <span className="rounded-full border border-stone-200 px-3 py-1">
                      In‑house repair
                    </span>
                    <span className="rounded-full border border-stone-200 px-3 py-1">
                      Starting‑at pricing
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
