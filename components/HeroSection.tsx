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
} from "lucide-react";
import { motion } from "framer-motion";
import { CHERRAPUNJI_AREAS } from "@/lib/mockData";

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
    id: "drone",
    name: "Drone Flyover",
    badge: "4K Drone Sweep",
    location: "Nohkalikai Falls & Cliffs, Sohra",
    src: "/videos/cherrapunji-drone.webm",
    type: "video/webm",
    fallbackSrc: "/videos/cherrapunji-waterfall.mp4",
    fallbackType: "video/mp4",
  },
  {
    id: "cascade",
    name: "Cascades Stream",
    badge: "Rainforest Waterfalls",
    location: "Cherrapunji Forest Valley",
    src: "/videos/cherrapunji-waterfall.mp4",
    type: "video/mp4",
    fallbackSrc: "/videos/cherrapunji-waterfall.webm",
    fallbackType: "video/webm",
  },
];

export default function HeroSection() {
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  // Default video angle: Drone Flyover of Nohkalikai Falls
  const [activeAngleId, setActiveAngleId] = useState<string>("drone");
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentAngle =
    VIDEO_ANGLES.find((a) => a.id === activeAngleId) || VIDEO_ANGLES[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Handled silently for browser auto-play restrictions
      });
    }
  }, [activeAngleId]);

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
        <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden border border-white/20 shadow-2xl shadow-black/80 bg-slate-900 min-h-[400px] sm:min-h-[480px] lg:min-h-[530px] flex flex-col justify-between">
          
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
              // Crucial: No CSS blur, high definition native rendering
              className="w-full h-full object-cover object-center scale-[1.01] transform-gpu will-change-transform"
            >
              <source src={currentAngle.src} type={currentAngle.type} />
              {currentAngle.fallbackSrc && (
                <source src={currentAngle.fallbackSrc} type={currentAngle.fallbackType} />
              )}
            </video>

            {/* Directional Cinematic Scrim (NOT a blur): Subtle vignette for text clarity while video stays 100% sharp */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/35 pointer-events-none" />
          </div>

          {/* Top Bar inside the Hero Video Card */}
          <div className="relative z-20 p-4 sm:p-6 lg:p-7 flex flex-wrap items-center justify-between gap-3">
            {/* Live Status with Current Angle & Location */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white shadow-lg text-[11px] sm:text-xs font-semibold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wider uppercase text-[10px] sm:text-[11px] text-white">
                {currentAngle.badge}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-medium">{currentAngle.location}</span>
            </motion.div>

            {/* Angle Switcher & Video Playback Controls */}
            <div className="flex items-center gap-2">
              {/* Drone / Cascade View Switcher Pill */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                {VIDEO_ANGLES.map((angle) => {
                  const isActive = activeAngleId === angle.id;
                  return (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => setActiveAngleId(angle.id)}
                      className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-colors duration-200 select-none ${
                        isActive ? "text-emerald-950 font-bold" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeAnglePill"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          className="absolute inset-0 bg-white rounded-full shadow-xs"
                          style={{ zIndex: 0 }}
                        />
                      )}
                      <span className="relative z-10">{angle.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={toggleVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause footage" : "Play footage"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Content: Uplifted, Elegant Typography without Clutter */}
          <div className="relative z-20 px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-8 sm:pb-12 max-w-4xl mx-auto text-center">
            {/* Uplifted Hero Title with Refined Font Size */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.18] max-w-3xl mx-auto"
            >
              <span className="text-stroke-black-lg block sm:inline">Tranquil Stays</span>{" "}
              <span className="text-stroke-black-lg">Above the Clouds in</span>{" "}
              <span className="text-emerald-400 text-stroke-black-lg font-black inline-block underline decoration-emerald-500/40 decoration-wavy underline-offset-8">
                Cherrapunji
              </span>
            </motion.h1>

            {/* Clean Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-white font-medium max-w-xl mx-auto leading-relaxed text-stroke-black-sm drop-shadow-md"
            >
              Wake up to panoramic waterfall vistas and emerald rainforest valleys with direct local rates.
            </motion.p>
          </div>

          {/* Bottom spacing to accommodate search card overlap */}
          <div className="h-6 sm:h-10" />
        </div>

        {/* Floating Pro Search Card - Freed up Stay Schedule with Spacious Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-30 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-2 sm:px-4"
        >
          <form
            onSubmit={handleSearch}
            className="p-3.5 sm:p-5 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left items-stretch"
          >
            {/* 1. Locality */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Sohra Region
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer py-0.5"
              >
                {CHERRAPUNJI_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Check-in Date (Dedicated & Freed Up) */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer py-0.5"
              />
            </div>

            {/* 3. Check-out Date (Dedicated & Freed Up) */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none w-full cursor-pointer py-0.5"
              />
            </div>

            {/* 4. Guests & Rooms */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-emerald-400 focus-within:border-emerald-500 transition-all flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Guests
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

            {/* 5. Submit CTA with Motion Primitives Spring Physics */}
            <div className="flex items-center sm:col-span-2 lg:col-span-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-12 sm:h-full min-h-[50px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search Stays</span>
              </motion.button>
            </div>
          </form>

          {/* Reassuring Trust Signals */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
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
