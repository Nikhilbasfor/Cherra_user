"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Navigation, Compass, ExternalLink, Search } from "lucide-react";
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
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hotels" | "attractions">("all");

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

  const filteredHotels = useMemo(() => {
    if (!mapSearchQuery.trim()) return hotels;
    const q = mapSearchQuery.toLowerCase();
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.tagline.toLowerCase().includes(q)
    );
  }, [hotels, mapSearchQuery]);

  const filteredAttractions = useMemo(() => {
    if (!mapSearchQuery.trim()) return attractions;
    const q = mapSearchQuery.toLowerCase();
    return attractions.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.khasiName && a.khasiName.toLowerCase().includes(q))
    );
  }, [attractions, mapSearchQuery]);

  return (
    <div className="w-full bg-white rounded-3xl border border-emerald-900/10 p-5 sm:p-7 lg:p-8 shadow-sm text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-600 mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Cherrapunji Geographic Map Guide</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-slate-900">
            Explore Hotels &amp; Scenic Spots on Map
          </h2>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Interactive coordinates showing real-time tariffs and proximity to waterfalls and root bridges.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto font-mono text-xs uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-emerald-700 text-white font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({filteredHotels.length + filteredAttractions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("hotels")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "hotels"
                ? "bg-emerald-700 text-white font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hotels ({filteredHotels.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("attractions")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === "attractions"
                ? "bg-emerald-700 text-white font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Attractions ({filteredAttractions.length})
          </button>
        </div>
      </div>

      {/* Faint Search Bar on Top of Map */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={mapSearchQuery}
          onChange={(e) => setMapSearchQuery(e.target.value)}
          placeholder="Search your spot or landmark to find nearest stays..."
          className="w-full bg-slate-50 border border-emerald-900/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400/80 focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner"
        />
        {mapSearchQuery && (
          <button
            type="button"
            onClick={() => setMapSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Map + Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daylight Map Container (8 cols) */}
        <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-900/10 bg-slate-100 shadow-inner">
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
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/5 flex items-center gap-2 text-xs font-mono text-slate-800 shadow-sm">
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sohra Plateau • 1,484m Elevation</span>
          </div>

          {/* Interactive Pins */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Hotels Pins */}
            {(filterType === "all" || filterType === "hotels") &&
              filteredHotels.map((hotel, idx) => {
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
                    type="button"
                    onClick={() => setActiveItem({ type: "hotel", data: hotel })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
                      isActive
                        ? "bg-emerald-700 text-white ring-4 ring-emerald-700/30 scale-105 z-20"
                        : "bg-white text-slate-900 border border-emerald-900/15 hover:border-emerald-700 hover:bg-emerald-50 z-10"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>₹{hotel.pricePerNight}</span>
                  </button>
                );
              })}

            {/* Attractions Pins */}
            {(filterType === "all" || filterType === "attractions") &&
              filteredAttractions.map((att, idx) => {
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
                    type="button"
                    onClick={() => setActiveItem({ type: "attraction", data: att })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all shadow-md cursor-pointer ${
                      isActive
                        ? "bg-amber-600 text-white ring-4 ring-amber-500/30 scale-105 z-20"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-amber-500 z-10"
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span className="max-w-[90px] truncate">{att.name}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Preview Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-emerald-50/40 border border-emerald-900/10 rounded-2xl p-5">
          {activeItem.type === "hotel" ? (
            (() => {
              const h = activeItem.data as Hotel;
              return (
                <div className="space-y-3.5">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-emerald-900/10">
                    <Image src={h.images[0]} alt={h.name} fill className="object-cover" />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-white text-xs font-mono font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{h.starRating} Star</span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-emerald-700 text-white text-xs font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                      ₹{h.pricePerNight} / night
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{h.area}, Sohra</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-snug">{h.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{h.tagline}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-900/10 text-xs font-mono space-y-1.5">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Guest Rating:</span>
                      <span className="font-bold text-amber-600">★ {h.rating} ({h.reviewsCount})</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Distance to town:</span>
                      <span className="text-slate-800 font-medium">{h.distanceToCenter || "2.5 km"}</span>
                    </p>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <Link
                      href={`/hotels/${h.slug}`}
                      className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-mono font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Rooms</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEnquire?.(h)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer"
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
                <div className="space-y-3.5">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-emerald-900/10">
                    <Image src={a.image} alt={a.name} fill className="object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
                      {a.category}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-amber-600 font-mono uppercase tracking-wider mb-1 font-bold">
                      {a.khasiName ? `Local: ${a.khasiName}` : "Natural Sanctuary"}
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-snug">{a.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">{a.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-900/10 text-xs font-mono space-y-1.5">
                    <p className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Distance:</span>
                      <span className="font-bold text-slate-900">{a.distanceFromSohra}</span>
                    </p>
                    <p className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Best Season:</span>
                      <span className="font-bold text-amber-600">{a.bestTime}</span>
                    </p>
                  </div>

                  <Link
                    href={`/hotels?near=${a.id}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-extrabold uppercase tracking-wider text-xs text-center block transition-all shadow-md"
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
