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
  category: "Waterfall" | "Caves" | "Living Root Bridge" | "Canyon / Viewpoint";
  description: string;
  distanceFromSohra: string;
  image: string;
  rating: number;
  bestTime: string;
}
