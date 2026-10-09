"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  Phone,
  Check,
  BedDouble,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import { Hotel, Room, HotelReview } from "@/lib/types";
import { getHotelReviews, submitHotelReview, submitInquiry } from "@/lib/firebase";

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

  // Direct Inquiry Card State matching user design
  const [directName, setDirectName] = useState("");
  const [directPhone, setDirectPhone] = useState("");
  const [directEmail, setDirectEmail] = useState("");
  const [directRequests, setDirectRequests] = useState("");
  const [isDirectSubmitting, setIsDirectSubmitting] = useState(false);
  const [directSubmitted, setDirectSubmitted] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  const handleDirectInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directPhone.trim()) return;
    setIsDirectSubmitting(true);
    try {
      await submitInquiry({
        customerName: directName.trim(),
        customerPhone: directPhone.trim(),
        customerEmail: directEmail.trim() || "",
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomType: selectedRoom ? selectedRoom.name : "Direct Front-Desk Rate",
        checkIn: checkInDate || todayStr,
        checkOut: checkOutDate || "",
        guests: {
          adults: 2,
          children: 0,
        },
        specialRequests: directRequests.trim() || undefined,
      });
      setDirectSubmitted(true);
      const targetPhone = "919864879505";
      const msg = `Hello! I requested direct booking for *${hotel.name}* (${selectedRoom?.name || "Standard Room"}) in Cherrapunji.\n\nName: ${directName}\nPhone: ${directPhone}\nDates: ${checkInDate || "Flexible"} to ${checkOutDate || "Flexible"}\nRequests: ${directRequests || "Best direct rate"}`;
      window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    } catch (err) {
      console.warn("Direct inquiry submit:", err);
    } finally {
      setIsDirectSubmitting(false);
    }
  };

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

  // Evocative, Enticing Luxury Amenities
  const amenityCategories = [
    {
      category: "Cloud & Canyon Panoramas",
      icon: Mountain,
      items: [
        "Unobstructed vistas of rolling Sohra mist, deep gorges & waterfalls",
        "Private sunrise balcony or open mountain view terrace",
        "Cozy evening bonfire & stargazing seating on open lawns",
      ],
    },
    {
      category: "Farm-Fresh Meghalayan Dining",
      icon: Coffee,
      items: [
        "Authentic hot Khasi ethnic recipes & comforting Indian flavors",
        "Complimentary hot mountain breakfast prepared fresh every morning",
        "In-room electric kettle with premium local organic tea & coffee",
      ],
    },
    {
      category: "Cozy Warmth & 24/7 Hot Water",
      icon: Bath,
      items: [
        "High-capacity instant geysers for steaming hot baths in mountain mist",
        "Ultra-soft heavy fleece quilts & heated room blankets",
        "Plush cotton towels and eco-friendly mountain toiletries",
      ],
    },
    {
      category: "Safe Road Access & Private Parking",
      icon: Car,
      items: [
        "All-weather paved motorable road direct to resort gates",
        "Free secure private on-site parking for self-drive cars & tourist cabs",
        "Dedicated driver rest amenities & local cab coordinator on site",
      ],
    },
    {
      category: "Reliable Wi-Fi & Mobile Connectivity",
      icon: Wifi,
      items: [
        "High-speed Wi-Speed Wi-Fi across rooms & common scenic decks",
        "Full 4G/5G mobile tower reception (Airtel & Jio networks)",
        "Uninterrupted generator power backup for peace of mind",
      ],
    },
    {
      category: "Local Trek Guides & Concierge",
      icon: Luggage,
      items: [
        "Curated guides for Double Decker Living Root Bridge & Wei Sawdong",
        "Warm, authentic Khasi hospitality with personalized local tips",
        "Early luggage check-in & secure luggage holding facility",
      ],
    },
  ];

  // Reassuring Guest Policies
  const hotelPolicies = [
    {
      title: "Effortless Check-in & Departure",
      icon: Clock,
      content: [
        `Flexible Check-in: From ${hotel.checkInTime || "12:00 PM / 14:00 PM"} onwards`,
        `Comfortable Check-out: Until ${hotel.checkOutTime || "11:00 AM"}`,
        "Early arrival luggage drop-off freely accommodated at front desk",
      ],
    },
    {
      title: "100% Transparent Cancellation",
      icon: Ban,
      content: [
        "Full free cancellation up to 48 hours prior to check-in date",
        "Instant date adjustments via direct WhatsApp with the property host",
        "Zero OTA middleman cancellation penalty or deduction fees",
      ],
    },
    {
      title: "Families, Children & Group Comfort",
      icon: Users,
      content: [
        "Children under 6 years stay completely free sharing parents' bed",
        "Extra thick comfortable mattresses arranged upon request",
        "Quiet, gated, nature-surrounded grounds safe for families and couples",
      ],
    },
    {
      title: "Direct & Flexible Payments",
      icon: CreditCard,
      content: [
        "Direct UPI transfers: Google Pay, PhonePe, Paytm accepted",
        "Credit/Debit cards (Visa, Mastercard, RuPay) & Net Banking",
        "Direct property bill with 0% hidden convenience markups",
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

      {/* Uplifted Header: Hotel name, golden star icons, resort contact, uncrowded area */}
      <div className="pt-20 sm:pt-24 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            {/* 1. Hotel Name on Top */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              {hotel.name}
            </h1>

            {/* 2. Star icons row + Solid info line just below hotel name */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-sans text-slate-700">
              {/* Star icons as per 3/4/5 star hotel with rich gold fill (no dull emojis) */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.starRating || 3 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <span className="font-bold text-amber-900 text-xs sm:text-sm ml-1">
                  {hotel.starRating} Star {hotel.starRating >= 3 ? "Resort" : "Stay"}
                </span>
              </div>

              <span className="text-slate-300">|</span>

              <span className="font-bold text-slate-800 flex items-center gap-1 text-xs sm:text-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{hotel.rating} Superb</span>
                <span className="text-slate-500 font-normal">({reviews.length > 0 ? reviews.length : hotel.reviewsCount} reviews)</span>
              </span>

              <span className="text-slate-300">|</span>

              <span className="text-emerald-800 font-semibold text-xs sm:text-sm bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Verified Direct Tariff
              </span>
            </div>

            {/* 3. Resort Contact Number & Locality with generous, uncrowded spacing */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`tel:${hotel.phone || "+919864879505"}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-900 border border-emerald-300/80 text-xs sm:text-sm font-bold font-mono transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Resort Contact: {hotel.phone || "+91 98648 79505"}</span>
              </a>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-sans">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">{hotel.area}, Sohra</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 hidden sm:inline">{hotel.address}</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline inline-flex items-center gap-1"
                >
                  <span>View on Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Rate & Share Header Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 pt-1">
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase font-mono font-bold block">Direct Tariff</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">₹{hotel.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-sans">/ night</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-emerald-900/10 transition-colors text-xs font-mono shadow-xs cursor-pointer"
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

            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono">
              {activeMobileImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Sticky Check-In & Availability Bar (Keeps Pinned When Scrolled) */}
      <div className="sticky top-[58px] sm:top-[66px] z-30 bg-[#edf7f2]/95 backdrop-blur-md border-y border-emerald-900/15 shadow-sm py-2.5 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
              {/* Check-In */}
              <div className="p-2.5 rounded-xl bg-[#f4f7f5] border border-[#d6e4dc]">
                <label className="text-xs font-sans font-bold text-slate-700 block mb-0.5">Check-In</label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer [color-scheme:light]"
                />
              </div>

              {/* Check-Out */}
              <div className="p-2.5 rounded-xl bg-[#f4f7f5] border border-[#d6e4dc]">
                <label className="text-xs font-sans font-bold text-slate-700 block mb-0.5">Check-Out</label>
                <input
                  type="date"
                  min={checkInDate || todayStr}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer [color-scheme:light]"
                />
              </div>

              {/* Guests */}
              <div className="p-2.5 rounded-xl bg-[#f4f7f5] border border-[#d6e4dc] col-span-2 sm:col-span-1">
                <label className="text-xs font-sans font-bold text-slate-700 block mb-0.5">Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none cursor-pointer [color-scheme:light]"
                >
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                  <option value="3 Adults">3 Adults</option>
                  <option value="4+ Group">4+ Group</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden lg:block text-right pr-2">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold block">Direct Tariff</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
                </span>
                <span className="text-xs text-slate-500 font-sans">/nt</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("reserve-card");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    setInquiryModalOpen(true);
                  }
                }}
                className="px-6 py-3.5 rounded-full bg-[#d99b38] hover:bg-[#c6892a] text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Direct</span>
              </button>
            </div>
          </div>

          {/* In-Page Navigation Bar */}
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-xs sm:text-sm font-sans font-bold text-slate-600">
            {[
              { id: "overview", label: "Overview" },
              { id: "rooms", label: "Rooms & Tariffs" },
              { id: "amenities", label: "Features & Amenities" },
              { id: "policies", label: "Good To Know" },
              { id: "nearby", label: "Nearby Spots" },
              { id: "reviews", label: "Guest Reviews" },
            ].map((tab) => {
              const isActive = activeNavSection === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveNavSection(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-700 text-white font-bold shadow-xs"
                      : "hover:text-slate-900 hover:bg-white/70"
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

            {/* 2. Rooms & Direct Tariffs - Elevated Luxury Presentation */}
            <section id="rooms" className="bg-white border border-emerald-900/10 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                    Room Options &amp; Tariffs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                    Verified property tariffs • Direct front-desk billing with zero agency markup
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs font-bold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300/60">
                  ⚡ Best Direct Rate Guaranteed
                </span>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const rackPrice = Math.round(room.price * 1.25);
                  const saving = rackPrice - room.price;
                  return (
                    <div
                      key={room.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? "border-emerald-700 bg-emerald-50/50 shadow-md ring-1 ring-emerald-700/20"
                          : "border-slate-200 bg-gradient-to-br from-white to-[#fbfdfc] hover:border-emerald-600/40 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                              {room.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-mono">
                              Save ₹{saving} Direct
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-sans">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{room.capacity}</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <BedDouble className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{room.beds}</span>
                            </span>
                            {room.sizeSqFt && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span>{room.sizeSqFt} sq.ft</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {room.features.map((feat, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/70 text-xs font-medium flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="text-left md:text-right">
                            <span className="text-xs text-slate-400 line-through font-mono">₹{rackPrice}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                                ₹{room.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs text-slate-500 font-sans"> / night</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRoom(room);
                              const el = document.getElementById("reserve-card");
                              if (el && window.innerWidth >= 1024) {
                                el.scrollIntoView({ behavior: "smooth" });
                              } else {
                                setInquiryModalOpen(true);
                              }
                            }}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                              isSelected
                                ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30"
                                : "bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Reserve Room"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Features & Amenities - Evocative Luxury Presentation */}
            <section id="amenities" className="bg-white border border-emerald-900/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm scroll-mt-28">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Features &amp; Amenities
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                  Everything curated for an unforgettable mountain escape above the clouds
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenityCategories.map((cat, idx) => {
                  const IconComponent = cat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white to-[#f7faf8] border border-emerald-900/10 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                          {cat.category}
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
                        {cat.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Good to Know Policies - Reassuring Guest Peace of Mind */}
            <section id="policies" className="bg-white border border-emerald-900/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm scroll-mt-28">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Good to Know • Guest Peace of Mind
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                  Clear, honest policies for a hassle-free holiday in Sohra
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotelPolicies.map((pol, idx) => {
                  const Icon = pol.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white to-[#f7faf8] border border-emerald-900/10 shadow-xs space-y-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-amber-700" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                          {pol.title}
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
                        {pol.content.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                            <span className="leading-snug">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. Proximity to Nearby Spots */}
            <section id="nearby" className="bg-white border border-emerald-900/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm scroll-mt-28">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Nearby Sightseeing Spots
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                  Explore Cherrapunji&apos;s world-famous waterfalls, root bridges, and caves
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {nearbyLandmarks.map((lm, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-slate-900">{lm.name}</p>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">{lm.time}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md text-xs">
                      {lm.distance}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Reviews Section */}
            <section id="reviews" className="bg-white border border-emerald-900/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm scroll-mt-28">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Guest Reviews ({reviews.length > 0 ? reviews.length : hotel.reviewsCount})
                </h2>
                <button
                  type="button"
                  onClick={handleOpenReview}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Write Review
                </button>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-500 font-sans py-4 text-center">
                    No reviews yet. Be the first verified traveler to leave a review!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.title && <h4 className="text-xs sm:text-sm font-bold text-slate-800">{rev.title}</h4>}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Sticky Booking Widget (4 cols) - Matched to Reference Image */}
          <div className="lg:col-span-4">
            <div id="reserve-card" className="sticky top-28 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-sans">
                    FROM
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif text-slate-900 font-normal">
                    ₹{(selectedRoom ? selectedRoom.price : hotel.pricePerNight).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5">
                  per night
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
                  Send a request and our Cherrapunji team will confirm availability and the best direct rate, usually within the hour.
                </p>
              </div>

              {/* Direct Booking Form */}
              <form onSubmit={handleDirectInquirySubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] transition-all"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile number"
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] transition-all"
                  />
                </div>

                {/* Side-by-side Check-In and Check-Out Dates */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={checkInDate}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        if (checkOutDate && e.target.value > checkOutDate) {
                          setCheckOutDate(e.target.value);
                        }
                      }}
                      className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] [color-scheme:light]"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      min={checkInDate || todayStr}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] [color-scheme:light]"
                    />
                  </div>
                </div>

                {/* Multiline Requests */}
                <div>
                  <textarea
                    rows={3}
                    placeholder="Guests, dates, any requests"
                    value={directRequests}
                    onChange={(e) => setDirectRequests(e.target.value)}
                    className="w-full bg-[#f3f4f1] border border-[#e2e4df] rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#df9e38]/30 focus:border-[#df9e38] transition-all resize-none"
                  />
                </div>

                {/* Golden Amber CTA Button */}
                <button
                  type="submit"
                  disabled={isDirectSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#df9e38] hover:bg-[#cf8e28] text-slate-950 font-bold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isDirectSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Sending request...</span>
                    </span>
                  ) : directSubmitted ? (
                    <span className="flex items-center gap-1.5 text-slate-950">
                      <Check className="w-4 h-4" />
                      <span>Request Sent • Check WhatsApp</span>
                    </span>
                  ) : (
                    <span>Request best price</span>
                  )}
                </button>
              </form>

              {/* Direct WhatsApp & Helpline Links */}
              <div className="pt-2 text-center space-y-2 border-t border-slate-100">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Or Chat Direct on WhatsApp</span>
                </a>
                <p className="text-xs text-slate-500 font-sans">
                  Concierge Helpline:{" "}
                  <a href="tel:+919864879505" className="text-slate-800 font-bold hover:underline">
                    +91 98648 79505
                  </a>
                </p>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-sans">
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
                  <span>Direct WhatsApp front-desk confirmation</span>
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
          <span className="text-xs text-slate-500 font-bold block font-mono uppercase">Direct Rate</span>
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
