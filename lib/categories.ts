export interface TravelCategory {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  title: string;
  description: string;
  targetKeywords: string[];
  heroBadge: string;
  iconName: string;
  faqs: { question: string; answer: string }[];
  starFilter?: number;
}

export const CHERRAPUNJI_TRAVEL_CATEGORIES: TravelCategory[] = [
  {
    id: "honeymoon-places-cherrapunji",
    name: "Honeymoon & Romantic Getaways",
    shortName: "Honeymoon",
    slug: "honeymoon-places-cherrapunji",
    title: "Best Honeymoon Places & Romantic Resorts in Cherrapunji",
    description:
      "Perched high above mystical cloud-filled gorges, these romantic sanctuaries and luxury suites in Cherrapunji feature private balconies, panoramic canyon views, candlelight dining, and tranquil mountain ambiance for couples.",
    targetKeywords: [
      "best honeymoon places in cherrapunji",
      "romantic resorts in cherrapunji",
      "couples stay sohra",
      "honeymoon suite cherrapunji",
      "romantic hotels in meghalaya",
    ],
    heroBadge: "Romantic Getaways & Suites",
    iconName: "Heart",
    faqs: [
      {
        question: "Which are the best resorts for a honeymoon in Cherrapunji?",
        answer:
          "Polo Orchid Resort and Kutmadan Resort are renowned for honeymooners, offering secluded cliff-edge cottages overlooking Nohsngithiang Falls and the Bangladesh plains.",
      },
      {
        question: "Do Cherrapunji honeymoon resorts offer candlelight dinners or private balconies?",
        answer:
          "Yes. Many boutique suites feature private sun-decks facing mist-covered gorges and can arrange candlelight dinners with bonfire setups upon request.",
      },
    ],
  },
  {
    id: "family-stays-cherrapunji",
    name: "Family & Kid-Friendly Stays",
    shortName: "Family Stays",
    slug: "family-stays-cherrapunji",
    title: "Best Family Stays & Cottages in Cherrapunji",
    description:
      "Spacious multi-bed suites, private pine cottages, safe open lawns, and family dining. Find verified Cherrapunji properties equipped with heaters, 24/7 hot water, and close proximity to waterfalls.",
    targetKeywords: [
      "family stay in cherrapunji",
      "family cottage in cherrapunji",
      "family friendly hotels sohra",
      "best place to stay in cherrapunji with family",
      "kid friendly resorts cherrapunji",
    ],
    heroBadge: "Family Friendly & Cottages",
    iconName: "Users",
    faqs: [
      {
        question: "Are there family rooms with extra beds in Cherrapunji?",
        answer:
          "Yes. Stays like Jiva Resort, Cherrapunjee Holiday Resort, and Sa-I-Mika Park offer dedicated family suites with interconnecting rooms, double queen beds, and safe lawn spaces.",
      },
      {
        question: "Are hotels in Cherrapunji safe for children and senior citizens?",
        answer:
          "Cherrapunji is one of the safest tourist destinations in India with gentle Khasi hospitality. Verified properties have drive-in parking, zero steep staircase barriers, and 24/7 hot geyser water.",
      },
    ],
  },
  {
    id: "waterfall-cliff-view-hotels-cherrapunji",
    name: "Cliffside & Waterfall Views",
    shortName: "Waterfall & Cliff View",
    slug: "waterfall-cliff-view-hotels-cherrapunji",
    title: "Hotels with Waterfall & Cliffside Views in Cherrapunji",
    description:
      "Wake up directly to roaring cascades and sheer limestone canyon edges. These spectacular cliff-edge properties overlook Seven Sisters Falls, Nohkalikai gorge, and the rolling mist of the Sohra plateau.",
    targetKeywords: [
      "hotels with waterfall view cherrapunji",
      "cliff view resort cherrapunji",
      "hotels near seven sisters falls",
      "hotels near nohkalikai falls sohra",
      "canyon view stays cherrapunji",
    ],
    heroBadge: "Direct Canyon & Waterfall Vistas",
    iconName: "Mountain",
    faqs: [
      {
        question: "Can I see waterfalls directly from my hotel balcony in Cherrapunji?",
        answer:
          "Yes. Cliffside properties located along Nohsngithiang ridge and Kutmadan rim offer direct panoramic views of Seven Sisters Falls and deep river valleys.",
      },
      {
        question: "Which season offers the best waterfall views from Cherrapunji hotels?",
        answer:
          "From June through September, the monsoons fill the waterfalls with roaring power. October to December offers clear, sunny blue skies with crisp canyon visibility.",
      },
    ],
  },
  {
    id: "luxury-resorts-cherrapunji",
    name: "Luxury 4 & 5-Star Resorts",
    shortName: "Luxury Resorts",
    slug: "luxury-resorts-cherrapunji",
    title: "Luxury Resorts in Cherrapunji | 4-Star & 5-Star Stays",
    description:
      "Indulge in premier mountain hospitality. Featuring infinity pools, fine multi-cuisine restaurants, premium spa treatments, and signature wooden architecture in the hills of Meghalaya.",
    targetKeywords: [
      "luxury resort in cherrapunji",
      "5 star hotel cherrapunji",
      "4 star resort sohra",
      "best luxury resorts meghalaya",
      "resorts with swimming pool cherrapunji",
    ],
    heroBadge: "Elite Comfort & Premium Dining",
    iconName: "Sparkles",
    faqs: [
      {
        question: "What luxury amenities are available in Cherrapunji resorts?",
        answer:
          "Top luxury resorts feature infinity edge plunge pools, heated suites, multi-cuisine restaurants serving Khasi and Indian delicacies, and dedicated chauffeur concierge desks.",
      },
      {
        question: "How do I secure the best direct tariff for Cherrapunji luxury resorts?",
        answer:
          "By booking directly through CherraStays, you avoid 15-25% OTA commissions and receive direct front-desk tariffs with instant WhatsApp concierge confirmation.",
      },
    ],
  },
  {
    id: "budget-homestays-cherrapunji",
    name: "Budget & Backpacker Homestays",
    shortName: "Budget Homestays",
    slug: "budget-homestays-cherrapunji",
    title: "Best Budget Homestays & Backpacker Stays in Cherrapunji",
    description:
      "Clean, comfortable, and pocket-friendly accommodations with warm local Khasi families. Enjoy home-cooked meals, peaceful surroundings, and true Meghalayan cultural warmth under ₹2,500/night.",
    targetKeywords: [
      "budget hotel in cherrapunji",
      "cheap homestay in cherrapunji",
      "homestays in cherrapunji under 2000",
      "backpacker hostel sohra",
      "budget stay cherrapunji",
    ],
    heroBadge: "Affordable & Authentic Stays",
    iconName: "Wallet",
    faqs: [
      {
        question: "What is the average cost of a budget homestay in Cherrapunji?",
        answer:
          "Authentic, clean budget homestays typically range from ₹1,500 to ₹2,500 per night, including private attached bathrooms with geysers and home-cooked breakfasts.",
      },
      {
        question: "Are budget homestays in Cherrapunji safe for solo travelers?",
        answer:
          "Meghalaya is globally renowned for its respectful, matrilineal culture. Local village homestays are exceptionally safe for solo female and backpacker travelers.",
      },
    ],
  },
  {
    id: "nature-pine-cottages-cherrapunji",
    name: "Nature & Boutique Pine Cottages",
    shortName: "Pine Cottages",
    slug: "nature-pine-cottages-cherrapunji",
    title: "Nature & Boutique Pine Cottages in Cherrapunji",
    description:
      "Immerse yourself in fragrant pine groves and natural mountain streams. Rustic stone architecture, warm wooden interiors, and private lawn gardens for peace and tranquility.",
    targetKeywords: [
      "pine cottages cherrapunji",
      "nature cottages sohra",
      "wooden cottages cherrapunji",
      "eco resort cherrapunji",
      "peaceful stays sohra",
    ],
    heroBadge: "Pine Woods & Stone Architecture",
    iconName: "Trees",
    faqs: [
      {
        question: "Do pine cottages have heating facilities?",
        answer:
          "Yes. High-grade pine cottages and boutique stays provide room heaters, thick fleece blankets, and bonfire hearths for crisp mountain evenings.",
      },
      {
        question: "Where are the nature cottages located in Cherrapunji?",
        answer:
          "Most are nestled on the outskirts of Sohra Town along scenic streams and private forest acres, such as Sa-I-Mika Park and Laitkynsew ridge.",
      },
    ],
  },
  {
    id: "living-root-bridge-trek-stays-cherrapunji",
    name: "Trekking & Adventure Hub",
    shortName: "Trekker Stays",
    slug: "living-root-bridge-trek-stays-cherrapunji",
    title: "Hotels & Stays Near Double Decker Living Root Bridge",
    description:
      "Strategic basecamps for hikers and adventure enthusiasts exploring the 3,500-step trek down to Nongriat, Rainbow Falls, and Wei Sawdong. Enjoy early starts and restful recoveries.",
    targetKeywords: [
      "stay near double decker living root bridge",
      "hotels near tyrna trek",
      "trekking stay sohra",
      "nongriat trek hotel",
      "adventure stays cherrapunji",
    ],
    heroBadge: "Trailhead & Adventure Bases",
    iconName: "Compass",
    faqs: [
      {
        question: "Which hotel is closest to the Double Decker Root Bridge starting point?",
        answer:
          "Cherrapunjee Holiday Resort in Laitkynsew is the pioneer hotel closest to the Tyrna village trailhead, providing trekking guides and bamboo walking sticks.",
      },
      {
        question: "How long is the trek to the Double Decker Living Root Bridge?",
        answer:
          "The trek descends approximately 3,500 stone steps from Tyrna to Nongriat, taking 2 to 2.5 hours down and 2.5 to 3.5 hours back up.",
      },
    ],
  },
  {
    id: "5-star-resorts-cherrapunji",
    name: "5 Star Resorts in Cherrapunji",
    shortName: "5 Star Resorts",
    slug: "5-star-resorts-cherrapunji",
    title: "Best 5 Star Resorts in Cherrapunji (2026 Direct Rates)",
    description:
      "Experience world-class luxury perched on dramatic cliff edges. Enjoy private infinity pools, signature dining with panoramic canyon views, luxury heated log cabins, and five-star Khasi mountain hospitality in Cherrapunji (Sohra).",
    targetKeywords: [
      "best 5 star resorts in cherrapunji",
      "5 star hotels in cherra",
      "5 star resort cherrapunji",
      "luxury 5 star resorts sohra",
      "5 star hotel cherrapunji",
      "top luxury stays cherrapunji",
    ],
    heroBadge: "5 Star Luxury Resorts",
    iconName: "Star",
    starFilter: 5,
    faqs: [
      {
        question: "Are there 5-star luxury resorts in Cherrapunji?",
        answer:
          "Yes, Cherrapunji features world-class luxury retreats like Polo Orchid Resort with cliffside heated log cabins, private infinity pools overlooking Seven Sisters Falls, and fine dining.",
      },
      {
        question: "How do I get direct front-desk tariffs for 5-star resorts in Cherra?",
        answer:
          "Booking through CherraStays connects you directly to the resort's reservation management with zero middleman commissions and instant WhatsApp booking confirmation.",
      },
    ],
  },
  {
    id: "4-star-resorts-cherrapunji",
    name: "4 Star Resorts in Cherrapunji",
    shortName: "4 Star Resorts",
    slug: "4-star-resorts-cherrapunji",
    title: "Best 4 Star Resorts in Cherrapunji (2026 Direct Rates)",
    description:
      "Indulge in premium 4-star comfort amidst whispering pine groves and rolling mountain mist. Features modern soundproof cottages, multi-cuisine dining, landscaped rock gardens, and private forest trails.",
    targetKeywords: [
      "best 4 star resorts in cherrapunji",
      "4 star hotels in cherra",
      "4 star resort cherrapunji",
      "premium 4 star stays sohra",
      "4 star hotel cherrapunji",
    ],
    heroBadge: "4 Star Premium Resorts",
    iconName: "Star",
    starFilter: 4,
    faqs: [
      {
        question: "What amenities do 4-star resorts in Cherrapunji provide?",
        answer:
          "Properties like Jiva Resort feature spacious wooden cottages with heated bathrooms, landscaped rock gardens, 24/7 hot geyser water, multi-cuisine dining, and private forest walks.",
      },
      {
        question: "Is hot breakfast included in 4-star Cherrapunji bookings?",
        answer:
          "Yes, our partner 4-star resorts include complimentary hot breakfast spreads with organic Khasi, Indian, and Continental choices.",
      },
    ],
  },
  {
    id: "3-star-resorts-cherrapunji",
    name: "3 Star Resorts & Hotels in Cherrapunji",
    shortName: "3 Star Resorts",
    slug: "3-star-resorts-cherrapunji",
    title: "Best 3 Star Resorts & Hotels in Cherrapunji (2026 Direct Rates)",
    description:
      "Highly rated 3-star boutique resorts, edge-of-the-world cliff cottages, and eco-lodges offering breathtaking canyon views, campfire nights, and warm Khasi hospitality at balanced, honest rates.",
    targetKeywords: [
      "best 3 star resorts in cherrapunji",
      "3 star hotels in cherrapunji",
      "3 star hotels in cherra",
      "3 star resort sohra",
      "comfort stays cherrapunji",
    ],
    heroBadge: "3 Star Comfort Stays",
    iconName: "Star",
    starFilter: 3,
    faqs: [
      {
        question: "Which are the top-rated 3-star resorts in Cherrapunji?",
        answer:
          "Kutmadan Resort, Cherrapunjee Holiday Resort, and Sa-I-Mika Park & Cottages are renowned 3-star properties celebrated for their canyon vistas and nature immersion.",
      },
      {
        question: "What is the typical nightly tariff for 3-star hotels in Sohra?",
        answer:
          "Direct tariffs typically range between ₹3,500 and ₹5,000 per night, providing great value with 24/7 hot water geysers and private balconies.",
      },
    ],
  },
  {
    id: "2-star-budget-stays-cherrapunji",
    name: "2 Star & Budget Stays in Cherrapunji",
    shortName: "2 Star Stays",
    slug: "2-star-budget-stays-cherrapunji",
    title: "Best 2 Star & Budget Stays in Cherrapunji (2026 Direct Rates)",
    description:
      "Spotlessly clean, comfortable, and centrally situated 2-star hotels and family guest houses within easy walking distance of central Sohra markets, cafes, and taxi stands.",
    targetKeywords: [
      "2 star hotels in cherrapunji",
      "2 star stays in cherra",
      "budget hotels cherrapunji",
      "clean cheap stays sohra",
      "sohra town hotels",
    ],
    heroBadge: "2 Star Budget Stays",
    iconName: "Star",
    starFilter: 2,
    faqs: [
      {
        question: "Are 2-star hotels in Cherrapunji clean and safe for families?",
        answer:
          "Yes, every 2-star property listed on CherraStays is physically inspected and features clean attached bathrooms, hot water geysers, and friendly local family management.",
      },
      {
        question: "Can 2-star hotels help arrange shared or private sightseeing cabs?",
        answer:
          "Yes, centrally located hotels like Sohra Plaza are steps from the Sohra market taxi stand and can coordinate direct local cab rates for sightseeing.",
      },
    ],
  },
  {
    id: "1-star-backpacker-stays-cherrapunji",
    name: "1 Star & Backpacker Stays in Cherrapunji",
    shortName: "1 Star Stays",
    slug: "1-star-backpacker-stays-cherrapunji",
    title: "Best 1 Star & Backpacker Stays in Cherrapunji (2026 Direct Rates)",
    description:
      "Honest, affordable village guest accommodations and backpacker rooms for solo hikers and adventure travelers exploring the canyons and living root bridges of Sohra.",
    targetKeywords: [
      "1 star hotels in cherrapunji",
      "backpacker stays cherra",
      "cheap rooms sohra",
      "hostel in cherrapunji",
      "trekker budget stay sohra",
    ],
    heroBadge: "1 Star Backpacker Stays",
    iconName: "Star",
    starFilter: 1,
    faqs: [
      {
        question: "Are 1-star stays suitable for solo trekkers in Cherrapunji?",
        answer:
          "Yes, they provide clean, secure, quiet lodging with hot water showers, ideal for backpackers spending all day hiking to remote waterfalls.",
      },
    ],
  },
];

export interface StarTabInfo {
  id: number;
  label: string;
  stars: number | null;
  slug: string | null;
}

export const STAR_TABS: StarTabInfo[] = [
  { id: 0, label: "All Stays", stars: null, slug: null },
  { id: 5, label: "5 Star Resorts", stars: 5, slug: "5-star-resorts" },
  { id: 4, label: "4 Star Resorts", stars: 4, slug: "4-star-resorts" },
  { id: 3, label: "3 Star Resorts", stars: 3, slug: "3-star-resorts" },
  { id: 2, label: "2 Star Stays", stars: 2, slug: "2-star-stays" },
  { id: 1, label: "1 Star Stays", stars: 1, slug: "1-star-stays" },
];

export function getStarRatingFromSlug(slug: string): number | null {
  const normalized = slug.toLowerCase();
  if (normalized === "5-star-resorts" || normalized === "5-star-resorts-cherrapunji" || normalized === "5-star" || normalized === "5-star-hotels") return 5;
  if (normalized === "4-star-resorts" || normalized === "4-star-resorts-cherrapunji" || normalized === "4-star" || normalized === "4-star-hotels") return 4;
  if (normalized === "3-star-resorts" || normalized === "3-star-resorts-cherrapunji" || normalized === "3-star" || normalized === "3-star-hotels") return 3;
  if (normalized === "2-star-stays" || normalized === "2-star-budget-stays-cherrapunji" || normalized === "2-star" || normalized === "2-star-hotels") return 2;
  if (normalized === "1-star-stays" || normalized === "1-star-backpacker-stays-cherrapunji" || normalized === "1-star" || normalized === "1-star-hotels") return 1;
  return null;
}

export function getStarSlugFromRating(rating: number): string {
  if (rating === 5) return "5-star-resorts";
  if (rating === 4) return "4-star-resorts";
  if (rating === 3) return "3-star-resorts";
  if (rating === 2) return "2-star-stays";
  if (rating === 1) return "1-star-stays";
  return "5-star-resorts";
}

export function getCategoryBySlug(slug: string): TravelCategory | undefined {
  const direct = CHERRAPUNJI_TRAVEL_CATEGORIES.find((c) => c.slug === slug);
  if (direct) return direct;
  const star = getStarRatingFromSlug(slug);
  if (star !== null) {
    return CHERRAPUNJI_TRAVEL_CATEGORIES.find((c) => c.starFilter === star);
  }
  return undefined;
}
