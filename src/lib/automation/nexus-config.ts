import { supabaseUpsert } from "@/lib/supabase/admin";
import { supabaseGet } from "@/lib/supabase/server";

export const NEXUS_CONFIG_PLATFORMS = [
  "gbp",
  "meta",
  "pinterest",
  "linkedin",
  "x",
] as const;

export type NexusConfigPlatform = (typeof NEXUS_CONFIG_PLATFORMS)[number];

export type NexusConfigRow = {
  platform: NexusConfigPlatform;
  access_token: string | null;
  refresh_token: string | null;
  token_type: string | null;
  scope: string | null;
  expires_at: string | null;
  payload: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

type NexusConfigPatch = Omit<NexusConfigRow, "created_at" | "updated_at"> & {
  updated_at?: string;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function encodeFilterValue(value: string) {
  return encodeURIComponent(value);
}

export async function getNexusConfigs(): Promise<NexusConfigRow[]> {
  try {
    const rows = await supabaseGet(
      "nexus_config",
      "?select=platform,access_token,refresh_token,token_type,scope,expires_at,payload,created_at,updated_at"
    );
    return asArray<NexusConfigRow>(rows);
  } catch {
    return [];
  }
}

export async function getNexusConfig(
  platform: NexusConfigPlatform
): Promise<NexusConfigRow | null> {
  try {
    const rows = await supabaseGet(
      "nexus_config",
      `?select=platform,access_token,refresh_token,token_type,scope,expires_at,payload,created_at,updated_at&platform=eq.${encodeFilterValue(platform)}&limit=1`
    );
    return asArray<NexusConfigRow>(rows)[0] || null;
  } catch {
    return null;
  }
}

export async function upsertNexusConfig(row: NexusConfigPatch) {
  return supabaseUpsert(
    "nexus_config",
    {
      ...row,
      updated_at: row.updated_at || new Date().toISOString(),
    },
    "platform"
  );
}
