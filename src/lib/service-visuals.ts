import { SERVICES } from "@/lib/constants";

type ServiceVisualBlueprint = {
  heroSupport: string;
  process: [string, string, string];
  expect: [string, string];
  why: string;
};

export type ServiceVisualSet = {
  heroSupportImage: string;
  heroSupportImageAlt: string;
  processGallery: { url: string; alt: string; label: string }[];
  expectImages: { url: string; alt: string }[];
  whyImageSrc: string;
  whyImageAlt: string;
};

const SERVICE_IMAGE_BY_SLUG = Object.fromEntries(
  SERVICES.map((item) => [item.slug, item.image])
) as Record<string, string>;

const ASSET_LABEL_BY_URL: Record<string, string> = Object.fromEntries(
  SERVICES.map((item) => [item.image, item.name])
);

const AUX_IMAGES = {
  heroRing:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/hero-ring.jpg",
  workshopMain:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg",
  workshopSketches:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg",
  workshopPocketWatch:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg",
  beforeRing:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/before-after/before-ring.jpg",
  afterRing:
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/before-after/after-ring.png",
};

const BLUEPRINTS: Record<string, ServiceVisualBlueprint> = {
  "ring-sizing": {
    heroSupport: AUX_IMAGES.beforeRing,
    process: [
      SERVICE_IMAGE_BY_SLUG["ring-sizing"],
      SERVICE_IMAGE_BY_SLUG["stone-setting"],
      SERVICE_IMAGE_BY_SLUG["custom-design"],
    ],
    expect: [SERVICE_IMAGE_BY_SLUG["heirloom-restoration"], AUX_IMAGES.afterRing],
    why: SERVICE_IMAGE_BY_SLUG["ring-sizing"],
  },
  "stone-setting": {
    heroSupport: AUX_IMAGES.workshopSketches,
    process: [
      SERVICE_IMAGE_BY_SLUG["stone-setting"],
      SERVICE_IMAGE_BY_SLUG["ring-sizing"],
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
    ],
    expect: [SERVICE_IMAGE_BY_SLUG["custom-design"], SERVICE_IMAGE_BY_SLUG["watch-repair"]],
    why: SERVICE_IMAGE_BY_SLUG["stone-setting"],
  },
  "jewelry-cleaning": {
    heroSupport: AUX_IMAGES.workshopMain,
    process: [
      SERVICE_IMAGE_BY_SLUG["jewelry-cleaning"],
      SERVICE_IMAGE_BY_SLUG["necklace-repair"],
      SERVICE_IMAGE_BY_SLUG["bracelet-repair"],
    ],
    expect: [
      SERVICE_IMAGE_BY_SLUG["pearl-restringing"],
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
    ],
    why: SERVICE_IMAGE_BY_SLUG["jewelry-cleaning"],
  },
  "necklace-repair": {
    heroSupport: AUX_IMAGES.heroRing,
    process: [
      SERVICE_IMAGE_BY_SLUG["necklace-repair"],
      SERVICE_IMAGE_BY_SLUG["bracelet-repair"],
      SERVICE_IMAGE_BY_SLUG["pearl-restringing"],
    ],
    expect: [
      SERVICE_IMAGE_BY_SLUG["jewelry-cleaning"],
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
    ],
    why: SERVICE_IMAGE_BY_SLUG["necklace-repair"],
  },
  "bracelet-repair": {
    heroSupport: AUX_IMAGES.workshopMain,
    process: [
      SERVICE_IMAGE_BY_SLUG["bracelet-repair"],
      SERVICE_IMAGE_BY_SLUG["necklace-repair"],
      SERVICE_IMAGE_BY_SLUG["pearl-restringing"],
    ],
    expect: [
      SERVICE_IMAGE_BY_SLUG["jewelry-cleaning"],
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
    ],
    why: SERVICE_IMAGE_BY_SLUG["bracelet-repair"],
  },
  "pearl-restringing": {
    heroSupport: AUX_IMAGES.afterRing,
    process: [
      SERVICE_IMAGE_BY_SLUG["pearl-restringing"],
      SERVICE_IMAGE_BY_SLUG["necklace-repair"],
      SERVICE_IMAGE_BY_SLUG["bracelet-repair"],
    ],
    expect: [
      SERVICE_IMAGE_BY_SLUG["jewelry-cleaning"],
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
    ],
    why: SERVICE_IMAGE_BY_SLUG["pearl-restringing"],
  },
  "custom-design": {
    heroSupport: AUX_IMAGES.workshopSketches,
    process: [
      SERVICE_IMAGE_BY_SLUG["custom-design"],
      SERVICE_IMAGE_BY_SLUG["ring-sizing"],
      SERVICE_IMAGE_BY_SLUG["stone-setting"],
    ],
    expect: [SERVICE_IMAGE_BY_SLUG["heirloom-restoration"], AUX_IMAGES.beforeRing],
    why: SERVICE_IMAGE_BY_SLUG["custom-design"],
  },
  "heirloom-restoration": {
    heroSupport: AUX_IMAGES.workshopMain,
    process: [
      SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
      SERVICE_IMAGE_BY_SLUG["custom-design"],
      SERVICE_IMAGE_BY_SLUG["stone-setting"],
    ],
    expect: [SERVICE_IMAGE_BY_SLUG["ring-sizing"], SERVICE_IMAGE_BY_SLUG["watch-repair"]],
    why: SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
  },
};

function labelForUrl(url: string, fallbackName: string) {
  return ASSET_LABEL_BY_URL[url] || fallbackName;
}

export function buildServiceVisualSet(
  slug: string,
  serviceName: string,
  heroImageSrc: string,
  isWatchRepair: boolean
): ServiceVisualSet {
  if (isWatchRepair) {
    return {
      heroSupportImage: AUX_IMAGES.workshopPocketWatch,
      heroSupportImageAlt: "Watch movement on the jeweler's bench",
      processGallery: [
        {
          url: AUX_IMAGES.workshopMain,
          alt: "Workbench and precision tools",
          label: "On the bench",
        },
        {
          url: AUX_IMAGES.workshopSketches,
          alt: "Technical sketches and service planning",
          label: "Precision first",
        },
        {
          url: AUX_IMAGES.workshopPocketWatch,
          alt: "Pocket watch during in-house service",
          label: "Careful finishing",
        },
      ],
      expectImages: [
        {
          url: AUX_IMAGES.workshopPocketWatch,
          alt: "Watch component detail under inspection",
        },
        {
          url: heroImageSrc,
          alt: serviceName,
        },
      ],
      whyImageSrc: heroImageSrc,
      whyImageAlt: serviceName,
    };
  }

  const blueprint = BLUEPRINTS[slug];
  if (!blueprint) {
    return {
      heroSupportImage: AUX_IMAGES.workshopMain,
      heroSupportImageAlt: "In-house workshop detail",
      processGallery: [
        { url: heroImageSrc, alt: serviceName, label: "Service focus" },
        {
          url: SERVICE_IMAGE_BY_SLUG["heirloom-restoration"],
          alt: "Heirloom Restorations craftsmanship",
          label: "Craft reference",
        },
        {
          url: SERVICE_IMAGE_BY_SLUG["custom-design"],
          alt: "Custom Design finishing detail",
          label: "Finishing reference",
        },
      ],
      expectImages: [
        {
          url: SERVICE_IMAGE_BY_SLUG["stone-setting"],
          alt: "Stone Replacement & Settings bench detail",
        },
        {
          url: SERVICE_IMAGE_BY_SLUG["ring-sizing"],
          alt: "Ring Sizing & Repair process detail",
        },
      ],
      whyImageSrc: heroImageSrc,
      whyImageAlt: serviceName,
    };
  }

  return {
    heroSupportImage: blueprint.heroSupport,
    heroSupportImageAlt: `${serviceName} support image`,
    processGallery: blueprint.process.map((url, index) => {
      const label = index === 0 ? "Service focus" : index === 1 ? "Craft reference" : "Finishing reference";
      return {
        url,
        alt: `${labelForUrl(url, serviceName)} detail`,
        label,
      };
    }),
    expectImages: blueprint.expect.map((url) => ({
      url,
      alt: `${labelForUrl(url, serviceName)} detail`,
    })),
    whyImageSrc: blueprint.why,
    whyImageAlt: `${labelForUrl(blueprint.why, serviceName)} in-house result`,
  };
}
