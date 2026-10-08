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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resortsincherrapunji.com";

  // Google WebSite & Sitelinks Searchbox Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CherraStays - Resorts in Cherrapunji",
    alternateName: ["Resorts in Cherrapunji", "Hotels in Cherrapunji", "CherraStays"],
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/hotels?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Google TravelAgency / Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "CherraStays",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: "Verified nature retreats, luxury cliffside resorts, and authentic homestays in Cherrapunji (Sohra), Meghalaya.",
    telephone: "+91-9366767512",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cherrapunji",
      addressRegion: "Meghalaya",
      postalCode: "793108",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2986",
      longitude: "91.7378",
    },
    priceRange: "₹₹ - ₹₹₹₹",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Cherrapunji, Sohra, Meghalaya",
    },
  };

  // Google FAQ Schema for Homepage Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient
        initialStats={stats}
        initialHotels={hotels}
        initialAttractions={attractions}
        initialFaqs={faqs}
      />
    </>
  );
}
