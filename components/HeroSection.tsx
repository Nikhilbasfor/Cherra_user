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
    <div className="relative min-h-[92vh] sm:min-h-[96vh] flex flex-col justify-end pt-24 sm:pt-28 pb-10 sm:pb-16 overflow-hidden bg-[#090b0e]">
      {/* Background Drone Video with Cinematic Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-[1.02] filter brightness-90 transform-gpu"
        >
          <source src="/videos/cherrapunji-homestays-drone.webm" type="video/webm" />
          <source src="/videos/cherrapunji-drone.webm" type="video/webm" />
        </video>

        {/* Ambient Film Grain & Cinematic Multi-Layer Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#090b0e]/50 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#090b0e]/30 to-[#090b0e]/90 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-end">
        {/* Editorial Highlands Typography */}
        <div className="max-w-4xl mb-8 sm:mb-12 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-white/70 font-mono text-[11px] tracking-[0.2em] uppercase mb-4"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Sohra Plateau // 25.27° N, 91.73° E // 1,484m</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white leading-[1.05] uppercase"
          >
            Sanctuaries <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white/50">
              Above the Mist
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-xs sm:text-base text-white/70 font-normal max-w-2xl leading-relaxed"
          >
            Direct front-desk reservation at Cherrapunji’s finest cliffside retreats, canyon sanctuaries, and living root bridge lodges. Zero booking markups.
          </motion.p>
        </div>

        {/* Minimalist Architectural Booking Console */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full"
        >
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-black/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Field 1: Region / Property (5 cols) */}
              <div ref={areaDropdownRef} className="lg:col-span-4 relative">
                <div
                  onClick={() => setIsAreaDropdownOpen((prev) => !prev)}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      01 / Region or Stay
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-white/40 transition-transform ${
                        isAreaDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </label>
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
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
                      className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-[#111418] rounded-2xl border border-white/15 shadow-2xl p-2 space-y-2 max-h-72 overflow-y-auto"
                    >
                      {/* Search Filter Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search locality or property..."
                          value={areaSearchQuery}
                          onChange={(e) => setAreaSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400/60"
                          autoFocus
                        />
                      </div>

                      {/* All Areas Option */}
                      <button
                        type="button"
                        onClick={() => handleSelectArea("All Areas")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                          selectedArea === "All Areas" && !selectedHotelSlug
                            ? "bg-white text-black font-black"
                            : "hover:bg-white/[0.06] text-white/80"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          All Cherrapunji (Sohra)
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {hotelsList.length} stays
                        </span>
                      </button>

                      {/* Region Localities */}
                      {filteredDropdownOptions.areas.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest px-2 py-1">
                            Localities ({filteredDropdownOptions.areas.length})
                          </div>
                          <div className="space-y-0.5">
                            {filteredDropdownOptions.areas.map(({ area, count }) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => handleSelectArea(area)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                                  selectedArea === area && !selectedHotelSlug
                                    ? "bg-white text-black font-black"
                                    : "hover:bg-white/[0.06] text-white/80"
                                }`}
                              >
                                <span className="truncate">{area}</span>
                                <span className="text-[10px] font-mono text-white/40">
                                  {count} stay{count > 1 ? "s" : ""}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Specific Properties */}
                      {filteredDropdownOptions.hotels.length > 0 && (
                        <div className="pt-1 border-t border-white/10">
                          <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest px-2 py-1">
                            Individual Stays ({filteredDropdownOptions.hotels.length})
                          </div>
                          <div className="space-y-0.5">
                            {filteredDropdownOptions.hotels.map((h) => (
                              <button
                                key={h.id}
                                type="button"
                                onClick={() => handleSelectHotel(h)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                                  selectedHotelSlug === h.slug
                                    ? "bg-white text-black font-black"
                                    : "hover:bg-white/[0.06] text-white/80"
                                }`}
                              >
                                <div className="truncate">
                                  <p className="font-bold truncate">{h.name}</p>
                                  <p className="text-[10px] font-mono text-white/40">{h.area}, Sohra</p>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0 ml-2">
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
                <div className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    02 / Check-in
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Field 3: Check-Out (2.5 cols) */}
              <div className="lg:col-span-2">
                <div className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    03 / Check-out
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Field 4: Guests (2 cols) */}
              <div className="lg:col-span-2">
                <div className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    04 / Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                  >
                    <option value="1 Adult" className="bg-[#111418] text-white">1 Adult</option>
                    <option value="2 Adults" className="bg-[#111418] text-white">2 Adults</option>
                    <option value="2 Adults, 1 Child" className="bg-[#111418] text-white">2 Adults + 1 Child</option>
                    <option value="3+ Guests (Family)" className="bg-[#111418] text-white">3+ Guests (Family)</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Action Button (2 cols) */}
              <div className="lg:col-span-2 flex items-center h-full">
                <button
                  type="submit"
                  className="w-full h-full py-3.5 px-4 rounded-xl bg-white hover:bg-amber-300 text-black font-black uppercase tracking-wider text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
