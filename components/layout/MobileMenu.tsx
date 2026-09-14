"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, MessageSquare, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getContactConfig, buildWhatsAppLink } from "@/lib/utils/contact";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
}) => {
  const pathname = usePathname();
  const contact = getContactConfig();
  const whatsappUrl = buildWhatsAppLink();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="relative flex flex-col justify-between w-full max-w-sm ml-auto h-full bg-[#090e1b] border-l border-slate-800 p-6 z-10 shadow-2xl overflow-y-auto"
      >
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Link
              href="/"
              onClick={onClose}
              className="text-lg font-bold tracking-tight text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
                K
              </div>
              <span>
                KNYK <span className="text-cyan-400">Labs</span>
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <Button
            variant="primary"
            size="lg"
            href="/contact"
            className="w-full justify-center"
            onClick={onClose}
          >
            Start a Project
          </Button>

          <Button
            variant="whatsapp"
            size="md"
            href={whatsappUrl}
            isExternal
            className="w-full justify-center"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </Button>

          <div className="flex items-center justify-around pt-2 text-xs text-slate-400">
            <a
              href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-1.5 hover:text-cyan-400"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <span className="text-slate-700">•</span>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 hover:text-teal-400"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
