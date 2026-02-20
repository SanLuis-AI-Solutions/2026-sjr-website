import fs from "node:fs";
import path from "node:path";

const AIRTABLE_BASE_ID = "app6ogTLP23Fy37bR";
const AIRTABLE_TABLE_ID = "tblgzWv9JR6QbT42h";

function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function env(localEnv, key, fallback = "") {
  return process.env[key] || localEnv[key] || fallback;
}

function requireEnv(localEnv, keys) {
  const missing = keys.filter((k) => !env(localEnv, k));
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

function contentTypeFor(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function uploadToSupabaseStorage({
  supabaseUrl,
  supabaseKey,
  bucket,
  objectPath,
  filePath,
}) {
  const bytes = fs.readFileSync(filePath);
  const target = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")}`;

  const res = await fetch(target, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      "Content-Type": contentTypeFor(filePath),
      "x-upsert": "true",
    },
    body: bytes,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload failed for ${objectPath}: ${res.status} ${body}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

async function updateSupabaseServiceImage({
  supabaseUrl,
  supabaseKey,
  slug,
  imageUrl,
}) {
  const target = `${supabaseUrl}/rest/v1/services?slug=eq.${encodeURIComponent(slug)}`;
  const res = await fetch(target, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase service update failed (${slug}): ${res.status} ${body}`);
  }
}

async function airtableFetch(token, endpoint, options = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
  return res.json();
}

async function updateAirtableServiceImages(token, heroMap) {
  let offset = undefined;
  const records = [];

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.append("fields[]", "slug");
    if (offset) url.searchParams.set("offset", offset);
    const data = await airtableFetch(token, url.toString());
    records.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  const updates = records
    .filter((record) => heroMap[record.fields?.slug])
    .map((record) => ({
      id: record.id,
      fields: { image: [{ url: heroMap[record.fields.slug] }] },
    }));

  for (let i = 0; i < updates.length; i += 10) {
    const chunk = updates.slice(i, i + 10);
    await airtableFetch(
      token,
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          records: chunk.map((row) => ({ id: row.id, fields: row.fields })),
        }),
      }
    );
  }

  return updates.length;
}

async function main() {
  const localEnv = parseDotEnv(path.join(process.cwd(), ".env.local"));
  requireEnv(localEnv, ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  const supabaseUrl = env(localEnv, "SUPABASE_URL");
  const supabaseKey = env(localEnv, "SUPABASE_SERVICE_ROLE_KEY");
  const airtableToken = env(localEnv, "AIRTABLE_PAT_TOKEN");

  const manifestPath = path.join(
    process.cwd(),
    "assets/generated/services-v3/manifest.local.json"
  );
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest: ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const published = {};
  const heroMap = {};

  for (const [slug, variants] of Object.entries(manifest)) {
    published[slug] = {};
    for (const [variantName, localFile] of Object.entries(variants)) {
      const filePath = path.join(process.cwd(), localFile);
      const objectPath = `services/v3/${path.basename(localFile)}`;
      const publicUrl = await uploadToSupabaseStorage({
        supabaseUrl,
        supabaseKey,
        bucket: "site-assets",
        objectPath,
        filePath,
      });

      published[slug][variantName] = publicUrl;
      if (variantName === "hero") {
        heroMap[slug] = publicUrl;
      }
      console.log(`UPLOADED ${slug}/${variantName}`);
    }
  }

  for (const [slug, heroUrl] of Object.entries(heroMap)) {
    await updateSupabaseServiceImage({
      supabaseUrl,
      supabaseKey,
      slug,
      imageUrl: heroUrl,
    });
    console.log(`SUPABASE_UPDATED ${slug}`);
  }

  if (airtableToken) {
    const count = await updateAirtableServiceImages(airtableToken, heroMap);
    console.log(`AIRTABLE_UPDATED ${count}`);
  } else {
    console.log("AIRTABLE_SKIPPED no token");
  }

  const publicManifestPath = path.join(
    process.cwd(),
    "assets/generated/services-v3/manifest.public.json"
  );
  fs.writeFileSync(publicManifestPath, JSON.stringify(published, null, 2), "utf8");
  console.log(`MANIFEST_OK ${publicManifestPath}`);
}

main().catch((error) => {
  console.error("PUBLISH_FAIL", error?.message || error);
  process.exit(1);
});
