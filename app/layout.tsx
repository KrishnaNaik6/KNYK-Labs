import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { ContactProvider } from "@/lib/context/ContactContext";
import { BrandingProvider } from "@/lib/context/BrandingContext";
import { WebsiteProvider } from "@/lib/context/WebsiteContext";
import { getPublicContact } from "@/lib/api/contact";
import { getPublicBranding } from "@/lib/api/branding";
import { getPublicWebsiteSettings } from "@/lib/api/website";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com";

export const viewport: Viewport = {
  themeColor: "#060911",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const [{ website }, { branding }] = await Promise.all([
    getPublicWebsiteSettings(),
    getPublicBranding(),
  ]);

  const siteUrl = website?.canonicalUrl || defaultSiteUrl;
  const title = website?.siteTitle || "KNYK Labs — Digital Solutions That Move You Forward";
  const description =
    website?.siteDescription ||
    "High-impact software engineering, visual branding, photo & video production, and custom AI automation studio engineered for ambitious businesses and creators.";
  const keywords = website?.keywords && website.keywords.length > 0
    ? website.keywords
    : [
        "KNYK Labs",
        "digital studio",
        "software development",
        "graphic design",
        "video production",
        "AI automation",
        "Next.js web development",
        "brand identity",
        "workflow automation",
      ];

  const ogTitle = website?.ogTitle || title;
  const ogDescription = website?.ogDescription || description;
  const ogImage = website?.ogImageUrl || branding?.socialPreview?.url || "/og-image.png";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | KNYK Labs",
    },
    description,
    keywords,
    authors: [{ name: "KNYK Labs", url: siteUrl }],
    creator: "KNYK Labs",
    icons: branding?.favicon?.url
      ? {
          icon: branding.favicon.url,
          apple: branding.brandMark?.url || branding.favicon.url,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: ogTitle,
      description: ogDescription,
      siteName: "KNYK Labs",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: website?.robotsBehavior
      ? {
          index: website.robotsBehavior.includes("index") && !website.robotsBehavior.includes("noindex"),
          follow: website.robotsBehavior.includes("follow") && !website.robotsBehavior.includes("nofollow"),
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    { contact, isAvailable: isContactAvailable },
    { branding, isAvailable: isBrandingAvailable },
    { website, isAvailable: isWebsiteAvailable },
  ] = await Promise.all([
    getPublicContact(),
    getPublicBranding(),
    getPublicWebsiteSettings(),
  ]);

  // Maintenance mode gatekeeper
  if (website?.maintenanceMode) {
    return (
      <html lang="en" className={`dark ${inter.variable}`}>
        <body className="bg-[#060911] text-slate-100 antialiased min-h-screen font-sans">
          <MaintenanceScreen contact={contact} branding={branding} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-[#060911] text-slate-100 antialiased min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <WebsiteProvider website={website} isAvailable={isWebsiteAvailable}>
          <ContactProvider contact={contact} isAvailable={isContactAvailable}>
            <BrandingProvider branding={branding} isAvailable={isBrandingAvailable}>
              <AnnouncementBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer contact={contact} />
            </BrandingProvider>
          </ContactProvider>
        </WebsiteProvider>
      </body>
    </html>
  );
}
