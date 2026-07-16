export const BUSINESS = {
  name: "Susie’s Jewelry Repair",
  phone: "(281) 991-6500",
  email: "contact@susiesjewelryrepair.com",
  googleMapsUrl:
    "https://www.google.com/maps/place/Susie's+Jewelry+and+Watch+Repair/@29.6504877,-95.1863662,17z/data=!3m1!4b1!4m6!3m5!1s0x86409857c894980f:0xf79f8dc5a8328ab9!8m2!3d29.6504877!4d-95.1863662!16s%2Fg%2F1ttph87w",
  sameAs: [
    "https://www.google.com/maps/place/Susie's+Jewelry+and+Watch+Repair/@29.6504877,-95.1863662,17z/data=!3m1!4b1!4m6!3m5!1s0x86409857c894980f:0xf79f8dc5a8328ab9!8m2!3d29.6504877!4d-95.1863662!16s%2Fg%2F1ttph87w",
    "https://www.yelp.com/biz/susies-jewelry-repair-pasadena-2",
    "https://www.facebook.com/p/Susies-Jewelry-Repair-61574507807667/",
  ],
  address: {
    street: "3910 Fairmont Pkwy #C",
    city: "Pasadena",
    state: "TX",
    zip: "77504",
  },
  hours: [
    { day: "Monday", hours: "10:00 AM – 6:00 PM" },
    { day: "Tuesday", hours: "10:00 AM – 6:00 PM" },
    { day: "Wednesday", hours: "10:00 AM – 6:00 PM" },
    { day: "Thursday", hours: "10:00 AM – 6:00 PM" },
    { day: "Friday", hours: "10:00 AM – 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  serviceAreas: [
    "Pasadena",
    "Deer Park",
    "La Porte",
    "Friendswood",
    "Webster",
    "Clear Lake",
    "Houston Area",
  ],
};

export const SERVICE_MOBILE_HERO_IMAGE_BY_SLUG: Record<string, string> = {
  "ring-sizing": "/images/services/ring-sizing-hero-mobile.avif",
  "watch-repair": "/images/services/watch-repair-hero-mobile.avif",
  "custom-design": "/images/services/custom-design-hero-mobile.avif",
};

export const SERVICE_DETAIL_HERO_IMAGE_BY_SLUG: Record<string, string> = {
  "ring-sizing": "/images/services/ring-sizing-hero-wide.jpg",
};

export const SERVICES = [
  {
    slug: "watch-repair",
    name: "Watch Repair & Battery Replacement",
    summary: "In-house watch battery replacement and repair near Pasadena, TX.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "From watch battery replacement to crystal, crown, stem, band, and movement repair, we service modern and vintage watches in-house with careful handling and clear communication.",
      "Most battery and quick watch services follow Same Day/Next Day service. If your watch needs sealing work, parts, pressure testing, or a fuller movement repair, we confirm timing and starting-at pricing before any work begins."
    ],
    includes: [
      "Battery replacement and function check",
      "Band sizing, links, and strap help",
      "Crystal, crown, and stem repair assessment",
      "Seal inspection and pressure testing when applicable"
    ],
    commonRequests: [
      "Watch battery replacement",
      "Watch band sizing",
      "Crystal replacement",
      "Stem and crown repair"
    ],
    image: "/images/services/watch-repair-hero.jpg",
    faqs: [
      {
        question: "How fast can you replace a watch battery?",
        answer: "Many watch battery replacements can be handled with Same Day/Next Day service. We confirm fit, function, and timing before work begins.",
      },
      {
        question: "Can you pressure test after a battery replacement?",
        answer: "When applicable, we can inspect seals and perform pressure testing to help confirm sealing at the time of service. Water resistance depends on the watch condition and cannot be guaranteed for every model.",
      },
      {
        question: "Do you service mechanical watches?",
        answer: "Yes. We assess manual wind, automatic, vintage, and modern watches, then confirm the safest repair path, parts needs, and timing before service."
      }
    ],
  },
  {
    slug: "ring-sizing",
    name: "Ring Sizing & Repair",
    summary: "Same Day/Next Day ring sizing and resizing near Pasadena, TX.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Book in-house ring sizing for rings that feel too loose, too tight, or uncomfortable over the knuckle. We assess fit, metal type, stone security, and finish before any sizing work begins.",
      "Most straightforward gold, silver, and platinum ring resizing follows Same Day/Next Day service. If your ring has side stones, an eternity pattern, white gold rhodium needs, or prior repair work, we confirm pricing and timing before service."
    ],
    includes: [
      "Fit and size assessment",
      "Prong and stone security inspection",
      "Sizing up or sizing down when the design allows",
      "Clean finishing and rhodium guidance for white gold"
    ],
    commonRequests: [
      "Same day ring resizing",
      "Sizing up with metal addition",
      "Sizing down with precise removal",
      "White gold ring sizing",
      "Ring fit assessment"
    ],
    image: "/images/services/ring-sizing-hero-wide.jpg",
    faqs: [
      {
        question: "Can any ring be resized?",
        answer: "Most gold, silver, and platinum rings can be resized. Tungsten, titanium, full eternity bands, continuous patterns, and some pave designs can have limits, so we inspect the ring before recommending a sizing path."
      }
    ],
  },
  {
    slug: "stone-setting",
    name: "Stone Replacement & Settings",
    summary: "Secure mounts and stone replacements done in-house.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Restore the brilliance and security of your jewelry with our expert stone setting and prong repair services. A loose stone is a preventable loss.",
      "Whether you're resetting a family heirloom or replacing a lost accent stone, our craftsmen ensure every gemstone is mounted with maximum security and aesthetic balance."
    ],
    includes: [
      "Tightening of loose stones",
      "Prong retipping and rebuilding",
      "V-tip reinforcement for pointed stones",
      "Professional stone matching"
    ],
    commonRequests: [
      "Diamond replacement",
      "Channel setting repair",
      "Bezel tightening",
      "Prong replacement"
    ],
    image: "/images/services/stone-setting-hero.jpg",
    faqs: [
      {
        question: "Do you provide replacement stones?",
        answer: "Yes, we maintain a large inventory of diamonds and colored gemstones to find the perfect match for your piece."
      }
    ],
  },
  {
    slug: "jewelry-cleaning",
    name: "Jewelry Cleaning & Polishing",
    summary: "Bring back shine with safe, professional cleaning and polishing.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Remove buildup and restore brilliance with deep cleaning that protects stones and settings.",
      "We inspect every piece as we clean, so you know it is safe and ready to wear."
    ],
    includes: [
      "Ultrasonic and steam cleaning",
      "Inspection of prongs and settings",
      "Polishing for metal luster",
      "Care instructions after service"
    ],
    commonRequests: [
      "Tarnish removal",
      "White gold brightening",
      "Stone setting check",
      "Quick refresh before events"
    ],
    image: "/images/services/jewelry-cleaning-hero.jpg",
    faqs: [
      {
        question: "Is ultrasonic cleaning safe for all jewelry?",
        answer:
          "Not always. Some gemstones and materials (like pearls or pieces with fragile settings) require gentler methods. We inspect your piece first and choose the safest cleaning approach.",
      },
      {
        question: "How often should I have my jewelry professionally cleaned?",
        answer:
          "For everyday rings and bracelets, a professional clean and inspection every 6–12 months is a good rule of thumb. We will also check prongs and settings during the visit.",
      },
      {
        question: "Can you remove scratches or dullness?",
        answer:
          "We can often reduce light scratches and restore shine through professional polishing. Deep scratches or heavy wear may require additional refinishing, which we will confirm before work begins.",
      },
    ],
  },
  {
    slug: "necklace-repair",
    name: "Necklace Repair",
    summary: "Broken chain, clasp, and necklace repair near Pasadena, TX.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Book in-house necklace repair for broken chains, weak clasps, jump rings, charm reattachment, and delicate soldering needs.",
      "Most straightforward chain and clasp repairs follow Same Day/Next Day service. We inspect metal type, chain style, break location, and nearby weak points before confirming pricing and timing."
    ],
    includes: [
      "Chain soldering and link repair",
      "Clasp replacement or adjustment",
      "Jump ring and pendant connection checks",
      "Cleaning and finish touch-up after repair"
    ],
    commonRequests: [
      "Broken chain repair",
      "Clasp repair near me",
      "Lobster clasp replacement",
      "Charm reattachment"
    ],
    image: "/images/services/necklace-repair-hero.jpg",
    faqs: [
      {
        question: "Can you repair delicate or thin chains?",
        answer:
          "Yes. We repair delicate chains carefully and can reinforce the repair point when appropriate to help it last.",
      },
      {
        question: "Will the repair be visible?",
        answer:
          "We finish repairs to blend with the existing metal and polish so the seam is as discreet as possible. We will explain what is realistic based on the chain style and metal.",
      },
      {
        question: "Do you replace clasps?",
        answer:
          "Yes. We can replace worn or broken clasps and recommend the best clasp style for security and ease of use.",
      },
    ],
  },
  {
    slug: "bracelet-repair",
    name: "Bracelet Repair",
    summary: "Bracelet repair for broken links, clasps, and safety chains near Pasadena.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Book in-house bracelet repair for broken links, clasp problems, tennis bracelet issues, charm reattachment, fit adjustments, and safety chain upgrades.",
      "Most straightforward bracelet repairs follow Same Day/Next Day service. We check clasp reliability, link movement, stone security, and fit before confirming the repair path."
    ],
    includes: [
      "Link repair and reinforcement",
      "Clasp replacement or adjustment",
      "Safety chain installation when appropriate",
      "Stone, link, and closure inspection"
    ],
    commonRequests: [
      "Bracelet repair near me",
      "Broken link repair",
      "Clasp replacement",
      "Tennis bracelet repair",
      "Safety chain install"
    ],
    image: "/images/services/bracelet-repair-hero.jpg",
    faqs: [
      {
        question: "Can you fix a broken link or clasp?",
        answer:
          "Yes. We repair broken links, rebuild weak points, and replace or adjust clasps so your bracelet wears securely again.",
      },
      {
        question: "Can you adjust the fit of a bracelet?",
        answer:
          "Often, yes. Depending on the style, we can add or remove links or adjust length. Bring any extra links if you have them.",
      },
      {
        question: "Can you add a safety chain?",
        answer:
          "Yes. A safety chain is a great option for added security, especially for bracelets you wear daily.",
      },
    ],
  },
  {
    slug: "pearl-restringing",
    name: "Pearl Restringing",
    summary: "Pearl restringing, knotting, and clasp repair near Pasadena, TX.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "Book in-house pearl restringing for stretched strands, frayed silk, uneven spacing, broken pearl necklaces, and weak clasps.",
      "Most straightforward pearl restringing follows Same Day/Next Day service. We inspect strand length, pearl count, knotting style, clasp condition, and cleanup needs before confirming price and timing."
    ],
    includes: [
      "Silk restringing",
      "Hand-knotting between pearls",
      "Clasp inspection, cleaning, or replacement",
      "Length adjustment and strand layout review"
    ],
    commonRequests: [
      "Pearl restringing cost",
      "Loose or stretched strings",
      "Broken pearl strand",
      "Pearl clasp replacement",
      "Bead necklace repair"
    ],
    image: "/images/services/pearl-restringing-hero.jpg",
    faqs: [
      {
        question: "How often should pearls be restrung?",
        answer:
          "It depends on wear, but many strands benefit from restringing every 1–2 years. If the string looks stretched, frayed, or discolored, it is time.",
      },
      {
        question: "Do you knot between each pearl?",
        answer:
          "Yes. Hand-knotting helps protect pearls by preventing them from rubbing and keeps spacing consistent.",
      },
      {
        question: "Can you adjust the length or replace the clasp?",
        answer:
          "Yes. We can often adjust length during restringing and can inspect, clean, or upgrade the clasp if needed.",
      },
    ],
  },
  {
    slug: "custom-design",
    name: "Custom Design",
    summary: "Design a new piece or remount stones with our jeweler.",
    time_estimate: "7 business days",
    longDescription: [
      "Create something new or redesign a piece you already own.",
      "We guide you from concept to final polish with a clear, collaborative process."
    ],
    includes: [
      "Design consultation",
      "Stone sourcing or reuse",
      "CAD or wax modeling",
      "Final finishing and inspection"
    ],
    commonRequests: [
      "Resetting heirloom stones",
      "Custom engagement rings",
      "Anniversary gifts",
      "Matching sets"
    ],
    image: "/images/services/custom-design-hero.jpg",
    faqs: [
      {
        question: "How long does custom design take?",
        answer:
          "Most custom projects take around 7 business days once the design is approved. If your piece needs special sourcing or additional steps, we will confirm timing up front.",
      },
      {
        question: "Can you use my existing stones or gold?",
        answer:
          "Yes. We can often reuse stones and, in some cases, your existing metal. We evaluate everything during the consultation and recommend the best approach for durability and finish.",
      },
      {
        question: "What does the process look like?",
        answer:
          "We start with a consultation, confirm the design direction, then build and finish the piece with clear updates. Final pricing and timeline are confirmed before any work begins.",
      },
    ],
  },
  {
    slug: "heirloom-restoration",
    name: "Heirloom Restorations",
    summary: "Restore treasured pieces with careful, respectful repair.",
    time_estimate: "Same Day/Next Day service",
    longDescription: [
      "We preserve the look and feel of heirlooms while strengthening them for daily wear.",
      "Our repairs focus on safety, longevity, and faithful restoration."
    ],
    includes: [
      "Prong rebuilds",
      "Structural reinforcement",
      "Stone resetting",
      "Finish matching"
    ],
    commonRequests: [
      "Antique ring repair",
      "Heirloom stone reset",
      "Broken shank repair",
      "General restoration"
    ],
    image: "/images/services/heirloom-restoration-hero.jpg",
    faqs: [
      {
        question: "Will you preserve the original look of my heirloom?",
        answer:
          "Yes. Our goal is to strengthen and restore while keeping the original character. We explain any tradeoffs before you approve work.",
      },
      {
        question: "Can you repair antique or fragile pieces?",
        answer:
          "Often, yes. We inspect the piece, identify weak points, and recommend the safest repair plan for long-term wear.",
      },
      {
        question: "Is restoration done in-house?",
        answer:
          "Yes. Repairs are performed in-house so your piece is not shipped out.",
      },
    ],
  },
];
