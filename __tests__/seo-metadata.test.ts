import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("Dynamic SEO Generation (Robots & Sitemap)", () => {
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

  it("generates standard indexing robots rules when robotsBehavior allows it", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/knyk/website")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: {
              canonicalUrl: "https://knyklabs.com",
              robotsBehavior: "index, follow",
            },
          }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
    });

    const result = await robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules?.allow).toBe("/");
    expect(rules?.disallow).toEqual(["/api/"]);
    expect(result.sitemap).toBe("https://knyklabs.com/sitemap.xml");
  });

  it("generates disallow robots rules when NEXIS sets noindex", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/knyk/website")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: {
              canonicalUrl: "https://staging.knyklabs.com",
              robotsBehavior: "noindex, nofollow",
            },
          }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
    });

    const result = await robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules?.disallow).toBe("/");
    expect(rules?.allow).toBeUndefined();
    expect(result.sitemap).toBe("https://staging.knyklabs.com/sitemap.xml");
  });

  it("generates dynamic sitemap with static, service, and portfolio URLs", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/knyk/website")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { canonicalUrl: "https://knyklabs.com" },
          }),
        });
      }
      if (url.includes("/api/v1/knyk/services")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: {
              services: [
                { id: "1", name: "Web App Dev", slug: "web-app-dev", displayOrder: 1 },
              ],
            },
          }),
        });
      }
      if (url.includes("/api/v1/knyk/portfolio")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: [
              { id: "1", title: "Project Omega", slug: "project-omega", displayOrder: 1 },
            ],
          }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
    });

    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://knyklabs.com");
    expect(urls).toContain("https://knyklabs.com/services");
    expect(urls).toContain("https://knyklabs.com/services/web-app-dev");
    expect(urls).toContain("https://knyklabs.com/portfolio");
    expect(urls).toContain("https://knyklabs.com/portfolio/project-omega");
    expect(urls).toContain("https://knyklabs.com/about");
    expect(urls).toContain("https://knyklabs.com/contact");
  });
});
