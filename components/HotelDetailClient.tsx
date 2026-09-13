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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";
import AuthModal from "@/components/AuthModal";
import { Hotel, Room, HotelReview } from "@/lib/types";
import { getHotelReviews, submitHotelReview } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface HotelDetailClientProps {
  hotel: Hotel;
}

export default function HotelDetailClient({ hotel }: HotelDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  useEffect(() => {
    getHotelReviews(hotel.id)
      .then((data) => {
        if (data) setReviews(data);
      })
      .catch(console.warn);
  }, [hotel.id]);

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
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Breadcrumbs */}
      <div className="pt-20 pb-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <span>/</span>
            <Link href="/hotels" className="hover:text-emerald-700">Hotels in Cherrapunji</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{hotel.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Title & Hero Meta */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{hotel.starRating} Star Verified Hotel</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                ★ {hotel.rating} ({hotel.reviewsCount} guest reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {hotel.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {hotel.tagline}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{hotel.address}</span>
            </div>
          </div>

          {/* Quick Price Banner */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl hidden md:block text-right shadow-xs">
            <span className="text-xs text-slate-400">Starting from</span>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xs text-slate-400 line-through">₹{hotel.originalPrice}</span>
              <span className="text-xl font-bold text-slate-900">₹{hotel.pricePerNight}</span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">
              {discountPercent}% OFF Direct Tariff
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main Large Photo */}
          <div className="md:col-span-3 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
            <Image
              src={hotel.images[activeImageIndex] || hotel.images[0]}
              alt={hotel.name}
              fill
              priority
              className="object-cover"
            />
            {hotel.images.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between">
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (prev) => (prev - 1 + hotel.images.length) % hotel.images.length
                    )
                  }
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:bg-white shadow-md transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev + 1) % hotel.images.length)
                  }
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 flex items-center justify-center hover:bg-white shadow-md transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto">
            {hotel.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] md:h-24 w-28 md:w-full rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeImageIndex
                    ? "border-emerald-600 ring-2 ring-emerald-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Details Column (8 cols) */}
          <div className="lg:col-span-8 space-y-7">
            {/* Overview */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                About {hotel.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {hotel.description}
              </p>

              {/* Highlights */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2.5">
                  Property Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {hotel.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkin / Checkout info */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400 block text-[10px]">Check-in</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    From {hotel.checkInTime}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400 block text-[10px]">Check-out</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    Until {hotel.checkOutTime}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400 block text-[10px]">Location Hub</span>
                  <span className="font-semibold text-emerald-800 mt-0.5 block">
                    {hotel.distanceToCenter || "Central Sohra"}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Categories */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Available Room Categories
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your room category to view detailed rates.
                </p>
              </div>

              <div className="space-y-3">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{room.name}</h3>
                            {isSelected && (
                              <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span>👥 {room.capacity}</span>
                            <span>🛏️ {room.beds}</span>
                            {room.sizeSqFt && <span>📐 {room.sizeSqFt} sq.ft</span>}
                          </p>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {room.features.map((feat, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          {room.originalPrice && (
                            <span className="text-xs text-slate-400 line-through block">
                              ₹{room.originalPrice}
                            </span>
                          )}
                          <div className="flex items-baseline sm:justify-end gap-1">
                            <span className="text-xl font-bold text-emerald-800">
                              ₹{room.price}
                            </span>
                            <span className="text-xs text-slate-500">/ night</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoom(room);
                              setInquiryModalOpen(true);
                            }}
                            className="mt-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                          >
                            Book This Room
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Hotel Amenities & Services
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Guest Reviews & Ratings Section */}
            <div id="reviews" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="text-xl font-black text-slate-900">{hotel.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {reviews.length} Verified Guest Reviews
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Guest Impressions & Stay Experiences
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReview}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3.5">
                {reviews.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    <p>No written reviews yet. Be the first verified traveler to review {hotel.name}!</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                  Verified Stay
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{rev.createdAt} • Stayed in {rev.stayMonth || "Cherrapunji"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.title && (
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 pt-0.5">
                          {rev.title}
                        </h4>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg shadow-slate-200/60 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Direct Tariff Guarantee
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
                  </span>
                  <span className="text-xs text-slate-500">/ night</span>
                </div>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Selected: <span className="font-semibold text-slate-900">{selectedRoom?.name}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Availability & Book</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Quick WhatsApp Inquiry</span>
                </a>

                <a
                  href="tel:+919864879505"
                  className="w-full py-1 text-center block text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Need assistance? Call <span className="text-emerald-700 font-semibold">+91 98648 79505</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified property in Cherrapunji</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>No upfront payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Confirmed callback in 15 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-40 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 block">Direct Property Tariff</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900">
              ₹{selectedRoom ? selectedRoom.price : hotel.pricePerNight}
            </span>
            <span className="text-xs text-slate-500">/ night</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </a>
          <button
            onClick={() => setInquiryModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preselectedHotel={hotel}
        preselectedRoom={selectedRoom?.name}
      />

      {/* Write a Review Modal */}
      {writeReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setWriteReviewOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Review {hotel.name}</h3>
                <p className="text-xs text-slate-500">Share your verified stay impression with other travelers.</p>
              </div>
              <button
                onClick={() => setWriteReviewOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breathtaking views of the waterfalls from the balcony"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Feedback & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your room comfort, breakfast, staff hospitality, and views..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
