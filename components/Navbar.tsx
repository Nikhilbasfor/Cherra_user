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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
          ? "bg-[#064e3b]/95 backdrop-blur-2xl shadow-xl shadow-emerald-950/25 border-b border-emerald-700/40 py-2.5"
          : "bg-[#064e3b] shadow-md border-b border-emerald-700/30 py-3.5"
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
                src="/images/cherrapunji-hotels-logo.png"
                alt="Cherrapunji Hotels - Stays Above the Clouds"
                fill
                priority
                className="object-contain object-left drop-shadow-md brightness-110"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-emerald-900/60 p-1.5 rounded-full border border-emerald-600/30 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative select-none ${
                    isActive
                      ? "text-emerald-950 font-black"
                      : "text-emerald-100 hover:text-white hover:bg-emerald-800/40"
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
                      className="absolute inset-0 bg-white rounded-full shadow-md"
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
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-emerald-600/40 text-emerald-100 bg-emerald-900/50 hover:bg-emerald-800/60 hover:text-white transition-all backdrop-blur-md"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono text-[11px] tracking-wide">+91 98648 79505</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenInquiry}
              className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all cursor-pointer"
            >
              <span>Reserve Direct</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenInquiry}
              className="text-xs font-extrabold uppercase px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 shadow-sm cursor-pointer"
            >
              Reserve
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800/50 transition-colors cursor-pointer"
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
            className="sm:hidden bg-[#064e3b] border-b border-emerald-700/50 px-4 py-5 space-y-2 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-emerald-50 hover:bg-emerald-800/40 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-emerald-700/40 flex flex-col gap-2.5">
              <a
                href="tel:+919864879505"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-600/40 text-emerald-100 text-xs font-medium bg-emerald-900/40"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-mono">Concierge: +91 98648 79505</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-slate-950 font-black uppercase tracking-wider text-xs shadow-md"
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
