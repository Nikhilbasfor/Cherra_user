import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHotelBySlug, getAllHotels } from "@/lib/firebase";
import HotelDetailClient from "@/components/HotelDetailClient";
import HotelsCatalogClient from "@/components/HotelsCatalogClient";
import {
  CHERRAPUNJI_TRAVEL_CATEGORIES,
  getCategoryBySlug,
  getStarRatingFromSlug,
  getStarSlugFromRating,
} from "@/lib/categories";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Dynamic SEO Metadata Generator for both /hotels/[category] and /hotels/[category]/[slug]
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resortsincherrapunji.com";

  if (!slug || slug.length === 0 || slug.length > 2) {
    return {
      title: "Hotels in Cherrapunji | CherraStays",
      description: "Explore verified resorts and hotels in Cherrapunji.",
    };
  }

  // Case 1: Single segment: could be a Star/Category catalog OR a direct hotel slug
  if (slug.length === 1) {
    const starRating = getStarRatingFromSlug(slug[0]);
    const category = getCategoryBySlug(slug[0]);

    // Sub-case 1A: Star category or travel category catalog page
    if (starRating !== null || category) {
      const title = category
        ? `${category.title} | CherraStays`
        : `Best ${starRating} Star Resorts in Cherrapunji | Direct Rates`;
      const description =
        category?.description ||
        `Explore verified ${starRating}-star resorts in Cherrapunji with canyon views, luxury suites, and verified direct tariffs.`;
      const keywords = category?.targetKeywords || [
        `best ${starRating} star hotels in cherrapunji`,
        `best ${starRating} star resorts in cherrapunji`,
        `${starRating} star hotels sohra`,
        `${starRating} star resorts in cherrapunji`,
        "cherrapunji stays",
      ];

      return {
        title,
        description,
        keywords,
        alternates: {
          canonical: `${baseUrl}/hotels/${slug[0]}`,
        },
        openGraph: {
          title,
          description,
          url: `${baseUrl}/hotels/${slug[0]}`,
          type: "website",
        },
      };
    }

    // Sub-case 1B: Direct hotel slug (/hotels/[slug])
    const hotel = await getHotelBySlug(slug[0]);
    if (!hotel) {
      return {
        title: "Stay Not Found | CherraStays",
        description: "The requested hotel in Cherrapunji could not be found.",
      };
    }

    return createHotelMetadata(hotel, `${baseUrl}/hotels/${hotel.slug}`);
  }

  // Case 2: Two segments: /hotels/[category]/[hotel-slug]
  if (slug.length === 2) {
    const hotel = await getHotelBySlug(slug[1]);
    if (!hotel) {
      return {
        title: "Stay Not Found | CherraStays",
        description: "The requested hotel in Cherrapunji could not be found.",
      };
    }

    const starRating = getStarRatingFromSlug(slug[0]);
    const category = getCategoryBySlug(slug[0]);
    const parentCategoryName = starRating
      ? `${starRating} Star Resorts`
      : category?.shortName || category?.name || slug[0];

    const targetUrl = `${baseUrl}/hotels/${hotel.slug}`;
    const hotelMeta = createHotelMetadata(hotel, targetUrl);

    return {
      ...hotelMeta,
      title: `${hotel.name} Cherrapunji (${parentCategoryName}) | Rates from ₹${hotel.pricePerNight}`,
    };
  }

  return {
    title: "Hotels in Cherrapunji | CherraStays",
  };
}

function createHotelMetadata(hotel: any, canonicalUrl: string): Metadata {
  const hotelCategories = (hotel.categories || [])
    .map((cSlug: string) => CHERRAPUNJI_TRAVEL_CATEGORIES.find((tc) => tc.slug === cSlug)?.name)
    .filter(Boolean);

  const categoryPhrase =
    hotelCategories.length > 0 ? ` | Best ${hotelCategories.slice(0, 2).join(" & ")}` : "";
  const title = `${hotel.name} Cherrapunji${categoryPhrase} | Rates from ₹${hotel.pricePerNight}`;

  const keywordsList = Array.from(
    new Set([
      hotel.name,
      `${hotel.name} cherrapunji`,
      `${hotel.name} sohra`,
      `hotels in ${hotel.area}`,
      "cherrapunji resorts",
      "sohra stays",
      `${hotel.starRating} star hotel cherrapunji`,
      ...(hotel.seoKeywords || []),
      ...(hotel.categories || []).flatMap((cSlug: string) => {
        const tc = CHERRAPUNJI_TRAVEL_CATEGORIES.find((cat) => cat.slug === cSlug);
        return tc ? tc.targetKeywords : [];
      }),
    ])
  );

  const description = `Book ${hotel.name} in ${hotel.area}, Cherrapunji (Sohra). ${
    hotelCategories.length > 0 ? `Ideal for ${hotelCategories.join(", ")}. ` : ""
  }${hotel.starRating}★ hotel with verified guest rating of ${
    hotel.rating
  }/5. Best tariffs, canyon views & direct WhatsApp booking.`;

  return {
    title,
    description,
    keywords: keywordsList,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

// Generate static params for build SSG pre-rendering
export async function generateStaticParams() {
  const hotels = await getAllHotels();
  const starSlugs = [
    "5-star-resorts",
    "4-star-resorts",
    "3-star-resorts",
    "2-star-stays",
    "1-star-stays",
    "5-star-resorts-cherrapunji",
    "4-star-resorts-cherrapunji",
    "3-star-resorts-cherrapunji",
    "2-star-budget-stays-cherrapunji",
    "1-star-backpacker-stays-cherrapunji",
  ];

  const params: { slug: string[] }[] = [];

  // 1. Star category catalog pages: /hotels/[star-category]
  starSlugs.forEach((s) => {
    params.push({ slug: [s] });
  });

  // 2. Travel category catalog pages: /hotels/[category]
  CHERRAPUNJI_TRAVEL_CATEGORIES.forEach((cat) => {
    params.push({ slug: [cat.slug] });
  });

  // 3. Direct hotel detail pages: /hotels/[hotel-slug]
  hotels.forEach((hotel) => {
    params.push({ slug: [hotel.slug] });
  });

  // 4. Star-nested hotel detail pages: /hotels/[star-slug]/[hotel-slug]
  hotels.forEach((hotel) => {
    const starSlug = getStarSlugFromRating(hotel.starRating);
    params.push({ slug: [starSlug, hotel.slug] });
  });

  return params;
}

export default async function CatchAllHotelsPage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://resortsincherrapunji.com";

  if (!slug || slug.length === 0 || slug.length > 2) {
    notFound();
  }

  // Case 1: Single segment: either a Category Catalog or direct Hotel page
  if (slug.length === 1) {
    const starRating = getStarRatingFromSlug(slug[0]);
    const category = getCategoryBySlug(slug[0]);

    // Sub-case 1A: It is a star category or travel category catalog!
    if (starRating !== null || category) {
      const activeStars = starRating !== null ? starRating : category?.starFilter || null;
      const jsonLd = {
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
            name: category?.name || `${activeStars} Star Resorts`,
            item: `${baseUrl}/hotels/${slug[0]}`,
          },
        ],
      };

      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center text-emerald-700 font-semibold text-sm">
                Loading Cherrapunji Stays...
              </div>
            }
          >
            <HotelsCatalogClient
              initialStarRating={activeStars}
              initialStarSlug={slug[0]}
              category={category || null}
            />
          </Suspense>
        </>
      );
    }

    // Sub-case 1B: It is a hotel detail page (/hotels/[slug])
    const hotel = await getHotelBySlug(slug[0]);
    if (!hotel) {
      notFound();
    }

    return renderHotelDetail(hotel, baseUrl, `/hotels/${hotel.slug}`);
  }

  // Case 2: Two segments: /hotels/[category]/[hotel-slug]
  if (slug.length === 2) {
    const hotel = await getHotelBySlug(slug[1]);
    if (!hotel) {
      notFound();
    }

    const starRating = getStarRatingFromSlug(slug[0]);
    const category = getCategoryBySlug(slug[0]);
    const parentCategoryName = starRating
      ? `${starRating} Star Resorts`
      : category?.shortName || category?.name || slug[0];

    return renderHotelDetail(
      hotel,
      baseUrl,
      `/hotels/${slug[0]}/${hotel.slug}`,
      {
        slug: slug[0],
        name: parentCategoryName,
      }
    );
  }

  notFound();
}

function renderHotelDetail(
  hotel: any,
  baseUrl: string,
  pagePath: string,
  parentCategory?: { slug: string; name: string }
) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    url: `${baseUrl}${pagePath}`,
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
    priceRange: `₹${hotel.pricePerNight} - ₹${
      hotel.rooms?.[hotel.rooms.length - 1]?.price || hotel.pricePerNight
    }`,
    checkinTime: hotel.checkInTime || "14:00",
    checkoutTime: hotel.checkOutTime || "11:00",
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
    amenityFeature: hotel.amenities.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    keywords: [
      hotel.name,
      ...(hotel.seoKeywords || []),
      ...(hotel.categories || []).map((c: string) => c.replace(/-/g, " ")),
    ].join(", "),
  };

  const breadcrumbsList = [
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
  ];

  if (parentCategory) {
    breadcrumbsList.push({
      "@type": "ListItem",
      position: 3,
      name: parentCategory.name,
      item: `${baseUrl}/hotels/${parentCategory.slug}`,
    });
    breadcrumbsList.push({
      "@type": "ListItem",
      position: 4,
      name: hotel.name,
      item: `${baseUrl}${pagePath}`,
    });
  } else {
    breadcrumbsList.push({
      "@type": "ListItem",
      position: 3,
      name: hotel.name,
      item: `${baseUrl}${pagePath}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbsList,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HotelDetailClient hotel={hotel} parentCategory={parentCategory} />
    </>
  );
}
