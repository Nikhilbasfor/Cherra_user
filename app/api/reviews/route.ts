import { NextResponse } from "next/server";
import { dbGetReviews, dbSaveReview } from "@/lib/db";
import { HotelReview } from "@/lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    const reviews = await dbGetReviews(hotelId);
    return NextResponse.json(reviews, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body: HotelReview = await req.json();
    if (!body.hotelId || !body.comment || !body.rating) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400, headers: corsHeaders });
    }
    const saved = await dbSaveReview(body);
    return NextResponse.json(saved, { status: 201, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
