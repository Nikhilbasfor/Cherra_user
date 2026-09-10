import React from "react";
import Link from "next/link";
import { Mountain, Mail, Phone, MapPin, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-16">
      {/* Top Anchor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Cherra<span className="text-emerald-700">Stays</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              The premier curated hotel booking and nature discovery network for Cherrapunji (Sohra), Meghalaya. Connect directly with verified cliffside resorts, pine cottages, and homestays.
            </p>
            <div className="pt-1 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tourism Center, Sohra (Cherrapunji), Meghalaya 793108</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Booking Helpline: +91 87947 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>support@cherrapunjistays.com</span>
              </div>
            </div>
          </div>

          {/* Star Categories */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Browse by Stars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/hotels?stars=5" className="hover:text-emerald-700 transition-colors flex items-center justify-between">
                  <span>5-Star Luxury Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/hotels?stars=4" className="hover:text-emerald-700 transition-colors flex items-center justify-between">
                  <span>4-Star Premium Stays</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/hotels?stars=3" className="hover:text-emerald-700 transition-colors flex items-center justify-between">
                  <span>3-Star Comfort Hotels</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/hotels?stars=2,1" className="hover:text-emerald-700 transition-colors flex items-center justify-between">
                  <span>Budget Homestays</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Location-wise SEO */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Stays by Area
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/hotels?area=Nohsngithiang" className="hover:text-emerald-700 transition-colors">
                  Hotels near Seven Sisters Falls
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Sohra+Town" className="hover:text-emerald-700 transition-colors">
                  Hotels in Central Sohra Market
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Saitsohpen" className="hover:text-emerald-700 transition-colors">
                  Resorts in Saitsohpen Valley
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Laitkynsew" className="hover:text-emerald-700 transition-colors">
                  Hotels near Double Decker Bridge
                </Link>
              </li>
            </ul>
          </div>

          {/* Attractions & Guides */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-3">
              Cherrapunji Guide
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guide#nohkalikai" className="hover:text-emerald-700 transition-colors">
                  Nohkalikai Falls Timings
                </Link>
              </li>
              <li>
                <Link href="/guide#living-root-bridge" className="hover:text-emerald-700 transition-colors">
                  Living Root Bridge Trek
                </Link>
              </li>
              <li>
                <Link href="/guide#mawsmai-cave" className="hover:text-emerald-700 transition-colors">
                  Mawsmai Cave Exploration
                </Link>
              </li>
              <li>
                <Link href="/guide#best-time" className="hover:text-emerald-700 transition-colors">
                  Best Time to Visit Sohra
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-slate-800 font-semibold text-xs">100% Verified Properties</p>
              <p className="text-slate-500 text-[11px]">Inspected stays with clean sanitation.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-slate-800 font-semibold text-xs">Direct WhatsApp Desk</p>
              <p className="text-slate-500 text-[11px]">Instant quotes & availability confirmations.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <Heart className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-slate-800 font-semibold text-xs">Zero Commission</p>
              <p className="text-slate-500 text-[11px]">Direct tariffs from hotel management.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CherraStays. Cherrapunji Hotel Network.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-600">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
