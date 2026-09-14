import React from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { buildWhatsAppLink, buildPhoneLink, buildEmailLink, getContactConfig } from "@/lib/utils/contact";
import { Button } from "./Button";

export interface ContactButtonsProps {
  serviceName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  orientation?: "row" | "col";
  showLabels?: boolean;
}

export const ContactButtons: React.FC<ContactButtonsProps> = ({
  serviceName,
  className = "",
  size = "md",
  orientation = "row",
  showLabels = true,
}) => {
  const config = getContactConfig();
  const whatsappUrl = buildWhatsAppLink(serviceName);
  const phoneUrl = buildPhoneLink();
  const emailUrl = buildEmailLink(serviceName ? `Enquiry: ${serviceName}` : "New Project Enquiry");

  const containerClasses =
    orientation === "row"
      ? `flex flex-wrap items-center gap-3 ${className}`
      : `flex flex-col gap-3 ${className}`;

  return (
    <div className={containerClasses}>
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

      <Button
        variant="secondary"
        size={size}
        href={phoneUrl}
        aria-label={`Call ${config.phone}`}
      >
        <Phone className="w-4 h-4 text-cyan-400" />
        {showLabels && <span>Call Us</span>}
      </Button>

      <Button
        variant="secondary"
        size={size}
        href={emailUrl}
        aria-label={`Email ${config.email}`}
      >
        <Mail className="w-4 h-4 text-teal-400" />
        {showLabels && <span>Email</span>}
      </Button>
    </div>
  );
};
