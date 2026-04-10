import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";

const page = getServiceAreaPage("pasadena");

export const metadata = createPageMetadata({
  title: page?.title || "Jewelry Repair in Pasadena, TX | Susie’s Jewelry Repair",
  description:
    page?.description ||
    "In-house Pasadena jewelry and watch repair with clear quotes, Same Day/Next Day service on many repairs, and direct local workshop guidance.",
  canonical: "/services/pasadena",
});

export default function PasadenaServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
