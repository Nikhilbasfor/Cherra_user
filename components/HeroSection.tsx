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

  const videoRef = useRef<HTMLVideoElement>(null);
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
    if (!isDesktop || !videoRef.current) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isDesktop]);

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
    <div className="relative min-h-[90vh] sm:min-h-[94vh] flex flex-col justify-end pt-24 sm:pt-28 pb-10 sm:pb-14 overflow-hidden bg-slate-950">
      {/* Background Drone Video on Desktop ONLY | Serene Misty Photography on Mobile */}
      <div className="absolute inset-0 z-0">
        {isDesktop ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover object-center scale-[1.02] filter brightness-95 transform-gpu"
          >
            <source src="/videos/cherrapunji-drone.webm" type="video/webm" />
            <source src="/videos/cherrapunji-waterfall.mp4" type="video/mp4" />
          </video>
        ) : (
          /* Mobile Serene Luxury Photography Background (Zero video download/decoding on mobile) */
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85')`,
            }}
          />
        )}

        {/* Ambient Cinematic Vignette - lets natural scenery breathe without heavy green tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20 pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-end">
        {/* Editorial Highlands Typography */}
        <div className="max-w-4xl mb-6 sm:mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3"
          >
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase flex items-center gap-1.5">
              <span className="text-amber-400">•</span>
              <span>THE CLOUD HIGHLANDS OF SOHRA</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-emerald-200/90 uppercase bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              14+ SANCTUARIES
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md"
          >
            Sanctuaries <span className="italic font-serif font-normal text-amber-300">in the</span> <br />
            Mist
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-3 text-xs sm:text-base text-emerald-50/90 font-light max-w-2xl leading-relaxed drop-shadow"
          >
            Private cliff pavilions and thermal hideaways suspended above Nohkalikai Falls and Sohra gorges. Direct front-desk tariffs with zero booking markups.
          </motion.p>
        </div>

        {/* Minimalist Architectural Booking Console - Luxury Obsidian Black Variant */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full"
        >
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-[#090d0b] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl shadow-black/80 text-left"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
              {/* Field 1: Region / Property (4 cols desktop, full width mobile) */}
              <div ref={areaDropdownRef} className="col-span-2 sm:col-span-2 lg:col-span-4 relative">
                <div
                  onClick={() => setIsAreaDropdownOpen((prev) => !prev)}
                  className="p-3 rounded-xl bg-[#faf9f6] hover:bg-white border border-stone-300 hover:border-stone-400 transition-all cursor-pointer shadow-xs"
                >
                  <label className="block text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Region or Stay
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-stone-600 transition-transform ${
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

                {/* Combobox Dropdown - Opens downwards on mobile to avoid viewport cutoff */}
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
                          className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-amber-600"
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
                <div className="p-3 rounded-xl bg-[#faf9f6] hover:bg-white border border-stone-300 hover:border-stone-400 transition-all shadow-xs">
                  <label className="block text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
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
                <div className="p-3 rounded-xl bg-[#faf9f6] hover:bg-white border border-stone-300 hover:border-stone-400 transition-all shadow-xs">
                  <label className="block text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
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
                <div className="p-3 rounded-xl bg-[#faf9f6] hover:bg-white border border-stone-300 hover:border-stone-400 transition-all shadow-xs">
                  <label className="block text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-950 border-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 shadow-none cursor-pointer [color-scheme:light]"
                  >
                    <option value="1 Adult" className="bg-white text-slate-950">1 Adult</option>
                    <option value="2 Adults" className="bg-white text-slate-950">2 Adults</option>
                    <option value="2 Adults, 1 Child" className="bg-white text-slate-950">2 Adults + 1 Child</option>
                    <option value="3+ Guests (Family)" className="bg-white text-slate-950">3+ Guests (Family)</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Action Button (full width mobile, 2 cols desktop) */}
              <div className="col-span-2 sm:col-span-2 lg:col-span-2 flex items-center h-full">
                <button
                  type="submit"
                  className="w-full h-full py-3.5 px-4 rounded-xl bg-[#df9e38] hover:bg-[#cf8e28] text-slate-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border-0"
                >
                  <span>Explore Stays</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
