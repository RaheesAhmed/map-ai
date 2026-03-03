import { Location, SearchResult, PRESET_CATEGORIES } from "@/lib/types";

const OVERPASS_API_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
let currentApiIndex = 0;

function getOverpassUrl(): string {
  return OVERPASS_API_URLS[currentApiIndex] ?? OVERPASS_API_URLS[0];
}

function switchToFallbackApi(): boolean {
  if (currentApiIndex < OVERPASS_API_URLS.length - 1) {
    currentApiIndex++;
    console.log(`[Overpass] Switched to fallback API: ${getOverpassUrl()}`);
    return true;
  }
  return false;
}

const CATEGORY_TAG_MAP: Record<string, string> = {};
for (const cat of PRESET_CATEGORIES) {
  CATEGORY_TAG_MAP[cat.id] = cat.osmTag;
}

interface OverpassResponse {
  elements: OsmElement[];
}

interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function parseElement(element: OsmElement, category: string): Location {
  const tags = element.tags ?? {};
  const name = tags.name || tags["name:en"] || `Unnamed ${category}`;
  const id = `${element.type}:${element.id}`;

  let lat = 0;
  let lon = 0;

  if (element.type === "node" && element.lat !== undefined && element.lon !== undefined) {
    lat = element.lat;
    lon = element.lon;
  } else if (element.center) {
    lat = element.center.lat;
    lon = element.center.lon;
  }

  return { id, name, lat, lon, category, type: element.type };
}

function buildOverpassQuery(osmTag: string, centerLat?: number, centerLon?: number, radius?: number, limit: number = 500): string {
  const [key, value] = osmTag.split("=");

  if (centerLat !== undefined && centerLon !== undefined && radius !== undefined) {
    // Overpass (around:radius,lat,lon) is native and incredibly fast!
    return `[out:json][timeout:25];(node["${key}"="${value}"](around:${radius},${centerLat},${centerLon});way["${key}"="${value}"](around:${radius},${centerLat},${centerLon});relation["${key}"="${value}"](around:${radius},${centerLat},${centerLon}););out center ${limit};`;
  }

  return `[out:json][timeout:25];(node["${key}"="${value}"];way["${key}"="${value}"];relation["${key}"="${value}"];);out center ${limit};`;
}

export async function searchByCategory(
  category: string,
  centerLat?: number,
  centerLon?: number,
  radius?: number,
  limit: number = 500,
): Promise<SearchResult> {
  const osmTag = CATEGORY_TAG_MAP[category];
  if (!osmTag) {
    throw new Error(`Invalid category: ${category}. Valid: ${Object.keys(CATEGORY_TAG_MAP).join(", ")}`);
  }

  const query = buildOverpassQuery(osmTag, centerLat, centerLon, radius, limit);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(getOverpassUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429 && switchToFallbackApi()) {
        return searchByCategory(category, centerLat, centerLon, radius, limit);
      }
      const errorText = await response.text();
      throw new Error(`Overpass API error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as OverpassResponse;

    if (!data.elements || data.elements.length === 0) {
      return { locations: [], total: 0, category };
    }

    const locations: Location[] = data.elements
      .slice(0, limit)
      .map((el) => parseElement(el, category));

    return { locations, total: locations.length, category };
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Overpass API request timed out. Try a smaller search area.");
    }
    throw error;
  }
}
