import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { ServicesGrid } from "@/components/services-grid";
import { CraftStory, HomeCta, HomeFaq, InHouseBadge, ProcessSteps, ProofBand, ShowcaseBand, Testimonials } from "@/components/home-sections";
import { HomeCommercialGuides } from "@/components/home-commercial-guides";
import { servicesSchema, faqSchema } from "@/lib/schema";
import { getServicesWithImages } from "@/lib/content-images";
import { createPageMetadata } from "@/lib/metadata";
export const metadata = createPageMetadata({
  title:
    "Jewelry Repair Near Me in Pasadena, TX | Expert Service",
  description:
    "Need jewelry repair near me in Pasadena, TX? Get expert in-house ring sizing, watch repair, stone setting, cleaning, same-day service, and free quotes.",
  canonical: "/",
});

async function ServicesGridSection() {
  const services = await getServicesWithImages();
  return <ServicesGrid services={services} />;
}

async function HomeDeferredContent() {
  await Promise.resolve();

  return (
    <>
      <ProofBand />
      <InHouseBadge />
      <ProcessSteps />
      <ServicesGridSection />
      <HomeCommercialGuides />
      <CraftStory />
      <ShowcaseBand />
      <Testimonials />
      <HomeFaq />
      <HomeCta />
    </>
  );
}

export default async function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="pointer-events-none fixed left-4 top-4 z-[999] -translate-y-24 rounded-full bg-brand-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition focus:pointer-events-auto focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="overflow-hidden pb-24 pt-24 md:pb-0 md:pt-28">
        <Hero />
        <Suspense fallback={null}>
          <HomeDeferredContent />
        </Suspense>
      </main>
      <MobileStickyCta />
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
