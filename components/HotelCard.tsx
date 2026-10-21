"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ChevronLeft, ChevronRight, Heart, Navigation, ArrowRight, Sparkles } from "lucide-react";
import { Hotel } from "@/lib/types";

interface HotelCardProps {
  hotel: Hotel;
  onEnquire: (hotel: Hotel) => void;
  proximity?: {
    landmarkName: string;
    distanceKm: number;
    driveTimeMins: number;
  };
  linkPrefix?: string;
}

export default function HotelCard({ hotel, onEnquire, proximity, linkPrefix }: HotelCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const targetUrl = linkPrefix
    ? `${linkPrefix.replace(/\/$/, "")}/${hotel.slug}`
    : `/hotels/${hotel.slug}`;

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

  const handleCardClick = () => {
    router.push(targetUrl);
  };

  return (
    <div className="h-full">
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-stone-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1 cursor-pointer select-none"
      >
        {/* Viewport-prefetched anchor for browser recognition & SEO */}
        <Link
          href={targetUrl}
          className="absolute inset-0 z-0 pointer-events-none"
          tabIndex={-1}
          aria-label={`View details for ${hotel.name}`}
        />

        {/* Photo Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={hotel.images[currentImageIndex] || hotel.images[0]}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left Frosted Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
            <span className="px-3 py-1 rounded-full bg-white/95 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1a2e22] shadow-xs border border-white/60">
              {hotel.featured ? "Private Estate" : `${hotel.starRating}★ Sanctuary`} • {hotel.area}
            </span>
          </div>

          {/* Top Right Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-stone-200/60 flex items-center justify-center text-slate-700 hover:text-rose-500 transition-all z-20 cursor-pointer shadow-xs active:scale-90"
            aria-label="Save hotel"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Bottom Left Mountain/Canyon Elevation Badge on Photo */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0a3a2a]/90 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200 border border-emerald-500/25 flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hotel.area.toLowerCase().includes("nohsngithiang") || hotel.area.toLowerCase().includes("rim") ? "Sunrise Canyon Rim" : "1,480m Elevation"}</span>
            </span>
          </div>

          {/* Navigation Arrows for Images */}
          {hotel.images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-white/95 text-slate-800 flex items-center justify-center hover:bg-white shadow-md border border-black/5 transition-all cursor-pointer active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-white/95 text-slate-800 flex items-center justify-center hover:bg-white shadow-md border border-black/5 transition-all cursor-pointer active:scale-95"
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
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImageIndex ? "w-4 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            {/* Proximity Callout if filtered near a landmark */}
            {proximity && (
              <div className="mb-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/90 text-xs font-mono text-stone-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <Navigation className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{proximity.distanceKm} km from {proximity.landmarkName}</span>
                </span>
                <span className="text-emerald-700 font-bold shrink-0 ml-1.5">
                  ~{proximity.driveTimeMins}m
                </span>
              </div>
            )}

            {/* Location & Star Rating Row */}
            <div className="flex items-center justify-between text-xs text-stone-500 font-sans tracking-wide mb-1">
              <span className="truncate pr-2">East Khasi Hills • {hotel.area}</span>
              <span className="font-mono font-bold text-stone-800 flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{hotel.rating}</span>
                <span className="text-stone-400 text-[11px]">({hotel.reviewsCount})</span>
              </span>
            </div>

            {/* Hotel Name - Editorial Serif Font */}
            <Link
              href={targetUrl}
              onClick={(e) => e.stopPropagation()}
              className="font-serif text-lg sm:text-xl font-bold text-[#14261c] tracking-tight leading-snug group-hover:text-emerald-900 transition-colors line-clamp-1 block hover:underline"
            >
              {hotel.name}
            </Link>

            {/* Tagline / Curated Description */}
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mt-1">
              {hotel.tagline || hotel.description}
            </p>

            {/* 3 Curated Luxury Amenities with Icons */}
            <div className="flex items-center gap-3 sm:gap-4 mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-600 font-medium">
              {hotel.amenities.slice(0, 3).map((amenity, i) => (
                <span key={i} className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3 h-3 text-amber-600/80 shrink-0" />
                  <span className="truncate">{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Price & CTA Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#14261c] tracking-tight">
                  ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-stone-500 font-sans">/ night</span>
              </div>
              <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                Direct Front-Desk Tariff
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={targetUrl}
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
                  onEnquire(hotel);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0a3a2a] hover:bg-[#06291d] text-white font-sans font-bold uppercase tracking-wider text-xs shadow-sm shadow-[#0a3a2a]/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
              >
                <span>Reserve</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
