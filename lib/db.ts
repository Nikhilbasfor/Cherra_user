import fs from "fs";
import path from "path";
import { Hotel, InquiryLead, Attraction, FAQItem, SiteStats, HotelReview } from "./types";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_ATTRACTIONS } from "./mockData";
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

const DATA_DIR = path.join(process.cwd(), "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const ATTRACTIONS_FILE = path.join(DATA_DIR, "attractions.json");
const FAQS_FILE = path.join(DATA_DIR, "faqs.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is the best time to visit Cherrapunji (Sohra)?",
    answer: "Cherrapunji is spectacular year-round. For roaring waterfalls and dramatic misty canyon clouds, the monsoon season from June to September is magical. For trekking down to the Double Decker Living Root Bridge and clear sunny skies, October to April is ideal.",
    order: 1,
  },
  {
    id: "faq-2",
    question: "How do I book hotels through CherraStays without commission?",
    answer: "When you submit an inquiry through our portal, your request connects directly with the resort management and our local desk in Sohra. There are no middleman surcharges, ensuring you get direct front-desk tariffs along with prompt WhatsApp verification.",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Are hotels in Cherrapunji safe for families and solo female travelers?",
    answer: "Yes, exceptionally so. Meghalaya is globally recognized for its matrilineal society, peaceful culture, and warm Khasi hospitality. All hotels in our collection are verified physical properties adhering to strict safety and hygiene benchmarks.",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Can hotels arrange airport transfers from Guwahati or Shillong?",
    answer: "Yes. Our partner resorts and boutique stays coordinate reliable cab pickups and drop-offs from Guwahati Airport (GAU) and Shillong Airport (SHL) with verified local drivers.",
    order: 4,
  },
  {
    id: "faq-5",
    question: "Do hotels in Cherrapunji provide 24/7 hot water geysers?",
    answer: "Yes. Because Cherrapunji remains crisp and misty throughout the year, every stay in our curated portfolio is equipped with reliable hot water geysers in private bathrooms.",
    order: 5,
  },
];

export const INITIAL_STATS: SiteStats = {
  verifiedStays: "10+",
  satisfactionRate: "4.8 / 5.0",
  tariffPledge: "100%",
  avgResponseTime: "20 Min",
};

export const INITIAL_REVIEWS: HotelReview[] = [
  {
    id: "rev-1",
    hotelId: "polo-orchid-resort",
    userId: "user-1",
    userName: "Aditi Sharma",
    userEmail: "aditi@gmail.com",
    rating: 5,
    title: "Unmatched sunrise view over Nohsngithiang Falls",
    comment: "Waking up to the clouds rising from the Bangladesh plains was surreal. The log cabin was warm with 24/7 hot water, and the bonfire dinner was exceptional.",
    stayMonth: "October 2024",
    createdAt: "Nov 2, 2024",
    verified: true,
  },
  {
    id: "rev-2",
    hotelId: "cherrapunjee-holiday-resort",
    userId: "user-2",
    userName: "Rahul Sengupta",
    userEmail: "rahul@outlook.com",
    rating: 5,
    title: "The true authentic Khasi homestay experience",
    comment: "Denis and his family treated us like personal guests. Best guidance for the Living Root Bridge trek, and homecooked local meals were pure comfort.",
    stayMonth: "December 2024",
    createdAt: "Dec 18, 2024",
    verified: true,
  },
  {
    id: "rev-3",
    hotelId: "saimika-park-resort",
    userId: "user-3",
    userName: "Vikram Mehta",
    userEmail: "vikram@yahoo.com",
    rating: 4,
    title: "Serene stream & stone cottages in nature",
    comment: "Very rustic and peaceful. Listening to local Khasi musicians around the campfire was memorable.",
    stayMonth: "January 2025",
    createdAt: "Jan 12, 2025",
    verified: true,
  },
];

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
    return JSON.parse(raw);
  } catch {
    return CHERRAPUNJI_HOTELS;
  }
}

export async function dbSaveHotel(hotel: Hotel): Promise<Hotel> {
  // Save to Firebase if configured
  if (db && isFirebaseConfigured) {
    try {
      await withTimeout(setDoc(doc(db, "hotels", hotel.id), hotel, { merge: true }), 2500);
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
      await withTimeout(deleteDoc(doc(db, "hotels", hotelId)), 2500);
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

function formatInquiryTimestamp(ts: any): string {
  if (!ts) return "Recently";
  if (typeof ts === "string") return ts;
  if (typeof ts.toDate === "function") {
    try {
      return ts.toDate().toLocaleString("en-US", {
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
  if (ts.seconds) {
    try {
      return new Date(ts.seconds * 1000).toLocaleString("en-US", {
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
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
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
  fs.writeFileSync(ATTRACTIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
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
  fs.writeFileSync(ATTRACTIONS_FILE, JSON.stringify(updated, null, 2), "utf-8");
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
  fs.writeFileSync(FAQS_FILE, JSON.stringify(list, null, 2), "utf-8");
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
  fs.writeFileSync(FAQS_FILE, JSON.stringify(updated, null, 2), "utf-8");
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
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), "utf-8");
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
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(all, null, 2), "utf-8");
  return finalRev;
}

