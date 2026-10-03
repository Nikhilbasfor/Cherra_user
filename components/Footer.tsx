import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#042f24] border-t border-emerald-800 text-emerald-100/70 text-xs mt-14 sm:mt-20">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Direct Contact */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="block">
              <div className="relative h-9 w-52">
                <Image
                  src="/images/cherrapunji-hotels-logo.png"
                  alt="Cherrapunji Hotels - Stays Above the Clouds"
                  fill
                  className="object-contain object-left brightness-125"
                />
              </div>
            </Link>
            <p className="text-emerald-100/60 text-xs leading-relaxed max-w-sm">
              The premier curated hospitality network for Cherrapunji (Sohra), Meghalaya. Connect directly with verified cliffside sanctuaries, pine cottages, and heritage village homestays.
            </p>
            <div className="pt-1 space-y-1.5 text-xs font-mono text-emerald-100/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Sohra, East Khasi Hills, Meghalaya 793108</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Helpline: +91 98648 79505</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>bookings@resortsincherrapunji.com</span>
              </div>
            </div>
          </div>

          {/* Curated Categories */}
          <div>
            <h4 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              Curated Stays
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/hotels/5-star-resorts" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>5 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-300/40" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/4-star-resorts" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>4 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-300/40" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/3-star-resorts" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>3 Star Resorts</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-300/40" />
                </Link>
              </li>
              <li>
                <Link href="/hotels/2-star-stays" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Homestays &amp; Budget Stays</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-300/40" />
                </Link>
              </li>
              <li>
                <Link href="/collection/waterfall-cliff-view-hotels-cherrapunji" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Waterfall &amp; Cliff Views</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-300/40" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Sightseeing & Guide */}
          <div>
            <h4 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              Sightseeing Guide
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Living Root Bridges
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Seven Sisters &amp; Nohkalikai Falls
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Mawsmai &amp; Arwah Caves
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Wei Sawdong 3-Tier Falls
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  Best Season &amp; Weather Tips
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-emerald-100/50">
          <p>© {new Date().getFullYear()} CherraStays • Resorts in Cherrapunji. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-amber-300/90 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Guaranteed Direct Front-Desk Tariffs • Zero Commission</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
