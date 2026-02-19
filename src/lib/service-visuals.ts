type ServiceVisualBlueprint = {
  hero: string;
  detailA: string;
  detailB: string;
  detailC: string;
};

export type ServiceVisualSet = {
  heroSupportImage: string;
  heroSupportImageAlt: string;
  processGallery: { url: string; alt: string; label: string }[];
  expectImages: { url: string; alt: string }[];
  whyImageSrc: string;
  whyImageAlt: string;
};

const SERVICE_VISUALS_V2: Record<string, ServiceVisualBlueprint> = {
  "watch-repair": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/watch-repair-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/watch-repair-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/watch-repair-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/watch-repair-detail-c.jpg",
  },
  "ring-sizing": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/ring-sizing-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/ring-sizing-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/ring-sizing-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/ring-sizing-detail-c.jpg",
  },
  "stone-setting": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/stone-setting-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/stone-setting-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/stone-setting-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/stone-setting-detail-c.jpg",
  },
  "jewelry-cleaning": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/jewelry-cleaning-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/jewelry-cleaning-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/jewelry-cleaning-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/jewelry-cleaning-detail-c.jpg",
  },
  "necklace-repair": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/necklace-repair-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/necklace-repair-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/necklace-repair-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/necklace-repair-detail-c.jpg",
  },
  "bracelet-repair": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/bracelet-repair-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/bracelet-repair-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/bracelet-repair-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/bracelet-repair-detail-c.jpg",
  },
  "pearl-restringing": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/pearl-restringing-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/pearl-restringing-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/pearl-restringing-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/pearl-restringing-detail-c.jpg",
  },
  "custom-design": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/custom-design-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/custom-design-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/custom-design-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/custom-design-detail-c.jpg",
  },
  "heirloom-restoration": {
    hero: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/heirloom-restoration-hero.jpg",
    detailA:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/heirloom-restoration-detail-a.jpg",
    detailB:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/heirloom-restoration-detail-b.jpg",
    detailC:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v2/heirloom-restoration-detail-c.jpg",
  },
};

const FALLBACK_VISUAL = SERVICE_VISUALS_V2["watch-repair"];

function getVisual(slug: string) {
  return SERVICE_VISUALS_V2[slug] || FALLBACK_VISUAL;
}

export function buildServiceVisualSet(
  slug: string,
  serviceName: string,
  heroImageSrc: string,
  isWatchRepair: boolean
): ServiceVisualSet {
  const visual = getVisual(slug);

  const primaryDetail = visual.detailA;
  const secondaryDetail = visual.detailB;
  const tertiaryDetail = visual.detailC;

  if (isWatchRepair) {
    return {
      heroSupportImage: primaryDetail,
      heroSupportImageAlt: "Watch movement and case work detail",
      processGallery: [
        { url: primaryDetail, alt: "Watch repair setup detail", label: "Service focus" },
        { url: secondaryDetail, alt: "Watch movement precision detail", label: "Craft reference" },
        { url: tertiaryDetail, alt: "Watch finishing and inspection detail", label: "Finishing reference" },
      ],
      expectImages: [
        { url: secondaryDetail, alt: "Watch condition and parts inspection detail" },
        { url: tertiaryDetail, alt: "Watch service completion detail" },
      ],
      whyImageSrc: primaryDetail,
      whyImageAlt: "Completed watch repair and in-house quality control detail",
    };
  }

  return {
    heroSupportImage: primaryDetail,
    heroSupportImageAlt: `${serviceName} support detail`,
    processGallery: [
      { url: primaryDetail, alt: `${serviceName} service focus detail`, label: "Service focus" },
      { url: secondaryDetail, alt: `${serviceName} craft detail`, label: "Craft reference" },
      { url: tertiaryDetail, alt: `${serviceName} finishing detail`, label: "Finishing reference" },
    ],
    expectImages: [
      { url: secondaryDetail, alt: `${serviceName} expectation detail` },
      { url: tertiaryDetail, alt: `${serviceName} results detail` },
    ],
    whyImageSrc: primaryDetail,
    whyImageAlt: `${serviceName} in-house result detail`,
  };
}
