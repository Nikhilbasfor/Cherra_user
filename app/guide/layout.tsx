import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sightseeing in Cherrapunji | Waterfalls, Living Root Bridges & Caves Guide",
  description:
    "Complete expedition guide to Cherrapunji (Sohra), Meghalaya. Explore Nohkalikai Falls, Double Decker Living Root Bridge, Mawsmai Cave, and Seven Sisters Falls.",
  keywords: [
    "sightseeing in cherrapunji",
    "cherrapunji waterfalls",
    "living root bridge cherrapunji",
    "nohkalikai falls",
    "mawsmai cave sohra",
    "places to visit in cherrapunji",
    "cherrapunji tourist spots",
  ],
  alternates: {
    canonical: "https://resortsincherrapunji.com/guide",
  },
  openGraph: {
    title: "Sightseeing in Cherrapunji | Complete Expedition Guide",
    description:
      "Explore Nohkalikai Falls, Double Decker Living Root Bridge, and misty canyons in Cherrapunji.",
    url: "https://resortsincherrapunji.com/guide",
    type: "website",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
