export const BUSINESS = {
  name: "Susie’s Jewelry Repair",
  phone: "(281) 991-6500",
  email: "contact@susiesjewelryrepair.com",
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
  serviceAreas: ["Pasadena", "Deer Park", "La Porte", "Houston Area"],
};

export const SERVICES = [
  {
    slug: "watch-repair",
    name: "Watch Repair & Battery Replacement",
    summary: "Precision servicing for modern and vintage watches.",
    time_estimate: "Same Day or Next Day",
    longDescription: [
      "From battery replacements to full mechanical service, we repair modern and vintage watches in-house with careful handling and clean finishing.",
      "Most quick services are completed same day or next day. If your watch needs parts or a full movement overhaul, we will confirm timing and starting-at pricing before any work begins."
    ],
    includes: [
      "Complete movement ultrasonic cleaning",
      "Authentic replacement parts",
      "Gasket lubrication and pressure testing",
      "One-year service warranty"
    ],
    commonRequests: [
      "Crystal replacement",
      "Stem and crown repair",
      "Dial restoration",
      "Band sizing and replacement"
    ],
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/watch-repair.jpg",
    faqs: [
      {
        question: "How fast can you replace a watch battery?",
        answer: "Most battery replacements are completed within the hour while you wait or shop nearby.",
      },
      {
        question: "Can you pressure test after a battery replacement?",
        answer: "Yes. When applicable, we can inspect seals and perform pressure testing to help confirm water resistance.",
      },
      {
        question: "Do you service mechanical watches?",
        answer: "Yes, we specialize in both manual wind and automatic mechanical movements from vintage to modern luxury brands."
      }
    ],
  },
  {
    slug: "ring-sizing",
    name: "Ring Sizing & Repair",
    summary: "Comfortable, precise sizing with clean finishes.",
    time_estimate: "Same Day or Next Day",
    longDescription: [
      "Ensure your rings fit perfectly with our professional sizing services. A ring that's too loose risks being lost, while one that's too tight causes discomfort and can damage the band over time.",
      "We use laser-precision welding and professional finishing techniques to ensure the sizing seam is invisible and the structural integrity of your ring is maintained."
    ],
    includes: [
      "Complimentary professional cleaning",
      "Prong and setting inspection",
      "Invisible seam finishing",
      "Rhodium plating for white gold"
    ],
    commonRequests: [
      "Sizing up with metal addition",
      "Sizing down with precise removal",
      "Arthritic shank installations",
      "Shank thinning and tapering"
    ],
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/ring-sizing.jpg",
    faqs: [
      {
        question: "Can any ring be resized?",
        answer: "Most gold, silver, and platinum rings can be resized. Some metals like tungsten, titanium, or rings with continuous patterns or pave may have limitations."
      }
    ],
  },
  {
    slug: "stone-setting",
    name: "Stone Replacement & Settings",
    summary: "Secure mounts and stone replacements done in-house.",
    time_estimate: "Same Day or Next Day",
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
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/stone-setting.jpg",
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
    time_estimate: "Same Day or Next Day",
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
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/jewelry-cleaning.png",
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
    summary: "Repair broken necklaces, clasps, and delicate chains.",
    time_estimate: "Same Day or Next Day",
    longDescription: [
      "We repair broken necklaces and restore their strength and finish.",
      "From delicate chains to heavier pieces, every repair is reinforced and polished."
    ],
    includes: [
      "Chain soldering and link repair",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair"
    ],
    commonRequests: [
      "Broken chain repair",
      "Lobster clasp replacement",
      "Charm reattachment",
      "Safety chain install"
    ],
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/necklace-repair.png",
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
    summary: "Fix broken links and clasps for a secure, comfortable fit.",
    time_estimate: "Same Day or Next Day",
    longDescription: [
      "We restore bracelets so they wear safely and comfortably again.",
      "Every repair is finished to look seamless and last."
    ],
    includes: [
      "Link repair and reinforcement",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair"
    ],
    commonRequests: [
      "Broken link repair",
      "Clasp replacement",
      "Charm reattachment",
      "Safety chain install"
    ],
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/bracelet-repair.jpg",
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
    summary: "Fresh silk stringing with secure knots for pearls and beads.",
    time_estimate: "Same Day or Next Day",
    longDescription: [
      "Pearls should be restrung to keep them safe and evenly spaced.",
      "We use quality silk and hand-knot between pearls for a clean, classic finish."
    ],
    includes: [
      "Silk restringing",
      "Hand-knotting between pearls",
      "Clasp inspection and cleaning",
      "Length adjustment if needed"
    ],
    commonRequests: [
      "Loose or stretched strings",
      "Broken pearl strand",
      "Bead necklace repair",
      "Clasp upgrade"
    ],
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/pearl-restringing.png",
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
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/custom-design.jpg",
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
    time_estimate: "Same Day or Next Day",
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
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg",
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
