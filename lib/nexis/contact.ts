import { ContactResult, KnykPublicContact } from "./types";

const DEFAULT_REVALIDATE = 60;

/**
 * Normalizes varied API response structures into a uniform KnykPublicContact.
 */
function normalizeContactPayload(data: unknown): KnykPublicContact | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const raw = data as Record<string, unknown>;
  const payload = (raw.data && typeof raw.data === "object" ? raw.data : raw) as Record<string, unknown>;

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const rawAddress = payload.address as Record<string, unknown> | undefined;
  const address = rawAddress && typeof rawAddress === "object"
    ? {
        line: rawAddress.line ? String(rawAddress.line) : null,
        city: rawAddress.city ? String(rawAddress.city) : null,
        state: rawAddress.state ? String(rawAddress.state) : null,
        country: rawAddress.country ? String(rawAddress.country) : null,
        postalCode: rawAddress.postalCode ? String(rawAddress.postalCode) : null,
      }
    : null;

  const rawSocial = payload.social as Record<string, unknown> | undefined;
  const social = rawSocial && typeof rawSocial === "object"
    ? {
        instagram: rawSocial.instagram ? String(rawSocial.instagram) : null,
        facebook: rawSocial.facebook ? String(rawSocial.facebook) : null,
        linkedin: rawSocial.linkedin ? String(rawSocial.linkedin) : null,
        github: rawSocial.github ? String(rawSocial.github) : null,
        youtube: rawSocial.youtube ? String(rawSocial.youtube) : null,
      }
    : null;

  return {
    businessName: String(payload.businessName || "KNYK Labs"),
    email: payload.email ? String(payload.email) : null,
    supportEmail: payload.supportEmail ? String(payload.supportEmail) : null,
    salesEmail: payload.salesEmail ? String(payload.salesEmail) : null,
    phone: payload.phone ? String(payload.phone) : null,
    whatsappNumber: payload.whatsappNumber ? String(payload.whatsappNumber) : null,
    address,
    businessHours: payload.businessHours ? String(payload.businessHours) : null,
    googleMapsUrl: payload.googleMapsUrl ? String(payload.googleMapsUrl) : null,
    websiteUrl: payload.websiteUrl ? String(payload.websiteUrl) : null,
    social,
  };
}

/**
 * Fetch public contact & business configuration dynamically from NEXIS.
 * NEXIS is the single source of truth.
 */
export async function getKnykContact(): Promise<ContactResult> {
  const nexisUrl = process.env.NEXIS_API_URL?.trim();
  const revalidateSeconds = Number(process.env.NEXIS_REVALIDATE_SECONDS) || DEFAULT_REVALIDATE;

  if (!nexisUrl) {
    return {
      contact: null,
      isAvailable: false,
      error: "NEXIS_API_URL environment variable is not configured.",
    };
  }

  const endpoint = `${nexisUrl.replace(/\/+$/, "")}/api/v1/knyk/contact`;

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
        contact: null,
        isAvailable: false,
        error: `NEXIS contact service returned status ${response.status}`,
      };
    }

    const json = await response.json();
    const contact = normalizeContactPayload(json);

    if (!contact) {
      return {
        contact: null,
        isAvailable: false,
        error: "Invalid contact configuration received from NEXIS.",
      };
    }

    return {
      contact,
      isAvailable: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error contacting NEXIS";
    return {
      contact: null,
      isAvailable: false,
      error: message,
    };
  }
}
