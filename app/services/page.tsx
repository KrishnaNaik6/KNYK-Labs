import { Metadata } from "next";
import { getKnykServiceCatalog } from "@/lib/nexis/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "Explore our complete digital services catalog across Software & Development, Graphic Design, Photo & Video, Presentations, AI & Automation, and Digital Services.",
};

export default async function ServicesPage() {
  const catalog = await getKnykServiceCatalog();

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Comprehensive Catalog"
          title={
            <>
              Explore our full range of{" "}
              <span className="text-gradient-cyan">digital solutions</span>
            </>
          }
          description="Browse our dynamic service offerings. Every engagement is backed by direct communication, transparent pricing, and structured milestone deliveries."
        />

        {!catalog.isAvailable || catalog.services.length === 0 ? (
          <div className="my-12">
            <ErrorState
              title="Catalog is temporarily offline"
              message="We are currently refreshing our service offerings from the NEXIS control center. Please contact us directly for an immediate tailored quote or consultation."
            />
          </div>
        ) : (
          <div className="mb-20">
            <ServiceGrid
              services={catalog.services}
              categories={catalog.categories}
              showFilters={true}
            />
          </div>
        )}

        <CTASection />
      </div>
    </div>
  );
}
