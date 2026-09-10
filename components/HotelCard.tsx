"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Sparkles, ChevronLeft, ChevronRight, Check, Eye, Heart } from "lucide-react";
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
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Photo Carousel */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={hotel.images[currentImageIndex] || hotel.images[0]}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-slate-800 border border-slate-200 shadow-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{hotel.starRating} Star</span>
          </span>

          {hotel.featured && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] font-semibold text-white flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs transition-colors"
          aria-label="Save hotel"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Navigation Arrows for Images */}
        {hotel.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:bg-white shadow-sm transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:bg-white shadow-sm transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dots */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
            {hotel.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? "w-3.5 bg-white shadow-xs" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {hotel.area}, Sohra
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-slate-700 font-semibold text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-slate-400 font-normal">({hotel.reviewsCount})</span>
            </div>
          </div>

          {/* Hotel Name */}
          <Link href={`/hotels/${hotel.slug}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
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
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80 flex items-center gap-1"
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
              <span className="text-lg font-bold text-slate-900">₹{hotel.pricePerNight}</span>
              <span className="text-[11px] text-slate-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/hotels/${hotel.slug}`}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/70 transition-colors"
              title="View Rooms & Photos"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onEnquire(hotel)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors active:scale-[0.98]"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
