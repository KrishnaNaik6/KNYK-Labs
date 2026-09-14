import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { createWhatsAppUrl, buildEmailLink, getContactConfig } from "@/lib/utils/contact";
import { Button } from "./Button";
import { CallButton } from "./CallButton";

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
  const whatsappUrl = createWhatsAppUrl({ serviceName });
  const emailUrl = buildEmailLink(serviceName ? `Enquiry: ${serviceName}` : "New Project Enquiry");

  const containerClasses =
    orientation === "row"
      ? `flex flex-wrap items-center gap-3 ${className}`
      : `flex flex-col gap-3 ${className}`;

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

      <CallButton size={size} showLabel={showLabels} />

      {emailUrl && (
        <Button
          variant="secondary"
          size={size}
          href={emailUrl}
          aria-label={`Email ${config.email}`}
        >
          <Mail className="w-4 h-4 text-teal-400" />
          {showLabels && <span>Email</span>}
        </Button>
      )}
    </div>
  );
};
