import { MetadataRoute } from "next";
import { getPublicServices } from "@/lib/api/services";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { getPublicWebsiteSettings } from "@/lib/api/website";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { website } = await getPublicWebsiteSettings();
  const siteUrl = website?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com";

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
    const [{ services }, { projects }] = await Promise.all([
      getPublicServices(),
      getPublicPortfolio(),
    ]);

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes];
  } catch {
    // If NEXIS is unavailable during build, static routes will be indexed safely
    return staticRoutes;
  }
}
