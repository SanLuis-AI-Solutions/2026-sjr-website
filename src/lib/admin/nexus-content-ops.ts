import { supabaseGet } from "@/lib/supabase/server";
import { supabaseInsert, supabaseUpsert, supabaseUpdateById } from "@/lib/supabase/admin";

export type ContentResearchStatus = "new" | "ready_for_brief" | "rejected";
export type ContentSourceType =
  | "notebooklm"
  | "lead_signal"
  | "seo_gap"
  | "review_signal"
  | "manual";
export type ContentFunnelStage = "awareness" | "consideration" | "conversion" | "retention";
export type ContentQueueStatus =
  | "research_ready"
  | "brief_ready"
  | "approved"
  | "draft_ready"
  | "scheduled"
  | "published"
  | "archived";
export type ContentType = "blog" | "gbp_post" | "faq" | "service_update";

export type ContentResearchRow = {
  id: string;
  dedupe_key: string;
  topic: string;
  source_type: ContentSourceType;
  source_ref: string | null;
  service_slug: string | null;
  location_slug: string | null;
  funnel_stage: ContentFunnelStage;
  research_notes: string;
  recommended_angle: string;
  status: ContentResearchStatus;
  created_at: string;
  updated_at: string;
};

export type ContentQueueRow = {
  id: string;
  research_id: string | null;
  dedupe_key: string;
  content_type: ContentType;
  title: string;
  slug_candidate: string | null;
  service_slug: string | null;
  location_slug: string | null;
  funnel_stage: ContentFunnelStage;
  platform_targets: string[];
  primary_cta: string;
  business_goal: string;
  brief_payload: Record<string, unknown>;
  status: ContentQueueStatus;
  approved_by: string | null;
  approved_at: string | null;
  published_asset_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentSummary = {
  researchNewCount: number;
  researchReadyCount: number;
  briefReadyCount: number;
  approvedCount: number;
};

type ResearchSeed = Omit<ContentResearchRow, "id" | "created_at" | "updated_at"> & {
  starterBrief?: {
    content_type: ContentType;
    title: string;
    slug_candidate: string | null;
    platform_targets: string[];
    primary_cta: string;
    business_goal: string;
    brief_payload: Record<string, unknown>;
    status: ContentQueueStatus;
  };
};

const STARTER_RESEARCH: ResearchSeed[] = [
  {
    dedupe_key: "manual:heirloom-restoration-trust",
    topic: "Heirloom restoration trust builder for inherited jewelry owners",
    source_type: "seo_gap",
    source_ref: "coverage-priority:heirloom-restoration",
    service_slug: "heirloom-restoration",
    location_slug: "pasadena",
    funnel_stage: "conversion",
    research_notes:
      "Support the core heirloom restoration service page with a trust-first brief that answers restore vs redesign concerns and in-house workmanship questions.",
    recommended_angle:
      "Build a conversion-focused content brief around preserving family meaning while clarifying repair, restoration, and redesign decision points.",
    status: "ready_for_brief",
    starterBrief: {
      content_type: "blog",
      title: "Heirloom Jewelry Restoration: Repair, Restore, or Redesign?",
      slug_candidate: "heirloom-jewelry-restoration-repair-or-redesign",
      platform_targets: ["gbp", "meta"],
      primary_cta: "Book a restoration assessment",
      business_goal: "Drive heirloom restoration quote requests from high-intent search traffic.",
      brief_payload: {
        target_service: "heirloom-restoration",
        target_location: "pasadena",
        target_audience: "owners of inherited or sentimental jewelry",
      },
      status: "brief_ready",
    },
  },
  {
    dedupe_key: "manual:pearl-restringing-urgency",
    topic: "Pearl restringing urgency and timing for frequent wearers",
    source_type: "lead_signal",
    source_ref: "priority-indexing:pearl-restringing",
    service_slug: "pearl-restringing",
    location_slug: "pasadena",
    funnel_stage: "conversion",
    research_notes:
      "Pearl restringing is a priority service page. The brief should connect timing cues, breakage risk, and the value of hand-knotting before failure.",
    recommended_angle:
      "Position pearl restringing as preventive care with clear warning signs and a strong quote-request CTA.",
    status: "ready_for_brief",
  },
  {
    dedupe_key: "manual:deer-park-local-intent",
    topic: "Deer Park location intent for jewelry repair and watch battery traffic",
    source_type: "seo_gap",
    source_ref: "priority-indexing:deer-park",
    service_slug: "watch-repair",
    location_slug: "deer-park",
    funnel_stage: "consideration",
    research_notes:
      "This supports the geo-page cluster. Focus on fast-turnaround service and Pasadena proximity for nearby customers searching by city.",
    recommended_angle:
      "Create a local-intent brief that matches Deer Park searchers to nearby in-house repair and same-day watch battery service.",
    status: "new",
  },
  {
    dedupe_key: "manual:faq-lead-patterns",
    topic: "FAQ mining from lead inbox and phone objections",
    source_type: "manual",
    source_ref: "operator-observation",
    service_slug: null,
    location_slug: "pasadena",
    funnel_stage: "awareness",
    research_notes:
      "Capture repeated questions about turnaround, pricing approvals, and what gets handled in-house so those answers can drive future briefs and FAQ assets.",
    recommended_angle:
      "Turn recurring questions into quick-win educational content that prequalifies leads before they contact the shop.",
    status: "new",
  },
];

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return asStringArray(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeSourceType(value: unknown): ContentSourceType {
  const raw = asString(value);
  if (raw === "lead" || raw === "lead_signal") return "lead_signal";
  if (raw === "seo" || raw === "seo_gap") return "seo_gap";
  if (raw === "review" || raw === "review_signal") return "review_signal";
  if (raw === "manual") return "manual";
  return "notebooklm";
}

function normalizeFunnelStage(value: unknown): ContentFunnelStage {
  const raw = asString(value);
  if (raw === "awareness" || raw === "consideration" || raw === "retention") return raw;
  if (raw === "decision" || raw === "conversion") return "conversion";
  return "awareness";
}

function normalizeResearchStatus(value: unknown): ContentResearchStatus {
  const raw = asString(value);
  if (raw === "ready_for_brief" || raw === "rejected") return raw;
  return "new";
}

function normalizeContentType(value: unknown): ContentType {
  const raw = asString(value);
  if (raw === "faq" || raw === "service_update" || raw === "gbp_post") return raw;
  if (raw === "review_reply") return "gbp_post";
  return "blog";
}

function normalizeQueueStatus(value: unknown): ContentQueueStatus {
  const raw = asString(value);
  if (
    raw === "brief_ready" ||
    raw === "approved" ||
    raw === "draft_ready" ||
    raw === "scheduled" ||
    raw === "published" ||
    raw === "archived"
  ) {
    return raw;
  }
  return "research_ready";
}

function mapResearchRow(row: Record<string, unknown>): ContentResearchRow {
  return {
    id: asString(row.id),
    dedupe_key: asString(row.dedupe_key) || asString(row.seed_key),
    topic: asString(row.topic),
    source_type: normalizeSourceType(row.source_type),
    source_ref: asNullableString(row.source_ref),
    service_slug: asNullableString(row.service_slug),
    location_slug: asNullableString(row.location_slug),
    funnel_stage: normalizeFunnelStage(row.funnel_stage),
    research_notes: asString(row.research_notes),
    recommended_angle: asString(row.recommended_angle),
    status: normalizeResearchStatus(row.status),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function mapQueueRow(row: Record<string, unknown>): ContentQueueRow {
  return {
    id: asString(row.id),
    research_id: asNullableString(row.research_id),
    dedupe_key: asString(row.dedupe_key) || asString(row.seed_key),
    content_type: normalizeContentType(row.content_type),
    title: asString(row.title),
    slug_candidate: asNullableString(row.slug_candidate),
    service_slug: asNullableString(row.service_slug),
    location_slug: asNullableString(row.location_slug),
    funnel_stage: normalizeFunnelStage(row.funnel_stage),
    platform_targets: asStringArray(row.platform_targets),
    primary_cta: asString(row.primary_cta),
    business_goal: asString(row.business_goal),
    brief_payload: asObject(row.brief_payload),
    status: normalizeQueueStatus(row.status),
    approved_by: asNullableString(row.approved_by),
    approved_at: asNullableString(row.approved_at),
    published_asset_slug: asNullableString(row.published_asset_slug),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

export async function getContentResearchRows(): Promise<ContentResearchRow[]> {
  try {
    const rows = await supabaseGet("nexus_content_research", "?select=*&order=updated_at.desc");
    return asArray<Record<string, unknown>>(rows).map(mapResearchRow);
  } catch {
    return [];
  }
}

export async function getContentQueueRows(): Promise<ContentQueueRow[]> {
  try {
    const rows = await supabaseGet("nexus_content_queue", "?select=*&order=updated_at.desc");
    return asArray<Record<string, unknown>>(rows).map(mapQueueRow);
  } catch {
    return [];
  }
}

export function buildContentSummary(
  researchRows: ContentResearchRow[],
  queueRows: ContentQueueRow[]
): ContentSummary {
  return {
    researchNewCount: researchRows.filter((row) => row.status === "new").length,
    researchReadyCount: researchRows.filter((row) => row.status === "ready_for_brief").length,
    briefReadyCount: queueRows.filter((row) => row.status === "brief_ready").length,
    approvedCount: queueRows.filter((row) => row.status === "approved").length,
  };
}

export async function seedInitialContentOpsData() {
  const [researchRows, queueRows] = await Promise.all([getContentResearchRows(), getContentQueueRows()]);

  const researchKeys = new Set(researchRows.map((row) => row.dedupe_key));
  const briefKeys = new Set(queueRows.map((row) => row.dedupe_key));

  for (const seed of STARTER_RESEARCH) {
    let researchRow = researchRows.find((row) => row.dedupe_key === seed.dedupe_key) || null;

    if (!researchKeys.has(seed.dedupe_key)) {
      researchRow = await supabaseInsert("nexus_content_research", {
        dedupe_key: seed.dedupe_key,
        topic: seed.topic,
        source_type: seed.source_type,
        source_ref: seed.source_ref,
        service_slug: seed.service_slug,
        location_slug: seed.location_slug,
        funnel_stage: seed.funnel_stage,
        research_notes: seed.research_notes,
        recommended_angle: seed.recommended_angle,
        status: seed.status,
      });
      researchKeys.add(seed.dedupe_key);
    }

    if (seed.starterBrief && !briefKeys.has(seed.dedupe_key)) {
      await supabaseUpsert(
        "nexus_content_queue",
        {
          research_id: asNullableString(researchRow?.id) || null,
          dedupe_key: seed.dedupe_key,
          content_type: seed.starterBrief.content_type,
          title: seed.starterBrief.title,
          slug_candidate: seed.starterBrief.slug_candidate,
          service_slug: seed.service_slug,
          location_slug: seed.location_slug,
          funnel_stage: seed.funnel_stage,
          platform_targets: seed.starterBrief.platform_targets,
          primary_cta: seed.starterBrief.primary_cta,
          business_goal: seed.starterBrief.business_goal,
          brief_payload: seed.starterBrief.brief_payload,
          status: seed.starterBrief.status,
        },
        "dedupe_key"
      );
      briefKeys.add(seed.dedupe_key);
    }
  }
}

export async function promoteResearchToBrief(researchId: string) {
  const researchRows = await getContentResearchRows();
  const researchRow = researchRows.find((row) => row.id === researchId);

  if (!researchRow) {
    throw new Error("Research item not found");
  }

  const queueRows = await getContentQueueRows();
  const existing = queueRows.find(
    (row) => row.research_id === researchId || row.dedupe_key === researchRow.dedupe_key
  );

  if (existing) {
    return existing;
  }

  const title =
    researchRow.service_slug && researchRow.location_slug
      ? `${researchRow.topic} for ${researchRow.location_slug}`
      : researchRow.topic;

  const briefPayload = {
    research_notes: researchRow.research_notes,
    recommended_angle: researchRow.recommended_angle,
    source_ref: researchRow.source_ref,
  };

  const queueRow = await supabaseUpsert(
    "nexus_content_queue",
    {
      research_id: researchRow.id,
      dedupe_key: researchRow.dedupe_key,
      content_type: researchRow.location_slug ? "gbp_post" : "blog",
      title,
      slug_candidate: null,
      service_slug: researchRow.service_slug,
      location_slug: researchRow.location_slug,
      funnel_stage: researchRow.funnel_stage,
      platform_targets: researchRow.location_slug ? ["gbp"] : ["gbp", "meta"],
      primary_cta: researchRow.service_slug
        ? "Request a repair quote"
        : "Schedule an in-store consultation",
      business_goal: researchRow.service_slug
        ? `Generate qualified leads for ${researchRow.service_slug}.`
        : "Generate local awareness and lead starts.",
      brief_payload: briefPayload,
      status: "brief_ready",
    },
    "dedupe_key"
  );

  await supabaseUpdateById("nexus_content_research", researchRow.id, {
    status: "ready_for_brief",
    updated_at: new Date().toISOString(),
  });

  return queueRow;
}
