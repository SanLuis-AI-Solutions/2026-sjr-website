export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars missing");
  }
  return { url, key };
}

export async function supabaseGet(path, params = "") {
  const { url, key } = getSupabaseEnv();
  const target = `${url}/rest/v1/${path}${params}`;
  const res = await fetch(target, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${body}`);
  }

  return res.json();
}
