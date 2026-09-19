import { MetadataRoute } from "next";
import { getPublicServices } from "@/lib/api/services";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { getPublicWebsiteSettings } from "@/lib/api/website";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { website } = await getPublicWebsiteSettings();
  const siteUrl = (
    website?.canonicalUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://knyklabs.com"
  ).replace(/\/+$/, "");

  // Core static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/portfolio`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [{ services }, { projects }] = await Promise.all([
      getPublicServices(),
      getPublicPortfolio(),
    ]);

    // Active service catalog detail routes
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    // Active client portfolio case study routes
    const portfolioRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes];
  } catch {
    // If NEXIS is temporarily unreachable during sitemap generation, static routes remain indexed
    return staticRoutes;
  }
}
