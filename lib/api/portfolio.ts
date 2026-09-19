// ==============================================================================
// KNYK LABS — PORTFOLIO API CLIENT
// Endpoint: GET /api/v1/knyk/portfolio
// Cache Behavior: 2 minute browser / 10 minute CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type { KnykPublicPortfolioProject } from "@/lib/types/knyk";

export interface PortfolioResult {
  projects: KnykPublicPortfolioProject[];
  isAvailable: boolean;
  error?: string;
}

export interface PortfolioDetailResult {
  project: KnykPublicPortfolioProject | null;
  isAvailable: boolean;
  error?: string;
}

function normalizePortfolio(raw: unknown): KnykPublicPortfolioProject[] {
  if (!raw) return [];

  const data = raw as Record<string, unknown>;
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.projects)
    ? data.projects
    : [];

  return list
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((p) => ({
      id: String(p.id || ""),
      title: String(p.title || "Untitled Project"),
      slug: String(p.slug || ""),
      category: String(p.category || "General"),
      summary: String(p.summary || ""),
      description: p.description ? String(p.description) : null,
      tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
      coverImageUrl: p.coverImageUrl ? String(p.coverImageUrl) : (p.cover_image_url ? String(p.cover_image_url) : (p.imageUrl ? String(p.imageUrl) : null)),
      galleryUrls: Array.isArray(p.galleryUrls) ? p.galleryUrls.map(String) : (Array.isArray(p.gallery_urls) ? p.gallery_urls.map(String) : []),
      technologies: Array.isArray(p.technologies) ? p.technologies.map(String) : [],
      projectUrl: p.projectUrl ? String(p.projectUrl) : (p.project_url ? String(p.project_url) : (p.liveUrl ? String(p.liveUrl) : null)),
      isFeatured: Boolean(p.isFeatured ?? p.is_featured ?? false),
      displayOrder: Number(p.displayOrder ?? p.display_order ?? 0),
    }))
    .filter((p) => p.slug.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Fetch public portfolio projects from NEXIS.
 */
export async function getPublicPortfolio(): Promise<PortfolioResult> {
  const result = await nexisFetch<KnykPublicPortfolioProject[]>("/api/v1/knyk/portfolio", {
    revalidate: 120, // 2 minutes
  });

  if (!result.isAvailable || !result.data) {
    return {
      projects: [],
      isAvailable: false,
      error: result.error || "Portfolio projects are temporarily unavailable.",
    };
  }

  const projects = normalizePortfolio(result.data);

  return {
    projects,
    isAvailable: true,
  };
}

/**
 * Fetch a single portfolio project by its slug.
 */
export async function getPublicPortfolioProjectBySlug(slug: string): Promise<PortfolioDetailResult> {
  const { projects, isAvailable, error } = await getPublicPortfolio();

  if (!isAvailable) {
    return {
      project: null,
      isAvailable: false,
      error,
    };
  }

  const cleanSlug = slug.toLowerCase().trim();
  const project = projects.find((p) => p.slug.toLowerCase() === cleanSlug) || null;

  return {
    project,
    isAvailable: true,
  };
}
