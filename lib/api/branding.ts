// ==============================================================================
// KNYK LABS — BRANDING API CLIENT
// Endpoint: GET /api/v1/knyk/branding
// Cache Behavior: 1 hour browser / 24 hour CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type {
  KnykPublicBranding,
  KnykPublicBrandAsset,
} from "@/lib/types/knyk";

export interface BrandingResult {
  branding: KnykPublicBranding | null;
  isAvailable: boolean;
  error?: string;
}

function normalizeBrandAsset(raw: unknown): KnykPublicBrandAsset | null {
  if (!raw || typeof raw !== "object") return null;
  const asset = raw as Record<string, unknown>;
  if (!asset.url || typeof asset.url !== "string") return null;
  return {
    url: asset.url,
    alt: typeof asset.alt === "string" ? asset.alt : "KNYK Labs",
    width: typeof asset.width === "number" ? asset.width : null,
    height: typeof asset.height === "number" ? asset.height : null,
  };
}

function normalizeBranding(raw: unknown): KnykPublicBranding | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const payload = (data.data && typeof data.data === "object" ? data.data : data) as Record<string, unknown>;

  if (!payload || typeof payload !== "object") return null;

  return {
    primaryLogo: normalizeBrandAsset(payload.primaryLogo),
    brandMark: normalizeBrandAsset(payload.brandMark),
    favicon: normalizeBrandAsset(payload.favicon),
    socialPreview: normalizeBrandAsset(payload.socialPreview),
    lightLogo: normalizeBrandAsset(payload.lightLogo),
    darkLogo: normalizeBrandAsset(payload.darkLogo),
  };
}

/**
 * Fetch public brand assets dynamically from NEXIS.
 */
export async function getPublicBranding(): Promise<BrandingResult> {
  const result = await nexisFetch<KnykPublicBranding>("/api/v1/knyk/branding", {
    revalidate: 3600, // 1 hour
  });

  if (!result.isAvailable || !result.data) {
    return {
      branding: null,
      isAvailable: false,
      error: result.error || "Branding assets are temporarily unavailable.",
    };
  }

  const branding = normalizeBranding(result.data);

  return {
    branding,
    isAvailable: Boolean(branding),
  };
}
