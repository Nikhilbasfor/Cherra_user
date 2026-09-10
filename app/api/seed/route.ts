import { NextResponse } from "next/server";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST() {
  let firestoreCount = 0;
  if (db && isFirebaseConfigured) {
    for (const hotel of CHERRAPUNJI_HOTELS) {
      await setDoc(doc(db, "hotels", hotel.id), hotel, { merge: true });
      firestoreCount++;
    }
  }

  // Also write to local file
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "hotels.json"), JSON.stringify(CHERRAPUNJI_HOTELS, null, 2), "utf-8");

  return NextResponse.json(
    {
      success: true,
      message: "Database seeded successfully. All hotels are live and ready.",
      firestoreCount,
      localFileSeeded: true,
      hotelsCount: CHERRAPUNJI_HOTELS.length,
    },
    { headers: corsHeaders }
  );
}
