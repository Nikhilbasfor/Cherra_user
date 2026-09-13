"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Compass,
  MapPin,
  Star,
  ShieldCheck,
  Eye,
  Play,
  Pause,
  ArrowRight,
} from "lucide-react";

interface HomestayDroneSpot {
  id: string;
  name: string;
  badge: string;
  area: string;
  elevation: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  highlight: string;
  image: string;
  hotelSlug: string;
  coordinates: string;
}

const FEATURED_HOMESTAYS: HomestayDroneSpot[] = [
  {
    id: "cherrapunjee-holiday-resort",
    name: "Cherrapunjee Holiday Resort",
    badge: "Pioneer Living Root Base",
    area: "Laitkynsew Village",
    elevation: "4,200 ft",
    pricePerNight: 3800,
    rating: 4.7,
    reviewsCount: 340,
    highlight: "Trailhead homestay for the iconic Double Decker Living Root Bridge with organic home-cooked Khasi meals.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "cherrapunjee-holiday-resort",
    coordinates: "25.2158° N, 91.6784° E",
  },
  {
    id: "saimika-park-resort",
    name: "Sa-I-Mika Park & Cottages",
    badge: "Pine Grove Wilderness",
    area: "Khliehshnong",
    elevation: "4,680 ft",
    pricePerNight: 3500,
    rating: 4.5,
    reviewsCount: 178,
    highlight: "65-acre peaceful wilderness retreat with natural river streams, stone cottages, and acoustic campfire nights.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "saimika-park-cottages",
    coordinates: "25.2912° N, 91.7104° E",
  },
  {
    id: "kutmadan-resort",
    name: "Kutmadan Cliffside Retreat",
    badge: "Canyon Edge Homestay",
    area: "Mawkdok / Sohra Rim",
    elevation: "4,850 ft",
    pricePerNight: 4200,
    rating: 4.6,
    reviewsCount: 122,
    highlight: "Spectacular edge-of-the-world cliff views overlooking the endless misty plains and deep gorge valleys.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "kutmadan-resort-sohra",
    coordinates: "25.2678° N, 91.7345° E",
  },
  {
    id: "sohra-plaza-homestay",
    name: "Sohra Plaza Comfort Stay",
    badge: "Heritage Town Homestay",
    area: "Sohra Central",
    elevation: "4,500 ft",
    pricePerNight: 2200,
    rating: 4.3,
    reviewsCount: 88,
    highlight: "Cozy family-run homestay walking distance to the local market, taxi stand, and traditional Khasi food stalls.",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "sohra-plaza-comfort-stay",
    coordinates: "25.2750° N, 91.7210° E",
  },
];

interface HomestaysDroneShowcaseProps {
  onOpenInquiry?: (hotelId?: string) => void;
}

export default function HomestaysDroneShowcase({ onOpenInquiry }: HomestaysDroneShowcaseProps) {
  const [selectedSpotId, setSelectedSpotId] = useState<string>("cherrapunjee-holiday-resort");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeSpot =
    FEATURED_HOMESTAYS.find((s) => s.id === selectedSpotId) || FEATURED_HOMESTAYS[0];

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header Badge & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 text-emerald-800 border border-emerald-300/60 shadow-xs mb-3 text-xs font-bold uppercase tracking-wider"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
          <span>Aerial Reconnaissance • 1080p Drone Sweep</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Explore Best Homestays in <span className="text-emerald-700">Cherrapunji</span> from the Skies
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Cinematic aerial perspectives capturing secluded mountain villages, mist-enshrouded ridge cottages, and authentic tribal homestays nestled across Sohra.
        </motion.p>
      </div>

      {/* Main Drone Visual Showcase Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: 1080p Drone Video Monitor */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex-1 min-h-[360px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between group">
            
            {/* Native 1080p Unblurred Drone Video */}
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center scale-[1.01]"
              >
                <source src="/videos/cherrapunji-homestays-drone.webm" type="video/webm" />
                <source src="/videos/cherrapunji-drone.webm" type="video/webm" />
              </video>
              {/* Subtle top and bottom dark gradient for telemetry HUD clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Drone HUD Top Bar */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>DRONE CAM-01 • LIVE</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/80">
                  {activeSpot.coordinates}
                </span>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs font-medium flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">Pause Sweep</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span className="text-[11px]">Resume Sweep</span>
                  </>
                )}
              </button>
            </div>

            {/* Drone Telemetry Bottom Bar Overlay */}
            <div className="relative z-10 p-4 sm:p-6 text-white">
              <div className="p-4 sm:p-5 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                      Target Area
                    </span>
                    <span className="text-white/60 text-xs font-mono">{activeSpot.elevation}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {activeSpot.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {activeSpot.highlight}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right sm:text-right">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-mono">Verified Tariff</p>
                    <p className="text-lg font-black text-emerald-400">
                      ₹{activeSpot.pricePerNight.toLocaleString()}
                      <span className="text-xs text-white/60 font-normal"> / night</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenInquiry && onOpenInquiry(activeSpot.id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Enquire Direct</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Homestay List & Selectors */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3 justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Top Homestays Aerial Focus
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                4 Handpicked Stays
              </span>
            </div>

            {FEATURED_HOMESTAYS.map((spot) => {
              const isSelected = selectedSpotId === spot.id;
              return (
                <motion.div
                  key={spot.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedSpotId(spot.id)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-white/80 hover:bg-white border-slate-200/90 shadow-xs hover:border-slate-300"
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {spot.badge}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{spot.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {spot.name}
                      </h4>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{spot.area}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{spot.elevation}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            ₹{spot.pricePerNight.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500"> / night</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenInquiry) onOpenInquiry(spot.id);
                          }}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Enquire</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Direct verification assurance notice */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-[11px] text-emerald-900 flex items-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All homestays are physically inspected with verified Khasi host families and geysers.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
