export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readTime: string;
  keyTakeaways: string[];
  sections: BlogSection[];
  relatedServiceSlugs: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-a-jeweler",
    title: "How to Choose a Trustworthy Jeweler",
    excerpt:
      "How to evaluate in-house craftsmanship, clear approvals, and long-term care before you hand over a meaningful piece.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg",
    publishedAt: "2026-02-17",
    readTime: "4 min read",
    keyTakeaways: [
      "Ask if repairs are done in-house or outsourced.",
      "Get pricing and timing confirmed before work starts.",
      "Choose shops that inspect settings and finish before pickup.",
    ],
    sections: [
      {
        heading: "Start with process transparency",
        body: [
          "A trustworthy jeweler explains the repair plan in plain language before any work begins. You should know what is being fixed, why it is needed, what it costs to start, and how long it is expected to take.",
          "If scope changes after assessment, the shop should pause and ask for approval before continuing. That approval checkpoint is one of the strongest signs you are working with a responsible team.",
        ],
      },
      {
        heading: "Look for in-house capability",
        body: [
          "In-house service gives you clearer communication and better control of timing. Your piece stays in one shop instead of moving between third parties.",
          "For sentimental or high-value items, this reduces handling risk and gives you a direct line to the people doing the work.",
        ],
      },
      {
        heading: "Prioritize quality checks, not speed promises",
        body: [
          "Fast service is valuable, but final checks matter just as much. Good jewelers verify fit, setting security, polish quality, and overall wearability before pickup.",
          "The best outcome is not just a finished repair. It is a piece that wears safely and looks right long after collection day.",
        ],
      },
    ],
    relatedServiceSlugs: ["heirloom-restoration", "stone-setting", "ring-sizing"],
  },
  {
    slug: "ring-sizing-guide",
    title: "Ring Sizing: What to Know Before You Resize",
    excerpt:
      "When to size up or down, what affects pricing, and how to protect setting integrity throughout the sizing process.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/ring-sizing.jpg",
    publishedAt: "2026-02-17",
    readTime: "5 min read",
    keyTakeaways: [
      "Sizing method depends on metal type, style, and size change.",
      "Stone settings should be checked before and after sizing.",
      "White gold often benefits from rhodium refinishing after work.",
    ],
    sections: [
      {
        heading: "Sizing up vs. sizing down",
        body: [
          "Sizing up usually requires adding metal and blending the seam so the ring keeps its shape and finish. Sizing down removes material, then reshapes and balances the band for comfort.",
          "Both approaches should start with a fit discussion, including seasonal swelling, stacking preferences, and daily-wear comfort.",
        ],
      },
      {
        heading: "What can limit resizing",
        body: [
          "Some designs are harder to resize safely, especially full-eternity bands, engraved patterns, and certain alternative metals.",
          "A responsible jeweler will explain limits early and suggest the safest path if full resizing is not recommended.",
        ],
      },
      {
        heading: "Protecting stones and settings",
        body: [
          "Prongs and settings should be inspected before and after sizing, especially on rings with multiple stones or older mountings.",
          "If reinforcement is needed, that should be discussed as a separate approval so you stay in control of final scope and pricing.",
        ],
      },
    ],
    relatedServiceSlugs: ["ring-sizing", "stone-setting", "jewelry-cleaning"],
  },
  {
    slug: "watch-battery-replacement",
    title: "Watch Battery Replacement: Timing and Care Tips",
    excerpt:
      "What to expect during battery service, when pressure testing matters, and how to reduce avoidable watch damage.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/watch-repair.jpg",
    publishedAt: "2026-02-17",
    readTime: "4 min read",
    keyTakeaways: [
      "Not every battery issue is just a battery issue.",
      "Seal checks and pressure tests matter on water-exposed watches.",
      "Delaying replacement increases risk of leakage damage.",
    ],
    sections: [
      {
        heading: "Why timing matters",
        body: [
          "When a battery weakens, some watches start losing time before they stop. Waiting too long can increase risk of battery leakage and internal damage.",
          "Early replacement is usually faster and lower risk than waiting for complete failure.",
        ],
      },
      {
        heading: "What service should include",
        body: [
          "A quality battery service should include fit and function checks, plus a seal or gasket review when relevant.",
          "For watches exposed to water, pressure testing can help confirm sealing at the time of service.",
        ],
      },
      {
        heading: "When to consider full service",
        body: [
          "If your watch still runs poorly after battery replacement, there may be movement wear, moisture issues, or part failures that need deeper work.",
          "A clear assessment before proceeding protects both budget and long-term watch health.",
        ],
      },
    ],
    relatedServiceSlugs: ["watch-repair", "bracelet-repair", "heirloom-restoration"],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

