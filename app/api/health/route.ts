import { NextResponse } from "next/server";
import { dbGetHotels } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Production Liveness & Readiness probe.
 * Used by uptime monitors (UptimeRobot, BetterStack) to verify that the app,
 * serverless runtime, and data layer are fully functional.
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Quick probe to ensure data layer responds within threshold
    const hotels = await dbGetHotels();
    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        responseTimeMs: durationMs,
        checks: {
          runtime: "ok",
          dataStore: hotels && hotels.length > 0 ? "healthy" : "degraded",
          hotelsCount: hotels?.length || 0,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Health check failure";
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: errorMsg,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
