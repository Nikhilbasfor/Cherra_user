"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Navigation, Compass, ExternalLink } from "lucide-react";
import { Hotel, Attraction } from "@/lib/types";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_ATTRACTIONS } from "@/lib/mockData";

interface MapExplorerProps {
  hotels?: Hotel[];
  attractions?: Attraction[];
  onEnquire?: (hotel: Hotel) => void;
}

export default function MapExplorer({
  hotels = CHERRAPUNJI_HOTELS,
  attractions = CHERRAPUNJI_ATTRACTIONS,
  onEnquire,
}: MapExplorerProps) {
  const [activeItem, setActiveItem] = useState<{
    type: "hotel" | "attraction";
    data: Hotel | Attraction;
  }>({
    type: "hotel",
    data: hotels[0],
  });

  const [filterType, setFilterType] = useState<"all" | "hotels" | "attractions">("all");

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Cherrapunji Geographic Map Guide</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Explore Hotels & Scenic Spots on Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select pins to view real-time tariffs and proximity to waterfalls and root bridges.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({hotels.length + attractions.length})
          </button>
          <button
            onClick={() => setFilterType("hotels")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === "hotels"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hotels ({hotels.length})
          </button>
          <button
            onClick={() => setFilterType("attractions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === "attractions"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Attractions ({attractions.length})
          </button>
        </div>
      </div>

      {/* Main Map + Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Clean Daylight Map Container (8 cols) */}
        <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
          <div className="absolute inset-0">
            <iframe
              title="Cherrapunji Natural Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=91.6400%2C25.2000%2C91.7800%2C25.3200&layer=mapnik"
            />
          </div>

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[11px] text-slate-700 font-medium shadow-xs">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sohra Plateau • Elevation 1,484m</span>
          </div>

          {/* Interactive Pins */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Hotels Pins */}
            {(filterType === "all" || filterType === "hotels") &&
              hotels.map((hotel, idx) => {
                const isActive = activeItem.type === "hotel" && (activeItem.data as Hotel).id === hotel.id;
                const positions = [
                  { top: "45%", left: "62%" },
                  { top: "35%", left: "48%" },
                  { top: "72%", left: "28%" },
                  { top: "40%", left: "68%" },
                  { top: "25%", left: "42%" },
                  { top: "38%", left: "50%" },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={hotel.id}
                    onClick={() => setActiveItem({ type: "hotel", data: hotel })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-md ${
                      isActive
                        ? "bg-emerald-600 text-white ring-3 ring-emerald-200 scale-105 z-20"
                        : "bg-white text-slate-800 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 z-10"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>₹{hotel.pricePerNight}</span>
                  </button>
                );
              })}

            {/* Attractions Pins */}
            {(filterType === "all" || filterType === "attractions") &&
              attractions.map((att, idx) => {
                const isActive = activeItem.type === "attraction" && (activeItem.data as Attraction).id === att.id;
                const attrPositions = [
                  { top: "28%", left: "30%" },
                  { top: "80%", left: "22%" },
                  { top: "52%", left: "65%" },
                  { top: "58%", left: "55%" },
                  { top: "20%", left: "52%" },
                ];
                const pos = attrPositions[idx % attrPositions.length];

                return (
                  <button
                    key={att.id}
                    onClick={() => setActiveItem({ type: "attraction", data: att })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shadow-md ${
                      isActive
                        ? "bg-teal-700 text-white ring-3 ring-teal-200 scale-105 z-20"
                        : "bg-white text-teal-800 border border-teal-200 hover:bg-teal-50 z-10"
                    }`}
                  >
                    <span>🌊</span>
                    <span className="max-w-[80px] truncate">{att.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Preview Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          {activeItem.type === "hotel" ? (
            (() => {
              const h = activeItem.data as Hotel;
              return (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-200">
                    <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded text-amber-500 text-xs font-bold border border-slate-200">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{h.starRating} Star</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                      ₹{h.pricePerNight} / night
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{h.area}, Sohra</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{h.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{h.tagline}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Guest Rating:</span>
                      <span className="font-semibold text-slate-800">★ {h.rating} ({h.reviewsCount})</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Distance to town:</span>
                      <span className="text-slate-700">{h.distanceToCenter || "2.5 km"}</span>
                    </p>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <Link
                      href={`/hotels/${h.slug}`}
                      className="flex-1 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Rooms</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <button
                      onClick={() => onEnquire?.(h)}
                      className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            (() => {
              const a = activeItem.data as Attraction;
              return (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-200">
                    <Image src={a.image} alt={a.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-white/95 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200">
                      {a.category}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-teal-700 font-medium mb-0.5">
                      {a.khasiName ? `Local: ${a.khasiName}` : "Natural Wonder"}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{a.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.description}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs space-y-1">
                    <p className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Distance:</span>
                      <span className="font-semibold text-slate-800">{a.distanceFromSohra}</span>
                    </p>
                    <p className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Best Season:</span>
                      <span className="font-semibold text-emerald-700">{a.bestTime}</span>
                    </p>
                  </div>

                  <Link
                    href="/hotels?area=all"
                    className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center block transition-colors shadow-xs"
                  >
                    Find Hotels Near {a.name}
                  </Link>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
