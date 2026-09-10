"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  CloudRain,
  Trees,
  Footprints,
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HotelCard from "@/components/HotelCard";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";

export default function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>(CHERRAPUNJI_HOTELS);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [activeStarTab, setActiveStarTab] = useState<number | "all">("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    getAllHotels().then((data) => {
      if (data && data.length > 0) {
        setHotels(data);
      }
    }).catch(console.error);
  }, []);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

  const filteredHotels =
    activeStarTab === "all"
      ? hotels
      : hotels.filter((h) => h.starRating === activeStarTab);

  const faqs = [
    {
      q: "What is the best time to visit Cherrapunji (Sohra)?",
      a: "Cherrapunji is spectacular year-round. For roaring waterfalls and lush greenery, the monsoon season from June to September is unmatched. For trekking to the Double Decker Living Root Bridge and clear skies, October to April is ideal.",
    },
    {
      q: "How do I book hotels through CherraStays without commission?",
      a: "When you submit an inquiry through our portal, your details are sent directly to the hotel management and our reservation desk. There are no middleman commissions, and you receive direct rates with WhatsApp confirmation.",
    },
    {
      q: "Are hotels in Cherrapunji safe for families and solo female travelers?",
      a: "Yes! Meghalaya is globally recognized for its matrilineal society, peaceful culture, and warm Khasi hospitality. All hotels listed on CherraStays are physically verified properties with high safety and hygiene standards.",
    },
    {
      q: "Can hotels arrange taxis from Guwahati Airport or Shillong?",
      a: "Yes. Almost all our listed partner resorts provide direct airport pick-and-drop services from Guwahati (GAU) and Shillong (SHL) upon prior notification.",
    },
    {
      q: "Do hotels in Cherrapunji have 24/7 hot water geysers?",
      a: "Yes. Because Cherrapunji stays cool and misty throughout the year, all verified hotels in our directory are equipped with reliable water geysers in private bathrooms.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      {/* Navigation */}
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <section className="border-y border-slate-200 bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 text-center">
            <div className="p-2.5 sm:p-0 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0 space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">25+</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Verified Stays in Sohra</p>
            </div>
            <div className="p-2.5 sm:p-0 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0 space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">4.8 / 5.0</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Average Guest Rating</p>
            </div>
            <div className="p-2.5 sm:p-0 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0 space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">100%</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Direct Hotel Tariffs</p>
            </div>
            <div className="p-2.5 sm:p-0 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0 space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold text-emerald-700">15 Min</p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Fast Inquiry Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section id="hotels" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Handpicked Accommodations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Stays in Cherrapunji
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
              From cliffside luxury resorts facing Seven Sisters Falls to peaceful pine cottages and homestays.
            </p>
          </div>

          {/* Star Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            <button
              onClick={() => setActiveStarTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeStarTab === "all"
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200"
              }`}
            >
              All ({hotels.length})
            </button>
            <button
              onClick={() => setActiveStarTab(5)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeStarTab === 5
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200"
              }`}
            >
              5★ Luxury
            </button>
            <button
              onClick={() => setActiveStarTab(4)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeStarTab === 4
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200"
              }`}
            >
              4★ Premium
            </button>
            <button
              onClick={() => setActiveStarTab(3)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeStarTab === 3
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200"
              }`}
            >
              3★ Comfort
            </button>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
          ))}
        </div>

        {/* View All Stays Link */}
        <div className="mt-10 text-center">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-emerald-700 font-semibold text-xs shadow-xs transition-colors"
          >
            <span>Explore All Stays With Custom Filters & Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Interactive Map Explorer Section */}
      <section id="map-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MapExplorer
          hotels={hotels}
          attractions={CHERRAPUNJI_ATTRACTIONS}
          onEnquire={(h) => handleOpenInquiry(h)}
        />
      </section>

      {/* Why Cherrapunji Section */}
      <section id="about-cherrapunji" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            Destination Spotlight
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Why Visit Cherrapunji (Sohra)?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Perched at 4,800 feet above sea level in the East Khasi Hills, Cherrapunji is an earthly paradise of clouds, living root architecture, and turquoise waterfalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-200 shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">The Abode of Clouds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Watch mist roll over the canyons straight from the plains of Bangladesh. Experience hundreds of seasonal waterfalls cascading through emerald forests.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-200 shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Trees className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Living Root Bridges</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trek down to the world-famous Double Decker Living Root Bridge in Nongriat, crafted over centuries by Khasi tribes weaving living Ficus elastica tree roots.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-200 shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Footprints className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Ancient Caves & Canyons</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore the limestone wonders of Mawsmai and Arwah caves with marine fossils, and gaze into the 1,115-foot plunge of Nohkalikai Falls.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Key details regarding hotel bookings and travel in Cherrapunji.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Calm CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 p-7 sm:p-10 text-white shadow-md">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
              Personalized Assistance
            </span>
            <h3 className="text-xl sm:text-3xl font-bold tracking-tight">
              Planning a Trip to Cherrapunji? Let Our Local Desk Help.
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Share your travel dates and requirements. We will verify real-time room availability across Sohra resorts and send confirmed tariffs on WhatsApp.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => handleOpenInquiry()}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-semibold text-xs shadow-xs hover:bg-emerald-50 transition-colors"
              >
                Get Free Custom Quote
              </button>
              <a
                href="https://wa.me/918794712345?text=Hi%20CherraStays,%20I%20need%20help%20booking%20a%20hotel%20in%20Cherrapunji"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 text-white font-medium text-xs border border-emerald-600 transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Helpline</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={selectedHotelForInquiry}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
