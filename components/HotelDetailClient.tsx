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
  Sparkles,
  Send,
  User as UserIcon,
  Grid,
  X,
  Wifi,
  Car,
  Coffee,
  Bath,
  Mountain,
  Luggage,
  BedDouble,
  Users,
  Maximize2,
  ExternalLink,
  CreditCard,
  Ban,
  Info,
  Award,
  Phone,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import AuthModal from "@/components/AuthModal";
import { Hotel, Room, HotelReview } from "@/lib/types";
import { getHotelReviews, submitHotelReview } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { CHERRAPUNJI_TRAVEL_CATEGORIES } from "@/lib/categories";

interface HotelDetailClientProps {
  hotel: Hotel;
  parentCategory?: {
    slug: string;
    name: string;
  };
}

export default function HotelDetailClient({ hotel, parentCategory }: HotelDetailClientProps) {
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

  // Reviews & Auth state
  const { user } = useAuth();
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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

  // Quick dates & guests state (Reference-grade)
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

  // Structured Amenity Categories (Reference-grade)
  const amenityCategories = [
    {
      category: "Internet & Connectivity",
      icon: Wifi,
      items: [
        "Free High-Speed Wi-Fi in rooms and common areas",
        "Mobile 4G/5G Network Connectivity (Airtel & Jio)",
        "Power Backup / Inverter Support",
      ],
    },
    {
      category: "Parking & Accessibility",
      icon: Car,
      items: [
        "Free private on-site secured parking",
        "Paved all-weather road access for tourist cabs",
        "Local sightseeing cab desk assistance",
      ],
    },
    {
      category: "Food, Dining & Kitchen",
      icon: Coffee,
      items: [
        "In-house dining serving fresh Khasi, Indian & Continental cuisine",
        "Complimentary hot breakfast buffet options",
        "Electric kettle & complimentary tea/coffee supplies in room",
        "Room dining service available",
      ],
    },
    {
      category: "Bathroom & Personal Care",
      icon: Bath,
      items: [
        "24/7 Geyser instant hot water in private attached bathrooms",
        "Complimentary premium toiletries & organic soap",
        "Fresh cotton bath towels & slippers",
        "Hair dryer provided on request",
      ],
    },
    {
      category: "Outdoors, Views & Scenery",
      icon: Mountain,
      items: [
        "Private balcony overlooking misty canyons or waterfalls",
        "Lush mountain lawn & bonfire sitting area",
        "Stargazing observation terrace",
        "Lush botanical garden setting",
      ],
    },
    {
      category: "Front-Desk & Guest Services",
      icon: Luggage,
      items: [
        "Warm Khasi hospitality & 24/7 front-desk assistance",
        "Luggage storage facility",
        "Certified Living Root Bridge trek guide coordination",
        "Daily housekeeping & room upkeep",
      ],
    },
  ];

  // "Good to Know" Hotel Policies (Reference-grade)
  const hotelPolicies = [
    {
      title: "Check-in & Check-out",
      icon: Clock,
      content: [
        `Check-in: From ${hotel.checkInTime || "14:00"} until 22:00`,
        `Check-out: Until ${hotel.checkOutTime || "11:00 AM"}`,
        "Early check-in and late check-out available subject to room availability upon arrival.",
      ],
    },
    {
      title: "Children & Extra Bedding",
      icon: Users,
      content: [
        "Children of all ages are warmly accommodated.",
        "Children under 6 years stay complimentary when sharing existing bedding with parents.",
        "Extra rollaway mattress available on prior request (nominal direct rate).",
      ],
    },
    {
      title: "Direct Cancellation & Refund",
      icon: Ban,
      content: [
        "Free cancellation up to 48 hours prior to the check-in date.",
        "Date modifications accommodated smoothly via direct front-desk WhatsApp.",
        "Zero booking commission or middleman cancellation penalties.",
      ],
    },
    {
      title: "Accepted Payment Modes",
      icon: CreditCard,
      content: [
        "UPI: Google Pay, PhonePe, Paytm, BHIM.",
        "Cards: Visa, MasterCard, RuPay debit & credit cards.",
        "Direct NEFT / IMPS Net Banking.",
        "Cash on arrival at front desk.",
      ],
    },
  ];

  // Proximity & Distances to Key Sightseeing Spots
  const nearbyLandmarks = [
    {
      name: "Nohsngithiang (Seven Sisters) Falls",
      type: "Panoramic Cascade",
      distance: hotel.area.toLowerCase().includes("nohsngithiang") ? "1.2 km" : "4.8 km",
      time: "5-10 mins drive",
    },
    {
      name: "Nohkalikai Falls (India's Tallest Plunge)",
      type: "Waterfall Viewpoint",
      distance: "6.5 km",
      time: "15 mins drive",
    },
    {
      name: "Mawsmai Limestone Cave",
      type: "Cave Exploration",
      distance: "3.2 km",
      time: "8 mins drive",
    },
    {
      name: "Wei Sawdong 3-Tier Turquoise Falls",
      type: "Emerald Canyon",
      distance: "8.4 km",
      time: "20 mins drive",
    },
    {
      name: "Double Decker Living Root Bridge Trailhead (Tyrna)",
      type: "Bio-Engineered Trek",
      distance: "9.8 km",
      time: "25 mins drive",
    },
    {
      name: "Guwahati Airport (GAU)",
      type: "Major Regional Airport",
      distance: "148 km",
      time: "4.5 hours scenic drive",
    },
  ];

  const discountPercent = Math.round(
    ((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel.name,
        text: hotel.tagline,
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
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setWriteReviewOpen(true);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newRev: HotelReview = {
        id: "rev-" + Date.now(),
        hotelId: hotel.id,
        userId: user.uid,
        userName: user.displayName || "Traveler",
        userEmail: user.email || "",
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
    <div className="min-h-screen bg-[#090b0e] text-slate-100 selection:bg-amber-400 selection:text-black relative">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Breadcrumbs & Actions */}
      <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 text-xs font-mono text-white/40">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link
              href="/hotels"
              className="hover:text-white transition-colors flex items-center gap-1 font-bold text-white/60 shrink-0 uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All Stays</span>
            </Link>
            {parentCategory && (
              <>
                <span className="text-white/20">/</span>
                <Link
                  href={`/hotels/${parentCategory.slug}`}
                  className="hover:text-amber-300 font-bold text-amber-400 transition-colors truncate uppercase tracking-wider"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}
            <span className="text-white/20">/</span>
            <span className="text-white/50 truncate hidden sm:inline uppercase">{hotel.area}</span>
            <span className="text-white/20 hidden sm:inline">/</span>
            <span className="text-white font-bold truncate">{hotel.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-white/80 border border-white/15 transition-colors cursor-pointer text-xs font-mono shrink-0 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{copied ? "Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Property Title & Top Meta */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* Badges Row - Clean single row with horizontal scroll on small screens */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 mb-2">
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
                title={`Explore all ${hotel.starRating} Star ${hotel.starRating >= 3 ? "Resorts" : "Stays"} in Cherrapunji`}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-amber-400 text-xs font-mono font-bold border border-white/15 shrink-0 transition-colors"
              >
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 uppercase tracking-wider">
                  {hotel.starRating} Star {hotel.starRating >= 3 ? "Resort" : "Stay"}
                </span>
              </Link>

              <span className="px-3 py-1 rounded-full bg-white/[0.04] text-white text-xs font-mono font-bold border border-white/10 flex items-center gap-1 shrink-0">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>★ {hotel.rating} Superb ({reviews.length > 0 ? reviews.length : hotel.reviewsCount})</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-white/[0.03] text-white/50 text-xs font-mono uppercase tracking-wider border border-white/10 shrink-0">
                Verified Direct Tariff
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.03em] text-white leading-tight">
              {hotel.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-3xl leading-relaxed">
              {hotel.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 font-mono mt-2.5">
              <span className="flex items-center gap-1.5 text-white/70">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{hotel.address}</span>
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>View on Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Travel Themes & SEO Category Badges */}
            {hotel.categories && hotel.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mr-1">
                  Ideal For:
                </span>
                {hotel.categories.map((cSlug) => {
                  const cat = CHERRAPUNJI_TRAVEL_CATEGORIES.find((tc) => tc.slug === cSlug);
                  return (
                    <Link
                      key={cSlug}
                      href={`/collection/${cSlug}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-white/80 hover:text-white text-xs font-mono border border-white/10 hover:border-amber-400/40 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{cat?.name || cSlug}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Price Pledge Card (Desktop) */}
          <div className="bg-[#111418] border border-white/10 p-5 rounded-2xl hidden md:block text-right shadow-2xl shrink-0 min-w-[220px]">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Verified Direct Rate</span>
            <div className="flex items-baseline gap-1.5 justify-end mt-1">
              <span className="text-xs text-white/30 line-through font-mono">₹{hotel.originalPrice}</span>
              <span className="text-3xl font-black text-white tracking-tight">₹{hotel.pricePerNight}</span>
              <span className="text-xs text-white/50 font-mono">/ night</span>
            </div>
            <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/25">
              {discountPercent}% OFF Front-Desk Pledge
            </span>
          </div>
        </div>
      </div>

      {/* 5-Photo Mosaic Collection ("All Photos in 1 Go") */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-7">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-visible md:overflow-hidden bg-[#0d1014] border border-white/10 shadow-2xl">
          {/* Desktop 5-Photo Mosaic Grid */}
          <div className="hidden md:grid grid-cols-12 gap-2 h-[440px] lg:h-[500px] p-2 bg-[#0d1014] rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Left Large Photo (7 Cols / ~58%) */}
            <div
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="col-span-7 relative h-full rounded-2xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={galleryImages[0]}
                alt={hotel.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Sanctuary Panorama</span>
              </div>
            </div>

            {/* Right 4-Photo 2x2 Grid (5 Cols / ~42%) */}
            <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative h-full rounded-xl overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`${hotel.name} Photo ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            {/* Desktop Floating "View All Photos" Button */}
            <button
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
              className="absolute bottom-5 right-5 z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111418]/90 hover:bg-[#15191f] text-white font-mono uppercase text-xs tracking-wider shadow-2xl border border-white/15 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Grid className="w-4 h-4 text-amber-400" />
              <span>Show all {galleryImages.length} photos</span>
            </button>
          </div>

          {/* Mobile Photo Carousel */}
          <div
            onClick={() => {
              setLightboxIndex(activeMobileImageIndex);
              setLightboxOpen(true);
            }}
            className="md:hidden relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black cursor-pointer"
          >
            <Image
              src={galleryImages[activeMobileImageIndex] || galleryImages[0]}
              alt={hotel.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Prev / Next Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMobileImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md active:scale-90 transition-transform border border-white/10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMobileImageIndex((prev) => (prev + 1) % galleryImages.length);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md active:scale-90 transition-transform border border-white/10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mobile Top Badge */}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-mono uppercase tracking-wider border border-white/15">
              Verified Stay
            </div>

            {/* Mobile Index Counter Badge */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono border border-white/15">
              {activeMobileImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              {galleryImages.slice(0, 6).map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === activeMobileImageIndex ? "w-5 h-1.5 bg-amber-400 shadow-sm" : "w-1.5 h-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Centered "See All Photos" Overlapping Pill Button */}
          <button
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="md:hidden absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111418] text-white font-mono uppercase text-xs tracking-wider shadow-xl border border-white/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Grid className="w-3.5 h-3.5 text-amber-400" />
            <span>See all {galleryImages.length} photos</span>
          </button>
        </div>
      </div>

      {/* Quick Dates & Availability Strip */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-7 mb-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111418] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            {/* Check-In */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Check-In</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-white outline-none mt-1 cursor-pointer [color-scheme:dark]"
              />
            </div>

            {/* Check-Out */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Check-Out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-white outline-none mt-1 cursor-pointer [color-scheme:dark]"
              />
            </div>

            {/* Guests */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Guests</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-white outline-none mt-1 cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                <option value="3 Adults">3 Adults</option>
                <option value="4+ Group">4+ Family / Group</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setInquiryModalOpen(true)}
            className="sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Check Direct Rates</span>
          </button>
        </div>
      </div>

      {/* In-Page Sticky Navigation Sub-Bar with Scroll-Spy */}
      <div className="sticky top-16 z-30 bg-[#090b0e]/90 backdrop-blur-2xl border-y border-white/10 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2.5 text-xs font-mono uppercase tracking-wider text-white/50">
            {[
              { id: "overview", label: "Overview" },
              { id: "rooms", label: "Rooms" },
              { id: "amenities", label: "Amenities" },
              { id: "policies", label: "Policies" },
              { id: "nearby", label: "Nearby" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => {
              const isActive = activeNavSection === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveNavSection(tab.id)}
                  className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white text-black font-black shadow-sm"
                      : "hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Split: Details on Left (8 cols) | Sticky Booking on Right (4 cols) */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Overview Section */}
            <section id="overview" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  About {hotel.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mt-2.5">
                  {hotel.description}
                </p>
              </div>

              {/* Property Highlights */}
              <div className="pt-5 border-t border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3.5">
                  Key Property Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80">
                  {hotel.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Facts Card */}
              <div className="pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Check-in</span>
                  <span className="font-bold text-white flex items-center gap-1.5 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    From {hotel.checkInTime || "14:00"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Check-out</span>
                  <span className="font-bold text-white flex items-center gap-1.5 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Until {hotel.checkOutTime || "11:00 AM"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-white/40 block text-[10px] uppercase font-mono tracking-wider">Location Hub</span>
                  <span className="font-bold text-amber-400 mt-1 block truncate">
                    {hotel.distanceToCenter || `${hotel.area}, Sohra`}
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Room Overview & Direct Booking Cards */}
            <section id="rooms" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                    Room Overview & Tariffs
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Verified direct front-desk tariffs with zero booking commission.
                  </p>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/25 self-start sm:self-auto">
                  {hotel.rooms.length} Configurations Available
                </span>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const roomImg = room.image || galleryImages[1] || galleryImages[0];
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`rounded-2xl border transition-all overflow-hidden cursor-pointer ${
                        isSelected
                          ? "bg-black/50 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50"
                          : "bg-black/25 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col md:grid md:grid-cols-12 gap-3.5 sm:gap-4 p-3.5 sm:p-5">
                        {/* Room Thumbnail Photo */}
                        <div className="md:col-span-4 relative aspect-[16/10] w-full min-h-[160px] md:min-h-[140px] rounded-xl overflow-hidden bg-black shrink-0">
                          <Image src={roomImg} alt={room.name} fill className="object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                            {room.capacity}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                              Selected
                            </div>
                          )}
                        </div>

                        {/* Room Info & Specs */}
                        <div className="md:col-span-5 flex flex-col justify-between space-y-2 flex-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black uppercase tracking-tight text-white text-base sm:text-lg leading-snug">
                                {room.name}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-mono mt-1.5">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-white/40" />
                                <span>{room.capacity}</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <BedDouble className="w-3.5 h-3.5 text-white/40" />
                                <span>{room.beds}</span>
                              </span>
                              {room.sizeSqFt && (
                                <span className="flex items-center gap-1.5">
                                  <Maximize2 className="w-3.5 h-3.5 text-white/40" />
                                  <span>{room.sizeSqFt} sq.ft</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Room Features Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {room.features.map((feat, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-white/70 border border-white/10"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Room Pricing & CTA (Split row on mobile, column on desktop) */}
                        <div className="md:col-span-3 flex items-center justify-between md:flex-col md:items-end md:justify-between border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4 mt-1 md:mt-0">
                          <div>
                            {room.originalPrice && (
                              <span className="text-xs text-white/30 line-through font-mono block md:text-right">
                                ₹{room.originalPrice}
                              </span>
                            )}
                            <div className="flex items-baseline md:justify-end gap-1">
                              <span className="text-xl sm:text-2xl font-black text-white">
                                ₹{room.price}
                              </span>
                              <span className="text-xs text-white/40 font-mono">/ night</span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block md:text-right">
                              Verified Rate
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoom(room);
                              setInquiryModalOpen(true);
                            }}
                            className="text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Key Features & Amenities (Categorized Breakdown) */}
            <section id="amenities" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Features & Amenities
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  Verified comfort and hospitality provisions available at {hotel.name}.
                </p>
              </div>

              {/* Quick Key Amenities Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pb-1">
                {[
                  { icon: Wifi, label: "Free Wi-Fi" },
                  { icon: Car, label: "Free Parking" },
                  { icon: Bath, label: "24/7 Hot Water" },
                  { icon: Coffee, label: "Dining / Kitchen" },
                  { icon: Mountain, label: "Balcony / Views" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.06] text-amber-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white leading-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {amenityCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2.5 text-white font-mono font-bold text-xs uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{cat.category}</span>
                      </div>
                      <ul className="space-y-2 pl-1">
                        {cat.items.map((item, i) => (
                          <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. "Good to Know" Hotel Policies Block */}
            <section id="policies" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                  <Info className="w-5 h-5 text-amber-400" />
                  <span>Good to Know & Stay Policies</span>
                </h2>
                <p className="text-xs text-white/50 font-mono mt-1">
                  Essential arrival, payment, and accommodation policies for a hassle-free vacation in Sohra.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotelPolicies.map((pol, idx) => {
                  const Icon = pol.icon;
                  return (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                      <div className="flex items-center gap-2.5 text-white font-mono font-bold text-xs uppercase tracking-wider">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{pol.title}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-white/70">
                        {pol.content.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-white/30">•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. Location & Nearby Landmarks Proximity */}
            <section id="nearby" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Nearby Landmarks & Sightseeing</span>
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Proximity from {hotel.name} to Cherrapunji's top attractions.
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white text-xs font-mono font-bold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Directions</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyLandmarks.map((lm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-white truncate uppercase tracking-wide">{lm.name}</h4>
                      <span className="text-[10px] text-white/40 block truncate font-mono mt-0.5">{lm.type}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-xs text-amber-400 block px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10">
                        {lm.distance}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono block mt-1">{lm.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Verified Guest Reviews & Ratings Section */}
            <section id="reviews" className="bg-[#111418] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-32">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="text-2xl font-black text-white">{hotel.rating}</span>
                    </div>
                    <span className="text-xs text-white/30 font-mono">•</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                      {reviews.length} Verified Guest Reviews
                    </span>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Guest Impressions & Stay Experiences
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReview}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-400 hover:text-black text-black font-mono font-black uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="py-8 text-center text-white/40 font-mono text-xs">
                    <p>No written reviews yet. Be the first verified traveler to review {hotel.name}!</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/[0.08] text-white border border-white/15 font-mono font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{rev.userName}</span>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                                  <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                                  Verified Stay
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 font-mono block mt-0.5">{rev.createdAt} • Stayed in {rev.stayMonth || "Cherrapunji"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.title && (
                        <h4 className="text-xs sm:text-sm font-bold text-white pt-1">
                          {rev.title}
                        </h4>
                      )}

                      <p className="text-xs text-white/70 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#111418] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-white/70 border border-white/10 mb-3">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Direct Tariff Guarantee
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">
                    ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
                  </span>
                  <span className="text-xs text-white/40 font-mono">/ night</span>
                </div>
                <p className="text-xs text-amber-400 mt-1.5 font-mono">
                  Selected: <span className="text-white font-bold">{selectedRoom?.name}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>Check Availability & Book</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 text-white font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Quick WhatsApp Inquiry</span>
                </a>

                <a
                  href="tel:+919864879505"
                  className="w-full py-1 text-center block text-xs font-mono text-white/40 hover:text-white transition-colors"
                >
                  Concierge Hotline: <span className="text-amber-400 font-bold">+91 98648 79505</span>
                </a>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Verified physical property in Sohra</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Zero booking commission or hidden markup</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct front-desk confirmation in 15 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#06080a]/98 backdrop-blur-2xl flex flex-col justify-between"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 text-white border-b border-white/10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white">{hotel.name}</h3>
                <span className="text-xs font-mono text-white/50">
                  Photo {lightboxIndex + 1} of {galleryImages.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Main Image */}
            <div className="relative flex-1 flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl h-[65vh]">
                <Image
                  src={galleryImages[lightboxIndex]}
                  alt={`${hotel.name} photo ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Prev / Next Nav Buttons */}
              <button
                onClick={() => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="px-6 py-4 border-t border-white/10 overflow-x-auto flex items-center justify-center gap-2.5">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
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
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#090b0e]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] z-40 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-white/40 block font-mono uppercase tracking-widest">
            Direct Tariff
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white tracking-tight">
              ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
            </span>
            <span className="text-xs text-white/50 font-mono">/ night</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-amber-400 border border-white/15 transition-colors shrink-0"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          <button
            onClick={() => setInquiryModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Book Direct
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111418] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Review {hotel.name}</h3>
                <p className="text-xs font-mono text-white/50 mt-0.5">Share your verified stay impression with other travelers.</p>
              </div>
              <button
                onClick={() => setWriteReviewOpen(false)}
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breathtaking views of the waterfalls from the balcony"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Your Feedback & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your room comfort, breakfast, staff hospitality, and views..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-white/60 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? "Submitting..." : "Post Verified Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal if unauthenticated */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setWriteReviewOpen(true)}
      />

      <Footer />
    </div>
  );
}
