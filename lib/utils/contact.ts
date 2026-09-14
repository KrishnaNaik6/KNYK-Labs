import type { KnykPublicContact } from "@/lib/nexis/types";

export interface CreateWhatsAppUrlOptions {
  whatsappNumber?: string | null;
  serviceName?: string;
  budget?: string;
  clientName?: string;
}

/**
 * Normalizes phone or WhatsApp strings down to clean digits.
 */
export function normalizeWhatsAppNumber(raw?: string | null): string {
  if (!raw) return "";
  return raw.replace(/[^0-9]/g, "");
}

/**
 * Builds a validated WhatsApp chat deep link with prefilled enquiry text.
 * Returns null if whatsappNumber is not provided or invalid.
 */
export function createWhatsAppUrl(options?: CreateWhatsAppUrlOptions): string | null {
  const cleanNumber = normalizeWhatsAppNumber(options?.whatsappNumber);

  if (!cleanNumber || cleanNumber.length < 7) {
    return null;
  }

  let message = "Hi KNYK Labs,\nI'd like to discuss a digital project.";

  if (options?.serviceName && options.serviceName.trim().length > 0) {
    message = `Hi KNYK Labs,\nI'm interested in ${options.serviceName.trim()}.\nI'd like to discuss my project.`;
  }

  if (options?.budget) {
    message += `\nEstimated Budget: ${options.budget}`;
  }

  if (options?.clientName) {
    message += `\nFrom: ${options.clientName}`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to build a WhatsApp link with optional service name.
 */
export function buildWhatsAppLink(whatsappNumber?: string | null, serviceName?: string): string | null {
  return createWhatsAppUrl({ whatsappNumber, serviceName });
}

/**
 * Builds a tel: URI, or null if phone number is not configured.
 */
export function buildPhoneLink(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  if (!cleanPhone || cleanPhone.length < 5) {
    return null;
  }

  return `tel:${cleanPhone}`;
}

/**
 * Builds a mailto: URI, or null if email is not configured.
 */
export function buildEmailLink(email?: string | null, subject?: string): string | null {
  if (!email || !email.includes("@")) {
    return null;
  }
  const sub = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${sub}`;
}

/**
 * Formats a structured physical address into a readable single-line or multi-line string.
 */
export function formatAddress(address?: KnykPublicContact["address"]): string | null {
  if (!address) return null;
  const parts = [
    address.line,
    address.city,
    address.state ? (address.postalCode ? `${address.state} ${address.postalCode}` : address.state) : address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}
