import { publishGoogleBusinessPost } from "@/lib/automation/google-business-profile";

export const SUPPORTED_SOCIAL_PLATFORMS = [
  "gbp",
  "meta",
  "pinterest",
  "linkedin",
  "x",
] as const;

export type SocialPlatform = (typeof SUPPORTED_SOCIAL_PLATFORMS)[number];

export type SocialDispatchRequest = {
  slug: string;
  title: string;
  excerpt: string;
  canonicalUrl: string;
  imageUrl?: string | null;
  platforms?: SocialPlatform[];
  dryRun?: boolean;
};

export type SocialDispatchResult = {
  platform: SocialPlatform;
  status: "sent" | "skipped" | "failed";
  externalId?: string;
  externalUrl?: string;
  reason?: string;
  payload?: Record<string, unknown>;
};

export type SocialDispatchSummary = {
  slug: string;
  dryRun: boolean;
  startedAt: string;
  finishedAt: string;
  successCount: number;
  results: SocialDispatchResult[];
};

const PLATFORM_TOKEN_ENV: Record<SocialPlatform, string> = {
  gbp: "NEXUS_GBP_ACCESS_TOKEN",
  meta: "NEXUS_META_ACCESS_TOKEN",
  pinterest: "NEXUS_PINTEREST_ACCESS_TOKEN",
  linkedin: "NEXUS_LINKEDIN_ACCESS_TOKEN",
  x: "NEXUS_X_ACCESS_TOKEN",
};

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SUPPORTED_SOCIAL_PLATFORMS.includes(value as SocialPlatform);
}

function resolveDefaultPlatforms(env: NodeJS.ProcessEnv): SocialPlatform[] {
  const raw = (env.NEXUS_DEFAULT_PLATFORMS || "").trim();
  if (!raw) return [...SUPPORTED_SOCIAL_PLATFORMS];

  const parsed = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(isSocialPlatform);

  return parsed.length > 0 ? [...new Set(parsed)] : [...SUPPORTED_SOCIAL_PLATFORMS];
}

function createExternalId(platform: SocialPlatform, slug: string) {
  return `${platform}_${slug}_${Date.now()}`;
}

export class SocialDispatcher {
  constructor(private readonly env: NodeJS.ProcessEnv = process.env) { }

  resolvePlatforms(platforms?: SocialPlatform[]) {
    if (!platforms || platforms.length === 0) {
      return resolveDefaultPlatforms(this.env);
    }
    return [...new Set(platforms)];
  }

  async dispatch(request: SocialDispatchRequest): Promise<SocialDispatchSummary> {
    const startedAt = new Date();
    const platforms = this.resolvePlatforms(request.platforms);

    const results = await Promise.all(
      platforms.map((platform) => this.dispatchToPlatform(platform, request))
    );

    return {
      slug: request.slug,
      dryRun: Boolean(request.dryRun),
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      successCount: results.filter((result) => result.status === "sent").length,
      results,
    };
  }

  private async dispatchToPlatform(
    platform: SocialPlatform,
    request: SocialDispatchRequest
  ): Promise<SocialDispatchResult> {
    if (platform === "gbp") {
      if (request.dryRun) {
        return {
          platform,
          status: "skipped",
          reason: "dry_run",
        };
      }

      return publishGoogleBusinessPost({
        title: request.title,
        excerpt: request.excerpt,
        canonicalUrl: request.canonicalUrl,
        imageUrl: request.imageUrl,
      });
    }

    const tokenEnvName = PLATFORM_TOKEN_ENV[platform];
    const token = (this.env[tokenEnvName] || "").trim();

    if (!token) {
      return {
        platform,
        status: "skipped",
        reason: `missing_token:${tokenEnvName}`,
      };
    }

    if (request.dryRun) {
      return {
        platform,
        status: "skipped",
        reason: "dry_run",
      };
    }

    return {
      platform,
      status: "skipped",
      reason: "provider_not_implemented",
      payload: {
        placeholderExternalId: createExternalId(platform, request.slug),
      },
    };
  }
}
