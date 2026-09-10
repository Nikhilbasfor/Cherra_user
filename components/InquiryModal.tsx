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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
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
      setErrorMsg("Please fill all required fields (Name, Phone, Check-in, Check-out)");
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

  const hotelPhoneClean = (activeHotel.phone || "+91 87947 12345").replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello! I submitted a booking inquiry for *${activeHotel.name}* (${selectedRoomName}). Dates: ${checkIn} to ${checkOut} for ${adults} Adults${children > 0 ? `, ${children} Children` : ""}. Name: ${name}. Please confirm room rates & availability!`
  );

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 my-6"
    >
      {/* Header */}
      <div className="bg-emerald-50/70 px-5 py-4 border-b border-emerald-100 flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Direct Property Tariffs
          </span>
          <h3 className="text-base font-bold text-slate-900">
            {preselectedHotel ? `Book ${preselectedHotel.name}` : "Book or Inquire for Cherrapunji Stay"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your inquiry is routed directly to the property desk with zero extra fees.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isSubmitted ? (
        /* Success State */
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
            <p className="text-slate-600 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
              Thank you <span className="text-emerald-800 font-semibold">{name}</span>. Your request for{" "}
              <span className="text-emerald-800 font-semibold">{activeHotel.name}</span> ({selectedRoomName}) has been logged. Our local desk will contact you within 15 minutes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
            <p className="text-slate-500">
              <span className="text-slate-800 font-medium">Hotel:</span> {activeHotel.name}
            </p>
            <p className="text-slate-500">
              <span className="text-slate-800 font-medium">Room Category:</span> {selectedRoomName}
            </p>
            <p className="text-slate-500">
              <span className="text-slate-800 font-medium">Stay Dates:</span> {checkIn} to {checkOut}
            </p>
            <p className="text-slate-500">
              <span className="text-slate-800 font-medium">Guests:</span> {adults} Adults, {children} Children
            </p>
            <p className="text-slate-500">
              <span className="text-slate-800 font-medium">Estimated Tariff:</span> ₹{activeRoom?.price || activeHotel.pricePerNight}/night
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a
              href={`https://wa.me/${hotelPhoneClean}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp Now
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Hotel Selection: Locked Property Card vs Live Selector */}
          {preselectedHotel ? (
            /* Locked Hotel Card */
            <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {activeHotel.starRating}★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{activeHotel.name}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[200px]">{activeHotel.area}</span>
                  </p>
                </div>
              </div>
              <div className="text-right pl-2 shrink-0">
                <span className="text-[10px] text-slate-400 block">Starting from</span>
                <span className="text-xs font-bold text-emerald-800">₹{activeHotel.pricePerNight}</span>
                <span className="text-[10px] text-slate-500">/night</span>
              </div>
            </div>
          ) : (
            /* All Hotels Dropdown */
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                Selected Hotel / Resort
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => handleHotelSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              >
                {hotelsList.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.starRating}★) — ₹{hotel.pricePerNight}/night ({hotel.area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Room Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                Room Category
              </span>
              {activeRoom && (
                <span className="text-[11px] font-bold text-emerald-800">
                  ₹{activeRoom.price}/night
                </span>
              )}
            </label>
            <select
              value={selectedRoomName}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            >
              {availableRooms.map((r) => (
                <option key={r.id || r.name} value={r.name}>
                  {r.name} — ₹{r.price}/night ({r.capacity}, {r.beds})
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Check-in Date *
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Check-out Date *
              </label>
              <input
                type="date"
                required
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Adults
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Adult" : "Adults"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Children
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Child" : "Children"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests (Valley view, Bonfire, Veg meals, Taxi pickup)
              </label>
              <textarea
                rows={2}
                placeholder="Need room with direct waterfall view and airport taxi pickup..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Direct Property Quote</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-1.5">
              🔒 Direct confirmation from property manager. No payment required now.
            </p>
          </div>
        </form>
      )}
    </motion.div>
  );
}
