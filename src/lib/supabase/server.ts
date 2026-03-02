export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars missing");
  }
  return { url, key };
}

type SupabaseGetOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export async function supabaseGet(path: string, params = "", options?: SupabaseGetOptions) {
  const { url, key } = getSupabaseEnv();
  const target = `${url}/rest/v1/${path}${params}`;
  const fetchOptions: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: options?.cache ?? "no-store",
  };

  if (typeof options?.revalidate === "number" || (options?.tags && options.tags.length > 0)) {
    fetchOptions.cache = options?.cache ?? "force-cache";
    fetchOptions.next = {
      ...(typeof options?.revalidate === "number" ? { revalidate: options.revalidate } : {}),
      ...(options?.tags && options.tags.length > 0 ? { tags: options.tags } : {}),
    };
  }

  const res = await fetch(target, {
    ...fetchOptions,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${body}`);
  }

  return res.json();
}
