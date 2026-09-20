// ==============================================================================
// KNYK LABS — STRUCTURED DATA (JSON-LD) GENERATORS
// Adheres strictly to Schema.org standards without inventing false claims.
// ==============================================================================

import type {
  KnykPublicContact,
  KnykPublicBranding,
  KnykPublicWebsiteSettings,
  KnykPublicService,
  KnykPublicPortfolioProject,
} from "@/lib/types/knyk";

/**
 * Organization Schema (Schema.org/Organization)
 * Consumes real NEXIS business & contact details.
 */
export function getOrganizationJsonLd(
  contact: KnykPublicContact | null,
  branding: KnykPublicBranding | null,
  siteUrl: string = "https://knyklabs.com"
) {
  const logoUrl =
    branding?.primaryLogo?.url ||
    branding?.brandMark?.url ||
    `${siteUrl}/icon.svg`;

  const sameAs: string[] = [];
  if (contact?.social) {
    if (contact.social.linkedin) sameAs.push(contact.social.linkedin);
    if (contact.social.github) sameAs.push(contact.social.github);
    if (contact.social.instagram) sameAs.push(contact.social.instagram);
    if (contact.social.facebook) sameAs.push(contact.social.facebook);
    if (contact.social.youtube) sameAs.push(contact.social.youtube);
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contact?.businessName || "KNYK Labs",
    url: siteUrl,
    logo: logoUrl,
    description:
      "High-impact software engineering, visual branding, multimedia production, and custom AI automation studio.",
    knowsAbout: [
      "Freelance Software Development",
      "Custom Software Development",
      "Full Stack Web Development",
      "Mobile Application Development",
      "AI & Machine Learning Solutions",
      "Autonomous Workflow Automation",
      "UI/UX Digital Design",
      "Next.js and React Engineering",
    ],
  };

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  if (contact?.email || contact?.phone) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      ...(contact.phone ? { telephone: contact.phone } : {}),
      ...(contact.email ? { email: contact.email } : {}),
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi", "Kannada"],
    };
  }

  if (contact?.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...(contact.address.line ? { streetAddress: contact.address.line } : {}),
      addressLocality: contact.address.city || "Bengaluru",
      addressRegion: contact.address.state || "Karnataka",
      ...(contact.address.postalCode ? { postalCode: contact.address.postalCode } : {}),
      addressCountry: contact.address.country || "IN",
    };
  }

  return schema;
}

/**
 * WebSite Schema (Schema.org/WebSite)
 */
export function getWebSiteJsonLd(
  siteUrl: string = "https://knyklabs.com",
  website: KnykPublicWebsiteSettings | null = null
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KNYK Labs",
    url: siteUrl,
    description:
      website?.siteDescription ||
      "KNYK Labs builds custom software, modern websites, mobile applications, AI solutions, automation systems, and digital experiences for businesses.",
  };
}

/**
 * Service Schema (Schema.org/Service)
 */
export function getServiceJsonLd(
  service: KnykPublicService,
  siteUrl: string = "https://knyklabs.com",
  contact: KnykPublicContact | null = null
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.categoryName || "Digital Services",
    description: service.description || service.shortDescription || `${service.name} by KNYK Labs`,
    url: `${siteUrl}/services/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: contact?.businessName || "KNYK Labs",
      url: siteUrl,
    },
  };

  if (service.startingPrice && service.startingPrice > 0) {
    schema.offers = {
      "@type": "Offer",
      price: service.startingPrice,
      priceCurrency: service.currency || "INR",
      availability: "https://schema.org/InStock",
    };
  }

  return schema;
}

/**
 * CreativeWork Schema (Schema.org/CreativeWork) for Portfolio Projects
 */
export function getCreativeWorkJsonLd(
  project: KnykPublicPortfolioProject,
  siteUrl: string = "https://knyklabs.com"
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: `${siteUrl}/portfolio/${project.slug}`,
    creator: {
      "@type": "Organization",
      name: "KNYK Labs",
      url: siteUrl,
    },
  };

  if (project.coverImageUrl) {
    schema.image = project.coverImageUrl;
  }

  if (project.technologies && project.technologies.length > 0) {
    schema.keywords = project.technologies.join(", ");
  }

  return schema;
}

/**
 * BreadcrumbList Schema (Schema.org/BreadcrumbList)
 */
export function getBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to safely sanitize JSON string for injection in <script type="application/ld+json">
 * Prevents XSS via </script> injection.
 */
export function sanitizeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
