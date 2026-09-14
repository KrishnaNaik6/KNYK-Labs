import { MetadataRoute } from "next";
import { getKnykServiceCatalog } from "@/lib/nexis/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const catalog = await getKnykServiceCatalog();
    if (catalog.isAvailable && catalog.services.length > 0) {
      const serviceRoutes: MetadataRoute.Sitemap = catalog.services.map((service) => ({
        url: `${siteUrl}/services/${service.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      }));
      return [...staticRoutes, ...serviceRoutes];
    }
  } catch {
    // If NEXIS is unavailable during sitemap generation, static routes will be indexed safely
  }

  return staticRoutes;
}
