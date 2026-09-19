import { NextRequest, NextResponse } from "next/server";
import { submitPublicEnquiry, validateEnquiryInput } from "@/lib/api/enquiries";
import type { CreateKnykPublicEnquiryRequest } from "@/lib/types/knyk";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateKnykPublicEnquiryRequest;

    // 1. Server-side validation
    const validation = validateEnquiryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid enquiry submission.",
          validationErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 2. Forward to NEXIS backend
    const result = await submitPublicEnquiry({
      ...body,
      source: body.source || "knyk_website_contact_form",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: result.statusCode || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process enquiry at this time.",
      },
      { status: 500 }
    );
  }
}
