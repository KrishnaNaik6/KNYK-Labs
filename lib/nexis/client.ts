import { Category, ContactResult, PortfolioProject, Service } from "./types";
import { getPublicServices } from "@/lib/api/services";
import { getPublicContact } from "@/lib/api/contact";
import { getPublicPortfolio } from "@/lib/api/portfolio";

export interface CatalogResult {
  services: Service[];
  categories: Category[];
  isAvailable: boolean;
  error?: string;
}

/**
 * Fetch the public KNYK service catalog from NEXIS.
 * Delegates to centralized lib/api/services.
 */
export async function getKnykServiceCatalog(): Promise<CatalogResult> {
  const result = await getPublicServices();
  return {
    services: result.services as Service[],
    categories: result.categories as Category[],
    isAvailable: result.isAvailable,
    error: result.error,
  };
}

/**
 * Retrieve a specific service by slug.
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
 * Fetch portfolio projects from NEXIS.
 * Delegates to centralized lib/api/portfolio.
 */
export async function getPortfolioProjects(): Promise<{
  projects: PortfolioProject[];
  isAvailable: boolean;
  error?: string;
}> {
  const result = await getPublicPortfolio();
  return {
    projects: result.projects as unknown as PortfolioProject[],
    isAvailable: result.isAvailable,
    error: result.error,
  };
}

/**
 * Fetch centralized business & contact settings from NEXIS.
 * Delegates to centralized lib/api/contact.
 */
export async function getKnykContact(): Promise<ContactResult> {
  const result = await getPublicContact();
  return {
    contact: result.contact,
    isAvailable: result.isAvailable,
    error: result.error,
  };
}
