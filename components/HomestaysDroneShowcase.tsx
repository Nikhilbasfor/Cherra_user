"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    hotelSlug: "kutmadan-resort",
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
    hotelSlug: "saimika-resort",
  },
];

interface HomestaysDroneShowcaseProps {
  onOpenInquiry?: (hotelId?: string) => void;
}

export default function HomestaysDroneShowcase({ onOpenInquiry }: HomestaysDroneShowcaseProps) {
  const router = useRouter();

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header - Uplifted with clean black and golden typography */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200/90 text-xs font-mono font-bold uppercase tracking-wider mb-2.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Verified Local Hospitality</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
        >
          Heritage Stays <span className="italic font-serif font-normal text-amber-700">in the</span> Forest
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Top rated village homestays and pine cottage retreats hosted by warm Khasi families with authentic home-cooked meals.
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
            onClick={() => router.push(`/hotels/${spot.hotelSlug}`)}
            className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
          >
            {/* Viewport-prefetched anchor for browser recognition & SEO */}
            <Link
              href={`/hotels/${spot.hotelSlug}`}
              prefetch={true}
              className="absolute inset-0 z-0 pointer-events-none"
              tabIndex={-1}
              aria-label={`View details for ${spot.name}`}
            />

            {/* Image & Top Badges */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              <Image
                src={spot.image}
                alt={spot.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#1a2e22] shadow-xs border border-white/40">
                  {spot.badge}
                </span>
              </div>

              {/* Star Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono font-bold shadow-sm z-10">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{spot.rating}</span>
                <span className="text-white/60 text-[10px]">({spot.reviewsCount})</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 relative z-10">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{spot.area}, Sohra</span>
                </div>

                <Link
                  href={`/hotels/${spot.hotelSlug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-serif text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-900 transition-colors line-clamp-1 block hover:underline"
                >
                  {spot.name}
                </Link>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {spot.highlight}
                </p>
              </div>

              {/* Price & Action Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-sans block">
                    Verified Tariff
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-lg font-bold text-[#14261c]">
                      ₹{spot.pricePerNight.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans">/ night</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/hotels/${spot.hotelSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:text-emerald-900 hover:bg-stone-50 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onOpenInquiry) onOpenInquiry(spot.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0a3a2a] hover:bg-[#06291d] text-white font-sans font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verified Notice Strip */}
      <div className="mt-6 p-3.5 rounded-xl bg-white border border-stone-200/90 text-xs font-mono text-slate-600 flex items-center justify-center gap-2 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>All homestays are physically verified with authentic Khasi hosts and guaranteed direct front-desk rates.</span>
      </div>
    </section>
  );
}
