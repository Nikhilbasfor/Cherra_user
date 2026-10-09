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
  Star,
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
    preselectedHotel ? preselectedHotel.id : ""
  );

  const activeHotel: Hotel | null =
    (selectedHotelId ? hotelsList.find((h) => h.id === selectedHotelId) : null) ||
    preselectedHotel ||
    null;

  const availableRooms =
    activeHotel && activeHotel.rooms && activeHotel.rooms.length > 0
      ? activeHotel.rooms
      : activeHotel
      ? [
          {
            id: "r-default",
            name: "Standard Deluxe Room",
            price: activeHotel.pricePerNight,
            capacity: "2 Adults",
            beds: "1 Queen Bed",
            features: ["Hot Water", "Scenic View"],
          },
        ]
      : [];

  const [selectedRoomName, setSelectedRoomName] = useState(
    preselectedRoom || ""
  );

  const activeRoom =
    availableRooms.find((r) => r.name === selectedRoomName) || null;

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!checkIn) {
        const savedIn = sessionStorage.getItem("cherra_checkIn");
        if (savedIn) setCheckIn(savedIn);
      }
      if (!checkOut) {
        const savedOut = sessionStorage.getItem("cherra_checkOut");
        if (savedOut) setCheckOut(savedOut);
      }
      const savedGuests = sessionStorage.getItem("cherra_guests");
      if (savedGuests) {
        if (savedGuests.includes("1")) setAdults(1);
        else if (savedGuests.includes("2")) setAdults(2);
        else if (savedGuests.includes("3") || savedGuests.includes("4")) setAdults(4);
        else if (savedGuests.includes("5")) setAdults(6);
      }
      const savedArea = sessionStorage.getItem("cherra_search_area");
      if (!selectedHotelId && savedArea && savedArea !== "All Areas" && hotelsList.length > 0) {
        const match = hotelsList.find((h) => h.area.toLowerCase().includes(savedArea.toLowerCase()));
        if (match) setSelectedHotelId(match.id);
      }
    }
  }, [hotelsList, selectedHotelId, checkIn, checkOut]);

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    setSelectedRoomName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !checkIn || !checkOut) {
      setErrorMsg("Please fill all required fields (Name, WhatsApp number, Check-in, Check-out)");
      return;
    }

    if (!activeHotel) {
      setErrorMsg("Please select a hotel or homestay from the list");
      return;
    }

    if (!selectedRoomName) {
      setErrorMsg("Please select a room configuration");
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
  const hotelNameForWa = activeHotel ? activeHotel.name : "Selected Homestay";
  const roomNameForWa = selectedRoomName || "Standard Room";
  const whatsappMessage = encodeURIComponent(
    `Hello CherraStays! I submitted a booking inquiry for *${hotelNameForWa}* (${roomNameForWa}). Dates: ${checkIn} to ${checkOut} for ${adults} Adults${children > 0 ? `, ${children} Children` : ""}. Guest Name: ${name}. Contact: ${phone}. Please confirm direct front-desk rates & room availability!`
  );

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="relative w-full max-w-xl bg-white border border-emerald-900/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-6 text-slate-900"
    >
      {/* Header */}
      <div className="bg-[#064e3b] px-6 py-4 text-white flex items-start justify-between relative">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-mono uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct Front-Desk Booking</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
            Reserve Your Stay in Sohra
          </h3>
          <p className="text-xs text-emerald-100/70 font-mono mt-0.5">
            Zero booking commission. Verified local tariffs sent directly to your WhatsApp.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isSubmitted ? (
        /* Success State */
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Inquiry Confirmed</h4>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              Thank you <span className="font-bold text-slate-900">{name}</span>. Your request for{" "}
              <span className="font-bold text-slate-900">{activeHotel?.name || "Selected Stay"}</span> has been routed directly to the property desk in Sohra.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Property:</span>
              <span className="text-slate-900 font-bold">{activeHotel?.name || "Selected Stay"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Room:</span>
              <span className="text-slate-800">{selectedRoomName || "Standard Room"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dates:</span>
              <span className="text-slate-800">{checkIn} to {checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guests:</span>
              <span className="text-slate-800">{adults} Adults{children > 0 ? `, ${children} Children` : ""}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5">
              <span className="text-slate-500">Est. Tariff:</span>
              <span className="text-emerald-800 font-black">₹{activeRoom?.price || activeHotel?.pricePerNight || 0} / night</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1 max-w-md mx-auto">
            <a
              href={`https://wa.me/${hotelPhoneClean}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase tracking-wider text-xs shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Connect on WhatsApp Now</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono uppercase text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Form State - Clean, Spacious, Highly Legible */
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Property Card / Selector */}
          {preselectedHotel ? (
            <div className="p-4 bg-emerald-50/60 border border-emerald-900/15 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-mono leading-none mt-0.5">{preselectedHotel.starRating}★</span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-tight leading-snug">{preselectedHotel.name}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{preselectedHotel.area}, Sohra</span>
                  </p>
                </div>
              </div>
              <div className="text-right pl-3 shrink-0">
                <span className="text-xs text-slate-500 block uppercase font-mono font-medium">Direct Tariff</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 font-serif">₹{preselectedHotel.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-sans"> / night</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>Select Property *</span>
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => handleHotelSelect(e.target.value)}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Select Hotel / Resort / Homestay
                </option>
                {hotelsList.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.starRating} Star) — ₹{hotel.pricePerNight}/night • {hotel.area}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-emerald-700" />
                <span>Room Configuration</span>
              </span>
              {activeRoom && (
                <span className="text-xs font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-300/60">
                  ₹{activeRoom.price} / night
                </span>
              )}
            </label>
            <select
              value={selectedRoomName}
              disabled={!activeHotel}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>
                {activeHotel ? "Select Room Type" : "Select a hotel first"}
              </option>
              {availableRooms.map((r) => (
                <option key={r.id || r.name} value={r.name}>
                  {r.name} — ₹{r.price}/night ({r.capacity}, {r.beds})
                </option>
              ))}
            </select>
          </div>

          {/* Dates - 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
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
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer [color-scheme:light]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Check-out Date *</span>
              </label>
              <input
                type="date"
                required
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer [color-scheme:light]"
              />
            </div>
          </div>

          {/* Guests - 2 Columns */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Adults</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Children</span>
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer"
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
          <div className="space-y-3.5 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Lead Guest Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp / Mobile *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Balcony room with waterfall view, bonfire arrangement, or early check-in..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-[#f8faf9] focus:bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Request Direct Property Quote</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mt-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct front-desk quote • Response usually within 15 mins</span>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
