import HomePageClient from "@/components/HomePageClient";
import { dbGetStats, dbGetHotels, dbGetAttractions, dbGetFAQs } from "@/lib/db";
import { CHERRAPUNJI_HOTELS, CHERRAPUNJI_ATTRACTIONS, INITIAL_FAQS, INITIAL_STATS } from "@/lib/mockData";
import { SiteStats, Hotel, Attraction, FAQItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let stats: SiteStats = INITIAL_STATS;
  let hotels: Hotel[] = CHERRAPUNJI_HOTELS;
  let attractions: Attraction[] = CHERRAPUNJI_ATTRACTIONS;
  let faqs: FAQItem[] = INITIAL_FAQS;

  try {
    const [dbStats, dbHotels, dbAttractions, dbFaqs] = await Promise.all([
      dbGetStats(),
      dbGetHotels(),
      dbGetAttractions(),
      dbGetFAQs(),
    ]);
    if (dbStats) stats = dbStats;
    if (dbHotels && dbHotels.length > 0) hotels = dbHotels;
    if (dbAttractions && dbAttractions.length > 0) attractions = dbAttractions;
    if (dbFaqs && dbFaqs.length > 0) faqs = dbFaqs;
  } catch (err) {
    console.warn("SSR page data fetch fallback:", err);
  }

  // Automatically derive verifiedStays from currently present hotels
  const liveVerifiedStays =
    hotels && hotels.length > 0 ? `${hotels.length}+` : (stats.verifiedStays || "6+");
  stats = {
    ...stats,
    verifiedStays: liveVerifiedStays,
  };

  return (
    <HomePageClient
      initialStats={stats}
      initialHotels={hotels}
      initialAttractions={attractions}
      initialFaqs={faqs}
    />
  );
}
