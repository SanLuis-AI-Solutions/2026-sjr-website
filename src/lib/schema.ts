import { BUSINESS, SERVICES } from "./constants";
import { SERVICE_AREA_PAGES } from "./service-areas";
import { getSiteUrl } from "./site-url";

type Service = (typeof SERVICES)[number] & {
  image_url?: string | null;
  short_summary?: string;
};
type ServiceFaq = {
  question: string;
  answer: string;
};

export function localBusinessSchema() {
  const areaServed = Array.from(
    new Set([BUSINESS.address.city, ...SERVICE_AREA_PAGES.map((page) => page.city)]),
  ).map((area) => ({
    "@type": "City",
    name: area,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    name: BUSINESS.name,
    url: "https://www.susiesjewelryrepair.com/",
    image: [
      "https://www.susiesjewelryrepair.com/images/about/storefront.jpg",
      "https://www.susiesjewelryrepair.com/images/home/home-hero-ring.jpg",
    ],
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.6504877,
      longitude: -95.1863662,
    },
    hasMap: BUSINESS.googleMapsUrl,
    areaServed,
    openingHoursSpecification: (BUSINESS.hours || []).flatMap((h) => {
      const hoursStr = h.hours || "";
      if (hoursStr.toLowerCase() === "closed") return [];
      const times = hoursStr.includes("–") ? hoursStr.split("–") : hoursStr.split("-");
      const parseTime = (t: string) => {
        const cleaned = t.trim();
        if (cleaned.toLowerCase() === "closed") return null;
        const [time, period] = cleaned.split(" ");
        const [hoursRaw, minutes] = (time || "0:0").split(":").map(Number);
        let hours = hoursRaw;
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
      };

      const opens = parseTime(times[0] || "");
      const closes = times[1] ? parseTime(times[1]) : opens;

      return [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: opens || "00:00",
        closes: closes || "00:00",
      }];
    }),
    sameAs: BUSINESS.sameAs,
  };
}

export function servicesSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jewelry Repair Services",
    itemListElement: (SERVICES || []).map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        "@id": `${siteUrl}/services/${service.slug}#service`,
        url: `${siteUrl}/services/${service.slug}`,
        name: service.name,
        description: service.summary,
      },
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are you a jewelry store or a repair shop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Susie's Jewelry Repair is a local jewelry repair shop in Pasadena focused on in-house repairs, watch batteries, ring sizing, stone setting, cleaning, and custom design guidance.",
        },
      },
      {
        "@type": "Question",
        name: "Do you repair jewelry in-house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all repairs are performed on-site.",
        },
      },
    ],
  };
}
export function serviceSchema(service: Service | undefined) {
  if (!service) return {};
  const siteUrl = getSiteUrl();
  const areaServed = Array.from(
    new Set([BUSINESS.address.city, ...SERVICE_AREA_PAGES.map((page) => page.city)]),
  ).map((area) => ({
    "@type": "City",
    name: area,
  }));
  const summary = service.summary || service.short_summary || "";
  const serviceUrl = `${siteUrl}/services/${service.slug}`;
  const serviceImage = service.image || service.image_url || "";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    url: serviceUrl,
    name: service.name,
    serviceType: service.name,
    category: "Jewelry repair and watch repair",
    description: summary,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": serviceUrl,
    },
    ...(serviceImage
      ? {
          image: serviceImage.startsWith("http") ? serviceImage : `${siteUrl}${serviceImage}`,
        }
      : {}),
    provider: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} repair options`,
      itemListElement: (service.includes || []).map((item, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: item,
          provider: {
            "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
          },
        },
      })),
    },
  };
}

export function serviceFaqSchema(service: (Service & { faqs?: ServiceFaq[] }) | undefined) {
  if (!service || !service.faqs) return {};
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (service.faqs || []).map((faq: ServiceFaq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
