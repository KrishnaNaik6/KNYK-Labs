import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogResult } from "@/lib/nexis/client";
import { groupServicesByCategory } from "@/lib/nexis/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface ServicesSectionProps {
  catalog: CatalogResult;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ catalog }) => {
  // If catalog is unavailable or has no services, render graceful fallback
  if (!catalog.isAvailable || catalog.services.length === 0) {
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

          <ErrorState
            title="Unable to load our services right now"
            message="Our live catalog is currently syncing with the NEXIS control center. Please contact us directly and we'll help you find the right solution for your project."
          />
        </div>
      </section>
    );
  }

  const categoryGroups = groupServicesByCategory(catalog.services, catalog.categories);

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dynamic Service Catalog"
          title={
            <>
              Explore capabilities by{" "}
              <span className="text-gradient-cyan">domain</span>
            </>
          }
          description="Everything is dynamically synchronized with the NEXIS control center. Review transparent starting investments, deliverables, and estimated turnarounds."
        />

        {/* Category-grouped services */}
        <div className="space-y-16">
          {categoryGroups.map(({ category, services }) => (
            <div key={category.id || category.slug} className="space-y-6">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {category.name}
                    </h3>
                    <Badge variant="cyan" className="text-xs">
                      {services.length} {services.length === 1 ? "Service" : "Services"}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/services?category=${encodeURIComponent(category.id || category.slug)}`}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>Explore {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Service Cards Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id || service.slug} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global Catalog Footer CTA */}
        <div className="mt-16 text-center pt-8 border-t border-slate-800/60">
          <Button variant="secondary" size="lg" href="/services">
            <span>Browse Full Filterable Catalog</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
