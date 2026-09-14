"use client";

import React from "react";
import { Mail } from "lucide-react";
import { buildEmailLink } from "@/lib/utils/contact";
import { useContact } from "@/lib/context/ContactContext";
import { Button } from "./Button";

export interface EmailButtonProps {
  email?: string | null;
  subject?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  showLabel?: boolean;
  label?: string;
}

export const EmailButton: React.FC<EmailButtonProps> = ({
  email,
  subject,
  size = "md",
  className = "",
  variant = "secondary",
  showLabel = true,
  label,
}) => {
  const { contact } = useContact();
  const activeEmail = email !== undefined ? email : contact?.email || contact?.salesEmail || contact?.supportEmail;
  const emailUrl = buildEmailLink(activeEmail, subject);

  // If email is not configured, hide gracefully
  if (!emailUrl || !activeEmail) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      href={emailUrl}
      className={className}
      aria-label={`Email KNYK Labs at ${activeEmail}`}
    >
      <Mail className="w-4 h-4 text-teal-400" />
      {showLabel && <span>{label || activeEmail}</span>}
    </Button>
  );
};
