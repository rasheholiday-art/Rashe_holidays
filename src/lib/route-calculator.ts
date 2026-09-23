import { distanceFromOoty, locationCoordinates, estimateDistance } from "@/data/site";

export interface RouteCalculationResult {
  km: number;
  source: "local" | "osrm";
  fromName: string;
  toName: string;
}

const CACHE_KEY = "nilgiri_route_distance_cache_v1";
const memoryCache = new Map<string, number>();

// Load localStorage cache safely on client
function getStoredCache(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function setStoredCache(key: string, km: number): void {
  memoryCache.set(key, km);
  if (typeof window === "undefined") return;
  try {
    const cache = getStoredCache();
    cache[key] = km;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

function getCacheKey(from: string, to: string): string {
  return `${from.trim().toLowerCase()}_to_${to.trim().toLowerCase()}`;
}

// Find coordinate for a place name
async function resolveCoordinates(place: string): Promise<[number, number] | null> {
  const clean = place.trim();
  const lower = clean.toLowerCase();

  // Check hardcoded coordinate registry
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (key.toLowerCase() === lower) {
      return coords;
    }
  }

  // Common aliases
  if (lower.includes("ooty") || lower.includes("udhagamandalam"))
    return locationCoordinates["Ooty"] ?? null;
  if (lower.includes("coonoor")) return locationCoordinates["Coonoor"] ?? null;
  if (lower.includes("kotagiri")) return locationCoordinates["Kotagiri"] ?? null;
  if (lower.includes("mysore") || lower.includes("mysuru"))
    return locationCoordinates["Mysore"] ?? null;
  if (lower.includes("bangalore") || lower.includes("bengaluru"))
    return locationCoordinates["Bangalore"] ?? null;
  if (lower.includes("coimbatore")) return locationCoordinates["Coimbatore"] ?? null;

  // Query Nominatim OpenStreetMap Geocoder (biasing South India)
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      clean + ", India",
    )}&viewbox=73.5,8.0,81.5,16.5&bounded=0&countrycodes=in&limit=1`;

    const res = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lon: string; lat: string }>;
    if (data.length > 0 && data[0]?.lon && data[0]?.lat) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
  } catch (err) {
    console.warn("Geocoding lookup failed for:", clean, err);
  }

  return null;
}

/**
 * Calculates road driving distance between any two locations.
 * 1. Checks local verified database first (instant 0ms)
 * 2. Checks client-side cache (instant 0ms)
 * 3. Uses OpenStreetMap Nominatim + OSRM Road Driving Engine (live driving km)
 * 4. Falls back to null if unreachable / offline
 */
export async function calculateRouteDistance(
  from: string,
  to: string,
): Promise<RouteCalculationResult | null> {
  const cleanFrom = from.trim();
  const cleanTo = to.trim();

  if (!cleanFrom || !cleanTo) return null;

  if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
    return {
      km: 80, // Local sightseeing day package
      source: "local",
      fromName: cleanFrom,
      toName: cleanTo,
    };
  }

  // 1. Try local verified database
  const localKm = estimateDistance(cleanFrom, cleanTo);
  if (localKm !== null) {
    return {
      km: localKm,
      source: "local",
      fromName: cleanFrom,
      toName: cleanTo,
    };
  }

  // Check fuzzy aliases against distanceFromOoty
  const isFromOoty = cleanFrom.toLowerCase() === "ooty";
  const isToOoty = cleanTo.toLowerCase() === "ooty";
  const targetPlace = isFromOoty ? cleanTo : isToOoty ? cleanFrom : null;

  if (targetPlace) {
    const lowerTarget = targetPlace.toLowerCase();
    for (const [key, km] of Object.entries(distanceFromOoty)) {
      if (key.toLowerCase().includes(lowerTarget) || lowerTarget.includes(key.toLowerCase())) {
        return {
          km,
          source: "local",
          fromName: cleanFrom,
          toName: cleanTo,
        };
      }
    }
  }

  // 2. Check memory and persistent cache
  const cacheKey = getCacheKey(cleanFrom, cleanTo);
  if (memoryCache.has(cacheKey)) {
    return {
      km: memoryCache.get(cacheKey)!,
      source: "osrm",
      fromName: cleanFrom,
      toName: cleanTo,
    };
  }

  const stored = getStoredCache();
  if (stored[cacheKey]) {
    memoryCache.set(cacheKey, stored[cacheKey]);
    return {
      km: stored[cacheKey],
      source: "osrm",
      fromName: cleanFrom,
      toName: cleanTo,
    };
  }

  // 3. Resolve Coordinates & Call OSRM
  try {
    const [fromCoords, toCoords] = await Promise.all([
      resolveCoordinates(cleanFrom),
      resolveCoordinates(cleanTo),
    ]);

    if (!fromCoords || !toCoords) return null;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?overview=false`;

    const response = await fetch(osrmUrl);
    if (!response.ok) return null;

    const result = (await response.json()) as {
      code: string;
      routes?: Array<{ distance: number }>;
    };

    if (result.code === "Ok" && result.routes && result.routes[0]?.distance) {
      // Distance in meters to km
      const distanceKm = Math.round(result.routes[0].distance / 1000);
      setStoredCache(cacheKey, distanceKm);
      return {
        km: distanceKm,
        source: "osrm",
        fromName: cleanFrom,
        toName: cleanTo,
      };
    }
  } catch (err) {
    console.warn("OSRM calculation failed:", err);
  }

  return null;
}
