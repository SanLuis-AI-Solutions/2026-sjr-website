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
  {
    slug: "cost-to-resize-gold-ring-pasadena",
    title: "How much does it cost to resize a gold ring in Pasadena?",
    excerpt: "A local guide to gold ring resizing costs, timing, and what factors influence the price of a safe, invisible resize.",
    image: "/images/blog/ring-sizing-guide-cover.jpg",
    topics: ["Ring Care", "Pricing & Timing"],
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Starting cost for a basic 14k gold sizing down usually ranges around $45-$65.",
      "Sizing up requires adding matching gold, increasing the price based on width and ring size.",
      "Settings and side stones add complexity, requiring a professional assessment before pricing."
    ],
    sections: [
      {
        heading: "What factors affect ring resizing costs?",
        body: [
          "The cost to resize a gold ring in Pasadena depends on three main factors: whether you are sizing up or down, the thickness of the band, and how many stones the ring has. Sizing down is typically more affordable because we remove metal and reseal the band. Sizing up requires us to carefully cut the shank, add a matching piece of gold, and weld it seamlessly.",
          "Because gold prices fluctuated, the amount of new metal required will directly impact the total cost. Most simple sizing jobs start around $45-$65, but can increase if the ring is extremely wide or requires complex blending."
        ]
      },
      {
        heading: "Are all gold rings safe to resize?",
        body: [
          "Most standard 10k, 14k, and 18k yellow or white gold rings can be safely resized. However, rings with full eternity bands (diamonds going all the way around) or extremely intricate vintage patterns might warp or lose their stones if stretched or compressed.",
          "At Susie's Jewelry Repair on Fairmont Pkwy, we inspect every ring under magnification before giving a quote to ensure the structural integrity of your piece won't be compromised."
        ]
      }
    ],
    relatedServiceSlugs: ["ring-sizing", "stone-setting"]
  },
  {
    slug: "can-a-severely-bent-ring-prong-be-fixed",
    title: "Can a severely bent ring prong be fixed, or do I need a new setting?",
    excerpt: "Discover when a bent prong can be safely repaired and when replacing the entire setting is the only way to save your diamond.",
    image: "/images/blog/stone-security-checklist-cover.jpg",
    topics: ["Stone Safety", "Ring Care"],
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "A slightly bent prong can often be carefully pushed back into place by a master jeweler.",
      "If the metal is torn, fatigued, or cracked, pushing it back will cause it to snap.",
      "Re-tipping or rebuilding the prong is a safe, cost-effective alternative to replacing the whole head."
    ],
    sections: [
      {
        heading: "Can a severely bent ring prong be fixed?",
        body: [
          "If your prong is severely bent, do not try to bend it back yourself. Often, a severely bent prong can be repaired in our shop using a technique called re-tipping, where we melt new gold or platinum onto the worn or bent area to rebuild its strength.",
          "However, if the metal has suffered severe stress or micro-cracks from the impact, simply pushing it back will cause it to snap later. A master jeweler must assess the metal's fatigue."
        ]
      },
      {
        heading: "When do I need a completely new setting?",
        body: [
          "If multiple prongs are missing, or the base of the setting (the 'head') is crushed or structurally compromised, rebuilding individual prongs may cost more than starting fresh. In these cases, we recommend replacing the entire head to ensure your center diamond is 100% secure.",
          "Stop by our Pasadena location for a free microscope inspection if you suspect your prong is compromised."
        ]
      }
    ],
    relatedServiceSlugs: ["stone-setting", "custom-design"]
  },
  {
    slug: "where-to-get-watch-battery-replaced-pasadena",
    title: "Where to get a watch battery replaced today near Deer Park / Pasadena?",
    excerpt: "Looking for same-day watch battery replacement in Pasadena? Here is what you need to know about our fast, in-house service.",
    image: "/images/blog/watch-battery-replacement-cover.jpg",
    topics: ["Watch Service", "Pricing & Timing"],
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readTime: "3 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Susie's Jewelry Repair offers same-day and while-you-wait watch battery replacements.",
      "We stock batteries for 99% of quartz watches, from everyday brands to luxury timepieces.",
      "Our service always includes a seal check to protect against moisture damage."
    ],
    sections: [
      {
        heading: "Where can I get a watch battery replaced today in Pasadena?",
        body: [
          "If your quartz watch has stopped ticking, you can get a same-day battery replacement at Susie's Jewelry Repair, conveniently located near the Deer Park and Pasadena border on Fairmont Pkwy. We handle everything from basic fashion watches to high-end Swiss quartz models.",
          "Unlike mall kiosks, our master craftsmen carefully open the case back to prevent scratching, swap in a fresh, high-quality battery, and ensure the internal gaskets are properly seated before closing."
        ]
      },
      {
        heading: "Do you pressure test water-resistant watches?",
        body: [
          "For standard everyday wear, our visual seal check ensures basic splash resistance. If your watch is a professional dive watch and you plan on submerging it, we recommend discussing a full pressure test and reseal with our team to guarantee its original depth rating."
        ]
      }
    ],
    relatedServiceSlugs: ["watch-repair"]
  },
  {
    slug: "safe-to-clean-vintage-diamond-ring-at-home",
    title: "Is it safe to clean my vintage diamond ring with household products?",
    excerpt: "Vintage rings are delicate. Learn which household cleaners are safe, which will destroy your metals, and how to safely restore the sparkle.",
    image: "/images/blog/professional-cleaning-vs-home-care-cover.jpg",
    topics: ["Cleaning & Polish", "Heirloom Care"],
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readTime: "4 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Mild dish soap and warm water are the only consistently safe household cleaners for vintage jewelry.",
      "Harsh chemicals like bleach and ammonia can cause gold alloys to stress-crack and break.",
      "Vintage settings often have hidden wear, making aggressive scrubbing risky."
    ],
    sections: [
      {
        heading: "Is it safe to clean my vintage diamond ring with household products?",
        body: [
          "It is generally safe to clean a vintage diamond ring with a few drops of mild dish soap and warm water, using a very soft baby toothbrush. However, you should never use bleach, chlorine, acetone, or harsh household degreasers. These chemicals can cause the alloys in gold to break down, resulting in stress cracks that can literally shatter your prongs.",
          "Vintage rings are exceptionally vulnerable because the metal has experienced decades of wear, making the prongs thinner and more brittle than modern rings."
        ]
      },
      {
        heading: "When should I bring it to a professional?",
        body: [
          "If your vintage ring features intricate filigree, foil-backed stones, or soft gemstones like pearls and opals, skip the home cleaning entirely. Bring it into our Pasadena workshop. We use specialized, non-destructive cleaning techniques that remove decades of grime without putting weak structural points at risk."
        ]
      }
    ],
    relatedServiceSlugs: ["jewelry-cleaning", "heirloom-restoration"]
  },
  {
    slug: "heirloom-jewelry-restoration-repair-or-redesign",
    title: "Heirloom Jewelry Restoration: Should I Repair It or Redesign It?",
    excerpt: "Deciding what to do with inherited jewelry? We break down the structural and sentimental factors of repairing versus redesigning.",
    image: "/images/blog/heirloom-restoration-planning-guide-cover.jpg",
    topics: ["Heirloom Care", "Custom Design"],
    publishedAt: "2026-03-01",
    reviewedAt: "2026-03-01",
    readTime: "5 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Repairing is ideal when the piece's history is the most important factor and the structure is salvageable.",
      "Redesigning is best if the piece is severely damaged, out of style, or not wearable for your lifestyle.",
      "You can often reuse the original stones and gold to keep the sentimental value intact during a redesign."
    ],
    sections: [
      {
        heading: "Should I repair or redesign my inherited jewelry?",
        body: [
          "The decision to repair or redesign comes down to structural integrity and personal taste. If the ring is in relatively good condition and you love the vintage aesthetic, a thorough restoration (re-tipping prongs, reinforcing the shank, and deep cleaning) will preserve its history perfectly.",
          "However, if the metal is paper-thin, severely cracked, or the style sits in a jewelry box because it isn’t to your taste, a redesign is the smarter choice. At Susie's, we can melt down the original gold and use the inherited family diamonds to craft a brand-new, modern piece that you will actually wear."
        ]
      },
      {
        heading: "How does the custom redesign process work?",
        body: [
          "We start with a free consultation at our Pasadena shop. We'll inspect your heirloom stones, sketch out a design that fits your lifestyle, and walk you through 3D models before casting. This ensures you get a durable, stunning piece while keeping the family legacy alive."
        ]
      }
    ],
    relatedServiceSlugs: ["heirloom-restoration", "custom-design"]
  }
];

export const BLOG_MOBILE_HERO_IMAGE_BY_SLUG: Record<string, string> = {
  "ring-sizing-guide": "/images/blog/ring-sizing-guide-cover-mobile.avif",
  "cost-to-resize-gold-ring-pasadena": "/images/blog/ring-sizing-guide-cover-mobile.avif",
  "stone-security-checklist": "/images/blog/stone-security-checklist-cover-mobile.avif",
  "can-a-severely-bent-ring-prong-be-fixed": "/images/blog/stone-security-checklist-cover-mobile.avif",
  "custom-design-timeline-guide": "/images/blog/custom-design-timeline-guide-cover-mobile.avif",
  "watch-battery-replacement": "/images/blog/watch-battery-replacement-cover-mobile.avif",
  "where-to-get-watch-battery-replaced-pasadena": "/images/blog/watch-battery-replacement-cover-mobile.avif",
};

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
