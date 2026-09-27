/**
 * Cherrapunji Geographic Road Graph & Dijkstra's Shortest Path Algorithm
 * Calculates real-world mountain road distances and drive times between
 * key sightseeing landmarks and hotels verified on the platform.
 */

import { Hotel } from "./types";

export interface Landmark {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

export const CHERRAPUNJI_LANDMARKS: Landmark[] = [
  {
    id: "nohkalikai-falls",
    name: "Nohkalikai Falls",
    category: "Waterfall",
    lat: 25.2756,
    lng: 91.6849,
  },
  {
    id: "double-decker-bridge",
    name: "Double Decker Living Root Bridge",
    category: "Living Root Bridge",
    lat: 25.2505,
    lng: 91.668,
  },
  {
    id: "seven-sisters-falls",
    name: "Seven Sisters Falls",
    category: "Waterfall",
    lat: 25.2633,
    lng: 91.7302,
  },
  {
    id: "wei-sawdong-falls",
    name: "Wei Sawdong Three-Tier Falls",
    category: "Waterfall",
    lat: 25.3021,
    lng: 91.6784,
  },
  {
    id: "mawsmai-cave",
    name: "Mawsmai Limestone Cave",
    category: "Caves",
    lat: 25.2444,
    lng: 91.7247,
  },
];

// Weighted Road Network of Cherrapunji (Vertices & Road Distances in Km)
interface Edge {
  to: string;
  km: number;
}

const ROAD_GRAPH: Record<string, Edge[]> = {
  // Landmarks
  "nohkalikai-falls": [{ to: "nohkalikai-ridge-junction", km: 3.5 }],
  "double-decker-bridge": [{ to: "tyrna-trailhead", km: 3.0 }],
  "seven-sisters-falls": [
    { to: "mawsmai-fork", km: 1.4 },
    { to: "polo-orchid-resort", km: 0.6 },
  ],
  "wei-sawdong-falls": [{ to: "wei-sawdong-access", km: 2.0 }],
  "mawsmai-cave": [{ to: "mawsmai-fork", km: 0.8 }],

  // Road Junctions
  "nohkalikai-ridge-junction": [
    { to: "nohkalikai-falls", km: 3.5 },
    { to: "sohra-central-market", km: 4.0 },
  ],
  "sohra-central-market": [
    { to: "nohkalikai-ridge-junction", km: 4.0 },
    { to: "sohra-plaza", km: 0.3 },
    { to: "pioneer-homestay", km: 0.6 },
    { to: "saitsohpen-junction", km: 2.0 },
    { to: "mawsmai-fork", km: 3.8 },
    { to: "wei-sawdong-access", km: 12.0 },
  ],
  "saitsohpen-junction": [
    { to: "sohra-central-market", km: 2.0 },
    { to: "jiva-resort", km: 0.4 },
    { to: "tyrna-trailhead", km: 15.0 },
  ],
  "mawsmai-fork": [
    { to: "sohra-central-market", km: 3.8 },
    { to: "mawsmai-cave", km: 0.8 },
    { to: "seven-sisters-falls", km: 1.4 },
    { to: "polo-orchid-resort", km: 1.2 },
    { to: "kutmadan-resort", km: 2.1 },
  ],
  "tyrna-trailhead": [
    { to: "double-decker-bridge", km: 3.0 },
    { to: "saitsohpen-junction", km: 15.0 },
    { to: "cherrapunjee-holiday-resort", km: 2.5 },
  ],
  "wei-sawdong-access": [
    { to: "wei-sawdong-falls", km: 2.0 },
    { to: "sohra-central-market", km: 12.0 },
  ],

  // Hotels in Graph
  "polo-orchid-resort": [
    { to: "seven-sisters-falls", km: 0.6 },
    { to: "mawsmai-fork", km: 1.2 },
  ],
  "jiva-resort": [{ to: "saitsohpen-junction", km: 0.4 }],
  "cherrapunjee-holiday-resort": [{ to: "tyrna-trailhead", km: 2.5 }],
  "kutmadan-resort": [{ to: "mawsmai-fork", km: 2.1 }],
  "sohra-plaza": [{ to: "sohra-central-market", km: 0.3 }],
  "pioneer-homestay": [{ to: "sohra-central-market", km: 0.6 }],
};

/**
 * Standard Haversine Geodesic Distance Formula (Fallback for Uncharted GPS Points)
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Computes shortest road distance from source node to all reachable nodes in Cherrapunji.
 */
export function dijkstra(source: string): Record<string, number> {
  const distances: Record<string, number> = {};
  const visited: Set<string> = new Set();
  const queue: { node: string; dist: number }[] = [];

  // Initialize
  distances[source] = 0;
  queue.push({ node: source, dist: 0 });

  while (queue.length > 0) {
    // Pop minimum distance node
    queue.sort((a, b) => a.dist - b.dist);
    const { node, dist } = queue.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = ROAD_GRAPH[node] || [];
    for (const edge of neighbors) {
      const newDist = dist + edge.km;
      if (distances[edge.to] === undefined || newDist < distances[edge.to]) {
        distances[edge.to] = Number(newDist.toFixed(1));
        queue.push({ node: edge.to, dist: newDist });
      }
    }
  }

  return distances;
}

export interface HotelProximityResult {
  hotel: Hotel;
  distanceKm: number;
  driveTimeMins: number;
  landmarkName: string;
}

/**
 * Rank and filter available website hotels by proximity to a landmark using Dijkstra's Algorithm
 */
export function getHotelsNearLandmark(
  landmarkId: string,
  hotels: Hotel[]
): HotelProximityResult[] {
  const landmark = CHERRAPUNJI_LANDMARKS.find((l) => l.id === landmarkId);
  if (!landmark) return [];

  // Run Dijkstra from the landmark
  const roadDistances = dijkstra(landmarkId);

  const results: HotelProximityResult[] = hotels.map((hotel) => {
    let distanceKm = roadDistances[hotel.id];

    // If hotel is not explicitly connected in road graph, compute via nearest junction
    if (distanceKm === undefined) {
      if (hotel.coordinates) {
        // Fallback to Haversine with a 1.35x winding mountain road coefficient
        const straightLine = haversineDistanceKm(
          landmark.lat,
          landmark.lng,
          hotel.coordinates.lat,
          hotel.coordinates.lng
        );
        distanceKm = Number((straightLine * 1.35).toFixed(1));
      } else {
        distanceKm = 10.0;
      }
    }

    // Mountain road driving speed: ~30-35 km/h average in Sohra ghats
    const driveTimeMins = Math.max(3, Math.round((distanceKm / 32) * 60));

    return {
      hotel,
      distanceKm,
      driveTimeMins,
      landmarkName: landmark.name,
    };
  });

  // Sort shortest distance first (closest hotel first)
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}
