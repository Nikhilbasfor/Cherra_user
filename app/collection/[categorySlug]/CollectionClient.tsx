"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  MapPin,
  Heart,
  Users,
  Mountain,
  Wallet,
  Trees,
  ArrowRight,
  Star,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import InquiryModal from "@/components/InquiryModal";
import { TravelCategory } from "@/lib/categories";
import { Hotel } from "@/lib/types";

interface CollectionClientProps {
  category: TravelCategory;
  hotels: Hotel[];
  allCategories: TravelCategory[];
}

export default function CollectionClient({
  category,
  hotels,
  allCategories,
}: CollectionClientProps) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("All Areas");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

  const areasList = useMemo(() => {
    const set = new Set<string>();
    hotels.forEach((h) => {
      if (h.area) set.add(h.area);
    });
    return ["All Areas", ...Array.from(set)];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    let list = [...hotels];
    if (selectedArea !== "All Areas") {
      list = list.filter((h) => h.area.toLowerCase().includes(selectedArea.toLowerCase()));
    }
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [hotels, selectedArea, sortBy]);

  const otherCategories = useMemo(() => {
    return allCategories.filter((c) => c.slug !== category.slug);
  }, [allCategories, category.slug]);

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Breadcrumb Navigation */}
      <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-white/40 overflow-hidden uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors shrink-0">
            Home
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/hotels" className="hover:text-white transition-colors shrink-0">
            All Stays
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-bold truncate">{category.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-[#0c0e12] text-white relative overflow-hidden py-12 sm:py-16 border-b border-white/10">
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-amber-400 text-xs font-mono font-bold uppercase tracking-widest border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{category.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              {category.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm lg:text-base text-white/60 font-mono leading-relaxed">
              {category.description}
            </p>

            {/* Direct Booking Guarantees */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                100% Physically Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Direct Front-Desk Tariffs
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                Zero Booking Commission
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111418] p-4 rounded-2xl border border-white/10 shadow-2xl mb-8">
          <p className="text-xs font-mono text-white/50">
            Showing <span className="font-bold text-white">{filteredHotels.length}</span> curated stays for{" "}
            <span className="text-amber-400 font-bold uppercase">{category.shortName}</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Locality Filter */}
            {areasList.length > 2 && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/50">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white"
                >
                  {areasList.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-white/50">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white"
              >
                <option value="featured">Featured Stays</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Guest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEnquire={(h) => handleOpenInquiry(h)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111418] rounded-3xl border border-white/10 p-8 space-y-4">
            <MapPin className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-base font-black uppercase tracking-tight text-white">No matching stays in {selectedArea}</h3>
            <p className="text-xs font-mono text-white/50">
              Try switching back to &quot;All Areas&quot; to view all verified options in Cherrapunji.
            </p>
            <button
              onClick={() => setSelectedArea("All Areas")}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
            >
              Reset Locality Filter
            </button>
          </div>
        )}

        {/* Frequently Asked Questions */}
        {category.faqs && category.faqs.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25">
                  Knowledge Base
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-3">
                  Questions About {category.shortName} in Cherrapunji
                </h2>
                <p className="text-xs sm:text-sm text-white/50 font-mono mt-1.5">
                  Essential arrival and accommodation insights before finalizing your stay.
                </p>
              </div>

              <div className="space-y-3">
                {category.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#111418] rounded-2xl border border-white/10 overflow-hidden shadow-lg transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-amber-400" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-white/70 font-mono leading-relaxed border-t border-white/10 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Explore Other Curated Collections Cross-Links */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Explore More Cherrapunji Stay Collections
            </h3>
            <p className="text-xs font-mono text-white/50 mt-1.5">
              Curated architectural selections for every travel style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/collection/${other.slug}`}
                className="group p-5 bg-[#111418] rounded-2xl border border-white/10 hover:border-amber-400/40 hover:bg-[#15191f] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1.5">
                    {other.heroBadge}
                  </span>
                  <h4 className="font-black uppercase tracking-tight text-white text-base group-hover:text-amber-400 transition-colors">
                    {other.name}
                  </h4>
                  <p className="text-xs text-white/50 font-mono mt-2 line-clamp-2 leading-relaxed">
                    {other.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <span>View Verified Stays</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={selectedHotelForInquiry}
      />

      <Footer />
    </div>
  );
}
