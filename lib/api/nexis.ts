// ==============================================================================
// KNYK LABS — CORE NEXIS API CLIENT
// Description: Centralized HTTP transport with timeout protection, rate-limiting
//              resilience (429), graceful 503 handling, and cache control.
// ==============================================================================

import type { KnykApiResponse, KnykApiErrorResponse } from "@/lib/types/knyk";

export class NexisApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "NexisApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface NexisFetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 6000;

/**
 * Returns the sanitized base URL for NEXIS API.
 */
export function getNexisApiBaseUrl(): string {
  const url = process.env.NEXIS_API_URL?.trim();
  if (!url) {
    // If not configured in production, we still return empty to let caller handle graceful fallbacks
    return "";
  }
  return url.replace(/\/+$/, "");
}

/**
 * Core centralized request runner for NEXIS endpoints.
 */
export async function nexisFetch<T>(
  path: string,
  options: NexisFetchOptions = {}
): Promise<{ data: T | null; isAvailable: boolean; error?: string; status?: number }> {
  const baseUrl = getNexisApiBaseUrl();

  if (!baseUrl) {
    return {
      data: null,
      isAvailable: false,
      error: "NEXIS_API_URL is not configured.",
    };
  }

  const endpoint = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const fetchInit: RequestInit = {
    ...options,
    headers,
    signal: controller.signal,
  };

  // Next.js caching controls
  if (options.method === "POST") {
    fetchInit.cache = "no-store";
  } else if (typeof options.revalidate === "number") {
    (fetchInit as { next?: { revalidate?: number; tags?: string[] } }).next = {
      revalidate: options.revalidate,
      tags: options.tags,
    };
  } else if (options.revalidate === false) {
    fetchInit.cache = "no-store";
  }

  try {
    const response = await fetch(endpoint, fetchInit);
    clearTimeout(timeoutId);

    // 1. Rate Limit handling (429)
    if (response.status === 429) {
      return {
        data: null,
        isAvailable: false,
        status: 429,
        error: "Rate limit exceeded. Please wait a moment before trying again.",
      };
    }

    // 2. Service Unavailable handling (503)
    if (response.status === 503) {
      return {
        data: null,
        isAvailable: false,
        status: 503,
        error: "NEXIS service is temporarily unavailable. Please try again shortly.",
      };
    }

    // 3. Parse JSON body
    let json: KnykApiResponse<T> | KnykApiErrorResponse | unknown;
    try {
      json = await response.json();
    } catch {
      return {
        data: null,
        isAvailable: false,
        status: response.status,
        error: `NEXIS returned non-JSON response (HTTP ${response.status}).`,
      };
    }

    // 4. Check for HTTP errors or payload errors
    if (!response.ok) {
      const errorPayload = json as KnykApiErrorResponse;
      const errorMsg =
        errorPayload?.error?.message ||
        `NEXIS API returned HTTP ${response.status}`;
      return {
        data: null,
        isAvailable: false,
        status: response.status,
        error: errorMsg,
      };
    }

    const successPayload = json as KnykApiResponse<T>;
    // Check standard envelope { success: true, data: T }
    if (successPayload && typeof successPayload === "object" && "data" in successPayload) {
      return {
        data: successPayload.data,
        isAvailable: true,
        status: response.status,
      };
    }

    // Direct object fallback
    return {
      data: json as T,
      isAvailable: true,
      status: response.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      return {
        data: null,
        isAvailable: false,
        status: 504,
        error: `Request to NEXIS timed out after ${timeoutMs}ms.`,
      };
    }

    const message = err instanceof Error ? err.message : "Failed to communicate with NEXIS API.";
    return {
      data: null,
      isAvailable: false,
      error: message,
    };
  }
}
