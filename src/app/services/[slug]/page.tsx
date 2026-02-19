import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { getFaqsByService, getServiceBySlug, getServices } from "@/lib/content";
import { serviceFaqSchema, serviceSchema } from "@/lib/schema";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";
import { buildServiceVisualSet } from "@/lib/service-visuals";

type PageProps = {
  params: {
    slug: string;
  };
};

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceDetail = {
  slug: string;
  name: string;
  summary?: string;
  short_summary?: string;
  image_url?: string | null;
  image?: string | null;
  starting_price?: string | number | null;
  startingPrice?: string | number | null;
  time_estimate?: string | null;
  timeEstimate?: string | null;
  longDescription?: string[];
  long_description?: string[];
  includes?: string[];
  commonRequests?: string[];
  common_requests?: string[];
  faqs?: FaqItem[];
};

type DecisionModule = {
  label: string;
  title: string;
  intro: string;
  goodCandidate: string;
  caution: string;
  checklist: string[];
};

type ProofSnippet = {
  quote: string;
  context: string;
  byline: string;
};

type MarketScenario = {
  title: string;
  averageStart: string;
  range: string;
  note: string;
};

type MarketSnapshot = {
  label: string;
  updated: string;
  summary: string;
  scenarios: MarketScenario[];
  footnote: string;
};

const DECISION_MODULES: Record<string, DecisionModule> = {
  "watch-repair": {
    label: "Repair vs replace",
    title: "Service now if timing, moisture, or battery life changed.",
    intro:
      "Small watch issues become expensive when ignored. We confirm whether a quick service is enough or if full service is the better value.",
    goodCandidate: "Good candidate for repair: battery drain, crystal damage, crown/stem issues, moisture signs.",
    caution: "Usually not urgent: cosmetic case wear that does not affect function.",
    checklist: [
      "Running slow/fast or stopping unexpectedly",
      "Visible condensation under crystal",
      "Battery dying in less than a year",
    ],
  },
  "ring-sizing": {
    label: "When to bring it in",
    title: "Adjust fit before daily wear causes damage or loss risk.",
    intro:
      "If a ring spins, slips, or pinches, sizing early protects both comfort and settings.",
    goodCandidate: "Good candidate for sizing now: ring spins, leaves deep marks, or catches on knuckles daily.",
    caution: "Usually not urgent: occasional seasonal tightness that resolves quickly.",
    checklist: [
      "Ring rotates and stone faces palm-side",
      "Ring can slide off without resistance",
      "Fit changed after recent weather or body changes",
    ],
  },
  "stone-setting": {
    label: "Repair vs replace",
    title: "Secure the setting first, then decide on replacement.",
    intro:
      "A loose stone is a time-sensitive issue. We prioritize security and only recommend replacement if needed.",
    goodCandidate: "Good candidate for repair: stone movement, worn prongs, or bent settings.",
    caution: "Usually not urgent: minor cosmetic wear with no stone movement.",
    checklist: [
      "Stone clicks or shifts when lightly touched",
      "Prongs look uneven, thin, or lifted",
      "Recent snagging on fabric",
    ],
  },
  "jewelry-cleaning": {
    label: "Good candidate checklist",
    title: "Book professional cleaning when shine drops or buildup appears.",
    intro:
      "Professional cleaning is highest value when paired with a safety inspection of prongs and settings.",
    goodCandidate: "Good candidate for service: dull finish, heavy lotion/soap buildup, or cloudy stones.",
    caution: "Usually not urgent: light surface smudges removable with safe home care.",
    checklist: [
      "Stones look hazy even after home cleaning",
      "Metal has visible film or residue",
      "Piece is worn daily and not inspected recently",
    ],
  },
  "necklace-repair": {
    label: "When to bring it in",
    title: "Repair chain weak points before a complete break.",
    intro:
      "Early chain repair is faster and cleaner than restoring a fully separated section with missing links.",
    goodCandidate: "Good candidate for repair: stretched links, weak clasp tension, partial chain split.",
    caution: "Usually not urgent: cosmetic scratches that do not affect strength.",
    checklist: [
      "Chain kinks repeatedly in the same area",
      "Clasp opens with low resistance",
      "Pendant area pulls unevenly while worn",
    ],
  },
  "bracelet-repair": {
    label: "Good candidate checklist",
    title: "Stabilize links and clasp before the bracelet is lost.",
    intro:
      "Most bracelet failures start as small fit or clasp issues. Early service prevents full loss events.",
    goodCandidate: "Good candidate for repair: loose clasp tongue, separating links, weak jump rings.",
    caution: "Usually not urgent: light surface wear without fit or clasp issues.",
    checklist: [
      "Bracelet opens unexpectedly",
      "Link movement feels uneven or stiff",
      "Safety chain is missing on high-value pieces",
    ],
  },
  "pearl-restringing": {
    label: "When to bring it in",
    title: "Restrung pearls wear cleaner, safer, and longer.",
    intro:
      "Fraying string and knot spacing issues are early warning signs. Restringing early protects pearls from loss.",
    goodCandidate: "Good candidate for restringing: stretched string, visible gaps, fraying near clasp.",
    caution: "Usually not urgent: recently restrung strand with tight knots and clean spacing.",
    checklist: [
      "Knot spacing is uneven across the strand",
      "String looks discolored or fuzzy",
      "Clasp area feels weak or worn",
    ],
  },
  "custom-design": {
    label: "Repair vs redesign",
    title: "Redesign if function, style, and wear goals no longer match.",
    intro:
      "Custom design is best when you want structural upgrades or a new look using stones you already own.",
    goodCandidate: "Good candidate for redesign: inherited stones, outdated mounting, or daily-wear comfort issues.",
    caution: "Usually not urgent: minor style changes that can be solved with light modifications.",
    checklist: [
      "You want to reuse existing stones",
      "Current setting is insecure for daily wear",
      "You need a date-driven timeline with approval steps",
    ],
  },
  "heirloom-restoration": {
    label: "Good candidate checklist",
    title: "Restore only what improves safety and wearability.",
    intro:
      "For heirlooms, we prioritize structural integrity while preserving character and original design cues.",
    goodCandidate: "Good candidate for restoration: worn prongs, cracked shank, unstable stones.",
    caution: "Usually not urgent: visual patina that does not impact structure.",
    checklist: [
      "Stone seats look shallow or open",
      "Band or shank has visible thinning",
      "Piece has sentimental value but limited wearability",
    ],
  },
};

const PROOF_SNIPPETS: Record<string, ProofSnippet[]> = {
  "watch-repair": [
    {
      quote: "Battery swap was quick and they explained pressure testing clearly before starting.",
      context: "Battery + seal check",
      byline: "Pasadena walk-in customer",
    },
    {
      quote: "They caught a crown issue during intake and saved me from a bigger repair later.",
      context: "Preventive assessment",
      byline: "Local repeat customer",
    },
    {
      quote: "Estimate and pickup time matched exactly what they told me up front.",
      context: "Transparent approvals",
      byline: "In-shop service note",
    },
  ],
  "ring-sizing": [
    {
      quote: "Fit is perfect now, and the seam is basically invisible.",
      context: "Sizing + finish quality",
      byline: "Pasadena customer",
    },
    {
      quote: "They checked my prongs before and after sizing, which gave me confidence.",
      context: "Setting safety",
      byline: "Local walk-in customer",
    },
    {
      quote: "Timeline was fast and exactly what they promised at intake.",
      context: "Same Day/Next Day service",
      byline: "In-shop service note",
    },
  ],
  "stone-setting": [
    {
      quote: "They found the loose prong before the stone fell out.",
      context: "Preventive setting repair",
      byline: "Pasadena customer",
    },
    {
      quote: "Replacement stone match was much closer than I expected.",
      context: "Stone matching",
      byline: "Local repair customer",
    },
    {
      quote: "Clear options, no pressure, and everything stayed in-house.",
      context: "Approval process",
      byline: "In-shop service note",
    },
  ],
  "jewelry-cleaning": [
    {
      quote: "My ring looked new again, and they pointed out a prong issue I missed.",
      context: "Clean + inspect",
      byline: "Pasadena customer",
    },
    {
      quote: "They explained what was safe to clean and what needed gentle handling.",
      context: "Gemstone-safe process",
      byline: "Local walk-in customer",
    },
    {
      quote: "Fast turnaround and no upsell, just clear recommendations.",
      context: "Service clarity",
      byline: "In-shop service note",
    },
  ],
  "necklace-repair": [
    {
      quote: "Broken chain was repaired cleanly and feels stronger than before.",
      context: "Chain reinforcement",
      byline: "Pasadena customer",
    },
    {
      quote: "They upgraded my clasp and now I wear it daily without worry.",
      context: "Security upgrade",
      byline: "Local repeat customer",
    },
    {
      quote: "Pricing and repair path were explained in plain language.",
      context: "Transparent estimate",
      byline: "In-shop service note",
    },
  ],
  "bracelet-repair": [
    {
      quote: "They fixed the clasp issue that kept popping open.",
      context: "Clasp reliability",
      byline: "Pasadena customer",
    },
    {
      quote: "Link repair blended well and the fit feels balanced again.",
      context: "Structural repair",
      byline: "Local walk-in customer",
    },
    {
      quote: "Quick intake, clear approval, and pickup was on time.",
      context: "Process trust",
      byline: "In-shop service note",
    },
  ],
  "pearl-restringing": [
    {
      quote: "The knot spacing looks even and the strand lays better now.",
      context: "Hand-knot quality",
      byline: "Pasadena customer",
    },
    {
      quote: "They replaced the worn clasp during restringing in one visit.",
      context: "Combined service",
      byline: "Local repeat customer",
    },
    {
      quote: "They explained exactly when to restring next time.",
      context: "Care guidance",
      byline: "In-shop service note",
    },
  ],
  "custom-design": [
    {
      quote: "The approval checkpoints made the whole custom process low-stress.",
      context: "Design workflow",
      byline: "Pasadena customer",
    },
    {
      quote: "They reused my stones and still made the piece feel brand new.",
      context: "Stone reuse",
      byline: "Local design customer",
    },
    {
      quote: "Timeline was clear and every step was confirmed before moving forward.",
      context: "Project clarity",
      byline: "In-shop service note",
    },
  ],
  "heirloom-restoration": [
    {
      quote: "They preserved the original look while fixing the weak points.",
      context: "Preservation-first restoration",
      byline: "Pasadena customer",
    },
    {
      quote: "I appreciated how they explained what should be restored vs left as-is.",
      context: "Scope discipline",
      byline: "Local walk-in customer",
    },
    {
      quote: "My heirloom is wearable again without losing its character.",
      context: "Daily-wear readiness",
      byline: "In-shop service note",
    },
  ],
};

const MARKET_SNAPSHOTS: Record<string, MarketSnapshot> = {
  "watch-repair": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Working benchmark ranges for common watch services from Houston market listings and published TX repair examples.",
    scenarios: [
      {
        title: "Battery replacement",
        averageStart: "$15",
        range: "$15 to $25",
        note: "Most published Houston listings position basic battery service in this starter range.",
      },
      {
        title: "Crystal replacement",
        averageStart: "$60",
        range: "$60 to $120",
        note: "Material, watch model, and fitment needs drive the spread above entry pricing.",
      },
      {
        title: "General repair intake",
        averageStart: "$50",
        range: "$50 to $180+",
        note: "Rush or same-day requests can increase pricing above standard rates.",
      },
    ],
    footnote:
      "Planning benchmark only. Final in-shop estimate depends on watch condition, parts, and approvals.",
  },
  "ring-sizing": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Current Houston-published ring sizing ranges are broad, so we use segmented starter bands to set expectations.",
    scenarios: [
      {
        title: "Basic sizing adjustment",
        averageStart: "$25",
        range: "$25 to $75",
        note: "Typical for straightforward gold/silver sizing with standard finishing.",
      },
      {
        title: "Complex sizing",
        averageStart: "$75",
        range: "$75 to $150",
        note: "Higher range for larger size moves, stone-adjacent work, or design constraints.",
      },
      {
        title: "Priority turnaround",
        averageStart: "$100",
        range: "1.5x to 2x standard",
        note: "Market examples show same-day priority work commonly priced above baseline service.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on metal type, size delta, and setting safety checks.",
  },
  "stone-setting": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Houston setting-repair pricing is usually anchored by prong and seat work, with sourcing adding variance.",
    scenarios: [
      {
        title: "Prong or seat repair",
        averageStart: "$50",
        range: "$50 to $150",
        note: "Published Houston ranges for prong/setting work cluster in this band.",
      },
      {
        title: "Accent stone + reset",
        averageStart: "$60",
        range: "$60 to $200+",
        note: "Range expands when matching, sourcing, or additional structural work is required.",
      },
      {
        title: "Urgent stabilization",
        averageStart: "$95",
        range: "1.5x to 2x standard",
        note: "Rush setting stabilization can carry a premium over standard queue pricing.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on stone size/type, mounting condition, and sourcing.",
  },
  "jewelry-cleaning": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Published Houston cleaning offers show entry refresh pricing below repair-level work, with polish add-ons scaling cost.",
    scenarios: [
      {
        title: "Quick ultrasonic clean",
        averageStart: "$15",
        range: "$15 to $35",
        note: "Common starter range for straightforward cleaning-only requests.",
      },
      {
        title: "Clean + polish package",
        averageStart: "$20",
        range: "$20 to $50",
        note: "Used for visible luster recovery and light finish improvement.",
      },
      {
        title: "Boutique deep clean",
        averageStart: "$39",
        range: "$39 to $80",
        note: "Some premium Houston offerings begin around the upper end of standard cleaning.",
      },
    ],
    footnote:
      "Planning benchmark only. Fragile stones, plating, and condition checks can change final pricing.",
  },
  "necklace-repair": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Houston repair listings plus Texas benchmark shops indicate necklace pricing generally starts above cleaning and near basic repair intake levels.",
    scenarios: [
      {
        title: "Chain break repair",
        averageStart: "$30",
        range: "$30 to $70",
        note: "Common baseline for simple solder/link repair without major part replacement.",
      },
      {
        title: "Clasp replacement",
        averageStart: "$30",
        range: "$30 to $75",
        note: "Final price depends on clasp style, metal, and any reinforcement needed.",
      },
      {
        title: "Priority same-day repair",
        averageStart: "$50",
        range: "$50 to $100+",
        note: "Rush handling in Houston market examples often trends to roughly double standard pricing.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on chain style, metal, and break location.",
  },
  "bracelet-repair": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Bracelet repair benchmarks in Houston/TX typically mirror necklace pricing, with additional variation for clasp security and link complexity.",
    scenarios: [
      {
        title: "Link or solder repair",
        averageStart: "$30",
        range: "$30 to $70",
        note: "Entry range for isolated link issues and standard solder repairs.",
      },
      {
        title: "Clasp/security work",
        averageStart: "$30",
        range: "$30 to $85",
        note: "Pricing rises when clasp replacement and safety upgrades are combined.",
      },
      {
        title: "Priority turnaround",
        averageStart: "$50",
        range: "$50 to $110+",
        note: "Rush same-day handling is usually priced above standard repair queue rates.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on bracelet construction, parts, and requested upgrades.",
  },
  "pearl-restringing": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Houston bead/pearl pricing is often itemized by strand length and knot count, making per-inch math the clearest planning baseline.",
    scenarios: [
      {
        title: "Restring labor",
        averageStart: "$36",
        range: "$2 per inch",
        note: "An 18-inch strand benchmarks around $36 before knotting or clasp upgrades.",
      },
      {
        title: "Hand-knot add-on",
        averageStart: "$10",
        range: "$0.50 to $1 per knot",
        note: "Knotting costs scale with pearl count and requested spacing style.",
      },
      {
        title: "Clasp service",
        averageStart: "$4",
        range: "$4 to $40+",
        note: "Simple clasp attachment can be low-cost; premium clasp replacements increase total.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on strand length, knot count, clasp type, and pearl condition.",
  },
  "custom-design": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Custom design pricing in Houston spans a wide range by project type, so starter bands are split by use case.",
    scenarios: [
      {
        title: "Remount or redesign (existing stones)",
        averageStart: "$600",
        range: "$600 to $1,500+",
        note: "Texas benchmark shops commonly place entry remount work above standard repair ranges.",
      },
      {
        title: "Custom wedding band",
        averageStart: "$400",
        range: "$400 to $8,000+",
        note: "Houston market examples show broad variation based on metal and stone selection.",
      },
      {
        title: "Custom engagement ring",
        averageStart: "$3,000",
        range: "$3,000 to $25,000+",
        note: "Project complexity, center stone, and sourcing strategy drive final range.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on design scope, materials, sourcing, and revision path.",
  },
  "heirloom-restoration": {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary:
      "Heirloom restoration estimates are typically composed from structural repair + finish work rather than one flat service fee.",
    scenarios: [
      {
        title: "Structural stabilization",
        averageStart: "$50",
        range: "$50 to $150",
        note: "Houston setting/prong repair benchmarks are the common starting anchor.",
      },
      {
        title: "Clean, polish, refinish",
        averageStart: "$20",
        range: "$20 to $80",
        note: "Finish refresh pricing follows Houston cleaning/polish market ranges.",
      },
      {
        title: "Complex restoration",
        averageStart: "$150",
        range: "$150 to $500+",
        note: "Multi-area rebuilds and part fabrication push pricing above basic repair tiers.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate depends on preservation goals, condition risk, and fabrication needs.",
  },
};

function svgDataUri(title: string) {
  const safe = (title || "Service").replace(/&/g, "and").slice(0, 40);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">` +
    `<defs>` +
    `<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">` +
    `<stop offset="0" stop-color="#faf7f2"/>` +
    `<stop offset="1" stop-color="#e9d6c7"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="1200" height="900" fill="url(#g)"/>` +
    `<circle cx="980" cy="170" r="260" fill="#d1b882" opacity="0.25"/>` +
    `<circle cx="260" cy="720" r="320" fill="#7a2e3a" opacity="0.10"/>` +
    `<text x="72" y="780" font-size="54" font-family="Georgia, serif" fill="#2b2621" opacity="0.85">` +
    `${safe}` +
    `</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildFallbackFaqs(serviceName: string): FaqItem[] {
  return [
    {
      question: `How long does ${serviceName.toLowerCase()} usually take?`,
      answer:
        "Most pieces follow Same Day/Next Day service. Final timing depends on parts and repair complexity, and we confirm that before work begins.",
    },
    {
      question: "Is the repair done in-house?",
      answer:
        "Yes. All repair work is completed in our Pasadena shop by our in-house team, so your piece is not shipped out.",
    },
    {
      question: "Can I get a quote before I commit?",
      answer:
        "Yes. Use our Fast Quote form or visit the shop for a free assessment, and we will provide clear starting-at pricing before you approve work.",
    },
    {
      question: "Do I need an appointment?",
      answer:
        "Appointments are optional. Walk-ins are welcome, or you can book a time if you prefer a guaranteed slot.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring the item you want serviced and any relevant parts or notes (for example: extra watch links, missing stones, or a quick description of what changed).",
    },
  ];
}

function buildDefaultMarketSnapshot(serviceName: string): MarketSnapshot {
  return {
    label: "Houston market snapshot (provisional)",
    updated: "Updated Feb 2026",
    summary: `Working benchmark ranges for ${serviceName.toLowerCase()} based on current Houston/TX market examples.`,
    scenarios: [
      {
        title: "Basic service",
        averageStart: "$50",
        range: "$50 to $120",
        note: "Typical entry pricing for standard in-house repair requests.",
      },
      {
        title: "Mid-complexity repair",
        averageStart: "$95",
        range: "$95 to $220",
        note: "Applies when parts, added labor, or multi-step finishing is needed.",
      },
      {
        title: "Priority turnaround",
        averageStart: "$100",
        range: "1.5x to 2x standard",
        note: "Rush handling can increase pricing above baseline service queues.",
      },
    ],
    footnote:
      "Planning benchmark only. Final estimate is confirmed in-shop after condition and scope review.",
  };
}

function buildSupplementalFaqs(slug: string, serviceName: string): FaqItem[] {
  if (slug === "watch-repair") {
    return [
      {
        question: "How much does a watch battery replacement cost?",
        answer:
          "Pricing depends on the watch type, battery, and any sealing work needed. We’ll confirm options and cost during your in-house assessment before you approve service.",
      },
      {
        question: "How long does a watch battery replacement take?",
        answer:
          "Many battery replacements are completed with Same Day/Next Day service. We confirm fit, function, and timing before we begin service.",
      },
      {
        question: "Can you replace a watch crystal?",
        answer:
          "Yes. We can replace cracked or scratched crystals on many watches. We’ll confirm the correct part, pricing, and timing before work begins.",
      },
      {
        question: "Can you repair a broken watch crown or stem?",
        answer:
          "Often, yes. Crown and stem issues can be caused by wear, impact, or water exposure. We’ll assess the safest repair option and confirm pricing first.",
      },
      {
        question: "Can you pressure test or check water resistance after service?",
        answer:
          "When appropriate, we can inspect seals and perform pressure testing to help confirm sealing at the time of service. Water resistance can’t be guaranteed for all watches or future conditions.",
      },
      {
        question: "Do you service automatic and mechanical watches?",
        answer:
          "Yes. We service modern, automatic, and vintage watches. If specialized parts are needed, we confirm availability and timing up front.",
      },
      {
        question: "Do I need an appointment for watch repair?",
        answer:
          "Appointments are optional. Walk-ins are welcome, or you can book a time if you prefer a guaranteed slot.",
      },
    ];
  }

  if (slug === "ring-sizing") {
    return [
      {
        question: "How much does ring sizing cost?",
        answer:
          "Pricing depends on metal type, how many sizes you need to move, and whether additional work is needed. We confirm your exact estimate before service.",
      },
      {
        question: "How long does ring sizing take?",
        answer:
          "Most ring sizing jobs follow our Same Day/Next Day service. If extra metalwork or stone checks are needed, we confirm timing before you approve work.",
      },
      {
        question: "Can you size a ring up or down?",
        answer:
          "Yes. We size rings both up and down when the design allows it, using methods that preserve fit, strength, and finish.",
      },
      {
        question: "Will resizing affect my stones?",
        answer:
          "Stone settings are checked before and after sizing. If prongs or settings need reinforcement, we explain options before proceeding.",
      },
      {
        question: "Do white gold rings need rhodium after sizing?",
        answer:
          "Many white gold rings benefit from rhodium refinishing after sizing for consistent color. We’ll recommend it when appropriate.",
      },
      {
        question: "Can eternity or patterned bands be resized?",
        answer:
          "Some full-eternity, engraved, or alternative-metal bands have resizing limits. We assess safely and suggest the best path before service.",
      },
      {
        question: "Do I need an appointment for ring sizing?",
        answer:
          "Appointments are optional. Walk-ins are welcome, or you can book ahead for a dedicated assessment time.",
      },
    ];
  }

  if (slug === "stone-setting") {
    return [
      {
        question: "How do I know if a stone is loose?",
        answer:
          "If a stone shifts, clicks, or catches on fabric, it should be inspected right away. Loose settings can lead to preventable stone loss.",
      },
      {
        question: "Can you match and replace a missing accent stone?",
        answer:
          "Yes. We can source and match many accent stones, then secure the setting in-house after approval.",
      },
      {
        question: "Do you retip or rebuild worn prongs?",
        answer:
          "Yes. Prong retipping and rebuilding are common ways to restore stone security and extend wear life.",
      },
      {
        question: "How long does stone setting repair usually take?",
        answer:
          "Most stone setting requests follow Same Day/Next Day service. If sourcing or structural work is needed, we confirm timing before work begins.",
      },
      {
        question: "Will setting repair change how my ring or pendant looks?",
        answer:
          "Our goal is to preserve the original look while improving security. We explain visible tradeoffs, if any, before you approve.",
      },
      {
        question: "Should I stop wearing jewelry if a stone feels loose?",
        answer:
          "Yes. Continuing wear can increase risk of loss. Bring it in for a quick in-house assessment before further use.",
      },
    ];
  }

  if (slug === "jewelry-cleaning") {
    return [
      {
        question: "What is included in professional jewelry cleaning?",
        answer:
          "Service typically includes safe cleaning methods, polish where appropriate, and a setting/prong safety check before pickup.",
      },
      {
        question: "How often should I book professional cleaning?",
        answer:
          "For frequently worn pieces, every 6-12 months is common. We also recommend a check before major events or travel.",
      },
      {
        question: "Can you clean delicate jewelry like pearls or fragile stones?",
        answer:
          "Yes, with the right method. We inspect first and use gentle cleaning paths for materials that are not ultrasonic-safe.",
      },
      {
        question: "Do you check prongs and settings during cleaning?",
        answer:
          "Yes. Safety inspection is part of the value of in-house cleaning, especially for daily-wear rings and bracelets.",
      },
      {
        question: "Can polishing remove all scratches?",
        answer:
          "Light surface wear can often be improved. Deep wear may need additional refinishing, which we confirm before service.",
      },
      {
        question: "Is jewelry cleaning available as Same Day/Next Day service?",
        answer:
          "Most cleaning and polishing requests follow Same Day/Next Day service unless structural repairs are discovered during inspection.",
      },
    ];
  }

  if (slug === "necklace-repair") {
    return [
      {
        question: "Can you repair a broken necklace chain the same day?",
        answer:
          "Many chain repairs follow Same Day/Next Day service. We confirm method and timing after inspecting metal type and break location.",
      },
      {
        question: "Do you replace weak or broken clasps?",
        answer:
          "Yes. We can replace worn clasps and recommend more secure options when your necklace is worn frequently.",
      },
      {
        question: "Can delicate or hollow chains be repaired safely?",
        answer:
          "Often, yes. We assess chain construction first and recommend the safest repair path before proceeding.",
      },
      {
        question: "Will soldering affect my pendant area?",
        answer:
          "We protect surrounding areas during repair and explain any expected finishing impact before work begins.",
      },
      {
        question: "Will the repair point be visible?",
        answer:
          "We aim for a clean blend and polished finish. Visibility depends on chain style, metal, and break severity.",
      },
      {
        question: "How can I prevent another chain break?",
        answer:
          "We’ll flag weak points during intake and recommend clasp, link, or wear adjustments to improve long-term durability.",
      },
    ];
  }

  if (slug === "bracelet-repair") {
    return [
      {
        question: "Can you rebuild broken links on bracelets?",
        answer:
          "Yes. We repair and reinforce links in-house, then test movement and closure before pickup.",
      },
      {
        question: "Can you fix a clasp that keeps opening?",
        answer:
          "Yes. We can adjust or replace worn clasp components and recommend added safety options where needed.",
      },
      {
        question: "Can bracelet length be adjusted without extra links?",
        answer:
          "Depending on style, yes. We assess your bracelet construction and confirm the cleanest fit-adjustment approach.",
      },
      {
        question: "Do you repair tennis bracelets?",
        answer:
          "Yes. We inspect stone seats, link integrity, and clasp function before confirming service scope and pricing.",
      },
      {
        question: "Can you add a safety chain during repair?",
        answer:
          "Yes. Adding a safety chain is a common upgrade for high-value or daily-wear bracelets.",
      },
      {
        question: "Should I stop wearing a bracelet with a weak clasp?",
        answer:
          "Yes. Continued wear increases loss risk. Bring it in promptly for an in-house assessment and repair plan.",
      },
    ];
  }

  if (slug === "pearl-restringing") {
    return [
      {
        question: "How do I know when pearls need restringing?",
        answer:
          "Signs include stretched string, visible gaps, fraying near the clasp, or uneven knot spacing.",
      },
      {
        question: "Do you knot between each pearl?",
        answer:
          "Yes. Hand-knotting helps protect pearls from rubbing and limits loss if the strand breaks.",
      },
      {
        question: "Can you shorten, lengthen, or restyle a pearl strand?",
        answer:
          "Often, yes. We can discuss length adjustments and clasp options during your in-house assessment.",
      },
      {
        question: "Can you replace a worn clasp while restringing?",
        answer:
          "Yes. Clasp upgrades or replacements are commonly handled in the same service flow.",
      },
      {
        question: "Should pearls be cleaned before restringing?",
        answer:
          "Yes. We can safely clean and inspect pearls before restringing to confirm condition and handling needs.",
      },
      {
        question: "How should I store pearls after restringing?",
        answer:
          "Store flat, away from dry heat, and separate from harder jewelry to reduce abrasion and preserve strand life.",
      },
    ];
  }

  if (slug === "custom-design") {
    return [
      {
        question: "How much does custom design usually cost?",
        answer:
          "Cost depends on materials, stone sourcing, and design complexity. We confirm pricing options before build begins.",
      },
      {
        question: "How long does each custom-design step take?",
        answer:
          "Most projects follow a 7 business day timeline after design approval, with milestone checkpoints confirmed up front.",
      },
      {
        question: "Can I reuse my own stones or existing jewelry?",
        answer:
          "Yes. We frequently reuse customer stones and evaluate suitability during consultation before committing to final design.",
      },
      {
        question: "Do you provide CAD or model previews before production?",
        answer:
          "Yes, when appropriate. We review design direction before final production so you can approve confidently.",
      },
      {
        question: "Can I request revisions after seeing the design direction?",
        answer:
          "Yes. We include approval checkpoints so updates can be discussed before final production begins.",
      },
      {
        question: "Can custom design be rushed for a deadline?",
        answer:
          "Some timelines can be expedited depending on scope and sourcing. We confirm feasibility before accepting rush requests.",
      },
    ];
  }

  if (slug === "heirloom-restoration") {
    return [
      {
        question: "How do you decide what to restore vs preserve on heirlooms?",
        answer:
          "We prioritize structural safety first, then preserve design character whenever possible. We explain tradeoffs before service.",
      },
      {
        question: "Can you restore worn prongs and shanks without changing the look?",
        answer:
          "Often, yes. We reinforce weak points with the goal of keeping the piece visually faithful to the original style.",
      },
      {
        question: "Do you keep vintage patina or polish it out?",
        answer:
          "That choice is yours. We review finish options so you can choose preservation or refinishing before work begins.",
      },
      {
        question: "Can you reset original heirloom stones?",
        answer:
          "Yes. We assess stone and setting condition, then confirm the safest reset approach in-house.",
      },
      {
        question: "What if my heirloom is too fragile for daily wear?",
        answer:
          "We can recommend stabilization, occasional-wear options, or redesign paths to protect sentimental value.",
      },
      {
        question: "Do you document condition before restoration?",
        answer:
          "Yes. Intake notes and condition review help align expectations before restoration begins.",
      },
    ];
  }

  return [
    {
      question: `What affects the price of ${serviceName.toLowerCase()}?`,
      answer:
        "Complexity, materials, condition, and any required parts affect pricing. We confirm starting-at pricing and options before work begins.",
    },
  ];
}

function canonicalFaqKey(slug: string, question: string): string {
  const q = (question || "").toLowerCase();

  if (slug === "watch-repair") {
    if (q.includes("battery") && (q.includes("cost") || q.includes("price") || q.includes("how much")))
      return "watch:battery:cost";
    if (q.includes("battery") && (q.includes("how long") || q.includes("take")))
      return "watch:battery:time";
    if (q.includes("crystal")) return "watch:crystal";
    if (q.includes("crown") || q.includes("stem")) return "watch:crown-stem";
    if (q.includes("pressure") || q.includes("water") || q.includes("resistan") || q.includes("gasket") || q.includes("seal"))
      return "watch:water-resistance";
    if (q.includes("automatic") || q.includes("mechanical") || q.includes("movement") || q.includes("manual"))
      return "watch:mechanical";
    if (q.includes("appointment") || q.includes("walk in") || q.includes("walk-in") || q.includes("walkins"))
      return "watch:appointment";
  }

  if (slug === "ring-sizing") {
    if (q.includes("cost") || q.includes("price") || q.includes("how much")) return "ring:cost";
    if (q.includes("how long") || q.includes("timing") || q.includes("take")) return "ring:time";
    if ((q.includes("size") || q.includes("sizing")) && (q.includes("up") || q.includes("down")))
      return "ring:up-down";
    if (q.includes("stone") || q.includes("setting") || q.includes("prong")) return "ring:stones";
    if (q.includes("rhodium") || q.includes("white gold")) return "ring:rhodium";
    if (q.includes("eternity") || q.includes("pattern") || q.includes("engraved") || q.includes("alternative metal"))
      return "ring:limits";
    if (q.includes("appointment") || q.includes("walk in") || q.includes("walk-in") || q.includes("walkins"))
      return "ring:appointment";
  }

  if (q.includes("cost") || q.includes("price") || q.includes("how much")) return `${slug}:cost`;
  if (q.includes("how long") || q.includes("timing") || q.includes("turnaround")) return `${slug}:time`;
  if (q.includes("appointment") || q.includes("walk in") || q.includes("walk-in") || q.includes("walkins"))
    return `${slug}:appointment`;
  if (q.includes("in-house") || q.includes("outsour")) return `${slug}:in-house`;
  if (q.includes("bring")) return `${slug}:bring`;
  if (q.includes("same day") || q.includes("next day")) return `${slug}:service-speed`;

  return q.replace(/\s+/g, " ").trim();
}

function ensureMinFaqs(baseFaqs: FaqItem[], slug: string, serviceName: string): FaqItem[] {
  const basePool = Array.isArray(baseFaqs) ? baseFaqs : [];
  const target = SERVICES.some((item) => item.slug === slug) ? 7 : 5;
  const pool =
    slug === "watch-repair"
      ? [...buildSupplementalFaqs(slug, serviceName), ...basePool, ...buildFallbackFaqs(serviceName)]
      : [...basePool, ...buildSupplementalFaqs(slug, serviceName), ...buildFallbackFaqs(serviceName)];

  const seen = new Set<string>();
  const out: FaqItem[] = [];

  for (const item of pool) {
    const question = (item?.question || "").trim();
    const answer = (item?.answer || "").trim();
    if (!question || !answer) continue;

    const key = canonicalFaqKey(slug, question);
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ question, answer });
    if (out.length >= target) break;
  }

  return out;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Service | ${BUSINESS.name}`,
      description:
        "Explore our in-house jewelry and watch repair services in Pasadena, TX.",
      alternates: {
        canonical: "/services",
      },
    };
  }

  const location = `${BUSINESS.address.city}, ${BUSINESS.address.state}`;
  const title = `${service.name} in ${location} | ${BUSINESS.name}`;
  const summary = service.summary || service.short_summary || "";
  const description = `${summary} Local, in-house service with transparent pricing and fast turnaround.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [serviceData, faqs, services] = await Promise.all([
    getServiceBySlug(slug),
    getFaqsByService(slug),
    getServices(),
  ]);
  const service = serviceData as ServiceDetail | undefined;

  if (!service) {
    notFound();
  }

  const embeddedFaqs = service.faqs;
  const resolvedFaqsRaw = Array.isArray(faqs) && faqs.length > 0
    ? faqs
    : Array.isArray(embeddedFaqs) && embeddedFaqs.length > 0
      ? embeddedFaqs
      : buildFallbackFaqs(service.name);
  const resolvedFaqs = ensureMinFaqs(resolvedFaqsRaw, slug, service.name);
  const relatedServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 4);
  const startingAt =
    formatStartingAt(service.starting_price ?? service.startingPrice ?? null) ??
    formatStartingAt(service.startingPrice ?? null);
  const timeEstimate =
    formatTimeEstimate(service.time_estimate ?? service.timeEstimate ?? null) ??
    formatTimeEstimate(service.timeEstimate ?? null);
  const defaultTimeEstimate =
    slug === "custom-design" ? "7 business days" : "Same Day/Next Day service";
  const timeEstimateDisplay = timeEstimate ?? defaultTimeEstimate;

  const isWatchRepair = slug === "watch-repair";
  const isRingSizing = slug === "ring-sizing";
  const isCustomDesign = slug === "custom-design";
  const isFlagshipService = true;
  const heroImageSrc =
    service.image_url || service.image || svgDataUri(service.name);
  const commonRequests = (
    service.commonRequests ||
    service.common_requests ||
    []
  ).filter(Boolean);
  const longDescription = (
    service.longDescription ||
    service.long_description ||
    []
  ).filter(Boolean);
  const includes = (service.includes || []).filter(Boolean);
  const requestHighlights = (
    commonRequests.length > 0
      ? commonRequests
      : ["Assessment", "In-house service", "Clear approvals"]
  ).slice(0, 3);
  const howItWorksIntro = isWatchRepair
    ? "Three simple steps, with a clear approval point before any work begins."
    : isRingSizing
      ? "Three simple steps for precise fit, comfort, and a clean final finish."
      : `Three simple steps for in-house ${service.name.toLowerCase()} with clear timing and approval before work begins.`;
  const howItWorksSteps = isWatchRepair
    ? [
        {
          step: "1",
          title: "Bring your watch",
          detail: "Walk in or book. Extra links help with sizing.",
        },
        {
          step: "2",
          title: "Free assessment",
          detail: "We confirm the fix, price, and timing before service.",
        },
        {
          step: "3",
          title: "Approve, then service",
          detail: "Same Day/Next Day service is common for battery work. Full service varies by parts.",
        },
      ]
    : isRingSizing
      ? [
          {
            step: "1",
            title: "Bring your ring",
            detail: "Walk in or book. Tell us if the fit is tight, loose, or seasonal.",
          },
          {
            step: "2",
            title: "Sizing assessment",
            detail: "We measure fit, inspect stones, and confirm pricing before any work.",
          },
          {
            step: "3",
            title: "Approve, then size",
            detail: "We complete your sizing with clean finishing and confirm pickup timing.",
          },
        ]
      : [
          {
            step: "1",
            title: `Bring your ${service.name.toLowerCase()}`,
            detail: "Walk in or book. We quickly review the issue and your priorities.",
          },
          {
            step: "2",
            title: "In-house assessment",
            detail: "We confirm scope, starting-at pricing, and service timing before work.",
          },
          {
            step: "3",
            title: "Approve, then service",
            detail:
              isCustomDesign
                ? "We finalize design direction, then begin build and finishing with clear milestone updates."
                : "We complete the repair in-house, then confirm final checks and pickup timing.",
          },
        ];
  const visualSet = buildServiceVisualSet(slug, service.name, heroImageSrc, isWatchRepair);
  const heroSupportImage = visualSet.heroSupportImage;
  const heroSupportImageAlt = visualSet.heroSupportImageAlt;
  const howItWorksSupportCopy = isWatchRepair
    ? "We’ll confirm pricing and pickup timing before service begins."
    : isRingSizing
      ? "We confirm your exact ring size, pricing, and pickup timing before work begins."
      : `We confirm your ${service.name.toLowerCase()} scope, pricing, and pickup timing before work begins.`;
  const processGallery = visualSet.processGallery;
  const expectCards = isWatchRepair
    ? [
        {
          title: "Battery replacement",
          eyebrow: "Quick service",
          copy:
            "Often completed while you wait. We confirm fit and function, and can inspect seals when applicable.",
          bullets: [
            "Fresh battery + function check",
            "Basic gasket inspection",
            "Optional pressure test (when applicable)",
          ],
        },
        {
          title: "Full service",
          eyebrow: "Preventive maintenance",
          copy:
            "For slow running, moisture, or overdue maintenance. We confirm timing and parts before work begins.",
          bullets: [
            "Movement cleaning + lubrication",
            "Worn parts evaluation (if needed)",
            "Regulation + final testing",
          ],
        },
        {
          title: "Repairs & parts",
          eyebrow: "When something breaks",
          copy:
            "Crystal, crown/stem, gaskets, and other components. We’ll recommend the safest option and confirm pricing first.",
          bullets: [
            "Crystal replacement",
            "Stem and crown repair",
            "Seal and gasket replacement",
          ],
        },
      ]
    : isRingSizing
      ? [
          {
            title: "Sizing up",
            eyebrow: "When your ring is tight",
            copy:
              "We add metal as needed and finish the seam cleanly so fit and appearance stay premium.",
            bullets: [
              "Fit assessment before sizing",
              "Metal matched to your ring",
              "Polish and final comfort check",
            ],
          },
          {
            title: "Sizing down",
            eyebrow: "When your ring is loose",
            copy:
              "We remove a precise amount, then reshape and finish for secure daily wear.",
            bullets: [
              "Measured size reduction",
              "Roundness and balance check",
              "Clean finishing at pickup",
            ],
          },
          {
            title: "Setting safety",
            eyebrow: "Protecting your stones",
            copy:
              "We inspect prongs and stone security before and after sizing, and explain any recommended reinforcement.",
            bullets: [
              "Pre-size setting inspection",
              "Post-size stability check",
              "Optional refinishing for white gold",
            ],
          },
        ]
      : [
          {
            title: "Service scope",
            eyebrow: "What we address",
            copy:
              longDescription[0] ||
              `We complete ${service.name.toLowerCase()} in-house with clear recommendations and clean finishing.`,
            bullets: includes.slice(0, 3),
          },
          {
            title: "In-house process",
            eyebrow: "How we work",
            copy:
              longDescription[1] ||
              "Every piece is inspected before and after service to confirm quality, safety, and wearability.",
            bullets: [
              "Clear approval before work begins",
              `Typical turnaround: ${timeEstimateDisplay}`,
              "Final checks before pickup",
            ],
          },
          {
            title: "Common requests",
            eyebrow: "What customers ask for most",
            copy: `Popular ${service.name.toLowerCase()} requests are handled by our in-house team with transparent pricing.`,
            bullets: requestHighlights,
          },
        ];
  const expectImages = visualSet.expectImages;
  const whyImageSrc = visualSet.whyImageSrc;
  const whyImageAlt = visualSet.whyImageAlt;
  const expectNoteLabel = isWatchRepair
    ? "Water resistance note:"
    : isRingSizing
      ? "Ring sizing note:"
      : "Service note:";
  const expectNote = isWatchRepair
    ? "pressure testing helps confirm sealing at the time of service, but water resistance can’t be guaranteed for all watches or future conditions."
    : isRingSizing
      ? "some styles (eternity bands, certain metals, engraved patterns) can have sizing limits. We confirm the safest path before service."
      : isCustomDesign
        ? "custom design work includes approval checkpoints before production so you can confirm direction, materials, and final finish."
        : "timing and final scope may vary by condition, materials, or parts availability. We confirm options before work begins.";
  const pricingDetailCopy = isWatchRepair
    ? "Final price depends on parts and condition. We confirm before service."
    : isRingSizing
      ? "Final price depends on metal type, size change, and setting checks. We confirm before service."
      : "Final price depends on materials, condition, and any required parts. We confirm before service.";
  const turnaroundDetailCopy = isWatchRepair
    ? "Same Day/Next Day service is common for battery work. Full service varies by parts availability."
    : isRingSizing
      ? "Most sizing jobs follow Same Day/Next Day service. Complex structural work may require additional time."
      : isCustomDesign
        ? "Custom design projects typically follow a 7 business day timeline after design approval."
        : "Most requests follow Same Day/Next Day service. Complex structural work or parts sourcing may require additional time.";
  const whatToBring = isWatchRepair
    ? [
        "The watch (and any extra links if you have them)",
        "A quick note on the issue: slow/fast, stopping, moisture, crown/stem, crystal",
        "Any recent service history (optional, but helpful)",
      ]
    : isRingSizing
      ? [
          "The ring and your preferred fit (snug, comfort, or stack fit)",
          "Any sizing history or recent fit changes (optional)",
          "If white gold: let us know if you want rhodium refinishing",
        ]
      : isCustomDesign
        ? [
            "Reference photos or style ideas",
            "Any stones or jewelry you want to reuse",
            "Target budget and occasion timeline",
          ]
        : [
            `The ${service.name.toLowerCase()} item you want serviced`,
            "Any missing parts, notes, or prior service info (if available)",
            "Your preferred timing and any wear concerns to address",
          ];
  const whyHeading = isWatchRepair
    ? "In-house service, clear approval, careful finishing."
    : isRingSizing
      ? "Precise fit, clean finish, and transparent approvals."
      : `In-house ${service.name.toLowerCase()}, clear approval, careful finishing.`;
  const whyIntroCopy = isWatchRepair
    ? "We do the work here in Pasadena. If anything changes during assessment, we pause, explain your options, and only continue with your approval."
    : isRingSizing
      ? "Your ring stays with our in-house team in Pasadena. If we identify setting or structural concerns, we pause and review options before continuing."
      : `Your ${service.name.toLowerCase()} stays with our in-house team in Pasadena. If scope changes during assessment, we pause and review options before continuing.`;
  const whyCards = isWatchRepair
    ? [
        {
          title: "In-house watch service",
          detail: "Your watch stays with our team. No shipping, no outsourcing.",
        },
        {
          title: "Transparent approvals",
          detail: "You see the price and timing before work begins. No surprises.",
        },
        {
          title: "Quality checks",
          detail: "Function checks and final testing are part of our process before pickup.",
        },
      ]
    : isRingSizing
      ? [
          {
            title: "In-house ring sizing",
            detail: "Your ring stays in our workshop. No shipping or outsourced handling.",
          },
          {
            title: "Transparent approvals",
            detail: "You approve price, timing, and method before we begin service.",
          },
          {
            title: "Finish quality checks",
            detail: "We check fit, shape, and polish before pickup so the ring wears comfortably.",
          },
        ]
      : [
          {
            title: "In-house craftsmanship",
            detail: `Your ${service.name.toLowerCase()} is completed in-house, not outsourced.`,
          },
          {
            title: "Transparent approvals",
            detail: "You approve pricing and timing before work begins. No surprises.",
          },
          {
            title: "Final quality checks",
            detail: "We confirm finish, function, and wearability before pickup.",
          },
        ];
  const trustNote = isWatchRepair
    ? "We’ll confirm price and timing before service begins. If parts are needed, we pause and get your approval before ordering or proceeding."
    : isRingSizing
      ? "We confirm final ring size, method, and timing before service. If setting reinforcement is recommended, we review options and wait for approval."
      : `We confirm ${service.name.toLowerCase()} scope, timing, and pricing before service. If additional work is recommended, we review options and wait for approval.`;
  const trustBadges = isWatchRepair
    ? ["In-house only", "Clear estimates", "Final checks"]
    : isRingSizing
      ? ["In-house only", "Fit precision", "Setting checks"]
      : ["In-house only", "Clear estimates", "Final checks"];
  const decisionModule = DECISION_MODULES[slug] || {
    label: "Decision guide",
    title: `When to schedule ${service.name.toLowerCase()}`,
    intro:
      "A short in-house assessment helps you decide whether immediate service is the best value or if it can safely wait.",
    goodCandidate: "Good candidate now: function, fit, or security issues during regular wear.",
    caution: "Usually not urgent: cosmetic wear that does not affect safety or function.",
    checklist: [
      "Issue affects daily wear or comfort",
      "You notice increased wear since last inspection",
      "You want confirmed pricing before deciding",
    ],
  };
  const proofSnippets = (PROOF_SNIPPETS[slug] || [
    {
      quote: "Clear intake, clear approvals, and quality finishing.",
      context: "Process clarity",
      byline: "Pasadena customer",
    },
    {
      quote: "The team explained options in plain language before starting.",
      context: "Transparent estimates",
      byline: "Local walk-in customer",
    },
    {
      quote: "Timeline and final result matched what was promised.",
      context: "Pickup confidence",
      byline: "In-shop service note",
    },
  ]).slice(0, 3);
  const marketSnapshot =
    MARKET_SNAPSHOTS[slug] || buildDefaultMarketSnapshot(service.name);
  const schemaBase = SERVICES.find((item) => item.slug === service.slug) || SERVICES[0];
  const schemaService = {
    ...schemaBase,
    ...service,
    summary: service.summary || service.short_summary || schemaBase.summary,
    time_estimate: service.time_estimate || schemaBase.time_estimate,
    longDescription: service.longDescription || service.long_description || schemaBase.longDescription,
    includes: service.includes || schemaBase.includes,
    commonRequests: commonRequests.length > 0 ? commonRequests : schemaBase.commonRequests,
    image: service.image || service.image_url || schemaBase.image,
    faqs: resolvedFaqs,
  };

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-50 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(122,46,58,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.20),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Service Detail
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-950">
              {service.name} in {BUSINESS.address.city}, {BUSINESS.address.state}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-stone-700">
              {service.summary || service.short_summary}
            </p>
            {(startingAt || timeEstimateDisplay) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-700">
                {startingAt && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
                    Starts at {startingAt}
                  </span>
                )}
                {timeEstimateDisplay && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
                    Service: {timeEstimateDisplay}
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-stone-900">
                Need {service.name} in {BUSINESS.address.city}?
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                {isWatchRepair
                  ? "Yes. We service watches in-house with clear options, transparent estimates, and a confirmed pickup timeline before work begins."
                  : `Yes. We provide in-house ${service.name.toLowerCase()} with transparent pricing, clear timing, and local pickup at our ${BUSINESS.address.city} shop.`}
              </p>
            </div>

            {/* "Last updated" removed (adds clutter and doesn't improve conversion). */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="micro-interaction rounded-full bg-brand-burgundy px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction rounded-full border border-brand-gold px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
            </div>
          </div>
          <div className="relative reveal-on-scroll">
            <div className="relative h-[320px] overflow-hidden rounded-3xl border border-stone-200 shadow-[0_28px_70px_rgba(58,25,16,0.18)] md:h-[380px]">
              <Image
                src={heroImageSrc}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(209,184,130,0.20),_transparent_55%)]" />
            </div>
            <div className="absolute -bottom-8 left-6 right-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.25em] text-brand-burgundy">
                In-house assessment
              </div>
              <p className="mt-2 text-sm text-stone-600">
                Fast, local evaluations with transparent starting-at pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                How it works
              </h2>
              <p className="mt-3 font-serif text-3xl text-stone-900">
                What happens next.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                {howItWorksIntro}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {howItWorksSteps.map((item, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <article
                      key={item.step}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-burgundy text-xs font-semibold text-white shadow">
                          {item.step}
                        </span>
                        <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                          Step {item.step}
                        </div>
                      </div>
                      <div className="mt-4 font-serif text-xl text-stone-900">
                        {item.title}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-stone-600">
                        {item.detail}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="reveal-on-scroll relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">
              <div className="relative h-64">
                <Image
                  src={heroSupportImage}
                  alt={heroSupportImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              </div>
              <div className="px-6 py-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                  Typical turnaround
                </div>
                <div className="mt-2 font-serif text-2xl text-stone-900">
                  {timeEstimateDisplay}
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {howItWorksSupportCopy}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/quote"
                    className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Get Fast Quote
                  </Link>
                  <Link
                    href="/book"
                    className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Book Repair
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {processGallery.map((img, index) => {
              const delayClass = `reveal-delay-${(index % 3) + 1}`;
              return (
                <div
                  key={`${img.url}-${img.label}`}
                  className={`reveal-on-scroll ${delayClass} relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm`}
                >
                  <div className="relative h-44">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                  </div>
                  <div className="px-5 py-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                      {img.label}
                    </div>
                    <p className="mt-2 text-sm text-stone-700">
                      In-house work with a clear approval point before service begins.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {isFlagshipService ? (
        <>
          <section className="relative bg-stone-50 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                What to expect
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Service options, explained clearly.
              </h2>

              <div className="mt-6 grid gap-4">
                {expectCards.map((block, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <article
                      key={block.title}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-white p-6 shadow-sm`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                        {block.eyebrow}
                      </div>
                      <h3 className="mt-3 font-serif text-2xl text-stone-900">
                        {block.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-stone-600">
                        {block.copy}
                      </p>
                      <ul className="mt-5 space-y-2 text-sm text-stone-600">
                        {block.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3">
                            <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {expectImages.map((img) => (
                  <div
                    key={img.url}
                    className="reveal-on-scroll relative h-44 overflow-hidden rounded-3xl border border-stone-200 shadow-sm md:h-52"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/25 via-transparent to-transparent" />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-brand-gold/25 bg-white/80 p-5 text-sm text-stone-700 reveal-on-scroll shadow-sm">
                <span className="font-semibold text-stone-900">
                  {expectNoteLabel}
                </span>{" "}
                {expectNote}
              </div>
            </div>
          </section>

          <section className="relative bg-white py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,_rgba(122,46,58,0.06),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Pricing & timing
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Clear estimates. Confirmed pickup.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                We confirm pricing, options, and timing before work begins. No surprises.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Starting at
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {startingAt ?? "Request quote"}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {pricingDetailCopy}
                  </p>
                </div>
                <div className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Typical turnaround
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {timeEstimateDisplay}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {turnaroundDetailCopy}
                  </p>
                </div>
              </div>

              <div
                className="mt-6 reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-white p-6 shadow-sm"
                data-testid="service-market-snapshot"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    {marketSnapshot.label}
                  </div>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-600">
                    {marketSnapshot.updated}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
                  {marketSnapshot.summary}
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {marketSnapshot.scenarios.map((scenario) => (
                    <article
                      key={scenario.title}
                      className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                      data-testid="service-market-snapshot-item"
                    >
                      <h3 className="font-serif text-lg text-stone-900">{scenario.title}</h3>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-burgundy">
                        Starts around {scenario.averageStart}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">{scenario.range}</p>
                    </article>
                  ))}
                </div>
                <details className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                    Why ranges vary
                  </summary>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                    {marketSnapshot.scenarios.map((scenario) => (
                      <li key={`${scenario.title}-note`}>
                        <span className="font-semibold text-stone-900">{scenario.title}:</span>{" "}
                        {scenario.note}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-6 text-stone-500">
                    {marketSnapshot.footnote}
                  </p>
                </details>
              </div>

              <div className="mt-6 reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-gradient-to-br from-[#fffaf3] via-white to-[#f8efe2] p-6 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Next step
                </div>
                <h3 className="mt-2 font-serif text-2xl text-stone-900">
                  Choose a quick action.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">
                  Quote if you need exact pricing first. Book if you are ready for an in-shop assessment.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/quote"
                    className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Get Fast Quote
                  </Link>
                  <Link
                    href="/book"
                    className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Book Repair
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="relative bg-stone-50 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,_rgba(122,46,58,0.08),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Before you visit
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Bring the right details, decide with confidence.
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    What to bring
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-stone-600">
                    {whatToBring.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-brand-gold/30 bg-gradient-to-br from-[#fffaf3] via-white to-[#f8efe2] p-6 shadow-sm"
                  data-testid="service-decision-module"
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    {decisionModule.label}
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-stone-900">
                    {decisionModule.title}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
                    {decisionModule.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 rounded-2xl border border-stone-200 bg-white/90 p-4 text-sm leading-6 text-stone-700">
                    <span className="font-semibold text-stone-900">Bring it in now:</span>{" "}
                    {decisionModule.goodCandidate}
                  </p>
                  <details className="mt-3 rounded-2xl border border-stone-200 bg-white/90 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                      When it can usually wait
                    </summary>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      {decisionModule.caution}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </section>

          <section className="relative bg-white py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h2 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                    Why customers choose us
                  </h2>
                  <p className="mt-3 font-serif text-3xl text-stone-900">
                    {whyHeading}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                    {whyIntroCopy}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {whyCards.map((item, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <div
                      key={item.title}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-white p-6 shadow-sm`}
                    >
                      <div className="font-serif text-xl text-stone-900">{item.title}</div>
                      <p className="mt-2 text-sm leading-7 text-stone-700">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <div className="reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-white/85 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    Trust note
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {trustNote}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-700">
                    {trustBadges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="reveal-on-scroll reveal-delay-2 relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                  <div className="relative h-56 md:h-full">
                    <Image
                      src={whyImageSrc}
                      alt={whyImageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Customer proof
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3" data-testid="service-proof-blocks">
                  {proofSnippets.map((item, index) => {
                    const delayClass = `reveal-delay-${(index % 3) + 1}`;
                    return (
                      <figure
                        key={`${item.quote}-${item.byline}`}
                        className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-white p-5 shadow-sm`}
                      >
                        <blockquote className="text-sm leading-7 text-stone-700">
                          &ldquo;{item.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-4 border-t border-stone-200 pt-3 text-[11px] uppercase tracking-[0.22em] text-stone-500">
                          <span className="text-brand-burgundy">{item.context}</span> · {item.byline}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                What to expect
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Service options, explained clearly.
              </h2>
              {(service.longDescription || service.long_description || []).map((paragraph: string) => (
                <p key={paragraph} className="mt-4 text-sm text-stone-600">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-100/60 p-6">
              {(startingAt || timeEstimateDisplay) && (
                <>
                  <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                    Pricing & timing
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-stone-600">
                    {startingAt && (
                      <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                        <span className="font-semibold text-stone-900">Starting at</span>
                        <span>{startingAt}</span>
                      </div>
                    )}
                    {timeEstimateDisplay && (
                      <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                        <span className="font-semibold text-stone-900">Typical turnaround</span>
                        <span>{timeEstimateDisplay}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 border-t border-stone-200 pt-4" />
                </>
              )}

              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Includes
              </div>
              <ul
                className="mt-4 space-y-3 text-sm text-stone-600"
                data-testid="service-includes"
              >
                {(service.includes || []).map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  Common requests
                </div>
                <ul
                  className="mt-3 space-y-2 text-sm text-stone-600"
                  data-testid="service-common-requests"
                >
                  {(service.commonRequests || service.common_requests || []).map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  Why customers choose us
                </div>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>• In-house repairs with no outsourcing</li>
                  <li>• Same Day/Next Day service on most pieces</li>
                  <li>• Clear approval before work starts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isFlagshipService ? (
        <section className="bg-stone-100 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Service area
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Local care for {BUSINESS.address.city} and nearby communities.
              </h2>
              <p className="mt-4 text-sm text-stone-600">
                Visit us at {BUSINESS.address.street}, {BUSINESS.address.city}, {" "}
                {BUSINESS.address.state} {BUSINESS.address.zip}. We serve {" "}
                {BUSINESS.serviceAreas.join(", ")}. Call {BUSINESS.phone} for
                timing or pricing questions.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Hours
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-600">
                {BUSINESS.hours.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
                  >
                    <span className="font-semibold text-stone-900">{row.day}</span>
                    <span>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            FAQs
          </p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">
            Answers about {service.name}.
          </h2>
          <div className="mt-8 space-y-4">
            {resolvedFaqs.map((faq: FaqItem) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-stone-200 bg-stone-100/60 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition group-open:rotate-45 group-open:text-brand-burgundy"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Related services
              </p>
              <h2 className="mt-2 font-serif text-2xl text-stone-900">
                Compare nearby repair options
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              View all services →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />

      {/* Mobile conversion bar (75%+ traffic). Keeps primary actions one tap away. */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div
          role="region"
          aria-label="Quick actions"
          className="rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="flex-1 rounded-full bg-brand-burgundy px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="flex-1 rounded-full border border-brand-gold px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Repair
            </Link>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema(schemaService)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceFaqSchema(schemaService)),
        }}
      />
    </SiteShell>
  );
}
