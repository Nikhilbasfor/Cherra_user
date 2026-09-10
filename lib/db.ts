import fs from "fs";
import path from "path";
import { Hotel, InquiryLead } from "./types";
import { CHERRAPUNJI_HOTELS } from "./mockData";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const DATA_DIR = path.join(process.cwd(), "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

function ensureFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(HOTELS_FILE)) {
    fs.writeFileSync(HOTELS_FILE, JSON.stringify(CHERRAPUNJI_HOTELS, null, 2), "utf-8");
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

// ----------------- HOTELS -----------------

export async function dbGetHotels(): Promise<Hotel[]> {
  // If Firebase is live, use Firestore
  if (db && isFirebaseConfigured) {
    try {
      const hotelsCol = collection(db, "hotels");
      const q = query(hotelsCol, orderBy("rating", "desc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Hotel));
      } else {
        // Auto-seed Firestore so it's never blank
        console.log("Seeding Firestore with initial Cherrapunji hotels...");
        for (const h of CHERRAPUNJI_HOTELS) {
          await setDoc(doc(db, "hotels", h.id), h);
        }
        return CHERRAPUNJI_HOTELS;
      }
    } catch (err) {
      console.warn("Firestore error, falling back to local file:", err);
    }
  }

  // Fallback to local persistent JSON file
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(HOTELS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return CHERRAPUNJI_HOTELS;
  }
}

export async function dbSaveHotel(hotel: Hotel): Promise<Hotel> {
  // Save to Firebase if configured
  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "hotels", hotel.id), hotel, { merge: true });
    } catch (err) {
      console.warn("Firestore save error:", err);
    }
  }

  // Also persist to local file
  ensureFilesExist();
  const hotels = await dbGetHotels();
  const existingIdx = hotels.findIndex((h) => h.id === hotel.id || h.slug === hotel.slug);
  if (existingIdx >= 0) {
    hotels[existingIdx] = hotel;
  } else {
    hotels.unshift(hotel);
  }
  fs.writeFileSync(HOTELS_FILE, JSON.stringify(hotels, null, 2), "utf-8");
  return hotel;
}

export async function dbDeleteHotel(hotelId: string): Promise<boolean> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "hotels", hotelId));
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  ensureFilesExist();
  const hotels = await dbGetHotels();
  const updated = hotels.filter((h) => h.id !== hotelId);
  fs.writeFileSync(HOTELS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return true;
}

// ----------------- INQUIRIES / LEADS -----------------

export async function dbGetInquiries(): Promise<InquiryLead[]> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "inquiries");
      const q = query(col, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as InquiryLead));
      }
    } catch (err) {
      console.warn("Firestore inquiries fetch error:", err);
    }
  }

  ensureFilesExist();
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function dbSaveInquiry(inquiry: InquiryLead): Promise<InquiryLead> {
  const inquiryId = inquiry.id || ("lead-" + Date.now());
  const finalInquiry = { ...inquiry, id: inquiryId };

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "inquiries", inquiryId), {
        ...finalInquiry,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore save inquiry error:", err);
    }
  }

  ensureFilesExist();
  const list = await dbGetInquiries();
  const idx = list.findIndex((i) => i.id === inquiryId);
  if (idx >= 0) {
    list[idx] = finalInquiry;
  } else {
    list.unshift(finalInquiry);
  }
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  return finalInquiry;
}
