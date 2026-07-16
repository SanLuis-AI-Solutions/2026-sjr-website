import { ShowroomPageClient } from "@/components/showroom-page-client";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Custom Design Showcase | Design Your Future Heirloom | Susie’s Jewelry Repair",
  description:
    "Browse mountings, settings, and bespoke inspiration in our custom design showcase, then work with our Pasadena workshop to create your future heirloom.",
  canonical: "/showroom",
});

export default function ShowroomPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Showroom", href: "/showroom" },
        ]}
      />
      <ShowroomPageClient />
    </>
  );
}
