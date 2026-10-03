"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  Check,
  RotateCcw,
  ArrowUpDown,
  Navigation,
  Compass,
  Plus,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
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

const TOP_5_AMENITIES = [
  "Free High-Speed Wi-Fi",
  "24/7 Hot Water / Geyser",
  "Mountain & Valley View",
  "Multi-Cuisine Restaurant",
  "Free Private Parking",
];

const ADDITIONAL_AMENITIES = [
  "Private Balcony",
  "Bonfire & Barbeque",
  "Room Heater",
  "Tea / Coffee Maker",
  "Travel Desk & Cab Services",
];

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
      ? ""
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

  const [searchQuery, setSearchQuery] = useState(initialArea);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedStars, setSelectedStars] = useState<number[]>(defaultStars);
  const [activeStarSlug, setActiveStarSlug] = useState<string | null>(
    initialStarSlug || (initialStarRating ? `star-${initialStarRating}` : null)
  );
  const [selectedLandmark, setSelectedLandmark] = useState<string>(initialNear);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedHotelForInquiry, setSelectedHotelForInquiry] = useState<Hotel | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);

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
    if (selectedCollection !== "all" && !category) count++;
    if (selectedStars.length > 0 && !initialStarRating) count += selectedStars.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (selectedLandmark) count++;
    if (maxPrice < 15000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCollection,
    selectedStars,
    selectedAmenities,
    selectedLandmark,
    maxPrice,
    searchQuery,
    initialStarRating,
    category,
  ]);

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
          h.address.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
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
    ? `Explore certified ${activeStarTab.label.toLowerCase()} with canyon views and verified direct tariffs.`
    : category
    ? category.description
    : "Discover handpicked cliffside sanctuaries, valley cottages, and peaceful village homestays.";

  const currentLinkPrefix = activeStarSlug ? `/hotels/${activeStarSlug}` : "/hotels";

  return (
    <div className="min-h-screen bg-[#edf7f2] text-slate-900 selection:bg-amber-400 selection:text-black">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      {/* Header - Uplifted with reduced padding and compact title */}
      <div className="pt-20 sm:pt-24 pb-3 sm:pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-emerald-900/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Rectangular Tabs with Slight Curve, No Star Emojis/Icons, No Scrollbar Stretched Text */}
        <div className="mt-4 pt-3 border-t border-emerald-900/10 flex flex-wrap gap-2 items-center">
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm font-extrabold"
                    : "bg-white/80 hover:bg-white text-slate-700 border border-emerald-900/10"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Uplifted with Three Hotels in View Immediately */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Mobile Quick Filter */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Hotel / area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-emerald-900/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-900/10 bg-white text-slate-800 text-xs font-bold uppercase tracking-wider shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] bg-emerald-700 text-white flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Layout Grid: 3 cols Sidebar + 9 cols Hotel Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filters Sidebar */}
          <aside
            className={`lg:col-span-3 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-900/10 shadow-sm space-y-5 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span className="font-black text-xs uppercase tracking-wider text-slate-900">Filter Stays</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-mono font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Search Hotel / Area Input (faint placeholder inside) */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Search Hotel / Area
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-900/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400/80 focus:outline-none focus:border-emerald-700 focus:bg-white"
                />
              </div>
            </div>

            {/* Sightseeing Spot Proximity */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Proximity to Spot
              </label>
              <div className="relative">
                <select
                  value={selectedLandmark}
                  onChange={(e) => setSelectedLandmark(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-900/10 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-700 appearance-none cursor-pointer"
                >
                  <option value="">All Cherrapunji Sights...</option>
                  {CHERRAPUNJI_LANDMARKS.map((lm) => (
                    <option key={lm.id} value={lm.id}>
                      {lm.name} ({lm.category})
                    </option>
                  ))}
                </select>
                <Compass className="w-3.5 h-3.5 text-emerald-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-slate-500 uppercase text-[10px] tracking-wider">Max Nightly Tariff</span>
                <span className="text-slate-900">Up to ₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>₹2,000</span>
                <span>₹15,000+</span>
              </div>
            </div>

            {/* Top 5 Key Amenities + Add More Button */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Key Amenities
              </label>
              <div className="space-y-1.5">
                {TOP_5_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 ${
                          isChecked ? "bg-emerald-700 text-white" : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}

                {/* Selected items from additional list */}
                {selectedAmenities
                  .filter((a) => !TOP_5_AMENITIES.includes(a))
                  .map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] shrink-0 bg-emerald-700 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  ))}

                {/* + More Amenities Button */}
                <button
                  type="button"
                  onClick={() => setAmenitiesModalOpen(true)}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-dashed border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ More Amenities</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Listings Area (9 cols) */}
          <main className="lg:col-span-9 space-y-4">
            {/* Proximity Callout Banner */}
            {selectedLandmarkInfo && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-emerald-900/10 text-xs text-slate-900 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">
                      Showing stays closest to {selectedLandmarkInfo.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Ranked by shortest mountain road distance
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLandmark("")}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            )}

            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-emerald-900/10">
              <p className="text-xs font-mono text-slate-600">
                Verified: <span className="text-slate-900 font-bold">{filteredHotels.length} properties</span>
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1 font-mono uppercase text-[10px] tracking-wider">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
                >
                  <option value="featured">Featured Sanctuaries</option>
                  <option value="price_asc">Tariff: Low to High</option>
                  <option value="price_desc">Tariff: High to Low</option>
                  <option value="rating">Highest Guest Rating</option>
                  <option value="stars">Star Tier</option>
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
              <div className="p-10 text-center bg-white rounded-2xl border border-emerald-900/10 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">No Sanctuaries Match Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Adjust your search terms or reset the nightly tariff and star rating.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase tracking-wider text-xs shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Additional Amenities Popup Modal */}
      {amenitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight">
                Additional Amenities
              </h3>
              <button
                type="button"
                onClick={() => setAmenitiesModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {ADDITIONAL_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isChecked
                        ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                        isChecked ? "bg-emerald-700 text-white" : "border border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setAmenitiesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

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
