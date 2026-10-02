"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  MapPin,
  Star,
  Check,
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  ArrowUpDown,
  Navigation,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { getAllHotels } from "@/lib/firebase";
import { Hotel } from "@/lib/types";
import {
  getHotelsNearLandmark,
  CHERRAPUNJI_LANDMARKS,
  HotelProximityResult,
} from "@/lib/geoDistance";
import {
  STAR_TABS,
  getStarRatingFromSlug,
  TravelCategory,
  CHERRAPUNJI_TRAVEL_CATEGORIES,
} from "@/lib/categories";

export interface HotelsCatalogClientProps {
  initialStarRating?: number | null;
  initialStarSlug?: string | null;
  category?: TravelCategory | null;
}

export default function HotelsCatalogClient({
  initialStarRating = null,
  initialStarSlug = null,
  category = null,
}: HotelsCatalogClientProps) {
  const [hotels, setHotels] = useState<Hotel[]>(CHERRAPUNJI_HOTELS);

  useEffect(() => {
    getAllHotels()
      .then((data) => {
        if (data && data.length > 0) {
          setHotels(data);
        }
      })
      .catch(console.error);
  }, []);

  const searchParams = useSearchParams();

  const rawArea = searchParams.get("area");
  const initialArea =
    !rawArea || rawArea.toLowerCase() === "all" || rawArea === "All Areas"
      ? "All Areas"
      : rawArea;

  const urlStars = searchParams.get("stars")
    ? searchParams.get("stars")!.split(",").map(Number)
    : [];

  const defaultStars = initialStarRating
    ? [initialStarRating]
    : urlStars.length > 0
    ? urlStars
    : [];

  const initialCollection = category?.slug || searchParams.get("collection") || "all";
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";
  const initialNear = searchParams.get("near") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedStars, setSelectedStars] = useState<number[]>(defaultStars);
  const [activeStarSlug, setActiveStarSlug] = useState<string | null>(
    initialStarSlug || (initialStarRating ? `star-${initialStarRating}` : null)
  );
  const [selectedLandmark, setSelectedLandmark] = useState<string>(initialNear);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialStarRating) {
      setSelectedStars([initialStarRating]);
      setActiveStarSlug(initialStarSlug || null);
    }
  }, [initialStarRating, initialStarSlug]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      const path = window.location.pathname;
      const parts = path.split("/").filter(Boolean);
      if (parts.length === 1 && parts[0] === "hotels") {
        setSelectedStars([]);
        setActiveStarSlug(null);
      } else if (parts.length >= 2 && parts[0] === "hotels") {
        const rating = getStarRatingFromSlug(parts[1]);
        if (rating !== null) {
          setSelectedStars([rating]);
          setActiveStarSlug(parts[1]);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selectedLandmarkInfo = useMemo(() => {
    return CHERRAPUNJI_LANDMARKS.find((l) => l.id === selectedLandmark) || null;
  }, [selectedLandmark]);

  const proximityData = useMemo(() => {
    if (!selectedLandmark) return null;
    const results = getHotelsNearLandmark(selectedLandmark, hotels);
    const map = new Map<string, HotelProximityResult>();
    results.forEach((r) => map.set(r.hotel.id, r));
    return { results, map };
  }, [selectedLandmark, hotels]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== "All Areas") count++;
    if (selectedCollection !== "all" && !category) count++;
    if (selectedStars.length > 0 && !initialStarRating) count += selectedStars.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (selectedLandmark) count++;
    if (maxPrice < 15000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedArea,
    selectedCollection,
    selectedStars,
    selectedAmenities,
    selectedLandmark,
    maxPrice,
    searchQuery,
    initialStarRating,
    category,
  ]);

  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    hotels.forEach((h) => {
      if (h.area) set.add(h.area);
    });
    return ["All Areas", ...Array.from(set)];
  }, [hotels]);

  const allAmenitiesList = useMemo(() => {
    return [
      "Free High-Speed Wi-Fi",
      "24/7 Hot Water / Geyser",
      "Mountain & Valley View",
      "Multi-Cuisine Restaurant",
      "Free Private Parking",
      "Private Balcony",
      "Bonfire & Barbeque",
      "Room Heater",
      "Tea / Coffee Maker",
      "Travel Desk & Cab Services",
    ];
  }, []);

  const handleStarTabClick = (star: number | null, slug: string | null) => {
    if (star === null || !slug) {
      setSelectedStars([]);
      setActiveStarSlug(null);
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", "/hotels");
      }
    } else {
      setSelectedStars([star]);
      setActiveStarSlug(slug);
      if (selectedCollection !== "all" && !category) {
        setSelectedCollection("all");
      }
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `/hotels/${slug}`);
      }
    }
  };

  const isTabActive = (star: number | null) => {
    if (star === null) return selectedStars.length === 0;
    return selectedStars.length === 1 && selectedStars[0] === star;
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedArea("All Areas");
    setSelectedCollection("all");
    setSelectedStars([]);
    setActiveStarSlug(null);
    setSelectedLandmark("");
    setMaxPrice(15000);
    setSelectedAmenities([]);
    setSortBy("featured");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/hotels");
    }
  };

  const filteredHotels = useMemo(() => {
    let list = [...hotels];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
    }

    if (selectedArea && selectedArea !== "All Areas") {
      list = list.filter((h) => h.area.toLowerCase().includes(selectedArea.toLowerCase()));
    }

    if (selectedCollection && selectedCollection !== "all") {
      const travelCat = CHERRAPUNJI_TRAVEL_CATEGORIES.find((tc) => tc.slug === selectedCollection);
      if (travelCat) {
        list = list.filter((h) => {
          if (h.categories && h.categories.includes(selectedCollection)) return true;
          if (travelCat.starFilter && h.starRating === travelCat.starFilter) return true;
          return false;
        });
      } else if (selectedCollection === "cliffside") {
        list = list.filter(
          (h) =>
            h.tagline.toLowerCase().includes("cliff") ||
            h.tagline.toLowerCase().includes("valley") ||
            h.tagline.toLowerCase().includes("falls") ||
            h.name.toLowerCase().includes("orchid") ||
            h.name.toLowerCase().includes("kutmadan") ||
            h.amenities.some(
              (a) => a.toLowerCase().includes("view") || a.toLowerCase().includes("waterfall")
            )
        );
      } else if (selectedCollection === "resorts") {
        list = list.filter((h) => h.name.toLowerCase().includes("resort") || h.starRating >= 4);
      } else if (selectedCollection === "cottages") {
        list = list.filter(
          (h) =>
            h.rooms.some((r) => r.name.toLowerCase().includes("cottage")) ||
            h.description.toLowerCase().includes("cottage") ||
            h.description.toLowerCase().includes("pine")
        );
      } else if (selectedCollection === "homestays") {
        list = list.filter(
          (h) =>
            h.name.toLowerCase().includes("homestay") ||
            h.tagline.toLowerCase().includes("homestay") ||
            h.starRating <= 3
        );
      }
    }

    if (selectedStars.length > 0) {
      list = list.filter((h) => selectedStars.includes(h.starRating));
    }

    list = list.filter((h) => h.pricePerNight <= maxPrice);

    if (selectedAmenities.length > 0) {
      list = list.filter((h) =>
        selectedAmenities.every((required) => {
          const req = required.toLowerCase();
          if (req.includes("wi-fi") || req.includes("wifi")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return al.includes("wi-fi") || al.includes("wifi") || al.includes("internet");
            });
          }
          if (req.includes("water") || req.includes("geyser")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return al.includes("water") || al.includes("geyser") || al.includes("hot");
            });
          }
          if (req.includes("view") || req.includes("mountain") || req.includes("valley")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return (
                al.includes("view") ||
                al.includes("valley") ||
                al.includes("cliff") ||
                al.includes("canyon") ||
                al.includes("falls")
              );
            });
          }
          if (req.includes("restaurant") || req.includes("dining")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return (
                al.includes("restaurant") ||
                al.includes("dining") ||
                al.includes("food") ||
                al.includes("cafe") ||
                al.includes("kitchen")
              );
            });
          }
          if (req.includes("parking")) {
            return h.amenities.some((a) => a.toLowerCase().includes("parking"));
          }
          if (req.includes("balcony")) {
            return h.amenities.some(
              (a) => a.toLowerCase().includes("balcony") || a.toLowerCase().includes("terrace")
            );
          }
          if (req.includes("bonfire") || req.includes("barbeque")) {
            return h.amenities.some(
              (a) =>
                a.toLowerCase().includes("bonfire") ||
                a.toLowerCase().includes("fire") ||
                a.toLowerCase().includes("campfire")
            );
          }
          if (req.includes("heater")) {
            return h.amenities.some(
              (a) => a.toLowerCase().includes("heater") || a.toLowerCase().includes("fireplace")
            );
          }
          if (req.includes("tea") || req.includes("coffee")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return (
                al.includes("tea") ||
                al.includes("coffee") ||
                al.includes("kettle") ||
                al.includes("espresso")
              );
            });
          }
          if (req.includes("travel") || req.includes("cab") || req.includes("services")) {
            return h.amenities.some((a) => {
              const al = a.toLowerCase();
              return (
                al.includes("travel") ||
                al.includes("desk") ||
                al.includes("cab") ||
                al.includes("guide") ||
                al.includes("trek")
              );
            });
          }
          return h.amenities.some((a) => a.toLowerCase().includes(req));
        })
      );
    }

    if (selectedLandmark && proximityData) {
      list.sort((a, b) => {
        const distA = proximityData.map.get(a.id)?.distanceKm ?? 999;
        const distB = proximityData.map.get(b.id)?.distanceKm ?? 999;
        return distA - distB;
      });
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "stars") {
      list.sort((a, b) => b.starRating - a.starRating);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [
    hotels,
    searchQuery,
    selectedArea,
    selectedCollection,
    selectedStars,
    maxPrice,
    selectedAmenities,
    sortBy,
    selectedLandmark,
    proximityData,
  ]);

  const handleOpenInquiry = (hotel?: Hotel) => {
    setSelectedHotelForInquiry(hotel || null);
    setInquiryModalOpen(true);
  };

  const activeStarTab = STAR_TABS.find((t) => t.stars !== null && isTabActive(t.stars));
  const pageTitle = activeStarTab
    ? `${activeStarTab.label} in Cherrapunji`
    : category
    ? category.name
    : "Resorts & Suites in Cherrapunji";

  const pageSubtitle = activeStarTab
    ? `Explore certified ${activeStarTab.label.toLowerCase()} with canyon views, luxury amenities, and verified direct tariffs.`
    : category
    ? category.description
    : "Discover handpicked cliffside sanctuaries, valley-facing cottages, and peaceful village homestays.";

  const currentLinkPrefix = activeStarSlug ? `/hotels/${activeStarSlug}` : "/hotels";

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 selection:bg-amber-400 selection:text-black">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Header */}
      <div className="pt-24 pb-6 sm:pt-28 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {activeStarTab && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified {activeStarTab.label} Tier</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.03em] text-white">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-2xl leading-relaxed">
              {pageSubtitle}
            </p>
          </div>

          {/* Grid ↔ Map View Switcher */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10 self-start md:self-auto shrink-0 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-black font-extrabold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-white text-black font-extrabold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Guide</span>
            </button>
          </div>
        </div>

        {/* Star Rating Top Tab Bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {STAR_TABS.map((tab) => {
              const isActive = isTabActive(tab.stars);
              const count =
                tab.stars === null
                  ? hotels.length
                  : hotels.filter((h) => h.starRating === tab.stars).length;

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => handleStarTabClick(tab.stars, tab.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black font-extrabold shadow-md"
                      : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                  }`}
                >
                  {tab.stars !== null && (
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? "fill-black text-black"
                          : "fill-amber-400 text-amber-400"
                      }`}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-black/15 text-black font-black"
                        : "bg-white/[0.06] text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-white/40 whitespace-nowrap">
            <span>
              Showing <span className="font-bold text-white">{filteredHotels.length}</span> verified stays
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {viewMode === "map" ? (
          <div className="space-y-8">
            <MapExplorer
              hotels={filteredHotels}
              selectedLandmark={selectedLandmark}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  proximity={proximityData?.map.get(hotel.id)}
                  linkPrefix={currentLinkPrefix}
                  onEnquire={(h) => handleOpenInquiry(h)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Mobile Quick Filter */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stay or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] text-white text-xs font-bold uppercase tracking-wider shrink-0"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full text-[10px] bg-amber-400 text-black flex items-center justify-center font-black">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Layout Grid: 3 cols Sidebar + 9 cols Hotel Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Filters Sidebar */}
              <aside
                className={`lg:col-span-3 bg-[#111418] p-5 rounded-2xl border border-white/10 shadow-2xl space-y-6 ${
                  mobileFilterOpen ? "block" : "hidden lg:block"
                }`}
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <span className="font-black text-xs uppercase tracking-widest text-white">Filter Stays</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Desktop Search input */}
                <div className="hidden lg:block">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">
                    Search Name / Area
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Polo, Nohsngithiang..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Landmark Proximity Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">
                    Proximity to Sightseeing
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLandmark}
                      onChange={(e) => setSelectedLandmark(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer [color-scheme:dark]"
                    >
                      <option value="" className="bg-[#111418] text-white">Select Sightseeing Spot...</option>
                      {CHERRAPUNJI_LANDMARKS.map((lm) => (
                        <option key={lm.id} value={lm.id} className="bg-[#111418] text-white">
                          {lm.name} ({lm.category})
                        </option>
                      ))}
                    </select>
                    <Compass className="w-3.5 h-3.5 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Locality Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-1.5">
                    Locality / Region
                  </label>
                  <div className="relative">
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 appearance-none cursor-pointer [color-scheme:dark]"
                    >
                      {availableAreas.map((area) => (
                        <option key={area} value={area} className="bg-[#111418] text-white">
                          {area}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                    <span className="text-white/40 uppercase text-[10px] tracking-widest">Max Nightly Tariff</span>
                    <span className="text-white">Up to ₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={15000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mt-1">
                    <span>₹2,000</span>
                    <span>₹15,000+</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">
                    Key Amenities
                  </label>
                  <div className="space-y-1.5">
                    {allAmenitiesList.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                            isChecked
                              ? "bg-white text-black font-bold"
                              : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/5"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 ${
                              isChecked ? "bg-black text-white" : "border border-white/20 bg-transparent"
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span className="truncate">{amenity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Right Listings Area (9 cols) */}
              <main className="lg:col-span-9 space-y-6">
                {/* Proximity Callout Banner */}
                {selectedLandmarkInfo && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111418] border border-white/15 text-xs text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">
                          Showing stays closest to {selectedLandmarkInfo.name}
                        </p>
                        <p className="text-xs text-white/50 mt-0.5 font-mono">
                          Ranked by shortest mountain road distance (Dijkstra algorithm)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLandmark("")}
                      className="self-start sm:self-auto px-4 py-2 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}

                {/* Sort Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111418] p-3 sm:p-4 rounded-xl border border-white/10">
                  <p className="text-xs font-mono text-white/50">
                    Showing <span className="text-white font-bold">{filteredHotels.length}</span> verified properties
                  </p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/40 flex items-center gap-1 font-mono uppercase text-[10px] tracking-widest">
                      <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer [color-scheme:dark]"
                    >
                      <option value="featured" className="bg-[#111418] text-white">Featured Sanctuaries</option>
                      <option value="price_asc" className="bg-[#111418] text-white">Tariff: Low to High</option>
                      <option value="price_desc" className="bg-[#111418] text-white">Tariff: High to Low</option>
                      <option value="rating" className="bg-[#111418] text-white">Highest Guest Rating</option>
                      <option value="stars" className="bg-[#111418] text-white">Star Tier</option>
                    </select>
                  </div>
                </div>

                {/* Cards Grid */}
                {filteredHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        proximity={proximityData?.map.get(hotel.id)}
                        linkPrefix={currentLinkPrefix}
                        onEnquire={(h) => handleOpenInquiry(h)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-14 text-center bg-[#111418] rounded-2xl border border-white/10 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto text-white/40">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">No Sanctuaries Match Filters</h3>
                    <p className="text-xs text-white/50 max-w-sm mx-auto">
                      Adjust your filters or reset maximum tariff and star rating.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-5 py-2.5 rounded-full bg-white text-black font-extrabold uppercase tracking-wider text-xs shadow-lg"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
        )}
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={selectedHotelForInquiry}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
      />

      <Footer />
    </div>
  );
}
