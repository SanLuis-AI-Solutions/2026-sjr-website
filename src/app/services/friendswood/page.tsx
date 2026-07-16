import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";

const page = getServiceAreaPage("friendswood");

export const metadata = createPageMetadata({
  title: page?.title || "Jewelry Repair Near Friendswood, TX | Susie's Jewelry Repair",
  description:
    page?.description ||
    "In-house jewelry repair near Friendswood, TX for ring sizing, heirloom restoration, prong repair, and booking-first Pasadena service.",
  canonical: "/services/friendswood",
});

export default function FriendswoodServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
