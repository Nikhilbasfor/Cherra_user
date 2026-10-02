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
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import MapExplorer from "@/components/MapExplorer";
import InquiryModal from "@/components/InquiryModal";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_AREAS } from "@/lib/mockData";
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

  // Sync state if props change
  useEffect(() => {
    if (initialStarRating) {
      setSelectedStars([initialStarRating]);
      setActiveStarSlug(initialStarSlug || null);
    }
  }, [initialStarRating, initialStarSlug]);

  // Handle browser back / forward navigation seamlessly
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
      // Check if it's one of the travel categories
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
            h.name.toLowerCase().includes("holiday resort") ||
            h.starRating <= 3 ||
            h.tagline.toLowerCase().includes("pioneer")
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

  // Derive dynamic header info based on active star or category
  const activeStarTab = STAR_TABS.find((t) => t.stars !== null && isTabActive(t.stars));
  const pageTitle = activeStarTab
    ? `${activeStarTab.label} in Cherrapunji`
    : category
    ? category.name
    : "Hotels and Resorts in Cherrapunji";

  const pageSubtitle = activeStarTab
    ? `Explore certified ${activeStarTab.label.toLowerCase()} with canyon views, luxury amenities, and verified direct tariffs.`
    : category
    ? category.description
    : "Discover handpicked boutique resorts, valley-facing cottages, and peaceful homestays with direct front-desk tariffs.";

  const currentLinkPrefix = activeStarSlug ? `/hotels/${activeStarSlug}` : "/hotels";

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Header */}
      <div className="pt-20 pb-4 sm:pt-24 sm:pb-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            {activeStarTab && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-1.5 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified {activeStarTab.label} Collection</span>
              </div>
            )}
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {pageSubtitle}
            </p>
          </div>

          {/* Grid ↔ Map View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Star Rating Top Tab Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
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
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs font-bold ring-1 ring-slate-900"
                      : "bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200/90 shadow-2xs font-medium"
                  }`}
                >
                  {tab.stars !== null && (
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? "fill-amber-400 text-amber-400"
                          : "fill-amber-400 text-amber-400"
                      }`}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-slate-800 text-slate-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap">
            <span>
              Showing <span className="font-semibold text-slate-900">{filteredHotels.length}</span> verified stays
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {viewMode === "map" ? (
          <div className="space-y-6">
            <MapExplorer
              hotels={filteredHotels}
              selectedLandmark={selectedLandmark}
              onEnquire={(h) => handleOpenInquiry(h)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
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
            {/* Mobile Quick Filter & Search Bar */}
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hotel or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shadow-xs transition-colors shrink-0 ${
                  mobileFilterOpen || activeFilterCount > 0
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      mobileFilterOpen || activeFilterCount > 0
                        ? "bg-white text-emerald-800"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Layout Grid: 3 cols Sidebar + 9 cols Hotel Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Filters Sidebar (3 cols) */}
              <aside
                className={`lg:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5 ${
                  mobileFilterOpen ? "block" : "hidden lg:block"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">Refine Search</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Desktop Search input */}
                <div className="hidden lg:block">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Search Name / Area
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Polo, Nohsngithiang..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Landmark Dijkstra Distance Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Proximity to Sightseeing
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                      Shortest Road
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedLandmark}
                      onChange={(e) => setSelectedLandmark(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Sightseeing Spot...</option>
                      {CHERRAPUNJI_LANDMARKS.map((lm) => (
                        <option key={lm.id} value={lm.id}>
                          {lm.name} ({lm.category})
                        </option>
                      ))}
                    </select>
                    <Compass className="w-3.5 h-3.5 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {selectedLandmarkInfo && (
                    <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Sorting stays by mountain road distance</span> to{" "}
                        <span className="font-bold">{selectedLandmarkInfo.name}</span>.
                      </div>
                    </div>
                  )}
                </div>

                {/* Area Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Locality / Region
                  </label>
                  <div className="relative">
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer"
                    >
                      {availableAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Price Budget Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Max Tariff</span>
                    <span className="text-slate-900 font-bold">Up to ₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={15000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>₹2,000</span>
                    <span>₹15,000+</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Key Amenities
                  </label>
                  <div className="space-y-1">
                    {allAmenitiesList.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                              : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 ${
                              isChecked ? "bg-emerald-600 text-white" : "border border-slate-300 bg-white"
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

                {/* Mobile Apply Button */}
                <div className="lg:hidden pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs text-center transition-colors"
                  >
                    Apply & Show {filteredHotels.length} Stays
                  </button>
                </div>
              </aside>

              {/* Right Listings Area (9 cols) */}
              <main className="lg:col-span-9 space-y-5">
                {/* Proximity Callout Banner */}
                {selectedLandmarkInfo && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">
                          Showing stays closest to {selectedLandmarkInfo.name}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          Filtered &amp; ranked by shortest mountain road distance (Dijkstra algorithm)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLandmark("")}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear Landmark</span>
                    </button>
                  </div>
                )}

                {/* Sort Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
                  <p className="text-xs text-slate-500">
                    Showing <span className="text-slate-900 font-bold">{filteredHotels.length}</span> verified properties
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="featured">Featured Stays</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Highest Guest Rating</option>
                      <option value="stars">Star Rating</option>
                    </select>
                  </div>
                </div>

                {/* Cards Grid */}
                {filteredHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No Stays Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try adjusting your filters or resetting price and star ratings.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs"
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
