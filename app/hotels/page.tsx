import React, { Suspense } from "react";
import type { Metadata } from "next";
import HotelsCatalogClient from "@/components/HotelsCatalogClient";

export const metadata: Metadata = {
  title: "Hotels and Resorts in Cherrapunji (Sohra) | Verified Direct Rates",
  description:
    "Explore luxury 5-star resorts, cliffside suites, valley-view cottages, and budget homestays in Cherrapunji. Book direct with zero middleman commissions.",
  keywords: [
    "hotels in cherrapunji",
    "resorts in cherrapunji",
    "cherrapunji stays",
    "sohra hotels",
    "5 star resorts cherrapunji",
    "4 star resorts cherrapunji",
    "waterfall view hotels cherrapunji",
  ],
  alternates: {
    canonical: "https://resortsincherrapunji.com/hotels",
  },
};

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center text-emerald-700 font-semibold text-sm">
          Loading Cherrapunji Stays...
        </div>
      }
    >
      <HotelsCatalogClient />
    </Suspense>
  );
}
