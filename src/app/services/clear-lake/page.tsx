import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";

const page = getServiceAreaPage("clear-lake");

export const metadata: Metadata = {
  title: page?.title || "Jewelry Repair Near Clear Lake, TX | Susie's Jewelry Repair",
  description:
    page?.description ||
    "Nearby Pasadena jewelry and watch repair for Clear Lake customers with quote-first guidance, in-house work, and clear approvals.",
  alternates: {
    canonical: "/services/clear-lake",
  },
};

export default function ClearLakeServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
