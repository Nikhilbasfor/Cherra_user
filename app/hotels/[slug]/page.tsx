import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHotelBySlug, getAllHotels } from "@/lib/firebase";
import HotelDetailClient from "@/components/HotelDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    return {
      title: "Hotel Not Found | CherraStays",
      description: "The requested hotel in Cherrapunji could not be found.",
    };
  }

  const title = `${hotel.name} Cherrapunji | Rates from ₹${hotel.pricePerNight} & Direct Booking`;
  const description = `Book ${hotel.name} in ${hotel.area}, Cherrapunji (Sohra). ${hotel.starRating}★ hotel with verified guest rating of ${hotel.rating}/5. Best tariffs, canyon views & direct booking.`;

  return {
    title,
    description,
    keywords: [
      hotel.name,
      `${hotel.name} cherrapunji`,
      `hotels in ${hotel.area}`,
      "cherrapunji resorts",
      "sohra stays",
      `${hotel.starRating} star hotel cherrapunji`,
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: hotel.images[0],
          width: 1200,
          height: 630,
          alt: hotel.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [hotel.images[0]],
    },
  };
}

// Generate static params for fast SSG pre-rendering
export async function generateStaticParams() {
  const hotels = await getAllHotels();
  return hotels.map((h) => ({
    slug: h.slug,
  }));
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  // Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    image: hotel.images,
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.starRating,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewsCount,
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: `₹${hotel.pricePerNight} - ₹${hotel.rooms[hotel.rooms.length - 1]?.price || hotel.pricePerNight}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: "Cherrapunji",
      addressRegion: "Meghalaya",
      postalCode: "793108",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    },
    amenityFeature: hotel.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
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
        item: "https://cherrapunjistays.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hotels in Cherrapunji",
        item: "https://cherrapunjistays.com/hotels",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hotel.name,
        item: `https://cherrapunjistays.com/hotels/${hotel.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HotelDetailClient hotel={hotel} />
    </>
  );
}
