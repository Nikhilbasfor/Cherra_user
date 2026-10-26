import { NextResponse } from "next/server";
import { dbGetHotels, dbSaveHotel } from "@/lib/db";
import { Hotel } from "@/lib/types";
import { isAuthorizedAdmin } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive =
      searchParams.get("includeInactive") === "true" || isAuthorizedAdmin(req);
    const hotels = await dbGetHotels();
    const filtered = includeInactive
      ? hotels
      : hotels.filter((h) => h.status !== "inactive");
    return NextResponse.json(filtered, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * POST /api/hotels
 * Protected: Requires Admin authorization
 */
export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required to add or modify hotel inventory" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body: Hotel = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
    }
    const saved = await dbSaveHotel(body);
    return NextResponse.json(saved, { status: 201, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
