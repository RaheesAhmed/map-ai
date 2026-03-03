import { Location, LocationCombo, ComboResult } from "@/lib/types";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findBestCombos(
  locationsA: Location[],
  locationsB: Location[],
  limit: number = 100,
): LocationCombo[] {
  if (!locationsA.length || !locationsB.length) return [];

  const combos: LocationCombo[] = [];

  for (const locA of locationsA) {
    for (const locB of locationsB) {
      if (locA.id === locB.id) continue;

      const distance = haversineDistance(locA.lat, locA.lon, locB.lat, locB.lon);
      combos.push({ locationA: locA, locationB: locB, distance });
    }
  }

  combos.sort((a, b) => a.distance - b.distance);
  return combos.slice(0, limit);
}

export function processComboSearch(
  locationsA: Location[],
  locationsB: Location[],
  limit: number = 100,
): ComboResult {
  const combos = findBestCombos(locationsA, locationsB, limit);
  return { combos, total: combos.length };
}
