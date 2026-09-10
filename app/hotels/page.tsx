"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  MapPin,
  Star,
  Check,
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_AREAS } from "@/lib/mockData";
import { Hotel } from "@/lib/types";

function HotelsContent() {
  const searchParams = useSearchParams();

  const initialArea = searchParams.get("area") || "All Areas";
  const initialStars = searchParams.get("stars")
    ? searchParams.get("stars")!.split(",").map(Number)
    : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedStars, setSelectedStars] = useState<number[]>(initialStars);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);

  const allAmenitiesList = [
    "Free High-Speed Wi-Fi",
    "Mountain View",
    "Geyser / 24hr Hot Water",
    "Bonfire Nights",
    "Fine Dining Restaurant",
    "Infinity View Pool",
    "Private Balcony",
  ];

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedArea("All Areas");
    setSelectedStars([]);
    setMaxPrice(15000);
    setSelectedAmenities([]);
    setSortBy("featured");
  };

  const filteredHotels = useMemo(() => {
    let list = [...CHERRAPUNJI_HOTELS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
    }

    if (selectedArea && selectedArea !== "All Areas") {
      list = list.filter((h) => h.area.toLowerCase().includes(selectedArea.toLowerCase()));
    }

    if (selectedStars.length > 0) {
      list = list.filter((h) => selectedStars.includes(h.starRating));
    }

    list = list.filter((h) => h.pricePerNight <= maxPrice);

    if (selectedAmenities.length > 0) {
      list = list.filter((h) =>
        selectedAmenities.every((required) =>
          h.amenities.some((a) => a.toLowerCase().includes(required.toLowerCase()))
        )
      );
    }

    if (sortBy === "price_asc") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "stars") {
      list.sort((a, b) => b.starRating - a.starRating);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [searchQuery, selectedArea, selectedStars, maxPrice, selectedAmenities, sortBy]);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Header */}
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Cherrapunji Accommodations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Hotels & Resorts in Cherrapunji (Sohra)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredHotels.length} verified stays in Meghalaya
            </p>
          </div>

          {/* Grid ↔ Map View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "map"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {viewMode === "map" ? (
          <div className="space-y-6">
            <MapExplorer
              hotels={filteredHotels}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onEnquire={(h) => handleOpenInquiry(h)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Filter Sidebar (3 cols) */}
            <aside className="lg:col-span-3 space-y-5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sticky top-24 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                    Filters
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                {/* Text Search */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Search Stays
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Polo, Cliff view..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Locality / Region
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {CHERRAPUNJI_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Star Classification
                  </label>
                  <div className="space-y-1">
                    {[5, 4, 3, 2].map((stars) => {
                      const isChecked = selectedStars.includes(stars);
                      return (
                        <button
                          key={stars}
                          onClick={() => toggleStar(stars)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                              : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                                isChecked ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white"
                              }`}
                            >
                              {isChecked && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: stars }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="ml-1">{stars} Star</span>
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            ({CHERRAPUNJI_HOTELS.filter((h) => h.starRating === stars).length})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Max Tariff</span>
                    <span className="text-slate-900 font-bold">Up to ₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={15000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>₹2,000</span>
                    <span>₹15,000+</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Key Amenities
                  </label>
                  <div className="space-y-1">
                    {allAmenitiesList.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                              : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 ${
                              isChecked ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span className="truncate">{amenity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Listings Area (9 cols) */}
            <main className="lg:col-span-9 space-y-5">
              {/* Sort Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
                <p className="text-xs text-slate-500">
                  Showing <span className="text-slate-900 font-bold">{filteredHotels.length}</span> verified properties
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="featured">Featured Stays</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Guest Rating</option>
                    <option value="stars">Star Rating</option>
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onEnquire={(h) => handleOpenInquiry(h)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Stays Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters or resetting price and star ratings.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={selectedHotelForInquiry}
      />

      <Footer />
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center text-emerald-700 font-semibold text-sm">
          Loading Cherrapunji Stays...
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  );
}
