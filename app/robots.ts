import { MetadataRoute } from "next";
import { getPublicWebsiteSettings } from "@/lib/api/website";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { website } = await getPublicWebsiteSettings();
  const siteUrl = getSiteUrl(website?.canonicalUrl);

  const isNoIndex = Boolean(website?.robotsBehavior?.includes("noindex"));

  return {
    rules: [
      {
        userAgent: "*",
        allow: isNoIndex ? undefined : "/",
        disallow: isNoIndex ? "/" : ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
