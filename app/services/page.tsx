import { Metadata } from "next";
import { Suspense } from "react";
import { getPublicServices } from "@/lib/api/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 60;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: {
    absolute: "Software, AI & Digital Services | KNYK Labs",
  },
  description:
    "Explore KNYK Labs services including custom software development, web and mobile apps, AI solutions, automation, design, and digital services.",
  keywords: [
    "software development services",
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

        {!catalog.isAvailable || catalog.services.length === 0 ? (
          <div className="my-12">
            <ErrorState
              title="Unable to load our services right now"
              message="Our live catalog is currently syncing with the NEXIS control center. Please contact us directly and we'll help you find the right solution for your project."
            />
          </div>
        ) : (
          <div className="mb-20">
            <Suspense fallback={<ServiceGridSkeleton count={6} />}>
              <ServiceGrid
                services={catalog.services}
                categories={catalog.categories}
                showFilters={true}
              />
            </Suspense>
          </div>
        )}

        <CTASection />
      </div>
    </div>
  );
}
