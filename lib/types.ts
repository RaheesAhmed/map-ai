export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  type: string;
}

export interface LocationCombo {
  locationA: Location;
  locationB: Location;
  distance: number;
}

export interface SearchResult {
  locations: Location[];
  total: number;
  category: string;
}

export interface ComboResult {
  combos: LocationCombo[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  osmTag: string;
  icon: string;
}

export const PRESET_CATEGORIES: Category[] = [
  { id: "bank", name: "Bank", osmTag: "amenity=bank", icon: "landmark" },
  { id: "supermarket", name: "Supermarket", osmTag: "shop=supermarket", icon: "shopping-cart" },
  { id: "metro", name: "Metro Station", osmTag: "railway=station", icon: "train-front" },
  { id: "mall", name: "Shopping Mall", osmTag: "shop=mall", icon: "store" },
  { id: "cafe", name: "Cafe", osmTag: "amenity=cafe", icon: "coffee" },
  { id: "park", name: "Park", osmTag: "leisure=park", icon: "trees" },
  { id: "restaurant", name: "Restaurant", osmTag: "amenity=restaurant", icon: "utensils" },
  { id: "hospital", name: "Hospital", osmTag: "amenity=hospital", icon: "hospital" },
  { id: "school", name: "School", osmTag: "amenity=school", icon: "graduation-cap" },
  { id: "gym", name: "Gym", osmTag: "leisure=fitness_centre", icon: "dumbbell" },
  { id: "pharmacy", name: "Pharmacy", osmTag: "amenity=pharmacy", icon: "pill" },
  { id: "atm", name: "ATM", osmTag: "amenity=atm", icon: "banknote" },
  { id: "fuel", name: "Fuel Station", osmTag: "amenity=fuel", icon: "fuel" },
  { id: "mosque", name: "Mosque", osmTag: "amenity=place_of_worship", icon: "moon" },
  { id: "library", name: "Library", osmTag: "amenity=library", icon: "book-open" },
];

export interface PresetCombo {
  label: string;
  icon: string;
  categoryA: string;
  categoryB: string;
}

export const QUICK_PRESETS: PresetCombo[] = [
  { label: "Bank + Supermarket", icon: "🏦", categoryA: "bank", categoryB: "supermarket" },
  { label: "Metro + Mall", icon: "🚇", categoryA: "metro", categoryB: "mall" },
  { label: "Cafe + Park", icon: "☕", categoryA: "cafe", categoryB: "park" },
  { label: "Hospital + Pharmacy", icon: "🏥", categoryA: "hospital", categoryB: "pharmacy" },
  { label: "School + Library", icon: "🎓", categoryA: "school", categoryB: "library" },
  { label: "Gym + Restaurant", icon: "💪", categoryA: "gym", categoryB: "restaurant" },
];
