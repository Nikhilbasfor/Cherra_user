"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Building,
  MapPin,
  BedDouble,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Hotel } from "@/lib/types";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { submitInquiry, getAllHotels } from "@/lib/firebase";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedHotel?: Hotel | null;
  preselectedRoom?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  preselectedHotel,
  preselectedRoom,
  initialCheckIn,
  initialCheckOut,
}: InquiryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <InquiryModalContent
          key={`${preselectedHotel?.id ?? "global"}-${preselectedRoom ?? "default"}`}
          onClose={onClose}
          preselectedHotel={preselectedHotel}
          preselectedRoom={preselectedRoom}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
        />
      </div>
    </AnimatePresence>
  );
}

function InquiryModalContent({
  onClose,
  preselectedHotel,
  preselectedRoom,
  initialCheckIn,
  initialCheckOut,
}: {
  onClose: () => void;
  preselectedHotel?: Hotel | null;
  preselectedRoom?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}) {
  const [hotelsList, setHotelsList] = useState<Hotel[]>(
    preselectedHotel ? [preselectedHotel] : CHERRAPUNJI_HOTELS
  );

  useEffect(() => {
    let isMounted = true;
    getAllHotels()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setHotelsList(data);
        }
      })
      .catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const [selectedHotelId, setSelectedHotelId] = useState(
    preselectedHotel ? preselectedHotel.id : CHERRAPUNJI_HOTELS[0]?.id || ""
  );

  const activeHotel: Hotel =
    preselectedHotel ||
    hotelsList.find((h) => h.id === selectedHotelId) ||
    CHERRAPUNJI_HOTELS[0];

  const availableRooms =
    activeHotel.rooms && activeHotel.rooms.length > 0
      ? activeHotel.rooms
      : [
          {
            id: "r-default",
            name: "Standard Deluxe Room",
            price: activeHotel.pricePerNight,
            capacity: "2 Adults",
            beds: "1 Queen Bed",
            features: ["Hot Water", "Scenic View"],
          },
        ];

  const [selectedRoomName, setSelectedRoomName] = useState(
    preselectedRoom || availableRooms[0]?.name || "Standard Deluxe Room"
  );

  const activeRoom =
    availableRooms.find((r) => r.name === selectedRoomName) || availableRooms[0];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState(initialCheckIn || "");
  const [checkOut, setCheckOut] = useState(initialCheckOut || "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    const target = hotelsList.find((h) => h.id === hotelId);
    if (target?.rooms?.[0]) {
      setSelectedRoomName(target.rooms[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !checkIn || !checkOut) {
      setErrorMsg("Please fill all required fields (Name, WhatsApp number, Check-in, Check-out)");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const roomTariff = activeRoom?.price || activeHotel.pricePerNight;
      const leadData = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        hotelId: activeHotel.id,
        hotelName: activeHotel.name,
        roomType: selectedRoomName,
        checkIn,
        checkOut,
        guests: { adults, children },
        specialRequests,
        budget: roomTariff,
      };

      await submitInquiry(leadData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setErrorMsg("Something went wrong. Please try again or message via WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hotelPhoneClean = "919864879505";
  const whatsappMessage = encodeURIComponent(
    `Hello CherraStays! I submitted a booking inquiry for *${activeHotel.name}* (${selectedRoomName}). Dates: ${checkIn} to ${checkOut} for ${adults} Adults${children > 0 ? `, ${children} Children` : ""}. Guest Name: ${name}. Contact: ${phone}. Please confirm direct front-desk rates & room availability!`
  );

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden z-10 my-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-6 py-5 text-white flex items-start justify-between relative">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Direct Front-Desk Booking</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Reserve Your Sanctuary in Sohra
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-sm leading-relaxed">
            Zero booking commission. Verified local tariffs sent directly to your WhatsApp.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isSubmitted ? (
        /* Success State */
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Inquiry Confirmed</h4>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              Thank you <span className="text-emerald-800 font-semibold">{name}</span>. Your request for{" "}
              <span className="text-emerald-800 font-semibold">{activeHotel.name}</span> has been routed to our local Sohra desk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Property:</span>
              <span className="text-slate-900 font-bold">{activeHotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Room:</span>
              <span className="text-slate-900 font-medium">{selectedRoomName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dates:</span>
              <span className="text-slate-900 font-medium">{checkIn} ? {checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guests:</span>
              <span className="text-slate-900 font-medium">{adults} Adults{children > 0 ? `, ${children} Children` : ""}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 pt-1.5">
              <span className="text-slate-500">Est. Tariff:</span>
              <span className="text-emerald-700 font-extrabold">?{activeRoom?.price || activeHotel.pricePerNight} / night</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
            <a
              href={`https://wa.me/${hotelPhoneClean}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp Now</span>
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Form State - Spacious, Crowdfree, Luxury Styling */
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Property Card / Selector */}
          {preselectedHotel ? (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {activeHotel.starRating}?
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{activeHotel.name}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{activeHotel.area}</span>
                  </p>
                </div>
              </div>
              <div className="text-right pl-2">
                <span className="text-[10px] text-slate-400 block font-medium">Verified Direct Rate</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-800">?{activeHotel.pricePerNight}</span>
                <span className="text-[10px] text-slate-500"> / night</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select Desired Property</span>
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => handleHotelSelect(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
              >
                {hotelsList.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.starRating}?) — ?{hotel.pricePerNight}/night • {hotel.area}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                <span>Room Configuration</span>
              </span>
              {activeRoom && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ?{activeRoom.price} / night
                </span>
              )}
            </label>
            <select
              value={selectedRoomName}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
            >
              {availableRooms.map((r) => (
                <option key={r.id || r.name} value={r.name}>
                  {r.name} — ?{r.price}/night ({r.capacity}, {r.beds})
                </option>
              ))}
            </select>
          </div>

          {/* Dates - Spacious 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check-in Date *</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value > checkOut) {
                    setCheckOut(e.target.value);
                  }
                }}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Check-out Date *</span>
              </label>
              <input
                type="date"
                required
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Guests - Spacious 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Adults</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Children</span>
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all cursor-pointer"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Child" : "Children"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lead Guest Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp / Phone *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Upper floor balcony with canyon view, bonfire night request, or airport pickup..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Get Direct Property Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct tariff guarantee • Response within 15 mins</span>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
