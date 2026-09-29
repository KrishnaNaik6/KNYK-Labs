import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LiveServicesRetryCard } from "@/components/services/LiveServicesRetryCard";
import { LiveServicesCatalog } from "@/components/services/LiveServicesCatalog";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import type { Service, Category } from "@/lib/nexis/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/services",
}));

const mockServices: Service[] = [
  {
    id: "srv-web",
    categoryId: "cat-dev",
    categoryName: "Software & Development",
    categorySlug: "software-development",
    name: "Website Development",
    slug: "website-development",
    shortDescription: "Custom modern websites.",
    description: "Full production stack.",
    startingPrice: 25000,
    currency: "INR",
    advancePercentage: 30,
    estimatedDelivery: "2 weeks",
    imageUrl: null,
    isFeatured: true,
    displayOrder: 1,
  },
];

const mockCategories: Category[] = [
  {
    id: "cat-dev",
    name: "Software & Development",
    slug: "software-development",
    description: "Web and software.",
    icon: null,
    displayOrder: 1,
  },
];

describe("Live Services Client-Side Auto-Retry System", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders LiveServicesRetryCard with attempt counter, countdown, and retry button", async () => {
    const onLoaded = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ success: false, services: [] }),
    });
    global.fetch = fetchMock;

    render(<LiveServicesRetryCard onLoaded={onLoaded} />);

    // Verify presence of title, attempt counter, countdown, and button
    expect(screen.getByText(/Connecting to Service Catalog/i)).toBeDefined();
    expect(screen.getByText(/Attempt #1/i)).toBeDefined();
    expect(screen.getByText(/Auto-retrying in/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Retry loading services/i })).toBeDefined();

    // Verify initial fetch was triggered
    expect(fetchMock).toHaveBeenCalledWith("/api/services", { cache: "no-store" });
  });

  it("increments attempt counter and triggers manual retry on button click", async () => {
    const onLoaded = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ success: false, services: [] }),
    });
    global.fetch = fetchMock;

    render(<LiveServicesRetryCard onLoaded={onLoaded} />);

    // Wait for initial fetch to finish so button is enabled
    await waitFor(() => {
      expect(screen.getByText(/Retry Now/i)).toBeDefined();
    });

    const retryButton = screen.getByRole("button", { name: /Retry loading services/i });
    expect(screen.getByText(/Attempt #1/i)).toBeDefined();

    // Click retry
    await act(async () => {
      fireEvent.click(retryButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Attempt #2/i)).toBeDefined();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("auto-retries and updates countdown timer every second", async () => {
    vi.useFakeTimers();
    try {
      const onLoaded = vi.fn();
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ success: false, services: [] }),
      });
      global.fetch = fetchMock;

      render(<LiveServicesRetryCard onLoaded={onLoaded} />);

      // Flush microtasks so initial fetch finishes and button enables
      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText(/Auto-retrying in 10s/i)).toBeDefined();

      // Advance 3 seconds
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText(/Auto-retrying in 7s/i)).toBeDefined();

      // Advance 7 seconds to trigger auto-retry
      act(() => {
        vi.advanceTimersByTime(7000);
      });

      expect(screen.getByText(/Attempt #2/i)).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("calls onLoaded when API responds with services", async () => {
    const onLoaded = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        services: mockServices,
        categories: mockCategories,
        isAvailable: true,
      }),
    });
    global.fetch = fetchMock;

    render(<LiveServicesRetryCard onLoaded={onLoaded} />);

    await waitFor(() => {
      expect(onLoaded).toHaveBeenCalledWith({
        services: mockServices,
        categories: mockCategories,
      });
    });
  });

  it("LiveServicesCatalog renders LiveServicesRetryCard when initialCatalog is empty and switches to ServiceGrid on load", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        services: mockServices,
        categories: mockCategories,
        isAvailable: true,
      }),
    });
    global.fetch = fetchMock;

    render(
      <LiveServicesCatalog
        initialCatalog={{
          services: [],
          categories: [],
          isAvailable: false,
        }}
      />
    );

    // Initial state: retry card
    expect(screen.getByText(/Connecting to Service Catalog/i)).toBeDefined();

    // Once fetched, ServiceGrid renders with the service name
    await waitFor(() => {
      expect(screen.getByText("Website Development")).toBeDefined();
    });
  });

  it("ServicesSection renders LiveServicesRetryCard when catalog is unavailable and switches on load", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        services: mockServices,
        categories: mockCategories,
        isAvailable: true,
      }),
    });
    global.fetch = fetchMock;

    render(
      <ServicesSection
        catalog={{
          services: [],
          categories: [],
          isAvailable: false,
        }}
      />
    );

    // Heading exists
    expect(screen.getByText(/Dynamic Service Catalog/i)).toBeDefined();
    // Retry card is shown instead of dead ErrorState
    expect(screen.getByText(/Connecting to Service Catalog/i)).toBeDefined();

    // Once fetched, the service card appears
    await waitFor(() => {
      expect(screen.getByText("Website Development")).toBeDefined();
    });
  });

  it("ServiceGrid renders movable category tabs strip with tablist role and grab cursor", () => {
    render(
      <ServiceGrid
        services={mockServices}
        categories={mockCategories}
        showFilters={true}
      />
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeDefined();
    expect(tablist.className).toContain("overflow-x-auto");
    expect(tablist.className).toContain("cursor-grab");

    // All Capabilities and Software & Development tabs exist
    expect(screen.getByRole("tab", { name: "All Capabilities" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Software & Development" })).toBeDefined();
  });
});
