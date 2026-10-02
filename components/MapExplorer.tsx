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
  selectedLandmark?: string;
  onEnquire?: (hotel: Hotel) => void;
}

export default function MapExplorer({
  hotels = CHERRAPUNJI_HOTELS,
  attractions = CHERRAPUNJI_ATTRACTIONS,
  selectedLandmark,
  onEnquire,
}: MapExplorerProps) {
  const [activeItem, setActiveItem] = useState<{
    type: "hotel" | "attraction";
    data: Hotel | Attraction;
  }>(() => {
    if (selectedLandmark) {
      const match = attractions.find((a) => a.id === selectedLandmark);
      if (match) return { type: "attraction", data: match };
    }
    return {
      type: "hotel",
      data: hotels[0] || CHERRAPUNJI_HOTELS[0],
    };
  });

  React.useEffect(() => {
    if (selectedLandmark) {
      const match = attractions.find((a) => a.id === selectedLandmark);
      if (match) {
        setActiveItem({ type: "attraction", data: match });
      }
    }
  }, [selectedLandmark, attractions]);

  const [filterType, setFilterType] = useState<"all" | "hotels" | "attractions">("all");

  return (
    <div className="w-full bg-[#111418] rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Cherrapunji Geographic Map Guide</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-white">
            Explore Hotels & Scenic Spots on Map
          </h2>
          <p className="text-xs font-mono text-white/50 mt-1">
            Select pins to view real-time tariffs and proximity to waterfalls and root bridges.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 self-start md:self-auto font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-white text-black font-black shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            All ({hotels.length + attractions.length})
          </button>
          <button
            onClick={() => setFilterType("hotels")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "hotels"
                ? "bg-white text-black font-black shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            Hotels ({hotels.length})
          </button>
          <button
            onClick={() => setFilterType("attractions")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "attractions"
                ? "bg-white text-black font-black shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            Attractions ({attractions.length})
          </button>
        </div>
      </div>

      {/* Main Map + Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daylight Map Container (8 cols) */}
        <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
          <div className="absolute inset-0">
            <iframe
              title="Cherrapunji Natural Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "brightness(0.85) contrast(1.1)" }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=91.6400%2C25.2000%2C91.7800%2C25.3200&layer=mapnik"
            />
          </div>

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 text-xs font-mono text-white shadow-md">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
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
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all shadow-xl cursor-pointer ${
                      isActive
                        ? "bg-amber-400 text-black ring-4 ring-amber-400/30 scale-105 z-20"
                        : "bg-[#111418] text-white border border-white/20 hover:border-amber-400 hover:bg-[#151920] z-10"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
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
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all shadow-xl cursor-pointer ${
                      isActive
                        ? "bg-white text-black ring-4 ring-white/30 scale-105 z-20"
                        : "bg-[#111418] text-white/80 border border-white/20 hover:border-white/40 z-10"
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span className="max-w-[90px] truncate">{att.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Preview Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-black/40 border border-white/10 rounded-2xl p-5">
          {activeItem.type === "hotel" ? (
            (() => {
              const h = activeItem.data as Hotel;
              return (
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/10">
                    <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-amber-400 text-xs font-mono font-bold border border-white/15">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{h.starRating} Star</span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-amber-400 text-black text-xs font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md">
                      ₹{h.pricePerNight} / night
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-xs text-white/50 font-mono mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{h.area}, Sohra</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-snug">{h.name}</h3>
                    <p className="text-xs text-white/60 font-mono mt-1 line-clamp-2 leading-relaxed">{h.tagline}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/60 space-y-1.5">
                    <p className="flex items-center justify-between">
                      <span className="text-white/40">Guest Rating:</span>
                      <span className="font-bold text-amber-400">★ {h.rating} ({h.reviewsCount})</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-white/40">Distance to town:</span>
                      <span className="text-white/80">{h.distanceToCenter || "2.5 km"}</span>
                    </p>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link
                      href={`/hotels/${h.slug}`}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white border border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Rooms</span>
                      <ExternalLink className="w-3 h-3 text-white/40" />
                    </Link>
                    <button
                      onClick={() => onEnquire?.(h)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
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
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/10">
                    <Image src={a.image} alt={a.name} fill className="object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/15">
                      {a.category}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-amber-400 font-mono uppercase tracking-wider mb-1">
                      {a.khasiName ? `Local: ${a.khasiName}` : "Natural Sanctuary"}
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-snug">{a.name}</h3>
                    <p className="text-xs text-white/60 font-mono mt-1 leading-relaxed line-clamp-3">{a.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono space-y-1.5">
                    <p className="flex items-center justify-between text-white/60">
                      <span className="text-white/40">Distance:</span>
                      <span className="font-bold text-white">{a.distanceFromSohra}</span>
                    </p>
                    <p className="flex items-center justify-between text-white/60">
                      <span className="text-white/40">Best Season:</span>
                      <span className="font-bold text-amber-400">{a.bestTime}</span>
                    </p>
                  </div>

                  <Link
                    href={`/hotels?near=${a.id}`}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs text-center block transition-all shadow-md"
                  >
                    Find Stays Near {a.name}
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
