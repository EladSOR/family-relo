"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Destination } from "@/lib/types";
import { CITY_COORDINATES } from "@/lib/cityCoordinates";
import { parseMonthlyCost, formatCostShort } from "@/lib/cityCost";

interface Props {
  cities: Destination[];
  /**
   * Whether scroll-wheel zoom is enabled on desktop.
   * `false` is recommended for inline embeds so the map doesn't hijack page
   * scroll. Mobile pinch-zoom and drag-to-pan stay enabled either way.
   */
  scrollWheelZoom?: boolean;
  /**
   * Cap on the initial `fitBounds` zoom level. Lower = more of the world is
   * visible on first paint. Use ~3 for inline cubes on narrow screens, ~4
   * for the fullscreen overlay where there's room to breathe.
   */
  fitBoundsMaxZoom?: number;
  /**
   * Show Leaflet's built-in zoom controls (+ / −). Off by default for the
   * inline cube to keep it visually clean; on for the fullscreen overlay.
   */
  zoomControl?: boolean;
}

/**
 * Leaflet-powered world map of every city in `data/cities.json`.
 *
 * Behaviour:
 *  - Each city renders as a custom HTML "price pill" pin showing the midpoint
 *    of the all-in monthly family budget (e.g. `$4k`).
 *  - Clicking a pin opens a popup with the full cost range, the city/country,
 *    and a CTA that navigates to the city's relocation guide.
 *
 * Coordinates come from `lib/cityCoordinates.ts`; cost figures come straight
 * from each city's `cost.monthlyFamilyAllIn` so the map always matches the
 * value shown on the city page. Lazy-loaded by the toggle component via
 * `next/dynamic` so Leaflet's JS + CSS only ship to clients who open the map.
 */
export default function WorldMap({
  cities,
  scrollWheelZoom = true,
  fitBoundsMaxZoom = 4,
  zoomControl = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      worldCopyJump: true,
      zoomControl,
      scrollWheelZoom,
      attributionControl: true,
      // minZoom: 1 lets narrow viewports (mobile) zoom out far enough to see
      // every continent. Leaflet auto-clamps minZoom upward when the
      // container is smaller than 2 tiles wide; setting it to 1 explicitly
      // ensures phones still get a true world view.
      minZoom: 1,
      maxZoom: 18,
    }).setView([20, 10], 1);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 1,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds: [number, number][] = [];

    for (const city of cities) {
      const coords = CITY_COORDINATES[city.citySlug];
      if (!coords) continue;

      const parsed = parseMonthlyCost(city.cost?.monthlyFamilyAllIn ?? "");
      const label = parsed ? formatCostShort(parsed.mid) : "$—";

      const icon = L.divIcon({
        className: "famirelo-price-pin",
        html: `<button type="button" aria-label="${escapeHtml(
          city.city,
        )} — ${escapeHtml(
          city.cost?.monthlyFamilyAllIn ?? "",
        )}">${escapeHtml(label)}</button>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(map);
      marker.bindPopup(buildPopupHtml(city, parsed?.min, parsed?.max), {
        maxWidth: 260,
        className: "famirelo-popup",
        closeButton: true,
      });

      bounds.push([coords.lat, coords.lng]);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: fitBoundsMaxZoom });
    }

    // Tile layout settles after the parent overlay finishes its open transition.
    const timer = window.setTimeout(() => map.invalidateSize(), 200);

    return () => {
      window.clearTimeout(timer);
      map.remove();
    };
  }, [cities, scrollWheelZoom, fitBoundsMaxZoom, zoomControl]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="World map of all relocation destinations"
      className="h-full w-full"
    />
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build the popup HTML for a marker. Plain HTML — Leaflet doesn't render
 * React. The CTA uses a regular `<a>` so the user navigates to the city page
 * the same way they would from any other link on the site.
 */
function buildPopupHtml(
  city: Destination,
  min: number | undefined,
  max: number | undefined,
): string {
  const href = `/${city.countrySlug}/${city.citySlug}`;
  const costRange =
    min && max && min !== max
      ? `$${formatNumber(min)} – $${formatNumber(max)} / month`
      : min
        ? `$${formatNumber(min)} / month`
        : (city.cost?.monthlyFamilyAllIn ?? "—");

  return `
    <p class="famirelo-popup-city">${escapeHtml(city.city)}</p>
    <p class="famirelo-popup-country">${escapeHtml(city.country)}</p>
    <div>
      <div class="famirelo-popup-cost-label">All-in / month · family of 4</div>
      <div class="famirelo-popup-cost-value">${escapeHtml(costRange)}</div>
    </div>
    <a class="famirelo-popup-cta" href="${escapeHtml(href)}">Open guide →</a>
  `;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
