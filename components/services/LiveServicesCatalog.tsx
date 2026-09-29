"use client";

import React, { useState } from "react";
import { CatalogResult } from "@/lib/nexis/client";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { LiveServicesRetryCard } from "@/components/services/LiveServicesRetryCard";

export interface LiveServicesCatalogProps {
  initialCatalog: CatalogResult;
}

export const LiveServicesCatalog: React.FC<LiveServicesCatalogProps> = ({
  initialCatalog,
}) => {
  const [catalog, setCatalog] = useState<CatalogResult>(initialCatalog);

  const isReady = Boolean(catalog.isAvailable && catalog.services && catalog.services.length > 0);

  if (!isReady) {
    return (
      <div className="my-8">
        <LiveServicesRetryCard
          onLoaded={(loadedCatalog) => {
            setCatalog({
              services: loadedCatalog.services,
              categories: loadedCatalog.categories,
              isAvailable: true,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="mb-20 transition-opacity duration-500">
      <ServiceGrid
        services={catalog.services}
        categories={catalog.categories}
        showFilters={true}
      />
    </div>
  );
};
