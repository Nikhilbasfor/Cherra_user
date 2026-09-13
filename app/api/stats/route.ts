import { NextResponse } from "next/server";
import { dbGetStats, dbSaveStats, dbGetHotels, dbGetReviews } from "@/lib/db";
import { SiteStats } from "@/lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const stats = await dbGetStats();
    const hotels = await dbGetHotels();
    const reviews = await dbGetReviews();

    // Dynamically calculate actual hotel count and reviews average if available
    let dynamicRating = "4.9 / 5.0";
    if (reviews.length > 0) {
      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      dynamicRating = `${avg.toFixed(1)} / 5.0`;
    }

    const dynamicStats: SiteStats = {
      verifiedStays: hotels.length > 0 ? `${hotels.length}+` : stats.verifiedStays,
      satisfactionRate: dynamicRating,
      tariffPledge: stats.tariffPledge || "100%",
      avgResponseTime: stats.avgResponseTime || "15 Min",
    };

    return NextResponse.json(dynamicStats, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body: SiteStats = await req.json();
    const saved = await dbSaveStats(body);
    return NextResponse.json(saved, { status: 200, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
