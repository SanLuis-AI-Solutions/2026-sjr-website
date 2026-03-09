import { getSupabaseEnv } from "@/lib/supabase/server";

function encodePath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function supabaseInsert<Row extends Record<string, unknown>>(
  table: string,
  row: Row
) {
  const { url, key } = getSupabaseEnv();
  const target = `${url}/rest/v1/${table}`;
  const res = await fetch(target, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase INSERT failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

export async function supabaseUploadObject(opts: {
  bucket: string;
  objectPath: string;
  bytes: Uint8Array;
  contentType: string;
  upsert?: boolean;
}) {
  const { url, key } = getSupabaseEnv();
  const encoded = encodePath(opts.objectPath);
  const target = `${url}/storage/v1/object/${encodeURIComponent(opts.bucket)}/${encoded}`;

  const res = await fetch(target, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": opts.contentType || "application/octet-stream",
      ...(opts.upsert ? { "x-upsert": "true" } : null),
    },
    body: Buffer.from(opts.bytes),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase upload failed: ${res.status} ${body}`);
  }

  // Public URL only works for public buckets; we still store it for convenience when applicable.
  const objectUrl = `${url}/storage/v1/object/${opts.bucket}/${opts.objectPath}`;
  const publicUrl = `${url}/storage/v1/object/public/${opts.bucket}/${opts.objectPath}`;

  return { objectUrl, publicUrl };
}

export async function supabaseUpdateById(
  table: string,
  id: string,
  patch: Record<string, unknown>
) {
  const { url, key } = getSupabaseEnv();
  const target = `${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(target, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(patch),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase UPDATE failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

export async function supabaseUpsert<Row extends Record<string, unknown>>(
  table: string,
  row: Row,
  onConflict: string
) {
  const { url, key } = getSupabaseEnv();
  const target = `${url}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`;
  const res = await fetch(target, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase UPSERT failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

export async function supabaseCreateSignedObjectUrl(opts: {
  bucket: string;
  objectPath: string;
  expiresInSeconds?: number;
}) {
  const { url, key } = getSupabaseEnv();
  const encoded = encodePath(opts.objectPath);
  const target = `${url}/storage/v1/object/sign/${encodeURIComponent(opts.bucket)}/${encoded}`;
  const expiresIn = opts.expiresInSeconds ?? 60 * 30;

  const res = await fetch(target, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase sign URL failed: ${res.status} ${body}`);
  }

  const json = (await res.json()) as { signedURL?: string; signedUrl?: string };
  const signed = json.signedURL || json.signedUrl;
  if (!signed) throw new Error("Supabase sign URL response missing signed URL");
  return signed.startsWith("http") ? signed : `${url}${signed}`;
}
