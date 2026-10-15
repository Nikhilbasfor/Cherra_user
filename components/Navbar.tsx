"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled((prev) => {
            const next = window.scrollY > 20;
            return prev !== next ? next : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Resorts & Suites", href: "/hotels" },
    { label: "Sightseeing", href: "/guide" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-md shadow-md shadow-slate-900/5 border-b border-stone-200/90 py-2.5"
          : "bg-white/95 backdrop-blur-sm shadow-xs border-b border-stone-200/80 py-3 sm:py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center group py-0.5">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-9 sm:h-11 w-48 sm:w-60"
            >
              <Image
                src="/images/cherrapunji-hotels-logo-dark.png"
                alt="Cherrapunji Hotels - Stays Above the Clouds"
                fill
                priority
                className="object-contain object-left drop-shadow-xs"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-full border border-stone-200/80 shadow-2xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative select-none ${
                    isActive
                      ? "text-white font-black"
                      : "text-stone-700 hover:text-emerald-950 hover:bg-stone-200/60"
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
                      className="absolute inset-0 bg-[#064e3b] rounded-full shadow-sm"
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+919864879505"
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-stone-200/90 text-stone-800 bg-stone-50 hover:bg-stone-100/90 hover:text-emerald-950 transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono text-[11px] tracking-wide">+91 98648 79505</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInquiry}
              className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-5 py-2 rounded-full bg-[#df9e38] hover:bg-[#cf8e28] text-slate-950 shadow-sm transition-all cursor-pointer"
            >
              <span>Reserve Direct</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenInquiry}
              className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-[#df9e38] text-slate-950 shadow-xs cursor-pointer"
            >
              Reserve
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-stone-700 hover:text-slate-950 hover:bg-stone-100 transition-colors cursor-pointer"
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
            className="sm:hidden bg-white border-b border-stone-200/90 px-4 py-5 space-y-2 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
              <a
                href="tel:+919864879505"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 text-stone-800 text-xs font-medium bg-stone-50"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono">Concierge: +91 98648 79505</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#df9e38] text-slate-950 font-black uppercase tracking-wider text-xs shadow-sm"
              >
                <span>Direct Booking Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
