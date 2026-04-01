import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";

const page = getServiceAreaPage("deer-park");

export const metadata = createPageMetadata({
  title: page?.title || "Jewelry Repair Near Deer Park, TX | Susie’s Jewelry Repair",
  description:
    page?.description ||
    "In-house jewelry and watch repair near Deer Park, TX with clear quotes, Same Day/Next Day service on many repairs, and a Pasadena workshop you can visit directly.",
  canonical: "/services/deer-park",
});

export default function DeerParkServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
