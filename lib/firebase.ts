import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Hotel, InquiryLead, Attraction, FAQItem, SiteStats, HotelReview } from "./types";
import {
  CHERRAPUNJI_HOTELS,
  CHERRAPUNJI_ATTRACTIONS,
  INITIAL_FAQS,
  INITIAL_STATS,
  INITIAL_REVIEWS,
} from "./mockData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCqJAgcMfdnyIzG-zFY3mdJDJxEO04tj-I",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cherraproject.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cherraproject",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cherraproject.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "528185893048",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:528185893048:web:6f359608b13a55a515d44d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-726185CDW3",
};

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
    }
  } catch (error) {
    console.warn("Firebase initialization skipped or failed:", error);
  }
}

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Fetch all active hotels from Firestore or local backend
 */
export async function getAllHotels(): Promise<Hotel[]> {
  if (db && isFirebaseConfigured) {
    try {
      const hotelsCol = collection(db, "hotels");
      const q = query(hotelsCol, orderBy("rating", "desc"));
      const snapshot = await withTimeout(getDocs(q), 8000);
      if (!snapshot.empty) {
        return snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Hotel, "id">),
          }))
          .filter((h) => h.status !== "inactive");
      } else {
        // Auto-seed Firestore so user's new Firebase project isn't empty!
        Promise.all(CHERRAPUNJI_HOTELS.map((h) => setDoc(doc(db!, "hotels", h.id), h))).catch(console.warn);
        return CHERRAPUNJI_HOTELS.filter((h) => h.status !== "inactive");
      }
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local backend:", err);
    }
  }

  // If in browser, fetch from /api/hotels
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/hotels", { cache: "no-store" });
      if (res.ok) {
        const data: Hotel[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.filter((h) => h.status !== "inactive");
        }
      }
    } catch {
      // fallback
    }
  } else {
    // Server-side
    try {
      const { dbGetHotels } = await import("./db");
      const list = await dbGetHotels();
      if (Array.isArray(list) && list.length > 0) {
        return list.filter((h) => h.status !== "inactive");
      }
    } catch {
      // fallback
    }
  }

  return CHERRAPUNJI_HOTELS.filter((h) => h.status !== "inactive");
}

/**
 * Fetch a single hotel by its slug or ID with fast direct Firestore lookup + resilient matching
 */
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase().trim().replace(/\/+$/, "");

  // 0. Fast direct single-document lookup in Firestore (~100ms instead of downloading entire collection)
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, "hotels", decoded);
      const docSnap = await withTimeout(getDoc(docRef), 5000);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...(docSnap.data() as Omit<Hotel, "id">) };
        if (data.status !== "inactive") return data;
      }

      const slugQuery = query(collection(db, "hotels"), where("slug", "==", decoded));
      const slugSnap = await withTimeout(getDocs(slugQuery), 5000);
      if (!slugSnap.empty) {
        const firstDoc = slugSnap.docs[0];
        const data = { id: firstDoc.id, ...(firstDoc.data() as Omit<Hotel, "id">) };
        if (data.status !== "inactive") return data;
      }
    } catch (err) {
      console.warn("Direct Firestore getHotelBySlug fallback:", err);
    }
  }

  const all = await getAllHotels();

  // 1. Exact match by slug or id
  const found = all.find((h) => {
    const hSlug = (h.slug || "").toLowerCase().trim();
    const hId = (h.id || "").toLowerCase().trim();
    return hSlug === decoded || hId === decoded;
  });
  if (found) return found;

  // 2. Resilient suffix-stripped matching (e.g., -sohra, -cherrapunji, -resort, -cottages)
  const cleanSearch = decoded.replace(/-(resort|sohra|cherrapunji|cottages|hotel|retreat|stays)$/g, "");
  if (cleanSearch.length >= 4) {
    const fuzzy = all.find((h) => {
      const s = (h.slug || "").toLowerCase();
      const id = (h.id || "").toLowerCase();
      return s.includes(cleanSearch) || cleanSearch.includes(s) || id.includes(cleanSearch) || cleanSearch.includes(id);
    });
    if (fuzzy) return fuzzy;
  }

  return null;
}

/**
 * Submit an inquiry / booking request (Clean single write via API with Firestore fallback)
 */
export async function submitInquiry(lead: Omit<InquiryLead, "id" | "createdAt" | "status">): Promise<{ success: boolean; id?: string }> {
  const docId = "lead-" + Date.now();

  // 1. Route through API to cleanly persist to Firestore and local store exactly once
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, id: docId }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id || docId };
      }
    } catch (err) {
      console.warn("API inquiry submission fallback to direct Firestore:", err);
    }
  }

  // 2. Direct Firestore fallback only if API post fails
  if (db && isFirebaseConfigured) {
    try {
      const finalLead: InquiryLead = {
        id: docId,
        ...lead,
        status: "new",
        createdAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      await withTimeout(setDoc(doc(db, "inquiries", docId), finalLead), 2500);
      return { success: true, id: docId };
    } catch (err) {
      console.error("Firestore direct inquiry save error:", err);
    }
  }

  return { success: true, id: docId };
}

/**
 * Auto-logger for direct WhatsApp clicks across the website.
 * Captures visitor intent without blocking or delaying their WhatsApp conversation.
 */
export async function logWhatsAppClick(details: {
  hotelName?: string;
  hotelId?: string;
  roomType?: string;
  page?: string;
  note?: string;
}) {
  const docId = "wa-lead-" + Date.now();
  const payload = {
    id: docId,
    customerName: details.hotelName ? `WhatsApp Visitor (${details.hotelName})` : "WhatsApp Direct Visitor",
    customerPhone: "Direct WhatsApp Click",
    customerEmail: "",
    hotelId: details.hotelId || "general",
    hotelName: details.hotelName || "Cherrapunji Concierge Desk",
    roomType: details.roomType || "WhatsApp Inquiry",
    source: "whatsapp_click",
    page: details.page || (typeof window !== "undefined" ? window.location.pathname : "/"),
    specialRequests: details.note || "Guest clicked direct WhatsApp button to chat with concierge.",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  };

  try {
    if (typeof window !== "undefined") {
      fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(console.warn);
    }
  } catch (err) {
    console.warn("logWhatsAppClick non-blocking error:", err);
  }
}

/**
 * Fetch all attractions from Firestore or local backend
 */
export async function getAllAttractions(): Promise<Attraction[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/attractions", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // fallback
    }
  }

  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "attractions");
      const q = query(col, orderBy("rating", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Attraction));
      }
    } catch (err) {
      console.warn("Firestore attractions fetch error:", err);
    }
  }

  return CHERRAPUNJI_ATTRACTIONS;
}

/**
 * Fetch all FAQs from Firestore or local backend
 */
export async function getAllFAQs(): Promise<FAQItem[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/faqs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // fallback
    }
  }

  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "faqs");
      const q = query(col, orderBy("order", "asc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as FAQItem));
      }
    } catch (err) {
      console.warn("Firestore FAQs fetch error:", err);
    }
  }

  return INITIAL_FAQS;
}

/**
 * Fetch site metrics / stats
 */
export async function getSiteStats(): Promise<SiteStats> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
  }

  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "site_stats");
      const snapshot = await withTimeout(getDocs(col), 2000);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as SiteStats;
      }
    } catch (err) {
      console.warn("Firestore stats fetch error:", err);
    }
  }

  return INITIAL_STATS;
}

/**
 * Fetch reviews for a hotel
 */
export async function getHotelReviews(hotelId?: string): Promise<HotelReview[]> {
  if (typeof window !== "undefined") {
    try {
      const url = hotelId ? `/api/reviews?hotelId=${encodeURIComponent(hotelId)}` : "/api/reviews";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
  }

  if (db && isFirebaseConfigured) {
    try {
      const col = collection(db, "reviews");
      const snapshot = await withTimeout(getDocs(col), 2000);
      if (!snapshot.empty) {
        const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as HotelReview));
        return hotelId ? all.filter((r) => r.hotelId === hotelId) : all;
      }
    } catch (err) {
      console.warn("Firestore reviews fetch error:", err);
    }
  }

  return hotelId ? INITIAL_REVIEWS.filter((r) => r.hotelId === hotelId) : INITIAL_REVIEWS;
}

/**
 * Submit a verified guest review
 */
export async function submitHotelReview(review: HotelReview): Promise<{ success: boolean; data?: HotelReview }> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  }
  return { success: false };
}

/**
 * Real-time subscription to Site Stats in Firestore
 */
export function subscribeToSiteStats(callback: (stats: SiteStats) => void): () => void {
  if (typeof window === "undefined" || !db || !isFirebaseConfigured) {
    return () => {};
  }
  try {
    const unsub = onSnapshot(
      doc(db, "site_stats", "main"),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as SiteStats);
        }
      },
      (err) => {
        console.warn("Realtime stats listener warning:", err);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Failed to subscribe to site stats:", err);
    return () => {};
  }
}

/**
 * Real-time subscription to Hotels in Firestore
 */
export function subscribeToHotels(callback: (hotels: Hotel[]) => void): () => void {
  if (typeof window === "undefined" || !db || !isFirebaseConfigured) {
    return () => {};
  }
  try {
    const q = query(collection(db, "hotels"), orderBy("rating", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() } as Hotel))
            .filter((h) => h.status !== "inactive");
          callback(list);
        }
      },
      (err) => {
        console.warn("Realtime hotels listener warning:", err);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Failed to subscribe to hotels:", err);
    return () => {};
  }
}

/**
 * Real-time subscription to Attractions in Firestore
 */
export function subscribeToAttractions(callback: (attractions: Attraction[]) => void): () => void {
  if (typeof window === "undefined" || !db || !isFirebaseConfigured) {
    return () => {};
  }
  try {
    const unsub = onSnapshot(
      collection(db, "attractions"),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as Attraction)
          );
          callback(list);
        }
      },
      (err) => {
        console.warn("Realtime attractions listener warning:", err);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Failed to subscribe to attractions:", err);
    return () => {};
  }
}

/**
 * Real-time subscription to FAQs in Firestore
 */
export function subscribeToFAQs(callback: (faqs: FAQItem[]) => void): () => void {
  if (typeof window === "undefined" || !db || !isFirebaseConfigured) {
    return () => {};
  }
  try {
    const q = query(collection(db, "faqs"), orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as FAQItem)
          );
          callback(list);
        }
      },
      (err) => {
        console.warn("Realtime faqs listener warning:", err);
      }
    );
    return unsub;
  } catch (err) {
    console.warn("Failed to subscribe to FAQs:", err);
    return () => {};
  }
}

export { app, db, auth, storage, isFirebaseConfigured };
