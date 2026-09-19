import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

import { metadata as homeMetadata } from "@/app/page";
import { metadata as servicesMetadata } from "@/app/services/page";
import { generateMetadata as generateServiceMetadata } from "@/app/services/[slug]/page";
import { metadata as portfolioMetadata } from "@/app/portfolio/page";
import { generateMetadata as generatePortfolioMetadata } from "@/app/portfolio/[slug]/page";
import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { generateMetadata as generateRootMetadata } from "@/app/layout";
import {
  getOrganizationJsonLd,
  getWebSiteJsonLd,
  getServiceJsonLd,
  getCreativeWorkJsonLd,
  getBreadcrumbJsonLd,
  sanitizeJsonLd,
} from "@/lib/seo/structured-data";

describe("Advanced SEO & Metadata Audit", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXIS_API_URL: "https://api.nexis.test",
      NEXT_PUBLIC_SITE_URL: "https://knyklabs.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("Page Metadata Contracts", () => {
    it("Home page has exact expected title, description, and canonical", () => {
      expect(homeMetadata.title).toBe("KNYK Labs | Software, AI & Digital Solutions Company");
      expect(homeMetadata.description).toBe(
        "KNYK Labs builds custom software, modern websites, mobile applications, AI solutions, automation systems, and digital experiences for businesses."
      );
      expect((homeMetadata.alternates as Record<string, unknown>)?.canonical).toBe(
        "/"
      );
      expect((homeMetadata.openGraph as Record<string, unknown>)?.type).toBe("website");
      expect((homeMetadata.twitter as Record<string, unknown>)?.card).toBe("summary_large_image");
    });

    it("Services catalog page has exact expected title, description, and canonical", () => {
      const titleStr = typeof servicesMetadata.title === "object" && servicesMetadata.title !== null && "absolute" in servicesMetadata.title
        ? (servicesMetadata.title as { absolute: string }).absolute
        : servicesMetadata.title;
      expect(titleStr).toBe("Software, AI & Digital Services | KNYK Labs");
      expect(servicesMetadata.description).toBe(
        "Explore KNYK Labs services including custom software development, web and mobile apps, AI solutions, automation, design, and digital services."
      );
      expect((servicesMetadata.alternates as Record<string, unknown>)?.canonical).toBe(
        "/services"
      );
    });

    it("Dynamic Service Detail metadata generates service-specific title and canonical", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/v1/knyk/services")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                services: [
                  {
                    id: "srv-1",
                    name: "AI Automation Systems",
                    slug: "ai-automation-systems",
                    shortDescription: "Custom intelligent agents and automation pipelines.",
                    categoryName: "Generative AI",
                    estimatedDelivery: "2-4 weeks",
                    startingPrice: 50000,
                    currency: "INR",
                  },
                ],
              },
            }),
          });
        }
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
      });

      const meta = await generateServiceMetadata({
        params: Promise.resolve({ slug: "ai-automation-systems" }),
      });

      const titleStr = typeof meta.title === "object" && meta.title !== null && "absolute" in meta.title
        ? (meta.title as { absolute: string }).absolute
        : meta.title;

      expect(titleStr).toBe("AI Automation Systems | KNYK Labs");
      expect(meta.description).toContain("Custom intelligent agents and automation pipelines.");
      expect(meta.description).toContain("[Generative AI]");
      expect(meta.description).toContain("Estimated delivery: 2-4 weeks.");
      expect((meta.alternates as Record<string, unknown>)?.canonical).toBe(
        "/services/ai-automation-systems"
      );
      expect(meta.openGraph?.title).toBe("AI Automation Systems | KNYK Labs");
    });

    it("Portfolio page has exact expected title, description, and canonical", () => {
      const titleStr = typeof portfolioMetadata.title === "object" && portfolioMetadata.title !== null && "absolute" in portfolioMetadata.title
        ? (portfolioMetadata.title as { absolute: string }).absolute
        : portfolioMetadata.title;
      expect(titleStr).toBe(
        "Portfolio | Software, AI & Digital Projects | KNYK Labs"
      );
      expect(portfolioMetadata.description).toBe(
        "Explore software, AI, web, mobile, automation, and digital projects developed by KNYK Labs."
      );
      expect((portfolioMetadata.alternates as Record<string, unknown>)?.canonical).toBe(
        "/portfolio"
      );
    });

    it("Dynamic Portfolio Detail metadata generates project-specific title and canonical", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/v1/knyk/portfolio")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: [
                {
                  id: "proj-1",
                  title: "AURA Health Diagnostic Engine",
                  slug: "aura-health",
                  summary: "Clinical intelligence and triage workflow system.",
                  coverImageUrl: "https://cdn.example.com/cover.webp",
                },
              ],
            }),
          });
        }
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
      });

      const meta = await generatePortfolioMetadata({
        params: Promise.resolve({ slug: "aura-health" }),
      });

      const titleStr = typeof meta.title === "object" && meta.title !== null && "absolute" in meta.title
        ? (meta.title as { absolute: string }).absolute
        : meta.title;

      expect(titleStr).toBe("AURA Health Diagnostic Engine | KNYK Labs Portfolio");
      expect(meta.description).toBe("Clinical intelligence and triage workflow system.");
      expect((meta.alternates as Record<string, unknown>)?.canonical).toBe(
        "/portfolio/aura-health"
      );
    });

    it("About page has exact expected title, description, and canonical", () => {
      const titleStr = typeof aboutMetadata.title === "object" && aboutMetadata.title !== null && "absolute" in aboutMetadata.title
        ? (aboutMetadata.title as { absolute: string }).absolute
        : aboutMetadata.title;
      expect(titleStr).toBe("About KNYK Labs | Software & AI Solutions");
      expect(aboutMetadata.description).toBe(
        "Learn about KNYK Labs, our engineering approach, software development capabilities, AI solutions, automation, and digital product work."
      );
      expect((aboutMetadata.alternates as Record<string, unknown>)?.canonical).toBe(
        "/about"
      );
    });

    it("Contact page has exact expected title, description, and canonical", () => {
      const titleStr = typeof contactMetadata.title === "object" && contactMetadata.title !== null && "absolute" in contactMetadata.title
        ? (contactMetadata.title as { absolute: string }).absolute
        : contactMetadata.title;
      expect(titleStr).toBe("Contact KNYK Labs | Start Your Project");
      expect(contactMetadata.description).toBe(
        "Contact KNYK Labs for custom software development, web and mobile applications, AI solutions, automation, design, and digital services."
      );
      expect((contactMetadata.alternates as Record<string, unknown>)?.canonical).toBe(
        "/contact"
      );
    });
  });

  describe("Favicon & Browser Icon Fallbacks", () => {
    it("falls back to /icon and /apple-icon when NEXIS branding returns null assets", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/v1/knyk/branding")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                primaryLogo: null,
                brandMark: null,
                favicon: null,
              },
            }),
          });
        }
        if (url.includes("/api/v1/knyk/website")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: { siteTitle: "KNYK Labs" },
            }),
          });
        }
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
      });

      const rootMeta = await generateRootMetadata();
      const icons = rootMeta.icons as Record<string, unknown>;

      expect(icons).toBeDefined();
      const iconList = icons.icon as Array<{ url: string }>;
      expect(iconList[0].url).toBe("/icon");
      expect(iconList[1].url).toBe("/icon");
      expect(iconList[2].url).toBe("/icon.svg");

      const appleList = icons.apple as Array<{ url: string }>;
      expect(appleList[0].url).toBe("/apple-icon");
    });

    it("uses remote favicon and brandMark when provided by NEXIS", async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/api/v1/knyk/branding")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: {
                favicon: { url: "https://cdn.example.com/fav.png" },
                brandMark: { url: "https://cdn.example.com/mark.png" },
              },
            }),
          });
        }
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
      });

      const rootMeta = await generateRootMetadata();
      const icons = rootMeta.icons as Record<string, unknown>;
      const iconList = icons.icon as Array<{ url: string }>;

      expect(iconList[0].url).toBe("https://cdn.example.com/fav.png");
      expect(iconList[1].url).toBe("https://cdn.example.com/mark.png");
    });
  });

  describe("JSON-LD Structured Data", () => {
    it("generates valid Organization JSON-LD from NEXIS contact without fake data", () => {
      const schema = getOrganizationJsonLd(
        {
          businessName: "KNYK Labs",
          email: "contact@knyklabs.com",
          phone: "+919353640765",
          whatsappNumber: "919353640765",
          address: {
            line: "Koramangala",
            city: "Bengaluru",
            state: "Karnataka",
            country: "India",
            postalCode: "560034",
          },
          social: {
            linkedin: "https://linkedin.com/company/knyklabs",
            github: "https://github.com/knyklabs",
            instagram: null,
            facebook: null,
            youtube: null,
          },
        } as never,
        null,
        "https://knyklabs.com"
      );

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Organization");
      expect(schema.name).toBe("KNYK Labs");
      expect(schema.url).toBe("https://knyklabs.com");
      expect(schema.sameAs).toEqual([
        "https://linkedin.com/company/knyklabs",
        "https://github.com/knyklabs",
      ]);
      expect((schema.contactPoint as Record<string, unknown>).telephone).toBe("+919353640765");
      expect((schema.address as Record<string, unknown>).addressLocality).toBe("Bengaluru");
    });

    it("generates valid WebSite JSON-LD", () => {
      const schema = getWebSiteJsonLd("https://knyklabs.com", {
        siteDescription: "Custom software and AI systems.",
      } as never);

      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe("KNYK Labs");
      expect(schema.description).toBe("Custom software and AI systems.");
    });

    it("generates valid Service JSON-LD with pricing offer", () => {
      const schema = getServiceJsonLd(
        {
          id: "1",
          name: "Web Application Development",
          slug: "web-app-dev",
          categoryName: "Software Engineering",
          description: "Full-stack Next.js web application engineering.",
          startingPrice: 75000,
          currency: "INR",
        } as never,
        "https://knyklabs.com"
      );

      expect(schema["@type"]).toBe("Service");
      expect(schema.name).toBe("Web Application Development");
      expect(schema.serviceType).toBe("Software Engineering");
      expect((schema.offers as Record<string, unknown>)?.price).toBe(75000);
      expect((schema.offers as Record<string, unknown>)?.priceCurrency).toBe("INR");
    });

    it("generates valid CreativeWork JSON-LD for portfolio projects", () => {
      const schema = getCreativeWorkJsonLd(
        {
          id: "proj-1",
          title: "AURA Health Diagnostic Engine",
          slug: "aura-health",
          summary: "Clinical intelligence and triage workflow system.",
          coverImageUrl: "https://cdn.example.com/cover.webp",
          technologies: ["Next.js", "Python", "FastAPI"],
        } as never,
        "https://knyklabs.com"
      );

      expect(schema["@type"]).toBe("CreativeWork");
      expect(schema.name).toBe("AURA Health Diagnostic Engine");
      expect(schema.image).toBe("https://cdn.example.com/cover.webp");
      expect(schema.keywords).toBe("Next.js, Python, FastAPI");
    });

    it("generates valid BreadcrumbList JSON-LD", () => {
      const schema = getBreadcrumbJsonLd([
        { name: "Home", url: "https://knyklabs.com" },
        { name: "Services", url: "https://knyklabs.com/services" },
        { name: "Web App Dev", url: "https://knyklabs.com/services/web-app-dev" },
      ]);

      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[1].name).toBe("Services");
      expect(schema.itemListElement[1].position).toBe(2);
    });

    it("sanitizes JSON-LD script string against XSS injection", () => {
      const malicious = {
        name: "Test </script><script>alert('xss')</script>",
      };
      const sanitized = sanitizeJsonLd(malicious);
      expect(sanitized).not.toContain("</script>");
      expect(sanitized).toContain("\\u003c/script>");
    });
  });
});
