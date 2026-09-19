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

  const primaryLogo = branding?.primaryLogo;
  const brandMark = branding?.brandMark;
  const activeLogo = primaryLogo || brandMark;

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
            ? "bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-lg shadow-black/40"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo with fallback hierarchy: Primary Logo -> Brand Mark -> Text fallback */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
              aria-label="KNYK Labs Homepage"
            >
              {activeLogo && !imgError ? (
                <div className="flex items-center gap-2.5">
                  <Image
                    src={activeLogo.url}
                    alt={activeLogo.alt || "KNYK Labs logo"}
                    width={activeLogo.width || 160}
                    height={activeLogo.height || 40}
                    className="h-9 w-auto max-w-[180px] object-contain drop-shadow-sm transition-transform group-hover:scale-[1.02]"
                    priority
                    onError={() => setImgError(true)}
                  />
                  {/* If using circular brandMark only, show text alongside */}
                  {!primaryLogo && brandMark && (
                    <div className="flex flex-col">
                      <span className="text-xl font-bold tracking-tight text-white leading-none">
                        KNYK <span className="text-cyan-400">Labs</span>
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold mt-0.5">
                        Digital Studio
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-300 flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
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
                </>
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
