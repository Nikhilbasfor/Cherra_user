import fs from "fs";
import path from "path";
import { Hotel, InquiryLead, Attraction, FAQItem, SiteStats, HotelReview } from "./types";
import {
  CHERRAPUNJI_HOTELS,
  CHERRAPUNJI_ATTRACTIONS,
  INITIAL_FAQS,
  INITIAL_STATS,
  INITIAL_REVIEWS,
} from "./mockData";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

export { INITIAL_FAQS, INITIAL_STATS, INITIAL_REVIEWS };

const DATA_DIR = path.join(process.cwd(), "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const ATTRACTIONS_FILE = path.join(DATA_DIR, "attractions.json");
const FAQS_FILE = path.join(DATA_DIR, "faqs.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function ensureFilesExist() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(HOTELS_FILE)) {
      fs.writeFileSync(HOTELS_FILE, JSON.stringify(CHERRAPUNJI_HOTELS, null, 2), "utf-8");
    }
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    if (!fs.existsSync(ATTRACTIONS_FILE)) {
      fs.writeFileSync(ATTRACTIONS_FILE, JSON.stringify(CHERRAPUNJI_ATTRACTIONS, null, 2), "utf-8");
    }
    if (!fs.existsSync(FAQS_FILE)) {
      fs.writeFileSync(FAQS_FILE, JSON.stringify(INITIAL_FAQS, null, 2), "utf-8");
    }
    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(STATS_FILE, JSON.stringify(INITIAL_STATS, null, 2), "utf-8");
    }
    if (!fs.existsSync(REVIEWS_FILE)) {
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), "utf-8");
    }
  } catch {
    // Ignore on read-only serverless filesystems (e.g. Vercel)
  }
}

function safeWriteFile(filePath: string, data: unknown) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore on read-only serverless filesystems (e.g. Vercel)
  }
}

function withTimeout<T>(promise: Promise<T>, ms = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// ----------------- HOTELS -----------------

export async function dbGetHotels(): Promise<Hotel[]> {
  // If Firebase is live, use Firestore
  if (db && isFirebaseConfigured) {
    try {
      const hotelsCol = collection(db, "hotels");
      const q = query(hotelsCol, orderBy("rating", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Hotel));
      } else {
        // Auto-seed Firestore in background
        Promise.all(CHERRAPUNJI_HOTELS.map((h) => setDoc(doc(db!, "hotels", h.id), h))).catch(console.warn);
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
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return CHERRAPUNJI_HOTELS;
  } catch {
    return CHERRAPUNJI_HOTELS;
  }
}

export async function dbSaveHotel(hotel: Hotel): Promise<Hotel> {
  // Save to Firebase if configured
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(setDoc(doc(db, "hotels", hotel.id), hotel, { merge: true }), 12000);
    } catch (err) {
      console.warn("Firestore save error:", err);
    }
  }

  // Also persist to local file (when writable)
  ensureFilesExist();
  const hotels = await dbGetHotels();
  const existingIdx = hotels.findIndex((h) => h.id === hotel.id || h.slug === hotel.slug);
  if (existingIdx >= 0) {
    hotels[existingIdx] = hotel;
  } else {
    hotels.unshift(hotel);
  }
  safeWriteFile(HOTELS_FILE, hotels);
  return hotel;
}

export async function dbDeleteHotel(hotelId: string): Promise<boolean> {
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(deleteDoc(doc(db, "hotels", hotelId)), 5000);
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  ensureFilesExist();
  const hotels = await dbGetHotels();
  const updated = hotels.filter((h) => h.id !== hotelId);
  safeWriteFile(HOTELS_FILE, updated);
  return true;
}

// ----------------- INQUIRIES / LEADS -----------------

function formatInquiryTimestamp(ts: unknown): string {
  if (!ts) return "Recently";
  if (typeof ts === "string") return ts;
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    try {
      return (ts as { toDate: () => Date }).toDate().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return "Recently";
    }
  }
  if (typeof ts === "object" && ts !== null && "seconds" in ts) {
    try {
      return new Date(Number((ts as { seconds: number }).seconds) * 1000).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return "Recently";
    }
  }
  return String(ts);
}

export async function dbGetInquiries(): Promise<InquiryLead[]> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "inquiries");
      const q = query(col, orderBy("createdAt", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt: formatInquiryTimestamp(data.createdAt),
          } as InquiryLead;
        });
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
      await withTimeout(
        setDoc(doc(db, "inquiries", inquiryId), {
          ...finalInquiry,
          createdAt: serverTimestamp(),
        }),
        2500
      );
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
  safeWriteFile(INQUIRIES_FILE, list);
  return finalInquiry;
}

// ----------------- ATTRACTIONS -----------------

export async function dbGetAttractions(): Promise<Attraction[]> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "attractions");
      const q = query(col, orderBy("rating", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Attraction));
      } else {
        // Auto seed
        Promise.all(CHERRAPUNJI_ATTRACTIONS.map((a) => setDoc(doc(db!, "attractions", a.id), a))).catch(console.warn);
        return CHERRAPUNJI_ATTRACTIONS;
      }
    } catch (err) {
      console.warn("Firestore attractions fetch error:", err);
    }
  }

  ensureFilesExist();
  try {
    const raw = fs.readFileSync(ATTRACTIONS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return CHERRAPUNJI_ATTRACTIONS;
  }
}

export async function dbSaveAttraction(attraction: Attraction): Promise<Attraction> {
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(setDoc(doc(db, "attractions", attraction.id), attraction, { merge: true }), 2500);
    } catch (err) {
      console.warn("Firestore save attraction error:", err);
    }
  }

  ensureFilesExist();
  const list = await dbGetAttractions();
  const idx = list.findIndex((a) => a.id === attraction.id);
  if (idx >= 0) {
    list[idx] = attraction;
  } else {
    list.push(attraction);
  }
  safeWriteFile(ATTRACTIONS_FILE, list);
  return attraction;
}

export async function dbDeleteAttraction(attractionId: string): Promise<boolean> {
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(deleteDoc(doc(db, "attractions", attractionId)), 2500);
    } catch (err) {
      console.warn("Firestore delete attraction error:", err);
    }
  }

  ensureFilesExist();
  const list = await dbGetAttractions();
  const updated = list.filter((a) => a.id !== attractionId);
  safeWriteFile(ATTRACTIONS_FILE, updated);
  return true;
}

// ----------------- FAQS -----------------

export async function dbGetFAQs(): Promise<FAQItem[]> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "faqs");
      const q = query(col, orderBy("order", "asc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FAQItem));
      } else {
        // Auto seed
        Promise.all(INITIAL_FAQS.map((f) => setDoc(doc(db!, "faqs", f.id), f))).catch(console.warn);
        return INITIAL_FAQS;
      }
    } catch (err) {
      console.warn("Firestore FAQs fetch error:", err);
    }
  }

  ensureFilesExist();
  try {
    const raw = fs.readFileSync(FAQS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return INITIAL_FAQS;
  }
}

export async function dbSaveFAQ(faq: FAQItem): Promise<FAQItem> {
  const faqId = faq.id || ("faq-" + Date.now());
  const finalFaq = { ...faq, id: faqId, order: faq.order || 99 };

  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(setDoc(doc(db, "faqs", faqId), finalFaq, { merge: true }), 2500);
    } catch (err) {
      console.warn("Firestore save FAQ error:", err);
    }
  }

  ensureFilesExist();
  const list = await dbGetFAQs();
  const idx = list.findIndex((f) => f.id === faqId);
  if (idx >= 0) {
    list[idx] = finalFaq;
  } else {
    list.push(finalFaq);
  }
  safeWriteFile(FAQS_FILE, list);
  return finalFaq;
}

export async function dbDeleteFAQ(faqId: string): Promise<boolean> {
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(deleteDoc(doc(db, "faqs", faqId)), 2500);
    } catch (err) {
      console.warn("Firestore delete FAQ error:", err);
    }
  }

  ensureFilesExist();
  const list = await dbGetFAQs();
  const updated = list.filter((f) => f.id !== faqId);
  safeWriteFile(FAQS_FILE, updated);
  return true;
}

// ----------------- SITE STATS -----------------

export async function dbGetStats(): Promise<SiteStats> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "site_stats");
      const snapshot = await withTimeout(getDocs(col), 2000);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as SiteStats;
      } else {
        // Auto seed
        setDoc(doc(db, "site_stats", "main"), INITIAL_STATS).catch(console.warn);
        return INITIAL_STATS;
      }
    } catch (err) {
      console.warn("Firestore stats fetch error:", err);
    }
  }

  ensureFilesExist();
  try {
    const raw = fs.readFileSync(STATS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATS;
  }
}

export async function dbSaveStats(stats: SiteStats): Promise<SiteStats> {
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(setDoc(doc(db, "site_stats", "main"), stats, { merge: true }), 2500);
    } catch (err) {
      console.warn("Firestore save stats error:", err);
    }
  }

  ensureFilesExist();
  safeWriteFile(STATS_FILE, stats);
  return stats;
}

// ----------------- REVIEWS -----------------

export async function dbGetReviews(hotelId?: string): Promise<HotelReview[]> {
  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "reviews");
      const q = hotelId
        ? query(col, where("hotelId", "==", hotelId))
        : query(col, orderBy("createdAt", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as HotelReview));
      } else if (!hotelId) {
        // Auto seed
        Promise.all(INITIAL_REVIEWS.map((r) => setDoc(doc(db!, "reviews", r.id), r))).catch(console.warn);
        return INITIAL_REVIEWS;
      }
    } catch (err) {
      console.warn("Firestore reviews fetch error:", err);
    }
  }

  ensureFilesExist();
  try {
    const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
    const allReviews: HotelReview[] = JSON.parse(raw);
    if (hotelId) {
      return allReviews.filter((r) => r.hotelId === hotelId);
    }
    return allReviews;
  } catch {
    return hotelId ? INITIAL_REVIEWS.filter((r) => r.hotelId === hotelId) : INITIAL_REVIEWS;
  }
}

export async function dbSaveReview(review: HotelReview): Promise<HotelReview> {
  const revId = review.id || ("rev-" + Date.now());
  const finalRev: HotelReview = {
    ...review,
    id: revId,
    verified: true,
    createdAt: review.createdAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };

  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(
        setDoc(doc(db, "reviews", revId), {
          ...finalRev,
          serverTimestamp: serverTimestamp(),
        }),
        2500
      );
    } catch (err) {
      console.warn("Firestore save review error:", err);
    }
  }

  ensureFilesExist();
  const all = await dbGetReviews();
  all.unshift(finalRev);
  safeWriteFile(REVIEWS_FILE, all);
  return finalRev;
}

