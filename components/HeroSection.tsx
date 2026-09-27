"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  CalendarCheck,
  Users,
  ShieldCheck,
  Sparkles,
  Compass,
  ChevronDown,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";

interface VideoAngle {
  id: string;
  name: string;
  badge: string;
  location: string;
  src: string;
  type: string;
  fallbackSrc?: string;
  fallbackType?: string;
}

const VIDEO_ANGLES: VideoAngle[] = [
  {
    id: "homestays",
    name: "Homestays Drone",
    badge: "Village & Homestays Aerial",
    location: "Sohrarim & Valley Homestays, Sohra",
    src: "/videos/cherrapunji-homestays-drone.webm",
    type: "video/webm",
    fallbackSrc: "/videos/cherrapunji-drone.webm",
    fallbackType: "video/webm",
  },
];

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
  const currentAngle = VIDEO_ANGLES[0];
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

  // Close area combobox on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target as Node)) {
        setIsAreaDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync to sessionStorage so Inquiry Modal gets the exact same details
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (checkIn) sessionStorage.setItem("cherra_checkIn", checkIn);
      if (checkOut) sessionStorage.setItem("cherra_checkOut", checkOut);
      if (guests) sessionStorage.setItem("cherra_guests", guests);
      if (selectedArea) sessionStorage.setItem("cherra_search_area", selectedArea);
    }
  }, [checkIn, checkOut, guests, selectedArea]);

  // Derive available unique areas from active hotels with live property counts
  const availableAreasWithCount = React.useMemo(() => {
    const map = new Map<string, number>();
    hotelsList.forEach((h) => {
      if (h.area) {
        map.set(h.area, (map.get(h.area) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([area, count]) => ({ area, count }));
  }, [hotelsList]);

  // Filtered dropdown matches for smart combobox
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
    <div className="relative min-h-[100dvh] flex flex-col justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden bg-slate-950">
      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-600/20 via-emerald-950/15 to-transparent pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        
        {/* Cinematic Video Hero Card - Majestic Scale */}
        <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-white/20 shadow-2xl shadow-black/80 bg-slate-900 min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col justify-between">
          
          {/* Unblurred, High-Definition Video Player */}
          <div className="absolute inset-0 z-0">
            <video
              key={currentAngle.src}
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center scale-[1.01] transform-gpu will-change-transform"
            >
              <source src={currentAngle.src} type={currentAngle.type} />
              {currentAngle.fallbackSrc && (
                <source src={currentAngle.fallbackSrc} type={currentAngle.fallbackType} />
              )}
            </video>

            {/* Directional Cinematic Scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/35 pointer-events-none" />
          </div>

          {/* Top spacing inside the Hero Video Card */}
          <div className="relative z-20 pt-4 sm:pt-6" />

          {/* Center Content: Grand Typography */}
          <div className="relative z-20 px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-6 sm:pb-10 max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight sm:leading-[1.18] max-w-3xl mx-auto drop-shadow-lg"
            >
              <span>Tranquil Stays Above the Clouds in </span>
              <span className="text-emerald-400 font-black inline-block">Cherrapunji</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base text-white/95 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-md"
            >
              Wake up to panoramic waterfall vistas and emerald rainforest valleys with direct local rates.
            </motion.p>
          </div>

          {/* Bottom spacing to accommodate uplifted search card overlap */}
          <div className="h-10 sm:h-14 lg:h-16" />
        </div>

        {/* Floating Pro Search Card - Uplifted with Strong Overlap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-30 max-w-6xl mx-auto px-2 sm:px-4 w-full -mt-16 sm:-mt-20 lg:-mt-22"
        >
          {/* Upper curved tab on the left side only */}
          <div className="flex">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2 bg-white/95 backdrop-blur-xl rounded-t-xl sm:rounded-t-2xl border-t border-x border-black shadow-xs text-slate-900 font-bold text-xs sm:text-sm tracking-tight -mb-[1px] relative z-10">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Check Availability</span>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-white/95 backdrop-blur-xl rounded-b-2xl sm:rounded-b-3xl rounded-tr-2xl sm:rounded-tr-3xl border border-black shadow-2xl text-left"
          >
            {/* 5 Input Columns with Neat Borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-stretch">
              {/* 1. Smart Search Region Combobox (Opens Upward to Prevent Screen Cutoff) */}
              <div ref={areaDropdownRef} className="relative flex flex-col justify-center">
                <div
                  onClick={() => setIsAreaDropdownOpen((prev) => !prev)}
                  className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-300 hover:border-slate-800 focus-within:border-black transition-all cursor-pointer"
                >
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Search Region
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isAreaDropdownOpen ? "rotate-180" : ""}`} />
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {selectedHotelSlug
                        ? areaSearchQuery || selectedArea
                        : selectedArea === "All Areas"
                        ? "All Cherrapunji (Sohra)"
                        : selectedArea}
                    </span>
                  </div>
                </div>

                {/* Dropdown Combobox Menu - Opens UPWARD */}
                <AnimatePresence>
                  {isAreaDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white rounded-xl border border-slate-300 shadow-2xl p-2 space-y-2 max-h-72 overflow-y-auto"
                    >
                      {/* Search Filter Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Type locality or hotel name..."
                          value={areaSearchQuery}
                          onChange={(e) => setAreaSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                          autoFocus
                        />
                      </div>

                      {/* Option: All Areas */}
                      <button
                        type="button"
                        onClick={() => handleSelectArea("All Areas")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                          selectedArea === "All Areas" && !selectedHotelSlug
                            ? "bg-emerald-50 text-emerald-900 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          All Cherrapunji (Sohra)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {hotelsList.length} verified stays
                        </span>
                      </button>

                      {/* Region Localities */}
                      {filteredDropdownOptions.areas.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Available Localities ({filteredDropdownOptions.areas.length})
                          </div>
                          <div className="space-y-0.5">
                            {filteredDropdownOptions.areas.map(({ area, count }) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => handleSelectArea(area)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                                  selectedArea === area && !selectedHotelSlug
                                    ? "bg-emerald-50 text-emerald-900 font-bold"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="truncate">{area}</span>
                                <span className="text-[10px] text-slate-400">
                                  {count} stay{count > 1 ? "s" : ""}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Specific Properties Matching Query */}
                      {filteredDropdownOptions.hotels.length > 0 && (
                        <div className="pt-1 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Direct Properties
                          </div>
                          <div className="space-y-0.5">
                            {filteredDropdownOptions.hotels.slice(0, 5).map((hotel) => (
                              <button
                                key={hotel.id}
                                type="button"
                                onClick={() => handleSelectHotel(hotel)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                                  selectedHotelSlug === hotel.slug
                                    ? "bg-emerald-50 text-emerald-900 font-bold"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">{hotel.name}</span>
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap ml-2">
                                  ₹{hotel.pricePerNight}
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

              {/* 2. Check-in Date */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-300 hover:border-slate-800 focus-within:border-black transition-all flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value > checkOut) {
                      setCheckOut(e.target.value);
                    }
                  }}
                  className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer py-0.5"
                />
              </div>

              {/* 3. Check-out Date */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-300 hover:border-slate-800 focus-within:border-black transition-all flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Check-out Date
                </label>
                <input
                  type="date"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer py-0.5"
                />
              </div>

              {/* 4. Guests & Party */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-300 hover:border-slate-800 focus-within:border-black transition-all flex flex-col justify-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Guests & Rooms
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer py-0.5"
                >
                  <option value="1 Adult">1 Solo Traveler</option>
                  <option value="2 Adults">2 Adults (Couple)</option>
                  <option value="3-4 Adults">3-4 Guests (Family)</option>
                  <option value="Group 5+">5+ Group / Retreat</option>
                </select>
              </div>

              {/* 5. Submit CTA Button */}
              <div className="flex items-center sm:col-span-2 lg:col-span-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-11 sm:h-full min-h-[46px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search Stays</span>
                </motion.button>
              </div>
            </div>
          </form>

          {/* Reassuring Trust Signals */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Physically Verified Properties
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              Direct Hotel Front-Desk Tariffs
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Zero Commission Markups
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
