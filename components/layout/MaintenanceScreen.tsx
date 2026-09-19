"use client";

import React from "react";
import { Wrench, MessageSquare, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { KnykPublicContact, KnykPublicBranding } from "@/lib/types/knyk";
import { buildWhatsAppLink, buildPhoneLink, buildEmailLink } from "@/lib/utils/contact";
import Image from "next/image";

interface MaintenanceScreenProps {
  contact?: KnykPublicContact | null;
  branding?: KnykPublicBranding | null;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  contact,
  branding,
}) => {
  const logo = branding?.primaryLogo || branding?.brandMark;
  const whatsappUrl = buildWhatsAppLink(contact?.whatsappNumber);
  const phoneUrl = buildPhoneLink(contact?.phone);
  const emailUrl = buildEmailLink(contact?.email || contact?.salesEmail || contact?.supportEmail);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-lg mx-auto relative z-10 space-y-6">
        {/* Brand identity */}
        <div className="flex justify-center mb-6">
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt || "KNYK Labs"}
              width={logo.width || 180}
              height={logo.height || 48}
              className="h-12 w-auto object-contain"
              priority
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg">
                K
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                KNYK <span className="text-cyan-400">Labs</span>
              </span>
            </div>
          )}
        </div>

        {/* Icon & Message */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">
            System Upgrades in Progress
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our digital services portal is currently undergoing scheduled platform maintenance to deploy high-performance updates. We will be back online shortly.
          </p>
        </div>

        {/* Direct Contact Channels */}
        {(whatsappUrl || phoneUrl || emailUrl) && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Need immediate project support?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {whatsappUrl && (
                <Button variant="whatsapp" size="sm" href={whatsappUrl} isExternal>
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Direct</span>
                </Button>
              )}
              {phoneUrl && (
                <Button variant="secondary" size="sm" href={phoneUrl}>
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>{contact?.phone || "Call Us"}</span>
                </Button>
              )}
              {emailUrl && (
                <Button variant="secondary" size="sm" href={emailUrl}>
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Email</span>
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-slate-400 pt-4">
          &copy; {new Date().getFullYear()} {contact?.businessName || "KNYK Labs"}. All rights reserved.
        </div>
      </div>
    </div>
  );
};
