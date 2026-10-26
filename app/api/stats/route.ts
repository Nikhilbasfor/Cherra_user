import { NextResponse } from "next/server";
import { dbGetStats, dbSaveStats, dbGetHotels } from "@/lib/db";
import { SiteStats } from "@/lib/types";
import { isAuthorizedAdmin } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const [stats, hotels] = await Promise.all([dbGetStats(), dbGetHotels()]);
    const activeHotels = (hotels || []).filter((h) => h.status !== "inactive");
    const liveVerifiedStays =
      stats.verifiedStays && stats.verifiedStays !== "0"
        ? stats.verifiedStays
        : activeHotels.length > 0
          ? `${activeHotels.length}+`
          : "60+";
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
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required to update site stats" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body: SiteStats = await req.json();
    const saved = await dbSaveStats(body);
    return NextResponse.json(saved, { status: 200, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
