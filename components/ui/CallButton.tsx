import React from "react";
import { Phone } from "lucide-react";
import { buildPhoneLink, getContactConfig } from "@/lib/utils/contact";
import { Button } from "./Button";

export interface CallButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  showLabel?: boolean;
}

export const CallButton: React.FC<CallButtonProps> = ({
  size = "md",
  className = "",
  variant = "secondary",
  showLabel = true,
}) => {
  const phoneUrl = buildPhoneLink();
  const config = getContactConfig();

  // If phone number is not configured, hide gracefully
  if (!phoneUrl) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      href={phoneUrl}
      className={className}
      aria-label={`Call KNYK Labs at ${config.phone}`}
    >
      <Phone className="w-4 h-4 text-cyan-400" />
      {showLabel && <span>{config.phone}</span>}
    </Button>
  );
};
