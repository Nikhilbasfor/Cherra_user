"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ArrowRight,
  Compass,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";

interface HeroSectionProps {
  hotels?: Hotel[];
}

export default function HeroSection({ hotels }: HeroSectionProps = {}) {
  const router = useRouter();

  const [hotelsList, setHotelsList] = useState<Hotel[]>(hotels && hotels.length > 0 ? hotels : CHERRAPUNJI_HOTELS);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedHotelSlug, setSelectedHotelSlug] = useState<string | null>(null);
  const [areaSearchQuery, setAreaSearchQuery] = useState("");
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const areaDropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      setHotelsList(hotels);
    }
  }, [hotels]);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hotels && hotels.length > 0) return;
    let isMounted = true;
    getAllHotels()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setHotelsList(data);
        }
      })
      .catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, [hotels]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
        setIsAreaDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (checkIn) sessionStorage.setItem("cherra_checkIn", checkIn);
      if (checkOut) sessionStorage.setItem("cherra_checkOut", checkOut);
      if (guests) sessionStorage.setItem("cherra_guests", guests);
      if (selectedArea) sessionStorage.setItem("cherra_search_area", selectedArea);
    }
  }, [checkIn, checkOut, guests, selectedArea]);

  const availableAreasWithCount = React.useMemo(() => {
    const map = new Map<string, number>();
    hotelsList.forEach((h) => {
      if (h.area) {
        map.set(h.area, (map.get(h.area) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([area, count]) => ({ area, count }));
  }, [hotelsList]);

  const filteredDropdownOptions = React.useMemo(() => {
    const q = areaSearchQuery.toLowerCase().trim();
    if (!q) {
      return {
        areas: availableAreasWithCount,
        hotels: hotelsList,
      };
    }
    return {
      areas: availableAreasWithCount.filter((item) =>
        item.area.toLowerCase().includes(q)
      ),
      hotels: hotelsList.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.tagline.toLowerCase().includes(q)
      ),
    };
  }, [areaSearchQuery, availableAreasWithCount, hotelsList]);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setSelectedHotelSlug(null);
    setAreaSearchQuery("");
    setIsAreaDropdownOpen(false);
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedArea(hotel.area);
    setSelectedHotelSlug(hotel.slug);
    setAreaSearchQuery(hotel.name);
    setIsAreaDropdownOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHotelSlug) {
      router.push(`/hotels/${selectedHotelSlug}`);
      return;
    }
    const params = new URLSearchParams();
    if (selectedArea && selectedArea !== "All Areas") params.set("area", selectedArea);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <>
      <div className="relative min-h-[92vh] sm:min-h-[95vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-14 overflow-hidden bg-slate-950">
        {/* Background Warm Luxury Timber Resort & Pool View - Crystal Clear Scenery */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cherrapunji-resort-warm.jpg"
            alt="Cherrapunji Luxury Resort and Mountain View"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center transform-gpu"
          />

          {/* Gentle, Natural Atmospheric Overlay - NO black blurring, bright and visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/35 pointer-events-none" />
        </div>

        {/* Centered Bold Content - Clean & uncluttered matching reference */}
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Location & Heritage Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-2 sm:mb-3"
          >
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-amber-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              SOHRA, CHERRAPUNJI • THE CLOUD HIGHLANDS
            </span>
          </motion.div>

          {/* Big Bold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-3xl"
          >
            Where Every Stay <br /> Feels Like Home
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-3.5 sm:mt-5 text-sm sm:text-base text-white/95 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            Verified cliffside resorts, pine cottage hideaways & authentic Khasi homestays in Cherrapunji. Direct front-desk tariffs with zero booking markups.
          </motion.p>

          {/* Main Call To Action Button (Prominent Warm Orange Pill Button) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 sm:mt-9"
          >
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="px-9 sm:px-12 py-3.5 sm:py-4 rounded-full bg-[#df7a28] hover:bg-[#cf6a18] text-white font-sans font-bold uppercase tracking-widest text-sm sm:text-base shadow-2xl shadow-black/60 transition-all cursor-pointer active:scale-95 flex items-center gap-2.5 mx-auto border-2 border-white/20 hover:border-white/40"
            >
              <span>BOOK STAY NOW</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Interactive Booking Console Modal - Opens smoothly when user clicks BOOK STAY NOW */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-4xl bg-[#090d0b] rounded-3xl border border-white/20 shadow-2xl shadow-black/90 p-4 sm:p-6 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base sm:text-xl font-serif font-bold text-white">
                    Check Dates & Reserve in Cherrapunji
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 font-sans">
                    Guaranteed direct front-desk tariffs across all 66+ verified stays
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close booking search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* The Booking Form */}
              <form
                onSubmit={(e) => {
                  handleSearch(e);
                  setIsBookingModalOpen(false);
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
                  {/* Field 1: Region / Property (4 cols desktop, full width mobile) */}
                  <div ref={areaDropdownRef} className="col-span-2 sm:col-span-2 lg:col-span-4 relative">
                    <div
                      onClick={() => setIsAreaDropdownOpen((prev) => !prev)}
                      className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-500/70 transition-all cursor-pointer shadow-sm"
                    >
                      <label className="block text-[10px] font-mono font-black text-amber-950 uppercase tracking-widest mb-1 flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          Region or Stay
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-stone-700 transition-transform ${
                            isAreaDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </label>
                      <div className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                        {selectedHotelSlug
                          ? areaSearchQuery || selectedArea
                          : selectedArea === "All Areas"
                          ? "All Cherrapunji (Sohra)"
                          : selectedArea}
                      </div>
                    </div>

                    {/* Combobox Dropdown */}
                    <AnimatePresence>
                      {isAreaDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full lg:top-auto lg:bottom-full left-0 right-0 mt-2 lg:mt-0 lg:mb-2 z-50 bg-[#faf9f6] rounded-2xl border border-stone-300 shadow-2xl shadow-black/80 p-2.5 space-y-2 max-h-72 overflow-y-auto text-slate-900"
                        >
                          {/* Search Filter Input */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search locality or property..."
                              value={areaSearchQuery}
                              onChange={(e) => setAreaSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 font-medium"
                              autoFocus
                            />
                          </div>

                          {/* All Areas Option */}
                          <button
                            type="button"
                            onClick={() => handleSelectArea("All Areas")}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                              selectedArea === "All Areas" && !selectedHotelSlug
                                ? "bg-[#df9e38] text-slate-950 font-bold"
                                : "hover:bg-stone-200/70 text-slate-800"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />
                              All Cherrapunji (Sohra)
                            </span>
                            <span className="text-[10px] font-mono opacity-70">
                              {hotelsList.length} stays
                            </span>
                          </button>

                          {/* Region Localities */}
                          {filteredDropdownOptions.areas.length > 0 && (
                            <div>
                              <div className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest px-2 py-1">
                                Localities ({filteredDropdownOptions.areas.length})
                              </div>
                              <div className="space-y-0.5">
                                {filteredDropdownOptions.areas.map(({ area, count }) => (
                                  <button
                                    key={area}
                                    type="button"
                                    onClick={() => handleSelectArea(area)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                                      selectedArea === area && !selectedHotelSlug
                                        ? "bg-[#df9e38] text-slate-950 font-bold"
                                        : "hover:bg-stone-200/70 text-slate-800"
                                    }`}
                                  >
                                    <span className="truncate">{area}</span>
                                    <span className="text-[10px] font-mono opacity-70">
                                      {count} stay{count > 1 ? "s" : ""}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Specific Properties */}
                          {filteredDropdownOptions.hotels.length > 0 && (
                            <div className="pt-1 border-t border-stone-200">
                              <div className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest px-2 py-1">
                                Individual Stays ({filteredDropdownOptions.hotels.length})
                              </div>
                              <div className="space-y-0.5">
                                {filteredDropdownOptions.hotels.map((h) => (
                                  <button
                                    key={h.id}
                                    type="button"
                                    onClick={() => handleSelectHotel(h)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                                      selectedHotelSlug === h.slug
                                        ? "bg-[#df9e38] text-slate-950 font-bold"
                                        : "hover:bg-stone-200/70 text-slate-800"
                                    }`}
                                  >
                                    <div className="truncate">
                                      <p className="font-bold truncate text-slate-950">{h.name}</p>
                                      <p className="text-[10px] font-mono text-stone-500">{h.area}, Sohra</p>
                                    </div>
                                    <span className="text-[11px] font-mono font-bold text-amber-800 shrink-0 ml-2">
                                      ₹{h.pricePerNight}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Field 2: Check-In (1 col mobile, 2 cols desktop) */}
                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <div className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-500/70 transition-all shadow-sm">
                      <label className="block text-[10px] font-mono font-black text-amber-950 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-950 border-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 shadow-none cursor-pointer [color-scheme:light]"
                      />
                    </div>
                  </div>

                  {/* Field 3: Check-Out (1 col mobile, 2 cols desktop) */}
                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <div className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-500/70 transition-all shadow-sm">
                      <label className="block text-[10px] font-mono font-black text-amber-950 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Check-out
                      </label>
                      <input
                        type="date"
                        min={checkIn || todayStr}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-950 border-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 shadow-none cursor-pointer [color-scheme:light]"
                      />
                    </div>
                  </div>

                  {/* Field 4: Guests (full width mobile, 2 cols desktop) */}
                  <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                    <div className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-500/70 transition-all shadow-sm">
                      <label className="block text-[10px] font-mono font-black text-amber-950 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-950 border-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 shadow-none cursor-pointer [color-scheme:light]"
                      >
                        <option value="1 Adult" className="bg-white text-slate-950 font-medium">1 Adult</option>
                        <option value="2 Adults" className="bg-white text-slate-950 font-medium">2 Adults</option>
                        <option value="2 Adults, 1 Child" className="bg-white text-slate-950 font-medium">2 Adults + 1 Child</option>
                        <option value="3+ Guests (Family)" className="bg-white text-slate-950 font-medium">3+ Guests (Family)</option>
                      </select>
                    </div>
                  </div>

                  {/* Field 5: Action Button (full width mobile, 2 cols desktop) */}
                  <div className="col-span-2 sm:col-span-2 lg:col-span-2 flex items-center h-full">
                    <button
                      type="submit"
                      className="w-full h-full py-3.5 px-4 rounded-xl bg-[#df9e38] hover:bg-[#cf8e28] text-slate-950 font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border-0"
                    >
                      <span>Explore Stays</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
