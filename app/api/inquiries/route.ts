import { NextResponse } from "next/server";
import { dbGetInquiries, dbSaveInquiry } from "@/lib/db";
import { InquiryLead } from "@/lib/types";
import { checkRateLimit, isAuthorizedAdmin } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/inquiries
 * Protected: Requires Admin API Key in Authorization header or X-Admin-Key.
 * Protects customer phone numbers and identities from unauthorized scrapers.
 */
export async function GET(req: Request) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin API key required to view customer inquiries" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const inquiries = await dbGetInquiries();
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * POST /api/inquiries
 * Public lead intake: Protected by IP Rate Limiting (5 per 10 min) and Anti-Bot Honeypot.
 */
export async function POST(req: Request) {
  // 1. IP Rate Limiting Guard
  const rateLimit = checkRateLimit(req, { maxRequests: 5, windowMs: 10 * 60 * 1000 });
  const rateHeaders = {
    ...corsHeaders,
    "X-RateLimit-Limit": String(rateLimit.limit),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
  };

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error:
          "Too many booking inquiries submitted from this connection. Please wait 10 minutes or reach our direct concierge on WhatsApp: +91 98648 79505.",
      },
      { status: 429, headers: rateHeaders }
    );
  }

  try {
    const body: Partial<InquiryLead> & { _hp?: string; botField?: string } = await req.json();

    // 2. Anti-Bot Honeypot Trap (Invisible to real humans, filled by spam bots)
    if (body._hp || body.botField) {
      console.warn("Spam bot trapped by honeypot field, rejecting quietly.");
      return NextResponse.json(
        { id: "lead-fake", status: "received" },
        { status: 200, headers: rateHeaders }
      );
    }

    // 3. Input Validation
    if (!body.customerName?.trim() || !body.customerPhone?.trim() || !body.hotelName?.trim()) {
      return NextResponse.json(
        { error: "Missing required inquiry fields: Name, Phone, and Hotel selection are required." },
        { status: 400, headers: rateHeaders }
      );
    }

    // Sanitize phone number (remove excess characters, check realistic length)
    const cleanPhone = body.customerPhone.replace(/[^\d+]/g, "");
    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid phone number with country code for WhatsApp booking confirmation." },
        { status: 400, headers: rateHeaders }
      );
    }

    const newInquiry: InquiryLead = {
      id: body.id || "lead-" + Date.now(),
      customerName: body.customerName.trim().slice(0, 100),
      customerPhone: cleanPhone,
      customerEmail: body.customerEmail ? body.customerEmail.trim().slice(0, 120) : "",
      hotelId: body.hotelId || "hotel-" + Date.now(),
      hotelName: body.hotelName.trim().slice(0, 150),
      roomType: body.roomType || "Standard Deluxe",
      checkIn: body.checkIn || new Date().toISOString().split("T")[0],
      checkOut: body.checkOut || new Date().toISOString().split("T")[0],
      guests: body.guests || { adults: 2, children: 0 },
      specialRequests: body.specialRequests ? body.specialRequests.trim().slice(0, 500) : "",
      status: "new",
      budget: body.budget || 5000,
      notes: [],
      createdAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    const saved = await dbSaveInquiry(newInquiry);
    return NextResponse.json(saved, { status: 201, headers: rateHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: rateHeaders });
  }
}
