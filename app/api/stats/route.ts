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
    const [stats, hotels] = await Promise.all([dbGetStats(), dbGetHotels()]);
    const liveVerifiedStays =
      hotels && hotels.length > 0 ? `${hotels.length}+` : stats.verifiedStays;
    return NextResponse.json(
      { ...stats, verifiedStays: liveVerifiedStays },
      { headers: corsHeaders }
    );
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
