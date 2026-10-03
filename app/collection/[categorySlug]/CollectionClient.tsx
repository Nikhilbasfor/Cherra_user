"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ChevronDown,
  ArrowUpDown,
  Compass,
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
    <div className="min-h-screen bg-[#edf7f2] text-slate-900 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Breadcrumb Navigation */}
      <div className="pt-20 sm:pt-24 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-emerald-900/10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 overflow-hidden uppercase tracking-wider">
          <Link href="/" className="hover:text-slate-900 transition-colors shrink-0">
            Home
          </Link>
          <span>/</span>
          <Link href="/hotels" className="hover:text-slate-900 transition-colors shrink-0">
            All Stays
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{category.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="py-8 sm:py-12 border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/10 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-800/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{category.heroBadge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              {category.title}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {category.description}
            </p>

            {/* Direct Booking Guarantees */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-3 border-t border-emerald-900/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                100% Physically Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Direct Front-Desk Tariffs
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-700" />
                Zero Booking Commission
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-xs mb-6">
          <p className="text-xs font-mono text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> curated stays for{" "}
            <span className="text-emerald-800 font-bold uppercase">{category.shortName}</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Locality Filter */}
            {areasList.length > 2 && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
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
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEnquire={(h) => handleOpenInquiry(h)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-emerald-900/10 p-6 space-y-3">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">No matching stays in {selectedArea}</h3>
            <p className="text-xs font-mono text-slate-500">
              Try switching back to &quot;All Areas&quot; to view all verified options in Cherrapunji.
            </p>
            <button
              onClick={() => setSelectedArea("All Areas")}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
            >
              Reset Locality Filter
            </button>
          </div>
        )}

        {/* Frequently Asked Questions */}
        {category.faqs && category.faqs.length > 0 && (
          <section className="mt-14 pt-10 border-t border-emerald-900/10">
            <div className="max-w-3xl mx-auto">
              <div className="text-left mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Knowledge Base
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Questions About {category.shortName} in Cherrapunji
                </h2>
              </div>

              <div className="space-y-2.5">
                {category.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-emerald-900/10 overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-800 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-emerald-700" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
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
        <section className="mt-14 pt-10 border-t border-emerald-900/10">
          <div className="text-left mb-6">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
              Explore More Cherrapunji Stay Collections
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Curated selections for every travel preference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/collection/${other.slug}`}
                className="group p-5 bg-white rounded-xl border border-emerald-900/10 hover:border-emerald-700/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block mb-1">
                    {other.heroBadge}
                  </span>
                  <h4 className="font-black uppercase tracking-tight text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                    {other.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {other.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
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
