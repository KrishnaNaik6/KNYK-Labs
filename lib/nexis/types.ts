export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder?: number;
  isEnabled?: boolean;
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  category?: Category | null;
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
  isEnabled?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category?: string;
  summary: string;
  description?: string;
  tags: string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface KnykCatalogResponse {
  services: Service[];
  categories?: Category[];
}

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

export interface ContactResult {
  contact: KnykPublicContact | null;
  isAvailable: boolean;
  error?: string;
}

export interface KnykPublicBrandAsset {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
}

export interface KnykPublicBranding {
  primaryLogo: KnykPublicBrandAsset | null;
  brandMark: KnykPublicBrandAsset | null;
  favicon?: KnykPublicBrandAsset | null;
  socialPreview?: KnykPublicBrandAsset | null;
}

export interface BrandingResult {
  branding: KnykPublicBranding | null;
  isAvailable: boolean;
  error?: string;
}

export * from "@/lib/types/knyk";

