// ==============================================================================
// KNYK LABS — ENQUIRIES API CLIENT
// Endpoint: POST /api/v1/knyk/enquiries
// Cache Behavior: strictly no-store
// ==============================================================================

import { nexisFetch } from "./nexis";
import type {
  CreateKnykPublicEnquiryRequest,
  KnykPublicEnquiryResponse,
} from "@/lib/types/knyk";

export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
  statusCode?: number;
  error?: string;
}

/**
 * Validates enquiry input before dispatch.
 */
export function validateEnquiryInput(input: CreateKnykPublicEnquiryRequest): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.name || !input.name.trim()) {
    errors.name = "Please enter your name.";
  } else if (input.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!input.email || !input.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!input.message || !input.message.trim()) {
    errors.message = "Please describe your project requirements.";
  } else if (input.message.trim().length < 10) {
    errors.message = "Please provide at least 10 characters detailing your project.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submit an official project enquiry to NEXIS.
 * Strictly uncached (no-store).
 */
export async function submitPublicEnquiry(
  payload: CreateKnykPublicEnquiryRequest
): Promise<EnquirySubmissionResult> {
  const validation = validateEnquiryInput(payload);
  if (!validation.isValid) {
    return {
      success: false,
      message: "Please correct the highlighted form errors.",
      statusCode: 400,
      error: Object.values(validation.errors).join(" "),
    };
  }

  const result = await nexisFetch<KnykPublicEnquiryResponse>("/api/v1/knyk/enquiries", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || undefined,
      whatsapp: payload.whatsapp?.trim() || undefined,
      serviceId: payload.serviceId || undefined,
      budget: payload.budget || undefined,
      message: payload.message.trim(),
      source: payload.source || "knyk_public_website",
    }),
    revalidate: false, // forces cache: no-store
  });

  if (!result.isAvailable || !result.data) {
    // Check 429 rate-limiting
    if (result.status === 429) {
      return {
        success: false,
        message: "You've sent several enquiries recently. Please wait a few minutes before submitting again.",
        statusCode: 429,
        error: result.error,
      };
    }

    // Check 503 maintenance / unavailable
    if (result.status === 503) {
      return {
        success: false,
        message: "Our enquiry gateway is briefly undergoing scheduled maintenance. Please connect directly via WhatsApp or phone.",
        statusCode: 503,
        error: result.error,
      };
    }

    return {
      success: false,
      message: result.error || "Unable to submit your enquiry at this time. Please try again or reach out directly.",
      statusCode: result.status || 500,
      error: result.error,
    };
  }

  return {
    success: true,
    message: result.data.message || "Thank you! We have received your project enquiry and will be in touch shortly.",
    statusCode: 200,
  };
}
