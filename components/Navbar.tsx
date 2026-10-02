"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, User as UserIcon, LogOut, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

interface NavbarProps {
  onOpenInquiry?: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Resorts & Suites", href: "/hotels" },
    { label: "Expedition Guide", href: "/guide" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090b0e]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 border-b border-white/10 py-3"
            : "bg-[#090b0e]/70 backdrop-blur-xl border-b border-white/10 py-4"
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

            {/* Desktop Navigation with Minimalist Architectural Pill */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative select-none ${
                      isActive
                        ? "text-black font-extrabold"
                        : "text-white/70 hover:text-white hover:bg-white/[0.06]"
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
                className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border border-white/10 text-white/80 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all backdrop-blur-md"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] tracking-wide">+91 98648 79505</span>
              </a>

              {/* User Authentication Trigger */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-[10px]">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[85px] truncate font-medium">{user.displayName}</span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-48 bg-[#111418] rounded-2xl shadow-2xl border border-white/15 py-1.5 z-50 text-white"
                      >
                        <div className="px-3 py-2 border-b border-white/10">
                          <p className="text-xs font-bold truncate">{user.displayName}</p>
                          <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-white/[0.06] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/90 hover:text-white transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-white/60" />
                  <span>Sign In</span>
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenInquiry}
                className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full bg-white hover:bg-slate-200 text-black shadow-lg transition-all cursor-pointer"
              >
                <span>Reserve Direct</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenInquiry}
                className="text-xs font-extrabold uppercase px-3 py-1.5 rounded-full bg-white text-black shadow-xs cursor-pointer"
              >
                Reserve
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              className="sm:hidden bg-[#090b0e]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-5 space-y-2 shadow-2xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                {user ? (
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.05] text-white text-xs">
                    <span className="font-bold truncate">{user.displayName}</span>
                    <button
                      onClick={() => logout()}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-white text-xs font-bold uppercase tracking-wider bg-white/[0.06]"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </button>
                )}

                <a
                  href="tel:+919864879505"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/80 text-xs font-medium bg-white/[0.03]"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">Concierge: +91 98648 79505</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInquiry?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-extrabold uppercase tracking-wider text-xs shadow-xl"
                >
                  <span>Direct Booking Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
