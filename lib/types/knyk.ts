// ==============================================================================
// KNYK LABS — FROZEN NEXIS PUBLIC API TYPES & DTOs
// Description: Pure public representation of NEXIS API contracts.
// Guarantees: Zero database IDs, zero admin flags, zero internal timestamps.
// ==============================================================================

/**
 * Standard NEXIS API envelope for successful responses.
 */
export interface KnykApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Standard NEXIS API envelope for error responses.
 */
export interface KnykApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export type KnykApiResult<T> =
  | { success: true; data: T; timestamp?: string }
  | { success: false; error: { code: string; message: string; details?: unknown }; timestamp?: string };

// ==========================================
// 1. SERVICES & CATEGORIES (GET /api/v1/knyk/services)
// ==========================================

export interface KnykPublicServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder?: number;
}

export interface KnykPublicService {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  startingPrice: number | null;
  currency: string;
  advancePercentage: number;
  estimatedDelivery?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  displayOrder?: number;
}

export interface KnykPublicServiceCatalog {
  categories: Array<KnykPublicServiceCategory & { services: KnykPublicService[] }>;
}

// ==========================================
// 2. BUSINESS & CONTACT (GET /api/v1/knyk/contact)
// ==========================================

export interface KnykPublicContactAddress {
  line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

export interface KnykPublicContactSocial {
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  github?: string | null;
  youtube?: string | null;
}

export interface KnykPublicContact {
  businessName: string;
  email?: string | null;
  supportEmail?: string | null;
  salesEmail?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  address?: KnykPublicContactAddress | null;
  businessHours?: string | null;
  googleMapsUrl?: string | null;
  websiteUrl?: string | null;
  social?: KnykPublicContactSocial | null;
}

// ==========================================
// 3. BRANDING & ASSETS (GET /api/v1/knyk/branding)
// ==========================================

export interface KnykPublicBrandAsset {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface KnykPublicBranding {
  primaryLogo: KnykPublicBrandAsset | null;
  brandMark: KnykPublicBrandAsset | null;
  favicon: KnykPublicBrandAsset | null;
  socialPreview: KnykPublicBrandAsset | null;
  lightLogo: KnykPublicBrandAsset | null;
  darkLogo: KnykPublicBrandAsset | null;
}

// ==========================================
// 4. PORTFOLIO (GET /api/v1/knyk/portfolio)
// ==========================================

export interface KnykPublicPortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description?: string | null;
  tags: string[];
  coverImageUrl?: string | null;
  galleryUrls: string[];
  technologies: string[];
  projectUrl?: string | null;
  isFeatured: boolean;
  displayOrder: number;
}

// ==========================================
// 5. TESTIMONIALS (GET /api/v1/knyk/testimonials)
// ==========================================

export interface KnykPublicTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string | null;
  rating?: number | null;
  isFeatured: boolean;
  displayOrder: number;
}

// ==========================================
// 6. WEBSITE & SEO CONFIG (GET /api/v1/knyk/website)
// ==========================================

export interface KnykPublicWebsiteSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  robotsBehavior: string;
  maintenanceMode: boolean;
  announcementBanner?: string | null;
  announcementLink?: string | null;
  footerDescription?: string | null;
  copyrightText?: string | null;
}

// ==========================================
// 7. ENQUIRIES (POST /api/v1/knyk/enquiries)
// ==========================================

export interface CreateKnykPublicEnquiryRequest {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  serviceId?: string;
  budget?: string;
  message: string;
  source?: string;
}

export interface KnykPublicEnquiryResponse {
  message: string;
}
