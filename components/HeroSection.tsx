"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";

export default function HeroSection() {
  const router = useRouter();

  const [hotelsList, setHotelsList] = useState<Hotel[]>(CHERRAPUNJI_HOTELS);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedHotelSlug, setSelectedHotelSlug] = useState<string | null>(null);
  const [areaSearchQuery, setAreaSearchQuery] = useState("");
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const videoRef = useRef<HTMLVideoElement>(null);
  const areaDropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

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
    <div className="relative min-h-[90vh] sm:min-h-[94vh] flex flex-col justify-end pt-24 sm:pt-28 pb-10 sm:pb-14 overflow-hidden bg-[#064e3b]">
      {/* Background Drone Video with Cinematic Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-[1.02] filter brightness-95 transform-gpu"
        >
          <source src="/videos/cherrapunji-homestays-drone.webm" type="video/webm" />
          <source src="/videos/cherrapunji-drone.webm" type="video/webm" />
        </video>

        {/* Ambient Nature Fade to lower section */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-emerald-950/30 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-end">
        {/* Editorial Highlands Typography */}
        <div className="max-w-4xl mb-6 sm:mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-emerald-200 font-mono text-[11px] tracking-[0.2em] uppercase mb-4"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Sohra, Meghalaya • Verified Nature Stays</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white leading-[1.05] uppercase drop-shadow-md"
          >
            Sanctuaries <br />
            <span className="text-amber-300">
              Above the Mist
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-3 text-xs sm:text-base text-emerald-50/90 font-medium max-w-2xl leading-relaxed drop-shadow"
          >
            Direct front-desk reservation at Cherrapunji’s finest cliffside retreats, canyon sanctuaries, and living root bridge lodges. Zero booking markups.
          </motion.p>
        </div>

        {/* Minimalist Architectural Booking Console - White & Light Mint */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full"
        >
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-emerald-100 shadow-2xl text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Field 1: Region / Property (4 cols) */}
              <div ref={areaDropdownRef} className="lg:col-span-4 relative">
                <div
                  onClick={() => setIsAreaDropdownOpen((prev) => !prev)}
                  className="p-3 rounded-xl bg-[#edf7f2] hover:bg-[#e3f2ea] border border-emerald-200/80 hover:border-emerald-400/60 transition-all cursor-pointer"
                >
                  <label className="block text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Region or Stay
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-500 transition-transform ${
                        isAreaDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </label>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
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
                      className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white rounded-2xl border border-emerald-200 shadow-2xl p-2.5 space-y-2 max-h-72 overflow-y-auto text-slate-900"
                    >
                      {/* Search Filter Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search locality or property..."
                          value={areaSearchQuery}
                          onChange={(e) => setAreaSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#edf7f2] border border-emerald-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
                          autoFocus
                        />
                      </div>

                      {/* All Areas Option */}
                      <button
                        type="button"
                        onClick={() => handleSelectArea("All Areas")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                          selectedArea === "All Areas" && !selectedHotelSlug
                            ? "bg-emerald-700 text-white font-bold"
                            : "hover:bg-[#edf7f2] text-slate-700"
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
                          <div className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest px-2 py-1">
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
                                    ? "bg-emerald-700 text-white font-bold"
                                    : "hover:bg-[#edf7f2] text-slate-700"
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
                        <div className="pt-1 border-t border-slate-100">
                          <div className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest px-2 py-1">
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
                                    ? "bg-emerald-700 text-white font-bold"
                                    : "hover:bg-[#edf7f2] text-slate-700"
                                }`}
                              >
                                <div className="truncate">
                                  <p className="font-bold truncate">{h.name}</p>
                                  <p className="text-[10px] font-mono text-slate-500">{h.area}, Sohra</p>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-amber-700 shrink-0 ml-2">
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

              {/* Field 2: Check-In (2.5 cols) */}
              <div className="lg:col-span-2">
                <div className="p-3 rounded-xl bg-[#edf7f2] hover:bg-[#e3f2ea] border border-emerald-200/80 hover:border-emerald-400/60 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Field 3: Check-Out (2.5 cols) */}
              <div className="lg:col-span-2">
                <div className="p-3 rounded-xl bg-[#edf7f2] hover:bg-[#e3f2ea] border border-emerald-200/80 hover:border-emerald-400/60 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Field 4: Guests (2 cols) */}
              <div className="lg:col-span-2">
                <div className="p-3 rounded-xl bg-[#edf7f2] hover:bg-[#e3f2ea] border border-emerald-200/80 hover:border-emerald-400/60 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer [color-scheme:light]"
                  >
                    <option value="1 Adult" className="bg-white text-slate-900">1 Adult</option>
                    <option value="2 Adults" className="bg-white text-slate-900">2 Adults</option>
                    <option value="2 Adults, 1 Child" className="bg-white text-slate-900">2 Adults + 1 Child</option>
                    <option value="3+ Guests (Family)" className="bg-white text-slate-900">3+ Guests (Family)</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Action Button (2 cols) */}
              <div className="lg:col-span-2 flex items-center h-full">
                <button
                  type="submit"
                  className="w-full h-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
