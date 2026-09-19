// ==============================================================================
// KNYK LABS — WEBSITE & SEO CONFIG API CLIENT
// Endpoint: GET /api/v1/knyk/website
// Cache Behavior: 2 minute browser / 10 minute CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type { KnykPublicWebsiteSettings } from "@/lib/types/knyk";

export interface WebsiteSettingsResult {
  website: KnykPublicWebsiteSettings | null;
  isAvailable: boolean;
  error?: string;
}

function normalizeWebsiteSettings(raw: unknown): KnykPublicWebsiteSettings | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const payload = (data.data && typeof data.data === "object" ? data.data : data) as Record<string, unknown>;

  if (!payload || typeof payload !== "object") return null;

  return {
    siteTitle: String(payload.siteTitle || payload.site_title || "KNYK Labs — Digital Solutions Studio"),
    siteDescription: String(
      payload.siteDescription ||
        payload.site_description ||
        "High-impact software engineering, visual branding, photo & video production, and custom AI automation studio."
    ),
    keywords: Array.isArray(payload.keywords)
      ? payload.keywords.map(String)
      : ["KNYK Labs", "software development", "graphic design", "AI automation", "digital studio"],
    canonicalUrl: payload.canonicalUrl ? String(payload.canonicalUrl) : (payload.canonical_url ? String(payload.canonical_url) : null),
    ogTitle: payload.ogTitle ? String(payload.ogTitle) : (payload.og_title ? String(payload.og_title) : null),
    ogDescription: payload.ogDescription ? String(payload.ogDescription) : (payload.og_description ? String(payload.og_description) : null),
    ogImageUrl: payload.ogImageUrl ? String(payload.ogImageUrl) : (payload.og_image_url ? String(payload.og_image_url) : null),
    robotsBehavior: String(payload.robotsBehavior || payload.robots_behavior || "index, follow"),
    maintenanceMode: Boolean(payload.maintenanceMode ?? payload.maintenance_mode ?? false),
    announcementBanner: payload.announcementBanner ? String(payload.announcementBanner) : (payload.announcement_banner ? String(payload.announcement_banner) : null),
    announcementLink: payload.announcementLink ? String(payload.announcementLink) : (payload.announcement_link ? String(payload.announcement_link) : null),
    footerDescription: payload.footerDescription ? String(payload.footerDescription) : (payload.footer_description ? String(payload.footer_description) : null),
    copyrightText: payload.copyrightText ? String(payload.copyrightText) : (payload.copyright_text ? String(payload.copyright_text) : null),
  };
}

/**
 * Fetch global website settings & SEO configuration dynamically from NEXIS.
 */
export async function getPublicWebsiteSettings(): Promise<WebsiteSettingsResult> {
  const result = await nexisFetch<KnykPublicWebsiteSettings>("/api/v1/knyk/website", {
    revalidate: 120, // 2 minutes
  });

  if (!result.isAvailable || !result.data) {
    return {
      website: null,
      isAvailable: false,
      error: result.error || "Website settings are temporarily unavailable.",
    };
  }

  const website = normalizeWebsiteSettings(result.data);

  return {
    website,
    isAvailable: Boolean(website),
  };
}
