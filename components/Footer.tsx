import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#06080a] border-t border-white/10 text-white/50 text-xs mt-20">
      {/* Top Anchor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="block">
              <div className="relative h-10 w-56">
                <Image
                  src="/images/cherrapunji-hotels-logo.png"
                  alt="Cherrapunji Hotels - Stays Above the Clouds"
                  fill
                  className="object-contain object-left brightness-110"
                />
              </div>
            </Link>
            <p className="text-white/50 text-xs leading-relaxed max-w-sm">
              The premier curated hospitality and nature discovery network for Cherrapunji (Sohra), Meghalaya. Connect directly with verified cliffside sanctuaries, pine cottages, and heritage village homestays.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-white/60">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Tourism Center, Sohra, Meghalaya 793108</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Helpline: +91 98648 79505</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>concierge@cherrapunjistays.com</span>
              </div>
            </div>
          </div>

          {/* Curated Collections */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-4">
              Star Stays &amp; Themes
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/hotels/5-star-resorts" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>5 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/4-star-resorts" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>4 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/3-star-resorts" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>3 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/2-star-stays" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>2 Star &amp; Budget Stays</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/collection/honeymoon-places-cherrapunji" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Honeymoon &amp; Couples</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/collection/family-stays-cherrapunji" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Family Cottages</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/collection/waterfall-cliff-view-hotels-cherrapunji" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Waterfall &amp; Cliff Views</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/collection/living-root-bridge-trek-stays-cherrapunji" className="hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Living Root Bridge Stays</span>
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Location-wise SEO */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-4">
              Regional Localities
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/hotels?area=Nohsngithiang" className="hover:text-amber-300 transition-colors">
                  Seven Sisters Falls Rim
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Sohra+Town" className="hover:text-amber-300 transition-colors">
                  Central Sohra Market Stays
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Saitsohpen" className="hover:text-amber-300 transition-colors">
                  Saitsohpen Valley Retreats
                </Link>
              </li>
              <li>
                <Link href="/hotels?area=Laitkynsew" className="hover:text-amber-300 transition-colors">
                  Laitkynsew Bridge Trailhead
                </Link>
              </li>
            </ul>
          </div>

          {/* Attractions & Guides */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.25em] mb-4">
              Expedition Guide
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/guide#nohkalikai" className="hover:text-amber-300 transition-colors">
                  Nohkalikai Plunge Timings
                </Link>
              </li>
              <li>
                <Link href="/guide#living-root-bridge" className="hover:text-amber-300 transition-colors">
                  Nongriat Living Root Trail
                </Link>
              </li>
              <li>
                <Link href="/guide#mawsmai-cave" className="hover:text-amber-300 transition-colors">
                  Mawsmai Limestone Cave
                </Link>
              </li>
              <li>
                <Link href="/guide#best-time" className="hover:text-amber-300 transition-colors">
                  Monsoon &amp; Winter Seasons
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimalist Trust Metrics Strip */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs">100% Physically Verified</p>
              <p className="text-white/40 text-[11px] mt-0.5">Inspected cliff retreats with verified hot geysers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <Phone className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs">Direct WhatsApp Concierge</p>
              <p className="text-white/40 text-[11px] mt-0.5">Fast reservation verification with property desks.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <ArrowUpRight className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-white font-bold text-xs">Guaranteed Direct Tariffs</p>
              <p className="text-white/40 text-[11px] mt-0.5">Zero intermediary markups or booking commissions.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <p>© {new Date().getFullYear()} CherraStays Concierge Network. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
