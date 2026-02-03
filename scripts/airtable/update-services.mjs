import fs from "fs";

const baseId = "app6ogTLP23Fy37bR";
const tableId = "tblgzWv9JR6QbT42h";
const token = process.env.AIRTABLE_PAT_TOKEN;

if (!token) {
  console.error("Missing AIRTABLE_PAT_TOKEN");
  process.exit(1);
}

const removeSlugs = [
  "ring-resizing",
  "custom-engagement-rings",
  "necklace-chain-repair",
  "necklace-bracelet-repair",
  "jewelry-appraisals",
  "engraving"
];

const renameServices = [
  {
    slug: "heirloom-restoration",
    name: "Heirloom Restorations",
  },
];

const addServices = [
  {
    slug: "necklace-repair",
    name: "Necklace Repair",
    short_summary: "Repair broken necklaces, clasps, and delicate chains.",
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/necklace-repair.png",
    long_description: [
      "We repair broken necklaces and restore their strength and finish.",
      "From delicate chains to heavier pieces, every repair is reinforced and polished."
    ],
    includes: [
      "Chain soldering and link repair",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair"
    ],
    common_requests: [
      "Broken chain repair",
      "Lobster clasp replacement",
      "Charm reattachment",
      "Safety chain install"
    ]
  },
  {
    slug: "bracelet-repair",
    name: "Bracelet Repair",
    short_summary: "Fix broken links and clasps for a secure, comfortable fit.",
    image: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/bracelet-repair.jpg",
    long_description: [
      "We restore bracelets so they wear safely and comfortably again.",
      "Every repair is finished to look seamless and last."
    ],
    includes: [
      "Link repair and reinforcement",
      "Clasp replacement or adjustment",
      "Safety inspection",
      "Cleaning after repair"
    ],
    common_requests: [
      "Broken link repair",
      "Clasp replacement",
      "Charm reattachment",
      "Safety chain install"
    ]
  }
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

async function fetchAllRecords() {
  const records = [];
  let offset = undefined;
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.append("fields[]", "slug");
    if (offset) url.searchParams.set("offset", offset);
    const data = await airtableFetch(url.toString());
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);
  return records;
}

async function deleteRecords(ids) {
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    const params = chunk.map((id) => `records[]=${id}`).join("&");
    await airtableFetch(`https://api.airtable.com/v0/${baseId}/${tableId}?${params}`, {
      method: "DELETE",
    });
  }
}

async function createRecords(services) {
  const chunks = [];
  for (let i = 0; i < services.length; i += 10) {
    chunks.push(services.slice(i, i + 10));
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

async function updateRecords(recordsToUpdate) {
  if (!recordsToUpdate.length) return;
  const chunks = [];
  for (let i = 0; i < recordsToUpdate.length; i += 10) {
    chunks.push(recordsToUpdate.slice(i, i + 10));
  }

  for (const chunk of chunks) {
    const payload = {
      records: chunk.map((record) => ({
        id: record.id,
        fields: record.fields,
      })),
    };

    await airtableFetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}

const records = await fetchAllRecords();
const removeIds = records
  .filter((record) => removeSlugs.includes(record.fields?.slug))
  .map((record) => record.id);

if (removeIds.length) {
  await deleteRecords(removeIds);
  console.log(`Removed ${removeIds.length} services from Airtable.`);
} else {
  console.log("No services to remove.");
}

const existingSlugs = new Set(records.map((record) => record.fields?.slug).filter(Boolean));
const missing = addServices.filter((service) => !existingSlugs.has(service.slug));

const renameUpdates = records
  .filter((record) => renameServices.find((item) => item.slug === record.fields?.slug))
  .map((record) => {
    const rename = renameServices.find((item) => item.slug === record.fields?.slug);
    if (!rename) return null;
    return {
      id: record.id,
      fields: {
        name: rename.name,
        meta_title: `${rename.name} | Susie’s Jewelry Repair`,
      },
    };
  })
  .filter(Boolean);

if (missing.length) {
  await createRecords(missing);
  console.log(`Added ${missing.length} services to Airtable.`);
} else {
  console.log("No new services to add.");
}

if (renameUpdates.length) {
  await updateRecords(renameUpdates);
  console.log(`Renamed ${renameUpdates.length} services in Airtable.`);
} else {
  console.log("No services to rename.");
}
