import React from "react";
import { MessageSquare } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils/contact";
import { Button } from "./Button";

export interface WhatsAppButtonProps {
  serviceName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  serviceName,
  size = "md",
  className = "",
  label = "Chat on WhatsApp",
}) => {
  const url = buildWhatsAppLink(serviceName);

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
