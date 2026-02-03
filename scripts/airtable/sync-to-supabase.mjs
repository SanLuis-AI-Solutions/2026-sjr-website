const AIRTABLE_BASE_ID = "app6ogTLP23Fy37bR";
const AIRTABLE_API = "https://api.airtable.com/v0";

const tableMap = {
  services: "Services",
  faqs: "FAQs",
  testimonials: "Testimonials",
  gallery: "Gallery",
  blog: "Blog",
  settings: "Site Settings",
};

const airtableToken = process.env.AIRTABLE_PAT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!airtableToken || !supabaseUrl || !supabaseKey) {
  console.error("Missing AIRTABLE_PAT_TOKEN or SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const airtableHeaders = {
  Authorization: `Bearer ${airtableToken}`,
};

const supabaseHeaders = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

async function fetchAirtable(tableName) {
  const records = [];
  let offset = null;
  do {
    const url = new URL(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, { headers: airtableHeaders });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Airtable fetch failed for ${tableName}: ${res.status} ${body}`);
    }
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset || null;
  } while (offset);
  return records;
}

function toLines(value) {
  if (!value) return [];
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toParagraphs(value) {
  if (!value) return [];
  return String(value)
    .split(/\r?\n\s*\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function firstAttachmentUrl(value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return value[0].url || null;
}

async function supabaseUpsert(table, rows, conflict) {
  if (rows.length === 0) {
    console.log(`No rows to sync for ${table}`);
    return;
  }
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  if (conflict) url.searchParams.set("on_conflict", conflict);
  const res = await fetch(url, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase upsert failed for ${table}: ${res.status} ${body}`);
  }
  console.log(`Synced ${rows.length} rows to ${table}`);
}

async function fetchSupabaseServiceSlugs() {
  const url = new URL(`${supabaseUrl}/rest/v1/services`);
  url.searchParams.set("select", "slug");
  const res = await fetch(url, { headers: supabaseHeaders });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase fetch failed for services: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.map((row) => row.slug).filter(Boolean);
}

async function deleteSupabaseServices(slugs) {
  if (!slugs.length) return;
  for (let i = 0; i < slugs.length; i += 20) {
    const chunk = slugs.slice(i, i + 20);
    const url = new URL(`${supabaseUrl}/rest/v1/services`);
    url.searchParams.set("slug", `in.(${chunk.map((s) => `"${s}"`).join(",")})`);
    const res = await fetch(url, {
      method: "DELETE",
      headers: supabaseHeaders,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Supabase delete failed for services: ${res.status} ${body}`);
    }
  }
  console.log(`Removed ${slugs.length} services from supabase`);
}

async function main() {
  const servicesRaw = await fetchAirtable(tableMap.services);
  const serviceIdToSlug = new Map();
  const services = servicesRaw.map((record) => {
    const fields = record.fields || {};
    const slug = fields.slug || fields.name?.toLowerCase().replace(/\s+/g, "-");
    serviceIdToSlug.set(record.id, slug);
    return {
      slug,
      name: fields.name || "",
      category: fields.category || null,
      short_summary: fields.short_summary || null,
      image_url: firstAttachmentUrl(fields.image),
      long_description: toParagraphs(fields.long_description),
      includes: toLines(fields.includes),
      common_requests: toLines(fields.common_requests),
      price_note: fields.price_note || null,
      priority: fields.priority || 0,
      active: fields.active !== false,
      meta_title: fields.meta_title || null,
      meta_description: fields.meta_description || null,
      geo_city: fields.geo_city || null,
      geo_state: fields.geo_state || null,
      geo_area: fields.geo_area || null,
      updated_at: fields.updated_at || null,
    };
  });

  const faqsRaw = await fetchAirtable(tableMap.faqs);
  const faqs = faqsRaw.map((record) => {
    const fields = record.fields || {};
    const serviceLinks = Array.isArray(fields.service) ? fields.service : [];
    const serviceSlug = serviceLinks.length ? serviceIdToSlug.get(serviceLinks[0]) : null;
    return {
      service_slug: serviceSlug,
      question: fields.question || "",
      answer: fields.answer || null,
      priority: fields.priority || 0,
      active: fields.active !== false,
    };
  }).filter((row) => row.question);

  const testimonialsRaw = await fetchAirtable(tableMap.testimonials);
  const testimonials = testimonialsRaw.map((record) => {
    const fields = record.fields || {};
    const serviceLinks = Array.isArray(fields.service) ? fields.service : [];
    const serviceSlug = serviceLinks.length ? serviceIdToSlug.get(serviceLinks[0]) : null;
    return {
      customer_name: fields.customer_name || null,
      quote: fields.quote || null,
      rating: fields.rating || null,
      service_slug: serviceSlug,
      location: fields.location || null,
      active: fields.active !== false,
      sort: fields.sort || 0,
    };
  }).filter((row) => row.quote);

  const galleryRaw = await fetchAirtable(tableMap.gallery);
  const gallery = galleryRaw.map((record) => {
    const fields = record.fields || {};
    const serviceLinks = Array.isArray(fields.service) ? fields.service : [];
    const serviceSlug = serviceLinks.length ? serviceIdToSlug.get(serviceLinks[0]) : null;
    return {
      title: fields.title || null,
      image_url: firstAttachmentUrl(fields.image),
      alt_text: fields.alt_text || null,
      service_slug: serviceSlug,
      category: fields.category || null,
      active: fields.active !== false,
      sort: fields.sort || 0,
    };
  }).filter((row) => row.title || row.image_url);

  const blogRaw = await fetchAirtable(tableMap.blog);
  const blog = blogRaw.map((record) => {
    const fields = record.fields || {};
    return {
      title: fields.title || null,
      slug: fields.slug || null,
      excerpt: fields.excerpt || null,
      body: fields.body || null,
      hero_image_url: firstAttachmentUrl(fields.hero_image),
      tags: fields.tags || [],
      publish_date: fields.publish_date || null,
      status: fields.status || null,
      meta_title: fields.meta_title || null,
      meta_description: fields.meta_description || null,
    };
  }).filter((row) => row.slug);

  const settingsRaw = await fetchAirtable(tableMap.settings);
  const settings = settingsRaw.map((record) => {
    const fields = record.fields || {};
    return {
      key: fields.key || null,
      value: fields.value || null,
      notes: fields.notes || null,
    };
  }).filter((row) => row.key);

  await supabaseUpsert("services", services, "slug");
  const supabaseSlugs = await fetchSupabaseServiceSlugs();
  const allowed = new Set(services.map((service) => service.slug));
  const stale = supabaseSlugs.filter((slug) => !allowed.has(slug));
  await deleteSupabaseServices(stale);
  await supabaseUpsert("faqs", faqs, "service_slug,question");
  await supabaseUpsert("testimonials", testimonials, "customer_name,quote");
  await supabaseUpsert("gallery", gallery, "title,image_url");
  await supabaseUpsert("blog_posts", blog, "slug");
  await supabaseUpsert("site_settings", settings, "key");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
