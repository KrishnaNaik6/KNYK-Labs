import { getKnykServiceCatalog, getKnykContact, CatalogResult } from "./client";
import { Service, Category, ContactResult, KnykPublicContact } from "./types";

export type { ContactResult, KnykPublicContact };
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
export function groupServicesByCategory(
  services: Service[],
  categories: Category[]
): Array<{
  category: Category;
  services: Service[];
}> {
  const categoryMap = new Map<string, { category: Category; services: Service[] }>();

  // Initialize with defined categories
  for (const cat of categories) {
    categoryMap.set(cat.id || cat.slug, {
      category: cat,
      services: [],
    });
  }

  // Populate services into their respective categories
  for (const service of services) {
    const catId = service.category?.id || service.category?.slug || service.categoryId;
    if (catId && categoryMap.has(catId)) {
      categoryMap.get(catId)!.services.push(service);
    } else {
      // Fallback category if category was not pre-registered
      const fallbackId = catId || "general";
      if (!categoryMap.has(fallbackId)) {
        const catObj: Category = service.category ?? {
          id: fallbackId,
          name: "General Capabilities",
          slug: fallbackId,
          isEnabled: true,
        };
        categoryMap.set(fallbackId, {
          category: catObj,
          services: [],
        });
      }
      categoryMap.get(fallbackId)!.services.push(service);
    }
  }

  // Only return categories that have at least one enabled service
  return Array.from(categoryMap.values()).filter((group) => group.services.length > 0);
}
