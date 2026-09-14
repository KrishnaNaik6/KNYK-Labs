"use client";

import React, { createContext, useContext } from "react";
import type { KnykPublicBranding } from "@/lib/nexis/types";

export interface BrandingContextValue {
  branding: KnykPublicBranding | null;
  isAvailable: boolean;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: null,
  isAvailable: false,
});

export function BrandingProvider({
  branding,
  isAvailable = true,
  children,
}: {
  branding: KnykPublicBranding | null;
  isAvailable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <BrandingContext.Provider value={{ branding, isAvailable }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): BrandingContextValue {
  return useContext(BrandingContext);
}
