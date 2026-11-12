import React from "react";
import type { Metadata } from "next";
import HotelsCatalogClient from "@/components/HotelsCatalogClient";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Best Resorts & Hotels in Cherrapunji (Sohra) | 2026 Direct Rates",
  description:
    "Explore luxury 5-star resorts, cliffside suites, valley-view cottages, and budget homestays in Cherrapunji. Book direct with zero middleman commissions.",
  keywords: [
    "resorts in cherrapunji",
    "hotels in cherrapunji",
    "cherrapunji hotels",
    "best resorts in cherrapunji",
    "cherrapunji stays",
    "sohra hotels",
    "sohra resorts",
    "luxury resorts in cherrapunji",
    "5 star resorts cherrapunji",
    "4 star resorts cherrapunji",
    "3 star hotels in cherrapunji",
    "waterfall view hotels cherrapunji",
    "cliff view resorts sohra",
    "cherrapunji homestays",
  ],
  alternates: {
    canonical: "https://resortsincherrapunji.com/hotels",
  },
  openGraph: {
    title: "Best Resorts & Hotels in Cherrapunji (Sohra) | 2026 Direct Rates",
    description:
      "Explore luxury 5-star resorts, cliffside suites, valley-view cottages, and budget homestays in Cherrapunji. Verified direct rates.",
    url: "https://resortsincherrapunji.com/hotels",
    type: "website",
  },
};

export default function HotelsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resortsincherrapunji.com";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hotels & Resorts in Cherrapunji",
        item: `${baseUrl}/hotels`,
      },
    ],
  };

  const activeHotels = CHERRAPUNJI_HOTELS.filter((h) => h.status !== "inactive");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified Resorts & Hotels in Cherrapunji (Sohra)",
    numberOfItems: activeHotels.length,
    itemListElement: activeHotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hotel.name,
      url: `${baseUrl}/hotels/${hotel.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HotelsCatalogClient />
    </>
  );
}
