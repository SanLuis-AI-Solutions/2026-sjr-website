import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";

const page = getServiceAreaPage("la-porte");

export const metadata = createPageMetadata({
  title: page?.title || "Jewelry Repair Near La Porte, TX | Susie’s Jewelry Repair",
  description:
    page?.description ||
    "Quote-first jewelry and watch repair near La Porte, TX with in-house work, clear approvals, and a short drive to our Pasadena workshop.",
  canonical: "/services/la-porte",
});

export default function LaPorteServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
