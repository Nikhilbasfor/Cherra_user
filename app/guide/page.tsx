"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Star, Sparkles, Trees, Footprints, PhoneCall } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";
import { getAllAttractions, subscribeToAttractions, logWhatsAppClick } from "@/lib/firebase";
import { Attraction } from "@/lib/types";

export default function GuidePage() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [attractions, setAttractions] = useState<Attraction[]>(CHERRAPUNJI_ATTRACTIONS);

  useEffect(() => {
    let isMounted = true;
    getAllAttractions()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setAttractions(data);
        }
      })
      .catch(console.warn);

    const unsub = subscribeToAttractions((liveData) => {
      if (isMounted && liveData && liveData.length > 0) {
        setAttractions(liveData);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 selection:bg-amber-400 selection:text-black relative pb-16 md:pb-0">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Header - Compact top spacing so sightseeing cards appear without cut on first sight */}
      <div className="pt-16 sm:pt-18 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-stone-200/90">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Highland Expeditions <span className="italic font-serif font-normal text-amber-700">of</span> Sohra
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
            Living root bridges, cascading canyon waterfalls, and prehistoric caves across the Cherrapunji plateau.
          </p>
        </div>
      </div>

      {/* Attractions Grid - Compact height so full cards & action buttons fit in first view */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attractions.map((att) => (
            <div
              key={att.id}
              id={att.id}
              className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image at Top - Compact Height */}
              <div className="relative h-36 sm:h-40 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={att.image}
                  alt={att.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  {att.category}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{att.distanceFromSohra} from Sohra Town</span>
                    {att.khasiName && <span className="text-slate-400 truncate">({att.khasiName})</span>}
                  </div>

                  <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 leading-snug">
                    {att.name}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {att.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    <div className="p-1.5 px-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase">Best Season</span>
                      <span className="font-bold text-slate-800 truncate block mt-0.5 text-xs">{att.bestTime}</span>
                    </div>
                    <div className="p-1.5 px-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase">Rating</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1 mt-0.5 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {att.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <Link
                      href={`/hotels?near=${att.id}`}
                      className="flex-1 py-1.5 sm:py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase tracking-wider text-xs shadow-xs transition-all flex items-center justify-center gap-1 text-center"
                    >
                      <span>Nearby Stays</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(true)}
                      className="py-1.5 sm:py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono uppercase tracking-wider text-xs transition-colors cursor-pointer"
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

      {/* Sticky Mobile App-Like Navigation Bar (md:hidden) */}
      <nav aria-label="Mobile Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-2.5 px-6 flex items-center justify-around md:hidden shadow-lg shadow-black/5">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-stone-500 hover:text-stone-900 font-medium text-[10px] uppercase tracking-wider transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Sanctuary</span>
        </Link>

        <Link
          href="/hotels"
          className="flex flex-col items-center gap-1 text-stone-500 hover:text-stone-900 font-medium text-[10px] uppercase tracking-wider transition-colors"
        >
          <Trees className="w-4 h-4" />
          <span>Stays</span>
        </Link>

        <Link
          href="/guide"
          className="flex flex-col items-center gap-1 text-[#0a3a2a] font-bold text-[10px] uppercase tracking-wider"
        >
          <Footprints className="w-4 h-4 text-[#0a3a2a]" />
          <span>Journeys</span>
        </Link>

        <a
          href="https://wa.me/919864879505?text=Hi%20CherraStays%20Concierge,%20I%20need%20assistance"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logWhatsAppClick({ page: "Guide Page Mobile Bar", note: "Clicked Concierge icon on /guide page" })}
          className="flex flex-col items-center gap-1 text-stone-500 hover:text-stone-900 font-medium text-[10px] uppercase tracking-wider transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-amber-600" />
          <span>Concierge</span>
        </a>
      </nav>
    </div>
  );
}
