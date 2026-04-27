/**
 * Geographic coordinates for every city in `data/cities.json`.
 * Keyed by `id` (== `${citySlug}-${countryCode}`) — falls back to `citySlug` for safety.
 *
 * Used by `components/home/WorldMap.tsx` to plot pins on the world map.
 *
 * Coordinates are city-center / iconic-area approximations — accurate enough
 * for a zoomable world map but not intended for navigation.
 */

export interface CityCoords {
  lat: number;
  lng: number;
}

export const CITY_COORDINATES: Record<string, CityCoords> = {
  // ── Spain
  "valencia":     { lat: 39.4699, lng: -0.3763 },
  "barcelona":    { lat: 41.3851, lng: 2.1734 },
  "madrid":       { lat: 40.4168, lng: -3.7038 },
  "malaga":       { lat: 36.7213, lng: -4.4214 },
  "alicante":     { lat: 38.3452, lng: -0.4810 },

  // ── Portugal
  "lisbon":       { lat: 38.7223, lng: -9.1393 },
  "porto":        { lat: 41.1579, lng: -8.6291 },
  "cascais":      { lat: 38.6979, lng: -9.4215 },

  // ── UAE
  "dubai":        { lat: 25.2048, lng: 55.2708 },
  "abu-dhabi":    { lat: 24.4539, lng: 54.3773 },

  // ── Thailand
  "chiang-mai":   { lat: 18.7883, lng: 98.9853 },
  "koh-phangan":  { lat: 9.7303,  lng: 100.0136 },
  "koh-samui":    { lat: 9.5018,  lng: 99.9648 },
  "bangkok":      { lat: 13.7563, lng: 100.5018 },
  "phuket":       { lat: 7.8804,  lng: 98.3923 },

  // ── Germany
  "berlin":       { lat: 52.5200, lng: 13.4050 },
  "munich":       { lat: 48.1351, lng: 11.5820 },

  // ── Netherlands
  "amsterdam":    { lat: 52.3676, lng: 4.9041 },

  // ── Czech Republic
  "prague":       { lat: 50.0755, lng: 14.4378 },

  // ── Hungary
  "budapest":     { lat: 47.4979, lng: 19.0402 },

  // ── Greece
  "athens":       { lat: 37.9838, lng: 23.7275 },
  "thessaloniki": { lat: 40.6401, lng: 22.9444 },

  // ── Australia
  "sydney":       { lat: -33.8688, lng: 151.2093 },
  "melbourne":    { lat: -37.8136, lng: 144.9631 },
  "brisbane":     { lat: -27.4698, lng: 153.0251 },

  // ── Israel
  "tel-aviv":     { lat: 32.0853, lng: 34.7818 },
  "eilat":        { lat: 29.5577, lng: 34.9519 },
  "jerusalem":    { lat: 31.7683, lng: 35.2137 },

  // ── New Zealand
  "auckland":     { lat: -36.8485, lng: 174.7633 },
  "wellington":   { lat: -41.2865, lng: 174.7762 },

  // ── Italy
  "milan":        { lat: 45.4642, lng: 9.1900 },
  "florence":     { lat: 43.7696, lng: 11.2558 },
  "rome":         { lat: 41.9028, lng: 12.4964 },

  // ── France
  "paris":        { lat: 48.8566, lng: 2.3522 },
  "nice":         { lat: 43.7102, lng: 7.2620 },

  // ── Poland
  "warsaw":       { lat: 52.2297, lng: 21.0122 },
  "krakow":       { lat: 50.0647, lng: 19.9450 },

  // ── USA
  "new-york-city": { lat: 40.7128, lng: -74.0060 },
  "miami":         { lat: 25.7617, lng: -80.1918 },
  "dallas":        { lat: 32.7767, lng: -96.7970 },
  "los-angeles":   { lat: 34.0522, lng: -118.2437 },
  "san-francisco": { lat: 37.7749, lng: -122.4194 },
  "chicago":       { lat: 41.8781, lng: -87.6298 },
  "seattle":       { lat: 47.6062, lng: -122.3321 },
  "austin":        { lat: 30.2672, lng: -97.7431 },

  // ── Costa Rica
  "san-jose":      { lat: 9.9281,  lng: -84.0907 },
  "tamarindo":     { lat: 10.2999, lng: -85.8408 },
  "heredia":       { lat: 9.9981,  lng: -84.1170 },
  "atenas":        { lat: 9.9772,  lng: -84.3854 },
  "puerto-viejo":  { lat: 9.6539,  lng: -82.7546 },
  "santa-teresa":  { lat: 9.6432,  lng: -85.1672 },

  // ── Canada
  "vancouver":    { lat: 49.2827, lng: -123.1207 },
  "toronto":      { lat: 43.6532, lng: -79.3832 },

  // ── United Kingdom
  "london":       { lat: 51.5074, lng: -0.1278 },

  // ── Ireland
  "dublin":       { lat: 53.3498, lng: -6.2603 },

  // ── Austria
  "vienna":       { lat: 48.2082, lng: 16.3738 },

  // ── Denmark
  "copenhagen":   { lat: 55.6761, lng: 12.5683 },

  // ── Switzerland
  "zurich":       { lat: 47.3769, lng: 8.5417 },

  // ── Singapore
  "singapore":    { lat: 1.3521,  lng: 103.8198 },

  // ── Japan
  "tokyo":        { lat: 35.6762, lng: 139.6503 },

  // ── Taiwan
  "taipei":       { lat: 25.0330, lng: 121.5654 },

  // ── Malaysia
  "kuala-lumpur": { lat: 3.1390,  lng: 101.6869 },

  // ── Indonesia
  "bali":         { lat: -8.4095, lng: 115.1889 },
  "ubud":         { lat: -8.5069, lng: 115.2625 },

  // ── Colombia
  "medellin":     { lat: 6.2442,  lng: -75.5812 },

  // ── Argentina
  "buenos-aires": { lat: -34.6037, lng: -58.3816 },

  // ── Peru
  "lima":         { lat: -12.0464, lng: -77.0428 },
};
