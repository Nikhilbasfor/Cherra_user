"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  CloudRain,
  Trees,
  Footprints,
  PhoneCall,
  ShieldCheck,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HotelCard from "@/components/HotelCard";
import HomestaysDroneShowcase from "@/components/HomestaysDroneShowcase";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import {
  getAllHotels,
  getAllFAQs,
  getSiteStats,
  getAllAttractions,
  subscribeToSiteStats,
  subscribeToHotels,
  subscribeToAttractions,
  subscribeToFAQs,
} from "@/lib/firebase";
import { Hotel, FAQItem, SiteStats, Attraction } from "@/lib/types";

const HOME_COLLECTION_TABS = [
  { id: "all", label: "All Stays" },
  { id: "cliffside", label: "Cliffside & Falls" },
  { id: "resorts", label: "Forest Resorts" },
  { id: "cottages", label: "Pine Cottages" },
  { id: "homestays", label: "Heritage Homestays" },
];

interface HomePageClientProps {
  initialStats: SiteStats;
  initialHotels: Hotel[];
  initialAttractions: Attraction[];
  initialFaqs: FAQItem[];
}

export default function HomePageClient({
  initialStats,
  initialHotels,
  initialAttractions,
  initialFaqs,
}: HomePageClientProps) {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [stats, setStats] = useState<SiteStats>(initialStats);
  const [faqsList, setFaqsList] = useState<FAQItem[]>(initialFaqs);
  const [attractionsList, setAttractionsList] = useState<Attraction[]>(initialAttractions);

  const currentInventory = useMemo(() => {
    return hotels && hotels.length > 0 ? `${hotels.length}+` : (stats.verifiedStays || "6+");
  }, [hotels, stats.verifiedStays]);

  useEffect(() => {
    let isMounted = true;

    const unsubStats = subscribeToSiteStats((remoteStats) => {
      if (isMounted && remoteStats) {
        setStats((prev) => ({
          ...prev,
          ...remoteStats,
        }));
      }
    });

    const unsubHotels = subscribeToHotels((remoteHotels) => {
      if (isMounted && remoteHotels && remoteHotels.length > 0) {
        setHotels(remoteHotels);
      }
    });

    const unsubAttractions = subscribeToAttractions((remoteAttractions) => {
      if (isMounted && remoteAttractions && remoteAttractions.length > 0) {
        setAttractionsList(remoteAttractions);
      }
    });

    const unsubFaqs = subscribeToFAQs((remoteFaqs) => {
      if (isMounted && remoteFaqs && remoteFaqs.length > 0) {
        setFaqsList(remoteFaqs);
      }
    });

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("cherra_realtime_sync");
        channel.onmessage = (event) => {
          if (!isMounted) return;
          if (event.data?.type === "STATS_UPDATED" && event.data.payload) {
            setStats((prev) => ({ ...prev, ...event.data.payload }));
          } else if (event.data?.type === "HOTELS_UPDATED" && event.data.payload) {
            setHotels(event.data.payload);
          } else if (event.data?.type === "REFRESH_ALL") {
            loadAll();
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel warning:", err);
      }
    }

    const loadAll = () => {
      getAllHotels()
        .then((data) => {
          if (isMounted && data && data.length > 0) setHotels(data);
        })
        .catch(console.error);

      getSiteStats()
        .then((s) => {
          if (isMounted && s) setStats(s);
        })
        .catch(console.warn);

      getAllFAQs()
        .then((f) => {
          if (isMounted && f && f.length > 0) setFaqsList(f);
        })
        .catch(console.warn);

      getAllAttractions()
        .then((a) => {
          if (isMounted && a && a.length > 0) setAttractionsList(a);
        })
        .catch(console.warn);
    };

    const interval = setInterval(loadAll, 4000);

    return () => {
      isMounted = false;
      unsubStats();
      unsubHotels();
      unsubAttractions();
      unsubFaqs();
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
      clearInterval(interval);
    };
  }, []);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

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
          h.tagline.toLowerCase().includes("homestay") ||
          h.starRating <= 3
      );
    }
    return hotels;
  }, [hotels, activeCollectionTab]);

  const defaultFaqs = [
    {
      q: "What is the prime season to visit Cherrapunji (Sohra)?",
      a: "Cherrapunji is breathtaking throughout the year. For roaring waterfalls, lush gorges, and mystical cloud formations, June through September provides prime monsoon spectacle. For hiking to the Double Decker Living Root Bridge, natural turquoise pools, and crisp clear skies, October through April is ideal.",
    },
    {
      q: "How does CherraStays provide verified direct front-desk tariffs?",
      a: "All reservations connect directly with local property management in Sohra. By removing online travel agency markups (15-25%), guests obtain direct front-desk tariffs alongside immediate WhatsApp concierge verification.",
    },
    {
      q: "Are Cherrapunji retreats safe for families and solo travelers?",
      a: "Meghalaya is globally renowned for its matrilineal society, peaceful culture, and warm Khasi hospitality. All hotels in our collection are physically inspected properties adhering to strict safety and cleanliness benchmarks.",
    },
    {
      q: "Can retreats coordinate cab transfers from Guwahati or Shillong airport?",
      a: "Yes. Our partner resorts and boutique stays coordinate reliable cab pickups and drop-offs from Guwahati Airport (GAU) and Shillong Airport (SHL) with verified local drivers.",
    },
    {
      q: "Do all properties include 24/7 hot water geysers?",
      a: "Yes. Because Cherrapunji stays crisp and cool throughout the year, every stay in our curated portfolio features dependable hot water geysers in private bathrooms.",
    },
  ];

  const displayedFaqs =
    faqsList && faqsList.length > 0
      ? faqsList.map((f) => ({ q: f.question, a: f.answer }))
      : defaultFaqs;

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Cinematic Hero */}
      <HeroSection />

      {/* Architectural Metrics Band (Zero Clutter, Zero Emojis) */}
      <section className="relative z-10 border-y border-white/10 bg-[#0c0f13] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Metric 1 */}
            <div className="pt-4 md:pt-0 md:px-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                01 // Verified Inventory
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentInventory}</p>
              <p className="text-xs text-white/50 mt-1">Curated Sanctuaries in Sohra</p>
            </div>

            {/* Metric 2 */}
            <div className="pt-4 md:pt-0 md:px-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400/80 block mb-1">
                02 // Guest Satisfaction
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.satisfactionRate}</p>
              <p className="text-xs text-white/50 mt-1">Superb Guest Review Score</p>
            </div>

            {/* Metric 3 */}
            <div className="pt-4 md:pt-0 md:px-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                03 // Rate Integrity
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.tariffPledge}</p>
              <p className="text-xs text-white/50 mt-1">Zero Commission Markups</p>
            </div>

            {/* Metric 4 */}
            <div className="pt-4 md:pt-0 md:px-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400/80 block mb-1">
                04 // Concierge Speed
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stats.avgResponseTime}</p>
              <p className="text-xs text-white/50 mt-1">Average WhatsApp Confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Drone Aerial Showcase */}
      <HomestaysDroneShowcase
        onOpenInquiry={(hotelId) => {
          const found = hotels.find((h) => h.id === hotelId);
          handleOpenInquiry(found);
        }}
      />

      {/* Curated Sanctuaries Section */}
      <section id="hotels" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 block mb-2">
              02 // The Portfolio
            </span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-[-0.03em] text-white">
              Curated Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-xl leading-relaxed">
              From cliff-edge heated log cabins facing Nohsngithiang Falls to secluded pine cottages and village basecamps.
            </p>
          </div>

          {/* Minimalist Dark Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {HOME_COLLECTION_TABS.map((tab) => {
              const isActive = activeCollectionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCollectionTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-extrabold shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Interactive Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
          ))}
        </div>

        {/* View All Stays Action */}
        <div className="mt-14 text-center">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-98"
          >
            <span>Explore All Stays With Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Interactive Map Explorer Section */}
      <section id="map-explorer" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <MapExplorer
          hotels={hotels}
          attractions={attractionsList}
          onEnquire={(h) => handleOpenInquiry(h)}
        />
      </section>

      {/* Destination Spotlight: Architectural Highlights */}
      <section id="about-cherrapunji" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-white/10">
        <div className="text-left max-w-3xl mb-14">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 block mb-2">
            03 // Natural Geography
          </span>
          <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-[-0.03em] text-white">
            Why Journey to Sohra?
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-3 leading-relaxed">
            Perched at 4,800 feet in Meghalaya’s East Khasi Hills, Cherrapunji is an otherworldly plateau of sheer limestone cliffs, cascading monsoon torrents, and indigenous bio-engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Spotlight 1 */}
          <div className="p-8 rounded-2xl bg-[#111418] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 flex items-center justify-center mb-6">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-1">Feature 01</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">The Abode of Clouds</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Watch clouds rise from the Bangladesh plains directly over your private balcony. Cherrapunji is home to hundreds of roaring seasonal and perennial cascades.
              </p>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="p-8 rounded-2xl bg-[#111418] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 flex items-center justify-center mb-6">
                <Trees className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-1">Feature 02</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Living Root Bridges</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Hike into the deep canyon of Nongriat to cross double-decker living root bridges, bio-engineered across generations by indigenous Khasi master arborists.
              </p>
            </div>
          </div>

          {/* Spotlight 3 */}
          <div className="p-8 rounded-2xl bg-[#111418] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 flex items-center justify-center mb-6">
                <Footprints className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-1">Feature 03</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Subterranean Canyons</h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Traverse prehistoric limestone cave chambers in Mawsmai and Arwah embedded with marine fossils, and gaze down the sheer 1,115-foot Nohkalikai drop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Editorial FAQ Accordion */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-white/10">
        <div className="text-left mb-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 block mb-2">
            04 // Expedition Notes
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[-0.03em] text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-white/50 text-xs sm:text-sm mt-2">
            Essential intelligence on terrain, reservations, seasonal waterfall flows, and local logistics.
          </p>
        </div>

        <div className="space-y-3">
          {displayedFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#111418] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
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
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5">
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

      {/* Concierge VIP Direct Booking Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-[#111418] border border-white/15 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-white/[0.05] px-3 py-1 rounded-full border border-white/10 inline-block">
              Dedicated Sohra Concierge
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-snug">
              Planning a Journey to Cherrapunji? Let Our Local Specialists Assist.
            </h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Submit your dates and requirements. We verify real-time room availability across premier Sohra retreats and deliver guaranteed direct front-desk tariffs with zero booking markups.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => handleOpenInquiry()}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-200 text-black font-extrabold uppercase tracking-wider text-xs shadow-xl transition-all cursor-pointer"
              >
                Request Custom Itinerary
              </button>
              <a
                href="https://wa.me/919864879505?text=Hi%20CherraStays,%20I%20need%20help%20booking%20a%20hotel%20in%20Cherrapunji"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span className="font-mono">WhatsApp: +91 98648 79505</span>
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
