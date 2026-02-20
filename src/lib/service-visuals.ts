type ServiceVisualBlueprint = {
  hero: string;
  support: string;
  processA: string;
  processB: string;
  processC: string;
  expectA: string;
  expectB: string;
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

const SERVICE_ASSET_BASE =
  "https://" +
  "lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v4";

const SERVICE_SLUGS = [
  "watch-repair",
  "ring-sizing",
  "stone-setting",
  "jewelry-cleaning",
  "necklace-repair",
  "bracelet-repair",
  "pearl-restringing",
  "custom-design",
  "heirloom-restoration",
] as const;

function serviceAssetUrl(slug: string, variant: string) {
  return `${SERVICE_ASSET_BASE}/${slug}-${variant}.jpg`;
}

const SERVICE_VISUALS_V3: Record<string, ServiceVisualBlueprint> = Object.fromEntries(
  SERVICE_SLUGS.map((slug) => [
    slug,
    {
      hero: serviceAssetUrl(slug, "hero"),
      support: serviceAssetUrl(slug, "support"),
      processA: serviceAssetUrl(slug, "process-a"),
      processB: serviceAssetUrl(slug, "process-b"),
      processC: serviceAssetUrl(slug, "process-c"),
      expectA: serviceAssetUrl(slug, "expect-a"),
      expectB: serviceAssetUrl(slug, "expect-b"),
      why: serviceAssetUrl(slug, "why"),
    },
  ])
) as Record<string, ServiceVisualBlueprint>;

const FALLBACK_VISUAL = SERVICE_VISUALS_V3["watch-repair"];

function getVisual(slug: string) {
  return SERVICE_VISUALS_V3[slug] || FALLBACK_VISUAL;
}

export function buildServiceVisualSet(
  slug: string,
  serviceName: string,
  heroImageSrc: string,
  isWatchRepair: boolean
): ServiceVisualSet {
  const visual = getVisual(slug);
  const heroSupport = visual.support || heroImageSrc || visual.hero;
  const processA = visual.processA || heroSupport;
  const processB = visual.processB || visual.expectA || heroSupport;
  const processC = visual.processC || visual.expectB || heroSupport;
  const expectA = visual.expectA || processB;
  const expectB = visual.expectB || processC;
  const whyImage = visual.why || heroSupport;

  if (isWatchRepair) {
    return {
      heroSupportImage: heroSupport,
      heroSupportImageAlt: "Watch movement and case work detail",
      processGallery: [
        { url: processA, alt: "Watch repair setup detail", label: "Service focus" },
        { url: processB, alt: "Watch movement precision detail", label: "Craft reference" },
        { url: processC, alt: "Watch finishing and inspection detail", label: "Finishing reference" },
      ],
      expectImages: [
        { url: expectA, alt: "Watch condition and parts inspection detail" },
        { url: expectB, alt: "Watch service completion detail" },
      ],
      whyImageSrc: whyImage,
      whyImageAlt: "Completed watch repair and in-house quality control detail",
    };
  }

  return {
    heroSupportImage: heroSupport,
    heroSupportImageAlt: `${serviceName} support detail`,
    processGallery: [
      { url: processA, alt: `${serviceName} service focus detail`, label: "Service focus" },
      { url: processB, alt: `${serviceName} craft detail`, label: "Craft reference" },
      { url: processC, alt: `${serviceName} finishing detail`, label: "Finishing reference" },
    ],
    expectImages: [
      { url: expectA, alt: `${serviceName} expectation detail` },
      { url: expectB, alt: `${serviceName} results detail` },
    ],
    whyImageSrc: whyImage,
    whyImageAlt: `${serviceName} in-house result detail`,
  };
}
