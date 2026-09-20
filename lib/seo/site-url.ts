/**
 * Resolves the canonical public site URL for sitemaps, robots.txt, canonical links, and metadataBase.
 *
 * Priority:
 * 1. process.env.NEXT_PUBLIC_SITE_URL (Explicit deployment host, e.g. https://knyk-labs.vercel.app)
 * 2. Vercel deployment URL (process.env.VERCEL_PROJECT_PRODUCTION_URL or process.env.VERCEL_URL)
 * 3. Remote CMS canonicalUrl (if provided by NEXIS and not overridden by deployment)
 * 4. Fallback default (https://knyk-labs.vercel.app)
 */
export function getSiteUrl(websiteCanonicalUrl?: string | null): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProdUrl) {
    return `https://${vercelProdUrl.replace(/\/+$/, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, "")}`;
  }

  if (websiteCanonicalUrl?.trim()) {
    return websiteCanonicalUrl.trim().replace(/\/+$/, "");
  }

  return "https://knyk-labs.vercel.app";
}
