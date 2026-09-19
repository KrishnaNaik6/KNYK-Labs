// ==============================================================================
// KNYK LABS — SERVICES API CLIENT
// Endpoint: GET /api/v1/knyk/services
// Cache Behavior: 1 minute browser / 5 minute CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type {
  KnykPublicService,
  KnykPublicServiceCategory,
  KnykPublicServiceCatalog,
} from "@/lib/types/knyk";

export interface ServicesResult {
  services: KnykPublicService[];
  categories: KnykPublicServiceCategory[];
  isAvailable: boolean;
  error?: string;
}

export interface ServiceDetailResult {
  service: KnykPublicService | null;
  isAvailable: boolean;
  error?: string;
}

/**
 * Normalizes varied API response structures into a uniform list of services and categories.
 * Works seamlessly whether services are nested inside categories or provided at root.
 */
function normalizeCatalog(catalog: unknown): {
  services: KnykPublicService[];
  categories: KnykPublicServiceCategory[];
} {
  if (!catalog || typeof catalog !== "object") {
    return { services: [], categories: [] };
  }

  const raw = catalog as Record<string, unknown>;
  const payload = (raw.data && typeof raw.data === "object" ? raw.data : raw) as Record<string, unknown>;

  let rawCategories: unknown[] = [];
  let rawServices: unknown[] = [];

  if (Array.isArray(payload)) {
    // Array of categories or services
    if (payload.length > 0 && typeof payload[0] === "object" && payload[0] !== null && Array.isArray((payload[0] as Record<string, unknown>).services)) {
      rawCategories = payload;
      for (const cat of payload) {
        if (cat && typeof cat === "object" && Array.isArray((cat as Record<string, unknown>).services)) {
          for (const s of (cat as Record<string, unknown>).services as unknown[]) {
            if (s && typeof s === "object") {
              const catRecord = cat as Record<string, unknown>;
              rawServices.push({
                ...(s as Record<string, unknown>),
                categoryName: (s as Record<string, unknown>).categoryName || catRecord.name,
                categorySlug: (s as Record<string, unknown>).categorySlug || catRecord.slug,
              });
            }
          }
        }
      }
    } else {
      rawServices = payload;
    }
  } else {
    if (Array.isArray(payload.categories)) {
      rawCategories = payload.categories;
      // Extract nested category.services
      for (const cat of payload.categories) {
        if (cat && typeof cat === "object" && Array.isArray((cat as Record<string, unknown>).services)) {
          for (const s of (cat as Record<string, unknown>).services as unknown[]) {
            if (s && typeof s === "object") {
              const catRecord = cat as Record<string, unknown>;
              rawServices.push({
                ...(s as Record<string, unknown>),
                categoryName: (s as Record<string, unknown>).categoryName || catRecord.name,
                categorySlug: (s as Record<string, unknown>).categorySlug || catRecord.slug,
              });
            }
          }
        }
      }
    }

    if (Array.isArray(payload.services)) {
      rawServices = payload.services;
    } else if (Array.isArray(payload.items)) {
      rawServices = payload.items;
    }
  }

  // Map and clean services
  const services: KnykPublicService[] = rawServices
    .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === "object"))
    .map((s) => ({
      id: String(s.id || ""),
      categoryId: String(s.categoryId || s.category_id || ""),
      categoryName: s.categoryName ? String(s.categoryName) : undefined,
      categorySlug: s.categorySlug ? String(s.categorySlug) : undefined,
      name: String(s.name || "Untitled Service"),
      slug: String(s.slug || ""),
      shortDescription: s.shortDescription ? String(s.shortDescription) : (s.short_description ? String(s.short_description) : null),
      description: s.description ? String(s.description) : null,
      startingPrice: typeof s.startingPrice === "number" ? s.startingPrice : (typeof s.starting_price === "number" ? s.starting_price : null),
      currency: String(s.currency || "INR"),
      advancePercentage: Number(s.advancePercentage ?? s.advance_percentage ?? 30),
      estimatedDelivery: s.estimatedDelivery ? String(s.estimatedDelivery) : (s.estimated_delivery ? String(s.estimated_delivery) : null),
      imageUrl: s.imageUrl ? String(s.imageUrl) : (s.image_url ? String(s.image_url) : null),
      isFeatured: Boolean(s.isFeatured ?? s.is_featured ?? false),
      displayOrder: Number(s.displayOrder ?? s.display_order ?? 0),
    }))
    .filter((s) => s.slug.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Map and clean categories
  const categories: KnykPublicServiceCategory[] = rawCategories
    .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === "object"))
    .map((c) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      slug: String(c.slug || ""),
      description: c.description ? String(c.description) : null,
      icon: c.icon ? String(c.icon) : null,
      displayOrder: Number(c.displayOrder ?? c.display_order ?? 0),
    }))
    .filter((c) => c.slug.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return { services, categories };
}

/**
 * Fetch the public KNYK service catalog from NEXIS.
 */
export async function getPublicServices(): Promise<ServicesResult> {
  const result = await nexisFetch<KnykPublicServiceCatalog>("/api/v1/knyk/services", {
    revalidate: 60, // 1 minute browser / ISR
  });

  if (!result.isAvailable || !result.data) {
    return {
      services: [],
      categories: [],
      isAvailable: false,
      error: result.error || "Services are temporarily unavailable.",
    };
  }

  const { services, categories } = normalizeCatalog(result.data);

  return {
    services,
    categories,
    isAvailable: true,
  };
}

/**
 * Retrieve a specific enabled service by slug.
 */
export async function getPublicServiceBySlug(slug: string): Promise<ServiceDetailResult> {
  const catalog = await getPublicServices();

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
  services: KnykPublicService[],
  categories: KnykPublicServiceCategory[]
): Array<{
  category: KnykPublicServiceCategory;
  services: KnykPublicService[];
}> {
  const categoryMap = new Map<string, { category: KnykPublicServiceCategory; services: KnykPublicService[] }>();

  for (const cat of categories) {
    categoryMap.set(cat.id || cat.slug, {
      category: cat,
      services: [],
    });
  }

  for (const service of services) {
    const catId = service.categoryId || service.categorySlug;
    if (catId && categoryMap.has(catId)) {
      categoryMap.get(catId)!.services.push(service);
    } else {
      const fallbackId = catId || "general";
      if (!categoryMap.has(fallbackId)) {
        const catObj: KnykPublicServiceCategory = {
          id: fallbackId,
          name: service.categoryName || "General Capabilities",
          slug: service.categorySlug || fallbackId,
          description: null,
          icon: null,
          displayOrder: 99,
        };
        categoryMap.set(fallbackId, {
          category: catObj,
          services: [],
        });
      }
      categoryMap.get(fallbackId)!.services.push(service);
    }
  }

  return Array.from(categoryMap.values()).filter((group) => group.services.length > 0);
}
