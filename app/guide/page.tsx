"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";

export default function GuidePage() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Official Sohra Travel Guide</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Cherrapunji Sightseeing & Attractions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Discover living root bridges, plunging waterfalls, and limestone caves in the wettest place on earth.
          </p>
        </div>
      </div>

      {/* Attractions List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {CHERRAPUNJI_ATTRACTIONS.map((att) => (
          <div
            key={att.id}
            id={att.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-7 items-center shadow-xs hover:border-emerald-200 transition-all"
          >
            {/* Image (5 cols) */}
            <div className="lg:col-span-5 relative aspect-[16/11] rounded-xl overflow-hidden bg-slate-100 shadow-inner">
              <Image
                src={att.image}
                alt={att.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 text-emerald-800 font-semibold text-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200">
                {att.category}
              </div>
            </div>

            {/* Info (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{att.distanceFromSohra} from Sohra Town</span>
                  {att.khasiName && <span className="text-slate-400">({att.khasiName})</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {att.name}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {att.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <span className="text-slate-400 block text-[10px]">Best Season:</span>
                  <span className="font-semibold text-slate-800">{att.bestTime}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <span className="text-slate-400 block text-[10px]">Visitor Rating:</span>
                  <span className="font-semibold text-emerald-700">★ {att.rating} / 5.0</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/hotels?area=all"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Book Hotels Near {att.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Ask for Travel Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
