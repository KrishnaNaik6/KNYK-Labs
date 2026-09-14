import { Category, ContactResult, KnykPublicContact, PortfolioProject, Service } from "./types";

const DEFAULT_REVALIDATE = 60;

export interface CatalogResult {
  services: Service[];
  categories: Category[];
  isAvailable: boolean;
  error?: string;
}

/**
 * Normalizes varied API response structures into a uniform CatalogResult.
 */
function normalizeCatalogPayload(data: unknown): CatalogResult {
  if (!data || typeof data !== "object") {
    return { services: [], categories: [], isAvailable: false, error: "Invalid API response structure" };
  }

  const raw = data as Record<string, unknown>;
  let rawServices: unknown[] = [];
  let rawCategories: unknown[] = [];

  // Check nested data wrapper e.g. { success: true, data: { services: [], categories: [] } }
  const payload = (raw.data && typeof raw.data === "object" ? raw.data : raw) as Record<string, unknown>;

  if (Array.isArray(payload)) {
    rawServices = payload;
  } else {
    if (Array.isArray(payload.services)) {
      rawServices = payload.services;
    } else if (Array.isArray(payload.items)) {
      rawServices = payload.items;
    }

    if (Array.isArray(payload.categories)) {
      rawCategories = payload.categories;
    }
  }

  // Filter and map services safely
  const services: Service[] = rawServices
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => {
      const rawCategory = item.category as Record<string, unknown> | undefined;
      const category: Category | null = rawCategory
        ? {
            id: String(rawCategory.id || ""),
            name: String(rawCategory.name || "General"),
            slug: String(rawCategory.slug || "general"),
            isEnabled: rawCategory.isEnabled !== false,
            description: rawCategory.description ? String(rawCategory.description) : null,
            icon: rawCategory.icon ? String(rawCategory.icon) : null,
          }
        : null;

      return {
        id: String(item.id || ""),
        categoryId: String(item.categoryId || item.category_id || (category?.id ?? "")),
        category,
        name: String(item.name || "Untitled Service"),
        slug: String(item.slug || ""),
        shortDescription: String(item.shortDescription || item.short_description || ""),
        description: item.description ? String(item.description) : null,
        startingPrice: Number(item.startingPrice ?? item.starting_price ?? 0),
        currency: String(item.currency || "INR"),
        advancePercentage: Number(item.advancePercentage ?? item.advance_percentage ?? 50),
        estimatedDelivery: String(item.estimatedDelivery || item.estimated_delivery || "Contact us"),
        imageUrl: item.imageUrl ? String(item.imageUrl) : (item.image_url ? String(item.image_url) : null),
        isFeatured: Boolean(item.isFeatured ?? item.is_featured ?? false),
        isEnabled: item.isEnabled !== false && item.is_enabled !== false,
        displayOrder: Number(item.displayOrder ?? item.display_order ?? 0),
        createdAt: item.createdAt ? String(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
      };
    })
    .filter((s) => s.isEnabled && s.slug.length > 0)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  // Extract or infer categories
  let categories: Category[] = rawCategories
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      id: String(item.id || ""),
      name: String(item.name || ""),
      slug: String(item.slug || ""),
      description: item.description ? String(item.description) : null,
      icon: item.icon ? String(item.icon) : null,
      displayOrder: Number(item.displayOrder ?? item.display_order ?? 0),
      isEnabled: item.isEnabled !== false && item.is_enabled !== false,
    }))
    .filter((c) => c.isEnabled);

  // If categories were not separately provided, derive them from services
  if (categories.length === 0) {
    const categoryMap = new Map<string, Category>();
    for (const service of services) {
      if (service.category && service.category.name) {
        if (!categoryMap.has(service.category.id || service.category.slug)) {
          categoryMap.set(service.category.id || service.category.slug, service.category);
        }
      } else if (service.categoryId) {
        if (!categoryMap.has(service.categoryId)) {
          categoryMap.set(service.categoryId, {
            id: service.categoryId,
            name: service.categoryId.charAt(0).toUpperCase() + service.categoryId.slice(1),
            slug: service.categoryId.toLowerCase(),
            isEnabled: true,
          });
        }
      }
    }
    categories = Array.from(categoryMap.values());
  }

  return {
    services,
    categories,
    isAvailable: true,
  };
}

/**
 * Fetch the public KNYK service catalog from NEXIS.
 */
export async function getKnykServiceCatalog(): Promise<CatalogResult> {
  const nexisUrl = process.env.NEXIS_API_URL?.trim();
  const revalidateSeconds = Number(process.env.NEXIS_REVALIDATE_SECONDS) || DEFAULT_REVALIDATE;

  if (!nexisUrl) {
    return {
      services: [],
      categories: [],
      isAvailable: false,
      error: "NEXIS_API_URL environment variable is not configured.",
    };
  }

  const endpoint = `${nexisUrl.replace(/\/+$/, "")}/api/v1/knyk/services`;

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
        services: [],
        categories: [],
        isAvailable: false,
        error: `NEXIS service returned status ${response.status}`,
      };
    }

    const data = await response.json();
    return normalizeCatalogPayload(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error contacting NEXIS";
    return {
      services: [],
      categories: [],
      isAvailable: false,
      error: message,
    };
  }
}

/**
 * Retrieve a specific enabled service by slug.
 */
export async function getKnykServiceBySlug(slug: string): Promise<{
  service: Service | null;
  isAvailable: boolean;
  error?: string;
}> {
  const catalog = await getKnykServiceCatalog();

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
 * Fetch portfolio projects from NEXIS (prepared for future public endpoint).
 */
export async function getPortfolioProjects(): Promise<{
  projects: PortfolioProject[];
  isAvailable: boolean;
  error?: string;
}> {
  const nexisUrl = process.env.NEXIS_API_URL?.trim();
  if (!nexisUrl) {
    return { projects: [], isAvailable: false };
  }

  const endpoint = `${nexisUrl.replace(/\/+$/, "")}/api/v1/knyk/portfolio`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { projects: [], isAvailable: false };
    }

    const json = await response.json();
    const list = Array.isArray(json) ? json : json?.data || json?.projects || [];
    return {
      projects: list,
      isAvailable: true,
    };
  } catch {
    return { projects: [], isAvailable: false };
  }
}

/**
 * Normalizes varied API response structures into a uniform KnykPublicContact.
 */
function normalizeContactPayload(data: unknown): KnykPublicContact | null {
  if (!data || typeof data !== "object") return null;

  const raw = data as Record<string, unknown>;
  const payload = (raw.data && typeof raw.data === "object" ? raw.data : raw) as Record<string, unknown>;

  if (!payload.businessName && !payload.business_name && !payload.name) {
    return null;
  }

  const rawAddress = (payload.address && typeof payload.address === "object"
    ? payload.address
    : null) as Record<string, unknown> | null;

  const address = rawAddress
    ? {
        line: rawAddress.line ? String(rawAddress.line) : null,
        city: rawAddress.city ? String(rawAddress.city) : null,
        state: rawAddress.state ? String(rawAddress.state) : null,
        country: rawAddress.country ? String(rawAddress.country) : null,
        postalCode: rawAddress.postalCode
          ? String(rawAddress.postalCode)
          : rawAddress.postal_code
          ? String(rawAddress.postal_code)
          : null,
      }
    : null;

  const rawSocial = (payload.social && typeof payload.social === "object"
    ? payload.social
    : null) as Record<string, unknown> | null;

  const social = rawSocial
    ? {
        instagram: rawSocial.instagram ? String(rawSocial.instagram) : null,
        facebook: rawSocial.facebook ? String(rawSocial.facebook) : null,
        linkedin: rawSocial.linkedin ? String(rawSocial.linkedin) : null,
        github: rawSocial.github ? String(rawSocial.github) : null,
        youtube: rawSocial.youtube ? String(rawSocial.youtube) : null,
      }
    : null;

  return {
    businessName: String(payload.businessName || payload.business_name || payload.name || "KNYK Labs"),
    email: payload.email ? String(payload.email) : payload.businessEmail ? String(payload.businessEmail) : null,
    supportEmail: payload.supportEmail ? String(payload.supportEmail) : null,
    salesEmail: payload.salesEmail ? String(payload.salesEmail) : null,
    phone: payload.phone ? String(payload.phone) : null,
    whatsappNumber: payload.whatsappNumber
      ? String(payload.whatsappNumber)
      : payload.whatsapp_number
      ? String(payload.whatsapp_number)
      : null,
    address,
    businessHours: payload.businessHours
      ? String(payload.businessHours)
      : payload.business_hours
      ? String(payload.business_hours)
      : null,
    googleMapsUrl: payload.googleMapsUrl
      ? String(payload.googleMapsUrl)
      : payload.google_maps_url
      ? String(payload.google_maps_url)
      : null,
    websiteUrl: payload.websiteUrl
      ? String(payload.websiteUrl)
      : payload.website_url
      ? String(payload.website_url)
      : null,
    social,
  };
}

/**
 * Fetch centralized business & contact settings from NEXIS.
 * Returns ContactResult with contact details if available, or graceful fallback.
 */
export async function getKnykContact(): Promise<ContactResult> {
  const nexisUrl = process.env.NEXIS_API_URL?.trim();
  if (!nexisUrl) {
    return {
      contact: null,
      isAvailable: false,
      error: "NEXIS_API_URL is not configured",
    };
  }

  const endpoint = `${nexisUrl.replace(/\/+$/, "")}/api/v1/knyk/contact`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const revalidateSeconds = process.env.NEXIS_CACHE_REVALIDATE
      ? parseInt(process.env.NEXIS_CACHE_REVALIDATE, 10) || DEFAULT_REVALIDATE
      : DEFAULT_REVALIDATE;

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
        error: `NEXIS returned HTTP ${response.status}`,
      };
    }

    const json = await response.json();
    const contact = normalizeContactPayload(json);

    if (!contact) {
      return {
        contact: null,
        isAvailable: false,
        error: "Failed to parse contact payload from NEXIS",
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

