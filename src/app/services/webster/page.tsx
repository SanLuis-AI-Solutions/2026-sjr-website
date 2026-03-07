import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceAreaLandingPage } from "@/components/service-area-page";
import { getServiceAreaPage } from "@/lib/service-areas";

const page = getServiceAreaPage("webster");

export const metadata: Metadata = {
  title: page?.title || "Jewelry Repair Near Webster, TX | Susie's Jewelry Repair",
  description:
    page?.description ||
    "Quote-first jewelry and watch repair near Webster, TX with in-house Pasadena work, clear approvals, and fast local guidance.",
  alternates: {
    canonical: "/services/webster",
  },
};

export default function WebsterServiceAreaPage() {
  if (!page) notFound();
  return <ServiceAreaLandingPage page={page} />;
}
