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
} from "firebase/firestore";
import { Hotel, InquiryLead } from "./types";
import { CHERRAPUNJI_HOTELS } from "./mockData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
    }
  } catch (error) {
    console.warn("Firebase initialization skipped or failed:", error);
  }
}

/**
 * Fetch all hotels from Firestore or local backend
 */
export async function getAllHotels(): Promise<Hotel[]> {
  if (db && isFirebaseConfigured) {
    try {
      const hotelsCol = collection(db, "hotels");
      const q = query(hotelsCol, orderBy("rating", "desc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Hotel, "id">),
        }));
      } else {
        // Auto-seed Firestore so user's new Firebase project isn't empty!
        for (const h of CHERRAPUNJI_HOTELS) {
          await setDoc(doc(db, "hotels", h.id), h);
        }
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
      const docRef = await addDoc(inquiriesCol, {
        ...lead,
        status: "new",
        createdAt: serverTimestamp(),
      });
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

export { app, db, isFirebaseConfigured };
