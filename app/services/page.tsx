import { Metadata } from "next";
import { Suspense } from "react";
import { getPublicServices } from "@/lib/api/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LiveServicesCatalog } from "@/components/services/LiveServicesCatalog";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "Software, AI & Digital Services | KNYK Labs",
  },
  description:
    "Explore KNYK Labs services including custom software development, web and mobile apps, AI solutions, automation, design, and digital services.",
  keywords: [
    "freelance software development",
    "freelance web developer",
    "freelance software development services",
    "hire freelance engineers",
    "custom software development services",
    "web development",
    "mobile app development",
    "AI development",
    "AI automation",
    "custom software",
    "UI UX design",
    "digital services",
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Software, AI & Digital Services | KNYK Labs",
    description:
      "Explore KNYK Labs services including custom software development, web and mobile apps, AI solutions, automation, design, and digital services.",
    url: `${siteUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software, AI & Digital Services | KNYK Labs",
    description:
      "Explore KNYK Labs services including custom software development, web and mobile apps, AI solutions, automation, design, and digital services.",
  },
};

export default async function ServicesPage() {
  const catalog = await getPublicServices();

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
  ]);

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-screen">
      <JsonLd schema={breadcrumbJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Comprehensive Catalog"
          title={
            <>
              Software, AI &amp;{" "}
              <span className="text-gradient-cyan">Digital Services</span>
            </>
          }
          description="Browse our dynamic service offerings. Every engagement is backed by direct communication, transparent pricing, and structured milestone deliveries."
        />

        <Suspense fallback={<ServiceGridSkeleton count={6} />}>
          <LiveServicesCatalog initialCatalog={catalog} />
        </Suspense>

        <CTASection />
      </div>
    </div>
  );
}

