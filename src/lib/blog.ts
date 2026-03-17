export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogNextStep = {
  label: string;
  href: string;
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
  faqs?: BlogFaq[];
  faqHeading?: string;
  nextStepsHeading?: string;
  nextStepsIntro?: string;
  nextSteps?: BlogNextStep[];
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
      "A practical guide to when pearls should be restrung, what warning signs matter, and how to avoid strand failure before an important event.",
    image: "/images/blog/pearl-restringing-timing-guide-cover.jpg",
    topics: ["Pearl Care", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "6 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Many frequently worn strands benefit from restringing every 1-2 years.",
      "Visible gaps, fuzzy string, discoloration, and fraying near the clasp are early warning signs.",
      "Hand-knotting and clasp inspection are part of what makes professional restringing safer than waiting for failure.",
    ],
    sections: [
      {
        heading: "Why timely restringing matters",
        body: [
          "Pearls and beads usually do not fail without warning. The string stretches, knots loosen, or the clasp area starts to fray long before the whole strand breaks. The problem is that many owners notice the issue only after the necklace already feels risky to wear.",
          "In our Pasadena workshop, pearl restringing is treated as preventive care rather than emergency cleanup. A strand that still looks mostly intact is often the best candidate for service because the pearls can be restrung, cleaned, and returned to a comfortable drape before anything is lost.",
          "That matters even more if you wear the strand for church, work, weddings, anniversaries, or family gatherings. Waiting until the necklace snaps usually creates a more stressful repair and can mean searching for missing pearls or dealing with a damaged clasp at the same time.",
        ],
      },
      {
        heading: "How often should pearls be restrung?",
        body: [
          "A practical baseline for many pearl strands is every 1-2 years if they are worn often. That recommendation changes based on how the strand is stored, how frequently it is worn, and how much strain the clasp area sees when it is put on and taken off.",
          "A special-occasion strand that comes out only a few times a year may last longer. A favorite strand worn weekly usually needs closer attention. The important thing is not chasing a calendar date; it is noticing whether the string still looks clean, firm, and evenly spaced.",
          "If you are unsure whether your pearls are still safe, bring them in before an event rather than after. An in-house assessment is more useful than guessing from one small section of string at home.",
        ],
      },
      {
        heading: "Signs it is time to restring now",
        body: [
          "The clearest warning signs are visible gaps between pearls, string discoloration, fuzzy or frayed silk, uneven knot spacing, and wear near the clasp. If the strand no longer sits evenly, that usually means the string has already stretched beyond its ideal tension.",
          "Another overlooked warning sign is when the necklace feels different against the neck. If the drape looks looser than it used to or the clasp area feels twisted, the strand may not be distributing tension evenly anymore.",
          "These are the kinds of details we look for during pearl restringing quotes in Pasadena. Catching them early is usually the difference between a simple preventive restring and a higher-stress situation after a break.",
        ],
      },
      {
        heading: "What professional restringing includes",
        body: [
          "At Susie's, restringing is more than sliding pearls onto fresh thread. The service typically includes fresh silk stringing, hand-knotting between pearls, clasp inspection, and length adjustment if needed. Hand-knotting helps protect pearls from rubbing against each other and keeps spacing more consistent along the strand.",
          "The clasp is worth paying attention to as well. A strand can be perfectly restrung and still feel unreliable if the clasp is worn, dirty, or difficult to close. That is why clasp cleaning, inspection, and possible replacement are part of the same conversation.",
          "If the strand is part of a bigger refresh, this is also the right moment to ask about cleaning, length changes, or a clasp upgrade. Combining those decisions into one visit keeps the repair plan clearer and prevents repeat handling of the same piece.",
        ],
      },
      {
        heading: "What to expect on timing and cost",
        body: [
          "Most pearl restringing work follows our Same Day/Next Day pattern when the strand is straightforward and does not need unusual clasp work. More complex strands, very long pieces, or projects that need extra matching or adjustments can take longer, but timing is confirmed before work starts.",
          "Pricing is usually shaped by strand length, knot count, and clasp condition rather than one flat number for every necklace. That is why the best quote happens after we see the actual strand, not from a vague description alone.",
          "If your pearls matter to you, the safest move is not waiting for failure. Bring the strand in while it is still wearable enough to evaluate calmly, then let the quote and condition check tell you whether service should happen now.",
        ],
      },
    ],
    faqHeading: "Quick answers about pearl restringing timing",
    faqs: [
      {
        question: "How often should pearls be restrung if I wear them regularly?",
        answer:
          "Many frequently worn strands benefit from restringing every 1-2 years, but the real trigger is condition. If the string looks stretched, frayed, discolored, or uneven, it is time to bring the strand in.",
      },
      {
        question: "Do you knot between each pearl?",
        answer:
          "Yes. Hand-knotting helps reduce rubbing between pearls, keeps spacing cleaner, and adds protection if part of the strand is stressed.",
      },
      {
        question: "Can you replace or upgrade the clasp during restringing?",
        answer:
          "Often, yes. We can inspect, clean, replace, or upgrade the clasp during the same service so the whole strand feels secure when it goes back into rotation.",
      },
    ],
    nextStepsHeading: "Best next step if your strand already looks stretched or uneven",
    nextStepsIntro:
      "If you want a real assessment before the strand fails, start with the pearl restringing service or send photos for a quote-first recommendation.",
    nextSteps: [
      { label: "See Pearl Restringing Service", href: "/services/pearl-restringing" },
      { label: "See Necklace Repair Service", href: "/services/necklace-repair" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["pearl-restringing", "necklace-repair", "bracelet-repair"],
  },
  {
    slug: "custom-design-timeline-guide",
    title: "Custom Jewelry Design Timeline: From Idea to Finished Piece",
    excerpt:
      "What the custom design timeline actually looks like, where approvals happen, and how to plan around proposals, anniversaries, and other important deadlines.",
    image: "/images/blog/custom-design-timeline-guide-cover.jpg",
    topics: ["Custom Design", "Pricing & Timing"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Most custom projects follow a roughly 7-business-day build window once the design is fully approved.",
      "The strongest timelines start with a clear consultation, realistic deadline, and firm approval checkpoints.",
      "Stone reuse, sourcing, and design complexity all affect how quickly a project can move from idea to finished piece.",
    ],
    sections: [
      {
        heading: "What the custom design timeline usually looks like",
        body: [
          "Custom jewelry timelines feel confusing when customers are only told a finished date and not what happens in between. In our Pasadena shop, the clearer way to think about the process is in phases: consultation, design direction, approvals, production, and final finishing.",
          "Most custom work follows a roughly 7-business-day build window once the design is officially approved. That does not mean every project starts the clock on the day you first ask about it. The consultation, design direction, and approval steps happen first, and that is where most timeline misunderstandings begin.",
          "If the piece is tied to a proposal, anniversary, graduation, or holiday gift, say that at the beginning. Deadline context matters. It is much easier to protect quality and still meet an important date when the timeline is planned around the actual event instead of rushed at the last minute.",
        ],
      },
      {
        heading: "What to bring to the first consultation",
        body: [
          "The first appointment moves faster when you bring the things that actually guide the project: reference photos, any existing stones or jewelry you want to reuse, a rough budget range, and your target timing. Those four inputs usually answer the first round of design questions better than vague style terms alone.",
          "If you are resetting heirloom stones, bring the original piece even if it is damaged. Wear patterns, weak settings, and previous repairs help us judge what can be reused safely and what should be rebuilt from scratch.",
          "This is also the moment to be honest about how the piece will be worn. Daily wear, occasional wear, stacking, travel, and childcare all affect whether a design should sit lower, feel sturdier, or avoid delicate details that do not match your lifestyle.",
        ],
      },
      {
        heading: "Where approvals happen and what changes the schedule",
        body: [
          "Approval checkpoints are what keep custom design from drifting. Once the design direction is clear, we confirm the look, the materials, the pricing, and the expected timing before production begins. If any of those are still moving targets, the schedule is not really locked yet.",
          "Projects usually slow down for predictable reasons: waiting on a design decision, changing direction after the initial concept, special stone sourcing, or adding structural complexity that was not part of the first plan. None of those are bad, but they do need to be acknowledged as timeline changes rather than surprises.",
          "The good version of custom work is not speed at any cost. It is a process where you know when to review the design, when to approve it, and when the in-house bench work actually starts.",
        ],
      },
      {
        heading: "How heirloom stones and old gold fit into the process",
        body: [
          "One of the most common custom requests in Pasadena is reusing heirloom stones or redesigning an older piece into something more wearable. That is often possible, but it still starts with evaluation rather than assumption.",
          "We look at whether the stones are structurally suitable for reset, whether the old mounting is helping or hurting the new goal, and whether any existing gold should be reused or simply treated as sentimental reference. The right answer depends on durability, finish quality, and how closely you want the new piece to echo the original one.",
          "This is where a custom design consultation can overlap with heirloom restoration. Some projects are true redesigns. Others only need a controlled remount or a small structural change to make the piece wearable again.",
        ],
      },
      {
        heading: "What custom design usually costs and when to start",
        body: [
          "The cost question is easier to answer when the project type is clear. A remount can start much lower than a fully custom engagement ring, and a straightforward custom band sits in a different pricing lane than a more complex multi-stone project.",
          "Our current planning guidance is to treat custom wedding bands, remounts, and engagement-ring-level projects as different conversations, not one generic 'custom jewelry' category. That keeps the estimate anchored to the real amount of design, sourcing, and finishing involved.",
          "If the piece is tied to a hard date, start earlier than you think you need to. The best custom projects have enough room for design approvals without turning every revision into a deadline problem.",
        ],
      },
    ],
    faqHeading: "Quick answers about custom jewelry timelines",
    faqs: [
      {
        question: "How long does custom jewelry usually take once I approve the design?",
        answer:
          "Most custom projects follow a roughly 7-business-day build window once the design is approved, but sourcing, revisions, or added complexity can extend that timeline.",
      },
      {
        question: "Can you use my existing stones or some of my old gold?",
        answer:
          "Often, yes. We evaluate heirloom stones and existing metal during the consultation and recommend the best path for durability, finish quality, and the look you want.",
      },
      {
        question: "When should I start if the piece is for a proposal or anniversary?",
        answer:
          "Start earlier than the event date suggests. The safest timeline includes room for consultation, approvals, and any needed design changes before bench work begins.",
      },
    ],
    nextStepsHeading: "Best next step if you already have the idea but need a real timeline",
    nextStepsIntro:
      "If you want a custom piece or remount grounded in real timing, start with a consultation or quote so the design, budget, and deadline can be aligned early.",
    nextSteps: [
      { label: "Explore Custom Design", href: "/services/custom-design" },
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
      "How to prepare for an heirloom restoration consultation, what to bring, and how to ask the right questions before approving work on a sentimental piece.",
    image: "/images/blog/heirloom-restoration-planning-guide-cover.jpg",
    topics: ["Heirloom Care", "Trust & Buying"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Bring the piece itself, any missing parts, timing needs, and the story behind how you want it worn.",
      "Ask about structural safety first, then about polishing, finish matching, and preserving original character.",
      "Sentimental pieces deserve clear in-house assessment and approval checkpoints before any work begins.",
    ],
    sections: [
      {
        heading: "How to tell whether your heirloom needs attention now",
        body: [
          "Heirloom pieces rarely fit neatly into a simple repair checklist. Some need urgent structural work because prongs are worn, the shank is thinning, or the stone seats no longer feel safe. Others mainly need a careful assessment because the piece has sentimental value and you do not want the wrong kind of polishing or rebuilding to erase its character.",
          "A good rule is to separate structural risk from cosmetic age. Wear that threatens the piece should move faster than surface patina that is simply part of the jewelry's history. If you are unsure which is which, that is exactly what the first consultation is for.",
          "At Susie's, heirloom restoration starts with structural safety and preservation goals, not with an automatic promise to make an older piece look brand new. That difference matters if your priority is keeping the piece wearable without stripping away what made it special.",
        ],
      },
      {
        heading: "What to bring to the consultation",
        body: [
          "Bring the heirloom itself, any missing parts, and any details you already know about its history. If the piece has been repaired before, that context helps us understand where weak points may already exist.",
          "It also helps to bring photos of how you want to wear it now. Is this something you want to keep for special occasions only, or do you want to return it to regular daily wear? The safest repair plan changes depending on how the piece will actually be used.",
          "If timing matters, say so clearly. A family event, anniversary, or estate-related handoff can affect how we prioritize the consultation and whether the safest next step is immediate stabilization, full restoration, or simply a staged plan.",
        ],
      },
      {
        heading: "Questions to ask before you approve restoration work",
        body: [
          "The most useful restoration questions are not generic pricing questions first. Ask what absolutely needs to be stabilized, what can be preserved as-is, and whether polishing, finish matching, or rebuilding will change the piece's original character.",
          "If the piece is antique or fragile, ask what the safest repair path is, not just the fastest one. The right jeweler should be able to explain whether the goal is reinforcement, restoration, or redesign, and what tradeoffs come with each choice.",
          "You should also ask whether the work stays in-house. For sentimental pieces, direct communication with the team doing the work is part of the value, especially when the repair involves judgment rather than a routine replacement part.",
        ],
      },
      {
        heading: "Restoration versus redesign",
        body: [
          "Some heirloom pieces are best restored because the original look still fits how you want to wear them and the structure can be strengthened safely. Others are better candidates for redesign because the style no longer suits your life, the mounting is too compromised, or the piece is more meaningful as reused stones than as an untouched object.",
          "That decision does not have to be emotional versus practical. A redesign can still preserve the family connection if the stones, story, or some of the original materials carry forward into a new piece. A restoration can also be the better emotional choice when the visual identity of the original ring or necklace matters more than modernizing it.",
          "The key is to make that decision on purpose rather than defaulting to the first repair idea you hear.",
        ],
      },
      {
        heading: "What to expect on timing, scope, and approvals",
        body: [
          "Many straightforward heirloom repairs still follow our Same Day/Next Day pattern, but older or more delicate pieces often need a more careful scope review before timing can be confirmed. The important part is that pricing, timeline, and tradeoffs are explained before work begins.",
          "That approval step protects both the jewelry and the customer. You should leave the consultation knowing what is being restored, what is being preserved, and whether there are any fragile areas that make a more limited repair the safer choice.",
          "If the piece needs broader reconstruction or naturally leads into custom work, that should be treated as a separate decision, not rolled into the job without a clear conversation.",
        ],
      },
    ],
    faqHeading: "Quick answers before an heirloom restoration visit",
    faqs: [
      {
        question: "What should I bring to an heirloom restoration consultation?",
        answer:
          "Bring the piece, any missing parts, any known repair history, and details about how you want to wear it going forward. Photos or timing notes can also help clarify the safest plan.",
      },
      {
        question: "Should I ask for restoration or redesign?",
        answer:
          "Ask for the safest recommendation based on the piece's condition and your wear goals. Some heirlooms are best preserved, while others are better candidates for redesign using the original stones or materials.",
      },
      {
        question: "Will restoration work stay in-house?",
        answer:
          "At Susie's, the goal is in-house assessment and repair so the piece is not shipped out. That is especially valuable for sentimental or fragile jewelry that needs careful judgment.",
      },
    ],
    nextStepsHeading: "Best next step for sentimental jewelry you do not want to risk",
    nextStepsIntro:
      "If you want a real recommendation before approving work, start with heirloom restoration. If the consultation confirms the piece needs a bigger redesign, the custom-design path can follow from there.",
    nextSteps: [
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "Explore Custom Design", href: "/services/custom-design" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
    readTime: "6 min read",
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
          "Because gold prices fluctuate, the amount of new metal required will directly impact the total cost. Most simple sizing jobs start around $45-$65, but can increase if the ring is extremely wide or requires complex blending.",
          "For Pasadena, Deer Park, and La Porte customers, the practical question is not just price. It is whether the resize will look invisible, feel comfortable, and keep the ring strong enough for everyday wear. That is why a real quote should always include fit, metal type, and setting condition, not just a flat number."
        ]
      },
      {
        heading: "Are all gold rings safe to resize?",
        body: [
          "Most standard 10k, 14k, and 18k yellow or white gold rings can be safely resized. However, rings with full eternity bands (diamonds going all the way around) or extremely intricate vintage patterns might warp or lose their stones if stretched or compressed.",
          "At Susie's Jewelry Repair on Fairmont Pkwy, we inspect every ring under magnification before giving a quote to ensure the structural integrity of your piece won't be compromised.",
          "White gold rings often need more than the size change itself. After the metal work is complete, many customers also choose polishing and fresh rhodium so the ring does not leave with a dull seam or mismatched finish."
        ]
      },
      {
        heading: "What makes one resizing quote higher than another?",
        body: [
          "A narrow plain band is usually the fastest and most affordable job because it needs less metal movement and less finishing. A wide shank, engraved pattern, multiple side stones, or previous repair work increases bench time and inspection time.",
          "If your ring has channel-set diamonds, hidden halos, or delicate antique prongs, the jeweler may need to retighten stones after sizing. That extra labor is not upselling; it is part of returning the ring in wearable condition.",
          "When you compare Pasadena ring sizing quotes, ask whether stone checks, finishing, and cleanup are already included. A low quote that skips those steps can cost more later if stones loosen or the ring comes back uneven."
        ]
      },
      {
        heading: "How long does ring sizing take locally?",
        body: [
          "Most standard gold ring sizings follow our Same Day/Next Day pattern, depending on the ring style and shop workload. The most straightforward jobs can move quickly, but complex sizing should not be rushed if the ring needs structural reinforcement or stone tightening.",
          "If you need the ring for a proposal, anniversary dinner, trip, or weekend event, tell the team that up front. Timeline planning is part of the service, and it is easier to protect both quality and deadline when expectations are clear before work starts.",
          "For customers coming from Deer Park, La Porte, or southeast Houston, the easiest path is to request a fast quote online first, then bring the ring in for a confirmed assessment."
        ]
      }
    ],
    faqHeading: "Quick answers for Pasadena ring resizing",
    faqs: [
      {
        question: "How much does it cost to size a simple gold ring down in Pasadena?",
        answer:
          "Most simple gold ring sizings down start around $45-$65, but the final price depends on band width, stone layout, and finish work after the seam is closed.",
      },
      {
        question: "Does sizing up cost more than sizing down?",
        answer:
          "Yes. Sizing up usually costs more because matching gold has to be added, shaped, soldered or laser-welded, and then refinished so the ring looks even.",
      },
      {
        question: "Can you resize a ring with diamonds on the band?",
        answer:
          "Often yes, but it depends on how far the stones run around the ring. Rings with side stones or eternity-style layouts need a closer inspection before a safe quote can be confirmed.",
      },
    ],
    nextStepsHeading: "Best next step if your ring feels too loose or too tight",
    nextStepsIntro:
      "If you want a confirmed Pasadena quote instead of a rough estimate, start with the ring sizing service page or send the ring details for review.",
    nextSteps: [
      { label: "See Ring Sizing Service", href: "/services/ring-sizing" },
      { label: "Get Deer Park Repair Guidance", href: "/services/deer-park" },
      { label: "See Friendswood Ring Repair Guidance", href: "/services/friendswood" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
    readTime: "7 min read",
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
          "However, if the metal has suffered severe stress or micro-cracks from the impact, simply pushing it back will cause it to snap later. A master jeweler must assess the metal's fatigue.",
          "In Pasadena, this usually happens after rings catch on shopping carts, gym equipment, door handles, or hard countertop edges. The stone may still appear secure, but the real risk is hidden inside the stressed metal."
        ]
      },
      {
        heading: "When do I need a completely new setting?",
        body: [
          "If multiple prongs are missing, or the base of the setting (the 'head') is crushed or structurally compromised, rebuilding individual prongs may cost more than starting fresh. In these cases, we recommend replacing the entire head to ensure your center diamond is 100% secure.",
          "Stop by our Pasadena location for a free microscope inspection if you suspect your prong is compromised."
        ]
      },
      {
        heading: "What are the warning signs that a bent prong is now urgent?",
        body: [
          "If the diamond moves, rattles, tilts, or suddenly catches on fabric, stop wearing the ring immediately. Those are not cosmetic issues. They are signs the stone may already be one impact away from coming loose.",
          "Another warning sign is a prong that looks darker, flatter, or shorter than the others after a hit. That can mean the tip folded or wore down enough that it is no longer holding the crown of the stone correctly.",
          "The safest move is to place the ring in a small pouch or box and bring it in before wearing it again. Continuing to wear it to work, errands, or the gym is how a repair turns into a lost-diamond problem."
        ]
      },
      {
        heading: "Repair, rebuild, or redesign: how to choose",
        body: [
          "If the rest of the ring is healthy, rebuilding one or two prongs is usually the most efficient repair. If the head is twisted, several prongs are worn, or the shank is already thin, a new setting or head replacement may provide better long-term security.",
          "For older engagement rings and family pieces, we also look at wear pattern and lifestyle. A customer who wears the ring daily may be better served by a stronger modern head while preserving the original diamond and overall look.",
          "If the mounting has repeated problems, redesign can be the more economical decision over time. It can eliminate chronic weak points instead of repairing the same fragile structure again and again."
        ]
      }
    ],
    faqHeading: "Quick answers about bent prongs and loose stones",
    faqs: [
      {
        question: "Can you fix one badly bent prong without replacing the whole ring?",
        answer:
          "Often yes. If the surrounding head is still sound, we can usually rebuild or retip the damaged prong rather than replace the entire setting.",
      },
      {
        question: "Is it safe to wear my ring if one prong is bent?",
        answer:
          "No. If a prong is visibly bent, stop wearing the ring until it is inspected. Even if the stone looks stable, the metal may already be fatigued.",
      },
      {
        question: "When is a new setting the better choice?",
        answer:
          "A new setting becomes the safer choice when multiple prongs are worn, the head is crushed, or the overall mounting has too much structural wear to trust after a spot repair.",
      },
    ],
    nextStepsHeading: "Best next step if your diamond feels exposed",
    nextStepsIntro:
      "Start with a stone-setting inspection if the ring has a loose or damaged prong. If the setting is beyond repair, the custom design path is the right follow-up conversation.",
    nextSteps: [
      { label: "See Stone Setting Service", href: "/services/stone-setting" },
      { label: "See La Porte Repair Guidance", href: "/services/la-porte" },
      { label: "See Webster Ring Repair Guidance", href: "/services/webster" },
      { label: "Explore Custom Design", href: "/services/custom-design" },
      { label: "Get Fast Quote", href: "/quote" },
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
    readTime: "6 min read",
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
          "Unlike mall kiosks, our master craftsmen carefully open the case back to prevent scratching, swap in a fresh, high-quality battery, and ensure the internal gaskets are properly seated before closing.",
          "That matters for local customers who need the watch back today for work, school, travel, or everyday wear. The goal is not just to make the hands move again. It is to return the watch clean, protected, and ready to wear."
        ]
      },
      {
        heading: "Do you pressure test water-resistant watches?",
        body: [
          "For standard everyday wear, our visual seal check ensures basic splash resistance. If your watch is a professional dive watch and you plan on submerging it, we recommend discussing a full pressure test and reseal with our team to guarantee its original depth rating."
        ]
      },
      {
        heading: "How long does a watch battery replacement take?",
        body: [
          "Most battery replacements are same-day and many are completed while you wait, depending on the watch style and how busy the bench is. Straightforward quartz watches are usually fast. Specialty backs, luxury cases, and watches with stripped screws can take longer because they need more careful handling.",
          "If you are coming from Deer Park, La Porte, or southeast Houston, call or start a quick quote first if you have a brand-specific concern. That helps us tell you whether your model needs a standard battery swap, gasket replacement, or a deeper diagnostic."
        ]
      },
      {
        heading: "When a dead watch may be more than a battery",
        body: [
          "Not every stopped watch only needs a fresh cell. Battery leakage, coil issues, damaged stems, and moisture intrusion can all mimic a simple dead-battery symptom.",
          "If a watch recently lost time, fogged under the crystal, or stopped after sitting with an old battery for too long, inspection matters. Replacing the battery without checking the movement can hide the real cause and shorten the life of the watch.",
          "This is especially important for sentimental or higher-end watches. A quick diagnosis now is cheaper than a full movement repair later."
        ]
      }
    ],
    faqHeading: "Quick answers about same-day watch battery service",
    faqs: [
      {
        question: "Do you offer same-day watch battery replacement in Pasadena?",
        answer:
          "Yes. Most quartz watch battery replacements are same-day, and many can be completed while you wait depending on the watch style and bench load.",
      },
      {
        question: "Do you replace batteries in luxury or Swiss watches?",
        answer:
          "Yes. We handle everyday watches and many higher-end models, but some luxury cases require slower opening, seal work, or additional diagnostics.",
      },
      {
        question: "Do you check the seal after replacing the battery?",
        answer:
          "Yes. We visually inspect seals and gasket condition during service. If the watch needs a deeper reseal or pressure test, we will tell you before the work is finalized.",
      },
    ],
    nextStepsHeading: "Best next step if your watch stopped today",
    nextStepsIntro:
      "If it is likely a battery issue, start with watch repair service details or request a quick quote before you drive over.",
    nextSteps: [
      { label: "See Watch Repair Service", href: "/services/watch-repair" },
      { label: "Get Deer Park Watch Repair Help", href: "/services/deer-park" },
      { label: "Get Clear Lake Watch Repair Help", href: "/services/clear-lake" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
    readTime: "6 min read",
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
          "Vintage rings are exceptionally vulnerable because the metal has experienced decades of wear, making the prongs thinner and more brittle than modern rings.",
          "For Pasadena customers with inherited or antique rings, the real risk is not only the cleaner itself. It is what happens when harsh chemicals combine with already-thin prongs, old solder joints, or fragile gallery work that has not been inspected recently."
        ]
      },
      {
        heading: "When should I bring it to a professional?",
        body: [
          "If your vintage ring features intricate filigree, foil-backed stones, or soft gemstones like pearls and opals, skip the home cleaning entirely. Bring it into our Pasadena workshop. We use specialized, non-destructive cleaning techniques that remove decades of grime without putting weak structural points at risk."
        ]
      },
      {
        heading: "Which at-home methods are safest for older rings?",
        body: [
          "The safest at-home approach is simple: lukewarm water, mild dish soap, a short soak, and a very soft brush used gently around the setting. Rinse carefully and pat dry with a lint-free cloth instead of rubbing aggressively.",
          "Avoid ultrasonic devices unless a jeweler has already told you the ring is structurally sound and the stones are appropriate for that method. Older rings often hide worn prongs or delicate under-gallery details that can fail under vibration.",
          "Steam, toothpaste, abrasive powders, and silver dips also belong on the avoid list for vintage rings. They may seem harmless, but they can remove finish, stress old solder seams, or damage softer gems set alongside diamonds."
        ]
      },
      {
        heading: "What makes vintage diamond rings different from modern settings?",
        body: [
          "Many vintage rings were built with finer prongs, hand-cut details, and design techniques that were never intended for modern household cleaners or constant scrubbing. They may also have decades of invisible wear that only shows up under magnification.",
          "A ring can look beautiful on top while hiding thin shanks, weakened galleries, or loose accent stones underneath. That is why older rings should be evaluated for structure, not just shine.",
          "If the ring has sentimental value, the safer strategy is usually to clean it less aggressively at home and use professional cleaning as part of a regular inspection routine."
        ]
      },
    ],
    faqHeading: "Quick answers about cleaning vintage rings safely",
    faqs: [
      {
        question: "Is dish soap safe for a vintage diamond ring?",
        answer:
          "Usually yes, as long as it is mild dish soap used with lukewarm water and a soft brush. The bigger concern is the ring's structural condition, not the soap itself.",
      },
      {
        question: "Can I use bleach, ammonia, or jewelry cleaner from a store?",
        answer:
          "No. Harsh chemicals can weaken old gold alloys, damage fragile finishes, and increase the risk of cracked prongs or damaged accent stones.",
      },
      {
        question: "When should I skip home cleaning and bring the ring in?",
        answer:
          "Skip home cleaning if the ring is antique, has filigree, foil-backed stones, pearls, opals, loose prongs, or any sign of wear. Those rings are safer with a professional inspection and non-destructive cleaning.",
      },
    ],
    nextStepsHeading: "Best next step for a fragile or sentimental ring",
    nextStepsIntro:
      "If you are not fully confident in the ring's condition, start with professional cleaning or an heirloom-focused inspection before trying a stronger home-cleaning routine.",
    nextSteps: [
      { label: "See Jewelry Cleaning Service", href: "/services/jewelry-cleaning" },
      { label: "See La Porte Heirloom Guidance", href: "/services/la-porte" },
      { label: "See Friendswood Heirloom Guidance", href: "/services/friendswood" },
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "Get Fast Quote", href: "/quote" },
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
    readTime: "7 min read",
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
          "However, if the metal is paper-thin, severely cracked, or the style sits in a jewelry box because it isn’t to your taste, a redesign is the smarter choice. At Susie's, we can melt down the original gold and use the inherited family diamonds to craft a brand-new, modern piece that you will actually wear.",
          "For Pasadena families, this choice is often emotional before it is technical. Some customers want to preserve the exact look because the piece belonged to a parent or grandparent. Others want to keep the stones and story, but create something stronger for daily wear."
        ]
      },
      {
        heading: "How does the custom redesign process work?",
        body: [
          "We start with a free consultation at our Pasadena shop. We'll inspect your heirloom stones, sketch out a design that fits your lifestyle, and walk you through 3D models before casting. This ensures you get a durable, stunning piece while keeping the family legacy alive."
        ]
      },
      {
        heading: "When restoration is usually the better choice",
        body: [
          "Restoration is usually the right path when the original craftsmanship matters more than changing the style. If the shank can be reinforced, the prongs can be rebuilt, and the overall design still suits how you want to wear it, preserving the original piece often delivers the best emotional value.",
          "This is especially true for anniversary rings, family solitaires, and heirloom pieces with engraving or old-world details that would be difficult to replicate. A careful restoration keeps the visual identity intact while making the piece safer to wear.",
          "In practical terms, restoration also makes sense when the existing setting is still structurally recoverable and the cost to rebuild key components is lower than fabricating an entirely new mounting."
        ]
      },
      {
        heading: "When redesign creates the stronger long-term result",
        body: [
          "Redesign becomes the stronger option when the original piece is too fragile, too damaged, or simply not wearable for your lifestyle. A ring that constantly snags, sits too high, or remains in a box is not serving you well even if it has sentimental value.",
          "A redesign can preserve the heirloom's core identity by reusing its diamonds, colored stones, or even some of the original gold while giving you a lower-profile, sturdier, more modern piece. The emotional continuity stays, but the day-to-day wearability improves.",
          "Customers often choose redesign when several major repairs would stack up anyway: worn prongs, thin shanks, damaged heads, and outdated proportions. In that case, rebuilding from the ground up can be more durable and more cost-effective over time."
        ]
      },
    ],
    faqHeading: "Quick answers about heirloom repair vs redesign",
    faqs: [
      {
        question: "How do I know if an heirloom should be restored instead of redesigned?",
        answer:
          "If the structure is still recoverable and the original look matters deeply to you, restoration is usually the better choice. It preserves the character of the piece while strengthening it for safer wear.",
      },
      {
        question: "Can you reuse the original diamonds or gold in a redesign?",
        answer:
          "Yes. In many cases we can reuse heirloom stones and, depending on the project, some of the original gold so the new piece still carries the family connection.",
      },
      {
        question: "Is redesign only for badly damaged jewelry?",
        answer:
          "No. Redesign is also a smart choice when the original piece is not your style or no longer fits how you want to wear it, even if the jewelry is still structurally salvageable.",
      },
    ],
    nextStepsHeading: "Best next step for inherited jewelry you want to wear again",
    nextStepsIntro:
      "If you want to preserve the original piece, start with heirloom restoration. If you already know the current style is not right for you, the custom design path is the better starting point.",
    nextSteps: [
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "See La Porte Repair Guidance", href: "/services/la-porte" },
      { label: "See Clear Lake Heirloom Guidance", href: "/services/clear-lake" },
      { label: "Explore Custom Design", href: "/services/custom-design" },
      { label: "Book Repair", href: "/book" },
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
