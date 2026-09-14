export interface ContactConfig {
  whatsappNumber: string;
  phone: string;
  email: string;
}

export function getContactConfig(): ContactConfig {
  return {
    whatsappNumber: process.env.NEXT_PUBLIC_KNYK_WHATSAPP_NUMBER || "919876543210",
    phone: process.env.NEXT_PUBLIC_KNYK_PHONE || "+91 98765 43210",
    email: process.env.NEXT_PUBLIC_KNYK_EMAIL || "contact@knyklabs.com",
  };
}

/**
 * Builds a WhatsApp chat deep link with prefilled enquiry text.
 */
export function buildWhatsAppLink(serviceName?: string): string {
  const { whatsappNumber } = getContactConfig();
  // Strip any non-digit characters for the wa.me url
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  let message = "Hi KNYK Labs, I'd like to discuss a digital project.";
  if (serviceName && serviceName.trim().length > 0) {
    message = `Hi KNYK Labs, I'm interested in ${serviceName.trim()}. I'd like to discuss my project requirements and get a quote.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a tel: URI
 */
export function buildPhoneLink(): string {
  const { phone } = getContactConfig();
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  return `tel:${cleanPhone}`;
}

/**
 * Builds a mailto: URI
 */
export function buildEmailLink(subject?: string): string {
  const { email } = getContactConfig();
  const sub = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${sub}`;
}
