"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Star } from "lucide-react";
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
    <div className="min-h-screen bg-[#edf7f2] text-slate-900 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Header - Uplifted with reduced padding and compact font */}
      <div className="pt-20 sm:pt-22 pb-3 sm:pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-emerald-900/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            Sightseeing in <span className="text-amber-600">Cherrapunji</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Living root bridges, cascading waterfalls, and caves across the Sohra plateau.
          </p>
        </div>
      </div>

      {/* Attractions Grid - Uplifted so top 3 sight cards are visible in first view */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {attractions.map((att) => (
            <div
              key={att.id}
              id={att.id}
              className="bg-white border border-emerald-900/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image at Top */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={att.image}
                  alt={att.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                  {att.category}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{att.distanceFromSohra} from Sohra Town</span>
                    {att.khasiName && <span className="text-slate-400 truncate">({att.khasiName})</span>}
                  </div>

                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-snug">
                    {att.name}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {att.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2.5 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase">Best Season</span>
                      <span className="font-bold text-slate-800 truncate block mt-0.5">{att.bestTime}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase">Rating</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {att.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <Link
                      href={`/hotels?near=${att.id}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase tracking-wider text-xs shadow-sm transition-all flex items-center justify-center gap-1 text-center"
                    >
                      <span>Nearby Stays</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(true)}
                      className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono uppercase tracking-wider text-xs transition-colors cursor-pointer"
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
