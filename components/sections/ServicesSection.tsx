import React from "react";
import { ArrowRight } from "lucide-react";
import { CatalogResult } from "@/lib/nexis/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

export interface ServicesSectionProps {
  catalog: CatalogResult;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ catalog }) => {
  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dynamic Service Catalog"
          title={
            <>
              Tailored capabilities for{" "}
              <span className="text-gradient-cyan">every growth stage</span>
            </>
          }
          description="Directly managed through NEXIS. Transparent upfront pricing, clear delivery timelines, and full milestone accountability."
        />

        {/* Fallback state when NEXIS is offline */}
        {!catalog.isAvailable || catalog.services.length === 0 ? (
          <ErrorState
            title="Services are temporarily unavailable"
            message="Our live catalog is currently syncing with the NEXIS control center. Please contact us directly and our team will help you find the exact solution for your requirements."
          />
        ) : (
          <div className="space-y-12">
            {/* Grid of featured & prioritized services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.services.slice(0, 6).map((service) => (
                <ServiceCard key={service.id || service.slug} service={service} />
              ))}
            </div>

            {/* View Full Catalog CTA */}
            {catalog.services.length > 6 && (
              <div className="text-center pt-4">
                <Button variant="secondary" size="lg" href="/services">
                  <span>View All {catalog.services.length} Services</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
