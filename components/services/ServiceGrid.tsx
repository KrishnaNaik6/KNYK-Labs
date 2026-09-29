"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Movable filter bar state
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag-to-scroll tracking
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const handleCategoryChange = (catId: string) => {
    if (isDragging) return;
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

  // Scroll smoothly by clicking arrow buttons
  const scrollTabs = (direction: "left" | "right") => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.65, 240);
    const delta = direction === "left" ? -scrollAmount : scrollAmount;
    if (typeof el.scrollBy === "function") {
      el.scrollBy({
        left: delta,
        behavior: "smooth",
      });
    } else {
      el.scrollLeft += delta;
    }
  };

  // Drag-to-scroll event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const el = tabsContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    el.scrollLeft = startScrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setTimeout(() => setIsDragging(false), 50);
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

  // Monitor scrollability on mount, resize & category updates
  useEffect(() => {
    checkScroll();
    const el = tabsContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, categoryTabs]);

  // Translate vertical wheel scroll to horizontal scroll when hovering tab bar
  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [categoryTabs]);

  // Auto-scroll selected tab into view
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeTab = tabsContainerRef.current.querySelector<HTMLElement>('[aria-selected="true"]');
    if (activeTab && typeof activeTab.scrollIntoView === "function") {
      activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedCategory]);

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
        (service.shortDescription ? service.shortDescription.toLowerCase().includes(query) : false) ||
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

          {/* Movable Category Tabs Strip with Left/Right Controls & Edge Fades */}
          {categoryTabs.length > 1 && (
            <div className="relative group/tabs flex items-center">
              {/* Left Arrow Button */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollTabs("left")}
                  aria-label="Scroll categories left"
                  className="absolute -left-2.5 sm:-left-3.5 z-20 p-1.5 sm:p-2 rounded-full bg-slate-900/95 border border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-slate-800 shadow-xl shadow-black/80 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Left edge fade gradient */}
              <div
                className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#060911] via-[#060911]/80 to-transparent z-10 transition-opacity duration-300 ${
                  canScrollLeft ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Scrollable & Draggable Tabs Strip */}
              <div
                ref={tabsContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none cursor-grab active:cursor-grabbing select-none scroll-smooth w-full"
                role="tablist"
              >
                {categoryTabs.map((tab) => {
                  const isSelected = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => handleCategoryChange(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
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

              {/* Right edge fade gradient */}
              <div
                className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#060911] via-[#060911]/80 to-transparent z-10 transition-opacity duration-300 ${
                  canScrollRight ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Right Arrow Button */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollTabs("right")}
                  aria-label="Scroll categories right"
                  className="absolute -right-2.5 sm:-right-3.5 z-20 p-1.5 sm:p-2 rounded-full bg-slate-900/95 border border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-slate-800 shadow-xl shadow-black/80 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
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
