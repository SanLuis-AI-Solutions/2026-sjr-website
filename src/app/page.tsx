import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServicesGrid } from "@/components/services-grid";
import { CraftStory, HomeCta, HomeFaq, InHouseBadge, ProcessSteps, ProofBand, Testimonials } from "@/components/home-sections";
import { localBusinessSchema, servicesSchema, faqSchema } from "@/lib/schema";
import { getServicesWithImages } from "@/lib/content-images";

export default async function Home() {
  const services = await getServicesWithImages();

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden pt-10 md:pt-12">
        <Hero />
        <ProofBand />
        <InHouseBadge />
        <ProcessSteps />
        <ServicesGrid services={services} />
        <CraftStory />
        <Testimonials />
        <HomeFaq />
        <HomeCta />
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema()),
        }}
      />
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
