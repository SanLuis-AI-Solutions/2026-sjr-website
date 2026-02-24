export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  topics: string[];
  publishedAt: string;
  reviewedAt: string;
  readTime: string;
  authorName: string;
  authorRole: string;
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
    image: "/images/blog/how-to-choose-a-jeweler-cover.jpg",
    topics: ["Trust & Buying", "Heirloom Care"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Ask if repairs are done in-house at the Pasadena workshop or outsourced.",
      "Get pricing and timing confirmed before work starts.",
      "Choose shops that inspect settings and finish before pickup.",
    ],
    sections: [
      {
        heading: "Start with process transparency",
        body: [
          "A trustworthy jeweler explains the repair plan in plain language before any work begins. In our Pasadena shop, we walk you through the assessment so you know exactly what is being fixed and why.",
          "If scope changes after assessment, a responsible team should always pause and ask for approval before continuing. This transparency is the core of our local service model.",
        ],
      },
      {
        heading: "Look for in-house capability",
        body: [
          "In-house service gives you clearer communication and better control of timing. Your piece stays in Susie's workshop instead of moving between third parties or being shipped elsewhere.",
          "For sentimental or high-value items, this reduces handling risk and gives you a direct line to the jeweler doing the work right here in Pasadena.",
        ],
      },
      {
        heading: "Prioritize quality checks",
        body: [
          "The best outcome is not just a finished repair; it is a piece that wears safely. We verify fit, setting security, and overall finish before you ever leave the shop.",
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
    image: "/images/blog/ring-sizing-guide-cover.jpg",
    topics: ["Ring Care", "Pricing & Timing"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Sizing method depends on metal type, style, and size change.",
      "Stone settings should be checked before and after sizing.",
      "White gold often benefits from rhodium refinishing after work.",
    ],
    sections: [
      {
        heading: "Sizing up vs. sizing down in Pasadena",
        body: [
          "Sizing up usually requires adding metal and blending the seam so the ring keeps its shape and finish. At our Fairmont Pkwy workshop, we ensure these seams are invisible to the naked eye.",
          "Both approaches should start with a fit discussion, including seasonal swelling and stacking preferences.",
        ],
      },
      {
        heading: "Protecting stones and settings",
        body: [
          "Prongs and settings should be inspected before and after sizing, especially on rings with multiple stones. We perform this check as standard for all Pasadena ring resizing clients.",
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
    image: "/images/blog/watch-battery-replacement-cover.jpg",
    topics: ["Watch Service", "Preventive Care"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Not every battery issue is just a battery issue.",
      "Seal checks and pressure tests matter on water-exposed watches.",
      "Same Day service is available for most watch batteries in Pasadena.",
    ],
    sections: [
      {
        heading: "When to seek watch repair in Pasadena",
        body: [
          "When a battery weakens, some watches start losing time before they stop. Our shop on Fairmont Pkwy offers quick battery replacements to avoid movement damage from leakage.",
          "Early replacement is usually faster and lower risk than waiting for complete failure.",
        ],
      },
      {
        heading: "What our watch service includes",
        body: [
          "A quality battery service at Susie's includes fit and function checks, plus a seal or gasket review to maintain water resistance where possible.",
        ],
      },
    ],
    relatedServiceSlugs: ["watch-repair", "bracelet-repair", "heirloom-restoration"],
  },
  {
    slug: "stone-security-checklist",
    title: "Stone Security Checklist: Preventing Loose Diamonds",
    excerpt:
      "How to spot warning signs early, what inspections matter, and when to secure stones before loss happens.",
    image: "/images/blog/stone-security-checklist-cover.jpg",
    topics: ["Stone Safety", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Small movement in a stone is an early warning, not normal wear.",
      "Prong checks should happen before and after major repairs.",
      "Quick reinforcement costs less than replacing a lost stone.",
    ],
    sections: [
      {
        heading: "Early signs your stone may be at risk",
        body: [
          "If you hear a faint rattle or notice a snagging prong, your setting may already be compromised. At our Pasadena shop, we use specialized magnification to spot these micro-issues.",
          "These signs are easiest to correct early, before a stone shifts further or falls out during daily wear.",
        ],
      },
      {
        heading: "When to reinforce settings",
        body: [
          "Minor wear can often be solved with targeted retipping. We provide free stone security checks for all Pasadena walk-ins to ensure your diamonds stay exactly where they belong.",
        ],
      },
    ],
    relatedServiceSlugs: ["stone-setting", "jewelry-cleaning", "heirloom-restoration"],
  },
  {
    slug: "chain-repair-weak-points",
    title: "Chain Repair 101: Necklace and Bracelet Weak Points",
    excerpt:
      "Where chains usually fail, which clasp issues are most common, and how to prevent repeat breakage.",
    image: "/images/blog/chain-repair-weak-points-cover.jpg",
    topics: ["Chain Repair", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Jump rings and clasp joints are the most common weak points.",
      "Delicate chains need matching solder and controlled heat handling.",
      "Reinforcing one weak section can prevent repeat repairs.",
    ],
    sections: [
      {
        heading: "Predictable weak points in local chains",
        body: [
          "Most chain failures happen at stress points: clasp connections and jump rings. In the Houston humidity, even sweat and oils can accelerate wear on these small joints.",
          "Identifying these thin areas early prevents accidental loss of your favorite necklace.",
        ],
      },
      {
        heading: "How to make repairs last",
        body: [
          "We offer Same Day/Next Day service for most chain repairs in Pasadena, ensuring you aren't without your jewelry for long while maintaining structural integrity.",
        ],
      },
    ],
    relatedServiceSlugs: ["necklace-repair", "bracelet-repair", "heirloom-restoration"],
  },
  {
    slug: "pearl-restringing-timing-guide",
    title: "Pearl Restringing Timing: When to Restring and Why",
    excerpt:
      "A practical schedule for restringing pearls and beads before strings stretch, fray, or fail.",
    image: "/images/blog/pearl-restringing-timing-guide-cover.jpg",
    topics: ["Pearl Care", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Frequent wear usually means restringing every 1–2 years.",
      "Hand-knotting protects pearls from rubbing and abrupt loss.",
      "Most strands benefit from fresh silk before string failure.",
    ],
    sections: [
      {
        heading: "Signs your strand needs service",
        body: [
          "Visible gaps between pearls and string discoloration are warning signs. At Susie's, we use specialized silk thread to restore the strength and drape of your pearls.",
          "If a strand looks stretched, it's safer to restring it now than to risk it snapping during an event.",
        ],
      },
    ],
    relatedServiceSlugs: ["pearl-restringing", "necklace-repair", "bracelet-repair"],
  },
  {
    slug: "custom-design-timeline-guide",
    title: "Custom Jewelry Design Timeline: From Idea to Finished Piece",
    excerpt:
      "What to expect at each custom stage, how approvals work, and what impacts final timeline.",
    image: "/images/blog/custom-design-timeline-guide-cover.jpg",
    topics: ["Custom Design", "Pricing & Timing"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "6 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Clear design approvals prevent timeline drift.",
      "Stone sourcing and structural complexity are major schedule drivers.",
      "Most custom work follows the 7-business-day baseline once approved.",
    ],
    sections: [
      {
        heading: "Designing for Pasadena lifestyle",
        body: [
          "Whether it's an anniversary piece or a reset of heirloom stones, we design for durability and daily wear. Our local consultation process ensures your vision matches our craftsman's output.",
        ],
      },
    ],
    relatedServiceSlugs: ["custom-design", "ring-sizing", "stone-setting"],
  },
  {
    slug: "professional-cleaning-vs-home-care",
    title: "Professional Jewelry Cleaning vs. At-Home Cleaning",
    excerpt:
      "When home cleaning is enough, when to bring pieces in, and how to avoid accidental damage.",
    image: "/images/blog/professional-cleaning-vs-home-care-cover.jpg",
    topics: ["Cleaning & Polish", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Not all stones are safe for ultrasonic methods.",
      "Professional cleaning includes safety checks, not just shine.",
      "Routine cleanings help catch loose settings early.",
    ],
    sections: [
      {
        heading: "The Pasadena local advantage",
        body: [
          "Professional cleaning at Susie's isn't just about shine—it's about safety. We inspect every prong and setting as part of the process, a service home cleaning simply can't match.",
        ],
      },
    ],
    relatedServiceSlugs: ["jewelry-cleaning", "stone-setting", "ring-sizing"],
  },
  {
    slug: "heirloom-restoration-planning-guide",
    title: "Heirloom Restoration Planning: What to Bring and Ask",
    excerpt:
      "How to prepare for heirloom restoration consultations and get clear scope, risk, and timeline decisions.",
    image: "/images/blog/heirloom-restoration-planning-guide-cover.jpg",
    topics: ["Heirloom Care", "Trust & Buying"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Bring context: history, wear patterns, and desired outcome.",
      "Ask about structural priorities before cosmetic refinishing.",
      "Approval checkpoints are essential for sentimental pieces.",
    ],
    sections: [
      {
        heading: "Restoring history in Pasadena",
        body: [
          "Heirlooms require a respectful approach. At our workshop, we focus on structural integrity first, ensuring your legacy pieces are safe for the next generation to wear.",
        ],
      },
    ],
    relatedServiceSlugs: ["heirloom-restoration", "custom-design", "stone-setting"],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export const BLOG_TOPICS = Array.from(
  new Set(BLOG_POSTS.flatMap((post) => post.topics))
);

function overlapScore(a: string[], b: string[]) {
  const set = new Set(a);
  return b.reduce((score, item) => score + (set.has(item) ? 1 : 0), 0);
}

export function getRelatedBlogPosts(slug: string, count = 2): BlogPost[] {
  const current = getBlogPostBySlug(slug);
  if (!current) return [];

  return BLOG_POSTS
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const topicScore = overlapScore(current.topics, post.topics) * 3;
      const serviceScore =
        overlapScore(current.relatedServiceSlugs, post.relatedServiceSlugs) * 2;
      const score = topicScore + serviceScore;
      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.publishedAt.localeCompare(a.post.publishedAt);
    })
    .slice(0, count)
    .map((entry) => entry.post);
}
