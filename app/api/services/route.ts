import { NextResponse } from "next/server";
import { getPublicServices } from "@/lib/api/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getPublicServices();

    if (!result.isAvailable || result.services.length === 0) {
      return NextResponse.json(
        {
          success: false,
          services: [],
          categories: [],
          isAvailable: false,
          error: result.error || "NEXIS services catalog is currently unavailable.",
        },
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        services: result.services,
        categories: result.categories,
        isAvailable: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      {
        success: false,
        services: [],
        categories: [],
        isAvailable: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
