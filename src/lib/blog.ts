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
    relatedServiceSlugs: ["heirloom-restoration", "stone-setting", "ring-sizing", "watch-repair"],
  },
  {
    slug: "ring-sizing-guide",
    title: "Ring Sizing: What to Know Before You Resize",
    excerpt:
      "How to tell if a ring really needs resizing, what affects cost and timing, and how to protect stones and finish quality during the process.",
    image: "/images/blog/ring-sizing-guide-cover.jpg",
    topics: ["Ring Care", "Pricing & Timing"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "The right sizing plan depends on metal type, ring style, and how much the fit needs to change.",
      "Poor fit signs matter more than one bad day of swelling or tightness.",
      "Stone checks, seam finishing, and rhodium refinishing are often part of getting the ring back in wearable condition.",
    ],
    sections: [
      {
        heading: "When to resize a ring and when to wait",
        body: [
          "A ring that spins until the stone faces palm-side, slides off too easily when your hands are cool, or catches painfully over the knuckle is usually giving you a real fit signal. A ring that only feels tight after heat, exercise, or travel may not need an immediate size change if the problem is occasional and predictable.",
          "At Susie's, the first conversation is about fit behavior, not just the number stamped on a mandrel. Daily wear, stacking, seasonal swelling, and whether the ring is an engagement ring, wedding band, or heirloom piece all affect whether sizing now is the right decision.",
          "That matters because customers often assume any discomfort means 'size it up' or any looseness means 'size it down.' In reality, the best outcome comes from deciding whether the ring needs a permanent size change, a temporary sizing aid, or a more careful setting and shank inspection before anything is altered.",
        ],
      },
      {
        heading: "How sizing up and sizing down actually work",
        body: [
          "Sizing down means removing a section of metal, reshaping the shank, and restoring roundness so the ring still feels natural on the hand. Sizing up usually means cutting the shank, adding matched metal, then soldering or welding and blending the seam so the finished ring does not look patched.",
          "Those two directions are not interchangeable in labor or risk. Sizing up usually takes more material and more finish work, while sizing down puts more emphasis on reshaping and making sure the band still balances correctly once metal is removed.",
          "For Pasadena customers, the practical question is whether the result will look clean and feel stable after the work is done. That is why we treat seam finish, roundness, and everyday comfort as part of the repair, not as optional cosmetic extras.",
        ],
      },
      {
        heading: "What limits ring sizing",
        body: [
          "Most standard gold, silver, and platinum rings can be resized safely, but not every design is a good candidate. Alternative metals like tungsten and titanium usually cannot be resized in the same way, and eternity bands or rings with stones all the way around often have hard structural limits.",
          "Decorative engraving, continuous pave, fragile antique details, or prior repair history can also change what is safe. A ring may technically be adjustable, but only within a narrow range if you want to preserve its pattern, symmetry, and stone security.",
          "This is where a real bench assessment matters. A quick answer from a kiosk or chain counter will not always account for thin shanks, hidden wear, or the amount of stress a design can actually take before it starts risking prongs or side stones.",
        ],
      },
      {
        heading: "Protecting stones, finish, and white gold color",
        body: [
          "Stone settings should be inspected before and after sizing, especially on multi-stone rings, halos, and bands with side stones. If a ring already has worn prongs or movement in the setting, the safest path may include reinforcement as part of the same job.",
          "White gold deserves special mention because a clean size adjustment does not automatically restore the ring's bright white appearance. Many white gold rings benefit from polishing and fresh rhodium after the bench work so the seam does not leave a dull or mismatched section behind.",
          "At Susie's, the goal is not simply changing the size. It is returning the ring in wearable condition, with the fit corrected and the finish, settings, and comfort all checked before pickup.",
        ],
      },
      {
        heading: "What ring sizing costs and how long it takes",
        body: [
          "Basic ring sizing often starts around the lower end of our pricing range, while complex sizing starts higher once stone checks, metal additions, wide shanks, or structural reinforcement are involved. The final number depends on the metal, the direction of the size change, the design constraints, and whether finishing work like rhodium is needed afterward.",
          "Most straightforward jobs still follow our Same Day/Next Day pattern, but some rings naturally need more care. If the ring is for a proposal, wedding, anniversary, or upcoming event, that should be part of the first conversation so timing can be planned around the real deadline instead of guessed afterward.",
          "The easiest next step is to start with a fast quote or bring the ring in for a fit and structure assessment. That gives you a real answer on timing and scope before the work begins.",
        ],
      },
    ],
    faqHeading: "Quick answers before resizing a ring",
    faqs: [
      {
        question: "How do I know if my ring needs resizing or if my finger size is just changing temporarily?",
        answer:
          "If the ring is only tight or loose occasionally, seasonal swelling or temperature may be the bigger factor. If it consistently spins, slides off too easily, or hurts at the knuckle, it usually needs a real fit assessment.",
      },
      {
        question: "Can all rings be resized?",
        answer:
          "No. Most gold, silver, and platinum rings can be resized, but tungsten, titanium, some eternity bands, and highly intricate designs may have sizing limits or may not be safe candidates at all.",
      },
      {
        question: "Will resizing affect my stones or finish?",
        answer:
          "It can, which is why settings are checked before and after sizing. White gold rings also often benefit from polishing and rhodium refinishing after the size change so the color stays consistent.",
      },
    ],
    nextStepsHeading: "Best next step if your ring fit still feels uncertain",
    nextStepsIntro:
      "If you want a clear answer on safety, pricing, and timing, start with ring sizing service details or request a fast quote before committing to the resize.",
    nextSteps: [
      { label: "See Ring Sizing Service", href: "/services/ring-sizing" },
      { label: "See Stone Setting Service", href: "/services/stone-setting" },
      { label: "See Jewelry Cleaning Service", href: "/services/jewelry-cleaning" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["ring-sizing", "stone-setting", "jewelry-cleaning"],
  },
  {
    slug: "watch-battery-replacement",
    title: "Watch Battery Replacement: Timing and Care Tips",
    excerpt:
      "What a proper watch battery service includes, when water-resistance checks matter, and how to avoid bigger movement damage by waiting too long.",
    image: "/images/blog/watch-battery-replacement-cover.jpg",
    topics: ["Watch Service", "Preventive Care"],
    publishedAt: "2026-02-17",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "A stopped watch is not always just a dead battery, especially if moisture or old leakage is involved.",
      "Battery service should include case care, gasket awareness, and a realistic conversation about water exposure.",
      "Most standard watch battery replacements still fit the Same Day/Next Day service pattern in Pasadena.",
    ],
    sections: [
      {
        heading: "Why battery timing matters more than most owners think",
        body: [
          "Quartz watches often give subtle warnings before they stop completely. Some begin losing time, some start skipping seconds, and others simply go dead without much notice. The bigger issue is what happens when an old battery is left inside too long, especially if leakage begins inside the movement.",
          "At Susie's, battery replacement is treated as preventive care rather than a last-minute task after a watch has been sitting dead in a drawer. Early replacement is usually faster, cleaner, and lower risk than waiting until the watch has moisture exposure, corrosion, or a gasket problem layered on top.",
          "That matters whether the watch is an everyday work piece, a sentimental family watch, or something you only pull out for travel and special events. The safest service is not just getting the hands moving again. It is preventing the avoidable damage that starts when battery service is delayed too long.",
        ],
      },
      {
        heading: "What proper battery service should include",
        body: [
          "A proper battery replacement should involve more than opening the back, swapping a cell, and closing it again. The case should be handled carefully to avoid scratches, the battery should match the watch correctly, and the watch should be checked for basic fit and function before it goes back on your wrist.",
          "Seal and gasket condition matter too, especially if the watch sees sweat, rain, splashes, or occasional water exposure. A watch can seem fine after a battery swap and still have compromised water resistance if the gasket is dry, dirty, or no longer seating the way it should.",
          "At Susie's, those checks are part of the conversation because battery service is one of the easiest moments to catch a deeper issue early. If the watch needs a more complete service, you should know that before it is treated like a simple battery-only job.",
        ],
      },
      {
        heading: "When pressure testing or moisture checks matter",
        body: [
          "Not every watch needs the same level of post-battery verification. A standard everyday quartz watch may only need a basic seal review, while a water-resistant or sports watch deserves a more careful discussion about moisture, gasket condition, and whether a deeper pressure-related check is appropriate.",
          "If the watch has been in the pool, near steam, out in heavy rain, or has ever fogged under the crystal, the risk level changes. Once moisture gets inside, a fresh battery alone will not solve the real problem.",
          "This is where honest service matters. It is better to hear that your watch needs more than a battery than to leave with a quick swap and discover later that water damage was already starting inside the case.",
        ],
      },
      {
        heading: "When a stopped watch may need more than a battery",
        body: [
          "A dead battery is common, but it is not the only reason a watch stops. Corrosion, moisture intrusion, stem issues, crystal damage, or other movement problems can show up with the same symptom: the watch no longer runs.",
          "If the watch recently started losing time, stopped after being stored for a long period, or has visible signs of moisture or impact, it is worth treating the battery as one part of the diagnosis rather than the whole diagnosis.",
          "This is especially important for sentimental or higher-end watches. A little caution now is often the difference between a simple local battery service and a larger repair later.",
        ],
      },
      {
        heading: "Timing, local convenience, and the best next step",
        body: [
          "Most standard battery replacements still follow our Same Day/Next Day pattern, and many can be handled quickly when the watch is straightforward. More complicated cases take longer for the right reasons: careful opening, seal review, parts condition, or a broader diagnosis if the battery is not the true issue.",
          "For customers coming from Pasadena, Deer Park, La Porte, Webster, or Clear Lake, the easiest move is to start with a quick quote or bring the watch in for a direct in-house assessment. That keeps the process local, transparent, and under one roof.",
          "If the watch matters to you, do not wait until it has sat too long with an aging battery. Early service usually protects both the movement and the long-term cost of ownership.",
        ],
      },
    ],
    faqHeading: "Quick answers about watch battery service",
    faqs: [
      {
        question: "How long does a watch battery replacement usually take?",
        answer:
          "Most straightforward battery replacements follow our Same Day/Next Day service pattern. Timing can stretch if the watch needs careful opening, seal attention, or broader diagnostics.",
      },
      {
        question: "Do you check seals or gaskets during battery replacement?",
        answer:
          "Yes. Seal and gasket condition are part of the service conversation, especially if the watch has water exposure or the owner expects water resistance to remain dependable.",
      },
      {
        question: "Can a stopped watch need more than a battery?",
        answer:
          "Yes. Moisture, corrosion, stem issues, or other movement problems can look like a battery issue, so the watch may need a deeper check than a battery swap alone.",
      },
    ],
    nextStepsHeading: "Best next step if your watch just stopped",
    nextStepsIntro:
      "If you want a local answer before the problem gets bigger, start with the watch repair page or request a fast quote for battery service and condition review.",
    nextSteps: [
      { label: "See Watch Repair Service", href: "/services/watch-repair" },
      { label: "See Bracelet Repair Service", href: "/services/bracelet-repair" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["watch-repair", "bracelet-repair", "heirloom-restoration"],
  },
  {
    slug: "stone-security-checklist",
    title: "Stone Security Checklist: Preventing Loose Diamonds",
    excerpt:
      "How to spot the warning signs of a loose stone, what makes settings fail, and when to act before a diamond or gemstone is lost.",
    image: "/images/blog/stone-security-checklist-cover.jpg",
    topics: ["Stone Safety", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "A rattling stone, snagging prong, or ring that rotates heavily are early warning signs, not harmless quirks.",
      "Weak prongs and unstable seats should be addressed before cleaning, resizing, or daily wear continue.",
      "Reinforcement and resetting are almost always easier than replacing a lost stone later.",
    ],
    sections: [
      {
        heading: "The first warning signs of an unsafe setting",
        body: [
          "If you hear a faint rattle, feel a prong catching on fabric, or notice the stone no longer looks perfectly centered, the setting may already be compromised. These are not cosmetic annoyances. They are early indicators that the stone may be shifting or that the metal securing it has worn down enough to create risk.",
          "At Susie's, this kind of issue is easier to solve when it is caught early. A slightly worn prong or shallow seat can often be reinforced before the stone actually moves far enough to fall out. Waiting usually turns a simple repair into a more stressful and more expensive problem.",
          "A ring that rotates constantly so the stone faces palm-side can also take more daily impact than people realize. Poor fit and weak settings often work together to create the kind of wear that customers only notice after the stone already feels exposed.",
        ],
      },
      {
        heading: "What actually puts stones at risk",
        body: [
          "Worn prongs are one of the most common causes, but they are not the only one. Thin shanks, open or shallow seats, past impact damage, and settings that were already delicate for everyday wear can all create security issues over time.",
          "Home cleaning can also make a weak situation worse if the ring is scrubbed aggressively or exposed to harsh products while the prongs are already compromised. In that case, the cleaning itself is not the root problem. The hidden wear was already there and needed an inspection first.",
          "Vintage rings, halo styles, and pieces with multiple side stones deserve extra caution because small weak points can be harder to spot without magnification.",
        ],
      },
      {
        heading: "When to bring the piece in immediately",
        body: [
          "If the stone moves, tilts, rattles, or suddenly snags, stop wearing the jewelry. The safest move is to put it away and bring it in before another day of errands, work, or gym wear turns the issue into a missing-stone situation.",
          "You should also bring the piece in quickly if it recently took a hit, if a prong looks visibly flattened or shorter than the others, or if the ring has just gone through sizing or another repair and you want the setting rechecked afterward.",
          "At Susie's, that inspection is part of how we protect sentimental and everyday jewelry from preventable loss. It is easier to reinforce a weak setting than to replace the original center stone once it is gone.",
        ],
      },
      {
        heading: "What professional stone-security work can include",
        body: [
          "Depending on the condition, the safest fix may be retipping a worn prong, tightening a loose seat, resetting the stone, rebuilding part of the head, or recommending a stronger overall setting if the current one is too compromised for daily use.",
          "That is also why ring sizing, heirloom restoration, and custom redesign can tie into stone security. Sometimes the real solution is not only tightening the stone. It is strengthening the whole structure that is supposed to protect it.",
          "The right repair path should be explained before the work starts, especially if the customer needs to choose between reinforcement, restoration, or a larger redesign using the original stone.",
        ],
      },
      {
        heading: "The lowest-risk next step for a ring you do not fully trust",
        body: [
          "If a ring already feels questionable, do not wait for a special occasion to test it. Bring it in for a quote-first inspection and let the condition decide whether the piece needs immediate work or simply closer monitoring.",
          "For Pasadena customers, the value is not only the repair itself. It is knowing the jewelry stays in-house, the risks are explained clearly, and the next decision is based on what the setting actually needs rather than on guesswork.",
          "That makes stone-security checks one of the easiest preventive services to justify. A small repair now is usually the cheaper decision compared with replacing a missing diamond later.",
        ],
      },
    ],
    faqHeading: "Quick answers about loose stones and weak settings",
    faqs: [
      {
        question: "Is a tiny rattle in my ring really a problem?",
        answer:
          "Yes. Even slight movement is an early warning sign that the setting may no longer be holding the stone correctly, and it should be checked before the ring is worn much more.",
      },
      {
        question: "Should I clean my ring at home if I think a stone might be loose?",
        answer:
          "No. If the setting already feels questionable, aggressive home cleaning can make the problem worse. Get the setting inspected first.",
      },
      {
        question: "Can a weak setting be repaired without replacing the whole ring?",
        answer:
          "Often yes. Retipping, tightening, or resetting can solve many issues, but badly worn or structurally compromised mountings may need a broader repair or redesign.",
      },
    ],
    nextStepsHeading: "Best next step if a stone no longer feels secure",
    nextStepsIntro:
      "Start with a stone-setting inspection if the piece shows movement, snagging, or a visible prong issue. If the structure is too compromised, the next conversation may move into restoration or redesign.",
    nextSteps: [
      { label: "See Stone Setting Service", href: "/services/stone-setting" },
      { label: "See Ring Sizing Service", href: "/services/ring-sizing" },
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["stone-setting", "jewelry-cleaning", "heirloom-restoration"],
  },
  {
    slug: "chain-repair-weak-points",
    title: "Chain Repair 101: Necklace and Bracelet Weak Points",
    excerpt:
      "Where chains usually fail, how clasps and jump rings wear out, and what makes one repair last longer than a quick temporary fix.",
    image: "/images/blog/chain-repair-weak-points-cover.jpg",
    topics: ["Chain Repair", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "6 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Jump rings, clasp connections, and thin chain segments are the most common weak points.",
      "A lasting repair depends on matching the chain style, the solder work, and the clasp condition instead of only closing the broken spot.",
      "It is usually smarter to fix a weak chain before it fails again and risks losing the piece altogether.",
    ],
    sections: [
      {
        heading: "Where chains usually break first",
        body: [
          "Most chain failures happen at predictable stress points: the jump ring near the clasp, the clasp itself, and the thinnest links in the area that takes the most daily pull. That pattern holds for both necklaces and bracelets because those are the points where tension, twisting, and repeated opening-and-closing tend to collect.",
          "Humidity, sweat, lotions, and everyday movement do not destroy a chain on their own, but over time they can contribute to wear on small joints that are already taking repeated stress. The result is usually a chain that looks fine from a distance until one weak link finally opens or snaps.",
          "Catching those weak points early is one of the easiest ways to prevent a bigger loss, especially if the chain carries a sentimental pendant or is part of your everyday routine.",
        ],
      },
      {
        heading: "Necklace weak points and bracelet weak points are not always the same",
        body: [
          "Necklaces often fail at the clasp connection, the jump ring, or in a fine segment that kinks repeatedly near the front or side. Bracelets can face the same issues, but they also tend to take more abrupt impact during typing, lifting, carrying bags, and normal wrist movement.",
          "That difference matters because a bracelet that catches on counters or desks may need a stronger clasp or a more durable repair strategy than a necklace that mainly suffers from fine-link fatigue.",
          "At Susie's, we treat both categories as in-house repair work, but the most durable fix depends on how the piece is actually worn and where the stress is occurring.",
        ],
      },
      {
        heading: "Why clasps deserve more attention than most customers give them",
        body: [
          "A chain can be professionally repaired and still feel unreliable if the clasp is worn, bent, or difficult to close. In many cases the clasp is not just an accessory part. It is one of the core structural weak points in the entire piece.",
          "That is why clasp replacement or an upgrade is often part of the repair conversation, especially on pieces that have already failed once. If the clasp feels weak in your fingers, pops open too easily, or no longer lines up well, it is worth addressing before the chain comes back into rotation.",
          "For a customer, that can feel like an extra step. In reality, it is what helps turn a quick repair into a repair that actually lasts.",
        ],
      },
      {
        heading: "What makes one chain repair last longer than another",
        body: [
          "A durable repair is not just about reconnecting a broken point. It depends on using the right method for the chain style, applying controlled heat where appropriate, keeping the repair clean in appearance, and checking whether nearby links or the clasp are also becoming weak.",
          "If only the obvious break is closed while the surrounding links stay thin or distorted, the chain often fails again close to the original repair. That is why reinforcement and inspection matter as much as the actual solder point.",
          "At Susie's, the goal is a clean finish that looks natural and feels comfortable to wear, not a bulky or mismatched spot that solves today's break and creates tomorrow's failure.",
        ],
      },
      {
        heading: "Timing, local service, and the best next step",
        body: [
          "Most chain repairs still fit our Same Day/Next Day pattern when the issue is straightforward and the needed parts are standard. If a premium clasp, uncommon chain style, or more delicate reconstruction is involved, the scope should be explained before the work starts.",
          "For Pasadena customers, the easiest next step is to use the fast quote path or bring the piece in for a direct in-house assessment. That is the fastest way to learn whether the chain needs a simple link repair, a clasp replacement, or a broader reinforcement plan.",
          "If the chain already broke once, do not assume the weak point is gone. Ask whether the clasp and nearby links should be addressed too so the repair actually lasts.",
        ],
      },
    ],
    faqHeading: "Quick answers about weak chains and clasp issues",
    faqs: [
      {
        question: "What part of a chain usually breaks first?",
        answer:
          "The most common weak points are the jump ring near the clasp, the clasp itself, and the thinnest links in the section that takes the most daily stress.",
      },
      {
        question: "Should I replace the clasp if the chain already broke once?",
        answer:
          "Often yes. If the clasp feels weak, misaligned, or unreliable, replacing or upgrading it can be part of making the repair last longer.",
      },
      {
        question: "How long does chain repair usually take?",
        answer:
          "Most straightforward chain repairs follow our Same Day/Next Day pattern, but timing can stretch if the chain is delicate, needs an uncommon clasp, or requires broader reinforcement.",
      },
    ],
    nextStepsHeading: "Best next step if your chain already feels unreliable",
    nextStepsIntro:
      "If the chain has a broken link, weak clasp, or repeat failure point, start with the repair service that matches the piece and request a quote-first assessment.",
    nextSteps: [
      { label: "See Necklace Repair Service", href: "/services/necklace-repair" },
      { label: "See Bracelet Repair Service", href: "/services/bracelet-repair" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
      "When gentle home cleaning is enough, when a piece should be professionally cleaned instead, and how to avoid accidental damage to stones, settings, and vintage jewelry.",
    image: "/images/blog/professional-cleaning-vs-home-care-cover.jpg",
    topics: ["Cleaning & Polish", "Preventive Care"],
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-18",
    readTime: "7 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Home cleaning works best for sturdy jewelry and only with mild, low-risk methods.",
      "Professional cleaning is about structure and safety, not just making a piece look brighter.",
      "Vintage jewelry, fragile settings, and white gold often benefit from in-house care instead of stronger home methods.",
    ],
    sections: [
      {
        heading: "When home cleaning is enough",
        body: [
          "For many standard everyday pieces, a simple at-home routine is enough. Mild dish soap, lukewarm water, a short soak, and a very soft brush are usually the safest baseline for removing normal buildup without introducing unnecessary risk.",
          "The important part is knowing what home cleaning can and cannot do. It can remove surface residue and restore some sparkle, but it cannot tell you whether a prong is thinning, whether a seat is opening up, or whether a white gold ring needs more than soap and water to look finished again.",
          "At-home care is best treated as maintenance for sturdy jewelry, not as a replacement for inspection. If the piece is valuable, delicate, sentimental, or already showing signs of wear, home cleaning should stay conservative.",
        ],
      },
      {
        heading: "When home cleaning becomes risky",
        body: [
          "The biggest problems usually come from harsh products or from cleaning a piece that already has a structural issue. Bleach, strong ammonia, abrasive compounds, and aggressive scrubbing can all create damage that customers do not notice until prongs weaken, finishes dull, or older metal starts showing stress.",
          "Vintage and heirloom pieces deserve extra caution because they often have thinner prongs, older solder seams, and more fragile details than modern jewelry. The wrong cleaner or too much force can turn a piece that only needed safe cleaning into a restoration problem.",
          "If a ring already has a loose-feeling stone, an open-looking prong, or delicate gallery work, stop trying to clean it at home until it is inspected. Shine is never more important than security.",
        ],
      },
      {
        heading: "What professional cleaning adds that home cleaning cannot",
        body: [
          "Professional cleaning at Susie's is not just about brightness. It is also a chance to inspect prongs, settings, seams, and overall wear so hidden issues can be caught early. That matters because customers often think a piece only needs polishing when it actually needs a security check first.",
          "Professional service also gives better control over finish decisions. Some customers want a piece polished to a ready-to-wear shine, while others want to preserve more of the vintage character rather than strip everything back to a newer look.",
          "In-house cleaning is especially valuable for white gold, heirlooms, and pieces that have not been inspected in a while. It keeps the conversation local and lets the same team evaluate whether the jewelry only needs cleaning or whether it is time to address a structural concern too.",
        ],
      },
      {
        heading: "Special cases: white gold, heirlooms, and stone security",
        body: [
          "White gold often needs more than basic home cleaning because the ring's color and finish can look uneven after years of wear or after bench work like sizing. A professional clean and polish can be the moment to decide whether rhodium refinishing is the better next step.",
          "Heirloom jewelry should be treated more like preservation work than routine maintenance. The question is not only how to make it shine. It is how to clean it without erasing the character or stressing the structure that makes it sentimental in the first place.",
          "Stone security is another reason professional cleaning matters. A cleaning appointment is one of the easiest opportunities to catch loose settings early, before the customer experiences the much worse version of the problem: a missing stone.",
        ],
      },
      {
        heading: "How to decide which path is right for your piece",
        body: [
          "If the jewelry is sturdy, modern, and free from visible wear, a gentle home routine may be enough between visits. If the piece is vintage, white gold, stone-heavy, or simply too important to gamble with, professional cleaning is usually the better decision.",
          "At Susie's, the advantage is not just that the piece gets cleaned. It is that the same in-house team can tell you whether the jewelry should stay on a cleaning track, move into repair, or be handled more carefully because of age or structural wear.",
          "The safest next step is to choose based on the piece itself, not on a one-size-fits-all cleaning rule.",
        ],
      },
    ],
    faqHeading: "Quick answers about home cleaning versus professional cleaning",
    faqs: [
      {
        question: "What is the safest way to clean jewelry at home?",
        answer:
          "For many sturdy pieces, the safest method is mild dish soap, lukewarm water, and a very soft brush. Skip harsh chemicals and aggressive scrubbing.",
      },
      {
        question: "When should I stop cleaning jewelry at home and bring it in?",
        answer:
          "Bring it in if the piece is vintage, has a loose-feeling stone, delicate details, or a finish issue that home care will not solve safely.",
      },
      {
        question: "Does professional cleaning include more than polishing?",
        answer:
          "Yes. Professional cleaning also gives the jeweler a chance to inspect settings, seams, and wear so small structural issues can be caught before they become bigger repairs.",
      },
    ],
    nextStepsHeading: "Best next step if the piece matters too much to guess",
    nextStepsIntro:
      "If you want to know whether a piece only needs safe cleaning or also needs a security check, start with professional cleaning or an heirloom-focused inspection.",
    nextSteps: [
      { label: "See Jewelry Cleaning Service", href: "/services/jewelry-cleaning" },
      { label: "See Stone Setting Service", href: "/services/stone-setting" },
      { label: "Explore Heirloom Restoration", href: "/services/heirloom-restoration" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
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
    relatedServiceSlugs: ["custom-design", "heirloom-restoration"]
  },
  {
    slug: "how-much-does-pearl-restringing-cost-pasadena",
    title: "How much does pearl restringing cost in Pasadena?",
    excerpt:
      "A local guide to pearl restringing cost, what changes the quote, when clasp work is part of the job, and how to know whether same-day service is realistic.",
    image: "/images/blog/pearl-restringing-timing-guide-cover.jpg",
    topics: ["Pearl Care", "Pricing & Timing"],
    publishedAt: "2026-04-01",
    reviewedAt: "2026-04-01",
    readTime: "6 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "Pearl restringing cost usually depends on strand length, knot count, clasp condition, and whether the strand needs cleanup or matching work.",
      "A straight restring is different from a restring plus clasp replacement, length change, or rebuilding a strand after breakage.",
      "The clearest quote comes after an in-house look or clear photos, not from guessing at strand length over the phone.",
    ],
    sections: [
      {
        heading: "What usually determines pearl restringing cost",
        body: [
          "Pearl restringing is not usually priced from one flat number because not every strand takes the same amount of work. Length, pearl count, knotting style, clasp condition, and how much cleanup the strand needs all influence the final quote.",
          "A straightforward strand that only needs fresh silk and clean hand-knotting is a different job from a strand that already snapped, has a failing clasp, or needs spacing corrected because the old string stretched unevenly. The more the strand has drifted from a simple preventive restring, the more the quote tends to reflect bench time rather than just materials.",
          "For Pasadena customers, the fastest way to get a real answer is a photo-first quote or an in-house assessment. That lets us judge whether the piece is still a clean restring candidate or whether clasp work and strand correction should be part of the same visit.",
        ],
      },
      {
        heading: "What is usually included in a professional restring",
        body: [
          "Professional pearl restringing is more than threading pearls onto fresh silk. The work typically includes inspecting the strand layout, re-knotting between pearls, checking the clasp area, and making sure the drape feels consistent again when the necklace goes back into rotation.",
          "That matters because many pearl strands feel 'fine enough' until you look closely at the clasp area, the spacing between pearls, or the amount of stretch already visible along the strand. A proper restring is supposed to restore confidence, not just buy a few more weeks before the next failure.",
          "If you have an heirloom strand or one you wear to church, weddings, work events, or anniversaries, the goal is a result that feels calm and dependable again, not a quick fix that leaves the weak points untouched.",
        ],
      },
      {
        heading: "When clasp work, cleaning, or breakage change the quote",
        body: [
          "The quote changes when the job moves beyond a simple restring. A worn clasp, a clasp upgrade, a strand that already broke, or pearls that need to be re-sorted can all add work because the service is no longer only about fresh string.",
          "Broken strands are a common example. If the pearls came loose, the job may include sorting, counting, cleaning, and restoring the original order before the actual restring even begins. That is a very different situation from a strand that came in early, before failure, with visible stretch but no missing pearls.",
          "Clasp issues matter too. A strand can be perfectly restrung and still feel unreliable if the clasp is worn or hard to close. When that part of the necklace is already failing, it is smarter to address it during the same visit than to pay for beautiful new stringing attached to weak hardware.",
        ],
      },
      {
        heading: "Timing, same-day expectations, and the best next step",
        body: [
          "Many straightforward pearl restringing jobs still fit our Same Day/Next Day pattern, especially when the strand is intact and the clasp is serviceable. Timing stretches when the strand is unusually long, the clasp needs replacement, or the necklace needs broader cleanup after a break.",
          "If you need the pearls for an event, say that up front. That helps us tell you whether a same-day path is realistic or whether the smarter move is to leave enough room for careful knotting and clasp work without rushing the finish.",
          "For most customers, the best next step is either a fast photo quote or bringing the strand in before it fails completely. That is what gives you the clearest pricing conversation and the safest recommendation on whether to restring now or wait.",
        ],
      },
    ],
    faqHeading: "Quick answers about pearl restringing cost",
    faqs: [
      {
        question: "Is pearl restringing priced by strand length?",
        answer:
          "Length is one major factor, but not the only one. Knot count, clasp condition, cleanup needs, and whether the strand already failed also affect the quote.",
      },
      {
        question: "Can you replace or upgrade the clasp during restringing?",
        answer:
          "Yes. Clasp replacement or upgrade can be handled as part of the same service when the hardware no longer feels secure or comfortable to wear.",
      },
      {
        question: "Can I get a quote from photos first?",
        answer:
          "Usually, yes. Clear photos often let us give a strong starting recommendation, then we confirm the final scope once we inspect the strand in person.",
      },
    ],
    nextStepsHeading: "Best next step if you want a real pearl restringing quote",
    nextStepsIntro:
      "If the strand looks stretched, the clasp feels unreliable, or you need pricing before an event, start with pearl restringing details or send photos for a quote-first recommendation.",
    nextSteps: [
      { label: "See Pearl Restringing Service", href: "/services/pearl-restringing" },
      { label: "See Necklace Repair Service", href: "/services/necklace-repair" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["pearl-restringing", "necklace-repair", "bracelet-repair"],
  },
  {
    slug: "does-my-watch-need-battery-or-repair-pasadena",
    title: "Does my watch need a battery replacement or full watch repair in Pasadena?",
    excerpt:
      "How to tell when a stopped watch is probably just a battery, when it points to a deeper problem, and what an in-house watch assessment should catch before the quote.",
    image: "/images/blog/watch-battery-replacement-cover.jpg",
    topics: ["Watch Service", "Diagnostics"],
    publishedAt: "2026-04-01",
    reviewedAt: "2026-04-01",
    readTime: "6 min read",
    authorName: "Susie’s In-House Team",
    authorRole: "Master Craftsmanship Team",
    keyTakeaways: [
      "A watch that simply stopped may need only a battery, but moisture, corrosion, stem issues, and movement problems can look the same at first.",
      "Jumping seconds, fog under the crystal, or a watch that stopped after water exposure are signs the problem may be bigger than a battery.",
      "A good local diagnosis saves money because it separates quick battery service from the watches that need repair or deeper evaluation.",
    ],
    sections: [
      {
        heading: "Signs it may only need a battery",
        body: [
          "Some watches give the classic signs of a simple battery issue. Quartz pieces may begin losing time, start ticking in larger jumps, or stop after a long period without any obvious moisture or impact history. In those cases, a battery replacement is often the right first move.",
          "That is especially true when the watch was otherwise running normally, the case is clean, and there is no sign of fogging, corrosion, or a damaged stem. A straightforward battery service is usually faster and lower-stress than owners expect when the watch is still structurally healthy.",
          "The important part is not assuming every stopped watch fits that description. Battery symptoms are common, but they are not exclusive to battery-only problems.",
        ],
      },
      {
        heading: "Signs the watch may need more than a battery",
        body: [
          "If the crystal fogged, the watch took a hit, the crown feels loose, or the hands stopped after water exposure, the problem may go beyond a dead cell. Moisture, battery leakage, corrosion, and stem damage can all leave the watch looking 'dead' when the real issue is deeper inside the case.",
          "A watch that sat too long with an old battery can also move out of the quick-fix category. Once leakage starts, the risk shifts from simple battery service to whether the movement already picked up avoidable damage.",
          "For sentimental or higher-end watches, that distinction matters a lot. The wrong assumption can turn a quick local fix into a larger repair later if the real cause is missed at intake.",
        ],
      },
      {
        heading: "What an in-house watch assessment should tell you",
        body: [
          "A useful assessment should tell you whether the watch is a clean battery candidate, whether the case and seal condition look stable, and whether there are signs that point toward deeper repair. That is the real value of bringing the piece to an in-house bench instead of treating every stopped watch like the same kiosk-level service.",
          "At Susie's, that means looking at the obvious symptoms and the context around them: how the watch stopped, whether moisture is visible, whether the crown and stem feel right, and whether the watch category suggests a simple swap or a more careful path. The goal is clarity before approval, not surprises after the back is opened.",
          "That conversation is also where we set timing honestly. Some watches are same-day battery work. Others need slower handling for the right reasons.",
        ],
      },
      {
        heading: "Timing, pricing direction, and the best next step",
        body: [
          "If the watch really is a basic battery job, service often fits the Same Day/Next Day pattern. If the watch shows moisture, stripped screws, crown issues, or signs of corrosion, timing depends on what the inspection finds after intake.",
          "That is why the best commercial-intent question is not only 'how much is a battery?' It is 'am I paying for a battery or for diagnosis plus repair?' A real quote starts by separating those two paths.",
          "If your watch stopped recently and you want the fastest honest answer, start with watch repair details or send a quote request with a quick note about the symptoms. That is the fastest way to learn whether you are likely dealing with a battery, a seal issue, or something bigger.",
        ],
      },
    ],
    faqHeading: "Quick answers about battery vs watch repair",
    faqs: [
      {
        question: "If my second hand jumps every few seconds, is that usually a battery?",
        answer:
          "Often, yes. Many quartz watches use that jump as a low-battery warning, but a bench check still confirms whether the watch is otherwise healthy.",
      },
      {
        question: "If my watch stopped after water exposure, should I try a battery first?",
        answer:
          "No. Water exposure changes the risk immediately. The watch should be inspected for moisture and seal-related damage before it is treated as a simple battery-only job.",
      },
      {
        question: "Can you usually tell the difference the same day?",
        answer:
          "In many cases, yes. A same-day intake assessment usually tells you whether the watch fits a straightforward battery path or needs broader repair attention.",
      },
    ],
    nextStepsHeading: "Best next step if your watch stopped and you do not want to guess",
    nextStepsIntro:
      "If the watch might only need a battery, or might be something bigger, start with watch repair details or send symptoms through the quote form before you drive over.",
    nextSteps: [
      { label: "See Watch Repair Service", href: "/services/watch-repair" },
      { label: "Get Fast Quote", href: "/quote" },
      { label: "Book Repair", href: "/book" },
    ],
    relatedServiceSlugs: ["watch-repair"],
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
  "how-much-does-pearl-restringing-cost-pasadena": "/images/blog/pearl-restringing-timing-guide-cover-mobile.avif",
  "does-my-watch-need-battery-or-repair-pasadena": "/images/blog/watch-battery-replacement-cover-mobile.avif",
};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export const BLOG_TOPICS = Array.from(
  new Set(BLOG_POSTS.flatMap((post) => post.topics))
);

const HELPFUL_BLOG_POST_SLUGS_BY_SERVICE: Record<string, string[]> = {
  "heirloom-restoration": [
    "heirloom-jewelry-restoration-repair-or-redesign",
    "heirloom-restoration-planning-guide",
    "safe-to-clean-vintage-diamond-ring-at-home",
  ],
  "pearl-restringing": [
    "how-much-does-pearl-restringing-cost-pasadena",
    "pearl-restringing-timing-guide",
    "professional-cleaning-vs-home-care",
  ],
};

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

export function getBlogPostsByServiceSlug(serviceSlug: string, count = 3): BlogPost[] {
  return BLOG_POSTS
    .filter((post) => post.relatedServiceSlugs.includes(serviceSlug))
    .map((post) => {
      const priorityIndex = post.relatedServiceSlugs.indexOf(serviceSlug);
      const priorityScore =
        priorityIndex === 0 ? 40 : priorityIndex === 1 ? 24 : priorityIndex === 2 ? 12 : 6;
      const specificityScore = Math.max(0, 5 - post.relatedServiceSlugs.length);
      return { post, priorityScore, specificityScore };
    })
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      if (b.specificityScore !== a.specificityScore) return b.specificityScore - a.specificityScore;
      return b.post.publishedAt.localeCompare(a.post.publishedAt);
    })
    .slice(0, count)
    .map((entry) => entry.post);
}

export function getHelpfulBlogPostsForServiceSlug(serviceSlug: string, count = 3): BlogPost[] {
  return [
    ...(HELPFUL_BLOG_POST_SLUGS_BY_SERVICE[serviceSlug] ?? []).flatMap((slug) => {
      const post = getBlogPostBySlug(slug);
      return post ? [post] : [];
    }),
    ...getBlogPostsByServiceSlug(serviceSlug, count * 2),
  ]
    .filter((post, index, posts) => posts.findIndex((entry) => entry.slug === post.slug) === index)
    .slice(0, count);
}
