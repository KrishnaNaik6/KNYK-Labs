export interface ContactConfig {
  whatsappNumber: string;
  phone: string;
  email: string;
}

export function getContactConfig(): ContactConfig {
  return {
    whatsappNumber: process.env.NEXT_PUBLIC_KNYK_WHATSAPP_NUMBER?.trim() || "",
    phone: process.env.NEXT_PUBLIC_KNYK_PHONE?.trim() || "",
    email: process.env.NEXT_PUBLIC_KNYK_EMAIL?.trim() || "contact@knyklabs.com",
  };
}

export interface CreateWhatsAppUrlOptions {
  serviceName?: string;
  budget?: string;
  clientName?: string;
}

/**
 * Builds a validated WhatsApp chat deep link with prefilled enquiry text.
 * Returns null if NEXT_PUBLIC_KNYK_WHATSAPP_NUMBER is not configured.
 */
export function createWhatsAppUrl(options?: CreateWhatsAppUrlOptions): string | null {
  const { whatsappNumber } = getContactConfig();
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

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
 * Backward-compatible helper for simple service links.
 */
export function buildWhatsAppLink(serviceName?: string): string | null {
  return createWhatsAppUrl({ serviceName });
}

/**
 * Builds a tel: URI, or null if phone number is not configured.
 */
export function buildPhoneLink(): string | null {
  const { phone } = getContactConfig();
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  if (!cleanPhone || cleanPhone.length < 5) {
    return null;
  }

  return `tel:${cleanPhone}`;
}

/**
 * Builds a mailto: URI, or null if email is not configured.
 */
export function buildEmailLink(subject?: string): string | null {
  const { email } = getContactConfig();
  if (!email || !email.includes("@")) {
    return null;
  }
  const sub = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${sub}`;
}
