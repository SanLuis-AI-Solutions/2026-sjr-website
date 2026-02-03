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
    longDescription: [
      "Keep your timepieces precise with our expert watch repair services. From simple battery swaps to complex movement overhauls, we handle your watches with master-level care.",
      "Our in-house watchmaker specializes in luxury brands, mechanical movements, and vintage restorations, ensuring your valued possessions remain in perfect working order for years to come."
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
        question: "Do you service mechanical watches?",
        answer: "Yes, we specialize in both manual wind and automatic mechanical movements from vintage to modern luxury brands."
      }
    ],
  },
  {
    slug: "ring-sizing",
    name: "Ring Sizing & Repair",
    summary: "Comfortable, precise sizing with clean finishes.",
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
    faqs: [],
  },
  {
    slug: "necklace-repair",
    name: "Necklace Repair",
    summary: "Repair broken necklaces, clasps, and delicate chains.",
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
    faqs: [],
  },
  {
    slug: "bracelet-repair",
    name: "Bracelet Repair",
    summary: "Fix broken links and clasps for a secure, comfortable fit.",
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
    faqs: [],
  },
  {
    slug: "pearl-restringing",
    name: "Pearl Restringing",
    summary: "Fresh silk stringing with secure knots for pearls and beads.",
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
    faqs: [],
  },
  {
    slug: "custom-design",
    name: "Custom Design",
    summary: "Design a new piece or remount stones with our jeweler.",
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
    faqs: [],
  },
  {
    slug: "heirloom-restoration",
    name: "Heirloom Restorations",
    summary: "Restore treasured pieces with careful, respectful repair.",
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
    faqs: [],
  },
];
