import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServicesGrid } from "@/components/services-grid";
import { CraftStory, HomeCta, HomeFaq, InHouseBadge, ProcessSteps, ProofBand, ShowroomBand, Testimonials } from "@/components/home-sections";
import { servicesSchema, faqSchema } from "@/lib/schema";
import { getServicesWithImages } from "@/lib/content-images";

export const metadata: Metadata = {
  title: "Jewelry Repair in Pasadena, TX | Watch, Ring & Stone Repair | Susie’s Jewelry Repair",
  description:
    "Visit our Pasadena, TX workshop for in-house jewelry repair, watch batteries, ring sizing, stone replacement, and heirloom restoration with clear quote-first guidance.",
  alternates: {
    canonical: "/",
  },
};

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
      <CraftStory />
      <ShowroomBand />
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
      <main id="main-content" className="overflow-hidden pt-24 md:pt-28">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
