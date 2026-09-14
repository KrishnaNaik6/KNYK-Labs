"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Service, Category } from "@/lib/nexis/types";
import { ServiceCard } from "./ServiceCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ServiceGridProps {
  services: Service[];
  categories?: Category[];
  initialCategory?: string;
  showFilters?: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  categories = [],
  initialCategory = "all",
  showFilters = true,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCategory = searchParams.get("category");
  const [localCategory, setLocalCategory] = useState<string>(initialCategory);
  const selectedCategory = urlCategory || localCategory;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCategoryChange = (catId: string) => {
    setLocalCategory(catId);
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    const queryStr = params.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
  };

  // Extract unique category tabs
  const categoryTabs = useMemo(() => {
    const tabs = [{ id: "all", name: "All Capabilities" }];

    if (categories.length > 0) {
      categories.forEach((cat) => {
        tabs.push({ id: cat.id || cat.slug, name: cat.name });
      });
    } else {
      const seen = new Set<string>();
      services.forEach((s) => {
        const catName = s.category?.name || s.categoryId;
        const catId = s.category?.id || s.category?.slug || s.categoryId;
        if (catId && !seen.has(catId)) {
          seen.add(catId);
          tabs.push({ id: catId, name: catName || catId });
        }
      });
    }
    return tabs;
  }, [categories, services]);

  // Filter services by category & search query
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category match
      const categoryId = service.category?.id || service.category?.slug || service.categoryId;
      const matchesCategory =
        selectedCategory === "all" ||
        categoryId === selectedCategory ||
        service.category?.slug === selectedCategory ||
        service.categoryId === selectedCategory;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        service.name.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        (service.category?.name && service.category.name.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, technologies, or deliverables..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                aria-label="Search services"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-xs text-slate-400 flex items-center gap-1.5 self-end md:self-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Showing <strong>{filteredServices.length}</strong> of{" "}
                <strong>{services.length}</strong> services
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          {categoryTabs.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
              {categoryTabs.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25"
                        : "bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id || service.slug} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services match your criteria"
          message={
            searchQuery
              ? `No services found matching "${searchQuery}". Try adjusting your filters or search terms.`
              : "No services are currently listed in this category."
          }
        />
      )}
    </div>
  );
};
