"use client";

import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { createWhatsAppUrl, buildEmailLink } from "@/lib/utils/contact";
import { useContact } from "@/lib/context/ContactContext";
import type { KnykPublicContact } from "@/lib/nexis/types";
import { Button } from "./Button";
import { CallButton } from "./CallButton";

export interface ContactButtonsProps {
  serviceName?: string;
  contact?: KnykPublicContact | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  orientation?: "row" | "col";
  showLabels?: boolean;
}

export const ContactButtons: React.FC<ContactButtonsProps> = ({
  serviceName,
  contact: propContact,
  className = "",
  size = "md",
  orientation = "row",
  showLabels = true,
}) => {
  const context = useContact();
  const activeContact = propContact !== undefined ? propContact : context.contact;

  const whatsappUrl = createWhatsAppUrl({
    whatsappNumber: activeContact?.whatsappNumber,
    serviceName,
  });
  const targetEmail = activeContact?.email || activeContact?.salesEmail || activeContact?.supportEmail;
  const emailUrl = buildEmailLink(
    targetEmail,
    serviceName ? `Enquiry: ${serviceName}` : "New Project Enquiry"
  );

  const containerClasses =
    orientation === "row"
      ? `flex flex-wrap items-center gap-3 ${className}`
      : `flex flex-col gap-3 ${className}`;

  // If no contact methods are available at all, hide gracefully
  if (!whatsappUrl && !activeContact?.phone && !emailUrl) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {whatsappUrl && (
        <Button
          variant="whatsapp"
          size={size}
          href={whatsappUrl}
          isExternal
          aria-label="Contact on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          {showLabels && <span>WhatsApp</span>}
        </Button>
      )}

      {activeContact?.phone && (
        <CallButton phone={activeContact.phone} size={size} showLabel={showLabels} />
      )}

      {emailUrl && targetEmail && (
        <Button
          variant="secondary"
          size={size}
          href={emailUrl}
          aria-label={`Email ${targetEmail}`}
        >
          <Mail className="w-4 h-4 text-teal-400" />
          {showLabels && <span>Email</span>}
        </Button>
      )}
    </div>
  );
};
