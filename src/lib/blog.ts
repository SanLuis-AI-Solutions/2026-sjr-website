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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg",
    topics: ["Trust & Buying", "Heirloom Care"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
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
    topics: ["Watch Service", "Preventive Care"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
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
  {
    slug: "stone-security-checklist",
    title: "Stone Security Checklist: Preventing Loose Diamonds",
    excerpt:
      "How to spot warning signs early, what inspections matter, and when to secure stones before loss happens.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/stone-setting.jpg",
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
          "If you hear a faint rattle, feel slight movement, or notice a snagging prong, your setting may already be compromised.",
          "These signs are easiest to correct early, before a stone shifts further or falls out during daily wear.",
        ],
      },
      {
        heading: "What a quality setting check includes",
        body: [
          "A proper inspection reviews prong height, tension, wear at contact points, and overall seat stability.",
          "For frequently worn pieces, periodic checks are part of prevention and should be treated like routine maintenance.",
        ],
      },
      {
        heading: "When to reinforce vs. fully rebuild",
        body: [
          "Minor wear can often be solved with targeted retipping or tightening. Larger wear patterns may require full prong rebuilds.",
          "A transparent jeweler explains both options and confirms pricing/timing before work starts.",
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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/necklace-repair.png",
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
        heading: "Why chains break in predictable places",
        body: [
          "Most chain failures happen at stress points: clasp connections, jump rings, and previously repaired links.",
          "These points absorb repeated movement and can fatigue faster than the rest of the chain.",
        ],
      },
      {
        heading: "How clasp issues become chain failures",
        body: [
          "Worn spring mechanisms and bent clasp tongues increase accidental opening and pulling force on the chain.",
          "Replacing a failing clasp early can avoid downstream link damage and loss.",
        ],
      },
      {
        heading: "How to make repairs last longer",
        body: [
          "After repair, remove chains before sleep, workouts, and heavy lifting to reduce repeated stress on joints.",
          "If a chain snags frequently, inspect immediately instead of continuing wear.",
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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/pearl-restringing.png",
    topics: ["Pearl Care", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Frequent wear usually means restringing every 1–2 years.",
      "Hand-knotting protects pearls from rubbing and abrupt loss.",
      "Clasp condition matters as much as string condition.",
    ],
    sections: [
      {
        heading: "Signs your strand is overdue",
        body: [
          "Visible gaps between pearls, string discoloration, and uneven tension are common warning signs.",
          "If a strand looks stretched, delaying service increases break risk.",
        ],
      },
      {
        heading: "Why knotting is more than visual",
        body: [
          "Knotting between pearls reduces friction and helps preserve nacre over time.",
          "It also limits cascading loss if the strand breaks unexpectedly.",
        ],
      },
      {
        heading: "How to store pearls after restringing",
        body: [
          "Store pearls flat, away from dry heat, and avoid contact with perfume and hairspray.",
          "Consistent care extends restringing intervals and keeps luster stable.",
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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/custom-design.jpg",
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
        heading: "Step 1: concept and constraints",
        body: [
          "Start with your visual direction, preferred metal, stone requirements, and wear context.",
          "Early clarity helps avoid revisions later and keeps budget planning realistic.",
        ],
      },
      {
        heading: "Step 2: approval checkpoints",
        body: [
          "A professional process includes explicit approval before fabrication and before scope changes.",
          "That checkpoint keeps control in your hands and prevents unexpected costs.",
        ],
      },
      {
        heading: "Step 3: finishing and final review",
        body: [
          "Final finishing includes polish, fit checks, and setting review before pickup.",
          "Ask for care guidance based on your metal and stone combination.",
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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/jewelry-cleaning.png",
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
        heading: "What home care can handle safely",
        body: [
          "Mild soap, warm water, and soft brushing are usually safe for sturdy everyday pieces.",
          "Avoid harsh chemicals and abrasive products that can damage metal or stone surfaces.",
        ],
      },
      {
        heading: "When to schedule professional cleaning",
        body: [
          "If jewelry looks dull despite home care, has residue buildup, or shows setting concerns, bring it in.",
          "Professional service adds setting and structural review that home cleaning cannot provide.",
        ],
      },
      {
        heading: "How cleaning supports long-term repair prevention",
        body: [
          "Regular inspections during cleaning help identify early wear before it becomes a larger repair.",
          "This is especially useful for rings and bracelets worn daily.",
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
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg",
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
        heading: "Start with preservation priorities",
        body: [
          "For heirlooms, define what matters most: original character, daily wear safety, or both.",
          "This helps guide restoration choices without over-correcting historical details.",
        ],
      },
      {
        heading: "Questions to ask during consultation",
        body: [
          "Ask which areas are structurally weak, what can be stabilized, and what changes are optional.",
          "Also ask how proposed work may affect original engraving, patina, and setting style.",
        ],
      },
      {
        heading: "How to avoid scope surprises",
        body: [
          "Request timing and starting-at pricing before work starts and confirm the process for unexpected findings.",
          "A clear pause-for-approval process is especially important for sentimental pieces.",
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
