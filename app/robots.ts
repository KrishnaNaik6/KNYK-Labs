import { MetadataRoute } from "next";
import { getPublicWebsiteSettings } from "@/lib/api/website";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { website } = await getPublicWebsiteSettings();
  const siteUrl =
    website?.canonicalUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://knyklabs.com";

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
