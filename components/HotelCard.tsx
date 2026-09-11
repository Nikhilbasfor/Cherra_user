"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Sparkles, ChevronLeft, ChevronRight, Check, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Hotel } from "@/lib/types";

interface HotelCardProps {
  hotel: Hotel;
  onEnquire: (hotel: Hotel) => void;
}

export default function HotelCard({ hotel, onEnquire }: HotelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  const discountPercent = Math.round(
    ((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Photo Carousel Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={hotel.images[currentImageIndex] || hotel.images[0]}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Dark Gradient on Photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 shadow-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-white/60">({hotel.reviewsCount})</span>
          </span>

          {hotel.featured && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 border border-emerald-400/30 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button with Spring Physics */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:text-rose-400 hover:bg-black/60 shadow-xs transition-colors z-10"
          aria-label="Save hotel"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </motion.button>

        {/* Navigation Arrows for Images */}
        {hotel.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={prevImage}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 border border-white/20 shadow-sm transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 border border-white/20 shadow-sm transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dot Indicators */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {hotel.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? "w-4 bg-white shadow-xs" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Locality Info */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {hotel.area}, Sohra
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
              Direct Tariff
            </span>
          </div>

          {/* Hotel Name */}
          <Link href={`/hotels/${hotel.slug}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
              {hotel.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {hotel.tagline}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1 mt-3">
            {hotel.amenities.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80 flex items-center gap-1 font-medium"
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium self-center">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 line-through">₹{hotel.originalPrice}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">₹{hotel.pricePerNight}</span>
              <span className="text-[11px] text-slate-500 font-medium">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/hotels/${hotel.slug}`}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors"
              title="View Rooms & Photos"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnquire(hotel)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
            >
              Book Direct
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
