"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Phone, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logically renowned hospitality tabs (no raw star rating tabs)
  const navLinks = [
    { label: "Resorts & Suites", href: "/hotels?collection=resorts" },
    { label: "Cliffside Escapes", href: "/hotels?collection=cliffside" },
    { label: "Heritage Homestays", href: "/hotels?collection=homestays" },
    { label: "Sightseeing Guide", href: "/guide" },
    { label: "Why Sohra", href: "/#about-cherrapunji" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-emerald-600/95 backdrop-blur-md shadow-lg shadow-emerald-950/15 border-b border-emerald-500/30 py-2.5"
          : "bg-emerald-600/90 backdrop-blur-sm border-b border-emerald-500/25 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-md font-bold"
            >
              <Mountain className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 drop-shadow-xs">
                Cherra<span className="text-emerald-100">Stays</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/25">
                  Sohra
                </span>
              </span>
              <p className="text-[11px] text-emerald-100/80 -mt-0.5 font-medium">
                Luxury & Nature Stays
              </p>
            </div>
          </Link>

          {/* Desktop Navigation with Motion Primitives Spring Indicator */}
          <nav className="hidden lg:flex items-center gap-1 bg-emerald-700/40 p-1 rounded-2xl border border-emerald-500/20 backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all relative select-none ${
                    isActive
                      ? "text-emerald-950 font-bold"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbarActiveIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                        mass: 0.8,
                      }}
                      className="absolute inset-0 bg-white rounded-xl shadow-xs"
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="tel:+918794712345"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xs shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-200" />
              <span>+91 87947 12345</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInquiry}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Inquiry</span>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenInquiry}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-emerald-800 shadow-xs"
            >
              Enquire
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/15 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="lg:hidden bg-emerald-700/95 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-4 space-y-1 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-emerald-600/50 flex flex-col gap-2">
              <a
                href="tel:+918794712345"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold bg-white/10"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-200" />
                Helpline: +91 87947 12345
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Request Custom Hotel Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

