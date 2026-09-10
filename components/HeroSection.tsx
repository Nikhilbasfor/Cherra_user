"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
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
import { CHERRAPUNJI_AREAS } from "@/lib/mockData";

export default function HeroSection() {
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedStar, setSelectedStar] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (selectedStar && selectedStar !== "all") params.set("stars", selectedStar);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="relative pt-20 pb-10 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Cherrapunji Nature Video & Mist Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          className="w-full h-full object-cover object-center scale-105"
        >
          <source src="https://assets.mixkit.co/videos/43118/43118-720.mp4" type="video/mp4" />
        </video>
        {/* Soft mint & daylight gradient overlay preserving calm contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-emerald-50/45 to-[#f8faf9] backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow and Ambient Video Toggle */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Nature Stays in Sohra, Meghalaya</span>
          </div>

          <button
            type="button"
            onClick={toggleVideo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 text-[10px] sm:text-[11px] font-medium border border-slate-200 shadow-xs transition-colors backdrop-blur-xs"
            title={isPlaying ? "Pause nature video" : "Play nature video"}
          >
            {isPlaying ? (
              <Pause className="w-2.5 h-2.5 text-emerald-600" />
            ) : (
              <Play className="w-2.5 h-2.5 text-emerald-600" />
            )}
            <span>{isPlaying ? "Live Ambience" : "Play Ambience"}</span>
          </button>
        </div>

        {/* Peaceful Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.22] sm:leading-tight px-1">
          Tranquil Stays Above the Clouds in{" "}
          <span className="text-emerald-700 font-extrabold">Cherrapunji</span>
        </h1>

        {/* Calm Subtitle */}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed px-2">
          Wake up to panoramic waterfall vistas and misty green valleys. Book verified cliffside resorts and boutique homestays with direct local rates.
        </p>

        {/* Category Pills (Touch scrollable on mobile to uncrowd) */}
        <div className="mt-4 sm:mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center scrollbar-none">
          {[
            { label: "All Stays", val: "all" },
            { label: "5★ Luxury", val: "5" },
            { label: "4★ Premium", val: "4" },
            { label: "3★ Comfort", val: "3" },
            { label: "Homestays", val: "2" },
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => setSelectedStar(tab.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedStar === tab.val
                  ? "bg-emerald-700 text-white shadow-xs font-semibold"
                  : "bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200 shadow-xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clean, Airy White Search Box (Travel Portal Standard) */}
        <form
          onSubmit={handleSearch}
          className="mt-4 sm:mt-7 p-2 sm:p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-left"
        >
          {/* Area */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 transition-colors">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Locality
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              {CHERRAPUNJI_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 transition-colors">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              Stay Dates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-medium">Check-in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none w-full cursor-pointer"
                />
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-2">
                <span className="text-[9px] text-slate-400 font-medium">Check-out</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-emerald-300 transition-colors">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="1 Adult">1 Solo Guest</option>
              <option value="2 Adults">2 Adults (Couple)</option>
              <option value="3-4 Adults">3-4 Guests (Family)</option>
              <option value="Group 5+">5+ Group Travel</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <button
              type="submit"
              className="w-full h-11 sm:h-full min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Stays</span>
            </button>
          </div>
        </form>

        {/* Quiet Trust Signals */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Properties Only
          </span>
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Direct Hotel Contact & Tariffs
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            No Booking Commissions
          </span>
        </div>
      </div>
    </div>
  );
}
