"use client";

import React from "react";
import { Phone } from "lucide-react";
import { buildPhoneLink } from "@/lib/utils/contact";
import { useContact } from "@/lib/context/ContactContext";
import { Button } from "./Button";

export interface CallButtonProps {
  phone?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  showLabel?: boolean;
}

export const CallButton: React.FC<CallButtonProps> = ({
  phone,
  size = "md",
  className = "",
  variant = "secondary",
  showLabel = true,
}) => {
  const { contact } = useContact();
  const activePhone = phone !== undefined ? phone : contact?.phone;
  const phoneUrl = buildPhoneLink(activePhone);

  // If phone number is not configured, hide gracefully
  if (!phoneUrl || !activePhone) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      href={phoneUrl}
      className={className}
      aria-label={`Call KNYK Labs at ${activePhone}`}
    >
      <Phone className="w-4 h-4 text-cyan-400" />
      {showLabel && <span>{activePhone}</span>}
    </Button>
  );
};
