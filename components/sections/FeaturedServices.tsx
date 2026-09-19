import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import { Service } from "@/lib/nexis/types";
import { formatCurrency, formatDelivery } from "@/lib/utils/currency";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export interface FeaturedServicesProps {
  featuredServices: Service[];
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ featuredServices }) => {
  // If there are no featured services, gracefully hide the section as specified
  if (!featuredServices || featuredServices.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Flagship Capabilities"
          title={
            <>
              Featured{" "}
              <span className="text-gradient-cyan">Solutions</span>
            </>
          }
          description="High-priority digital services tailored for rapid deployment, production scale, and immediate business impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredServices.map((service) => {
            const categoryName = service.category?.name || service.categoryName || "Digital Service";
            const formattedPrice = formatCurrency(service.startingPrice, service.currency);
            const formattedDelivery = formatDelivery(service.estimatedDelivery);

            return (
              <div
                key={service.id || service.slug}
                className="glass-panel glass-panel-hover rounded-3xl p-7 border border-cyan-500/30 shadow-xl shadow-cyan-950/20 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant="cyan" className="text-[11px]">
                      {categoryName}
                    </Badge>
                    <Badge variant="featured" className="text-[11px] gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      <span>Featured</span>
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors tracking-tight">
                    <Link href={`/services/${service.slug}`} className="focus:outline-none">
                      {service.name}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                        Investment
                      </span>
                      <span className="font-bold text-white text-base">
                        {formattedPrice}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                        Delivery
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-300 text-xs">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {formattedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/25 hover:bg-cyan-400 transition-all"
                      aria-label={`View details for ${service.name}`}
                    >
                      <span>View Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <WhatsAppButton
                      serviceName={service.name}
                      size="sm"
                      label="Chat"
                      className="text-xs px-3 py-2.5"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
