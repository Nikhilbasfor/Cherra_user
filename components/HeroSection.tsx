"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ShieldCheck, Sparkles, Compass } from "lucide-react";
import { CHERRAPUNJI_AREAS } from "@/lib/mockData";

export default function HeroSection() {
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedStar, setSelectedStar] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

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
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Soft Nature Mist Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Peaceful green hills of Cherrapunji"
          fill
          priority
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-emerald-50/30 to-[#f8faf9]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Curated Nature Stays in Sohra, Meghalaya</span>
        </div>

        {/* Peaceful Title (Balanced proportions, not gigantic) */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Tranquil Stays Above the Clouds in{" "}
          <span className="text-emerald-700 font-extrabold">Cherrapunji</span>
        </h1>

        {/* Calm Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Wake up to panoramic waterfall vistas and misty green valleys. Book verified cliffside resorts and boutique homestays with direct local rates.
        </p>

        {/* Quiet Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStar === tab.val
                  ? "bg-emerald-700 text-white shadow-xs font-semibold"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200 shadow-xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Clean, Airy White Search Box (Travel Portal Standard) */}
        <form
          onSubmit={handleSearch}
          className="mt-7 p-3 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-left"
        >
          {/* Area */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-emerald-300 transition-colors">
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
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-emerald-300 transition-colors">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              Stay Dates
            </label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-1/2 bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-1/2 bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-emerald-300 transition-colors">
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
              className="w-full h-full min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Stays</span>
            </button>
          </div>
        </form>

        {/* Quiet Trust Signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
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
