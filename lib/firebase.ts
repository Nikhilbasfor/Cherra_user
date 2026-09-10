import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
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
 * Fetch all hotels from Firestore, or fallback to mock data
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
      }
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local data:", err);
    }
  }
  return CHERRAPUNJI_HOTELS;
}

/**
 * Fetch a single hotel by its slug
 */
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const all = await getAllHotels();
  const found = all.find((h) => h.slug === slug);
  return found || null;
}

/**
 * Submit an inquiry / booking request (Writes directly to Firestore `inquiries`)
 */
export async function submitInquiry(lead: Omit<InquiryLead, "id" | "createdAt" | "status">): Promise<{ success: boolean; id?: string }> {
  if (db && isFirebaseConfigured) {
    try {
      const inquiriesCol = collection(db, "inquiries");
      const docRef = await addDoc(inquiriesCol, {
        ...lead,
        status: "new",
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error("Failed to submit inquiry to Firestore:", err);
    }
  }

  // Fallback simulation for offline/preview mode
  console.log("Mock lead recorded locally:", lead);
  return { success: true, id: "mock-lead-" + Date.now() };
}

export { app, db, isFirebaseConfigured };
