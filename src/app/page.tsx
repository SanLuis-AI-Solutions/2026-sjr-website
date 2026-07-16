import Link from "next/link";
import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { ServicesGrid } from "@/components/services-grid";
import { DiscoveryLinks, HomeCta, HomeFaq, InHouseBadge, ProcessSteps, ProofBand, Testimonials } from "@/components/home-sections";
import { HomeCommercialGuides } from "@/components/home-commercial-guides";
import { faqSchema, homePageSchema, organizationSchema, servicesSchema, websiteSchema } from "@/lib/schema";
import { getServicesWithImages } from "@/lib/content-images";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title:
    "Jewelry Repair in Pasadena, TX | Book Watch & Ring Service",
  description:
    "Book in-house jewelry and watch service in Pasadena, TX for batteries, ring sizing, chain work, stone tightening, cleanings, and fast local turnaround.",
  canonical: "/",
});

async function ServicesGridSection() {
  const services = await getServicesWithImages();
  return (
    <ServicesGrid
      services={services}
      kicker="Service menu"
      title="All Jewelry and Watch Services"
    />
  );
}

function PopularRepairPaths() {
  return (
    <section className="border-t border-stone-200 bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
          Start here
        </p>
        <h2 className="mt-3 font-serif text-3xl text-stone-900">
          Book fast or jump to the service you already need.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          The highest-intent routes right now are booking, ring sizing, and watch battery service.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/book", label: "Book a Repair" },
            { href: "/services/ring-sizing", label: "Ring Sizing" },
            { href: "/services/watch-repair", label: "Watch Battery & Repair" },
            { href: "/services", label: "All Services" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-5 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

async function HomeDeferredContent() {
  await Promise.resolve();

  return (
    <>
      <PopularRepairPaths />
      <ProofBand />
      <InHouseBadge />
      <ProcessSteps />
      <ServicesGridSection />
      <Testimonials />
      <HomeFaq />
      <DiscoveryLinks />
      <HomeCta />
      <HomeCommercialGuides />
    </>
  );
}

export default async function Home() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="overflow-hidden pt-[81px] sm:pt-[89px]">
        <Hero />
        <Suspense fallback={null}>
          <HomeDeferredContent />
        </Suspense>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
