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
  }, [hotelsList, selectedHotelId]);

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
      className="relative w-full max-w-xl bg-[#111418] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-6 text-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#171b21] to-[#111418] px-6 py-5 text-white flex items-start justify-between relative border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Front-Desk Booking</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Reserve Your Sanctuary in Sohra
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1 max-w-sm leading-relaxed">
            Zero booking commission. Verified local tariffs sent directly to your WhatsApp.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isSubmitted ? (
        /* Success State */
        <div className="p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mx-auto text-amber-400 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tight text-white">Inquiry Confirmed</h4>
            <p className="text-white/60 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed font-mono">
              Thank you <span className="text-amber-400 font-bold">{name}</span>. Your request for{" "}
              <span className="text-white font-bold">{activeHotel?.name || "Selected Sanctuary"}</span> has been routed to our local Sohra desk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
            <div className="flex justify-between">
              <span className="text-white/40">Property:</span>
              <span className="text-white font-bold">{activeHotel?.name || "Selected Sanctuary"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Room:</span>
              <span className="text-white/80">{selectedRoomName || "Standard Deluxe"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Dates:</span>
              <span className="text-white/80">{checkIn} → {checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Guests:</span>
              <span className="text-white/80">{adults} Adults{children > 0 ? `, ${children} Children` : ""}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-white/40">Est. Tariff:</span>
              <span className="text-amber-400 font-black">₹{activeRoom?.price || activeHotel?.pricePerNight || 0} / night</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
            <a
              href={`https://wa.me/${hotelPhoneClean}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>Connect on WhatsApp Now</span>
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-mono uppercase text-xs sm:text-sm border border-white/15 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Form State - Dark Architectural Luxury Styling */
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {/* Property Card / Selector */}
          {preselectedHotel ? (
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-xs shadow-sm">
                  {preselectedHotel.starRating}★
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase text-white tracking-wide">{preselectedHotel.name}</h4>
                  <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5 font-mono">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{preselectedHotel.area}</span>
                  </p>
                </div>
              </div>
              <div className="text-right pl-2">
                <span className="text-[10px] text-white/40 block font-mono uppercase">Direct Tariff</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">₹{preselectedHotel.pricePerNight}</span>
                <span className="text-[10px] text-white/40 font-mono"> / night</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Desired Property</span>
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => handleHotelSelect(e.target.value)}
                className={`w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white ${
                  !selectedHotelId ? "text-white/40" : "text-white font-medium"
                }`}
              >
                <option value="" disabled>
                  Select Hotel / Homestay
                </option>
                {hotelsList.map((hotel) => (
                  <option key={hotel.id} value={hotel.id} className="text-white font-normal">
                    {hotel.name} ({hotel.starRating}★) — ₹{hotel.pricePerNight}/night • {hotel.area}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Category Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                <span>Room Configuration</span>
              </span>
              {activeRoom && (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                  ₹{activeRoom.price} / night
                </span>
              )}
            </label>
            <select
              value={selectedRoomName}
              disabled={!activeHotel}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className={`w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-all [&>option]:bg-[#111418] [&>option]:text-white ${
                !activeHotel ? "opacity-40 cursor-not-allowed text-white/30" : "cursor-pointer"
              } ${!selectedRoomName ? "text-white/40" : "text-white font-medium"}`}
            >
              <option value="" disabled>
                {activeHotel ? "Select Room Configuration" : "Select a hotel first"}
              </option>
              {availableRooms.map((r) => (
                <option key={r.id || r.name} value={r.name} className="text-white font-normal">
                  {r.name} — ₹{r.price}/night ({r.capacity}, {r.beds})
                </option>
              ))}
            </select>
          </div>

          {/* Dates - 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
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
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Check-out Date *</span>
              </label>
              <input
                type="date"
                required
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Guests - 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Adults</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Children</span>
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer [&>option]:bg-[#111418] [&>option]:text-white"
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
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Lead Guest Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>WhatsApp / Phone *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Upper floor balcony with canyon view, bonfire night request, or airport pickup..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-black uppercase tracking-wider text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Get Direct Property Quote</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40 mt-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct tariff guarantee • Response within 15 mins</span>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
