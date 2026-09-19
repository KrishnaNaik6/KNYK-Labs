import { describe, it, expect } from "vitest";
import { validateEnquiryInput } from "@/lib/api/enquiries";

describe("Enquiry Form Validation", () => {
  it("rejects an empty name", () => {
    const result = validateEnquiryInput({
      name: "",
      email: "test@example.com",
      message: "This is a detailed project message for KNYK Labs scoping.",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Please enter your name.");
  });

  it("rejects an invalid email format", () => {
    const result = validateEnquiryInput({
      name: "Alice Engineer",
      email: "invalid-email-address",
      message: "This is a valid inquiry message about new services.",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Please enter a valid email address.");
  });

  it("rejects messages that are too short (< 10 characters)", () => {
    const result = validateEnquiryInput({
      name: "Bob Founder",
      email: "bob@startup.io",
      message: "Hi!",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.message).toBe("Please provide at least 10 characters detailing your project.");
  });

  it("accepts valid submissions with optional fields present", () => {
    const result = validateEnquiryInput({
      name: "Charlie Director",
      email: "charlie@enterprise.org",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      serviceId: "srv-cloud-arch",
      budget: "₹50,000 - ₹1,00,000",
      message: "We require end-to-end architecture and high-scale Next.js engineering.",
      source: "website_contact_form",
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("accepts valid submissions with minimum required fields", () => {
    const result = validateEnquiryInput({
      name: "Dana Developer",
      email: "dana@tech.co",
      message: "Hello KNYK team, please send us your service scope document.",
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
