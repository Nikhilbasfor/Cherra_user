"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HotelCard from "@/components/HotelCard";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";
import { AnimatedTabs, TabOption } from "@/components/motion/AnimatedTabs";
import {
  BotanicalWatermark,
  BotanicalPalmWatermark,
  BotanicalPageBackdrop,
} from "@/components/motion/BotanicalFoliage";

// Renowned hospitality collection tabs
const HOME_COLLECTION_TABS: TabOption[] = [
  { id: "all", label: "All Collections" },
  { id: "cliffside", label: "Cliffside & Waterfalls" },
  { id: "resorts", label: "Luxury Forest Resorts" },
  { id: "cottages", label: "Boutique Cottages" },
  { id: "homestays", label: "Heritage Homestays" },
];

export default function HomePage() {
  const [hotels, setHotels] = useState<Hotel[]>(CHERRAPUNJI_HOTELS);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    getAllHotels()
      .then((data) => {
        if (data && data.length > 0) {
          setHotels(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

  // Filter hotels based on renowned hospitality categories
  const filteredHotels = useMemo(() => {
    if (activeCollectionTab === "all") return hotels;
    if (activeCollectionTab === "cliffside") {
      return hotels.filter(
        (h) =>
          h.tagline.toLowerCase().includes("cliff") ||
          h.tagline.toLowerCase().includes("valley") ||
          h.tagline.toLowerCase().includes("falls") ||
          h.name.toLowerCase().includes("orchid") ||
          h.name.toLowerCase().includes("kutmadan") ||
          h.amenities.some(
            (a) => a.toLowerCase().includes("view") || a.toLowerCase().includes("waterfall")
          )
      );
    }
    if (activeCollectionTab === "resorts") {
      return hotels.filter(
        (h) => h.name.toLowerCase().includes("resort") || h.starRating >= 4
      );
    }
    if (activeCollectionTab === "cottages") {
      return hotels.filter(
        (h) =>
          h.rooms.some((r) => r.name.toLowerCase().includes("cottage")) ||
          h.description.toLowerCase().includes("cottage") ||
          h.description.toLowerCase().includes("pine")
      );
    }
    if (activeCollectionTab === "homestays") {
      return hotels.filter(
        (h) =>
          h.name.toLowerCase().includes("homestay") ||
          h.name.toLowerCase().includes("holiday resort") ||
          h.starRating <= 3 ||
          h.tagline.toLowerCase().includes("pioneer")
      );
    }
    return hotels;
  }, [hotels, activeCollectionTab]);

  const faqs = [
    {
      q: "What is the best time to visit Cherrapunji (Sohra)?",
      a: "Cherrapunji is spectacular year-round. For roaring waterfalls and dramatic misty canyon clouds, the monsoon season from June to September is magical. For trekking down to the Double Decker Living Root Bridge and clear sunny skies, October to April is ideal.",
    },
    {
      q: "How do I book hotels through CherraStays without commission?",
      a: "When you submit an inquiry through our portal, your request connects directly with the resort management and our local desk in Sohra. There are no middleman surcharges, ensuring you get direct front-desk tariffs along with prompt WhatsApp verification.",
    },
    {
      q: "Are hotels in Cherrapunji safe for families and solo female travelers?",
      a: "Yes, exceptionally so. Meghalaya is globally recognized for its matrilineal society, peaceful culture, and warm Khasi hospitality. All hotels in our collection are verified physical properties adhering to strict safety and hygiene benchmarks.",
    },
    {
      q: "Can hotels arrange airport transfers from Guwahati or Shillong?",
      a: "Yes. Our partner resorts and boutique stays coordinate reliable cab pickups and drop-offs from Guwahati Airport (GAU) and Shillong Airport (SHL) with verified local drivers.",
    },
    {
      q: "Do hotels in Cherrapunji provide 24/7 hot water geysers?",
      a: "Yes. Because Cherrapunji remains crisp and misty throughout the year, every stay in our curated portfolio is equipped with reliable hot water geysers in private bathrooms.",
    },
  ];

  return (
    <div className="min-h-screen bg-rainforest-mist text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 relative overflow-x-hidden">
      {/* Editorial Noise / Film Grain Texture Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-25" />

      {/* Global Ambient Botanical Leafy Prints (Fills empty background with subtle moving leafy fronds) */}
      <BotanicalPageBackdrop />

      {/* Taskbar Top (Navbar in refined green) */}
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Hero Section with Unblurred HD Video & Clean Uplifted Typography */}
      <HeroSection />

      {/* Stats Bar with Tactile Cards */}
      <section className="relative z-10 border-y border-slate-200/80 bg-white/95 backdrop-blur-md py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inventory</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">25+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Verified Stays in Sohra</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
                <Award className="w-4 h-4 fill-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">4.9 / 5.0</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Guest Satisfaction Rate</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pricing</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Direct Hotel Tariffs</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-teal-600 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Speed</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">15 Min</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Avg WhatsApp Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stays Section with Motion Primitives Tabs & Subtle Leaf Prints */}
      <section id="hotels" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-20 sm:pb-16 overflow-hidden">
        {/* Subtle Botanical Fronds on the flanks */}
        <BotanicalPalmWatermark side="left" className="-left-14 top-20 opacity-70" />
        <BotanicalWatermark variant="right" className="-right-14 bottom-10 opacity-70" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200/70 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Handpicked Sanctuaries</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Stays in Cherrapunji
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              From cliff-edge luxury suites facing Nohsngithiang Falls to cozy pine cottages and heritage tribal homestays.
            </p>
          </div>

          {/* Renowned Category Tabs (Motion Primitives AnimatedTabs) */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            <AnimatedTabs
              tabs={HOME_COLLECTION_TABS}
              activeId={activeCollectionTab}
              onChange={setActiveCollectionTab}
              layoutId="homeSectionTabPill"
              variant="light"
            />
          </div>
        </div>

        {/* Hotels Grid with Motion Stagger */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
          ))}
        </div>

        {/* View All Stays Link */}
        <div className="relative z-10 mt-12 text-center">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 hover:border-emerald-400 text-slate-900 hover:text-emerald-700 font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Explore All Stays With Interactive Map & Filters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Interactive Map Explorer Section */}
      <section id="map-explorer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MapExplorer
          hotels={hotels}
          attractions={CHERRAPUNJI_ATTRACTIONS}
          onEnquire={(h) => handleOpenInquiry(h)}
        />
      </section>

      {/* Destination Spotlight: Why Cherrapunji with Minimal Long Leafy Prints */}
      <section id="about-cherrapunji" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 my-6 overflow-hidden rounded-3xl border border-emerald-900/5 bg-gradient-to-b from-emerald-50/40 via-white/60 to-emerald-50/30 shadow-xs">
        {/* Ambient Watercolor Mist & Botanical Watermark Shading */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-emerald-100/40 via-transparent to-transparent pointer-events-none" />
        <BotanicalWatermark variant="left" className="-left-10 sm:-left-6 top-6 opacity-90" />
        <BotanicalPalmWatermark side="right" className="-right-12 sm:-right-8 top-12 opacity-90" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-200/80 shadow-xs">
            Destination Spotlight
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Why Visit Cherrapunji (Sohra)?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
            Perched at 4,800 feet in Meghalaya's East Khasi Hills, Cherrapunji is an earthly wonderland of rolling clouds, ancient living root architecture, and turquoise canyon plunges.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Spotlight 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-7 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">The Abode of Clouds</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Watch dramatic mist clouds ascend from the plains of Bangladesh right into your balcony. Cherrapunji hosts hundreds of seasonal and perennial cascades.
            </p>
          </motion.div>

          {/* Spotlight 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-7 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
              <Trees className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Living Root Bridges</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Descend into the valley of Nongriat to cross the iconic Double Decker Living Root Bridge, organically bio-engineered across centuries by indigenous Khasi villagers.
            </p>
          </motion.div>

          {/* Spotlight 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-7 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
              <Footprints className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ancient Caves & Canyons</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore subterranean limestone passages in Mawsmai and Arwah caves embedded with prehistoric marine fossils, and witness the 1,115-ft Nohkalikai plunge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section with Leaf Shading */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 overflow-hidden">
        <BotanicalWatermark variant="left" className="-left-20 -bottom-6 opacity-60" />
        <BotanicalPalmWatermark side="right" className="-right-20 -top-6 opacity-60" />

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Traveler Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Essential information regarding accommodations, seasons, and reservations in Sohra.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/90 overflow-hidden shadow-xs hover:border-emerald-300 transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-3 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Luxury Concierge CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle noise in banner */}
          <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3.5">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Personalized Concierge Desk
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
              Planning a Journey to Cherrapunji? Let Our Local Specialists Assist.
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Share your travel window and guest preferences. We verify real-time room availability across Sohra's premier resorts and send verified tariffs with zero markups.
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpenInquiry()}
                className="px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Request Custom Itinerary Quote
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/918794712345?text=Hi%20CherraStays,%20I%20need%20help%20booking%20a%20hotel%20in%20Cherrapunji"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm border border-emerald-500/30 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp Helpline</span>
              </motion.a>
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
