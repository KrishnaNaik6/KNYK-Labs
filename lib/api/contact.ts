// ==============================================================================
// KNYK LABS — CONTACT & BUSINESS API CLIENT
// Endpoint: GET /api/v1/knyk/contact
// Cache Behavior: 5 minute browser / 30 minute CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type { KnykPublicContact } from "@/lib/types/knyk";

export interface ContactResult {
  contact: KnykPublicContact | null;
  isAvailable: boolean;
  error?: string;
}

/**
 * Normalizes contact payload safely.
 */
function normalizeContact(raw: unknown): KnykPublicContact | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const payload = (data.data && typeof data.data === "object" ? data.data : data) as Record<string, unknown>;

  if (!payload || typeof payload !== "object") return null;

  const rawAddress = payload.address as Record<string, unknown> | undefined;
  const address =
    rawAddress && typeof rawAddress === "object"
      ? {
          line: rawAddress.line ? String(rawAddress.line) : null,
          city: rawAddress.city ? String(rawAddress.city) : null,
          state: rawAddress.state ? String(rawAddress.state) : null,
          country: rawAddress.country ? String(rawAddress.country) : null,
          postalCode: rawAddress.postalCode
            ? String(rawAddress.postalCode)
            : rawAddress.postal_code
            ? String(rawAddress.postal_code)
            : null,
        }
      : null;

  const rawSocial = payload.social as Record<string, unknown> | undefined;
  const social =
    rawSocial && typeof rawSocial === "object"
      ? {
          instagram: rawSocial.instagram ? String(rawSocial.instagram) : null,
          facebook: rawSocial.facebook ? String(rawSocial.facebook) : null,
          linkedin: rawSocial.linkedin ? String(rawSocial.linkedin) : null,
          github: rawSocial.github ? String(rawSocial.github) : null,
          youtube: rawSocial.youtube ? String(rawSocial.youtube) : null,
        }
      : null;

  return {
    businessName: String(payload.businessName || payload.business_name || "KNYK Labs"),
    email: payload.email ? String(payload.email) : null,
    supportEmail: payload.supportEmail ? String(payload.supportEmail) : null,
    salesEmail: payload.salesEmail ? String(payload.salesEmail) : null,
    phone: payload.phone ? String(payload.phone) : null,
    whatsappNumber: payload.whatsappNumber
      ? String(payload.whatsappNumber)
      : payload.whatsapp_number
      ? String(payload.whatsapp_number)
      : null,
    address,
    businessHours: payload.businessHours ? String(payload.businessHours) : null,
    googleMapsUrl: payload.googleMapsUrl ? String(payload.googleMapsUrl) : null,
    websiteUrl: payload.websiteUrl ? String(payload.websiteUrl) : null,
    social,
  };
}

/**
 * Fetch centralized business & contact settings from NEXIS.
 */
export async function getPublicContact(): Promise<ContactResult> {
  const result = await nexisFetch<KnykPublicContact>("/api/v1/knyk/contact", {
    revalidate: 300, // 5 minutes
  });

  if (!result.isAvailable || !result.data) {
    return {
      contact: null,
      isAvailable: false,
      error: result.error || "Contact information is temporarily unavailable.",
    };
  }

  const contact = normalizeContact(result.data);

  return {
    contact,
    isAvailable: Boolean(contact),
  };
}
