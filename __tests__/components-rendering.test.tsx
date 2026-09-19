import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { WebsiteProvider } from "@/lib/context/WebsiteContext";
import type {
  KnykPublicService,
  KnykPublicPortfolioProject,
  KnykPublicTestimonial,
  KnykPublicContact,
  KnykPublicWebsiteSettings,
} from "@/lib/types/knyk";

describe("Component Behavioral Rendering & Resilience", () => {
  it("renders ServiceCard with formatted price and category name", () => {
    const service: KnykPublicService = {
      id: "srv-ai",
      categoryId: "cat-ai",
      categoryName: "Artificial Intelligence",
      name: "Custom AI Agent System",
      slug: "custom-ai-agent-system",
      shortDescription: "Autonomous LLM workflows and multi-agent coordination.",
      description: "Full production architecture for agentic systems.",
      startingPrice: 75000,
      currency: "INR",
      advancePercentage: 50,
      estimatedDelivery: "3 weeks",
      imageUrl: null,
      isFeatured: true,
      displayOrder: 1,
    };

    render(<ServiceCard service={service} />);

    expect(screen.getByText("Custom AI Agent System")).toBeDefined();
    expect(screen.getByText("Artificial Intelligence")).toBeDefined();
    expect(
      screen.getByText("Autonomous LLM workflows and multi-agent coordination.")
    ).toBeDefined();
    expect(screen.getByText(/75,000/)).toBeDefined();
    expect(screen.getByText("3 weeks")).toBeDefined();
    expect(screen.getByText("Featured")).toBeDefined();
  });

  it("renders ServiceCard gracefully when startingPrice and estimatedDelivery are missing/null", () => {
    const minimalService: KnykPublicService = {
      id: "srv-custom",
      categoryId: "cat-consult",
      name: "Custom Architecture Review",
      slug: "custom-architecture-review",
      shortDescription: "Advisory and architecture audit.",
      description: null,
      startingPrice: null,
      currency: "INR",
      advancePercentage: 0,
      estimatedDelivery: null,
      imageUrl: null,
      isFeatured: false,
      displayOrder: 1,
    };

    render(<ServiceCard service={minimalService} />);

    expect(screen.getByText("Custom Architecture Review")).toBeDefined();
    expect(screen.getByText("Custom Quote")).toBeDefined();
    expect(screen.getByText("Timeline on consultation")).toBeDefined();
  });

  it("FeaturedServices renders nothing if passed empty array", () => {
    const { container } = render(<FeaturedServices featuredServices={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("FeaturedWork renders dynamic portfolio projects correctly", () => {
    const projects: KnykPublicPortfolioProject[] = [
      {
        id: "proj-1",
        title: "Enterprise FinTech Platform",
        slug: "enterprise-fintech-platform",
        category: "Full-Stack Development",
        summary: "Ultra-low-latency financial dashboard for trading operations.",
        technologies: ["React", "TypeScript", "WebSocket"],
        tags: ["Fintech", "Enterprise"],
        galleryUrls: [],
        coverImageUrl: null,
        isFeatured: true,
        displayOrder: 1,
      },
    ];

    render(<FeaturedWork projects={projects} />);

    expect(screen.getByText("Enterprise FinTech Platform")).toBeDefined();
    expect(screen.getByText("Full-Stack Development")).toBeDefined();
    expect(
      screen.getByText("Ultra-low-latency financial dashboard for trading operations.")
    ).toBeDefined();
    expect(screen.getByText("WebSocket")).toBeDefined();
  });

  it("FeaturedWork renders agency capability highlights when no dynamic projects are passed", () => {
    render(<FeaturedWork projects={[]} />);
    expect(
      screen.getByText("Next.js High-Performance Web Applications")
    ).toBeDefined();
  });

  it("TestimonialsSection renders quotes, author role, and company", () => {
    const testimonials: KnykPublicTestimonial[] = [
      {
        id: "test-1",
        name: "Sarah Lin",
        role: "VP of Product",
        company: "VentureScale Inc.",
        content:
          "KNYK Labs delivered our core web application two weeks ahead of schedule with flawless code quality.",
        rating: 5,
        isFeatured: true,
        displayOrder: 1,
      },
    ];

    render(<TestimonialsSection testimonials={testimonials} />);

    expect(screen.getByText("Sarah Lin")).toBeDefined();
    expect(screen.getByText(/VP of Product/)).toBeDefined();
    expect(screen.getByText(/VentureScale Inc\./)).toBeDefined();
    expect(
      screen.getByText(
        /KNYK Labs delivered our core web application two weeks ahead of schedule/i
      )
    ).toBeDefined();
  });

  it("TestimonialsSection gracefully handles empty testimonials array", () => {
    const { container } = render(<TestimonialsSection testimonials={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("MaintenanceScreen renders professional high-tech maintenance page", () => {
    const contact: KnykPublicContact = {
      businessName: "KNYK Labs",
      email: "hello@knyklabs.com",
      phone: "+91 99999 99999",
      whatsappNumber: "+91 99999 99999",
    };

    render(<MaintenanceScreen contact={contact} />);

    expect(screen.getByText("System Upgrades in Progress")).toBeDefined();
    expect(
      screen.getByText(/scheduled platform maintenance to deploy high-performance updates/i)
    ).toBeDefined();
    expect(screen.getByText("WhatsApp Direct")).toBeDefined();
    expect(screen.getByText("Email")).toBeDefined();
  });

  it("AnnouncementBanner renders banner with clickable link if link is provided", () => {
    const mockWebsite: KnykPublicWebsiteSettings = {
      siteTitle: "KNYK Labs",
      siteDescription: "Digital Agency",
      keywords: ["Agency"],
      robotsBehavior: "index, follow",
      announcementBanner: "New AI development services now available.",
      announcementLink: "/services",
      maintenanceMode: false,
    };

    render(
      <WebsiteProvider website={mockWebsite}>
        <AnnouncementBanner />
      </WebsiteProvider>
    );

    expect(
      screen.getByText("New AI development services now available.")
    ).toBeDefined();
    const linkElement = screen.getByRole("link");
    expect(linkElement.getAttribute("href")).toBe("/services");
  });

  it("AnnouncementBanner does not render when banner is null or not provided", () => {
    const { container } = render(
      <WebsiteProvider website={null}>
        <AnnouncementBanner />
      </WebsiteProvider>
    );
    expect(container.firstChild).toBeNull();
  });
});
