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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 relative">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Breadcrumb Navigation */}
      <div className="pt-20 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden">
          <Link href="/" className="hover:text-emerald-700 transition-colors shrink-0">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/hotels" className="hover:text-emerald-700 transition-colors shrink-0">
            Hotels
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold truncate">{category.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-slate-900 text-white relative overflow-hidden py-10 sm:py-14 border-b border-slate-800">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{category.heroBadge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {category.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
              {category.description}
            </p>

            {/* Direct Booking Guarantees */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Physically Verified Properties
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Direct Front-Desk Tariffs (Zero Markup)
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Prompt WhatsApp Concierge Verification
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <p className="text-xs text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> curated stays for{" "}
            <span className="font-semibold text-emerald-800">{category.shortName}</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Locality Filter */}
            {areasList.length > 2 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
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
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
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
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching stays in {selectedArea}</h3>
            <p className="text-xs text-slate-500">
              Try switching back to &quot;All Areas&quot; to view all verified options in Cherrapunji.
            </p>
            <button
              onClick={() => setSelectedArea("All Areas")}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs"
            >
              Reset Locality Filter
            </button>
          </div>
        )}

        {/* Frequently Asked Questions (Google Rich Snippets SEO) */}
        {category.faqs && category.faqs.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80">
                  Traveler Knowledge Base
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Frequently Asked Questions About {category.shortName} in Cherrapunji
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Everything you need to know before booking your stay in Sohra, Meghalaya.
                </p>
              </div>

              <div className="space-y-3">
                {category.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-emerald-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
        <section className="mt-16 pt-10 border-t border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
              Explore More Cherrapunji Stay Collections
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Find the perfect match for every travel style and group size.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/collection/${other.slug}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    {other.heroBadge}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {other.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {other.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
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
