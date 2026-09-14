import { BrandingResult, KnykPublicBranding, KnykPublicBrandAsset } from "./types";

const DEFAULT_REVALIDATE = 60;

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

function normalizeBrandingPayload(data: unknown): KnykPublicBranding | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const payload = (raw.data && typeof raw.data === "object" ? raw.data : raw) as Record<string, unknown>;

  if (!payload || typeof payload !== "object") return null;

  return {
    primaryLogo: normalizeBrandAsset(payload.primaryLogo),
    brandMark: normalizeBrandAsset(payload.brandMark),
    favicon: normalizeBrandAsset(payload.favicon),
    socialPreview: normalizeBrandAsset(payload.socialPreview),
  };
}

/**
 * Fetch public brand assets dynamically from NEXIS.
 * NEXIS is the single source of truth.
 */
export async function getKnykBranding(): Promise<BrandingResult> {
  const nexisUrl = process.env.NEXIS_API_URL?.trim();
  const revalidateSeconds = Number(process.env.NEXIS_REVALIDATE_SECONDS) || DEFAULT_REVALIDATE;

  if (!nexisUrl) {
    return {
      branding: null,
      isAvailable: false,
      error: "NEXIS_API_URL environment variable is not configured.",
    };
  }

  const endpoint = `${nexisUrl.replace(/\/+$/, "")}/api/v1/knyk/branding`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: revalidateSeconds },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        branding: null,
        isAvailable: false,
        error: `NEXIS branding service returned status ${response.status}`,
      };
    }

    const json = await response.json();
    const branding = normalizeBrandingPayload(json);

    return {
      branding,
      isAvailable: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error contacting NEXIS";
    return {
      branding: null,
      isAvailable: false,
      error: message,
    };
  }
}
