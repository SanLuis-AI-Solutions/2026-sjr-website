const baseId = "app6ogTLP23Fy37bR";
const tableId = "tblgzWv9JR6QbT42h";
const token = process.env.AIRTABLE_PAT_TOKEN;

if (!token) {
  console.error("Missing AIRTABLE_PAT_TOKEN");
  process.exit(1);
}

const imageMap = {
  "watch-repair":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/watch-repair-hero.jpg",
  "ring-sizing":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/ring-sizing-hero.jpg",
  "stone-setting":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/stone-setting-hero.jpg",
  "jewelry-cleaning":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/jewelry-cleaning-hero.jpg",
  "necklace-repair":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/necklace-repair-hero.jpg",
  "bracelet-repair":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/bracelet-repair-hero.jpg",
  "pearl-restringing":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/pearl-restringing-hero.jpg",
  "custom-design":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/custom-design-hero.jpg",
  "heirloom-restoration":
    "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/v3/heirloom-restoration-hero.jpg",
};

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

async function updateRecords(recordsToUpdate) {
  if (!recordsToUpdate.length) return;
  for (let i = 0; i < recordsToUpdate.length; i += 10) {
    const chunk = recordsToUpdate.slice(i, i + 10);
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
const updates = records
  .filter((record) => imageMap[record.fields?.slug])
  .map((record) => ({
    id: record.id,
    fields: {
      image: [{ url: imageMap[record.fields.slug] }],
    },
  }));

if (!updates.length) {
  console.log("No matching services found for image assignment.");
  process.exit(0);
}

await updateRecords(updates);
console.log(`Updated ${updates.length} service images in Airtable.`);
