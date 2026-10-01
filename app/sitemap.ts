import { MetadataRoute } from "next";
import { getAllHotels } from "@/lib/firebase";
import { CHERRAPUNJI_TRAVEL_CATEGORIES } from "@/lib/categories";
import { Hotel } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrapunjistays.com";
  let hotels: Hotel[] = [];
  try {
    hotels = await getAllHotels();
  } catch (err) {
    console.warn("Sitemap: error fetching hotels:", err);
  }

  // 1. Individual Hotel Landing Pages
  const hotelUrls: MetadataRoute.Sitemap = hotels.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 2. High-Intent Programmatic Category Collection Landing Pages
  const categoryUrls: MetadataRoute.Sitemap = CHERRAPUNJI_TRAVEL_CATEGORIES.map((category) => ({
    url: `${baseUrl}/collection/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 3. Core Static URLs
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hotels`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...hotelUrls];
}
