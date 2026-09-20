"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useBranding } from "@/lib/context/BrandingContext";
import { useWebsite } from "@/lib/context/WebsiteContext";
import Link from "next/link";
import { MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { buildWhatsAppLink, buildPhoneLink, buildEmailLink, formatAddress } from "@/lib/utils/contact";
import type { KnykPublicContact } from "@/lib/nexis/types";

export const Footer: React.FC<{ contact?: KnykPublicContact | null }> = ({ contact }) => {
  const { branding } = useBranding();
  const { website } = useWebsite();
  const [imgError, setImgError] = useState(false);
  const footerBrandMark = branding?.brandMark || branding?.primaryLogo;
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppLink(contact?.whatsappNumber);
  const phoneUrl = buildPhoneLink(contact?.phone);
  const targetEmail = contact?.email || contact?.salesEmail || contact?.supportEmail;
  const emailUrl = buildEmailLink(targetEmail);
  const formattedAddress = formatAddress(contact?.address);
  const footerDescription =
    website?.footerDescription ||
    "Digital solutions studio helping businesses, creators, and teams build standout software, branding, multimedia, and automation systems.";
  const copyrightText = website?.copyrightText
    ? (website.copyrightText.startsWith("©") ? website.copyrightText : `© ${currentYear} ${website.copyrightText}`)
    : `© ${currentYear} ${contact?.businessName || "KNYK Labs"}. All rights reserved.`;

  const serviceCategories = [
    { name: "Software & Development", href: "/services" },
    { name: "Graphic Design", href: "/services" },
    { name: "Photo & Video", href: "/services" },
    { name: "Presentations & Documents", href: "/services" },
    { name: "AI & Automation", href: "/services" },
    { name: "Digital Services", href: "/services" },
  ];

  const quickLinks = [
    { name: "Services Catalog", href: "/services" },
    { name: "Selected Portfolio", href: "/portfolio" },
    { name: "About KNYK Labs", href: "/about" },
    { name: "Contact & Enquiries", href: "/contact" },
  ];

  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            {footerBrandMark && !imgError ? (
              <Link href="/" className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full" aria-label="KNYK Labs Homepage">
                <Image
                  src={footerBrandMark.url}
                  alt={footerBrandMark.alt || "KNYK Labs brand mark"}
                  width={footerBrandMark.width || 180}
                  height={footerBrandMark.height || 180}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-contain drop-shadow-[0_4px_16px_rgba(6,182,212,0.25)] transition-transform group-hover:scale-105"
                  onError={() => setImgError(true)}
                />
              </Link>
            ) : (
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
                  K
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  {contact?.businessName ? (
                    contact.businessName
                  ) : (
                    <>KNYK <span className="text-cyan-400">Labs</span></>
                  )}
                </span>
              </Link>
            )}

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerDescription}
            </p>

            <a
              href="https://krishna-naik.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors"
              aria-label="Visit Krishna Naik's portfolio"
            >
              <span className="text-slate-500">Founder</span>
              <span className="font-semibold">Krishna Naik ↗</span>
            </a>

            <div className="pt-2 flex flex-col space-y-2 text-sm text-slate-300">
              {whatsappUrl && contact?.whatsappNumber && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {contact.whatsappNumber}</span>
                </a>
              )}
              {phoneUrl && contact?.phone && (
                <a
                  href={phoneUrl}
                  className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Phone: {contact.phone}</span>
                </a>
              )}
              {emailUrl && targetEmail && (
                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Email: {targetEmail}</span>
                </a>
              )}
              {formattedAddress && (
                <div className="inline-flex items-start gap-2 text-slate-400 text-xs pt-1">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{formattedAddress}</span>
                </div>
              )}
              {contact?.businessHours && (
                <div className="text-xs text-slate-500">
                  Hours: {contact.businessHours}
                </div>
              )}
            </div>

            {/* Social Links */}
            {contact?.social && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {contact.social.linkedin && (
                  <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400">
                    LinkedIn
                  </a>
                )}
                {contact.social.github && (
                  <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400">
                    GitHub
                  </a>
                )}
                {contact.social.instagram && (
                  <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400">
                    Instagram
                  </a>
                )}
                {contact.social.facebook && (
                  <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400">
                    Facebook
                  </a>
                )}
                {contact.social.youtube && (
                  <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-cyan-400">
                    YouTube
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Capabilities Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Capabilities
            </h3>
            <ul className="space-y-2.5 text-sm">
              {serviceCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Workflow Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Our Process
            </h3>
            <ol className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">01.</span>
                <span>Select service & scope</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">02.</span>
                <span>Direct consultation & quote</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">03.</span>
                <span>Milestone advance payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono">04.</span>
                <span>Agile delivery & review</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{copyrightText}</p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-400 flex items-center gap-1">
              Engineered for NEXIS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
