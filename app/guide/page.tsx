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
    <div className="min-h-screen bg-[#090b0e] text-slate-100 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Header */}
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-amber-400 text-xs font-mono font-bold uppercase tracking-widest border border-white/10 mb-3">
            <span>Sohra Topography & Field Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Cherrapunji Sightseeing & Attractions
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-mono mt-2 leading-relaxed">
            Discover living root bridges, plunging waterfalls, and limestone caves in the wettest place on earth.
          </p>
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {attractions.map((att) => (
            <div
              key={att.id}
              id={att.id}
              className="bg-[#111418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all flex flex-col justify-between"
            >
              {/* Image at Top */}
              <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                <Image
                  src={att.image}
                  alt={att.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/15">
                  {att.category}
                </div>
              </div>

              {/* Vertical Information Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{att.distanceFromSohra} from Sohra Town</span>
                    {att.khasiName && <span className="text-white/30 truncate">({att.khasiName})</span>}
                  </div>

                  <h2 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                    {att.name}
                  </h2>

                  <p className="text-xs text-white/60 font-mono line-clamp-3 leading-relaxed">
                    {att.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Best Season:</span>
                      <span className="font-bold text-white truncate block mt-0.5">{att.bestTime}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Visitor Rating:</span>
                      <span className="font-bold text-amber-400 block mt-0.5">★ {att.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/hotels?near=${att.id}`}
                      className="flex-1 py-2.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Nearby Stays</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(true)}
                      className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-mono uppercase tracking-wider text-xs transition-colors cursor-pointer"
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
