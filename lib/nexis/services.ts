import { getKnykServiceCatalog, getKnykContact, CatalogResult } from "./client";
import { Service, ContactResult, KnykPublicContact, Category } from "./types";

export type { ContactResult, KnykPublicContact, Category };
export { getKnykContact };

export interface ServiceDetailResult {
  service: Service | null;
  isAvailable: boolean;
  error?: string;
}

/**
 * Fetch the entire KNYK service catalog from NEXIS.
 */
export async function getKnykCatalog(): Promise<CatalogResult> {
  return getKnykServiceCatalog();
}

/**
 * Convenience alias for backward compatibility.
 */
export const getKnykServiceCatalogAlias = getKnykCatalog;

/**
 * Returns all enabled services, ordered by displayOrder.
 */
export async function getKnykServices(): Promise<{
  services: Service[];
  isAvailable: boolean;
  error?: string;
}> {
  const catalog = await getKnykCatalog();
  return {
    services: catalog.services,
    isAvailable: catalog.isAvailable,
    error: catalog.error,
  };
}

/**
 * Returns only enabled featured services (isFeatured === true), ordered by displayOrder.
 */
export async function getKnykFeaturedServices(): Promise<{
  featuredServices: Service[];
  isAvailable: boolean;
  error?: string;
}> {
  const catalog = await getKnykCatalog();
  const featured = catalog.services.filter((s) => s.isFeatured);
  return {
    featuredServices: featured,
    isAvailable: catalog.isAvailable,
    error: catalog.error,
  };
}

/**
 * Retrieve a specific enabled service by its slug.
 */
export async function getKnykServiceBySlug(slug: string): Promise<ServiceDetailResult> {
  const catalog = await getKnykCatalog();

  if (!catalog.isAvailable) {
    return {
      service: null,
      isAvailable: false,
      error: catalog.error,
    };
  }

  const cleanSlug = slug.toLowerCase().trim();
  const service = catalog.services.find((s) => s.slug.toLowerCase() === cleanSlug) || null;

  return {
    service,
    isAvailable: true,
  };
}

/**
 * Group services by Category for structured rendering.
 */
export { groupServicesByCategory } from "@/lib/api/services";
