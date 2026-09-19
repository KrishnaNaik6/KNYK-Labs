import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Service } from "@/lib/nexis/types";
import { formatCurrency, formatDelivery } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/Badge";

export interface ServiceCardProps {
  service: Service;
  priority?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const categoryName = service.category?.name || service.categoryName || "Digital Service";
  const formattedPrice = formatCurrency(service.startingPrice, service.currency);
  const formattedDelivery = formatDelivery(service.estimatedDelivery);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative group border border-slate-800/80 hover:border-cyan-500/40">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant="cyan" className="text-[11px]">
            {categoryName}
          </Badge>

          {service.isFeatured && (
            <Badge variant="featured" className="text-[11px] gap-1">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>Featured</span>
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors tracking-tight">
          <Link href={`/services/${service.slug}`} className="focus:outline-none">
            {service.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
          {service.shortDescription}
        </p>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
              Investment
            </span>
            <span className="font-semibold text-white text-sm">
              {formattedPrice}
            </span>
          </div>

          <div className="text-right">
            <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider">
              Turnaround
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-300 text-xs">
              <Clock className="w-3 h-3 text-teal-400" />
              {formattedDelivery}
            </span>
          </div>
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 text-sm font-medium text-slate-200 border border-slate-700/60 hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-cyan-300 transition-all group-hover:border-cyan-500/40"
          aria-label={`View details for ${service.name}`}
        >
          <span>View Service</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
