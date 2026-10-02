"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Compass,
  MapPin,
  Star,
  ShieldCheck,
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
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header Badge & Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] text-amber-400 border border-white/10 shadow-xs mb-3 text-xs font-mono font-bold uppercase tracking-widest"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>Aerial Reconnaissance • 1080p Drone Sweep</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight"
        >
          Explore Best Homestays in <span className="text-amber-400">Cherrapunji</span> from the Skies
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-xs sm:text-sm text-white/50 font-mono max-w-2xl mx-auto leading-relaxed"
        >
          Cinematic aerial perspectives capturing secluded mountain villages, mist-enshrouded ridge cottages, and authentic tribal sanctuaries nestled across Sohra.
        </motion.p>
      </div>

      {/* Main Drone Visual Showcase Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: 1080p Drone Video Monitor */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex-1 min-h-[360px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between group">
            
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
                <source src="/videos/cherrapunji-drone.webm" type="video/webm" />
                <source src="/videos/cherrapunji-waterfall.mp4" type="video/mp4" />
              </video>
              {/* Top and bottom subtle vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Drone HUD Top Bar */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span>DRONE CAM-01 • LIVE</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                  {activeSpot.coordinates}
                </span>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] uppercase tracking-wider">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] uppercase tracking-wider">Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Drone Telemetry Bottom Bar Overlay */}
            <div className="relative z-10 p-4 sm:p-6 text-white">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111418]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-amber-400 text-[10px] font-mono uppercase tracking-widest border border-white/10">
                      Target Area
                    </span>
                    <span className="text-white/50 text-xs font-mono">{activeSpot.elevation}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                    {activeSpot.name}
                  </h3>
                  <p className="text-xs text-white/60 font-mono line-clamp-1">
                    {activeSpot.highlight}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Verified Tariff</p>
                    <p className="text-xl font-black text-white font-mono">
                      ₹{activeSpot.pricePerNight.toLocaleString()}
                      <span className="text-xs text-white/50 font-normal"> / night</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenInquiry && onOpenInquiry(activeSpot.id)}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Enquire Direct</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
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
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">
                Top Homestays Aerial Focus
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
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
                      ? "bg-[#151920] border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50"
                      : "bg-[#111418] hover:bg-[#13161c] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-black border border-white/10">
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-400 text-[9px] font-mono font-bold uppercase tracking-wider text-black shadow-xs">
                          Active
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                          {spot.badge}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-white">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{spot.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black uppercase text-white truncate tracking-wide">
                        {spot.name}
                      </h4>

                      <div className="flex items-center gap-1 text-[11px] text-white/50 font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{spot.area}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-white/40">{spot.elevation}</span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div>
                          <span className="text-xs sm:text-sm font-black text-white font-mono">
                            ₹{spot.pricePerNight.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono"> / night</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenInquiry) onOpenInquiry(spot.id);
                          }}
                          className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 hover:underline inline-flex items-center gap-1"
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
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] font-mono text-white/50 flex items-center gap-2.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>All homestays are physically inspected with verified Khasi host families.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
