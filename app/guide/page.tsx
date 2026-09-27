"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";
import { getAllAttractions } from "@/lib/firebase";
import { Attraction } from "@/lib/types";

export default function GuidePage() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [attractions, setAttractions] = useState<Attraction[]>(CHERRAPUNJI_ATTRACTIONS);

  useEffect(() => {
    getAllAttractions()
      .then((data) => {
        if (data && data.length > 0) {
          setAttractions(data);
        }
      })
      .catch(console.warn);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Header (Cleaned up - removed Official Sohra Travel Guide badge) */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Cherrapunji Sightseeing & Attractions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Discover living root bridges, plunging waterfalls, and limestone caves in the wettest place on earth.
          </p>
        </div>
      </div>

      {/* Attractions Grid - 3 attraction boxes in 1 row with vertical format */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((att) => (
            <div
              key={att.id}
              id={att.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image at Top */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={att.image}
                  alt={att.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200">
                  {att.category}
                </div>
              </div>

              {/* Vertical Information Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{att.distanceFromSohra} from Sohra Town</span>
                    {att.khasiName && <span className="text-slate-400 truncate">({att.khasiName})</span>}
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {att.name}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {att.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">Best Season:</span>
                      <span className="font-semibold text-slate-800 truncate block">{att.bestTime}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">Visitor Rating:</span>
                      <span className="font-semibold text-emerald-700 block">★ {att.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href="/hotels?area=all"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Nearby Hotels</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(true)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
