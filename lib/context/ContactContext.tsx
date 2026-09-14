"use client";

import React, { createContext, useContext } from "react";
import type { KnykPublicContact } from "@/lib/nexis/types";

export interface ContactContextValue {
  contact: KnykPublicContact | null;
  isAvailable: boolean;
}

const ContactContext = createContext<ContactContextValue>({
  contact: null,
  isAvailable: false,
});

export function ContactProvider({
  contact,
  isAvailable = true,
  children,
}: {
  contact: KnykPublicContact | null;
  isAvailable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ContactContext.Provider value={{ contact, isAvailable }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact(): ContactContextValue {
  return useContext(ContactContext);
}
