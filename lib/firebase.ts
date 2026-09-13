import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
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

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn("Firebase initialization skipped or failed:", error);
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

/**
 * Fetch all hotels from Firestore or local backend
 */
export async function getAllHotels(): Promise<Hotel[]> {
  if (db && isFirebaseConfigured) {
    try {
      const hotelsCol = collection(db, "hotels");
      const q = query(hotelsCol, orderBy("rating", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Hotel, "id">),
        }));
      } else {
        // Auto-seed Firestore so user's new Firebase project isn't empty!
        Promise.all(CHERRAPUNJI_HOTELS.map((h) => setDoc(doc(db!, "hotels", h.id), h))).catch(console.warn);
        return CHERRAPUNJI_HOTELS;
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
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // fallback
    }
  } else {
    // Server-side
    try {
      const { dbGetHotels } = await import("./db");
      return await dbGetHotels();
    } catch {
      // fallback
    }
  }

  return CHERRAPUNJI_HOTELS;
}

/**
 * Fetch a single hotel by its slug
 */
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const all = await getAllHotels();
  const found = all.find((h) => h.slug === slug || h.id === slug);
  return found || null;
}

/**
 * Submit an inquiry / booking request (Writes directly to Firestore and local API)
 */
export async function submitInquiry(lead: Omit<InquiryLead, "id" | "createdAt" | "status">): Promise<{ success: boolean; id?: string }> {
  let docId = "lead-" + Date.now();

  if (db && isFirebaseConfigured) {
    try {
      const inquiriesCol = collection(db, "inquiries");
      const docRef = await withTimeout(
        addDoc(inquiriesCol, {
          ...lead,
          status: "new",
          createdAt: serverTimestamp(),
        }),
        2500
      );
      docId = docRef.id;
    } catch (err) {
      console.error("Failed to submit inquiry to Firestore:", err);
    }
  }

  // Also post to local backend API so Admin panel gets it immediately
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, id: docId }),
      });
    } catch (err) {
      console.warn("Local API inquiry post fallback:", err);
    }
  }

  return { success: true, id: docId };
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
          const list = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as Hotel)
          );
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

export { app, db, auth, isFirebaseConfigured };
