// ==============================================================================
// KNYK LABS — TESTIMONIALS API CLIENT
// Endpoint: GET /api/v1/knyk/testimonials
// Cache Behavior: 5 minute browser / 30 minute CDN
// ==============================================================================

import { nexisFetch } from "./nexis";
import type { KnykPublicTestimonial } from "@/lib/types/knyk";

export interface TestimonialsResult {
  testimonials: KnykPublicTestimonial[];
  isAvailable: boolean;
  error?: string;
}

function normalizeTestimonials(raw: unknown): KnykPublicTestimonial[] {
  if (!raw) return [];

  const data = raw as Record<string, unknown>;
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.testimonials)
    ? data.testimonials
    : [];

  return list
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((t) => ({
      id: String(t.id || ""),
      name: String(t.name || "Anonymous"),
      role: String(t.role || "Client"),
      company: String(t.company || ""),
      content: String(t.content || ""),
      avatarUrl: t.avatarUrl ? String(t.avatarUrl) : (t.avatar_url ? String(t.avatar_url) : null),
      rating: typeof t.rating === "number" ? t.rating : null,
      isFeatured: Boolean(t.isFeatured ?? t.is_featured ?? false),
      displayOrder: Number(t.displayOrder ?? t.display_order ?? 0),
    }))
    .filter((t) => t.content.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Fetch verified testimonials dynamically from NEXIS.
 */
export async function getPublicTestimonials(): Promise<TestimonialsResult> {
  const result = await nexisFetch<KnykPublicTestimonial[]>("/api/v1/knyk/testimonials", {
    revalidate: 300, // 5 minutes
  });

  if (!result.isAvailable || !result.data) {
    return {
      testimonials: [],
      isAvailable: false,
      error: result.error || "Testimonials are temporarily unavailable.",
    };
  }

  const testimonials = normalizeTestimonials(result.data);

  return {
    testimonials,
    isAvailable: true,
  };
}
