export interface Room {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  capacity: string;
  beds: string;
  sizeSqFt?: number;
  features: string[];
  image?: string;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  pricePerNight: number;
  originalPrice: number;
  area: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  featured: boolean;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  rooms: Room[];
  description: string;
  highlights: string[];
  checkInTime: string;
  checkOutTime: string;
  distanceToCenter?: string;
  phone?: string;
  email?: string;
  status?: "active" | "inactive";
}

export interface FollowUpNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface InquiryLead {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelId: string;
  hotelName: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  specialRequests?: string;
  status: "new" | "contacted" | "quote_sent" | "converted" | "cancelled";
  budget?: number;
  notes?: FollowUpNote[];
  createdAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  khasiName?: string;
  category: "Waterfall" | "Caves" | "Living Root Bridge" | "Canyon / Viewpoint" | string;
  description: string;
  distanceFromSohra: string;
  image: string;
  rating: number;
  bestTime: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export interface SiteStats {
  verifiedStays: string;
  satisfactionRate: string;
  tariffPledge: string;
  avgResponseTime: string;
}

export interface HotelReview {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  stayMonth?: string;
  createdAt: string;
  verified: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
