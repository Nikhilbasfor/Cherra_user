"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  Grid,
  X,
  Wifi,
  Car,
  Coffee,
  Bath,
  Mountain,
  Luggage,
  Users,
  ExternalLink,
  CreditCard,
  Ban,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { Hotel, Room, HotelReview } from "@/lib/types";
import { getHotelReviews, submitHotelReview } from "@/lib/firebase";

interface HotelDetailClientProps {
  hotel: Hotel;
  parentCategory?: {
    slug: string;
    name: string;
  };
}

export default function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  // Photo Lightbox & Gallery state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeMobileImageIndex, setActiveMobileImageIndex] = useState(0);

  // Active in-page navigation section
  const [activeNavSection, setActiveNavSection] = useState("overview");

  // Selected room for inquiry
  const [selectedRoom, setSelectedRoom] = useState<Room>(hotel.rooms[0] || null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviewerName, setReviewerName] = useState("");
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Curated gallery images ensuring at least 5 for the mosaic collage
  const fallbackImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  ];
  const roomImages = (hotel.rooms?.map((r) => r.image).filter(Boolean) as string[]) || [];
  const rawList = [...hotel.images, ...roomImages];
  const galleryImages = Array.from(new Set(rawList.length >= 5 ? rawList : [...rawList, ...fallbackImages])).slice(0, 12);

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  useEffect(() => {
    getHotelReviews(hotel.id)
      .then((data) => {
        if (data) setReviews(data);
      })
      .catch(console.warn);
  }, [hotel.id]);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestsCount, setGuestsCount] = useState("2 Adults");

  // Scroll spy to highlight active in-page navigation tab
  useEffect(() => {
    const sectionIds = ["overview", "rooms", "amenities", "policies", "nearby", "reviews"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNavSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Short, Crisp Amenities
  const amenityCategories = [
    {
      category: "Internet & Connectivity",
      icon: Wifi,
      items: [
        "Free High-Speed Wi-Fi in rooms and common areas",
        "Reliable 4G/5G mobile connectivity (Airtel & Jio)",
        "Power backup support",
      ],
    },
    {
      category: "Parking & Transport",
      icon: Car,
      items: [
        "Free private on-site parking",
        "Paved all-weather road access for tourist cabs",
        "Local sightseeing cab assistance",
      ],
    },
    {
      category: "Dining & Food",
      icon: Coffee,
      items: [
        "In-house dining serving Khasi, Indian and continental dishes",
        "Fresh hot breakfast available",
        "Electric kettle with tea/coffee in room",
      ],
    },
    {
      category: "Bathroom & Hot Water",
      icon: Bath,
      items: [
        "24/7 instant hot water geysers in private bathrooms",
        "Clean cotton bath towels and essentials",
        "Hair dryer provided on request",
      ],
    },
    {
      category: "Views & Outdoors",
      icon: Mountain,
      items: [
        "Balcony overlooking valley or waterfalls",
        "Open mountain lawn and bonfire sitting area",
        "Peaceful natural surroundings",
      ],
    },
    {
      category: "Front Desk & Services",
      icon: Luggage,
      items: [
        "Warm Khasi hospitality & front-desk assistance",
        "Luggage storage",
        "Living root bridge trek guide coordination",
      ],
    },
  ];

  // Short, Crisp Hotel Policies
  const hotelPolicies = [
    {
      title: "Check-in & Check-out",
      icon: Clock,
      content: [
        `Check-in: From ${hotel.checkInTime || "14:00"}`,
        `Check-out: Until ${hotel.checkOutTime || "11:00 AM"}`,
        "Early check-in subject to room availability upon arrival.",
      ],
    },
    {
      title: "Children & Extra Beds",
      icon: Users,
      content: [
        "Children of all ages are welcome.",
        "Children under 6 stay free sharing parent's bed.",
        "Extra mattress available on request.",
      ],
    },
    {
      title: "Cancellation & Changes",
      icon: Ban,
      content: [
        "Free cancellation up to 48 hours before check-in.",
        "Smooth date modifications via direct WhatsApp.",
        "Zero booking commission or hidden fees.",
      ],
    },
    {
      title: "Payment Modes",
      icon: CreditCard,
      content: [
        "UPI: Google Pay, PhonePe, Paytm.",
        "Cards: Visa, MasterCard, RuPay.",
        "Cash on arrival at front desk.",
      ],
    },
  ];

  const nearbyLandmarks = [
    {
      name: "Nohsngithiang (Seven Sisters) Falls",
      distance: hotel.area.toLowerCase().includes("nohsngithiang") ? "1.2 km" : "4.8 km",
      time: "5-10 mins drive",
    },
    {
      name: "Nohkalikai Falls",
      distance: "6.5 km",
      time: "15 mins drive",
    },
    {
      name: "Mawsmai Limestone Cave",
      distance: "3.2 km",
      time: "8 mins drive",
    },
    {
      name: "Wei Sawdong Falls",
      distance: "8.4 km",
      time: "20 mins drive",
    },
    {
      name: "Double Decker Living Root Bridge (Tyrna)",
      distance: "9.8 km",
      time: "25 mins drive",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel.name,
        text: hotel.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hotelPhoneClean = "919864879505";
  const whatsappInquiryUrl = `https://wa.me/${hotelPhoneClean}?text=${encodeURIComponent(
    `Hello! I am looking to book *${hotel.name}* (${selectedRoom ? selectedRoom.name : "Deluxe Room"}) in Cherrapunji. Please confirm room rates & availability.`
  )}`;

  const handleOpenReview = () => {
    setWriteReviewOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newRev: HotelReview = {
        id: "rev-" + Date.now(),
        hotelId: hotel.id,
        userId: "guest-" + Date.now(),
        userName: reviewerName.trim() || "Verified Guest",
        userEmail: "",
        rating,
        title: reviewTitle.trim() || "Wonderful Stay in Sohra",
        comment: reviewComment.trim(),
        stayMonth: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        verified: true,
      };

      const res = await submitHotelReview(newRev);
      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
      } else {
        setReviews([newRev, ...reviews]);
      }
      setReviewerName("");
      setReviewTitle("");
      setReviewComment("");
      setWriteReviewOpen(false);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf7f2] text-slate-900 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Uplifted Header: Spacing reduced, breadcrumbs removed, hotel name on top */}
      <div className="pt-18 sm:pt-22 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="space-y-1">
            {/* 1. Hotel Name on Top */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              {hotel.name}
            </h1>

            {/* 2. Solid info line just below hotel name in small, separated by | */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 pt-0.5">
              <Link
                href={`/hotels/${
                  hotel.starRating === 5
                    ? "5-star-resorts"
                    : hotel.starRating === 4
                    ? "4-star-resorts"
                    : hotel.starRating === 3
                    ? "3-star-resorts"
                    : hotel.starRating === 2
                    ? "2-star-stays"
                    : "1-star-stays"
                }`}
                className="font-bold text-amber-700 hover:underline"
              >
                {hotel.starRating} Star {hotel.starRating >= 3 ? "Resort" : "Stay"}
              </Link>
              <span>|</span>
              <span className="font-bold text-slate-800">
                ★ {hotel.rating} Superb ({reviews.length > 0 ? reviews.length : hotel.reviewsCount})
              </span>
              <span>|</span>
              <span className="text-slate-600">Verified Direct Tariff</span>
            </div>

            {/* 3. Address line with View on Map */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono pt-0.5">
              <span>{hotel.address}</span>
              <span>|</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>View on Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Rate & Share Header Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 pt-1">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Direct Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">₹{hotel.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-mono">/ night</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-emerald-900/10 transition-colors text-xs font-mono shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photos Aligned in First View - Compact Height so First View is Not Cut Off */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-3">
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-emerald-900/10 shadow-sm">
          {/* Desktop 5-Photo Mosaic Grid (Compact 300px - 340px) */}
          <div className="hidden md:grid grid-cols-12 gap-1.5 h-[290px] lg:h-[330px] p-1.5 bg-slate-100 rounded-2xl overflow-hidden">
            {/* Left Large Photo */}
            <div
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="col-span-7 relative h-full rounded-xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={galleryImages[0]}
                alt={hotel.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </div>

            {/* Right 4-Photo 2x2 Grid */}
            <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-1.5 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative h-full rounded-lg overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`${hotel.name} Photo ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            {/* Floating "View All Photos" Button */}
            <button
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-mono uppercase text-xs font-bold tracking-wider shadow-md border border-black/5 backdrop-blur-md transition-all cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-700" />
              <span>All {galleryImages.length} photos</span>
            </button>
          </div>

          {/* Mobile Photo Carousel */}
          <div
            onClick={() => {
              setLightboxIndex(activeMobileImageIndex);
              setLightboxOpen(true);
            }}
            className="md:hidden relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 cursor-pointer"
          >
            <Image
              src={galleryImages[activeMobileImageIndex] || galleryImages[0]}
              alt={hotel.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMobileImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 backdrop-blur-md border border-black/5"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMobileImageIndex((prev) => (prev + 1) % galleryImages.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 backdrop-blur-md border border-black/5"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono">
              {activeMobileImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Dates & Availability Strip (Under Photos in First View) */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-3">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
            {/* Check-In */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Check-In</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>

            {/* Check-Out */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Check-Out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>

            {/* Guests */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Guests</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                <option value="3 Adults">3 Adults</option>
                <option value="4+ Group">4+ Group</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setInquiryModalOpen(true)}
            className="sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold uppercase tracking-wider text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Check Direct Rates</span>
          </button>
        </div>
      </div>

      {/* Sticky In-Page Navigation Bar */}
      <div className="sticky top-16 z-30 bg-[#edf7f2]/95 backdrop-blur-md border-y border-emerald-900/10 shadow-xs mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2 text-xs font-mono uppercase tracking-wider text-slate-600">
            {[
              { id: "overview", label: "Overview" },
              { id: "rooms", label: "Rooms & Rates" },
              { id: "amenities", label: "Amenities" },
              { id: "policies", label: "Good To Know" },
              { id: "nearby", label: "Nearby Spots" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => {
              const isActive = activeNavSection === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveNavSection(tab.id)}
                  className={`px-3.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-700 text-white font-bold shadow-xs"
                      : "hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Details (8 cols) | Sticky Booking Widget (4 cols) */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Overview Section */}
            <section id="overview" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-4 shadow-sm scroll-mt-28">
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                  About {hotel.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  {hotel.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                  Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {hotel.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Rooms & Direct Tariffs */}
            <section id="rooms" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-5 shadow-sm scroll-mt-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                  Room Options &amp; Tariffs
                </h2>
                <span className="text-xs font-mono text-emerald-700 font-bold">
                  Zero OTA Markups
                </span>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "border-emerald-700 bg-emerald-50/40 shadow-sm"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-sm font-black uppercase text-slate-900">{room.name}</h3>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-mono">
                            <span>{room.capacity}</span>
                            <span>•</span>
                            <span>{room.beds}</span>
                            {room.sizeSqFt && (
                              <>
                                <span>•</span>
                                <span>{room.sizeSqFt} sq.ft</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {room.features.map((feat, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 text-[11px]"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-lg font-black text-slate-900">₹{room.price}</span>
                            <span className="text-[11px] text-slate-500 font-mono"> / night</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRoom(room);
                              setInquiryModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                          >
                            Reserve Room
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Short & Crisp Amenities */}
            <section id="amenities" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-4 shadow-sm scroll-mt-28">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                Features &amp; Amenities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenityCategories.map((cat, idx) => {
                  const IconComponent = cat.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{cat.category}</h3>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 pl-2">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-700 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Good to Know Policies */}
            <section id="policies" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-4 shadow-sm scroll-mt-28">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                Good to Know
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotelPolicies.map((pol, idx) => {
                  const Icon = pol.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-700" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{pol.title}</h3>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 pl-2">
                        {pol.content.map((c, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-700 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. Proximity to Nearby Spots */}
            <section id="nearby" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-4 shadow-sm scroll-mt-28">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                Nearby Sightseeing Spots
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyLandmarks.map((lm, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{lm.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{lm.time}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md text-[11px]">
                      {lm.distance}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Reviews Section */}
            <section id="reviews" className="bg-white border border-emerald-900/10 rounded-2xl p-6 space-y-4 shadow-sm scroll-mt-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                  Guest Reviews ({reviews.length > 0 ? reviews.length : hotel.reviewsCount})
                </h2>
                <button
                  type="button"
                  onClick={handleOpenReview}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Write Review
                </button>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono py-4 text-center">
                    No reviews yet. Be the first verified traveler to leave a review!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.title && <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>}
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-emerald-900/10 rounded-2xl p-5 shadow-sm space-y-5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                  Verified Direct Tariff
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ night</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 font-mono">
                  Room: <span className="font-bold text-slate-900">{selectedRoom?.name}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-extrabold uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Reserve Direct</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href="tel:+919864879505"
                  className="w-full py-1 text-center block text-xs font-mono text-slate-500 hover:text-slate-800"
                >
                  Concierge Hotline: <span className="text-emerald-800 font-bold">+91 98648 79505</span>
                </a>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Physically verified retreat in Sohra</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Zero booking commission markups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Direct WhatsApp confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between px-6 py-4 text-white border-b border-white/10">
              <div>
                <h3 className="text-sm font-black uppercase text-white">{hotel.name}</h3>
                <span className="text-xs font-mono text-white/50">
                  {lightboxIndex + 1} / {galleryImages.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl h-[65vh]">
                <Image
                  src={galleryImages[lightboxIndex]}
                  alt={`${hotel.name} photo ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={() => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4 border-t border-white/10 overflow-x-auto flex items-center justify-center gap-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    i === lightboxIndex ? "border-amber-400 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] z-40 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 block font-mono uppercase">Direct Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">
              ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ night</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setInquiryModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-black uppercase tracking-wider text-xs shadow-md"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={hotel}
        preselectedRoom={selectedRoom?.name}
        initialCheckIn={checkInDate}
        initialCheckOut={checkOutDate}
      />

      {/* Review Submission Modal */}
      {writeReviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-emerald-900/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black uppercase text-slate-900">Review {hotel.name}</h3>
              <button
                onClick={() => setWriteReviewOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breathtaking view of waterfalls"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your room, cleanliness, food, and views..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase tracking-wider text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
