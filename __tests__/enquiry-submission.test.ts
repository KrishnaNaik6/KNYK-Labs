import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitPublicEnquiry } from "@/lib/api/enquiries";

describe("Enquiry Submission & HTTP Error Protections", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, NEXIS_API_URL: "https://api.nexis.test" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("submits enquiry successfully and verifies no-store cache policy", async () => {
    let capturedHeaders: HeadersInit | undefined;
    let capturedCache: RequestCache | undefined;

    global.fetch = vi.fn().mockImplementation((url, options) => {
      capturedHeaders = options?.headers;
      capturedCache = options?.cache;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            message: "Thank you for reaching out. Our team will contact you shortly.",
          },
          timestamp: "2026-09-19T12:00:00Z",
        }),
      } as Response);
    });

    const response = await submitPublicEnquiry({
      name: "Acme Lead",
      email: "lead@acme.com",
      message: "We need full-stack design and development support.",
    });

    expect(response.success).toBe(true);
    expect(response.message).toBe(
      "Thank you for reaching out. Our team will contact you shortly."
    );
    expect(capturedCache).toBe("no-store");
    expect(capturedHeaders).toBeDefined();
  });

  it("handles 429 Too Many Requests rate limiting gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
      json: async () => ({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many enquiries submitted from this IP. Please try again later.",
        },
      }),
    } as Response);

    const response = await submitPublicEnquiry({
      name: "Rapid Submitter",
      email: "fast@spam.com",
      message: "Repeated rapid test message submission.",
    });

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(429);
    expect(response.message).toContain("You've sent several enquiries recently");
  });

  it("handles 503 Service Unavailable gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => ({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "NEXIS CRM is temporarily undergoing maintenance.",
        },
      }),
    } as Response);

    const response = await submitPublicEnquiry({
      name: "Prospective Client",
      email: "client@enterprise.com",
      message: "Inquiry during backend maintenance window.",
    });

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(503);
    expect(response.message).toContain("undergoing scheduled maintenance");
  });

  it("handles network timeout or offline state gracefully", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network connection failed"));

    const response = await submitPublicEnquiry({
      name: "Offline User",
      email: "offline@user.net",
      message: "Message attempting transmission during disconnect.",
    });

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toContain("Network connection failed");
  });

  it("returns error without network call if validation fails", async () => {
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;

    const response = await submitPublicEnquiry({
      name: "",
      email: "not-an-email",
      message: "Short",
    });

    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
