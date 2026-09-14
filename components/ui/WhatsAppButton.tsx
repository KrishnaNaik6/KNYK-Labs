"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/utils/contact";
import { useContact } from "@/lib/context/ContactContext";
import { Button } from "./Button";

export interface WhatsAppButtonProps {
  serviceName?: string;
  whatsappNumber?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  serviceName,
  whatsappNumber,
  size = "md",
  className = "",
  label = "Chat on WhatsApp",
}) => {
  const { contact } = useContact();
  const activeNumber = whatsappNumber !== undefined ? whatsappNumber : contact?.whatsappNumber;
  const url = createWhatsAppUrl({ whatsappNumber: activeNumber, serviceName });

  // If WhatsApp number is missing, gracefully hide the CTA
  if (!url) {
    return null;
  }

  return (
    <Button
      variant="whatsapp"
      size={size}
      href={url}
      isExternal
      className={className}
      aria-label={`Contact KNYK Labs on WhatsApp${serviceName ? ` about ${serviceName}` : ""}`}
    >
      <MessageSquare className="w-4 h-4 fill-current" />
      <span>{label}</span>
    </Button>
  );
};
