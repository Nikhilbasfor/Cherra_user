"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, ChevronLeft, ChevronRight, Check, Heart, Navigation, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 3D Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const targetUrl = linkPrefix
    ? `${linkPrefix.replace(/\/$/, "")}/${hotel.slug}`
    : `/hotels/${hotel.slug}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -4;
    const rotY = ((x - centerX) / centerX) * 4;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(targetUrl, "_blank");
      return;
    }
    router.push(targetUrl);
  };

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
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        animate={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-emerald-900/10 hover:border-emerald-700/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer select-none"
      >
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

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-mono font-bold text-white shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-white/60 text-[11px]">({hotel.reviewsCount})</span>
            </span>

            {hotel.featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-black/5 flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors z-10 cursor-pointer shadow-xs"
            aria-label="Save hotel"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
          </motion.button>

          {/* Navigation Arrows for Images */}
          {hotel.images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center hover:bg-white shadow-md border border-black/5 transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center hover:bg-white shadow-md border border-black/5 transition-all cursor-pointer"
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
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            {/* Proximity Callout if filtered near a landmark */}
            {proximity && (
              <div className="mb-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-mono text-emerald-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <Navigation className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{proximity.distanceKm} km from {proximity.landmarkName}</span>
                </span>
                <span className="text-emerald-700 font-bold shrink-0 ml-1.5">
                  ~{proximity.driveTimeMins}m
                </span>
              </div>
            )}

            {/* Locality & Star Tier */}
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="flex items-center gap-1.5 text-slate-500 uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                {hotel.area}, Sohra
              </span>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                {hotel.starRating}★ Verified
              </span>
            </div>

            {/* Hotel Name */}
            <Link
              href={targetUrl}
              onClick={(e) => e.stopPropagation()}
              className="block group-hover:text-emerald-800 transition-colors"
            >
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug line-clamp-1 transition-colors">
                {hotel.name}
              </h3>
            </Link>

            {/* Tagline */}
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {hotel.tagline}
            </p>

            {/* Amenities Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {hotel.amenities.slice(0, 3).map((amenity, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-50/70 text-slate-700 border border-emerald-900/10 flex items-center gap-1 font-medium"
                >
                  <Check className="w-2.5 h-2.5 text-emerald-700" />
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 self-center">
                  +{hotel.amenities.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Price & Lush Green CTA Footer */}
          <div className="pt-3.5 border-t border-slate-100 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through font-mono">₹{hotel.originalPrice}</span>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">₹{hotel.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-mono">/ night</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEnquire(hotel);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Reserve</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
