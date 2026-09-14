import React from "react";
import Link from "next/link";
import { MessageSquare, Phone, Mail } from "lucide-react";
import { getContactConfig, buildWhatsAppLink, buildPhoneLink, buildEmailLink } from "@/lib/utils/contact";

export const Footer: React.FC = () => {
  const contact = getContactConfig();
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppLink();
  const phoneUrl = buildPhoneLink();
  const emailUrl = buildEmailLink();

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
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
                K
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                KNYK <span className="text-cyan-400">Labs</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Digital solutions studio helping businesses, creators, and teams build standout software, branding, multimedia, and automation systems.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-sm text-slate-300">
              {whatsappUrl && (
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
              {phoneUrl && (
                <a
                  href={phoneUrl}
                  className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Phone: {contact.phone}</span>
                </a>
              )}
              {emailUrl && (
                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-2 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Email: {contact.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Core Capabilities
            </h3>
            <ul className="space-y-2.5 text-sm">
              {serviceCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1 group"
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
          <p>© {currentYear} KNYK Labs. All rights reserved.</p>

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
