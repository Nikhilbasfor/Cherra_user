import { NextResponse } from "next/server";
import { dbGetInquiries, dbSaveInquiry } from "@/lib/db";
import { InquiryLead } from "@/lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const inquiries = await dbGetInquiries();
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<InquiryLead> = await req.json();
    if (!body.customerName || !body.customerPhone || !body.hotelName) {
      return NextResponse.json({ error: "Missing required inquiry fields" }, { status: 400, headers: corsHeaders });
    }
    const newInquiry: InquiryLead = {
      id: "lead-" + Date.now(),
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      hotelId: body.hotelId || "hotel-" + Date.now(),
      hotelName: body.hotelName,
      roomType: body.roomType || "Standard Deluxe",
      checkIn: body.checkIn || new Date().toISOString().split("T")[0],
      checkOut: body.checkOut || new Date().toISOString().split("T")[0],
      guests: body.guests || { adults: 2, children: 0 },
      specialRequests: body.specialRequests || "",
      status: "new",
      budget: body.budget || 5000,
      notes: [],
      createdAt: "Just now",
    };

    const saved = await dbSaveInquiry(newInquiry);
    return NextResponse.json(saved, { status: 201, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
