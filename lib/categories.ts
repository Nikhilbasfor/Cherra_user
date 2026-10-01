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
];

export function getCategoryBySlug(slug: string): TravelCategory | undefined {
  return CHERRAPUNJI_TRAVEL_CATEGORIES.find((c) => c.slug === slug);
}
