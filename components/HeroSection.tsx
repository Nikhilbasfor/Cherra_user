"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  Compass,
  Play,
  Pause,
  Video,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { CHERRAPUNJI_AREAS } from "@/lib/mockData";
import { AnimatedTabs, TabOption } from "@/components/motion/AnimatedTabs";

// Renowned hospitality collection tabs (no star ratings)
const COLLECTION_TABS: TabOption[] = [
  { id: "all", label: "All Stays" },
  { id: "cliffside", label: "Cliffside & Waterfalls" },
  { id: "resorts", label: "Luxury Forest Resorts" },
  { id: "cottages", label: "Boutique Cottages" },
  { id: "homestays", label: "Heritage Homestays" },
];

export default function HeroSection() {
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [activeCollection, setActiveCollection] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled silently for browser auto-play restrictions
      });
    }
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedArea && selectedArea !== "All Areas") params.set("area", selectedArea);
    if (activeCollection && activeCollection !== "all") params.set("collection", activeCollection);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="relative pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-20 overflow-hidden bg-slate-950">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-10 opacity-30" />

      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-600/25 via-emerald-950/20 to-transparent pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Cinematic Video Hero Card */}
        <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-white/20 shadow-2xl shadow-black/80 bg-slate-900 min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-between">
          
          {/* Unblurred, High-Definition Video Player */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              // Crucial: No CSS blur, high definition rendering
              className="w-full h-full object-cover object-center scale-[1.01] transform-gpu will-change-transform"
            >
              <source src="/videos/cherrapunji-waterfall.mp4" type="video/mp4" />
              <source src="/videos/cherrapunji-waterfall.webm" type="video/webm" />
            </video>

            {/* Directional Cinematic Scrim (NOT a blur): Dark vignette at top & bottom ensures text legibility while keeping the video 100% sharp */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Top Bar inside the Hero Video Card */}
          <div className="relative z-20 p-4 sm:p-6 lg:p-8 flex flex-wrap items-center justify-between gap-3">
            {/* Live 4K Ambience Status */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white shadow-lg text-[11px] sm:text-xs font-semibold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wider uppercase text-[10px] sm:text-[11px] text-white">
                Live 4K Ambience
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-medium">Sohra, Meghalaya</span>
            </motion.div>

            {/* Video Controls & Mode */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 shadow-md transition-all active:scale-95"
                title={isPlaying ? "Pause cinematic footage" : "Play cinematic footage"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-emerald-400" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Play Stream</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Content: Razor Sharp Typography with Black Border / Stroke */}
          <div className="relative z-20 px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-4xl mx-auto text-center">
            
            {/* Luxury Eyebrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-bold tracking-widest uppercase mb-3 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Curated Cliffside & Nature Sanctuaries</span>
            </motion.div>

            {/* Hero Title with Black Border Stroke for Maximum Legibility */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.12]"
            >
              <span className="text-stroke-black-lg block sm:inline">Tranquil Stays</span>{" "}
              <span className="text-stroke-black-lg">Above the Clouds in</span>{" "}
              <span className="text-emerald-400 text-stroke-black-lg font-black inline-block underline decoration-emerald-500/40 decoration-wavy underline-offset-8">
                Cherrapunji
              </span>
            </motion.h1>

            {/* Hero Subtitle with High-Contrast Text Stroke */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white font-medium max-w-2xl mx-auto leading-relaxed text-stroke-black-sm drop-shadow-md"
            >
              Wake up to panoramic waterfall vistas and emerald rainforest valleys.
              Book verified cliffside resorts and boutique homestays with direct local rates.
            </motion.p>

            {/* Logically Renowned Collection Tabs (Motion Primitives AnimatedTabs) */}
            <div className="mt-6 sm:mt-8 flex justify-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
              <AnimatedTabs
                tabs={COLLECTION_TABS}
                activeId={activeCollection}
                onChange={setActiveCollection}
                layoutId="heroCollectionTab"
                variant="glass"
              />
            </div>
          </div>

          {/* Bottom spacing to accommodate search card overlap */}
          <div className="h-6 sm:h-10" />
        </div>

        {/* Floating Pro Search Card (Desktop & Mobile Refined) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-30 -mt-10 sm:-mt-14 max-w-5xl mx-auto px-2 sm:px-4"
        >
          <form
            onSubmit={handleSearch}
            className="p-3 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-left"
          >
            {/* Locality */}
            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Sohra Region
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                {CHERRAPUNJI_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Stay Dates */}
            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Stay Schedule
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase">Check-in</span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer"
                  />
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-2">
                  <span className="text-[9px] text-slate-400 font-semibold uppercase">Check-out</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Guests & Rooms
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="1 Adult">1 Solo Traveler</option>
                <option value="2 Adults">2 Adults (Couple Retreat)</option>
                <option value="3-4 Adults">3-4 Guests (Family Suite)</option>
                <option value="Group 5+">5+ Group / Retreat</option>
              </select>
            </div>

            {/* Submit CTA with Motion Primitives Spring Physics */}
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-12 sm:h-full min-h-[50px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Explore Verified Stays</span>
              </motion.button>
            </div>
          </form>

          {/* Reassuring Trust Signals */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
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
