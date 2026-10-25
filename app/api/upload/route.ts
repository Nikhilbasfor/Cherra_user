import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { dbGetHotels, dbSaveHotel } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/rateLimit";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required to upload hotel photos" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const hotelSlug = (formData.get("hotelSlug") as string)?.trim() || "general";
    const hotelId = (formData.get("hotelId") as string)?.trim() || "";
    const replaceAll = formData.get("replaceAll") === "true";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided for upload" },
        { status: 400, headers: corsHeaders }
      );
    }

    const safeSlug = hotelSlug.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const uploadDir = path.join(process.cwd(), "public", "uploads", "hotels", safeSlug);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file.arrayBuffer !== "function") continue;

      // Filter only image types
      if (file.type && !file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp|avif|heic)$/i.test(file.name)) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".jpg";
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `${Date.now()}-${i + 1}-${baseName}${ext.toLowerCase()}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      savedUrls.push(`/uploads/hotels/${safeSlug}/${filename}`);
    }

    if (savedUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid image files could be processed" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update hotel inventory with new images
    const hotels = await dbGetHotels();
    const hotelIndex = hotels.findIndex(
      (h) => (hotelId && h.id === hotelId) || (hotelSlug && (h.slug === hotelSlug || h.id === hotelSlug))
    );

    let updatedHotel = null;
    if (hotelIndex >= 0) {
      const existing = hotels[hotelIndex];
      const newImages = replaceAll ? savedUrls : [...(existing.images || []), ...savedUrls];
      existing.images = newImages;
      updatedHotel = await dbSaveHotel(existing);
    }

    return NextResponse.json(
      {
        success: true,
        count: savedUrls.length,
        savedUrls,
        images: updatedHotel ? updatedHotel.images : savedUrls,
        hotel: updatedHotel,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Internal server error during photo upload";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
