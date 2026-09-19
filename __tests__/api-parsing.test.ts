import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPublicServices } from "@/lib/api/services";
import { getPublicContact } from "@/lib/api/contact";
import { getPublicBranding } from "@/lib/api/branding";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { getPublicTestimonials } from "@/lib/api/testimonials";
import { getPublicWebsiteSettings } from "@/lib/api/website";

describe("NEXIS Public API Parsing & Normalization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, NEXIS_API_URL: "https://api.nexis.test" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("parses services catalog with nested category.services and sorts by displayOrder", async () => {
    const mockPayload = {
      success: true,
      data: {
        categories: [
          {
            id: "cat-dev",
            name: "Software & Development",
            slug: "software-development",
            displayOrder: 1,
            services: [
              {
                id: "srv-web",
                name: "Full-Stack Web App",
                slug: "full-stack-web-app",
                shortDescription: "Modern React and Next.js applications",
                startingPrice: 45000,
                currency: "INR",
                advancePercentage: 50,
                estimatedDelivery: "2-3 weeks",
                isFeatured: true,
                displayOrder: 2,
              },
              {
                id: "srv-mvp",
                name: "Rapid MVP",
                slug: "rapid-mvp",
                shortDescription: "Build fast and validate ideas",
                startingPrice: 30000,
                currency: "INR",
                advancePercentage: 40,
                estimatedDelivery: "1-2 weeks",
                isFeatured: false,
                displayOrder: 1,
              },
            ],
          },
        ],
      },
      timestamp: "2026-09-19T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as Response);

    const result = await getPublicServices();
    expect(result.isAvailable).toBe(true);
    expect(result.services).toHaveLength(2);
    // Verified sorting by displayOrder (srv-mvp order 1 before srv-web order 2)
    expect(result.services[0].slug).toBe("rapid-mvp");
    expect(result.services[1].slug).toBe("full-stack-web-app");
    expect(result.services[0].categoryName).toBe("Software & Development");
  });

  it("handles missing optional service fields gracefully without crashing", async () => {
    const mockPayload = {
      success: true,
      data: {
        services: [
          {
            id: "srv-minimal",
            name: "Consulting",
            slug: "consulting",
            // missing shortDescription, description, startingPrice, imageUrl, etc.
          },
        ],
      },
      timestamp: "2026-09-19T00:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as Response);

    const result = await getPublicServices();
    expect(result.isAvailable).toBe(true);
    expect(result.services[0].name).toBe("Consulting");
    expect(result.services[0].shortDescription).toBeNull();
    expect(result.services[0].startingPrice).toBeNull();
    expect(result.services[0].advancePercentage).toBe(30); // fallback default
  });

  it("parses empty services catalog array safely", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { services: [], categories: [] } }),
    } as Response);

    const result = await getPublicServices();
    expect(result.isAvailable).toBe(true);
    expect(result.services).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it("parses contact and business details with fallback handling", async () => {
    const mockContact = {
      success: true,
      data: {
        businessName: "KNYK Labs",
        email: "hello@knyklabs.com",
        phone: "+91 99999 99999",
        address: {
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
        },
        social: {
          github: "https://github.com/knyk-labs",
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockContact,
    } as Response);

    const result = await getPublicContact();
    expect(result.isAvailable).toBe(true);
    expect(result.contact?.businessName).toBe("KNYK Labs");
    expect(result.contact?.email).toBe("hello@knyklabs.com");
    expect(result.contact?.address?.city).toBe("Bengaluru");
    expect(result.contact?.social?.github).toBe("https://github.com/knyk-labs");
  });

  it("parses branding assets including dark and light logos", async () => {
    const mockBranding = {
      success: true,
      data: {
        primaryLogo: { url: "https://cdn.test/logo.svg", alt: "KNYK Labs" },
        darkLogo: { url: "https://cdn.test/logo-dark.svg", alt: "KNYK Labs Dark" },
        brandMark: { url: "https://cdn.test/mark.svg", alt: "KNYK" },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockBranding,
    } as Response);

    const result = await getPublicBranding();
    expect(result.isAvailable).toBe(true);
    expect(result.branding?.primaryLogo?.url).toBe("https://cdn.test/logo.svg");
    expect(result.branding?.darkLogo?.url).toBe("https://cdn.test/logo-dark.svg");
  });

  it("parses portfolio projects and filters by displayOrder", async () => {
    const mockPortfolio = {
      success: true,
      data: [
        {
          title: "Project Alpha",
          slug: "project-alpha",
          category: "Web Application",
          summary: "Scalable SaaS platform",
          tags: ["Next.js", "TypeScript"],
          isFeatured: true,
          displayOrder: 2,
        },
        {
          title: "Project Beta",
          slug: "project-beta",
          category: "AI Agent",
          summary: "Automated workflow agent",
          tags: ["Python", "FastAPI"],
          isFeatured: true,
          displayOrder: 1,
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPortfolio,
    } as Response);

    const result = await getPublicPortfolio();
    expect(result.isAvailable).toBe(true);
    expect(result.projects).toHaveLength(2);
    expect(result.projects[0].slug).toBe("project-beta"); // lower displayOrder first
    expect(result.projects[1].slug).toBe("project-alpha");
  });

  it("parses testimonials correctly", async () => {
    const mockTestimonials = {
      success: true,
      data: [
        {
          name: "John Doe",
          role: "CTO",
          company: "Acme Corp",
          content: "KNYK Labs built our product on time and with zero defects.",
          rating: 5,
          isFeatured: true,
          displayOrder: 1,
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockTestimonials,
    } as Response);

    const result = await getPublicTestimonials();
    expect(result.isAvailable).toBe(true);
    expect(result.testimonials).toHaveLength(1);
    expect(result.testimonials[0].rating).toBe(5);
    expect(result.testimonials[0].name).toBe("John Doe");
  });

  it("parses website settings including maintenanceMode and announcementBanner", async () => {
    const mockSettings = {
      success: true,
      data: {
        siteTitle: "KNYK Labs — Digital Engineering",
        siteDescription: "Official public agency website",
        maintenanceMode: true,
        announcementBanner: "Scheduled upgrade in progress",
        announcementLink: "https://status.knyklabs.com",
        robotsBehavior: "noindex, nofollow",
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSettings,
    } as Response);

    const result = await getPublicWebsiteSettings();
    expect(result.isAvailable).toBe(true);
    expect(result.website?.maintenanceMode).toBe(true);
    expect(result.website?.announcementBanner).toBe("Scheduled upgrade in progress");
    expect(result.website?.robotsBehavior).toBe("noindex, nofollow");
  });
});
