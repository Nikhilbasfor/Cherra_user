import { NextResponse } from "next/server";
import { dbGetHotels, dbSaveHotel, dbDeleteHotel } from "@/lib/db";
import { Hotel } from "@/lib/types";
import { isAuthorizedAdmin } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

interface Params {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const hotels = await dbGetHotels();
    const found = hotels.find((h) => h.id === id || h.slug === id);
    if (!found) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json(found, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * PUT /api/hotels/[id]
 * Protected: Requires Admin authorization
 */
export async function PUT(req: Request, { params }: Params) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required to update hotel data" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const { id } = await params;
    const body: Hotel = await req.json();
    body.id = id;
    const saved = await dbSaveHotel(body);
    return NextResponse.json(saved, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * DELETE /api/hotels/[id]
 * Protected: Requires Admin authorization
 */
export async function DELETE(req: Request, { params }: Params) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required to delete hotel records" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const { id } = await params;
    await dbDeleteHotel(id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
