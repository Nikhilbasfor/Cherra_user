"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface FeaturedHomestay {
  id: string;
  name: string;
  badge: string;
  area: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  highlight: string;
  image: string;
  hotelSlug: string;
}

const TOP_3_HOMESTAYS: FeaturedHomestay[] = [
  {
    id: "cherrapunjee-holiday-resort",
    name: "Cherrapunjee Holiday Resort",
    badge: "Living Root Bridge Base",
    area: "Laitkynsew Village",
    pricePerNight: 3800,
    rating: 4.7,
    reviewsCount: 340,
    highlight: "Trailhead homestay for the iconic Double Decker Living Root Bridge with organic home-cooked Khasi meals.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "cherrapunjee-holiday-resort",
  },
  {
    id: "kutmadan-resort",
    name: "Kutmadan Cliffside Retreat",
    badge: "Canyon Edge Homestay",
    area: "Mawkdok / Sohra Rim",
    pricePerNight: 4200,
    rating: 4.6,
    reviewsCount: 122,
    highlight: "Spectacular edge-of-the-world cliff views overlooking endless misty gorges and lush canyon panoramas.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "kutmadan-resort-sohra",
  },
  {
    id: "saimika-park-resort",
    name: "Sa-I-Mika Park & Cottages",
    badge: "Pine Grove Wilderness",
    area: "Khliehshnong",
    pricePerNight: 3500,
    rating: 4.5,
    reviewsCount: 178,
    highlight: "65-acre peaceful wilderness retreat with natural river streams, stone cottages, and acoustic campfire nights.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    hotelSlug: "saimika-park-cottages",
  },
];

interface HomestaysDroneShowcaseProps {
  onOpenInquiry?: (hotelId?: string) => void;
}

export default function HomestaysDroneShowcase({ onOpenInquiry }: HomestaysDroneShowcaseProps) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header - Uplifted with clean black and golden typography */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/10 text-emerald-800 border border-emerald-800/20 text-xs font-mono font-bold uppercase tracking-wider mb-2.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Verified Local Hospitality</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight"
        >
          Explore Best Homestays in <span className="text-amber-600">Cherrapunji</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Top rated homestays and cottage retreats hosted by warm Khasi families with authentic home-cooked meals.
        </motion.p>
      </div>

      {/* Top 3 Homestays in 1 Row on Desktop View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {TOP_3_HOMESTAYS.map((spot, idx) => (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl border border-emerald-900/10 hover:border-emerald-700/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Image & Top Badges */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <Image
                src={spot.image}
                alt={spot.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 shadow-sm border border-black/5">
                  {spot.badge}
                </span>
              </div>

              {/* Star Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{spot.rating}</span>
                <span className="text-white/60 text-[10px]">({spot.reviewsCount})</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{spot.area}, Sohra</span>
                </div>

                <Link href={`/hotels/${spot.hotelSlug}`} className="block">
                  <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight hover:text-emerald-800 transition-colors line-clamp-1">
                    {spot.name}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {spot.highlight}
                </p>
              </div>

              {/* Price & Lush Green Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">
                    Verified Tariff
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-900 font-mono">
                      ₹{spot.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">/ night</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenInquiry && onOpenInquiry(spot.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-extrabold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Reserve</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verified Notice Strip */}
      <div className="mt-6 p-3.5 rounded-xl bg-white/70 border border-emerald-900/10 text-xs font-mono text-slate-600 flex items-center justify-center gap-2 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>All homestays are physically verified with authentic Khasi hosts and guaranteed direct front-desk rates.</span>
      </div>
    </section>
  );
}
