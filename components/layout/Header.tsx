"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { useBranding } from "@/lib/context/BrandingContext";

const NAV_LINKS = [
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const pathname = usePathname();
  const { branding } = useBranding();

  const brandMark = branding?.brandMark || branding?.primaryLogo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 py-2.5 sm:py-3 shadow-lg shadow-black/40"
            : "bg-transparent py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Mark Only (Enlarged and styled) */}
            <Link
              href="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
              aria-label="KNYK Labs Homepage"
            >
              {brandMark && !imgError ? (
                <div className="relative flex items-center justify-center">
                  <Image
                    src={brandMark.url}
                    alt={brandMark.alt || "KNYK Labs brand mark"}
                    width={brandMark.width || 180}
                    height={brandMark.height || 180}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-contain drop-shadow-[0_4px_16px_rgba(6,182,212,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_6px_22px_rgba(6,182,212,0.45)]"
                    priority
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                    K
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-white leading-none">
                      KNYK <span className="text-cyan-400">Labs</span>
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mt-0.5">
                      Digital Studio
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-md"
              aria-label="Main Navigation"
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="primary" size="sm" href="/contact">
                Start a Project
              </Button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                href="/contact"
                className="text-xs px-3 py-1.5"
              >
                Start
              </Button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 border border-slate-800"
                aria-label="Open main navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </>
  );
};
