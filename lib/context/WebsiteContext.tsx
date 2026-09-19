"use client";

import React, { createContext, useContext } from "react";
import type { KnykPublicWebsiteSettings } from "@/lib/types/knyk";

export interface WebsiteContextValue {
  website: KnykPublicWebsiteSettings | null;
  isAvailable: boolean;
}

const WebsiteContext = createContext<WebsiteContextValue>({
  website: null,
  isAvailable: false,
});

export function WebsiteProvider({
  website,
  isAvailable = true,
  children,
}: {
  website: KnykPublicWebsiteSettings | null;
  isAvailable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <WebsiteContext.Provider value={{ website, isAvailable }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite(): WebsiteContextValue {
  return useContext(WebsiteContext);
}
