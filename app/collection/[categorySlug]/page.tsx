import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  MapPin,
  Heart,
  Users,
  Mountain,
  Wallet,
  Trees,
  ArrowRight,
  Star,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import InquiryModal from "@/components/InquiryModal";
import CollectionClient from "./CollectionClient";
import { getAllHotels } from "@/lib/firebase";
import { CHERRAPUNJI_HOTELS } from "@/lib/mockData";
import {
  CHERRAPUNJI_TRAVEL_CATEGORIES,
  getCategoryBySlug,
  TravelCategory,
} from "@/lib/categories";
import { Hotel } from "@/lib/types";

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateStaticParams() {
  return CHERRAPUNJI_TRAVEL_CATEGORIES.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Collection Not Found | CherraStays",
      description: "The requested Cherrapunji stay collection could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrapunjistays.com";
  const canonicalUrl = `${baseUrl}/collection/${category.slug}`;

  return {
    title: `${category.title} (2026 Direct Rates)`,
    description: `${category.description} View verified property rates, canyon views, guest ratings & WhatsApp booking.`,
    keywords: [
      ...category.targetKeywords,
      "cherrapunji hotels",
      "sohra stays",
      "meghalaya resort booking",
      "cherrapunji tourism",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.title} | CherraStays`,
      description: category.description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description: category.description,
    },
  };
}

export default async function CategoryCollectionPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  let allHotels: Hotel[] = CHERRAPUNJI_HOTELS;
  try {
    const dbHotels = await getAllHotels();
    if (dbHotels && dbHotels.length > 0) {
      allHotels = dbHotels;
    }
  } catch (err) {
    console.warn("Falling back to local hotel data:", err);
  }

  // Filter hotels belonging to this travel category (or relevant fallback)
  let matchedHotels = allHotels.filter(
    (h) => h.categories && h.categories.includes(category.slug)
  );

  // Fallback: If hotel category tags were not set yet, match by sensible criteria
  if (matchedHotels.length === 0) {
    if (category.slug.includes("honeymoon")) {
      matchedHotels = allHotels.filter(
        (h) =>
          h.starRating >= 3 ||
          h.tagline.toLowerCase().includes("cliff") ||
          h.tagline.toLowerCase().includes("valley")
      );
    } else if (category.slug.includes("family")) {
      matchedHotels = allHotels.filter((h) => h.rooms && h.rooms.length > 0);
    } else if (category.slug.includes("waterfall")) {
      matchedHotels = allHotels.filter(
        (h) =>
          h.amenities.some((a) => a.toLowerCase().includes("view") || a.toLowerCase().includes("falls")) ||
          h.tagline.toLowerCase().includes("cliff")
      );
    } else if (category.slug.includes("luxury")) {
      matchedHotels = allHotels.filter((h) => h.starRating >= 4);
    } else if (category.slug.includes("budget")) {
      matchedHotels = allHotels.filter((h) => h.pricePerNight <= 3500);
    } else if (category.slug.includes("cottage")) {
      matchedHotels = allHotels.filter(
        (h) =>
          h.name.toLowerCase().includes("cottage") ||
          h.description.toLowerCase().includes("cottage") ||
          h.description.toLowerCase().includes("pine")
      );
    } else if (category.slug.includes("root-bridge")) {
      matchedHotels = allHotels.filter((h) => h.area.toLowerCase().includes("laitkynsew") || h.pricePerNight <= 4500);
    } else {
      matchedHotels = allHotels;
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cherrapunjistays.com";

  // Google FAQ Schema for Rich Snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
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
        name: "Hotels in Cherrapunji",
        item: `${baseUrl}/hotels`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${baseUrl}/collection/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CollectionClient
        category={category}
        hotels={matchedHotels}
        allCategories={CHERRAPUNJI_TRAVEL_CATEGORIES}
      />
    </>
  );
}
