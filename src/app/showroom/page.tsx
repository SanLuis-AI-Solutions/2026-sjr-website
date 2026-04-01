import type { Metadata } from "next";
import { ShowroomPageClient } from "@/components/showroom-page-client";

export const metadata: Metadata = {
  title: "Custom Design Showcase | Design Your Future Heirloom | Susie’s Jewelry Repair",
  description:
    "Browse mountings, settings, and bespoke inspiration in our custom design showcase, then work with our Pasadena workshop to create your future heirloom.",
  alternates: {
    canonical: "/showroom",
  },
};

export default function ShowroomPage() {
  return <ShowroomPageClient />;
}
