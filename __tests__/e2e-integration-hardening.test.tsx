import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { nexisFetch } from "@/lib/api/nexis";
import { getPublicServiceBySlug, groupServicesByCategory } from "@/lib/api/services";
import { getPublicPortfolioProjectBySlug } from "@/lib/api/portfolio";
import { DirectContactCard } from "@/components/contact/DirectContactCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  KnykPublicContact,
  KnykPublicService,
  KnykPublicServiceCategory,
} from "@/lib/types/knyk";

describe("E2E Integration & Edge-Case Hardening", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, NEXIS_API_URL: "https://api.nexis.test" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("handles request timeout gracefully and returns HTTP 504", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    });

    const result = await nexisFetch("/api/v1/knyk/services", { timeoutMs: 100 });
    expect(result.isAvailable).toBe(false);
    expect(result.status).toBe(504);
    expect(result.error).toContain("timed out");
  });

  it("getPublicServiceBySlug finds matching service case-insensitively", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          services: [
            {
              id: "srv-1",
              name: "Full-Stack Web App",
              slug: "full-stack-web-app",
              startingPrice: 49999,
              currency: "INR",
              advancePercentage: 50,
              displayOrder: 1,
            },
          ],
        },
      }),
    } as Response);

    const match = await getPublicServiceBySlug("FULL-STACK-WEB-APP");
    expect(match.isAvailable).toBe(true);
    expect(match.service?.id).toBe("srv-1");
    expect(match.service?.name).toBe("Full-Stack Web App");

    const nonMatch = await getPublicServiceBySlug("non-existent-service");
    expect(nonMatch.isAvailable).toBe(true);
    expect(nonMatch.service).toBeNull();
  });

  it("getPublicPortfolioProjectBySlug finds project case-insensitively or returns null", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: [
          {
            id: "proj-1",
            title: "FinTech Platform",
            slug: "fintech-platform",
            category: "Web",
            summary: "Trading engine",
            tags: ["React"],
            technologies: ["Next.js"],
            displayOrder: 1,
          },
        ],
      }),
    } as Response);

    const match = await getPublicPortfolioProjectBySlug("fintech-platform");
    expect(match.isAvailable).toBe(true);
    expect(match.project?.id).toBe("proj-1");

    const missing = await getPublicPortfolioProjectBySlug("invalid-slug");
    expect(missing.isAvailable).toBe(true);
    expect(missing.project).toBeNull();
  });

  it("groupServicesByCategory clusters services into categories and creates fallbacks for unlisted ones", () => {
    const categories: KnykPublicServiceCategory[] = [
      { id: "cat-dev", name: "Development", slug: "development", displayOrder: 1 },
    ];
    const services: KnykPublicService[] = [
      {
        id: "srv-1",
        categoryId: "cat-dev",
        categoryName: "Development",
        categorySlug: "development",
        name: "Web App",
        slug: "web-app",
        shortDescription: "Web apps",
        description: null,
        startingPrice: 10000,
        currency: "INR",
        advancePercentage: 50,
        estimatedDelivery: "1 week",
        imageUrl: null,
        isFeatured: false,
        displayOrder: 1,
      },
      {
        id: "srv-2",
        categoryId: "cat-other",
        categoryName: "Other Domain",
        categorySlug: "other-domain",
        name: "Custom Task",
        slug: "custom-task",
        shortDescription: "Custom tasks",
        description: null,
        startingPrice: 5000,
        currency: "INR",
        advancePercentage: 30,
        estimatedDelivery: "3 days",
        imageUrl: null,
        isFeatured: false,
        displayOrder: 2,
      },
    ];

    const grouped = groupServicesByCategory(services, categories);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].category.name).toBe("Development");
    expect(grouped[0].services).toHaveLength(1);
    expect(grouped[1].category.name).toBe("Other Domain");
    expect(grouped[1].services).toHaveLength(1);
  });

  it("DirectContactCard renders correctly with real NEXIS payload having null hours and maps", () => {
    const liveNexisContact: KnykPublicContact = {
      businessName: "KNYK Labs",
      email: "kn670423@gmail.com",
      supportEmail: "kn670423@gmail.com",
      salesEmail: "kn670423@gmail.com",
      phone: "+919353640765",
      whatsappNumber: "+919353640765",
      address: {
        line: "145, 6th main, mathikere extension",
        city: "Banglore",
        state: "Karnataka",
        country: "India",
        postalCode: "560054",
      },
      businessHours: null,
      googleMapsUrl: null,
      websiteUrl: null,
      social: null,
    };

    render(<DirectContactCard contact={liveNexisContact} isAvailable={true} />);

    expect(screen.getByText("Reach KNYK Labs directly")).toBeDefined();
    expect(screen.getAllByText("+919353640765").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("kn670423@gmail.com")).toBeDefined();
    expect(screen.getByText(/mathikere extension/)).toBeDefined();
    expect(screen.getByText("Rapid Response Promise")).toBeDefined();
  });

  it("DirectContactCard renders graceful warning when contact is unavailable", () => {
    render(<DirectContactCard contact={null} isAvailable={false} />);
    expect(
      screen.getByText("Contact information temporarily unavailable")
    ).toBeDefined();
  });

  it("ErrorState renders error title and description without crashing", () => {
    render(
      <ErrorState
        title="Service Gateway Unavailable"
        message="Please check back shortly."
      />
    );
    expect(screen.getByText("Service Gateway Unavailable")).toBeDefined();
    expect(screen.getByText("Please check back shortly.")).toBeDefined();
  });

  it("EmptyState renders empty message and optional action", () => {
    render(
      <EmptyState
        title="No Results Found"
        message="Try adjusting your query parameters."
      />
    );
    expect(screen.getByText("No Results Found")).toBeDefined();
    expect(screen.getByText("Try adjusting your query parameters.")).toBeDefined();
  });
});
