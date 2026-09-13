"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Phone, Sparkles, Menu, X, User as UserIcon, LogOut } from "lucide-react";
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

  // Clean, focused navigation tabs
  const navLinks = [
    { label: "Resorts & Suites", href: "/hotels?collection=resorts" },
    { label: "Sightseeing Guide", href: "/guide" },
  ];

  return (
    <>
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
            <nav className="hidden md:flex items-center gap-1 bg-emerald-700/40 p-1 rounded-2xl border border-emerald-500/20 backdrop-blur-xs">
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
                href="tel:+919864879505"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-200" />
                <span>+91 98648 79505</span>
              </a>

              {/* User Authentication Trigger */}
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-300 text-emerald-950 font-bold flex items-center justify-center text-[10px]">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[90px] truncate">{user.displayName}</span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold truncate">{user.displayName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenInquiry}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 shadow-md transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Inquiry</span>
              </motion.button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenInquiry}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-emerald-800 shadow-xs cursor-pointer"
              >
                Enquire
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/15 transition-colors cursor-pointer"
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
              className="sm:hidden bg-emerald-700/95 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-4 space-y-1 shadow-2xl"
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
                {user ? (
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs">
                    <span className="font-bold truncate">{user.displayName}</span>
                    <button
                      onClick={() => logout()}
                      className="text-rose-200 hover:text-white text-xs font-semibold"
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/25 text-white text-xs font-semibold bg-white/15"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </button>
                )}

                <a
                  href="tel:+919864879505"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold bg-white/10"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-200" />
                  Helpline: +91 98648 79505
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

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

