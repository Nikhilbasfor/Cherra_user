import { Hotel, Attraction, FAQItem, SiteStats, HotelReview } from "./types";

export const CHERRAPUNJI_HOTELS: Hotel[] = [];

export const CHERRAPUNJI_ATTRACTIONS: Attraction[] = [
  {
    id: "nohkalikai-falls",
    name: "Nohkalikai Falls",
    khasiName: "Ka Likai",
    category: "Waterfall",
    description:
      "India's tallest plunge waterfall (1,115 feet), cascading into a mesmerizing turquoise plunge pool surrounded by deep evergreen cliffs.",
    distanceFromSohra: "7.5 km",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    bestTime: "Monsoon & Post-Monsoon (June - Nov)",
  },
  {
    id: "double-decker-bridge",
    name: "Double Decker Living Root Bridge",
    khasiName: "Jingkieng Nongriat",
    category: "Living Root Bridge",
    description:
      "A 200-year-old biological marvel grown across the Umshiang river from the living roots of Ficus elastica trees in Nongriat village.",
    distanceFromSohra: "18 km (start from Tyrna + 3,500 steps trek)",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    bestTime: "September to May (Safe trekking)",
  },
  {
    id: "seven-sisters-falls",
    name: "Seven Sisters Falls",
    khasiName: "Nohsngithiang Falls",
    category: "Waterfall",
    description:
      "Seven segmented roaring waterfalls plunging down the limestone plateau cliffs facing Bangladesh, illuminated beautifully at sunset.",
    distanceFromSohra: "4 km",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    bestTime: "Peak Monsoon (July - Sept)",
  },
  {
    id: "mawsmai-cave",
    name: "Mawsmai Cave",
    khasiName: "Krem Mawsmai",
    category: "Caves",
    description:
      "An illuminated limestone cave system with ancient stalactites and stalagmites, giving visitors a thrilling spelunking adventure.",
    distanceFromSohra: "6 km",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    bestTime: "All Year Round",
  },
  {
    id: "wei-sawdong-falls",
    name: "Wei Sawdong Three-Tier Falls",
    khasiName: "Wei Sawdong",
    category: "Waterfall",
    description:
      "A breathtaking three-level stepped waterfall with crystal clear turquoise pools tucked within a pristine forest gorge.",
    distanceFromSohra: "14 km",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    bestTime: "September to April",
  },
];

export const CHERRAPUNJI_AREAS = [
  "All Areas",
  "Nohsngithiang",
  "Sohra Town",
  "Saitsohpen",
  "Laitkynsew",
  "Khliehshnong",
  "Mawkdok / Sohra Rim",
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is the best time to visit Cherrapunji (Sohra)?",
    answer:
      "Cherrapunji is spectacular year-round. For roaring waterfalls and dramatic misty canyon clouds, the monsoon season from June to September is magical. For trekking down to the Double Decker Living Root Bridge and clear sunny skies, October to April is ideal.",
    order: 1,
  },
  {
    id: "faq-2",
    question: "How do I book hotels through CherraStays without commission?",
    answer:
      "When you submit an inquiry through our portal, your request connects directly with the resort management and our local desk in Sohra. There are no middleman surcharges, ensuring you get direct front-desk tariffs along with prompt WhatsApp verification.",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Are hotels in Cherrapunji safe for families and solo female travelers?",
    answer:
      "Yes, exceptionally so. Meghalaya is globally recognized for its matrilineal society, peaceful culture, and warm Khasi hospitality. All hotels in our collection are verified physical properties adhering to strict safety and hygiene benchmarks.",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Can hotels arrange airport transfers from Guwahati or Shillong?",
    answer:
      "Yes. Our partner resorts and boutique stays coordinate reliable cab pickups and drop-offs from Guwahati Airport (GAU) and Shillong Airport (SHL) with verified local drivers.",
    order: 4,
  },
  {
    id: "faq-5",
    question: "Do hotels in Cherrapunji provide 24/7 hot water geysers?",
    answer:
      "Yes. Because Cherrapunji remains crisp and misty throughout the year, every stay in our curated portfolio is equipped with reliable hot water geysers in private bathrooms.",
    order: 5,
  },
];

export const INITIAL_STATS: SiteStats = {
  verifiedStays: "10+",
  satisfactionRate: "4.8 / 5.0",
  tariffPledge: "100%",
  avgResponseTime: "20 Min",
};

export const INITIAL_REVIEWS: HotelReview[] = [
  {
    id: "rev-1",
    hotelId: "polo-orchid-resort",
    userId: "user-1",
    userName: "Aditi Sharma",
    userEmail: "aditi@gmail.com",
    rating: 5,
    title: "Unmatched sunrise view over Nohsngithiang Falls",
    comment:
      "Waking up to the clouds rising from the Bangladesh plains was surreal. The log cabin was warm with 24/7 hot water, and the bonfire dinner was exceptional.",
    stayMonth: "October 2024",
    createdAt: "Nov 2, 2024",
    verified: true,
  },
  {
    id: "rev-2",
    hotelId: "cherrapunjee-holiday-resort",
    userId: "user-2",
    userName: "Rahul Sengupta",
    userEmail: "rahul@outlook.com",
    rating: 5,
    title: "The true authentic Khasi homestay experience",
    comment:
      "Denis and his family treated us like personal guests. Best guidance for the Living Root Bridge trek, and homecooked local meals were pure comfort.",
    stayMonth: "December 2024",
    createdAt: "Dec 18, 2024",
    verified: true,
  },
  {
    id: "rev-3",
    hotelId: "saimika-park-resort",
    userId: "user-3",
    userName: "Vikram Mehta",
    userEmail: "vikram@yahoo.com",
    rating: 4,
    title: "Serene stream & stone cottages in nature",
    comment:
      "Very rustic and peaceful. Listening to local Khasi musicians around the campfire was memorable.",
    stayMonth: "January 2025",
    createdAt: "Jan 12, 2025",
    verified: true,
  },
];

