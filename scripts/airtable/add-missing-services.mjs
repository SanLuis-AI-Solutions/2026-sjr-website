const baseId = "app6ogTLP23Fy37bR";
const tableId = "tblgzWv9JR6QbT42h";
const token = process.env.AIRTABLE_PAT_TOKEN;

if (!token) {
  console.error("Missing AIRTABLE_PAT_TOKEN");
  process.exit(1);
}

const services = [
  {
    slug: "watch-repair",
    name: "Watch Repair & Battery Replacement",
    short_summary: "Precision servicing for modern and vintage watches.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/watch-repair-hero.jpg",
    long_description: [
      "Keep your timepieces precise with expert watch repair. From battery swaps to movement overhauls, we handle every watch with care.",
      "Our in-house watchmaker specializes in luxury brands, mechanical movements, and vintage restorations.",
    ],
    includes: [
      "Complete movement ultrasonic cleaning",
      "Authentic replacement parts",
      "Gasket lubrication and pressure testing",
      "One-year service warranty",
    ],
    common_requests: [
      "Crystal replacement",
      "Stem and crown repair",
      "Dial restoration",
      "Band sizing and replacement",
    ],
  },
  {
    slug: "ring-sizing",
    name: "Ring Sizing & Repair",
    short_summary: "Comfortable, precise sizing with clean finishes.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/ring-sizing-hero.jpg",
    long_description: [
      "Ensure your rings fit perfectly with professional sizing services.",
      "We use precision techniques to keep seams invisible and integrity intact.",
    ],
    includes: [
      "Complimentary professional cleaning",
      "Prong and setting inspection",
      "Invisible seam finishing",
      "Rhodium plating for white gold",
    ],
    common_requests: [
      "Sizing up with metal addition",
      "Sizing down with precise removal",
      "Arthritic shank installations",
      "Shank thinning and tapering",
    ],
  },
  {
    slug: "stone-setting",
    name: "Stone Replacement & Settings",
    short_summary: "Secure mounts and stone replacements done in-house.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/stone-setting-hero.jpg",
    long_description: [
      "Restore brilliance and security with expert stone setting and prong repair.",
      "We match stones and secure every setting for long-term wear.",
    ],
    includes: [
      "Tightening of loose stones",
      "Prong retipping and rebuilding",
      "V-tip reinforcement for pointed stones",
      "Professional stone matching",
    ],
    common_requests: [
      "Diamond replacement",
      "Channel setting repair",
      "Bezel tightening",
      "Prong replacement",
    ],
  },
  {
    slug: "jewelry-cleaning",
    name: "Jewelry Cleaning & Polishing",
    short_summary: "Bring back shine with safe, professional cleaning and polishing.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/jewelry-cleaning-hero.jpg",
    long_description: [
      "Remove buildup and restore brilliance while protecting stones and settings.",
      "Every piece is inspected during cleaning for safety.",
    ],
    includes: [
      "Ultrasonic and steam cleaning",
      "Inspection of prongs and settings",
      "Polishing for metal luster",
      "Care instructions after service",
    ],
    common_requests: [
      "Tarnish removal",
      "White gold brightening",
      "Stone setting check",
      "Quick refresh before events",
    ],
  },
  {
    slug: "necklace-repair",
    name: "Necklace Repair",
    short_summary: "Repair broken necklaces, clasps, and delicate chains.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/necklace-repair-hero.jpg",
    long_description: [
      "We repair broken necklaces and restore their strength and finish.",
      "From delicate chains to heavier pieces, every repair is reinforced and polished.",
    ],
    includes: [
      "Chain soldering and link repair",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair",
    ],
    common_requests: [
      "Broken chain repair",
      "Lobster clasp replacement",
      "Charm reattachment",
      "Safety chain install",
    ],
  },
  {
    slug: "bracelet-repair",
    name: "Bracelet Repair",
    short_summary: "Fix broken links and clasps for a secure, comfortable fit.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/bracelet-repair-hero.jpg",
    long_description: [
      "We restore bracelets so they wear safely and comfortably again.",
      "Every repair is finished to look seamless and last.",
    ],
    includes: [
      "Link repair and reinforcement",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair",
    ],
    common_requests: [
      "Broken link repair",
      "Clasp replacement",
      "Charm reattachment",
      "Safety chain install",
    ],
  },
  {
    slug: "pearl-restringing",
    name: "Pearl Restringing",
    short_summary: "Fresh silk stringing with secure knots for pearls and beads.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/pearl-restringing-hero.jpg",
    long_description: [
      "Pearls should be restrung to keep them safe and evenly spaced.",
      "We hand-knot between pearls for a clean, classic finish.",
    ],
    includes: [
      "Silk restringing",
      "Hand-knotting between pearls",
      "Clasp inspection and cleaning",
      "Length adjustment if needed",
    ],
    common_requests: [
      "Loose or stretched strings",
      "Broken pearl strand",
      "Bead necklace repair",
      "Clasp upgrade",
    ],
  },
  {
    slug: "custom-design",
    name: "Custom Design",
    short_summary: "Design a new piece or remount stones with our jeweler.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/custom-design-hero.jpg",
    long_description: [
      "Create something new or redesign a piece you already own.",
      "We guide you from concept to final polish with a clear, collaborative process.",
    ],
    includes: [
      "Design consultation",
      "Stone sourcing or reuse",
      "CAD or wax modeling",
      "Final finishing and inspection",
    ],
    common_requests: [
      "Resetting heirloom stones",
      "Custom engagement rings",
      "Anniversary gifts",
      "Matching sets",
    ],
  },
  {
    slug: "heirloom-restoration",
    name: "Heirloom Restorations",
    short_summary: "Restore treasured pieces with careful, respectful repair.",
    image:
      "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/heirloom-restoration-hero.jpg",
    long_description: [
      "We preserve the look and feel of heirlooms while strengthening them for daily wear.",
      "Repairs focus on safety, longevity, and faithful restoration.",
    ],
    includes: [
      "Prong rebuilds",
      "Structural reinforcement",
      "Stone resetting",
      "Finish matching",
    ],
    common_requests: [
      "Antique ring repair",
      "Heirloom stone reset",
      "Broken shank repair",
      "General restoration",
    ],
  },
];

async function airtableFetch(endpoint, options = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

async function getExistingSlugs() {
  const existing = new Set();
  let offset = undefined;
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("fields[]", "slug");
    if (offset) url.searchParams.set("offset", offset);
    const data = await airtableFetch(url.toString());
    (data.records || []).forEach((record) => {
      const slug = record.fields?.slug;
      if (slug) existing.add(slug);
    });
    offset = data.offset;
  } while (offset);
  return existing;
}

async function createRecords(records) {
  const chunks = [];
  for (let i = 0; i < records.length; i += 10) {
    chunks.push(records.slice(i, i + 10));
  }

  for (const chunk of chunks) {
    const payload = {
      records: chunk.map((service) => ({
        fields: {
          name: service.name,
          slug: service.slug,
          short_summary: service.short_summary,
          image: service.image ? [{ url: service.image }] : [],
          long_description: JSON.stringify(service.long_description),
          includes: JSON.stringify(service.includes),
          common_requests: JSON.stringify(service.common_requests),
          price_note: "Starting at $25+",
          priority: 0,
          active: true,
          meta_title: `${service.name} | Susie’s Jewelry Repair`,
          meta_description: service.short_summary,
          geo_city: "Pasadena",
          geo_state: "TX",
          geo_area: "Houston Area",
        },
      })),
    };

    await airtableFetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

const existing = await getExistingSlugs();
const missing = services.filter((service) => !existing.has(service.slug));

if (missing.length === 0) {
  console.log("No missing services found in Airtable.");
  process.exit(0);
}

await createRecords(missing);
console.log(`Added ${missing.length} missing services to Airtable.`);
